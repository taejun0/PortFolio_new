/** Local Chromium measurements, not a claim about real mobile hardware. */
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseURL = process.env.STUDY_ROOM_BASE_URL || "http://127.0.0.1:3001";
const output = process.env.STUDY_ROOM_QA_DIR || "/tmp/study-room-qa";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
await mkdir(output, { recursive: true });

try {
  for (const profile of [
    { name: "desktop", viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, cpu: 1 },
    { name: "mobile-emulated", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, cpu: 4 },
  ]) {
    const context = await browser.newContext({ viewport: profile.viewport, deviceScaleFactor: profile.deviceScaleFactor, isMobile: profile.cpu > 1, hasTouch: profile.cpu > 1 });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Performance.enable");
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: profile.cpu });
    if (profile.cpu > 1) {
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 100, downloadThroughput: 200000, uploadThroughput: 100000, connectionType: "cellular4g" });
    }
    await page.addInitScript(() => {
      window.__studyMetrics = { lcp: 0, cls: 0 };
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__studyMetrics.lcp = entry.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__studyMetrics.cls += entry.value; }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(`${baseURL}/test/mainpage`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => sessionStorage.getItem("study-room:entered:v1") === "1");
    const frameIntervals = await page.evaluate(() => new Promise(resolve => {
      const frames = [];
      let start = 0;
      let last = 0;
      function sample(now) {
        if (!start) start = now;
        if (last) frames.push(now - last);
        last = now;
        if (now - start < 3000) requestAnimationFrame(sample);
        else resolve(frames);
      }
      requestAnimationFrame(sample);
    }));
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType("navigation")[0];
      const resources = performance.getEntriesByType("resource");
      return {
        fcpMs: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
        lcpMs: window.__studyMetrics.lcp,
        cls: window.__studyMetrics.cls,
        loadEventMs: navigation.loadEventEnd,
        htmlTransferKiB: navigation.transferSize / 1024,
        totalTransferKiB: (navigation.transferSize + resources.reduce((sum, resource) => sum + resource.transferSize, 0)) / 1024,
      };
    });
    const { metrics: cdpMetrics } = await cdp.send("Performance.getMetrics");
    const heapBytes = cdpMetrics.find(metric => metric.name === "JSHeapUsedSize")?.value || 0;
    const sorted = frameIntervals.sort((a, b) => a - b);
    const percentile = value => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * value))];
    const result = {
      profile: profile.name,
      viewport: profile.viewport,
      cpuSlowdown: profile.cpu,
      network: profile.cpu > 1 ? "100 ms latency, 1.6 Mbps down, 0.8 Mbps up" : "localhost, no throttle",
      ...metrics,
      jsHeapMiB: heapBytes / 1024 / 1024,
      rafSamples: frameIntervals.length,
      rafMedianMs: percentile(.5),
      rafP95Ms: percentile(.95),
      rafIntervalsOver32Ms: frameIntervals.filter(value => value > 32).length,
    };
    results.push(result);
    await page.screenshot({ path: `${output}/performance-${profile.name}.png`, fullPage: true });
    await context.close();
  }
  await writeFile(`${output}/performance.json`, JSON.stringify({ browser: await browser.version(), results }, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
