import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { transformWithOxc } from 'vite';

/**
 * Harness test configuration.
 *
 * Lives inside harness/ on purpose: the application owns no test tooling and
 * nothing under src/ is aware of this file. It is wired into npm through the
 * root package.json scripts:
 *
 *   npm test                -> vitest run --config harness/vitest.config.mjs
 *   npm run test:watch      -> vitest    --config harness/vitest.config.mjs
 *   npm run test:coverage   -> vitest run --config harness/vitest.config.mjs --coverage
 *
 * Every test lives under harness/automation/**. The `@/` alias mirrors
 * jsconfig.json so tests import application code exactly the way the app does.
 */
const repoRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
  root: repoRoot,
  // The app is written in plain JavaScript but puts JSX inside `.js` files
  // (e.g. src/app/contact/page.js, src/app/page.js). Vite only treats `.jsx`
  // as JSX by default, so both the React plugin and esbuild are told to parse
  // `.js` as JSX too. Nothing under src/ is renamed to make the tests work.
  plugins: [
    react({ include: /[\\/](src|harness)[\\/].*\.[cm]?[jt]sx?$/ }),
    {
      name: 'jsx-in-js-for-tests',
      enforce: 'pre',
      async transform(code, id) {
        const path = id.split('?')[0];
        if (!/[\\/](src|harness)[\\/].*\.js$/.test(path)) return null;
        return transformWithOxc(code, path, { lang: 'jsx' });
      },
    },
  ],
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
  resolve: {
    // Array form + anchored regexes: the app alias `@/` mirrors jsconfig.json,
    // and `@harness/` reaches back into this folder for shared test utilities.
    alias: [
      { find: /^@harness\//, replacement: `${repoRoot}/harness/` },
      { find: /^@\//, replacement: `${repoRoot}/src/` },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [`${repoRoot}/harness/automation/utilities/setup.js`],
    include: [`${repoRoot}/harness/automation/**/*.test.{js,jsx}`],
    css: false,
    reporters: ['default', 'json'],
    outputFile: {
      json: `${repoRoot}/harness/test-results/latest/vitest-results.json`,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: `${repoRoot}/harness/test-results/latest/coverage`,
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/components/demo/**', 'src/components/motion/**'],
    },
  },
});
