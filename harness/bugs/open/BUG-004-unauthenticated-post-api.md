# BUG-004 — The post API has no authentication or ownership check

| Field | Value |
| --- | --- |
| Bug ID | BUG-004 |
| Title | The post API has no authentication or ownership check |
| Severity | **Critical** |
| Priority | P0 |
| Status | OPEN |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md), [FEAT-001](../../features/FEAT-001-authentication/README.md) |
| Requirement | REQ-023, REQ-025 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | Production build, `next start`; and in-process against the real handlers |
| Reported in | RUN-2026-10-07-001 |
| Test | TC-SEC-003, TC-SEC-005, TC-SEC-007, SMK-15, SMK-16, SMK-18 |
| Evidence | `evidence/api-responses/smoke-RUN-2026-10-07-001.json`, entries `SMK-15`/`SMK-16`/`SMK-18` |
| Fix | Authenticate in the middleware, then scope every query to the session user |
| Regression test | Invert TC-SEC-003/005/007 to expect `401`/`403` |

## Observed behaviour

Every mutating endpoint on `/api/posts` and `/api/posts/[slug]` accepts an anonymous
request. `POST` additionally stores whatever `userId` the caller supplies, so a stranger can
publish as anyone. `PUT` overwrites and `DELETE` removes any post in the collection.

The live smoke run confirms it at the HTTP layer: `SMK-15` (`POST /api/posts`) and `SMK-16`
(`DELETE /api/posts/<slug>`) both reached the data layer with no credentials. They returned
500 only because no MongoDB was listening — the auth check never existed to reject them.
`SMK-18` inspects the same response for a `WWW-Authenticate` header and finds none.

The response headers are the clearest evidence of all:
`x-clerk-auth-status: signed-out` is present on a response that granted data-layer access.
Clerk *knew* the caller was anonymous. The route never asked.

## Expected behaviour

`401` without a session. `403` for a session belonging to someone else. `userId` taken from
the authenticated session, never from the request body.

## Steps to reproduce

```bash
BASE=http://127.0.0.1:3000

# publish as an arbitrary user, with no credentials
curl -si -X POST "$BASE/api/posts" -H 'content-type: application/json' \
  -d '{"title":"x","slug":"x","content":"x","featuredImage":"x","userId":"victim-uid"}'

# overwrite someone else's post
curl -si -X PUT "$BASE/api/posts/any-slug" -H 'content-type: application/json' \
  -d '{"title":"taken over"}'

# delete it
curl -si -X DELETE "$BASE/api/posts/any-slug"
```

## Root cause

`src/proxy.js` is three lines:

```js
import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware();
export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

`clerkMiddleware()` *reads* the session and populates `auth()`. It does not **protect**
anything — that needs `clerkMiddleware((auth) => auth().protect())`, or an equivalent
`requireAuth()` in each handler. The matcher already covers `/(api|trpc)(.*)`, so the
middleware runs on every API request and does nothing with the result.

None of the three route files import `auth` from `@clerk/nextjs/server`. `POST` passes the
raw request body straight to `Post.create(body)`
(`src/app/api/posts/route.js:28`), which is why `userId` is mass-assignable.

## Notes

This is the root cause of the whole authorisation cluster. BUG-005, BUG-006, BUG-007 and
BUG-008 are all downstream of it. Fixing the middleware closes four bug reports at once,
which is why it is P0 and why the individual routes should not be patched first — a
per-route fix leaves the next route someone adds just as open.

The client-side `AuthLayout` gate is not a control. `SMK-10` and `SMK-11` show that
`/all-posts` and `/add-post` return `200` with full HTML to an anonymous caller; the gate
runs after hydration and only hides the interface.
