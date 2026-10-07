# Contact form — positive cases

Feature: FEAT-008 · Requirements: REQ-017…05

9 cases in `automation/ui/contact-form.test.jsx`. `src/app/contact/page.js` is at **100% statement coverage**.

## TC-UI-009 — A valid submission clears the form and confirms

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-009 |
| Title | A valid submission clears the form and confirms |
| Feature | [FEAT-008](../../features/FEAT-008-contact-form/README.md) |
| Requirement | REQ-017/03/05 |
| Preconditions | `@vitest-environment jsdom`; the real page component rendered directly (no Clerk or routing dependency); `fetch` spied |
| Test Data | `VALID_CONTACT` from `test-data/fixtures/posts.js` |
| Steps | 1. Type a valid name, email and message 2. Submit 3. Assert the success panel replaces the form 4. Assert every input is empty |
| Expected Result | Success panel; fields cleared |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/contact-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-UI-010 — `Write another` returns to an empty form

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-010 |
| Title | `Write another` returns to an empty form |
| Feature | [FEAT-008](../../features/FEAT-008-contact-form/README.md) |
| Requirement | REQ-017 |
| Preconditions | `@vitest-environment jsdom`; the real page component rendered directly (no Clerk or routing dependency); `fetch` spied |
| Test Data | The form in its success state |
| Steps | 1. Submit a valid message 2. Click `Write another` 3. Assert the form is back 4. Assert no field carries a value |
| Expected Result | Form restored, all fields empty |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/contact-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-UI-011 — Topic chips are single-select and keep `aria-pressed`

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-011 |
| Title | Topic chips are single-select and keep `aria-pressed` |
| Feature | [FEAT-008](../../features/FEAT-008-contact-form/README.md) |
| Requirement | REQ-017, REQ-014 |
| Preconditions | `@vitest-environment jsdom`; the real page component rendered directly (no Clerk or routing dependency); `fetch` spied |
| Test Data | The default topic and one other |
| Steps | 1. Assert the first chip is `aria-pressed="true"` 2. Click another 3. Assert it is now pressed 4. Assert the first is `aria-pressed="false"` |
| Expected Result | Exactly one chip pressed at a time |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/contact-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-UI-012 — Nothing is transmitted

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-012 |
| Title | Nothing is transmitted |
| Feature | [FEAT-008](../../features/FEAT-008-contact-form/README.md) |
| Requirement | REQ-017 |
| Preconditions | `@vitest-environment jsdom`; the real page component rendered directly (no Clerk or routing dependency); `fetch` spied |
| Test Data | `VALID_CONTACT`; `globalThis.fetch` replaced by a spy |
| Steps | 1. Submit a valid message 2. Assert the success state is shown 3. Assert the `fetch` spy was **never** called 4. Assert no `axios` request left the process |
| Expected Result | Some transmission attempt |
| Actual Result | **Zero network calls** |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/contact-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | **Documents [BUG-010](../../bugs/open/BUG-010-contact-form-has-no-backend.md).** There is no `/api/contact` route in the build — the 18-route table has none. |
