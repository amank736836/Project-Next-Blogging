# FEAT-001 · Test data

Authentication tests need identities, not content. All values are synthetic.

| Data | Value | Where |
| --- | --- | --- |
| Default author id | `user_harness_alice` | [../../test-data/fixtures/posts.js](../../test-data/fixtures/posts.js) `USER_A` |
| Second (non-owner) id | `user_harness_bob` | same file, `USER_B` |
| Fake Clerk user | `{ id, username, fullName, primaryEmailAddress, imageUrl }` | [../../automation/utilities/mocks/clerk.jsx](../../automation/utilities/mocks/clerk.jsx) `makeUser()` |
| Publishable key (placeholder) | `harness-placeholder-publishable-key` | [../../automation/utilities/setup.js](../../automation/utilities/setup.js) |
| Session token (placeholder) | `harness-fake-session-token` | `createClerkMock().useAuth().getToken` |

## For the manual scenarios

`SCN-SEC-01` and `SCN-INT-01` need a real Clerk tenant. Credentials must come from the
environment, never from this folder:

```bash
TEST_USER_EMAIL=${TEST_USER_EMAIL}
TEST_USER_PASSWORD=${TEST_USER_PASSWORD}
TEST_USER_MFA_CODE=${TEST_USER_MFA_CODE}     # if MFA is enabled on the tenant
```

Create at least three accounts on the tenant: one plain, one with MFA, one OAuth-only.
Never reuse a personal account.
