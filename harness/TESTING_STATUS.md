# Testing Status

**Snapshot: 2026-10-07 · commit `9d413cd` · branch `arena/da51fd83-project-next-blogging`**

This page is the fast answer to *"where are we?"*. Detail lives in
[reports/](reports/). Everything below was produced by an execution recorded in
[test-results/latest/](test-results/latest/).

---

## At a glance

| Suite | Executed | Pass | Fail | Blocked | Not run |
| --- | --- | --- | --- | --- | --- |
| Automated — API contract | 26 | 26 | 0 | 0 | 0 |
| Automated — Database contract | 18 | 18 | 0 | 0 | 0 |
| Automated — UI / component | 48 | 48 | 0 | 0 | 0 |
| **Automated total (Vitest)** | **92** | **92** | **0** | **0** | **0** |
| Live smoke (`api-smoke.mjs`) | 20 | 20 | 0 | 0 | 0 |
| Static analysis (`npm run lint`) | — | 0 errors, 0 warnings | — | — | — |
| Production build (`npm run build`) | — | ✅ succeeds | — | — | — |
| Manual / exploratory | 0 | — | — | — | 34 documented, `NOT_EXECUTED` |
| End-to-end browser | 0 | — | — | — | 19 documented, `NOT_EXECUTED` |
| Performance | 0 | — | — | — | 11 documented, `NOT_EXECUTED` |
| Security (manual / VAPT) | 0 | — | — | — | 9 documented, `NOT_EXECUTED` |

**Executed this cycle: 112 checks, 112 passed, 0 failed, 0 blocked.**

> Read the smoke number carefully: 20/20 "passed" means *the server behaved as documented*,
> not that the behaviour is good. Five of those checks
> (`SMK-13`…`SMK-16`, `SMK-18`, `SMK-19`, `SMK-20`) assert **defective** behaviour on
> purpose and are wired to bug IDs. They exist so the defect cannot be silently fixed
> without a test being updated.

## Coverage (measured, not estimated)

From `harness/test-results/latest/coverage/coverage-summary.json`:

| Metric | Covered | Total | % |
| --- | --- | --- | --- |
| Lines / statements | 1648 | 4544 | **36.26** |
| Functions | 72 | 118 | **61.01** |
| Branches | 298 | 360 | **82.77** |

Fully or near-fully covered modules:

| File | Lines |
| --- | --- |
| `src/models/Post.js` | 100% |
| `src/app/api/upload/route.js` | 100% |
| `src/app/contact/page.js` | 100% |
| `src/components/AuthLayout.jsx` | 100% |
| `src/components/PostCard.jsx` | 100% |
| `src/components/RTE.jsx` | 100% |
| `src/components/Select.jsx` | 100% |
| `src/components/header/Header.jsx` | 96.07% |
| `src/hooks/theme-context.js` | 95.23% |
| `src/app/api/posts/route.js` | 93.10% |
| `src/components/Input.jsx` | 94.33% |
| `src/components/PostForm/PostForm.jsx` | 91.52% |
| `src/app/api/posts/[slug]/route.js` | 90.69% |

At **0%** — the largest gaps, all client pages that need Clerk + a database to render
meaningfully:

`src/app/post/[slug]/page.js` (308 lines) · `src/app/all-posts/page.js` (120) ·
`src/app/page.js` (148) · `src/services/config.js` (82) · `src/lib/db.js` (34) ·
`src/lib/cloudinary.js` (10) · `src/app/edit-post/[slug]/page.js` (67) ·
`src/app/layout.js` (78) · `src/proxy.js` (7)

Full breakdown: [reports/coverage.md](reports/coverage.md).

## Defects

**21 open · 0 resolved.** Two are Critical, four are High.

| ID | Title | Severity | Automated proof |
| --- | --- | --- | --- |
| [BUG-004](bugs/open/BUG-004-unauthenticated-post-api.md) | All `/api/posts` mutations are unauthenticated and unauthorised | **Critical** | TC-SEC-003/005/007, SMK-15/16/18 |
| [BUG-005](bugs/open/BUG-005-idor-draft-exposure.md) | Any user's drafts are readable via `GET /api/posts?status=inactive[&userId=…]` | **Critical** | TC-SEC-002 |
| [BUG-006](bugs/open/BUG-006-draft-readable-by-slug.md) | `GET /api/posts/[slug]` serves drafts to anonymous callers | High | TC-SEC-004 |
| [BUG-007](bugs/open/BUG-007-mass-assignment-put.md) | `PUT /api/posts/[slug]` accepts arbitrary fields, no `runValidators` | High | TC-SEC-006 |
| [BUG-008](bugs/open/BUG-008-upload-no-server-validation.md) | `POST /api/upload` has no MIME/size check and no auth | High | TC-SEC-008 |
| [BUG-022](bugs/open/BUG-022-stored-xss-post-content.md) | `post.content` is stored and rendered unsanitised (stored XSS) | High | TC-EDGE-003 (storage proven; browser execution `NOT_EXECUTED`) |
| [BUG-001](bugs/open/BUG-001-all-posts-drafts-never-shown.md) | `/all-posts` Drafts tab is permanently empty | Major | Code-verified, no test yet |
| [BUG-002](bugs/open/BUG-002-home-drafts-filter-dead.md) | Home archive "Drafts" filter always shows 0 | Major | Code-verified, no test yet |
| [BUG-003](bugs/open/BUG-003-article-shows-viewer-as-author.md) | Article page shows the *viewer's* name as the author | Major | Code-verified, no test yet |
| [BUG-011](bugs/open/BUG-011-manual-slug-strips-hyphens.md) | Manual slug field strips every hyphen as typed | Major | TC-NEG-010 |
| [BUG-013](bugs/open/BUG-013-api-leaks-internal-errors.md) | API 500s leak raw internal messages | Medium | SMK-13/14 |
| [BUG-014](bugs/open/BUG-014-no-security-headers.md) | No security headers; `X-Powered-By` exposed | Medium | SMK-19 |
| [BUG-015](bugs/open/BUG-015-missing-clerk-secret-key-500s-site.md) | Missing `CLERK_SECRET_KEY` 500s the entire site | Medium | Evidence log |
| [BUG-017](bugs/open/BUG-017-db-throws-at-import.md) | `next build` fails without `MONGO_URI` | Medium | Evidence log |
| [BUG-012](bugs/open/BUG-012-db-caches-rejected-promise.md) | `dbConnect` caches a rejected promise forever | Medium | Code-verified |
| [BUG-010](bugs/open/BUG-010-contact-form-has-no-backend.md) | Contact form reports success without sending | Medium | TC-UI-012 |
| [BUG-016](bugs/open/BUG-016-upload-non-multipart-500.md) | Non-multipart upload body → 500 instead of 400/415 | Low | SMK-20 |
| [BUG-018](bugs/open/BUG-018-unused-dependencies.md) | 5 declared dependencies are never imported | Low | grep-verified |
| [BUG-019](bugs/open/BUG-019-no-env-example.md) | No `.env.example` | Low | — |
| [BUG-020](bugs/open/BUG-020-stale-firebase-comment.md) | Schema comment says "Firebase UID"; auth is Clerk | Low | — |
| [BUG-021](bugs/open/BUG-021-unhandled-rejection-on-delete.md) | `deletePost` on the article page has no `catch` | Low | Code-verified |

`BUG-009` is retired: it was a hypothesis ("`required` accepts an empty string") that
`TC-EDGE-001` **disproved** — Mongoose 9 does reject `""`. The number is not reused.

## Release readiness

**NOT READY.** Two Critical authorisation defects mean any anonymous visitor can read,
overwrite or delete any post, including unpublished drafts.
Full assessment: [reports/release-readiness.md](reports/release-readiness.md).

## What would move the needle fastest

1. Add server-side auth to `/api/posts*` and `/api/upload` — closes BUG-004/005/006/008
   and makes TC-SEC-002…008 invert into real protections.
2. Sanitise `content` on write or on render — closes BUG-022.
3. Add security headers in `next.config.mjs` — closes BUG-014.
4. Fix `getPosts('active', user.id)` → the shelf and home filters both come back to life
   (BUG-001, BUG-002).
5. Store an author name on the post, or resolve it from Clerk, instead of reading
   `useUser()` on the article page (BUG-003).

## Reproduce everything on this page

```bash
npm install
npm run lint                                            # 0 problems
npm test                                                # 92 passed
npm run test:coverage                                   # coverage-summary.json
npm run build                                           # with the env vars below
npm run test:smoke                                      # 20 passed
```

Env used for the recorded build and smoke run (all placeholders, no real credentials):

```bash
export MONGO_URI="mongodb://127.0.0.1:27017/harness_smoke?serverSelectionTimeoutMS=1500"
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}"
export CLERK_SECRET_KEY="${CLERK_SECRET_KEY}"
```
