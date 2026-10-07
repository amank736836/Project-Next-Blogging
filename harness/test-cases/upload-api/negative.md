# Upload API — negative cases

Feature: FEAT-005 · Requirements: REQ-010/05, REQ-NF-02, REQ-025

## TC-API-014 — A multipart body with no file part answers 400

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-014 |
| Title | A multipart body with no file part answers 400 |
| Feature | [FEAT-005](../../features/FEAT-005-image-upload/README.md) |
| Requirement | REQ-010 |
| Preconditions | `@vitest-environment node`; real route handler; `cloudinary.v2.uploader.upload_stream` mocked so no network call leaves the process |
| Test Data | `new FormData()` — a valid, empty multipart body |
| Steps | 1. `POST /api/upload` with an empty multipart body 2. Assert 400 3. Assert the body is `{ error: "No file provided" }` |
| Expected Result | 400 `No file provided` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/upload.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Must be a *real* multipart body. With no `content-type` at all, `request.formData()` throws first and the route answers 500 — see SMK-20 and [BUG-016](../../bugs/open/BUG-016-upload-non-multipart-500.md) |

## TC-NEG-005 — A Cloudinary failure surfaces as 500 with the provider's message

| Field | Value |
| --- | --- |
| Test Case ID | TC-NEG-005 |
| Title | A Cloudinary failure surfaces as 500 with the provider's message |
| Feature | [FEAT-005](../../features/FEAT-005-image-upload/README.md) |
| Requirement | REQ-NF-02 |
| Preconditions | `@vitest-environment node`; real route handler; `cloudinary.v2.uploader.upload_stream` mocked so no network call leaves the process |
| Test Data | The mocked provider rejects with `Invalid image file` |
| Steps | 1. Upload 2. Assert 500 3. Read the error body |
| Expected Result | A generic message |
| Actual Result | **500 carrying `Invalid image file` verbatim** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/upload.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Asserts the actual behaviour. Provider detail reaches the client — [BUG-013](../../bugs/open/BUG-013-api-leaks-internal-errors.md) |

## TC-SEC-008 — Any MIME type is accepted server-side

| Field | Value |
| --- | --- |
| Test Case ID | TC-SEC-008 |
| Title | Any MIME type is accepted server-side |
| Feature | [FEAT-005](../../features/FEAT-005-image-upload/README.md) |
| Requirement | REQ-029, REQ-025 |
| Preconditions | `@vitest-environment node`; real route handler; `cloudinary.v2.uploader.upload_stream` mocked so no network call leaves the process |
| Test Data | A file declared `text/html` whose contents are a `<script>` |
| Steps | 1. Upload it 2. Assert 200 3. Assert `upload_stream` was called |
| Expected Result | 415 or 400 |
| Actual Result | **200 — accepted** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/upload.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | **Documents [BUG-008](../../bugs/open/BUG-008-upload-no-server-validation.md).** The only size and type checks live in the browser. Reproduced live against the built app too: `SMK-17` reaches the handler with no credentials and is stopped only by the missing file part, never by an auth check. |

## Not executed

| SCN ID | Case | Status | Why |
| --- | --- | --- | --- |
| SCN-UP-08 | A 100 MB upload | NOT_EXECUTED | No server-side cap exists, so the outcome depends entirely on the host's body limit. Untested. |
| SCN-UP-10 | Two uploads at once from the same writer | NOT_EXECUTED | The route is stateless; concurrency is untested. |
| SCN-SEC-19 | A polyglot file (valid image header + embedded script) | BLOCKED | Needs a Cloudinary account to see what the CDN actually serves back. |
| SCN-UP-12 | A filename containing path separators | NOT_EXECUTED | The route never reads `file.name`; it streams bytes. Probably safe by construction, untested. |
