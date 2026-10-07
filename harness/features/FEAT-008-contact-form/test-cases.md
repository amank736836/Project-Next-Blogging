# FEAT-008 · Test cases — index

| Sheet | Cases |
| --- | --- |
| [../../test-cases/contact/positive.md](../../test-cases/contact/positive.md) | TC-UI-009, TC-UI-010, TC-UI-011 |
| [../../test-cases/contact/negative.md](../../test-cases/contact/negative.md) | TC-UI-007, TC-NEG-006, TC-NEG-007, TC-UI-012 |
| [../../test-cases/contact/edge-cases.md](../../test-cases/contact/edge-cases.md) | TC-EDGE-006, TC-UI-008 |

Automation: [../../automation/ui/contact-form.test.jsx](../../automation/ui/contact-form.test.jsx) (9).

```bash
npx vitest run --config harness/vitest.config.mjs harness/automation/ui/contact-form.test.jsx
```

Test data: `VALID_CONTACT` in
[../../test-data/fixtures/posts.js](../../test-data/fixtures/posts.js).
