# BUG-008 — Upload accepts any MIME type and any size, unauthenticated

| Field | Value |
| --- | --- |
| Bug ID | BUG-008 |
| Title | Upload accepts any MIME type and any size, unauthenticated |
| Severity | High |
| Priority | P1 |
| Status | OPEN |
| Feature | [FEAT-005](../../features/FEAT-005-image-upload/README.md) |
| Requirement | REQ-029, REQ-NF-03 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | In-process against the real handler with a mocked provider; and live via SMK-17 |
| Reported in | RUN-2026-10-07-001 |
| Test | TC-SEC-008, SMK-17 |
| Evidence | `automation/api/upload.test.js`, case `TC-SEC-008` |
| Fix | Validate MIME and size server-side; authenticate the caller; keep the client checks as UX only |
| Regression test | Invert TC-SEC-008 to expect `415` |

## Observed behaviour

`TC-SEC-008` uploads a file declared `text/html` whose contents are a `<script>` element.
The route answers `200` and the bytes are streamed to the provider. The only size and type
checks in the entire application live in `PostForm.jsx` in the browser.

`SMK-17` confirms the endpoint is reachable anonymously: an empty multipart `POST` from a
caller with no session returns `400 No file provided` — the handler ran, and the missing
file part was the only thing that stopped it. There is no `401` path.

## Expected behaviour

`415` for a non-image MIME. `413` over the size cap. `401` without a session.

## Steps to reproduce

```bash
printf '<script>alert(1)</script>' > /tmp/x.html
curl -si -X POST http://127.0.0.1:3000/api/upload -F "file=@/tmp/x.html;type=text/html"
```

## Root cause

`src/app/api/upload/route.js` reads the part, converts it with
`Buffer.from(await file.arrayBuffer())` and passes it straight to
`cloudinary.v2.uploader.upload_stream({ folder: "blog_posts" })`. `file.type` is never read.
`file.size` is never read. There is no auth check, and no body-size cap is configured in
`next.config.mjs` either.

The 8 MB limit exists at `src/components/PostForm/PostForm.jsx:12` (`MAX_MB = 8`), enforced by the
RHF `size` rule at `:166-167` with the message `Keep it under 8MB`.
It is enforced only in the browser, so `TC-EDGE-009` passes and the server remains open.

## Notes

Two consequences beyond the obvious:

* **Storage cost.** An unauthenticated caller can fill the Cloudinary account, one 8 MB-or-larger
  upload at a time. Every file lands in the same `blog_posts` folder (`TC-API-013`), with no
  per-user prefix, so abusive uploads cannot even be attributed or bulk-deleted.
* **Buffering.** `Buffer.from(await file.arrayBuffer())` holds the entire upload in memory
  before streaming it. On a serverless function with an unbounded input size, that is a
  denial-of-service vector as much as a storage one.

Whether a polyglot file (valid image header, embedded script) is served back inertly by the
CDN is **BLOCKED** — there is no Cloudinary account here to check against.
