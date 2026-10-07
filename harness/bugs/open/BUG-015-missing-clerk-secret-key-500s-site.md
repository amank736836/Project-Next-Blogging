# BUG-015 — A missing `CLERK_SECRET_KEY` takes the entire site down

| Field | Value |
| --- | --- |
| Bug ID | BUG-015 |
| Title | A missing `CLERK_SECRET_KEY` takes the entire site down |
| Severity | Medium |
| Priority | P3 |
| Status | OPEN |
| Feature | infrastructure |
| Requirement | REQ-NF-01 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | Live, `next start` with the variable unset |
| Reported in | RUN-2026-10-07-001 |
| Test | none — verified by log |
| Evidence | [`evidence/logs/RUN-2026-10-07-001-missing-clerk-secret-key.log`](../../evidence/logs/RUN-2026-10-07-001-missing-clerk-secret-key.log) |
| Fix | Fail fast at boot with a clear message, or degrade gracefully on public routes |
| Regression test | Add a smoke pre-flight that asserts `/` returns 200 before running the suite |

## Observed behaviour

With `CLERK_SECRET_KEY` unset, **every** route returns `500` — including `/`, `/features`
and `/pricing`, which are static marketing pages with no auth involvement. The verbatim
server log is committed as evidence.

## Expected behaviour

Public pages serve normally. At worst, auth-dependent routes fail — ideally with a clear startup error rather than a runtime 500 on every request.

## Steps to reproduce

```bash
npm run build   # with MONGO_URI and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY set
npx next start -H 0.0.0.0 -p 3000     # CLERK_SECRET_KEY deliberately unset
curl -si http://127.0.0.1:3000/ | head -1   # HTTP/1.1 500
```

## Root cause

`src/proxy.js` installs `clerkMiddleware()` with the matcher
`["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]`. That matcher covers every non-asset
request, so the middleware runs on `/` too — and it throws when the secret key is absent.

The build succeeds because prerendering does not execute the middleware. The failure appears
only at request time, which is the worst possible moment to discover it.

## Notes

Operationally this is a deployment trap: a missing secret produces a site-wide outage whose
symptom looks like a rendering bug rather than a configuration error.

The practical consequence for this harness: the smoke script **cannot run** without a
placeholder `CLERK_SECRET_KEY`, which is documented in
[../../test-tools/setup.md](../../test-tools/setup.md).

A build-time assertion (`if (!process.env.CLERK_SECRET_KEY) throw …` in a config or
instrumentation hook) would turn a runtime outage into a failed deploy.
