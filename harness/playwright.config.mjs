import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

/**
 * Browser-level QA suite (Playwright). Specs live in harness/automation/e2e.
 *
 *   npm run build              (the suite runs against the production build)
 *   npm run test:e2e           starts `next start` on E2E_PORT (default 3100)
 *   E2E_BASE_URL=http://host:port npm run test:e2e   runs against a server you started
 *
 * Optional: PLAYWRIGHT_CHROMIUM_PATH points at a Chromium binary when the
 * bundled browsers cannot be downloaded (air-gapped CI).
 *
 * Clerk-gated routes (/add-post, /all-posts, /edit-post) need real Clerk keys
 * and are not covered here; see the QA report for what remains unverified.
 */
const PORT = Number(process.env.E2E_PORT || 3100);
const external = Boolean(process.env.E2E_BASE_URL);
const baseURL = process.env.E2E_BASE_URL || `http://127.0.0.1:${PORT}`;
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: fileURLToPath(new URL('./automation/e2e', import.meta.url)),
  testMatch: '**/*.spec.mjs',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: Number(process.env.E2E_WORKERS || 4),
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  outputDir: fileURLToPath(new URL('./test-results/playwright', import.meta.url)),
  reporter: [
    ['list'],
    ['json', { outputFile: fileURLToPath(new URL('./test-results/playwright/results.json', import.meta.url)) }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: external
    ? undefined
    : {
        command: `npx next start -p ${PORT} -H 127.0.0.1`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
        cwd: fileURLToPath(new URL('..', import.meta.url)),
      },
});
