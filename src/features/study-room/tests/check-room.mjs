/**
 * Run against a running production build:
 * STUDY_ROOM_BASE_URL=http://127.0.0.1:3001 node src/features/study-room/tests/check-room.mjs
 * Uses the existing Playwright dependency and installed Chrome; adds no packages.
 */
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseURL = process.env.STUDY_ROOM_BASE_URL || "http://127.0.0.1:3000";
const output = process.env.STUDY_ROOM_QA_DIR || "/tmp/study-room-qa";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const checks = [];
await mkdir(output, { recursive: true });

const check = (name, result = true) => { assert.ok(result, name); checks.push(name); };
const observe = page => {
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => {
    if (response.url().startsWith(baseURL) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
};

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  observe(page);
  await page.clock.install();
  const response = await page.goto(`${baseURL}/test/mainpage`);
  check("new route returns 200", response.status() === 200);
  await page.locator('[data-scene="entering"]').waitFor();
  check("first visit enters the room");
  check("old splash is skipped", await page.locator("html").getAttribute("data-splash") === "skip");
  check("only the room shell is rendered", await page.locator("main").count() === 1 && await page.locator("header, footer").count() === 0);
  check("no added decorative copy", await page.locator("main p, main h2, main header, main footer").count() === 0 && !await page.locator("main").evaluate(element => /Taejun|AFTERNOON|ROOM 01|서두르지|배우고/.test(element.textContent)));
  await page.getByRole("button", { name: "인트로 건너뛰기" }).click();
  await page.locator('[data-scene="living"]').waitFor();
  check("skip settles the same scene");

  // A real reload must never play the camera animation for a returning visitor.
  await page.addInitScript(() => {
    window.__roomIntros = 0;
    addEventListener("animationstart", event => { if (event.animationName.includes("enter-room")) window.__roomIntros++; }, true);
  });
  await page.reload();
  await page.locator('[data-motion="full"]').waitFor();
  check("return visit skips intro", await page.evaluate(() => window.__roomIntros) === 0 && await page.getByRole("button", { name: "인트로 건너뛰기" }).count() === 0);

  // Regression: cached SSR backgrounds can load before React attaches onLoad.
  await page.getByRole("button", { name: "앞쪽 식물 잎 건드리기" }).click();
  await page.locator('[data-leaf-response="1"] image').first().waitFor({ state: "attached" });
  check("cached background supplies the touched leaf texture");

  await page.getByRole("button", { name: "움직임 잠시 멈추기" }).click();
  await page.locator('[data-motion="paused"]').waitFor();
  check("pause freezes every room animation", await page.evaluate(() => document.getAnimations().filter(animation => animation.effect?.target?.closest?.("[data-scene]")).every(animation => animation.playState === "paused")));
  await page.screenshot({ path: `${output}/desktop.png`, fullPage: true });
  // Regression: the room pause used to freeze a newly opened paper at opacity 0.
  await page.getByRole("button", { name: "모니터에서 프로젝트 보기" }).click();
  await page.waitForFunction(() => {
    const note = document.querySelector("[data-room-note]");
    return note && Number(getComputedStyle(note).opacity) > .95;
  });
  check("paused room still opens a readable note", await page.getByRole("dialog", { name: "프로젝트" }).isVisible());
  const roomAddress = page.url();
  await page.getByRole("button", { name: "D-Order 보기", exact: true }).click();
  await page.locator('[data-room-entry="d-order"]').waitFor();
  check("project reading stays inside the room", page.url() === roomAddress);
  await page.getByRole("button", { name: "프로젝트 닫기" }).click();
  await page.getByRole("button", { name: "움직임 재생" }).click();
  check("resume restarts animation", await page.locator("[data-study-page]").getAttribute("data-motion") === "full");

  // Test both gestures with browser virtual time and a reproducible random source.
  await page.evaluate(() => { Math.random = () => .5; });
  const states = [];
  for (let index = 0; index < 3; index++) {
    await page.clock.fastForward(23000);
    await page.locator('[data-character-state="idle"]:visible, [data-character-state="thinking"]:visible, [data-character-state="stretching"]:visible').waitFor();
    const state = await page.locator("[data-character-state]:visible").getAttribute("data-character-state");
    states.push(state);
    check(`gesture ${index + 1} is exclusive`, ["idle", "thinking", "stretching"].includes(state));
    if (state !== "idle") {
      check(`gesture ${index + 1} starts with a typing pause`, await page.locator("[data-character-state]:visible").getAttribute("data-character-phase") === "preparing");
      await page.clock.runFor(800);
      check(`gesture ${index + 1} reaches its hold`, await page.locator("[data-character-state]:visible").getAttribute("data-character-phase") === "holding");
      if (index === 0) {
        await page.getByRole("button", { name: "움직임 잠시 멈추기" }).click();
        await page.locator('[data-motion="paused"]').waitFor();
        await page.clock.fastForward(60000);
        check("pause preserves an in-progress gesture", await page.locator("[data-character-state]:visible").getAttribute("data-character-phase") === "holding");
        check("pause also freezes pose blending", await page.evaluate(() => document.getAnimations().filter(animation => animation.effect?.target?.closest?.("[data-scene]")).every(animation => animation.playState === "paused")));
        await page.getByRole("button", { name: "움직임 재생" }).click();
        await page.locator('[data-motion="full"]').waitFor();
      }
      await page.clock.runFor(6200);
    } else {
      await page.clock.runFor(7000);
    }
    await page.locator('[data-character-state="typing"]:visible').waitFor();
    check(`gesture ${index + 1} returns to typing`, await page.locator("[data-character-state]:visible").getAttribute("data-character-state") === "typing");
  }
  check("thinking and stretching both occur", states.includes("thinking") && states.includes("stretching"));

  // Simulate the visibility API event without freezing the test harness itself.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.locator('[data-motion="paused"]').waitFor();
  const frozenState = await page.locator("[data-character-state]:visible").getAttribute("data-character-state");
  await page.clock.fastForward(60000);
  check("hidden tab stops state timers", await page.locator("[data-character-state]:visible").getAttribute("data-character-state") === frozenState);
  check("hidden tab pauses environmental animations", await page.evaluate(() => document.getAnimations().filter(animation => animation.effect?.target?.closest?.("[data-scene]")).every(animation => animation.playState === "paused")));
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.locator('[data-motion="full"]').waitFor();
  check("visible tab resumes");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator('[data-motion="paused"]').waitFor();
  check("live motion-preference change stops animations", await page.evaluate(() => document.getAnimations().filter(animation => animation.effect?.target?.closest?.("[data-study-page]")).length === 0));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "움직임 잠시 멈추기" }).waitFor();
  check("live motion-preference change can resume");
  await context.close();

  const responsive = await browser.newContext({ reducedMotion: "reduce" });
  const mobile = await responsive.newPage();
  observe(mobile);
  for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 667 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }, { width: 844, height: 390 }]) {
    await mobile.setViewportSize(viewport);
    await mobile.goto(`${baseURL}/test/mainpage`);
    await mobile.locator('[data-motion="paused"][data-art-ready="true"]').waitFor();
    check(`${viewport.width}×${viewport.height}: no horizontal overflow`, await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    check(`${viewport.width}×${viewport.height}: scene covers the viewport`, await mobile.evaluate(() => {
      const scene = document.querySelector('[data-scene]').getBoundingClientRect();
      return scene.left === 0 && scene.top === 0 && scene.width === innerWidth && scene.height >= innerHeight;
    }));
    check(`${viewport.width}×${viewport.height}: character head stays in scene`, await mobile.evaluate(() => {
      const head = [...document.querySelectorAll('[data-character-part="head-bounds"]')].map(element => element.getBoundingClientRect()).find(rect => rect.width > 0);
      const scene = document.querySelector('[data-scene]').getBoundingClientRect();
      return head.left >= scene.left && head.right <= scene.right && head.top >= scene.top && head.bottom <= scene.bottom;
    }));
    check(`${viewport.width}×${viewport.height}: static reduced-motion scene`, await mobile.getByRole("button", { name: /움직임/ }).count() === 0 && await mobile.evaluate(() => document.getAnimations().filter(animation => animation.effect?.target?.closest?.("[data-study-page]")).length === 0));
    if (viewport.width === 390 || viewport.width === 768) await mobile.screenshot({ path: `${output}/${viewport.width === 390 ? "mobile" : "tablet"}.png`, fullPage: true });
  }
  await responsive.close();

  // Regression: rectangular touch padding let the mouse steal the notebook marker's tap.
  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const touchPage = await touch.newPage();
  observe(touchPage);
  await touchPage.goto(`${baseURL}/test/mainpage`);
  await touchPage.locator('[data-art-ready="true"]').waitFor();
  const notebookMarker = await touchPage.locator('[data-room-marker="notebook"]').boundingBox();
  await touchPage.touchscreen.tap(notebookMarker.x + notebookMarker.width / 2, notebookMarker.y + notebookMarker.height / 2);
  await touchPage.getByRole("dialog", { name: "기록", exact: true }).waitFor();
  check("notebook marker opens the journal instead of clicking the mouse");
  await touch.close();

  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJS.newPage();
  await staticPage.goto(`${baseURL}/test/mainpage`);
  check("no JavaScript: artwork is visible", await staticPage.getByRole("img").isVisible() && await staticPage.locator("[data-room-background] img").evaluate(image => image.naturalWidth > 0));
  await noJS.close();

  const existing = await browser.newContext();
  const oldPage = await existing.newPage();
  observe(oldPage);
  for (const route of ["/", "/about", "/projects", "/projects/portfolio", "/blog", "/blog/2026-06-24-01"]) {
    const existingResponse = await oldPage.goto(`${baseURL}${route}`);
    check(`existing ${route}: returns 200`, existingResponse.status() === 200);
    check(`existing ${route}: original header/footer, no room`, await oldPage.getByRole("banner").count() === 1 && await oldPage.getByRole("contentinfo").count() === 1 && await oldPage.locator("[data-study-page]").count() === 0);
  }
  await existing.close();

  // Visual snapshots use a separate page; seeking CSS animations must not alter
  // the browser's CSS play-state behavior in the functional tests above.
  const poses = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const posePage = await poses.newPage();
  observe(posePage);
  await posePage.addInitScript(() => sessionStorage.setItem("study-room:entered:v1", "1"));
  await posePage.goto(`${baseURL}/test/mainpage`);
  await posePage.getByRole("button", { name: "움직임 잠시 멈추기" }).click();
  await posePage.locator('[data-motion="paused"]').waitFor();
  const chair = posePage.locator('[data-character-part="seat-anchor"]:visible');
  const chairBefore = await chair.screenshot();
  for (const pose of ["thinking", "stretching"]) {
    await posePage.evaluate(state => {
      for (const character of document.querySelectorAll("[data-character-state]")) {
        character.dataset.characterState = state;
        character.dataset.characterPhase = "holding";
      }
      for (const animation of document.getAnimations()) {
        if (animation instanceof CSSAnimation && /pose-in|pose-out/.test(animation.animationName)) animation.finish();
      }
    }, pose);
    await posePage.screenshot({ path: `${output}/${pose}.png`, fullPage: true });
    check(`${pose}: chair pixels stay fixed`, chairBefore.equals(await chair.screenshot()));
  }
  await poses.close();
  check("no browser errors or missing local assets", errors.length === 0);
  await writeFile(`${output}/checks.json`, JSON.stringify({ checks, errors }, null, 2));
  console.log(JSON.stringify({ passed: checks.length, checks, errors, output }, null, 2));
} finally {
  await browser.close();
}
