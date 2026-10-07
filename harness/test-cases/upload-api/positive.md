# Upload API — positive cases

Feature: FEAT-005 · Requirements: REQ-010…05

5 cases in `automation/api/upload.test.js`. Route at 100% statement coverage.

## TC-API-012 — A multipart upload returns `{ fileId, url }`

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-012 |
| Title | A multipart upload returns `{ fileId, url }` |
| Feature | [FEAT-005](../../features/FEAT-005-image-upload/README.md) |
| Requirement | REQ-010 |
| Preconditions | `@vitest-environment node`; real route handler; `cloudinary.v2.uploader.upload_stream` mocked so no network call leaves the process |
| Test Data | `fileFormData({ name: 'hero.jpg', type: 'image/jpeg', content: '…' })` |
| Steps | 1. `POST /api/upload` with a real multipart body 2. Assert 200 3. Assert the body has `fileId` and `url` 4. Assert `url` is the provider's `secure_url` |
| Expected Result | 200 `{ fileId, url }` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/upload.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-API-013 — Every upload is stored under the `blog_posts` folder

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-013 |
| Title | Every upload is stored under the `blog_posts` folder |
| Feature | [FEAT-005](../../features/FEAT-005-image-upload/README.md) |
| Requirement | REQ-010 |
| Preconditions | `@vitest-environment node`; real route handler; `cloudinary.v2.uploader.upload_stream` mocked so no network call leaves the process |
| Test Data | Any valid image |
| Steps | 1. Upload 2. Inspect the options passed to `upload_stream` 3. Assert `folder === 'blog_posts'` |
| Expected Result | `folder: 'blog_posts'` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/upload.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Hard-coded at `src/app/api/upload/route.js` — no per-user folder, so one user's uploads are indistinguishable from another's in the CDN |
