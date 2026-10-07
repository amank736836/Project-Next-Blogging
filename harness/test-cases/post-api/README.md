# Post API — test cases

Feature: [FEAT-002](../../features/FEAT-002-post-crud/README.md) ·
Requirements: REQ-016…13, REQ-023/03/04, REQ-NF-02

| Cases | Sheets |
| --- | --- |
| 21 | [positive](positive.md) (11) · [negative](negative.md) (4) · [security](security.md) (6) |

These 21 Vitest cases run against the real exported route handlers, plus 6 live HTTP checks
in [../smoke.md](../smoke.md) (`SMK-13`, `SMK-14`, `SMK-15`, `SMK-16`, `SMK-18`, `SMK-20`).
