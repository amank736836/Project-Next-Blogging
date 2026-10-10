# Test scenarios

A **scenario** is a situation worth testing, expressed without steps. A **test case** is the
executable form of one. Scenarios live here, grouped by *type* — the way a tester plans a
cycle. Cases live in [../test-cases/](../test-cases/README.md), grouped by *module* — the
way an engineer finds them.

Feature-specific catalogues also exist inside each
[../features/FEAT-xxx-*/test-scenarios.md](../features/README.md). They are not duplicates:
a feature catalogue lists *its* scenarios and links here for the cross-cutting suites that
also cover them.

| File | Scope | Count |
| --- | --- | --- |
| [smoke.md](smoke.md) | The checks that must pass before anything else | 12 |
| [functional.md](functional.md) | Happy paths and alternate flows | 34 |
| [negative.md](negative.md) | Invalid input, missing input, invalid state | 17 |
| [edge-cases.md](edge-cases.md) | Empty, zero, maximum, boundary, special characters | 19 |
| [integration.md](integration.md) | Frontend → backend → database → external services | 11 |
| [regression.md](regression.md) | What a change is most likely to break | 14 |
| [api.md](api.md) | The HTTP surface, endpoint by endpoint | 21 |
| [database.md](database.md) | Schema, indexes, data integrity | 14 |
| [ui.md](ui.md) | Components, forms, navigation, accessibility | 49 |
| [performance.md](performance.md) | Response time, throughput, memory | 11 |
| [security.md](security.md) | AuthN, authZ, IDOR, injection, headers | 28 |

**230 scenarios across the 11 type catalogues**, plus the feature-local ones under
[../features/](../features/README.md).

## ID scheme

`SCN-<TYPE>-<nn>` where `TYPE` is `SMOKE`, `FN`, `NEG`, `EDGE`, `INT`, `REG`, `API`, `DB`,
`UI`, `PERF` or `SEC`. Feature-local catalogues also use feature-specific prefixes
(`SCN-AUTH-`, `SCN-API-`, `SCN-ARCH-`, `SCN-SHELF-`, `SCN-CT-`, `SCN-TH-`, `SCN-MOT-`,
`SCN-ERR-`, `SCN-DEMO-`, `SCN-UP-`, `SCN-READ-`, `SCN-MKT-`) which are unique by prefix.

## Status legend

Every scenario carries one of:

| Status | Meaning |
| --- | --- |
| `AUTOMATED` | An executable test exists; its `TC-`/`SMK-` id is given |
| `MANUAL` | A written procedure exists; needs a human and a browser |
| `NOT_EXECUTED` | Written but never run in this cycle |
| `BLOCKED` | Cannot be run — the reason is stated (no browser, no Clerk tenant, no MongoDB) |
