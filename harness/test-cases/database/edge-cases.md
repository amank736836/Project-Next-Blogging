# Post schema — edge cases

Feature: FEAT-002 · Requirements: REQ-015/06, REQ-025

Every case here passes by documenting an **absence of a limit**. That is the finding: the schema has no length cap, no sanitisation, no trimming and no normalisation.

## TC-EDGE-001 — An empty string is rejected on every required field

| Field | Value |
| --- | --- |
| Test Case ID | TC-EDGE-001 |
| Title | An empty string is rejected on every required field |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-004 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | `VALID_NEW_POST` with each required field set to `""` |
| Steps | 1. For each required field, set it to `""` 2. `validateSync()` 3. Assert an error |
| Expected Result | All rejected |
| Actual Result | As expected — all five rejected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | `required: true` on a Mongoose String **does** reject `""`. This disproved an earlier hypothesis; BUG-009 was withdrawn and its number retired. |

## TC-EDGE-005 — A whitespace-only value is rejected **only** because the field is required

| Field | Value |
| --- | --- |
| Test Case ID | TC-EDGE-005 |
| Title | A whitespace-only value is rejected **only** because the field is required |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-004 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | `"   "` for each field |
| Steps | 1. Set each required field to three spaces 2. `validateSync()` 3. Assert rejected 4. Assert the same value is accepted on the optional `status` path |
| Expected Result | Rejected on required paths |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | No `trim: true` and no `minlength` anywhere. A title of three spaces is a real, storable title as far as any explicit rule is concerned. |

## TC-EDGE-002 — A 2 000-character title and a 1 MB body are accepted

| Field | Value |
| --- | --- |
| Test Case ID | TC-EDGE-002 |
| Title | A 2 000-character title and a 1 MB body are accepted |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-004 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | `'a'.repeat(2000)` and a ~1 MB content string |
| Steps | 1. Build the fixture 2. `validateSync()` 3. Assert no errors |
| Expected Result | Rejected or capped |
| Actual Result | **Accepted** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | No `maxlength` on either field. Combined with the client-side absence of a cap, an unbounded document is writable — and the archive fetches the whole collection |

## TC-EDGE-003 — Markup in `title` and `content` is stored verbatim

| Field | Value |
| --- | --- |
| Test Case ID | TC-EDGE-003 |
| Title | Markup in `title` and `content` is stored verbatim |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-025 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | `<img src=x onerror="…">` and `<script>` payloads |
| Steps | 1. Build the fixture with hostile markup 2. `validateSync()` 3. Assert no errors 4. Assert the stored string is byte-identical to the input |
| Expected Result | Sanitised or rejected |
| Actual Result | **Stored verbatim** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The reader renders it with `parse(post.content)` at `src/app/post/[slug]/page.js:246` — [BUG-022](../../bugs/open/BUG-022-stored-xss-post-content.md). Storage is proven here; browser execution is `NOT_EXECUTED` (no browser). |

## TC-EDGE-004 — `slug` is not lowercased or trimmed

| Field | Value |
| --- | --- |
| Test Case ID | TC-EDGE-004 |
| Title | `slug` is not lowercased or trimmed |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-015 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | `'  My-Slug  '`, `'My-Slug'`, `'my-slug'` |
| Steps | 1. Build a document for each 2. `validateSync()` 3. Assert the stored value is byte-identical 4. Assert no two collide at the schema level |
| Expected Result | Normalised |
| Actual Result | **Stored byte-exact; three distinct slugs** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Uniqueness is therefore byte-exact. `slugTransform` on the client is the only thing that ever lowercases, which is why [BUG-011](../../bugs/open/BUG-011-manual-slug-strips-hyphens.md) matters |
