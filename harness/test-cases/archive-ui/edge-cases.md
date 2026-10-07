# Archive UI — edge cases

Features: FEAT-003, FEAT-001 · Requirements: REQ-011

## TC-EDGE-007 — An almost-empty post floors at 1 minute

| Field | Value |
| --- | --- |
| Test Case ID | TC-EDGE-007 |
| Title | An almost-empty post floors at 1 minute |
| Feature | [FEAT-003](../../features/FEAT-003-public-archive/README.md) |
| Requirement | REQ-011 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | A post whose content is a single word |
| Steps | 1. Render the card 2. Assert the meta reads `~1 min read`, never `~0 min read` |
| Expected Result | `~1 min read` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-card.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The `Math.max(1, …)` clamp |

## TC-EDGE-008 — A missing or invalid `createdAt` renders as `undated`

| Field | Value |
| --- | --- |
| Test Case ID | TC-EDGE-008 |
| Title | A missing or invalid `createdAt` renders as `undated` |
| Feature | [FEAT-003](../../features/FEAT-003-public-archive/README.md) |
| Requirement | REQ-011 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | `createdAt: undefined`, then `createdAt: 'not-a-date'` |
| Steps | 1. Render for each 2. Assert the meta contains `undated` 3. Assert `Invalid Date` never appears |
| Expected Result | `undated` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-card.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | `createdAt` is always set by Mongoose in practice, so this is defensive — but the component handles it deliberately |
