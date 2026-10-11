/**
 * E2E-PRICE · FAQ accordion on /pricing.
 *
 * Regression: the trigger had no aria-controls and the collapsed panel stayed
 * focusable. The panel is now inert while closed, and the trigger names it.
 */
import { test, expect } from '@playwright/test';

test('FAQ trigger controls its panel and the collapsed panel is inert', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pricing', { waitUntil: 'load' });

  const trigger = page.getByRole('button', { name: /what actually happens if i stop paying/i });
  await trigger.scrollIntoViewIfNeeded();
  const panelId = await trigger.getAttribute('aria-controls');
  expect(panelId).toBeTruthy();

  const panel = page.locator(`[id="${panelId}"]`);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toHaveJSProperty('inert', true);

  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toHaveJSProperty('inert', false);
  await expect(panel).toContainText(/.+/);
});
