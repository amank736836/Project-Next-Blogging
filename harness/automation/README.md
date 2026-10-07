# Automation

92 Vitest checks across 10 files, plus a 20-check live smoke script. Everything here runs
the application's **real** code — no handler is reimplemented, no assertion is faked.

## Layout

```
automation/
├── api/            26 checks — the three route files, called in-process
│   ├── posts-collection.test.js   GET/POST /api/posts
│   ├── posts-slug.test.js         GET/PUT/DELETE /api/posts/[slug]
│   └── upload.test.js             POST /api/upload
├── database/       18 checks — the real Mongoose schema, no server
│   └── post-schema.test.js
├── ui/             48 checks — components rendered in jsdom
│   ├── auth-gate.test.jsx         AuthLayout
│   ├── contact-form.test.jsx      app/contact/page.js
│   ├── header-nav.test.jsx        Header
│   ├── post-card.test.jsx         PostCard
│   ├── post-form.test.jsx         PostForm
│   └── theme.test.jsx             theme-context
├── utilities/      shared harness — see test-tools/ui/README.md
│   ├── setup.js                   global setup, registered in vitest.config.mjs
│   ├── fake-post-model.js         spies on the real model's statics
│   ├── request.js                 Request builders for the API suites
│   └── mocks/                     tinymce.jsx, clerk.jsx, next-navigation.js
└── scripts/
    └── api-smoke.mjs              20 live HTTP checks, zero dependencies
```

## Results by suite

| Suite | Files | Checks | Result |
| --- | --- | --- | --- |
| `api/` | 3 | 26 | PASS |
| `database/` | 1 | 18 | PASS |
| `ui/` | 6 | 48 | PASS |
| **Vitest total** | **10** | **92** | **92/92, exit 0** |
| `scripts/api-smoke.mjs` | — | 20 | **20/20, exit 0** |
| **Combined** | | **112** | |

Run: `RUN-2026-10-07-001`. Details in
[../test-results/latest/execution-RUN-2026-10-07-001.md](../test-results/latest/execution-RUN-2026-10-07-001.md).

## Running

```bash
npm test                # everything
npm run test:api        # automation/api/**
npm run test:ui         # automation/ui/**
npm run test:db         # automation/database/**
npm run test:coverage   # + writes test-results/latest/coverage/
npm run test:smoke      # the live script (needs a running server)
```

All scripts pass `--config harness/vitest.config.mjs`. The config lives in `harness/` and
sets `root` to the repository root, so `@/` still resolves to `src/` exactly as it does for
the application build.

## Conventions

* **Test ids are the case ids.** `it('TC-API-001 …')` — the title *is* the traceability
  link. `grep -c "TC-" ` over the automation folder must equal the case count.
* **A defect-documenting test says so in its title.** e.g.
  `TC-SEC-004 [BUG-006] serves a DRAFT to any anonymous caller — the route ignores status`.
  Fixing the bug makes it red on purpose.
* **Environment pragma is mandatory on API and database files:** `// @vitest-environment node`.
  Under jsdom, `await request.formData()` never settles.
* **Never `vi.mock('@/models/Post')`.** It hangs Vitest. Spy on the statics instead.
* **No test may touch the network.** `request.js` uses `http://harness.local`, which does
  not resolve, so an accidental fetch fails loudly.

## Configuration notes worth keeping

`harness/vitest.config.mjs` does three non-obvious things, each fixing a real failure:

1. **JSX inside `.js`.** This project writes JSX in `.js` files. Vite refuses by default.
   The config adds `react({ include: /[\\/](src|harness)[\\/].*\.[cm]?[jt]sx?$/ })` plus a
   matching `esbuild.include` and `optimizeDeps.esbuildOptions.loader['.js'] = 'jsx'`.
   The alternative — renaming application files — was rejected because it would modify
   `src/` for a test.
2. **Aliases in array form.** The object form breaks `@harness`: the key `@` prefix-matches
   and swallows it. Array form with anchored regexes fixes this.
3. **Coverage excludes `src/components/motion/**` and `src/components/demo/**`.** Both are
   presentational and GSAP-driven. Say so wherever the 36% figure appears.
