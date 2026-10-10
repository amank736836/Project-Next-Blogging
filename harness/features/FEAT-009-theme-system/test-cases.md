# FEAT-009 · Test cases — index

| Sheet | Cases |
| --- | --- |
| [../../test-cases/theme/positive.md](../../test-cases/theme/positive.md) | TC-UI-017, TC-UI-018, TC-UI-019, TC-UI-020, TC-UI-021 |
| [../../test-cases/theme/edge-cases.md](../../test-cases/theme/edge-cases.md) | TC-UI-022 |

Automation: [../../automation/ui/theme.test.jsx](../../automation/ui/theme.test.jsx) (6).

```bash
npx vitest run --config harness/vitest.config.mjs harness/automation/ui/theme.test.jsx
```

No fixture data is needed — the theme tests drive the DOM directly and clear
`localStorage` in `beforeEach`.
