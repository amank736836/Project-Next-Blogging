# Post API — negative cases

Feature: FEAT-002 · Requirements: REQ-NF-02, REQ-025

These are the cases where the **status code is wrong**. They pass because they assert what the application actually does, and every one of them is attached to a bug.

## TC-NEG-001 — A payload missing `title` is rejected

| Field | Value |
| --- | --- |
| Test Case ID | TC-NEG-001 |
| Title | A payload missing `title` is rejected |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-004, REQ-NF-02 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | `VALID_NEW_POST` with `title` deleted |
| Steps | 1. `POST /api/posts` without a title 2. Assert a non-2xx status 3. Assert the store did not grow |
| Expected Result | 500; nothing stored |
| Actual Result | As expected — 500 |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-collection.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | **Should be 400.** The route has no try/catch, so Mongoose's `ValidationError` becomes a 500 — [BUG-013](../../bugs/open/BUG-013-api-leaks-internal-errors.md) |

## TC-NEG-002 — A duplicate slug is rejected rather than overwriting

| Field | Value |
| --- | --- |
| Test Case ID | TC-NEG-002 |
| Title | A duplicate slug is rejected rather than overwriting |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-004, REQ-015 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | A payload whose `slug` collides with a seeded document |
| Steps | 1. `POST /api/posts` with an existing slug 2. Assert a non-2xx status 3. Assert the original document is unchanged |
| Expected Result | Non-2xx; original untouched |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-collection.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The fake raises a `ValidationError`; a real MongoDB raises `E11000` ([SCN-INT-05](../../test-scenarios/integration.md), BLOCKED) |

## TC-NEG-003 — Malformed JSON on `POST /api/posts`

| Field | Value |
| --- | --- |
| Test Case ID | TC-NEG-003 |
| Title | Malformed JSON on `POST /api/posts` |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-NF-02 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | Body: `{"title":` |
| Steps | 1. `POST /api/posts` with a truncated JSON body 2. Assert the response status |
| Expected Result | A 4xx with a parse error |
| Actual Result | **500** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-collection.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Asserts the actual behaviour, not the ideal one. There is no body guard — [BUG-013](../../bugs/open/BUG-013-api-leaks-internal-errors.md) |

## TC-NEG-004 — Malformed JSON on `PUT /api/posts/{slug}`

| Field | Value |
| --- | --- |
| Test Case ID | TC-NEG-004 |
| Title | Malformed JSON on `PUT /api/posts/{slug}` |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-NF-02 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | Body: `{"title":` |
| Steps | 1. `PUT /api/posts/<known-slug>` with a truncated JSON body 2. Assert the response status |
| Expected Result | A 4xx with a parse error |
| Actual Result | **500** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-slug.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Same defect as TC-NEG-003, second route |

## Not executed

| SCN ID | Case | Status | Why |
| --- | --- | --- | --- |
| SCN-API-06 | An unrecognised `status` value returns `[]` | NOT_EXECUTED | The filter becomes `{ status: "whatever" }`; nothing matches. Low value. |
| SCN-API-07 | A `userId` containing URL-reserved characters | NOT_EXECUTED | `services/config.js` interpolates without encoding. Untested. |
