# FEAT-007 · Test cases — index

Live smoke cases only — see `CHECKS` in
[../../automation/scripts/api-smoke.mjs](../../automation/scripts/api-smoke.mjs):

| Case | Route | Expectation |
| --- | --- | --- |
| SMK-03 | `GET /features` | `200` |
| SMK-04 | `GET /pricing` | `200` |
| SMK-06 | `GET /privacy` | `200` |
| SMK-07 | `GET /terms` | `200` |
| SMK-19 | `GET /` | `200` + security header inventory (all absent → BUG-014) |

```bash
npm run test:smoke
```

No Vitest cases exist for these pages. If one is added, the highest-value target is the
`/pricing` billing toggle, because it is the only arithmetic on the page.
