# FEAT-005 · Test cases — index

| Sheet | Cases |
| --- | --- |
| [../../test-cases/upload-api/positive.md](../../test-cases/upload-api/positive.md) | TC-API-012, TC-API-013 |
| [../../test-cases/upload-api/negative.md](../../test-cases/upload-api/negative.md) | TC-API-014, TC-NEG-005, TC-SEC-008, SMK-17, SMK-20 |
| [../../test-cases/post-form/negative.md](../../test-cases/post-form/negative.md) | TC-EDGE-009 |

Automation:
[../../automation/api/upload.test.js](../../automation/api/upload.test.js) (5) and
`TC-EDGE-009` in [../../automation/ui/post-form.test.jsx](../../automation/ui/post-form.test.jsx).

```bash
npx vitest run --config harness/vitest.config.mjs harness/automation/api/upload.test.js
```
