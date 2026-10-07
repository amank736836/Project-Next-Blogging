# Test cases

One row per case, in the sheet format defined by
[../TESTING_STRATEGY.md](../TESTING_STRATEGY.md) §Case sheet. 88 executable cases plus 20
live smoke checks.

`SCN ID` is written `—` where a case was derived straight from the source code rather than
from a scenario in [../test-scenarios/](../test-scenarios/README.md). That is honest:
several of these were written by reading a branch in the handler and asking "what would a
test prove here". They are still traced to a feature and a requirement.

## Index

| Module | Cases | Sheets |
| --- | --- | --- |
| [authentication](authentication/README.md) | 6 | positive · negative · edge-cases |
| [post-api](post-api/README.md) | 21 | positive · negative · edge-cases · security |
| [post-form](post-form/README.md) | 13 | positive · negative |
| [upload-api](upload-api/README.md) | 5 | positive · negative |
| [database](database/README.md) | 14 ids / 18 assertions | positive · negative · edge-cases · regression |
| [archive-ui](archive-ui/README.md) | 14 | positive · negative · edge-cases · security |
| [contact](contact/README.md) | 9 | positive · negative · edge-cases |
| [theme](theme/README.md) | 6 | positive · edge-cases |
| [security](security/README.md) | — | Cross-cutting index of every `TC-SEC-*` |
| [smoke](smoke.md) | 20 | Live HTTP checks, run by a script rather than Vitest |

Total 88 Vitest cases + 20 smoke checks = **108 distinct case IDs**, producing **112 passing
assertions** (four cases are parameterised: `TC-DB-008` ×5 and `TC-EDGE-001`/`TC-EDGE-005`
each expand across the required fields).

## Result convention

| Status | Meaning |
| --- | --- |
| `PASS` | Ran in `RUN-2026-10-07-001` and the assertion held |
| `FAIL` | Ran and the assertion did not hold |
| `BLOCKED` | Cannot run in this environment; the reason is stated on the case |
| `NOT_RUN` | Written down but never executed |

Every `PASS` in these sheets is backed by
[../test-results/latest/execution-RUN-2026-10-07-001.md](../test-results/latest/execution-RUN-2026-10-07-001.md).
There is no other source for them.

## Security cases read backwards

The 10 `TC-SEC-*` cases split two ways, and the distinction is the most important thing in
this directory:

* **Passing because the protection exists** — `TC-SEC-009`, `TC-SEC-010`. These are normal
  tests.
* **Passing because the protection is absent** — `TC-SEC-002` through `TC-SEC-008`. Each
  asserts the *defective* behaviour and names the bug in its title. Fixing the bug turns
  the test red, which is the point: it forces whoever fixes it to rewrite the assertion
  instead of deleting it.

See [../test-scenarios/security.md](../test-scenarios/security.md) for the full reasoning.
