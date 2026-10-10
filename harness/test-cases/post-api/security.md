# Post API — security cases

Feature: FEAT-002 · Requirements: REQ-023, REQ-024, REQ-025

**Read this before reading the results.** Every case below asserts that a protection is *missing*. They are `PASS` because the gap is real and reproducible. Each one names the bug it documents in its title, so fixing the bug turns it red.

## TC-SEC-002 — `?status=inactive` exposes another writer's drafts

| Field | Value |
| --- | --- |
| Test Case ID | TC-SEC-002 |
| Title | `?status=inactive` exposes another writer's drafts |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-024 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | Seed: a draft owned by `USER_B` |
| Steps | 1. `GET /api/posts?status=inactive` with no credentials at all 2. Assert 200 3. Assert the draft is present |
| Expected Result | 200 with someone else's draft |
| Actual Result | As expected — the draft is returned |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-collection.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | **Documents [BUG-005](../../bugs/open/BUG-005-idor-draft-exposure.md).** Invert this test when the endpoint starts requiring a session |

## TC-SEC-003 — `POST /api/posts` accepts an arbitrary `userId`

| Field | Value |
| --- | --- |
| Test Case ID | TC-SEC-003 |
| Title | `POST /api/posts` accepts an arbitrary `userId` |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-023, REQ-025 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | `VALID_NEW_POST` with `userId` set to a stranger |
| Steps | 1. `POST /api/posts` with no credentials and a foreign `userId` 2. Assert 201 3. Assert the stored document carries the stranger's id |
| Expected Result | 201; foreign `userId` stored |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-collection.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | **Documents [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md)** — unauthenticated *and* mass-assignable |

## TC-SEC-004 — `GET /api/posts/{slug}` serves a draft to anyone

| Field | Value |
| --- | --- |
| Test Case ID | TC-SEC-004 |
| Title | `GET /api/posts/{slug}` serves a draft to anyone |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-024 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | The seeded draft's slug |
| Steps | 1. `GET /api/posts/<draft-slug>` with no credentials 2. Assert 200 3. Assert the draft body is returned |
| Expected Result | 404 or 403 |
| Actual Result | **200 with the full draft** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-slug.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | **Documents [BUG-006](../../bugs/open/BUG-006-draft-readable-by-slug.md)** — the route ignores `status` entirely |

## TC-SEC-005 — `PUT /api/posts/{slug}` lets anyone overwrite anyone's post

| Field | Value |
| --- | --- |
| Test Case ID | TC-SEC-005 |
| Title | `PUT /api/posts/{slug}` lets anyone overwrite anyone's post |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-023 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | A post owned by `USER_B`, an update body from an anonymous caller |
| Steps | 1. `PUT` with no credentials 2. Assert 200 3. Assert the document changed |
| Expected Result | 403 |
| Actual Result | **200 and the document is overwritten** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-slug.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | **Documents [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md)** |

## TC-SEC-006 — `PUT` accepts fields that are not in the schema

| Field | Value |
| --- | --- |
| Test Case ID | TC-SEC-006 |
| Title | `PUT` accepts fields that are not in the schema |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-025 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | Body: `{ "status": "published", "isAdmin": true, "views": 999 }` |
| Steps | 1. `PUT` with those keys 2. Assert 200 3. Read the document back 4. Assert the out-of-schema keys were persisted and the enum was not enforced |
| Expected Result | Unknown keys dropped; enum enforced |
| Actual Result | **Both persisted; enum bypassed** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-slug.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | **Documents [BUG-007](../../bugs/open/BUG-007-mass-assignment-put.md)** — no allow-list, and `runValidators` is not passed to `findOneAndUpdate` |

## TC-SEC-007 — `DELETE /api/posts/{slug}` deletes anyone's post

| Field | Value |
| --- | --- |
| Test Case ID | TC-SEC-007 |
| Title | `DELETE /api/posts/{slug}` deletes anyone's post |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-023 |
| Preconditions | `@vitest-environment node` (jsdom cannot read `request.formData()`); real route handler; `Post.*` statics spied over an in-memory fake seeded from `test-data/fixtures/posts.js` |
| Test Data | A post owned by `USER_B` |
| Steps | 1. `DELETE` with no credentials 2. Assert 200 3. Assert the document is gone |
| Expected Result | 403 |
| Actual Result | **200 and the document is gone** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/api/posts-slug.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | **Documents [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md)** |
