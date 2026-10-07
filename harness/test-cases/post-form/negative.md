# Composer (`PostForm`) — negative cases

Feature: FEAT-002 · Requirements: REQ-004, REQ-029, REQ-010

## TC-NEG-008 — An empty title blocks submit

| Field | Value |
| --- | --- |
| Test Case ID | TC-NEG-008 |
| Title | An empty title blocks submit |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-004 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | No title |
| Steps | 1. Render the composer 2. Submit 3. Assert the error `A title keeps the frame square` 4. Assert neither `uploadImage` nor `createPost` was called |
| Expected Result | Named error; no service calls |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-NEG-009 — A missing image blocks submit in publish mode

| Field | Value |
| --- | --- |
| Test Case ID | TC-NEG-009 |
| Title | A missing image blocks submit in publish mode |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-010 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | A title but no image |
| Steps | 1. Fill the title and the editor 2. Submit 3. Assert the error `A frame makes it a post` 4. Assert no service calls |
| Expected Result | Named error; no service calls |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Does not apply in edit mode — see TC-UI-035 |

## TC-NEG-010 — The manual slug field strips every hyphen as it is typed

| Field | Value |
| --- | --- |
| Test Case ID | TC-NEG-010 |
| Title | The manual slug field strips every hyphen as it is typed |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-015 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | Slug control set to manual |
| Steps | 1. Switch to manual 2. Type `my-cool-slug` 3. Read the field's value |
| Expected Result | `my-cool-slug` |
| Actual Result | **`mycoolslug`** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | **Documents [BUG-011](../../bugs/open/BUG-011-manual-slug-strips-hyphens.md).** `slugTransform` runs on the manual field too, and its `[^a-zA-Z\d\s]+` class eats `-` on every keystroke |

## TC-EDGE-009 — An image larger than 8 MB is rejected and never uploaded

| Field | Value |
| --- | --- |
| Test Case ID | TC-EDGE-009 |
| Title | An image larger than 8 MB is rejected and never uploaded |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-029 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | A `File` of 8 MB + 1 byte |
| Steps | 1. Attach the oversized file 2. Assert the error `Keep it under 8MB` 3. Assert `uploadImage` was **not** called |
| Expected Result | Named error; no upload attempt |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Client-side only. There is **no** matching server-side check — [BUG-008](../../bugs/open/BUG-008-upload-no-server-validation.md) |

## Not executed

| SCN ID | Case | Status | Why |
| --- | --- | --- | --- |
| SCN-UI-20 | The submit button is disabled while a request is in flight | NOT_EXECUTED | Would need to hold a promise open across an assertion. Not written. |
| SCN-NEG-11 | A failed create shows a recoverable error and keeps the draft | NOT_EXECUTED | `PostForm`'s catch path sets a generic error string; untested. |
| SCN-NEG-12 | A failed upload aborts before `createPost` | NOT_EXECUTED | Untested, though the `await` order makes it likely correct. |
