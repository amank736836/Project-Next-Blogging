# FEAT-001 · Test cases

The cases themselves live in the module-level sheets so they are not duplicated per
feature. This is the index.

| Sheet | Cases for this feature |
| --- | --- |
| [../../test-cases/authentication/positive.md](../../test-cases/authentication/positive.md) | TC-UI-001, TC-UI-005, TC-UI-006, TC-UI-023, TC-UI-024, TC-UI-025, TC-UI-026, TC-UI-027 |
| [../../test-cases/authentication/negative.md](../../test-cases/authentication/negative.md) | TC-UI-002, TC-UI-003 |
| [../../test-cases/authentication/edge-cases.md](../../test-cases/authentication/edge-cases.md) | TC-UI-004 |
| [../../test-cases/post-api/negative.md](../../test-cases/post-api/negative.md) | TC-SEC-002 … TC-SEC-008 (the authorisation failures this feature is responsible for) |

Automation: [../../automation/ui/auth-gate.test.jsx](../../automation/ui/auth-gate.test.jsx) (6),
[../../automation/ui/header-nav.test.jsx](../../automation/ui/header-nav.test.jsx) (6).

Run with:

```bash
npm run test:ui
npx vitest run --config harness/vitest.config.mjs harness/automation/ui/auth-gate.test.jsx
```
