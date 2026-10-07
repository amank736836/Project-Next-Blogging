# Post API — positive cases

Feature: FEAT-002 · Requirements: REQ-016…13, REQ-018

All 11 cases live in `automation/api/posts-collection.test.js` and `automation/api/posts-slug.test.js`. They call the **real** exported `GET`/`POST`/`PUT`/`DELETE` handlers with constructed `Request` objects.

## TC-API-001 — `GET /api/posts` with no query returns only published posts

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-001 |
| Title | `GET /api/posts` with no query returns only published posts |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-016, REQ-018 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | Seeded archive: 3 `active` + 1 `inactive` |
| Steps | 1. `GET /api/posts` 2. Parse the JSON 3. Assert 200 4. Assert the draft's slug is absent 5. Assert every returned `status` is `active` |
| Expected Result | 200; 3 documents; no draft |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-collection.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The single most important assertion in the suite — this default is the only thing keeping drafts out of the public archive |

## TC-API-002 — `GET /api/posts?status=inactive` returns the draft

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-002 |
| Title | `GET /api/posts?status=inactive` returns the draft |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-006 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | Same seed |
| Steps | 1. `GET /api/posts?status=inactive` 2. Assert 200 3. Assert exactly the draft is returned |
| Expected Result | 200; only `draft-never-shipped` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-collection.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Works exactly as coded — and that is BUG-005, because there is no auth check in front of it |

## TC-API-003 — `GET /api/posts?status=&userId=` scopes to one writer

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-003 |
| Title | `GET /api/posts?status=&userId=` scopes to one writer |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-006 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | Seed contains posts from two users |
| Steps | 1. `GET /api/posts?status=active&userId=<user-a>` 2. Assert every document's `userId` matches |
| Expected Result | Only user A's posts |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-collection.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-API-004 — An unknown `userId` returns `[]`, not an error

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-004 |
| Title | An unknown `userId` returns `[]`, not an error |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-006 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | A user id present in no document |
| Steps | 1. `GET /api/posts?userId=harness-nobody` 2. Assert 200 3. Assert the body is an empty array |
| Expected Result | 200 `[]` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-collection.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | This is what makes the writer's shelf render its empty state instead of an error |

## TC-API-005 — `POST /api/posts` stores the payload and answers 201

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-005 |
| Title | `POST /api/posts` stores the payload and answers 201 |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-004 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | `VALID_NEW_POST` from the fixtures |
| Steps | 1. `POST /api/posts` with a valid JSON body 2. Assert 201 3. Assert the response carries the stored document 4. Assert the fake's store grew by one |
| Expected Result | 201; document returned; store count 5 |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-collection.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | No authentication, and a caller-supplied `userId` is honoured — see TC-SEC-003 |

## TC-API-006 — `GET /api/posts/{slug}` returns the full document

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-006 |
| Title | `GET /api/posts/{slug}` returns the full document |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-007 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | A known published slug |
| Steps | 1. `GET /api/posts/<known-slug>` 2. Assert 200 3. Assert title, slug, content and featuredImage all match the seed |
| Expected Result | 200 with the whole document |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-slug.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-API-007 — An unknown slug answers 404 with a stable message

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-007 |
| Title | An unknown slug answers 404 with a stable message |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-007, REQ-NF-02 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | A slug present in no document |
| Steps | 1. `GET /api/posts/harness-nope` 2. Assert 404 3. Assert the body is `{ "error": "Post not found" }` |
| Expected Result | 404 `{ error: "Post not found" }` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-slug.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-API-008 — `PUT /api/posts/{slug}` applies the update and returns the new document

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-008 |
| Title | `PUT /api/posts/{slug}` applies the update and returns the new document |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-008 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | `VALID_UPDATE` — title and content only |
| Steps | 1. `PUT /api/posts/<known-slug>` with the update body 2. Assert 200 3. Assert the returned title and content are the new ones 4. Assert `featuredImage` is untouched |
| Expected Result | 200; fields updated; untouched fields preserved |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-slug.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Partial updates work because the handler passes the body straight to `findOneAndUpdate` |

## TC-API-009 — Updating an unknown slug answers 404 and changes nothing

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-009 |
| Title | Updating an unknown slug answers 404 and changes nothing |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-008 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | An unknown slug plus a valid body |
| Steps | 1. `PUT /api/posts/harness-nope` 2. Assert 404 3. Assert the store is unchanged |
| Expected Result | 404; store unchanged |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-slug.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-API-010 — `DELETE /api/posts/{slug}` removes the post and confirms

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-010 |
| Title | `DELETE /api/posts/{slug}` removes the post and confirms |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-009 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | A known slug |
| Steps | 1. `DELETE /api/posts/<known-slug>` 2. Assert 200 3. Assert the body is `{ message: "Post deleted successfully" }` 4. Assert the store shrank by one |
| Expected Result | 200 with the message; document gone |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-slug.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-API-011 — A second delete of the same slug answers 404

| Field | Value |
| --- | --- |
| Test Case ID | TC-API-011 |
| Title | A second delete of the same slug answers 404 |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-009 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | A slug deleted by the previous call in the same test |
| Steps | 1. `DELETE` the slug 2. `DELETE` it again 3. Assert 404 |
| Expected Result | 404 on the second call |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-slug.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |
