# FEAT-001 · Requirements

| ID | Requirement | Status | Test |
| --- | --- | --- | --- |
| [REQ-001](../../requirements/functional-requirements.md) | A visitor can create an account and sign in using Clerk's hosted widgets. | IMPLEMENTED — UNTESTED | SCN-SEC-01 (manual) |
| [REQ-002](../../requirements/functional-requirements.md) | Writer-only routes must not render their content to a signed-out visitor and must send them to `/login`. | IMPLEMENTED | TC-UI-001…006 |
| [REQ-014](../../requirements/functional-requirements.md) | Navigation adapts to auth state and is operable on mobile. | IMPLEMENTED | TC-UI-023…028 |
| [REQ-023](../../requirements/functional-requirements.md) | Every mutating API endpoint must authenticate the caller. | **NOT IMPLEMENTED** | TC-SEC-003/005/007 |
| [REQ-024](../../requirements/functional-requirements.md) | Every read of a non-public resource must check that the caller may read it. | **NOT IMPLEMENTED** | TC-SEC-002/004 |
| [REQ-NF-03](../../requirements/non-functional-requirements.md) | Every mutating endpoint must authenticate and authorise the caller. | **VIOLATED** | BUG-004 |

## Notes

`REQ-001` cannot be automated in this harness: Clerk's widget performs a real network
round-trip to a Clerk Frontend API and requires a genuine publishable key. The harness
mocks the boundary and tests our reaction to it — which is where the application's own
logic lives. See [../../test-scenarios/security.md](../../test-scenarios/security.md)
`SCN-SEC-01` for the manual procedure.
