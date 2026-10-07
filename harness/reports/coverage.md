# Coverage

Generated from [`../test-results/latest/coverage/coverage-summary.json`](../test-results/latest/coverage/coverage-summary.json),
produced by `npm run test:coverage` during `RUN-2026-10-07-001`. Every number below is read
out of that file — none is estimated.

## What is measured, and what is not

`harness/vitest.config.mjs` excludes `src/components/motion/**` and `src/components/demo/**`
from coverage. Both are presentational and GSAP-driven, and testing them in jsdom would
measure the animation library rather than the application. **The 36% figure below therefore
describes the tested slice, not the whole of `src/`.**

## Level 1 — total

| Metric | Covered | Total | % |
| --- | --- | --- | --- |
| lines | 1648 | 4544 | 36.26% |
| statements | 1648 | 4544 | 36.26% |
| functions | 72 | 118 | 61.01% |
| branches | 298 | 360 | 82.77% |

## Level 2 — by layer

| Layer | Files | Lines | Functions | Branches |
| --- | --- | --- | --- | --- |
| API routes | 3 | 94.00% | 100.00% | 90.00% |
| Models | 1 | 100.00% | n/a | n/a |
| Lib / services / hooks | 5 | 39.84% | 56.00% | 75.00% |
| Components (non-motion) | 31 | 48.58% | 56.45% | 83.19% |
| Pages & layouts | 16 | 10.97% | 69.57% | 86.27% |

## Level 3 — files at 100%

| File | Lines |
| --- | --- |
| `src/app/api/upload/route.js` | 28 |
| `src/app/contact/page.js` | 171 |
| `src/components/AuthLayout.jsx` | 29 |
| `src/components/container/Container.jsx` | 22 |
| `src/components/index.js` | 16 |
| `src/components/loaders/Loader.jsx` | 27 |
| `src/components/PostCard.jsx` | 88 |
| `src/components/RTE.jsx` | 43 |
| `src/components/Select.jsx` | 40 |
| `src/models/Post.js` | 34 |

## Level 4 — files at 0%

These are the gaps that matter. Nothing imports them in a test.

| File | Lines | Why |
| --- | --- | --- |
| `src/app/post/[slug]/page.js` | 308 | — |
| `src/app/pricing/page.js` | 236 | — |
| `src/app/page.js` | 148 | — |
| `src/app/features/page.js` | 134 | — |
| `src/app/all-posts/page.js` | 120 | — |
| `src/components/ui/LegalLayout.jsx` | 102 | — |
| `src/app/terms/page.js` | 82 | — |
| `src/services/config.js` | 82 | Every page mocks it; no test targets it directly | |
| `src/app/privacy/page.js` | 81 | — |
| `src/components/ui/Ambient.jsx` | 76 | — |
| `src/app/layout.js` | 68 | — |
| `src/app/edit-post/[slug]/page.js` | 67 | — |
| `src/app/not-found.js` | 58 | — |
| `src/components/ui/PageShell.jsx` | 52 | — |
| `src/app/error.js` | 43 | — |
| `src/components/ui/EmptyShelf.jsx` | 41 | — |
| `src/components/loaders/Skeleton.jsx` | 39 | — |
| `src/lib/db.js` | 26 | Throws at import without `MONGO_URI` (BUG-017) | |
| `src/components/ui/ScrollProgress.jsx` | 25 | — |
| `src/app/add-post/page.js` | 19 | — |
| `src/app/demo/page.js` | 10 | — |
| `src/lib/cloudinary.js` | 8 | Configuration only; exercised indirectly through the mocked provider | |
| `src/app/login/page.js` | 7 | — |
| `src/app/signup/page.js` | 7 | — |
| `src/proxy.js` | 5 | — |

## Level 5 — the five largest files with zero coverage

| File | Lines | What it holds |
| --- | --- | --- |
| `src/app/post/[slug]/page.js` | 308 | Article reader: hero, sticky rail, byline, copy link, back-to-top. Holds BUG-003 and BUG-021. |
| `src/app/pricing/page.js` | 236 | Billing toggle and plan grid — purely presentational, low risk. |
| `src/app/page.js` | 148 | Home: search, topic chips, counts, sort, two empty states. Holds BUG-002. |
| `src/app/features/page.js` | 134 | Marketing page — the source of the unmeasured "98 ms TTFB" claim. |
| `src/app/all-posts/page.js` | 120 | Writer's shelf: tabs, stats, three empty states. Holds BUG-001. |

Each of these needs `@clerk/nextjs` and `@/services/config` mocked in the same file. That is
the single blocker for four of the five — `pricing` and `features` need neither, and are
listed here only because they are large, not because they are risky.

## Level 6 — requirement coverage

41 requirements ([../requirements/README.md](../requirements/README.md)). Status is taken
from the requirement tables themselves.

| Requirement status | Count |
| --- | --- |
| IMPLEMENTED, with an automated test | 17 |
| IMPLEMENTED, untested | 3 |
| PARTIAL | 3 |
| VIOLATED or NOT IMPLEMENTED | 18 |

Full chain: [traceability.md](traceability.md).

## Level 7 — scenario and case coverage

| | Total | Automated | Blocked | Not executed |
| --- | --- | --- | --- | --- |
| Scenarios | 230 | 116 | 26 | 88 |
| Test cases | 88 | 88 | 0 | 0 |
| Live smoke checks | 20 | 20 | 0 | 0 |

The scenario counts come from the status columns in
[../test-scenarios/](../test-scenarios/README.md). "Automated" counts a scenario that at
least one executed check covers, even partially.

## Level 8 — bug coverage

| | Count | Bugs |
| --- | --- | --- |
| Open bugs | 21 | — |
| With an automated test that pins the defect | 12 | 004, 005, 006, 007, 008, 010, 011, 013, 014, 016, 020, 022 |
| Code-verified only, no test | 6 | 001, 002, 003, 012, 017, 021 |
| Evidence-only (committed server log) | 1 | 015 |
| Found by inspection, no test needed | 2 | 018, 019 |
| Withdrawn | 1 | 009 — disproven by TC-EDGE-001, number retired |

12 + 6 + 1 + 2 = 21.

Six bugs have no test at all: BUG-001, BUG-002, BUG-003, BUG-012, BUG-017, BUG-021. Three
of them are Major and user-visible. Writing those tests is the highest-value remaining work
in this harness — see [../reports/release-readiness.md](release-readiness.md).

## Reading these numbers honestly

36% line coverage on a codebase with zero pre-existing tests is a starting point, not an
achievement. The distribution matters more than the total:

* Everything the harness *could* reach without a browser, a database or a Clerk tenant is
  well covered — the API routes, the schema, and six components are at 90–100%.
* The four largest pages (`post/[slug]`, `all-posts`, `page`, `edit-post/[slug]`) total 643
  lines and are at **0%**. They hold BUG-001, BUG-002, BUG-003 and BUG-021.
* `src/lib/db.js` is at 0% and cannot be imported without `MONGO_URI`.

Raising the number is easy. Raising it *where it matters* means testing those four pages,
which needs `@clerk/nextjs` and `@/services/config` mocked together in the same file. That
is the next task, not a larger one.
