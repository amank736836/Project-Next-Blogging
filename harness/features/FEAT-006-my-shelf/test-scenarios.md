# FEAT-006 · Test scenarios

| SCN ID | Type | Scenario | Automated? | Test case |
| --- | --- | --- | --- | --- |
| SCN-SHELF-01 | API | `?userId=` scopes to one writer. | Yes | TC-API-003 |
| SCN-SHELF-02 | Security | The same endpoint returns another writer's drafts to anyone. | Yes | TC-SEC-002 |
| SCN-SHELF-03 | UI | The route is gated: signed-out visitors are redirected. | Yes | TC-UI-001, TC-UI-002 |
| SCN-SHELF-04 | UI | **Manual** — the three tabs filter the grid and their counts are correct. | No — fails today | [BUG-001](../../bugs/open/BUG-001-all-posts-drafts-never-shown.md) |
| SCN-SHELF-05 | UI | **Manual** — the total / published / drafts stats match the data. | No — fails today | [BUG-001](../../bugs/open/BUG-001-all-posts-drafts-never-shown.md) |
| SCN-SHELF-06 | UI | **Manual** — the three distinct empty states. | No | — |
| SCN-SHELF-07 | Negative | **Manual** — a failing fetch shows an empty shelf, not an error. | No | — |
| SCN-SHELF-08 | UI | **Manual** — newest-first ordering. | No | — |
| SCN-INT-04 | Integration | **Manual** — create a draft, reload the shelf, confirm it appears under Drafts. | No — this is the reproduction for BUG-001 | — |

## Coverage

3 of 9 automated. This is the feature with the worst ratio of defects to coverage.
