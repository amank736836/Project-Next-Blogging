# Release readiness — RUN-2026-10-07-001

| | |
| --- | --- |
| Assessment date | 2026-10-07 |
| Application commit | `9d413cd` |
| Evidence | [`../test-results/latest/execution-RUN-2026-10-07-001.md`](../test-results/latest/execution-RUN-2026-10-07-001.md) |
| Open bugs | 21 (2 Critical, 4 High, 4 Major, 6 Medium, 5 Low) |

## The short version

This is a well-built application with a well-built frontend and **no server-side
authorisation**. The client-side auth gate makes it *look* protected. It is not: every
mutating endpoint accepts anonymous requests, and one query parameter returns every writer's
unpublished drafts to anyone who asks.

Shipping this today would expose private content and allow unauthenticated writes to the
production database.

## Gate 1 — Build and boot: PASS

| Check | Result |
| --- | --- |
| `npm run build` | Exit 0, 18 routes, 13 static |
| `npm run lint` | Exit 0, no warnings |
| `next start` serves every page | 12/12 pages returned 200 (`SMK-01`…`SMK-12`) |
| Unknown route | 404 with the branded page (`SMK-12`) |

Caveat: the build requires three undocumented variables, and a missing `CLERK_SECRET_KEY`
takes the **entire site** down at request time rather than failing at boot —
[BUG-015](../bugs/open/BUG-015-missing-clerk-secret-key-500s-site.md),
[BUG-017](../bugs/open/BUG-017-db-throws-at-import.md). There is no `.env.example`
([BUG-019](../bugs/open/BUG-019-no-env-example.md)).

## Gate 2 — Automated tests: PASS, with a caveat

112 checks, 112 passing, exit code 0.

The caveat is the whole point of this report: **sixteen of those checks pass because they
assert that a protection is missing.** A 100% pass rate here is a measurement of the
harness, not a health check on the product.

## Gate 3 — Security: FAIL

This is the gate that blocks the release.

| Finding | Severity | Evidence |
| --- | --- | --- |
| `POST`/`PUT`/`DELETE /api/posts*` accept anonymous requests; `userId` is caller-supplied | **Critical** | TC-SEC-003/005/007, SMK-15/16/18 — [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) |
| `?status=inactive` returns every writer's drafts | **Critical** | TC-SEC-002 — [BUG-005](../bugs/open/BUG-005-idor-draft-exposure.md) |
| A draft is served to anyone who knows its slug | High | TC-SEC-004 — [BUG-006](../bugs/open/BUG-006-draft-readable-by-slug.md) |
| `PUT` has no allow-list and skips validators — arbitrary fields and out-of-enum values persist | High | TC-SEC-006 — [BUG-007](../bugs/open/BUG-007-mass-assignment-put.md) |
| Upload accepts any MIME and any size, unauthenticated | High | TC-SEC-008, SMK-17 — [BUG-008](../bugs/open/BUG-008-upload-no-server-validation.md) |
| Post content is rendered unsanitised (stored XSS) | High | TC-EDGE-003 — [BUG-022](../bugs/open/BUG-022-stored-xss-post-content.md) |
| No security headers; `X-Powered-By: Next.js` advertised | Medium | SMK-19 — [BUG-014](../bugs/open/BUG-014-no-security-headers.md) |
| 500 responses echo raw driver errors | Medium | SMK-13/14 — [BUG-013](../bugs/open/BUG-013-api-leaks-internal-errors.md) |

Root cause of the first five: `src/proxy.js:6` is `clerkMiddleware()` with no `protect()`
call. The middleware runs on every request, reads the session, and does nothing with it.

**The strongest single piece of evidence** is in the raw response headers
([`../evidence/api-responses/smoke-RUN-2026-10-07-001.json`](../evidence/api-responses/smoke-RUN-2026-10-07-001.json)):

```
x-clerk-auth-status: signed-out
```

present on an API response that granted data-layer access. Clerk knew the caller was
anonymous. Nothing asked.

### What was *not* tested

Be clear about the boundary of this assessment:

* No VAPT tooling — no OWASP ZAP, Burp or nuclei scan was run
* `npm audit` was not run
* Real Clerk authentication was never exercised — no tenant available
* Stored XSS was proven at the storage layer but never rendered in a browser — there is no
  browser in this environment

## Gate 4 — Functionality: FAIL

Four Major defects, all user-visible:

| Finding | Evidence |
| --- | --- |
| The Drafts tab on `/all-posts` is always empty | [BUG-001](../bugs/open/BUG-001-all-posts-drafts-never-shown.md) — code-verified, no test |
| The home Drafts count is always 0 | [BUG-002](../bugs/open/BUG-002-home-drafts-filter-dead.md) — code-verified, no test |
| The byline shows the *reader* as the author | [BUG-003](../bugs/open/BUG-003-article-shows-viewer-as-author.md) — code-verified, no test |
| The manual slug field strips every hyphen as you type | TC-NEG-010 — [BUG-011](../bugs/open/BUG-011-manual-slug-strips-hyphens.md) |

Plus one that actively misleads users: the contact form validates, clears, shows a success
panel — and sends nothing to anyone (TC-UI-012, [BUG-010](../bugs/open/BUG-010-contact-form-has-no-backend.md)).

## Gate 5 — Test coverage: PARTIAL

36.26% of lines, 61.01% of functions, 82.77% of branches — across the tested slice
(`src/components/motion/**` and `src/components/demo/**` are excluded by config).

The distribution is the finding, not the total:

* API routes **94%**, models **100%**, six components at 90–100%
* The four largest pages — 643 lines between them — at **0%**. Three of the four Major bugs
  live there and have no test.
* `src/lib/db.js` at 0%, and it cannot even be imported without `MONGO_URI`

Full breakdown: [coverage.md](coverage.md).

## Gate 6 — Performance: NOT ASSESSED

No load test, no Lighthouse run, no browser. The only timing data is loopback smoke latency
(median 6 ms), which is not TTFB and must not be quoted as such.

The product's own marketing page claims "98 ms median TTFB". Nothing in this repository
substantiates that. `UNKNOWN / REQUIRES VALIDATION`.

## Gate 7 — Operational readiness: FAIL

| Item | Status |
| --- | --- |
| `.env.example` | Absent — [BUG-019](../bugs/open/BUG-019-no-env-example.md) |
| Documented environment contract | Absent; substituted by [../test-tools/setup.md](../test-tools/setup.md) |
| Fail-fast on missing config | Absent — fails at *request* time, site-wide — [BUG-015](../bugs/open/BUG-015-missing-clerk-secret-key-500s-site.md) |
| Database outage recovery | Broken — a rejected connection is cached forever — [BUG-012](../bugs/open/BUG-012-db-caches-rejected-promise.md) |
| Rate limiting | Absent |
| Error reporting / logging | None observed in any route |
| Five unused runtime dependencies, including `firebase-admin` | [BUG-018](../bugs/open/BUG-018-unused-dependencies.md) |

## Gate 8 — Secrets: PASS

Verified this run:

```
git ls-files | grep -iE "\.env|secret|credential|\.pem|\.key$"   → no matches
grep -n "env" .gitignore                                          → line 34: .env*
git grep -IE "(sk_live_|pk_live_|AKIA[0-9A-Z]{16}|-----BEGIN)"    → no matches in application source
```

No committed credentials. `.env*` is gitignored. Every value in `harness/` is a
`${ENV_VAR}` placeholder.

## Verdict

# NOT READY

**Blocking — must be fixed before any public deployment:**

1. [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) — authenticate the API
2. [BUG-005](../bugs/open/BUG-005-idor-draft-exposure.md) — scope reads to the session user
3. [BUG-006](../bugs/open/BUG-006-draft-readable-by-slug.md) — filter drafts from public reads
4. [BUG-007](../bugs/open/BUG-007-mass-assignment-put.md) — allow-list the update body
5. [BUG-008](../bugs/open/BUG-008-upload-no-server-validation.md) — validate MIME and size server-side
6. [BUG-022](../bugs/open/BUG-022-stored-xss-post-content.md) — sanitise before render

Items 1–3 are one change: `clerkMiddleware((auth) => auth().protect())` plus per-route
ownership checks. That single fix closes three bug reports and removes the Critical
exposure.

**Blocking for anything with real users:**

7. [BUG-010](../bugs/open/BUG-010-contact-form-has-no-backend.md) — the form lies about succeeding
8. [BUG-001](../bugs/open/BUG-001-all-posts-drafts-never-shown.md), [BUG-002](../bugs/open/BUG-002-home-drafts-filter-dead.md), [BUG-003](../bugs/open/BUG-003-article-shows-viewer-as-author.md) — three Major, user-visible defects
9. [BUG-011](../bugs/open/BUG-011-manual-slug-strips-hyphens.md) — the slug field destroys its own input

**Should fix before launch, not strictly blocking:**

10. [BUG-013](../bugs/open/BUG-013-api-leaks-internal-errors.md) and [BUG-014](../bugs/open/BUG-014-no-security-headers.md) — error handling and headers
11. [BUG-015](../bugs/open/BUG-015-missing-clerk-secret-key-500s-site.md), [BUG-017](../bugs/open/BUG-017-db-throws-at-import.md), [BUG-019](../bugs/open/BUG-019-no-env-example.md) — the configuration trap
12. [BUG-012](../bugs/open/BUG-012-db-caches-rejected-promise.md) — outage recovery

## What would change this verdict

* Items 1–6 fixed, with their `TC-SEC-*` assertions inverted rather than deleted
* Regression tests written for BUG-001, BUG-002, BUG-003 and BUG-021 **before** those fixes —
  otherwise the fixes are unverifiable
* A browser available, so the stored-XSS chain can be confirmed and the four 0%-coverage
  pages can be tested
* A MongoDB instance, so the seven `BLOCKED` database and integration scenarios become
  executable

With 1–6 done and the security suite green *for the right reasons*, the verdict would move
to **READY WITH RISKS** — the Major UI defects would remain, but nothing private would be
exposed.

## Reassessment

Re-run and re-issue this report after each of the blocking fixes:

```bash
bash harness/automation/scripts/run-all.sh
```
