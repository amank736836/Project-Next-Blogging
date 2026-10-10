# Requirements

Every requirement the harness can defend from the repository. Derived from source code,
configuration and the project's own documentation — **not** from assumption. Where the code
and the documentation disagree, both are recorded and the disagreement becomes a bug.

| File | Contents |
| --- | --- |
| [functional-requirements.md](functional-requirements.md) | `REQ-001` … `REQ-029` — what the product does. `REQ-001`…`REQ-022` exist in the code; `REQ-023`…`REQ-029` are requirements the product *implies but does not implement*, recorded separately at the bottom of that file. |
| [non-functional-requirements.md](non-functional-requirements.md) | `REQ-NF-01` … `REQ-NF-12` — how well it must do it |
| [business-rules.md](business-rules.md) | `BR-01` … `BR-20` — invariants the code enforces (or should) |

**41 requirements in total**, of which 7 exist only as gaps.

## ID scheme

`REQ-nnn` for functional, `REQ-NF-nn` for non-functional, `BR-nn` for business rules. These
three namespaces are the only ones in use. Earlier drafts of the test-case sheets used
grouped names like `REQ-SEC-03`; those have all been rewritten to the numeric IDs above, so
every `REQ-` reference anywhere in `harness/` resolves to a row in one of these files.

Requirements are grouped by theme for navigation:

| Group | IDs |
| --- | --- |
| Authentication & navigation | REQ-001, REQ-002, REQ-014 |
| Post data model | REQ-003, REQ-016, REQ-020 |
| Post API | REQ-004…REQ-009 |
| Upload | REQ-010, REQ-029 |
| Archive & cards | REQ-005, REQ-006, REQ-011, REQ-021 |
| Article reader | REQ-007, REQ-012, REQ-027 |
| Contact | REQ-017 |
| Theme | REQ-013 |
| Marketing, legal, 404, demo | REQ-018, REQ-019, REQ-022 |
| Authorisation & input safety (all unmet) | REQ-023…REQ-026, REQ-NF-02…05 |
| Shelf | REQ-028 |
| Operational | REQ-NF-01, REQ-NF-09…12 |

## Status legend

| Status | Meaning |
| --- | --- |
| `IMPLEMENTED` | Code exists and an automated test or execution confirms it |
| `IMPLEMENTED — UNTESTED` | Code exists; no automated coverage yet |
| `PARTIAL` | Code exists but does not fully satisfy the requirement |
| `VIOLATED` | A requirement the project states or implies but currently breaks — always linked to a `BUG-` |
| `NOT IMPLEMENTED` | Required by the requirement, absent from the code |
| `UNKNOWN / REQUIRES VALIDATION` | Cannot be determined from the repository |

## Rule

A requirement without a `Feature` link is a gap. A requirement with a `Feature` link but no
`SCN-` link is an untested requirement. Both are reported in
[reports/coverage.md](../reports/coverage.md) and
[reports/traceability.md](../reports/traceability.md).
