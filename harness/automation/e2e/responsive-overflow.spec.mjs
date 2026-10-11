/**
 * E2E-RESP · Horizontal overflow and fixed-element clipping across the
 * required viewport matrix. Regression for the /demo kit grid overflow
 * (min-width content forced the page wider than the viewport on phones).
 */
import { test, expect } from '@playwright/test';

const VIEWPORTS = [320, 375, 390, 425, 768, 820, 1024, 1280, 1366, 1440, 1920, 2560];
const ROUTES = [
  '/',
  '/features',
  '/pricing',
  '/contact',
  '/demo',
  '/privacy',
  '/terms',
  '/login',
  '/signup',
  '/no-such-page',
];

for (const route of ROUTES) {
  for (const width of VIEWPORTS) {
    test(`no horizontal overflow on ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts?.ready);
      // Entrance animations (GSAP header intro, Reveal) move elements for about
      // a second after load; measure only once the layout has settled.
      await page.waitForTimeout(1500);

      const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const offenders = [];
        if (root.scrollWidth > root.clientWidth) {
          for (const el of document.body.querySelectorAll('*')) {
            // Decorative and intentionally clipped content (marquee, aurora) is skipped.
            if (el.closest('[aria-hidden="true"], .aurora-blob, [class*="animate-marquee"], [class*="w-max"]')) continue;
            const r = el.getBoundingClientRect();
            if (r.width && r.right > root.clientWidth + 1 && getComputedStyle(el).position !== 'fixed') {
              offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)}`);
              if (offenders.length >= 5) break;
            }
          }
        }
        return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, offenders };
      });

      expect(metrics.scrollWidth, `offenders: ${metrics.offenders.join(' | ')}`).toBeLessThanOrEqual(
        metrics.clientWidth
      );
    });
  }
}
