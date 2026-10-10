# FEAT-001 · Test scenarios

Feature-scoped catalogue. Cross-cutting suites that also cover this feature are linked.

| SCN ID | Type | Scenario | Automated? | Test case |
| --- | --- | --- | --- | --- |
| SCN-AUTH-01 | Functional | A signed-in writer is shown the protected content without a redirect. | Yes | TC-UI-001 |
| SCN-AUTH-02 | Negative | A signed-out visitor is redirected to `/login` and never sees the content. | Yes | TC-UI-002 |
| SCN-AUTH-03 | Edge | Clerk is still loading (`isLoaded === false`): the branded loader is shown, no redirect, no content. | Yes | TC-UI-003 |
| SCN-AUTH-04 | Edge | Transition from loading to signed-out must not flash protected content. | Yes | TC-UI-004 |
| SCN-AUTH-05 | Functional | Inverse gate (`authentication={false}`) redirects a signed-in visitor to `/`. | Yes | TC-UI-005 |
| SCN-AUTH-06 | Functional | Inverse gate renders children for an anonymous visitor. | Yes | TC-UI-006 |
| SCN-AUTH-07 | Functional | Header shows the guest action set when signed out. | Yes | TC-UI-023 |
| SCN-AUTH-08 | Functional | Header shows the member action set and the UserButton when signed in. | Yes | TC-UI-024, TC-UI-025 |
| SCN-AUTH-09 | UI | Mobile sheet toggles `aria-expanded` and locks body scroll. | Yes | TC-UI-026 |
| SCN-AUTH-10 | UI | Mobile sheet closes on Escape and restores the previous `overflow`. | Yes | TC-UI-027 |
| SCN-AUTH-11 | Security | Ownership affordance hidden from a non-owner who is signed in. | Yes | TC-SEC-009 |
| SCN-AUTH-12 | Security | Ownership affordance hidden from an anonymous visitor. | Yes | TC-SEC-010 |
| SCN-SEC-01 | Security | **Manual** — real Clerk sign-up, sign-in, MFA, OAuth, magic link, session expiry, sign-out. Requires a live tenant. | No | [../../test-scenarios/security.md](../../test-scenarios/security.md) |
| SCN-SEC-02 | Security | **Manual** — attempt to reach a protected page with a forged / expired Clerk session cookie. | No | [../../test-scenarios/security.md](../../test-scenarios/security.md) |
| SCN-INT-01 | Integration | **Manual** — sign in, create a post, sign out, confirm the post still exists and its `userId` matches. | No | [../../test-scenarios/integration.md](../../test-scenarios/integration.md) |

## Coverage

12 of 14 scenarios automated. The two open ones both need a live Clerk tenant.
