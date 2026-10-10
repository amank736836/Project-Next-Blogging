# Composer (`PostForm`) — positive cases

Feature: FEAT-002 · Requirements: REQ-016…13

13 cases in `automation/ui/post-form.test.jsx`. They render the real component and drive it with `@testing-library/user-event`.

## TC-UI-029 — The composer renders empty in publish mode

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-029 |
| Title | The composer renders empty in publish mode |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-016 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | No props |
| Steps | 1. Render `<PostForm />` 2. Assert the title input is empty 3. Assert the status select reads *Publish* 4. Assert the word meter reads `0 words · ~1 min read` |
| Expected Result | Empty title; Publish selected; `0 words · ~1 min read` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The `~1 min` floor comes from `Math.max(1, …)` |

## TC-UI-030 — The slug is derived from the title

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-030 |
| Title | The slug is derived from the title |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-015 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | Title: `Hello, World! It's 2026` |
| Steps | 1. Render the composer 2. Type the title 3. Read the slug field |
| Expected Result | `hello-world-its-2026` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Matches `slugTransform` at `src/components/PostForm/PostForm.jsx:123-132`: trim, lowercase, drop non-alphanumerics, spaces to hyphens |

## TC-UI-031 — The word counter and reading estimate update live

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-031 |
| Title | The word counter and reading estimate update live |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-006 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | A 440-word body |
| Steps | 1. Type 440 words into the editor 2. Assert the meter reads `440 words · ~2 min read` |
| Expected Result | `440 words · ~2 min read` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | `Math.round(440/220) === 2` |

## TC-UI-032 — A valid submit uploads, creates and navigates

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-032 |
| Title | A valid submit uploads, creates and navigates |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-004, REQ-010 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | A valid title, an 8 MB-or-less image, an editor body |
| Steps | 1. Fill every field 2. Submit 3. Assert `PostService.uploadImage` was awaited 4. Assert `createPost` received the returned URL 5. Assert `router.push` was called with `/post/<slug>` |
| Expected Result | Upload awaited, then create, then navigate |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Proves the *sequence and payload* — not a real network round trip |

## TC-UI-033 — Manual slug mode, then `auto` restores derivation

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-033 |
| Title | Manual slug mode, then `auto` restores derivation |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-015 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | A title typed first |
| Steps | 1. Type a title and confirm the derived slug 2. Switch the slug control to manual 3. Type `my-own-slug` 4. Switch back to `auto` 5. Assert the slug is derived from the title again |
| Expected Result | Derived → manual value → derived again |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-UI-034 — Edit mode pre-fills every field and offers delete

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-034 |
| Title | Edit mode pre-fills every field and offers delete |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-008 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | An existing post passed as `initialData` |
| Steps | 1. Render `<PostForm initialData={post} isEdit />` 2. Assert title, content, status and slug are pre-filled 3. Assert no image is required 4. Assert the delete button is present |
| Expected Result | All fields pre-filled; image optional; delete offered |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-UI-035 — Saving an edit without re-uploading keeps the image and slug

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-035 |
| Title | Saving an edit without re-uploading keeps the image and slug |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-008 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | An existing post with a `featuredImage` and a `slug` |
| Steps | 1. Render in edit mode 2. Change only the title 3. Submit 4. Assert `uploadImage` was **not** called 5. Assert `updatePost` received the original `featuredImage` and `slug` |
| Expected Result | No upload; original image and slug preserved |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-UI-036 — Delete requires a second click within 4.5 s

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-036 |
| Title | Delete requires a second click within 4.5 s |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-009 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | An existing post in edit mode |
| Steps | 1. Click delete 2. Assert the button re-labels to a confirm state and no call was made 3. Click again 4. Assert `deletePost` was called once 5. Assert navigation away from `/edit-post/<slug>` |
| Expected Result | One armed click, one delete call, navigation |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Fake timers with `shouldAdvanceTime: true`; `userEvent.setup({ advanceTimers })` |

## TC-UI-037 — An armed delete disarms itself after 4.5 s

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-037 |
| Title | An armed delete disarms itself after 4.5 s |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-009 |
| Preconditions | `@vitest-environment jsdom` (default); Clerk and `next/navigation` mocked; TinyMCE replaced by the stateful textarea stub in `utilities/mocks/tinymce.jsx`; `PostService` mocked |
| Test Data | Same |
| Steps | 1. Click delete 2. Advance 4 500 ms 3. Assert the button returned to its idle label 4. Click 5. Assert `deletePost` was **not** called |
| Expected Result | Idle label restored; nothing deleted |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |
