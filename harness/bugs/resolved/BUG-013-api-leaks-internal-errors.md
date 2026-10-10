# BUG-013 — 500 responses echo the raw driver error to the client

| Field | Value |
| --- | --- |
| Bug ID | BUG-013 |
| Title | 500 responses echo the raw driver error to the client |
| Severity | Medium |
| Priority | P2 |
| Status | RESOLVED |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md), [FEAT-005](../../features/FEAT-005-image-upload/README.md) |
| Requirement | REQ-NF-02, REQ-025 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | Live, against the production build; and in-process |
| Reported in | RUN-2026-10-07-001 |
| Test | TC-NEG-001, TC-NEG-003, TC-NEG-004, SMK-13, SMK-14 |
| Evidence | `evidence/api-responses/smoke-RUN-2026-10-07-001.json`, entries `SMK-13`/`SMK-14` |
| Fix | Map errors to status codes; return a generic message; log the detail server-side |
| Regression test | Invert TC-NEG-003/004 to expect `400`; add a case asserting no internal detail in any 5xx body |

## Observed behaviour

`SMK-13` asked for `/api/posts` with no MongoDB listening and received:

```
500 {"error":"connect ECONNREFUSED 127.0.0.1:27017"}
```

The host, the port and the driver's own wording, straight to the caller. `SMK-20` leaked the
undici parse error the same way. `TC-NEG-005` shows a Cloudinary provider message reaching
the client verbatim.

Separately, every one of these should not be a 500 at all. `TC-NEG-001` (missing required
field), `TC-NEG-003` and `TC-NEG-004` (malformed JSON) are client errors returning `500`.

## Expected behaviour

`400` for a bad payload in the application's own words; `503` for a database outage; no host, port, stack or driver text in any response.

## Steps to reproduce

```bash
curl -s http://127.0.0.1:3000/api/posts
curl -s -X POST http://127.0.0.1:3000/api/posts \
  -H 'content-type: application/json' --data '{"title":'
```

## Root cause

All five handlers end in the same shape — for example
`src/app/api/posts/route.js:19-21`:

```js
} catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
}
```

Two problems in one line: `error.message` is returned unfiltered, and the status is
hard-coded to `500` regardless of what was caught. A Mongoose `ValidationError`, a JSON
parse error and a connection failure all become the same thing.

## Notes

The information leak is the security half; the wrong status code is the correctness half,
and they need different fixes. A central `handleApiError(error)` helper would close both:
inspect the error type, map it to `400`/`404`/`503`, return a safe message, log the rest.

`SMK-14` is the interesting one: an unknown slug should be a `404`, and the route *has* a 404
branch. It returns `500` because `dbConnect()` is awaited **before** the lookup, so the
outage pre-empts it.
