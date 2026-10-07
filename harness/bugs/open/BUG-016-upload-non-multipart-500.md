# BUG-016 — A non-multipart upload answers 500 instead of 400/415

| Field | Value |
| --- | --- |
| Bug ID | BUG-016 |
| Title | A non-multipart upload answers 500 instead of 400/415 |
| Severity | Low |
| Priority | P3 |
| Status | OPEN |
| Feature | [FEAT-005](../../features/FEAT-005-image-upload/README.md) |
| Requirement | REQ-NF-02 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | Live, against the production build |
| Reported in | RUN-2026-10-07-001 |
| Test | SMK-20 |
| Evidence | `evidence/api-responses/smoke-RUN-2026-10-07-001.json`, entry `SMK-20` |
| Fix | Check `content-type` before calling `request.formData()` |
| Regression test | Invert SMK-20 to expect `415` |

## Observed behaviour

`SMK-20` posts a JSON body to `/api/upload` and receives:

```
500 {"error":"Content-Type was not one of \"multipart/form-data\" or \"application/x-www-form-urlencoded\"."}
```

The undici parse error, verbatim, at the wrong status.

## Expected behaviour

`415 Unsupported Media Type`, or `400` with a plain message.

## Steps to reproduce

```bash
curl -si -X POST http://127.0.0.1:3000/api/upload \
  -H 'content-type: application/json' -d '{}'
```

## Root cause

`src/app/api/upload/route.js:6` calls `await request.formData()` as the first statement,
inside the `try`. With a non-multipart content type it throws, and the blanket
`catch` at `:30-31` turns it into `500` with `error.message` — the same shape as
[BUG-013](BUG-013-api-leaks-internal-errors.md).

The correct branch *does* exist at `:9-11` (`400 No file provided`) — `SMK-17` reaches it by
sending a real, empty multipart body. The bug is only that a wrong content type never gets
that far.

## Notes

Small, and easy to miss because the neighbouring case works. Worth fixing alongside BUG-013,
since both are the same blanket-catch pattern.

This is also the reason the smoke script has two separate upload checks: `SMK-17` (real
multipart, no file → `400`) and `SMK-20` (JSON body → `500`). Writing only one of them would
have hidden the other.
