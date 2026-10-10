# FEAT-002 · Test cases — index

| Sheet | Cases |
| --- | --- |
| [../../test-cases/post-api/positive.md](../../test-cases/post-api/positive.md) | TC-API-001…011 |
| [../../test-cases/post-api/negative.md](../../test-cases/post-api/negative.md) | TC-NEG-001…005, TC-SEC-002…008 |
| [../../test-cases/post-api/edge-cases.md](../../test-cases/post-api/edge-cases.md) | TC-EDGE-001…005 |
| [../../test-cases/post-form/positive.md](../../test-cases/post-form/positive.md) | TC-UI-029…037 |
| [../../test-cases/post-form/negative.md](../../test-cases/post-form/negative.md) | TC-NEG-008, TC-NEG-009, TC-NEG-010, TC-EDGE-009 |

Automation:
[../../automation/api/posts-collection.test.js](../../automation/api/posts-collection.test.js) (10),
[../../automation/api/posts-slug.test.js](../../automation/api/posts-slug.test.js) (11),
[../../automation/database/post-schema.test.js](../../automation/database/post-schema.test.js) (18),
[../../automation/ui/post-form.test.jsx](../../automation/ui/post-form.test.jsx) (13).

```bash
npm run test:api && npm run test:db
npx vitest run --config harness/vitest.config.mjs harness/automation/ui/post-form.test.jsx
```
