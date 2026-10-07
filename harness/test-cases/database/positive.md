# Post schema — positive cases

Feature: FEAT-002 · Requirements: REQ-015/06, REQ-003

The contract sheet for the only collection in this application. `src/models/Post.js` is at **100% statement coverage**.

## TC-DB-001 — The schema declares exactly the expected paths

| Field | Value |
| --- | --- |
| Test Case ID | TC-DB-001 |
| Title | The schema declares exactly the expected paths |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-003 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | — |
| Steps | 1. Read `Object.keys(Post.schema.paths)` 2. Assert it equals `_id, title, slug, content, featuredImage, status, userId, createdAt, updatedAt, __v` |
| Expected Result | Exactly those 10 paths |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Any new field is a deliberate, reviewed change rather than an accident |

## TC-DB-002 — Five fields are required

| Field | Value |
| --- | --- |
| Test Case ID | TC-DB-002 |
| Title | Five fields are required |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-004 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | — |
| Steps | 1. For each of `title, slug, content, featuredImage, userId`, read `schema.path(f).isRequired` 2. Assert each is truthy 3. Assert `status.isRequired` is falsy |
| Expected Result | Five required, `status` optional |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Mongoose 9: `isRequired` is `undefined` (not `false`) on an optional path — assert falsy |

## TC-DB-003 — `status` is an enum with a default

| Field | Value |
| --- | --- |
| Test Case ID | TC-DB-003 |
| Title | `status` is an enum with a default |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-016, REQ-006 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | — |
| Steps | 1. Read `schema.path('status').enumValues` 2. Assert `['active','inactive']` 3. Read the default 4. Assert `'active'` |
| Expected Result | `['active','inactive']`, default `active` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The public/private split rests entirely on this pair of values |

## TC-DB-004 — `slug` carries a unique index

| Field | Value |
| --- | --- |
| Test Case ID | TC-DB-004 |
| Title | `slug` carries a unique index |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-015 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | — |
| Steps | 1. Inspect `Post.schema.indexes()` 2. Assert an entry `{ slug: 1 }` with `unique: true` |
| Expected Result | One unique index on `slug` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Declared only — a real duplicate insert needs a server ([SCN-DB-10](../../test-scenarios/database.md), BLOCKED) |

## TC-DB-005 — Timestamps are enabled

| Field | Value |
| --- | --- |
| Test Case ID | TC-DB-005 |
| Title | Timestamps are enabled |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-011 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | — |
| Steps | 1. Assert `createdAt` and `updatedAt` exist as paths |
| Expected Result | Both present |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The archive sorts newest-first on `createdAt` |

## TC-DB-006 — `userId` is a String, not an ObjectId

| Field | Value |
| --- | --- |
| Test Case ID | TC-DB-006 |
| Title | `userId` is a String, not an ObjectId |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-003 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | — |
| Steps | 1. Read `schema.path('userId').instance` 2. Assert `'String'` |
| Expected Result | `String` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Deliberate: Clerk ids are not Mongo ObjectIds. The source comment still says `// Firebase UID` — [BUG-020](../../bugs/open/BUG-020-stale-firebase-comment.md) |

## TC-DB-007 — A fully populated document validates

| Field | Value |
| --- | --- |
| Test Case ID | TC-DB-007 |
| Title | A fully populated document validates |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-004 |
| Preconditions | `@vitest-environment node`; the **real** `src/models/Post.js` Mongoose schema, compiled in-process. No server connection — validation is exercised through `validateSync()` / `schema.paths`, which are pure. |
| Test Data | `VALID_NEW_POST` from `test-data/fixtures/posts.js` |
| Steps | 1. `new Post(fixture)` 2. `validateSync()` 3. Assert no errors |
| Expected Result | No validation errors |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/database/post-schema.test.js` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Mongoose 9 returns `undefined` (not `null`) when valid |
