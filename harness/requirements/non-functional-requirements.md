# Non-Functional Requirements

Several of these are stated by the project itself (in `README.md` or in code comments);
others are baseline expectations for a public web application that accepts and re-renders
user HTML. Each is marked with which applies.

| ID | Requirement | Origin | Status | Evidence |
| --- | --- | --- | --- | --- |
| REQ-NF-01 | The app must build and run with only the documented environment variables. | `README.md` §Getting started | **VIOLATED** — three separate hard failures, none documented: `MONGO_URI` breaks the build, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` breaks prerendering, `CLERK_SECRET_KEY` 500s every route | [BUG-017](../bugs/open/BUG-017-db-throws-at-import.md), [BUG-015](../bugs/open/BUG-015-missing-clerk-secret-key-500s-site.md) |
| REQ-NF-02 | API error responses must not disclose internal detail (hosts, ports, driver messages, stack frames). | Baseline | **VIOLATED** — `GET /api/posts` returned `{"error":"connect ECONNREFUSED 127.0.0.1:27017"}` in the live run | [SMK-13](../evidence/api-responses/), [BUG-013](../bugs/open/BUG-013-api-leaks-internal-errors.md) |
| REQ-NF-03 | Every mutating endpoint must authenticate and authorise the caller. | Baseline | **VIOLATED** | [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) |
| REQ-NF-04 | User-supplied HTML must be sanitised before being rendered to other visitors. | Baseline | **VIOLATED** — `html-react-parser` performs no sanitisation and none is applied | [BUG-022](../bugs/open/BUG-022-stored-xss-post-content.md) |
| REQ-NF-05 | Responses must carry the standard security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) and must not advertise the framework. | Baseline | **VIOLATED** — all seven headers absent; `X-Powered-By: Next.js` present | [SMK-19](../test-results/latest/smoke-result.json), [BUG-014](../bugs/open/BUG-014-no-security-headers.md) |
| REQ-NF-06 | All motion must be disabled when the visitor requests reduced motion, and nothing may be hidden as a result. | `README.md` §Motion; `src/lib/motion.js` | IMPLEMENTED — `usePrefersReducedMotion()` gates every build; GSAP helpers skip entirely | Code-verified; exercised indirectly by the whole DOM suite, which runs in that mode |
| REQ-NF-07 | Remote images must be served through `next/image` with an explicit host allow-list. | `next.config.mjs` | IMPLEMENTED — `remotePatterns` permits only `https://res.cloudinary.com/**` | Code-verified |
| REQ-NF-08 | No secrets in the repository. | Baseline | IMPLEMENTED — `.env*` is gitignored; the harness stores placeholders only | [reports/release-readiness.md](../reports/release-readiness.md) §Secrets scan |
| REQ-NF-09 | A failed client fetch must degrade to an empty state, never a crash. | Code intent | IMPLEMENTED — `page.js:32` and `all-posts/page.js:41` both `.catch(() => setPosts([]))` | Code-verified; no automated test yet |
| REQ-NF-10 | The database connection must be reused across warm invocations and must recover from a transient outage. | `src/lib/db.js` | **PARTIAL** — reuse works via `global.mongoose`; recovery does **not**, because a rejected promise is cached forever | [BUG-012](../bugs/open/BUG-012-db-caches-rejected-promise.md) |
| REQ-NF-11 | `GET /api/posts` must not return an unbounded result set. | Baseline | **VIOLATED** — no limit, no pagination, no projection | Code-verified in `api/posts/route.js:20` |
| REQ-NF-12 | Font loading must not cause layout shift or third-party requests. | `README.md` §Design system | IMPLEMENTED — three self-hosted `@fontsource-variable/*` families | Code-verified |

## Performance targets

The project's own marketing copy asserts numbers that have **never been measured**:

| Claim | Where | Measured? |
| --- | --- | --- |
| "98 ms median TTFB" | `src/app/features/page.js:47` | **No** — `UNKNOWN / REQUIRES VALIDATION` |
| "Time to first post: under 4 minutes" | `src/app/features/page.js:38` | No |
| "Images: auto-optimised CDN" | `src/app/features/page.js:39` | Plausible (Cloudinary + `next/image`) but unmeasured |

These are product claims, not test results. Nothing in this harness reports them as
verified. See [test-scenarios/performance.md](../test-scenarios/performance.md) for the
measurements that would be needed.
