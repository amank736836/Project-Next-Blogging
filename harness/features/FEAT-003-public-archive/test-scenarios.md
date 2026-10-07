# FEAT-003 · Test scenarios

| SCN ID | Type | Scenario | Automated? | Test case |
| --- | --- | --- | --- | --- |
| SCN-ARCH-01 | API | The default query returns published posts only. | Yes | TC-API-001 |
| SCN-ARCH-02 | API | `?status=` and `?userId=` combine correctly. | Yes | TC-API-002…004 |
| SCN-ARCH-03 | UI | A card links to `/post/<slug>` and shows title, date and reading time. | Yes | TC-UI-013, TC-UI-014 |
| SCN-ARCH-04 | Edge | An undated or invalidly-dated post renders "undated". | Yes | TC-EDGE-008 |
| SCN-ARCH-05 | Edge | A near-empty post floors at "1 min read". | Yes | TC-EDGE-007 |
| SCN-ARCH-06 | UI | A draft card carries a `draft` badge; a published one does not. | Yes | TC-UI-015 |
| SCN-ARCH-07 | Security | The edit affordance follows ownership. | Yes | TC-UI-016, TC-SEC-009, TC-SEC-010 |
| SCN-ARCH-08 | UI | **Manual** — the search box filters on title and slug, and the clear button empties it. | No | — |
| SCN-ARCH-09 | UI | **Manual** — the three chips show correct counts and filter the grid. | No — and it fails today | [BUG-002](../../bugs/open/BUG-002-home-drafts-filter-dead.md) |
| SCN-ARCH-10 | UI | **Manual** — newest-first ordering. | No | — |
| SCN-ARCH-11 | UI | **Manual** — the two EmptyShelf variants ("nothing on the shelf" vs "no frames match"). | No | — |
| SCN-ARCH-12 | Negative | **Manual** — a failing API renders the empty shelf, not an error. | No | — |
| SCN-ARCH-13 | UI | Guests and members see different home pages. | Partially — SMK-01 proves the route renders; the branch itself is untested | — |
| SCN-PERF-01 | Performance | **Manual** — the archive with 500 posts: fetch time, paint time, scroll jank. | No | [../../test-scenarios/performance.md](../../test-scenarios/performance.md) |

## Coverage

7 of 14 automated.
