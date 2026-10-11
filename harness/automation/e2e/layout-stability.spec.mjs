/**
 * E2E-PERF · Cumulative Layout Shift after load on the landing and feature
 * pages. Regression: the Fraunces display face swapped in late and reflowed the
 * hero by ~80px at 768px. The fallback face is now metric-matched.
 *
 * Caveat: the metric match is against Georgia. On machines without Georgia
 * the fallback is a different serif and the CLS number can exceed the budget.
 */
import { test, expect } from '@playwright/test';

const CASES = [
  { route: '/', width: 375 },
  { route: '/', width: 768 },
  { route: '/', width: 1440 },
  { route: '/features', width: 375 },
  { route: '/features', width: 768 },
];

for (const { route, width } of CASES) {
  test(`CLS under 0.1 on ${route} at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(route, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts?.ready);

    // The metric-matched fallback only means something where Georgia exists.
    // Without it the browser uses a different serif and the number says
    // nothing about the shipped page, so skip loudly instead of passing or failing.
    const hasGeorgia = await page.evaluate(() => {
      const ctx = document.createElement('canvas').getContext('2d');
      const width = (font) => { ctx.font = font; return ctx.measureText('Hamburgefonstiv Wwmmlli').width; };
      return width('700 100px Georgia, monospace') !== width('700 100px monospace');
    });
    test.skip(!hasGeorgia, 'Georgia is not installed on this machine; CLS fallback cannot be verified here.');

    await page.waitForTimeout(3000);

    const cls = await page.evaluate(() => window.__cls);
    test.info().annotations.push({ type: 'cls', description: cls.toFixed(4) });
    expect(cls).toBeLessThan(0.1);
  });
}
