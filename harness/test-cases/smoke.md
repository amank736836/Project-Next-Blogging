# Live smoke checks

Not Vitest cases. These are 20 sequential HTTP requests fired by
`automation/scripts/api-smoke.mjs` at a **real running build** — `next start`, port 3000.
They prove the application boots and answers over a socket, which no amount of in-process
handler testing can do.

Run: `RUN-2026-10-07-001` · 20 total · **20 passed** · exit code 0.
Raw evidence, including every response header and a body excerpt:
[`../evidence/api-responses/smoke-RUN-2026-10-07-001.json`](../evidence/api-responses/smoke-RUN-2026-10-07-001.json).

## Server configuration for the run

```
MONGO_URI=mongodb://127.0.0.1:27017/harness_smoke?serverSelectionTimeoutMS=1500
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}   # placeholder
CLERK_SECRET_KEY=${CLERK_SECRET_KEY}                                     # placeholder
```

No MongoDB was listening on that port and the Clerk keys were placeholders. That is a
deliberate choice: it exercises the failure paths a real deployment would hit during an
outage, and it produced BUG-013, BUG-015 and BUG-016.

**Four checks below assert *defective* behaviour and carry a bug ID.** Like the `TC-SEC-*`
cases, they pass because the defect is real.

## Page and route reachability

| ID | Request | Expected | Actual | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| SMK-01 | `GET /` | 200, `text/html` | 200, 81 495 bytes | PASS | `x-nextjs-cache: HIT` |
| SMK-02 | `GET /demo` | 200 | 200 | PASS | Public fixture preview |
| SMK-03 | `GET /features` | 200 | 200 | PASS | |
| SMK-04 | `GET /pricing` | 200 | 200 | PASS | |
| SMK-05 | `GET /contact` | 200 | 200 | PASS | |
| SMK-06 | `GET /privacy` | 200 | 200 | PASS | |
| SMK-07 | `GET /terms` | 200 | 200 | PASS | |
| SMK-08 | `GET /login` | 200 | 200 | PASS | Clerk sign-in route renders server-side |
| SMK-09 | `GET /signup` | 200 | 200 | PASS | |
| SMK-10 | `GET /all-posts` | 200 | 200 | PASS | Protected by a *client* gate, so the HTML still serves |
| SMK-11 | `GET /add-post` | 200 | 200 | PASS | Same — see [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) |
| SMK-12 | `GET /harness-route-that-does-not-exist` | 404 | 404 | PASS | `app/not-found.js` |

## API behaviour

| ID | Request | Expected | Actual | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| SMK-13 | `GET /api/posts` | 200 or a clean 503 | **500** `{"error":"connect ECONNREFUSED 127.0.0.1:27017"}` | PASS — documents [BUG-013](../bugs/open/BUG-013-api-leaks-internal-errors.md) | The driver's message reaches the client verbatim |
| SMK-14 | `GET /api/posts/harness-unknown-slug` | 404 `Post not found` | **500** | PASS — documents BUG-013 | The connection is attempted *before* the lookup, so the 404 branch never runs |
| SMK-15 | `POST /api/posts` (anonymous) | 401 | **500** | PASS — documents [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) | A 500 from the database, not a 401 from an auth check. The handler ran. |
| SMK-16 | `DELETE /api/posts/harness-unknown-slug` (anonymous) | 401 | **500** | PASS — documents BUG-004 | Same |
| SMK-17 | `POST /api/upload`, empty multipart, anonymous | 401 | **400** `{"error":"No file provided"}` | PASS — documents [BUG-008](../bugs/open/BUG-008-upload-no-server-validation.md) | No auth challenge. Only the missing file part stopped it. |
| SMK-18 | `GET /api/posts`, inspect `WWW-Authenticate` | a challenge | **absent** | PASS — documents BUG-004 | Nothing in the app ever challenges |
| SMK-20 | `POST /api/upload` with a JSON body | 400 or 415 | **500** `{"error":"Content-Type was not one of \"multipart/form-data\" or \"application/x-www-form-urlencoded\"."}` | PASS — documents [BUG-016](../bugs/open/BUG-016-upload-non-multipart-500.md) | `request.formData()` throws before the 400 branch |

## Header inventory

| ID | Request | Result | Status |
| --- | --- | --- | --- |
| SMK-19 | `GET /`, record every security-relevant header | All seven of CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` are **absent**; `X-Powered-By: Next.js` **is present** | PASS — documents [BUG-014](../bugs/open/BUG-014-no-security-headers.md) |

Headers actually observed on `SMK-19`: `cache-control: s-maxage=31536000`, `content-encoding: gzip`,
`content-type: text/html; charset=utf-8`, `etag`, `vary`, `x-clerk-auth-reason: dev-browser-missing`,
`x-clerk-auth-status: signed-out`, `x-middleware-rewrite: /`, `x-nextjs-cache: HIT`,
`x-nextjs-prerender: 1, 1`, `x-nextjs-stale-time: 300`, `x-powered-by: Next.js`.

## Reproducing

```bash
npm run build
MONGO_URI="mongodb://127.0.0.1:27017/harness_smoke?serverSelectionTimeoutMS=1500" \
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<placeholder>" \
CLERK_SECRET_KEY="<placeholder>" \
  npx next start -H 0.0.0.0 -p 3000 &
HARNESS_RUN_ID=RUN-<date>-<n> node harness/automation/scripts/api-smoke.mjs
echo "exit=$?"     # equals the number of failed checks
```

Omitting `CLERK_SECRET_KEY` makes **every** route return 500, including the static marketing
pages — [BUG-015](../bugs/open/BUG-015-missing-clerk-secret-key-500s-site.md). Omitting
`serverSelectionTimeoutMS` makes each API check block ~30 s.
