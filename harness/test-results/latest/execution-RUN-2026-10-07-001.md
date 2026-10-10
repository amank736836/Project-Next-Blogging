# Execution record — RUN-2026-10-07-001

The only execution this harness has performed. Every number on this page was read back
out of the two result files below, not written by hand.

| | |
| --- | --- |
| Run ID | `RUN-2026-10-07-001` |
| Date | 2026-10-07 |
| Executed by | Arena agent, in the sandbox at `/home/user/Project-Next-Blogging` |
| Branch | `arena/da51fd83-project-next-blogging` |
| Commit under test | `9d413cd` (application source unmodified) |
| Node | v22.22.3 · npm 10.9.8 |
| Vitest started | 2026-10-07T04:52:19.735Z |
| Smoke executed | 2026-10-07T04:51:07.013Z |
| Vitest results | [`vitest-results.json`](vitest-results.json) |
| Smoke results | [`smoke-result.json`](smoke-result.json) |
| Smoke evidence | [`../../evidence/api-responses/smoke-RUN-2026-10-07-001.json`](../../evidence/api-responses/smoke-RUN-2026-10-07-001.json) |

## Summary

| Suite | Total | Passed | Failed | Blocked | Not Run | Pass rate | Exit code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Vitest | 92 | 92 | 0 | 0 | 0 | 100% | 0 |
| Live smoke | 20 | 20 | 0 | 0 | 0 | 100% | 0 |
| **Combined** | **112** | **112** | **0** | **0** | **0** | **100%** | **0** |

31 test suites collected, 31 passed, 0 failed.

The suites were executed more than once on 2026-10-07 while the harness was being built.
This record reflects the **latest** execution, and the timestamps above are read from the
result files rather than written by hand. Two runs are on disk:

| Run ID | What it was | Result |
| --- | --- | --- |
| `RUN-2026-10-07-001` | The canonical run this record documents | 92/92 + 20/20 |
| `RUN-2026-10-07-044646` | Verification re-run via `automation/scripts/run-all.sh` after the last edit | 92/92 + 20/20, 0 failing stages |

The second run's evidence is at
[`../../evidence/api-responses/smoke-RUN-2026-10-07-044646.json`](../../evidence/api-responses/smoke-RUN-2026-10-07-044646.json).
Both runs agree; nothing was edited between them except a comment in a test file.

> **A 100% pass rate is not a clean bill of health.** Nine Vitest cases and seven smoke
> checks pass *because they assert that a protection is missing*. They are wired to bug
> IDs. See [../../reports/release-readiness.md](../../reports/release-readiness.md) — the
> verdict there is **NOT READY**.

## Environment

| | |
| --- | --- |
| Vitest environment | jsdom (UI), node (API and database files, via pragma) |
| Smoke target | `http://127.0.0.1:3000`, production build served by `next start -H 0.0.0.0` |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/harness_smoke?serverSelectionTimeoutMS=1500` — **nothing listening** |
| Clerk keys | placeholders — no tenant |
| Cloudinary | placeholders — no account |
| MongoDB server | **unavailable** |
| Browser | **unavailable** |

Those four absences account for every `BLOCKED` in
[../../test-scenarios/](../../test-scenarios/README.md).

## Vitest — by file

| File | Checks | Duration | Result |
| --- | --- | --- | --- |
| `api/posts-collection.test.js` | 10 | 0.03 s | PASSED |
| `api/posts-slug.test.js` | 11 | 0.02 s | PASSED |
| `api/upload.test.js` | 5 | 0.02 s | PASSED |
| `database/post-schema.test.js` | 18 | 0.01 s | PASSED |
| `ui/auth-gate.test.jsx` | 6 | 0.08 s | PASSED |
| `ui/contact-form.test.jsx` | 9 | 6.02 s | PASSED |
| `ui/header-nav.test.jsx` | 6 | 0.52 s | PASSED |
| `ui/post-card.test.jsx` | 8 | 0.15 s | PASSED |
| `ui/post-form.test.jsx` | 13 | 3.11 s | PASSED |
| `ui/theme.test.jsx` | 6 | 0.17 s | PASSED |
| **Total** | **92** | **10.14 s** | **PASS** |

Wall-clock duration is not recorded per run in the JSON reporter output; the figures
above are the sum of per-file durations.

## Vitest — every check

| TC ID | Title | File | Result |
| --- | --- | --- | --- |
| TC-API-001 | returns only published (status=active) posts when no query is sent | `api/posts-collection.test.js` | PASSED |
| TC-API-002 | honours an explicit status=inactive filter and returns the draft | `api/posts-collection.test.js` | PASSED |
| TC-API-003 | scopes results to userId when the parameter is supplied | `api/posts-collection.test.js` | PASSED |
| TC-API-004 | returns an empty array (not an error) for a user with no posts | `api/posts-collection.test.js` | PASSED |
| TC-SEC-002 | [BUG-005] exposes another writer's drafts via ?userId= — no auth check exists | `api/posts-collection.test.js` | PASSED |
| TC-API-005 | creates a post and answers 201 with the stored document | `api/posts-collection.test.js` | PASSED |
| TC-NEG-001 | rejects a payload missing the required title with 500 and an error message | `api/posts-collection.test.js` | PASSED |
| TC-NEG-002 | rejects a duplicate slug instead of silently overwriting | `api/posts-collection.test.js` | PASSED |
| TC-NEG-003 | answers 500 (not 400) on malformed JSON — there is no body guard | `api/posts-collection.test.js` | PASSED |
| TC-SEC-003 | [BUG-004] accepts an arbitrary userId — the endpoint is mass-assignable and unauthenticated | `api/posts-collection.test.js` | PASSED |
| TC-API-006 | returns the full document for a known slug with 200 | `api/posts-slug.test.js` | PASSED |
| TC-API-007 | answers 404 with { error: "Post not found" } for an unknown slug | `api/posts-slug.test.js` | PASSED |
| TC-SEC-004 | [BUG-006] serves a DRAFT to any anonymous caller — the route ignores status | `api/posts-slug.test.js` | PASSED |
| TC-API-008 | updates the matched fields and returns the new document | `api/posts-slug.test.js` | PASSED |
| TC-API-009 | answers 404 when updating an unknown slug and changes nothing | `api/posts-slug.test.js` | PASSED |
| TC-SEC-005 | [BUG-004] lets any caller overwrite a post owned by someone else | `api/posts-slug.test.js` | PASSED |
| TC-SEC-006 | [BUG-007] accepts fields that are not in the schema (mass assignment, no runValidators) | `api/posts-slug.test.js` | PASSED |
| TC-NEG-004 | answers 500 on malformed JSON instead of 400 | `api/posts-slug.test.js` | PASSED |
| TC-API-010 | deletes the post and returns a confirmation message | `api/posts-slug.test.js` | PASSED |
| TC-API-011 | answers 404 on the second delete of the same slug (idempotency guard) | `api/posts-slug.test.js` | PASSED |
| TC-SEC-007 | [BUG-004] deletes any writer's post without authentication | `api/posts-slug.test.js` | PASSED |
| TC-API-012 | uploads a file and returns { fileId, url } | `api/upload.test.js` | PASSED |
| TC-API-013 | stores every upload under the blog_posts folder | `api/upload.test.js` | PASSED |
| TC-API-014 | answers 400 with { error: "No file provided" } when the part is absent | `api/upload.test.js` | PASSED |
| TC-NEG-005 | surfaces a Cloudinary failure as 500 with the provider message | `api/upload.test.js` | PASSED |
| TC-SEC-008 | [BUG-008] accepts ANY MIME type server-side — validation is client-only | `api/upload.test.js` | PASSED |
| TC-DB-001 | declares exactly the six business fields plus timestamps | `database/post-schema.test.js` | PASSED |
| TC-DB-002 | marks title, slug, content, featuredImage and userId as required | `database/post-schema.test.js` | PASSED |
| TC-DB-003 | constrains status to the enum [active, inactive] with default active | `database/post-schema.test.js` | PASSED |
| TC-DB-004 | puts a UNIQUE index on slug | `database/post-schema.test.js` | PASSED |
| TC-DB-005 | enables timestamps so createdAt/updatedAt exist for archive sorting | `database/post-schema.test.js` | PASSED |
| TC-DB-006 | stores userId as a String (Clerk id), not an ObjectId reference | `database/post-schema.test.js` | PASSED |
| TC-DB-007 | accepts a fully populated, valid document | `database/post-schema.test.js` | PASSED |
| TC-DB-008 | rejects a document missing the required field "title" | `database/post-schema.test.js` | PASSED |
| TC-DB-008 | rejects a document missing the required field "slug" | `database/post-schema.test.js` | PASSED |
| TC-DB-008 | rejects a document missing the required field "content" | `database/post-schema.test.js` | PASSED |
| TC-DB-008 | rejects a document missing the required field "featuredImage" | `database/post-schema.test.js` | PASSED |
| TC-DB-008 | rejects a document missing the required field "userId" | `database/post-schema.test.js` | PASSED |
| TC-DB-009 | rejects a status outside the enum | `database/post-schema.test.js` | PASSED |
| TC-EDGE-001 | rejects an empty string for every required String field | `database/post-schema.test.js` | PASSED |
| TC-EDGE-005 | rejects a whitespace-only string only when the field is required — no trim/length rule exists | `database/post-schema.test.js` | PASSED |
| TC-EDGE-002 | accepts a 2000-character title and a 1 MB body (no length limits defined) | `database/post-schema.test.js` | PASSED |
| TC-EDGE-003 | accepts markup in title/content verbatim — the schema performs no sanitisation | `database/post-schema.test.js` | PASSED |
| TC-EDGE-004 | does not lowercase or normalise slug — uniqueness is byte-exact | `database/post-schema.test.js` | PASSED |
| TC-UI-001 | renders children and never redirects for a signed-in writer | `ui/auth-gate.test.jsx` | PASSED |
| TC-UI-002 | redirects an anonymous visitor to /login | `ui/auth-gate.test.jsx` | PASSED |
| TC-UI-003 | shows the branded waiting state — not the content — while Clerk is still loading | `ui/auth-gate.test.jsx` | PASSED |
| TC-UI-004 | does not flash protected content on the transition from loading to signed-out | `ui/auth-gate.test.jsx` | PASSED |
| TC-UI-005 | redirects an already-signed-in visitor away to / | `ui/auth-gate.test.jsx` | PASSED |
| TC-UI-006 | renders children for an anonymous visitor in inverse mode | `ui/auth-gate.test.jsx` | PASSED |
| TC-UI-007 | blocks submission and names all three missing fields when the form is empty | `ui/contact-form.test.jsx` | PASSED |
| TC-NEG-006 | rejects a name shorter than 2 characters | `ui/contact-form.test.jsx` | PASSED |
| TC-NEG-007 | rejects an email without a domain | `ui/contact-form.test.jsx` | PASSED |
| TC-EDGE-006 | rejects a message of 11 characters and accepts exactly 12 | `ui/contact-form.test.jsx` | PASSED |
| TC-UI-008 | marks the message field invalid for assistive technology | `ui/contact-form.test.jsx` | PASSED |
| TC-UI-009 | accepts valid input, clears the fields and shows the success state | `ui/contact-form.test.jsx` | PASSED |
| TC-UI-010 | "Write another" returns to an empty form | `ui/contact-form.test.jsx` | PASSED |
| TC-UI-011 | switches the topic chip and keeps it in the pressed state | `ui/contact-form.test.jsx` | PASSED |
| TC-UI-012 | [BUG-010] reports success without ever sending anything — the form has no backend | `ui/contact-form.test.jsx` | PASSED |
| TC-UI-023 | offers Log in and Start writing, and no writer links | `ui/header-nav.test.jsx` | PASSED |
| TC-UI-024 | always shows the three public marketing links | `ui/header-nav.test.jsx` | PASSED |
| TC-UI-025 | adds Stories and Write, and drops Log in / Start writing | `ui/header-nav.test.jsx` | PASSED |
| TC-UI-026 | renders the Clerk UserButton only when signed in | `ui/header-nav.test.jsx` | PASSED |
| TC-UI-027 | toggles aria-expanded and locks body scroll while open | `ui/header-nav.test.jsx` | PASSED |
| TC-UI-028 | closes on Escape and restores the previous overflow value | `ui/header-nav.test.jsx` | PASSED |
| TC-UI-013 | renders the title and links the whole tile to /post/<slug> | `ui/post-card.test.jsx` | PASSED |
| TC-UI-014 | estimates reading time at ~220 wpm, rounded, minimum 1 minute | `ui/post-card.test.jsx` | PASSED |
| TC-EDGE-007 | floors an almost-empty post at 1 minute rather than 0 | `ui/post-card.test.jsx` | PASSED |
| TC-EDGE-008 | renders "undated" instead of Invalid Date for a missing/invalid createdAt | `ui/post-card.test.jsx` | PASSED |
| TC-UI-015 | badges a draft card and omits the badge on a published one | `ui/post-card.test.jsx` | PASSED |
| TC-UI-016 | shows an Edit link only to the post's own author | `ui/post-card.test.jsx` | PASSED |
| TC-SEC-009 | hides the Edit link from a signed-in reader who is not the author | `ui/post-card.test.jsx` | PASSED |
| TC-SEC-010 | hides the Edit link from anonymous visitors | `ui/post-card.test.jsx` | PASSED |
| TC-UI-029 | renders the composer in publish mode with an empty form | `ui/post-form.test.jsx` | PASSED |
| TC-UI-030 | derives the slug from the title: lowercased, punctuation dropped, spaces dashed | `ui/post-form.test.jsx` | PASSED |
| TC-UI-031 | shows a live word count and a 220 wpm reading estimate | `ui/post-form.test.jsx` | PASSED |
| TC-NEG-008 | blocks submit and asks for a title when it is empty | `ui/post-form.test.jsx` | PASSED |
| TC-NEG-009 | blocks submit and asks for a frame when no image is attached | `ui/post-form.test.jsx` | PASSED |
| TC-EDGE-009 | rejects an image larger than the 8 MB limit and never uploads it | `ui/post-form.test.jsx` | PASSED |
| TC-UI-032 | uploads, creates and navigates to /post/<slug> on a valid submit | `ui/post-form.test.jsx` | PASSED |
| TC-UI-033 | hands the writer control of the slug, then "auto" gives it back | `ui/post-form.test.jsx` | PASSED |
| TC-NEG-010 | [BUG-011] the manual slug field strips every hyphen as it is typed | `ui/post-form.test.jsx` | PASSED |
| TC-UI-034 | pre-fills every field, drops the image requirement and offers delete | `ui/post-form.test.jsx` | PASSED |
| TC-UI-035 | saves without re-uploading and keeps the original slug | `ui/post-form.test.jsx` | PASSED |
| TC-UI-036 | deletes only on the second click (arm-then-confirm) and disarms after 4.5 s | `ui/post-form.test.jsx` | PASSED |
| TC-UI-037 | an armed delete disarms itself after the 4.5 s window | `ui/post-form.test.jsx` | PASSED |
| TC-UI-017 | starts in light mode when nothing is stored | `ui/theme.test.jsx` | PASSED |
| TC-UI-018 | toggling flips the <html> class, the context value and localStorage together | `ui/theme.test.jsx` | PASSED |
| TC-UI-019 | a second toggle returns to light and persists that too | `ui/theme.test.jsx` | PASSED |
| TC-UI-020 | setTheme("dark") is idempotent — repeated calls do not drift | `ui/theme.test.jsx` | PASSED |
| TC-UI-021 | reports mounted=true once hydrated in a browser | `ui/theme.test.jsx` | PASSED |
| TC-UI-022 | useTheme() outside a provider degrades to a light no-op instead of throwing | `ui/theme.test.jsx` | PASSED |

## Live smoke — every check

| ID | Check | Request | Status | ms | Documents | Result |
| --- | --- | --- | --- | --- | --- | --- |
| SMK-01 | GET / serves the landing shell | `GET /` | 200 | 44 | — | PASS |
| SMK-02 | GET /demo serves the fixture preview | `GET /demo` | 200 | 9 | — | PASS |
| SMK-03 | GET /features | `GET /features` | 200 | 7 | — | PASS |
| SMK-04 | GET /pricing | `GET /pricing` | 200 | 7 | — | PASS |
| SMK-05 | GET /contact | `GET /contact` | 200 | 7 | — | PASS |
| SMK-06 | GET /privacy | `GET /privacy` | 200 | 7 | — | PASS |
| SMK-07 | GET /terms | `GET /terms` | 200 | 10 | — | PASS |
| SMK-08 | GET /login renders the Clerk sign-in route | `GET /login` | 200 | 7 | — | PASS |
| SMK-09 | GET /signup renders the Clerk sign-up route | `GET /signup` | 200 | 7 | — | PASS |
| SMK-10 | GET /all-posts is server-renderable (client gate runs after hydration) | `GET /all-posts` | 200 | 5 | — | PASS |
| SMK-11 | GET /add-post is server-renderable (client gate runs after hydration) | `GET /add-post` | 200 | 5 | — | PASS |
| SMK-12 | GET an unknown route returns 404 | `GET /harness-route-that-does-not-exist` | 404 | 5 | — | PASS |
| SMK-13 | GET /api/posts answers 500 with a leaked internal message when Mongo is unreachable | `GET /api/posts` | 500 | 6 | [BUG-013](../../bugs/open/BUG-013-api-leaks-internal-errors.md) | PASS |
| SMK-14 | GET /api/posts/<unknown slug> also 500s (connection is attempted before the lookup) | `GET /api/posts/harness-unknown-slug` | 500 | 6 | [BUG-013](../../bugs/open/BUG-013-api-leaks-internal-errors.md) | PASS |
| SMK-15 | POST /api/posts is reachable with no credentials at all | `POST /api/posts` | 500 | 7 | [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md) | PASS |
| SMK-16 | DELETE /api/posts/<slug> is reachable with no credentials at all | `DELETE /api/posts/harness-unknown-slug` | 500 | 5 | [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md) | PASS |
| SMK-17 | POST /api/upload with a multipart body but no file part answers 400 | `POST /api/upload` | 400 | 7 | — | PASS |
| SMK-20 | POST /api/upload with a non-multipart body 500s instead of 400/415 | `POST /api/upload` | 500 | 6 | [BUG-016](../../bugs/open/BUG-016-upload-non-multipart-500.md) | PASS |
| SMK-18 | GET /api/posts emits no WWW-Authenticate challenge | `GET /api/posts` | 500 | 5 | [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md) | PASS |
| SMK-19 | Security header inventory on GET / (recorded, not asserted) | `GET /` | 200 | 6 | [BUG-014](../../bugs/open/BUG-014-no-security-headers.md) | PASS |

## Coverage at this run

From [`coverage/coverage-summary.json`](coverage/coverage-summary.json) — generated, and
gitignored. `src/components/motion/**` and `src/components/demo/**` are **excluded** by
`harness/vitest.config.mjs`.

| Metric | Covered | Total | % |
| --- | --- | --- | --- |
| lines | 1648 | 4544 | 36.26% |
| statements | 1648 | 4544 | 36.26% |
| functions | 72 | 118 | 61.01% |
| branches | 298 | 360 | 82.77% |

Per-file breakdown and the 0%-coverage list: [../../reports/coverage.md](../../reports/coverage.md).

## What this run did not cover

* **No browser.** Zero screenshots, zero videos, no accessibility tree inspection, no
  paint metrics. [`../../evidence/screenshots/README.md`](../../evidence/screenshots/README.md)
  states this plainly rather than substituting something else.
* **No MongoDB.** Every database test is schema-level or fake-backed. No `E11000`, no
  real index, no query-operator behaviour.
* **No Clerk tenant.** Authentication was mocked in every case that touches it.
* **No Cloudinary account.** The provider was mocked; the live upload checks failed on
  credentials, which is itself a finding, but no upload was ever stored.
* **No load, no soak, no concurrency.** One sequential request at a time.

## Reproducing

```bash
npm install
npm test                    # 92 checks, exit 0
npm run test:coverage       # writes latest/coverage/

npm run build               # requires MONGO_URI and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
MONGO_URI="mongodb://127.0.0.1:27017/harness_smoke?serverSelectionTimeoutMS=1500" \
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<placeholder>" \
CLERK_SECRET_KEY="<placeholder>" \
  npx next start -H 0.0.0.0 -p 3000 &
HARNESS_RUN_ID=RUN-2026-10-07-001 node harness/automation/scripts/api-smoke.mjs
```

Omitting `CLERK_SECRET_KEY` makes every route return 500 — see
[BUG-015](../../bugs/open/BUG-015-missing-clerk-secret-key-500s-site.md).
