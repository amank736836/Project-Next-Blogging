# Authentication — edge cases

## TC-UI-003 — The branded waiting state while Clerk resolves

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-003 |
| Title | While Clerk is loading, the branded loader renders — not the content |
| Feature | [FEAT-001](../../features/FEAT-001-authentication/README.md) |
| Requirement | REQ-002, REQ-NF-06 |
| Preconditions | Mocked provider; `isLoaded=false` |
| Test Data | — |
| Steps | 1. Render the gate with protected children 2. Assert the loader is present 3. Assert the children are absent 4. Assert no redirect happened |
| Expected Result | Loader visible; content absent; no navigation |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/auth-gate.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Matches the app's own copy: "Warming up the frame" / "Almost ready, hold that pose." |

## TC-UI-004 — No flash of protected content on loading → signed-out

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-004 |
| Title | Protected content never appears during the loading → signed-out transition |
| Feature | FEAT-001 |
| Requirement | REQ-002, REQ-023 |
| Preconditions | Mocked provider starts at `isLoaded=false`, then flips to `isLoaded=true, isSignedIn=false` |
| Test Data | — |
| Steps | 1. Render the gate 2. Re-render with the same tree after the auth state resolves 3. Assert the children were never in the document at any point |
| Expected Result | Content absent throughout; redirect fires once auth resolves |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/auth-gate.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | This case exists to catch the classic `if (signedIn) return children;` regression that drops the `!isLoaded` guard |

## Not tested

| SCN ID | Case | Status | Why |
| --- | --- | --- | --- |
| SCN-AUTH-05 | Clerk times out or its script fails to load | BLOCKED | Needs a browser and network control. `AuthLayout` has no timeout branch, so today it would show the loader forever. |
| SCN-AUTH-08 | A session expires while the composer is open | NOT_EXECUTED | Needs a live tenant. `PostService` has no 401 handling, so the writer would lose the draft. |
