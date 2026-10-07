# Post schema — negative cases

Feature: FEAT-002 · Requirements: REQ-004, REQ-NF-02

`TC-DB-008` is parameterised: one case ID, five executions, one per required field. That is why 14 case IDs produce 18 passing assertions in this module.

## TC-DB-008 (×5) — Each required field individually rejects its absence

| Field | Value |
| --- | --- |
| Test Case ID | TC-DB-008 (×5) |
| Title | Each required field individually rejects its absence |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-004 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | `VALID_NEW_POST` with one field deleted, repeated for all five |
| Steps | 1. For each required field, clone the fixture and `delete` it 2. `validateSync()` 3. Assert an error naming that field |
| Expected Result | A `ValidationError` per field |
| Actual Result | As expected — all five rejected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Executions: `title`, `slug`, `content`, `featuredImage`, `userId` |

## TC-DB-009 — A `status` outside the enum is rejected

| Field | Value |
| --- | --- |
| Test Case ID | TC-DB-009 |
| Title | A `status` outside the enum is rejected |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-016 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | Fixture with `status: 'published'` |
| Steps | 1. `new Post(fixture)` 2. `validateSync()` 3. Assert an error on `status` |
| Expected Result | Rejected |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Only on **create**. `findOneAndUpdate` is called without `runValidators`, so `PUT` bypasses this entirely — TC-SEC-006 |
