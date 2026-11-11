import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));

class Bus {
  listeners = new Map();
  addEventListener(type, callback, options) {
    const entries = this.listeners.get(type) ?? [];
    entries.push({ callback, once: options?.once });
    this.listeners.set(type, entries);
  }
  removeEventListener(type, callback) {
    this.listeners.set(type, (this.listeners.get(type) ?? []).filter((entry) => entry.callback !== callback));
  }
  dispatchEvent(event) {
    for (const entry of [...(this.listeners.get(event.type) ?? [])]) {
      if (entry.once) this.removeEventListener(event.type, entry.callback);
      entry.callback(event);
    }
  }
  count(type) { return (this.listeners.get(type) ?? []).length; }
}

class Clock {
  now = 0;
  sequence = 0;
  timers = new Map();
  setTimeout = (callback, delay = 0) => {
    const id = ++this.sequence;
    this.timers.set(id, { at: this.now + delay, callback });
    return id;
  };
  clearTimeout = (id) => { this.timers.delete(id); };
  advance(ms) {
    const end = this.now + ms;
    for (;;) {
      const next = [...this.timers].filter(([, entry]) => entry.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      this.now = next[1].at;
      this.timers.delete(next[0]);
      next[1].callback();
    }
    this.now = end;
  }
}

/** Load the actual TypeScript modules without Next.js or a browser. */
const sourceLoader = (globals) => {
  const cache = new Map();
  const context = vm.createContext(globals);
  const load = (name) => {
    let filename = path.resolve(root, name);
    if (!existsSync(filename) || !statSync(filename).isFile()) {
      filename = existsSync(`${filename}.ts`) ? `${filename}.ts` : path.join(filename, "index.ts");
    }
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const output = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    const require = (specifier) => {
      if (specifier.startsWith("@/")) return load(`src/${specifier.slice(2)}`);
      if (specifier.startsWith(".")) return load(path.resolve(path.dirname(filename), specifier));
      throw new Error(`Unexpected dependency: ${specifier}`);
    };
    vm.runInContext(`(function(module,exports,require){${output}\n})`, context, { filename })(module, module.exports, require);
    return module.exports;
  };
  return { load, run: (script) => vm.runInContext(script, context) };
};

const environment = ({ pathname = "/", reduced = false, hidden = false, loading = false, images = [], fonts = Promise.resolve() } = {}) => {
  const clock = new Clock();
  const window = new Bus();
  const document = new Bus();
  const attributes = new Map();
  document.documentElement = {
    hasAttribute: (name) => attributes.has(name),
    setAttribute: (name, value) => attributes.set(name, value),
  };
  document.hidden = hidden;
  document.readyState = loading ? "loading" : "complete";
  document.fonts = { ready: fonts };
  document.querySelectorAll = () => images;
  Object.assign(window, {
    performance: { now: () => clock.now },
    matchMedia: () => ({ matches: reduced }),
    requestAnimationFrame: (callback) => clock.setTimeout(() => callback(clock.now), 16),
    cancelAnimationFrame: clock.clearTimeout,
    innerWidth: 1440,
    innerHeight: 900,
  });
  const modules = sourceLoader({
    window, document, AbortController,
    Event: class Event { constructor(type) { this.type = type; } },
    location: { pathname },
    sessionStorage: { getItem() { throw new Error("Splash must not depend on session history"); } },
    setTimeout: clock.setTimeout,
    clearTimeout: clock.clearTimeout,
  });
  const { SPLASH_DOM: dom, SPLASH_TIMING: timing } = modules.load("src/components/layout/splash/constants");
  const events = modules.load("src/components/layout/splash/events");
  let dismissals = 0;
  window.addEventListener(events.SPLASH_DISMISS_EVENT, () => { dismissals++; });
  return {
    clock, document, window, attributes, dom, timing, modules,
    get state() { return attributes.get("data-splash"); },
    get dismissals() { return dismissals; },
    boot() { modules.run(modules.load("src/components/layout/splash/splashBoot").SPLASH_BOOT_SCRIPT); },
    paint() {
      window.dispatchEvent({ type: "animationstart", animationName: dom.enterAnimation, target: { classList: { contains: (value) => value === dom.wordClass } } });
    },
    ready() { window.dispatchEvent({ type: events.SPLASH_READY_EVENT }); },
    visibility(value) { document.hidden = value; document.dispatchEvent({ type: "visibilitychange" }); },
    endExit() { window.dispatchEvent({ type: "animationend", animationName: dom.exitAnimation, target: { id: dom.rootId } }); },
  };
};

test("ready pages still remain covered for two visible seconds", () => {
  const env = environment();
  env.boot(); env.paint(); env.ready();
  env.clock.advance(1999);
  assert.equal(env.state, "play");
  assert.equal(env.dismissals, 0);
  env.clock.advance(1);
  assert.equal(env.state, "exiting");
  assert.equal(env.dismissals, 1);
  env.endExit();
  assert.equal(env.state, "done");
});

test("rendering beyond two seconds holds the splash until ready", () => {
  const env = environment();
  env.boot(); env.paint(); env.clock.advance(5000);
  assert.equal(env.state, "play");
  env.ready();
  assert.equal(env.state, "exiting");
});

test("time spent parsing before the splash appears does not count", () => {
  const env = environment({ loading: true });
  env.boot(); env.ready(); env.clock.advance(3000);
  assert.equal(env.state, "play");
  env.paint(); env.clock.advance(1999);
  assert.equal(env.state, "play");
  env.clock.advance(1);
  assert.equal(env.state, "exiting");
});

test("hidden-tab time is excluded from the minimum", () => {
  const env = environment();
  env.boot(); env.paint(); env.ready(); env.clock.advance(800);
  env.visibility(true); env.clock.advance(10000);
  assert.equal(env.state, "play");
  env.visibility(false); env.clock.advance(1199);
  assert.equal(env.state, "play");
  env.clock.advance(1);
  assert.equal(env.state, "exiting");
});

test("duplicate boot and ready signals cannot restart the splash or dismiss twice", () => {
  const env = environment();
  env.boot(); env.paint(); env.ready(); env.clock.advance(1500);
  env.boot(); env.ready(); env.clock.advance(500);
  assert.equal(env.state, "exiting");
  env.ready(); env.clock.advance(env.timing.exitMs + 150);
  assert.equal(env.state, "done");
  assert.equal(env.dismissals, 1);
  assert.equal(env.clock.timers.size, 0);
  assert.equal(env.window.count("animationstart"), 0);
  assert.equal(env.document.count("visibilitychange"), 0);
});

test("missing readiness signals eventually release the page", () => {
  const env = environment();
  env.boot(); env.paint(); env.clock.advance(env.timing.failSafeMs - 1);
  assert.equal(env.state, "play");
  env.clock.advance(1);
  assert.equal(env.state, "exiting");
});

test("reduced motion uses the same ready gate and minimum without an exit animation", () => {
  const env = environment({ reduced: true });
  env.boot(); env.ready(); env.clock.advance(32 + 1999);
  assert.equal(env.state, "play");
  env.clock.advance(1);
  assert.equal(env.state, "done");
});

test("document entries are not skipped based on old session history", () => {
  for (const pathname of ["/", "/about", "/blog"]) {
    const env = environment({ pathname });
    env.boot();
    assert.equal(env.state, "play");
  }
});

test("the study room retains its own intro", () => {
  const env = environment({ pathname: "/test/mainpage" });
  env.boot();
  assert.equal(env.state, "skip");
  assert.equal(env.attributes.get("data-splash-done"), "1");
  assert.equal(env.clock.timers.size, 0);
});

const deferred = () => {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
};
const flush = async () => { for (let index = 0; index < 8; index++) await Promise.resolve(); };
const frames = async (env, count = 5) => {
  await flush();
  for (let index = 0; index < count; index++) { env.clock.advance(16); await flush(); }
};
const image = (top = 0) => Object.assign(new Bus(), {
  complete: false,
  naturalWidth: 0,
  getBoundingClientRect: () => ({ top, bottom: top + 100, left: 0, right: 200, width: 200, height: 100 }),
  decode: () => Promise.resolve(),
});
const waitForView = (env, signal = new AbortController().signal) =>
  env.modules.load("src/components/layout/splash/readiness").waitForInitialView(signal);

test("readiness waits for fonts, visible images, decoding and subsequent render frames", async () => {
  const fonts = deferred();
  const decoded = deferred();
  const visible = image();
  visible.decode = () => decoded.promise;
  const env = environment({ fonts: fonts.promise, images: [visible] });
  let finished = false;
  const ready = waitForView(env).then((value) => { finished = true; return value; });
  await frames(env);
  assert.equal(finished, false);
  assert.equal(visible.count("load"), 0);
  fonts.resolve(); await frames(env);
  assert.equal(visible.count("load"), 1);
  visible.complete = true; visible.naturalWidth = 200;
  visible.dispatchEvent({ type: "load" }); await frames(env);
  assert.equal(finished, false);
  decoded.resolve(); await frames(env);
  assert.equal(await ready, true);
  assert.equal(visible.count("error"), 0);
});

test("off-screen lazy images never hold up the first screen", async () => {
  const below = image(3000);
  const env = environment({ images: [below] });
  const ready = waitForView(env);
  await frames(env);
  assert.equal(await ready, true);
  assert.equal(below.count("load"), 0);
});

test("failed images settle readiness instead of leaving the loader stuck", async () => {
  const broken = image();
  const env = environment({ images: [broken] });
  const ready = waitForView(env);
  await frames(env);
  broken.dispatchEvent({ type: "error" });
  await frames(env);
  assert.equal(await ready, true);
});

test("cancelled readiness removes pending image listeners", async () => {
  const visible = image();
  const env = environment({ images: [visible] });
  const controller = new AbortController();
  const ready = waitForView(env, controller.signal);
  await frames(env);
  assert.equal(visible.count("load"), 1);
  controller.abort();
  assert.equal(await ready, false);
  assert.equal(visible.count("load"), 0);
  assert.equal(visible.count("error"), 0);
});

test("cancelled font waits and DOM parsing waits settle without reporting ready", async () => {
  for (const options of [{ fonts: deferred().promise }, { loading: true }]) {
    const env = environment(options);
    const controller = new AbortController();
    const ready = waitForView(env, controller.signal);
    await flush(); controller.abort();
    assert.equal(await ready, false);
    assert.equal(env.document.count("DOMContentLoaded"), 0);
  }
});
