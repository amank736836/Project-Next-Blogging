# Regression report — RUN-2026-10-07-001

| | |
| --- | --- |
| Run | `RUN-2026-10-07-001` |
| Baseline | None — this is the first execution this project has ever had |
| Application commit | `9d413cd` |
| Application source modified? | **No.** `git status --porcelain src/` is empty |
| Result | 92/92 Vitest, 20/20 smoke, lint clean, build exit 0 |
| Regressions found | 0 |

## What changed in the repository

Only harness infrastructure. Nothing an end user can reach.

| File | Change | Risk to the application |
| --- | --- | --- |
| `package.json` | Added 7 `test*` scripts and 8 devDependencies | None at runtime — `dependencies` untouched, and devDeps are not installed in a production build |
| `eslint.config.mjs` | `globalIgnores` extended for generated coverage HTML | None |
| `.gitignore` | Ignores `harness/test-results/latest/coverage/` and binary evidence | None |
| `harness/` | New — 10 test files, 1 script, 4 shared utilities, 3 mocks, fixtures, and the documentation | None — nothing in `src/` imports from it |

The Vitest config lives at `harness/vitest.config.mjs` and sets `root` to the repository
root, so `@/` still resolves to `src/` exactly as the application build resolves it. No
`src/` file was renamed, and no JSX-in-`.js` workaround was applied by touching application
code — it is configured in the harness instead.

## Verification performed

| Check | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | Exit 0, no warnings |
| Unit / integration | `npm test` | Exit 0 — 10 files, 92/92 |
| Coverage | `npm run test:coverage` | Exit 0 — report written |
| Production build | `npm run build` | Exit 0 — 18 routes |
| Live smoke | `node harness/automation/scripts/api-smoke.mjs` | Exit 0 — 20/20 |
| Application untouched | `git status --porcelain src/` | Empty |

The suite was re-run after the last edit to a test file (a comment-only change in
`automation/api/posts-collection.test.js`) and returned 92/92 again.

## Regressions

None. There is no prior run to regress against, and no application code changed.

## What "0 regressions" does not mean

It does not mean the application is correct. This run *established* a baseline and, in doing
so, found 21 defects — 2 Critical, 4 High, 4 Major. See
[../bugs/README.md](../bugs/README.md).

The distinction matters for the next change: from here on, a regression is anything that
turns one of these 112 checks red. Sixteen of them are *supposed* to go red when their bug
is fixed, and each names the bug in its title so the failure is legible rather than
mysterious.

## Known flakiness

None observed, but one hazard is documented because it was hit during development:
**GSAP steals focus in jsdom**, which made `userEvent.type` intermittently drop characters
depending on test order. It is neutralised in
[../automation/utilities/setup.js](../automation/README.md) by reporting
`prefers-reduced-motion` as matching, so the application's own hook skips the GSAP build.

Do not "fix" this by mocking `@/lib/motion` — that was tried and reverted, because it would
hide regressions in the module the suite is supposed to cover.
