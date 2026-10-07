# Authentication — positive cases

## TC-UI-001 — A signed-in writer reaches protected content

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-001 |
| Title | Signed-in writer sees the children, no redirect |
| Feature | [FEAT-001](../../features/FEAT-001-authentication/README.md) |
| Requirement | REQ-002, REQ-018 |
| Preconditions | `AuthLayout` rendered inside a mocked `ClerkProvider`; `isLoaded=true`, `isSignedIn=true` |
| Test Data | `makeUser()` from `utilities/mocks/clerk.jsx` |
| Steps | 1. Render `<AuthLayout><div>protected content</div></AuthLayout>` 2. Assert the content is in the document 3. Assert `router.replace` was never called |
| Expected Result | Content visible; zero navigation calls |
| Actual Result | Content visible; zero navigation calls |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/auth-gate.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The `useRouter` mock is shared across the suite, so "never called" is meaningful |

## TC-UI-006 — The inverse gate lets a guest through

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-006 |
| Title | `<AuthLayout inverse>` renders children for an anonymous visitor |
| Feature | FEAT-001 |
| Requirement | REQ-002 |
| Preconditions | Mocked provider; `isLoaded=true`, `isSignedIn=false` |
| Test Data | — |
| Steps | 1. Render `<AuthLayout inverse><div>guest content</div></AuthLayout>` 2. Assert the content is visible 3. Assert no redirect |
| Expected Result | Guest content visible; no navigation |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/auth-gate.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Used by `/login` and `/signup` |

## TC-UI-005 — The inverse gate sends a signed-in visitor home

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-005 |
| Title | `<AuthLayout inverse>` redirects an already-signed-in visitor to `/` |
| Feature | FEAT-001 |
| Requirement | REQ-002 |
| Preconditions | Mocked provider; `isLoaded=true`, `isSignedIn=true` |
| Test Data | — |
| Steps | 1. Render the inverse gate with children 2. Assert `router.replace` was called with `"/"` 3. Assert the children were not rendered |
| Expected Result | One redirect to `/`; children absent |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/auth-gate.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |
