/**
 * E2E-NAV · Mobile header sheet.
 *
 * Regressions:
 *  - At 768–1023px the sheet sat 4px under the header (top-16 vs. the taller
 *    md header). It now starts exactly at the header's bottom edge.
 *  - A closed sheet was only transparent, so its links stayed in the tab
 *    order. It is now visibility:hidden and unreachable by keyboard.
 */
import { test, expect } from '@playwright/test';

const MOBILE_WIDTHS = [375, 768, 820];

for (const width of MOBILE_WIDTHS) {
  test.describe(`header sheet at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('opens flush under the header and closes with Escape', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });
      // The toggle's label flips between "Open menu" and "Close menu", so
      // address it by the sheet it controls instead.
      const toggle = page.locator('button[aria-controls="mobile-nav"]');
      const sheet = page.locator('#mobile-nav');

      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(toggle).toHaveAttribute('aria-label', 'Close menu');

      const gap = await page.evaluate(() => {
        const header = document.querySelector('header').getBoundingClientRect();
        const panel = document.getElementById('mobile-nav').getBoundingClientRect();
        return panel.top - header.bottom;
      });
      expect(Math.abs(gap)).toBeLessThanOrEqual(1);

      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toHaveAttribute('aria-label', 'Open menu');
      await expect(sheet).toHaveCSS('visibility', 'hidden', { timeout: 2000 });
    });

    test('closed sheet links are not reachable by keyboard', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });
      const sheetLinks = page.locator('#mobile-nav a[href], #mobile-nav button');

      await expect(page.locator('#mobile-nav')).toHaveCSS('visibility', 'hidden', { timeout: 2000 });
      const count = await sheetLinks.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        await expect(sheetLinks.nth(i)).not.toBeVisible();
      }
    });
  });
}
