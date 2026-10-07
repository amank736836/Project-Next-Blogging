# Contact form — negative cases

Feature: FEAT-008 · Requirements: REQ-017

This is the only hand-written validation in the application, so the thresholds are worth pinning exactly.

## TC-UI-007 — An empty submit names all three problems

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-007 |
| Title | An empty submit names all three problems |
| Feature | [FEAT-008](../../features/FEAT-008-contact-form/README.md) |
| Requirement | REQ-017 |
| Preconditions | `@vitest-environment jsdom`; the real page component rendered directly (no Clerk or routing dependency); `fetch` spied |
| Test Data | Nothing typed |
| Steps | 1. Submit the empty form 2. Assert three errors, one per field 3. Assert the success panel did not appear |
| Expected Result | Three named errors; no success |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/contact-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | All three are reported at once rather than one at a time |

## TC-UI-008 — The failing field is marked invalid for assistive technology

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-008 |
| Title | The failing field is marked invalid for assistive technology |
| Feature | [FEAT-008](../../features/FEAT-008-contact-form/README.md) |
| Requirement | REQ-017 |
| Preconditions | `@vitest-environment jsdom`; the real page component rendered directly (no Clerk or routing dependency); `fetch` spied |
| Test Data | A valid name and email; an empty message |
| Steps | 1. Fill two of three fields 2. Submit 3. Assert `aria-invalid="true"` on the message field |
| Expected Result | `aria-invalid="true"` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/contact-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The message field is the one used because it is a `<textarea>` and unambiguous to query |

## TC-NEG-006 — A name shorter than 2 characters is rejected

| Field | Value |
| --- | --- |
| Test Case ID | TC-NEG-006 |
| Title | A name shorter than 2 characters is rejected |
| Feature | [FEAT-008](../../features/FEAT-008-contact-form/README.md) |
| Requirement | REQ-017 |
| Preconditions | `@vitest-environment jsdom`; the real page component rendered directly (no Clerk or routing dependency); `fetch` spied |
| Test Data | Name `A`, valid email and message |
| Steps | 1. Type a 1-character name 2. Submit 3. Assert the name error 4. Assert no success panel |
| Expected Result | Rejected |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/contact-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The rule is `name.trim().length < 2` at `src/app/contact/page.js:26-31` |

## TC-NEG-007 — An email without a domain is rejected

| Field | Value |
| --- | --- |
| Test Case ID | TC-NEG-007 |
| Title | An email without a domain is rejected |
| Feature | [FEAT-008](../../features/FEAT-008-contact-form/README.md) |
| Requirement | REQ-017 |
| Preconditions | `@vitest-environment jsdom`; the real page component rendered directly (no Clerk or routing dependency); `fetch` spied |
| Test Data | Email `someone@nowhere` |
| Steps | 1. Type the malformed email 2. Submit 3. Assert the email error |
| Expected Result | Rejected |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/contact-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The pattern is `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` |
