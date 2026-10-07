# FEAT-012 · Test cases — index

| Case | Type | Source |
| --- | --- | --- |
| SMK-02 | Live smoke | [../../automation/scripts/api-smoke.mjs](../../automation/scripts/api-smoke.mjs) |

Proposed, not yet written:

| Proposed ID | Target | Effort |
| --- | --- | --- |
| TC-DB-010 | Every `DEMO_POSTS` entry validates against the real `Post` schema | ~6 lines, no mocks |
| TC-UI-040 | `/demo` metadata sets `robots.index === false` | ~5 lines |

```bash
npm run test:smoke
```
