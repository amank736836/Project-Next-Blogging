# Post schema — test cases

Feature: [FEAT-002](../../features/FEAT-002-post-crud/README.md) ·
Requirements: REQ-003/03, REQ-016/02/04/05/06, REQ-025

| Cases | Assertions | Sheets |
| --- | --- | --- |
| 14 | 18 | [positive](positive.md) (7) · [negative](negative.md) (6) · [edge-cases](edge-cases.md) (5) · [regression](regression.md) |

`TC-DB-008` and `TC-EDGE-001` are parameterised across the five required fields, which is
why 14 case IDs produce 18 assertions.

These tests compile the real Mongoose schema in-process. They never connect — there is no
MongoDB in this environment, and see [../../test-scenarios/database.md](../../test-scenarios/database.md)
for what that blocks.
