# Authentication — negative cases

## TC-UI-002 — An anonymous visitor is sent to `/login`

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-002 |
| Title | Signed-out visitor is redirected to `/login` and sees no content |
| Feature | [FEAT-001](../../features/FEAT-001-authentication/README.md) |
| Requirement | REQ-002, REQ-023 |
| Preconditions | Mocked provider; `isLoaded=true`, `isSignedIn=false` |
| Test Data | — |
| Steps | 1. Render the gate with protected children 2. Assert `router.replace` was called with `"/login"` 3. Assert the children are absent from the document |
| Expected Result | One redirect to `/login`; no protected content in the DOM |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/auth-gate.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Client-side only. A caller who hits the data API directly bypasses this entirely — [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md) |

## Not tested

| SCN ID | Case | Status | Why |
| --- | --- | --- | --- |
| SCN-SEC-01 | Real sign-up, sign-in, MFA, OAuth, magic link, session expiry, sign-out | BLOCKED | Requires a live Clerk tenant. No tenant, no account and no reachable Clerk API in this environment. |
| SCN-SEC-02 | A forged or expired session cookie does not grant access | BLOCKED | Same. Also: nothing in this application checks a session server-side, so the meaningful test is the one that proves the API is unprotected — that is TC-SEC-003, TC-SEC-005 and TC-SEC-007. |
