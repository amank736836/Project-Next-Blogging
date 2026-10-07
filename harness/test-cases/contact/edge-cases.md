# Contact form — edge cases

Feature: FEAT-008 · Requirement: REQ-017

## TC-EDGE-006 — An 11-character message is rejected; exactly 12 is accepted

| Field | Value |
| --- | --- |
| Test Case ID | TC-EDGE-006 |
| Title | An 11-character message is rejected; exactly 12 is accepted |
| Feature | [FEAT-008](../../features/FEAT-008-contact-form/README.md) |
| Requirement | REQ-017 |
| Preconditions | `@vitest-environment jsdom`; the real page component rendered directly (no Clerk or routing dependency); `fetch` spied |
| Test Data | Two 12-and-11-character messages, everything else valid |
| Steps | 1. Type an 11-character message with a valid name and email, submit, assert the error 2. Type a 12-character message, submit, assert success |
| Expected Result | Rejected at 11, accepted at 12 |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/contact-form.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Off-by-one pinned on both sides of the `message.trim().length < 12` boundary |

## Not executed

| SCN ID | Case | Status | Why |
| --- | --- | --- | --- |
| SCN-EDGE-19 | A name of exactly 2 characters | NOT_EXECUTED | TC-NEG-006 pins the rejecting side only; the accepting side is inferred, not tested. |
| SCN-EDGE-20 | An email with a two-character TLD (`a@b.co`) | NOT_EXECUTED | The `{2,}` quantifier should accept it. Untested. |
| SCN-NEG-15 | A 5 000-character message | NOT_EXECUTED | No maximum exists, so it would be accepted — and then silently discarded, per BUG-010. |
