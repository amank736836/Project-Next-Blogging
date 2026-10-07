# Archive UI — security cases

Feature: FEAT-003 · Requirement: REQ-023

**These two pass because the protection genuinely exists.** They are the only `TC-SEC-*`
cases in the suite that are not documenting a defect.

## TC-SEC-009 — A signed-in reader who is not the author sees no Edit link

| Field | Value |
| --- | --- |
| Test Case ID | TC-SEC-009 |
| Title | A signed-in reader who is not the author sees no Edit link |
| Feature | [FEAT-003](../../features/FEAT-003-public-archive/README.md) |
| Requirement | REQ-023 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | A post owned by `USER_B`; the signed-in user is `USER_A` |
| Steps | 1. Render `<PostCard post={post} currentUserId={USER_A} />` 2. Assert no Edit link 3. Assert the article link is still there |
| Expected Result | No Edit link |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-card.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Correct in the UI. Worthless as a control — the API accepts the same request from anyone (TC-SEC-005). |

## TC-SEC-010 — An anonymous visitor sees no Edit link

| Field | Value |
| --- | --- |
| Test Case ID | TC-SEC-010 |
| Title | An anonymous visitor sees no Edit link |
| Feature | [FEAT-003](../../features/FEAT-003-public-archive/README.md) |
| Requirement | REQ-023 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | Any post; `currentUserId` undefined |
| Steps | 1. Render with no current user 2. Assert no Edit link |
| Expected Result | No Edit link |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-card.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |
