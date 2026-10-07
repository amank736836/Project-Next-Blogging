# FEAT-011 · Test scenarios

| SCN ID | Type | Scenario | Automated? | Test case |
| --- | --- | --- | --- | --- |
| SCN-ERR-01 | Negative | An unmatched route answers HTTP 404. | Yes (live) | SMK-12 |
| SCN-ERR-02 | Negative | **Manual** — the 404 page renders its ghost number, brand mark and both links. | No | — |
| SCN-ERR-03 | Negative | **Manual** — a component that throws renders the branded boundary, not the Next.js default. | No | — |
| SCN-ERR-04 | Negative | **Manual** — "Try again" calls `reset()` and recovers the segment. | No | — |
| SCN-ERR-05 | Edge | **Manual** — an error message longer than 320 characters is truncated in the `<pre>`. | No | — |
| SCN-ERR-06 | Negative | An API failure returns JSON with an `error` key. | Yes | TC-NEG-001, TC-NEG-005 |
| SCN-ERR-07 | Negative | A malformed request body is handled. | Yes — but as 500, which is wrong | TC-NEG-003, TC-NEG-004, SMK-20 |
| SCN-ERR-08 | Negative | **Manual** — a list page whose fetch fails shows the empty shelf, not a crash. | No | — |
| SCN-ERR-09 | Negative | **Manual** — `PostForm` submit failure gives the writer *some* feedback. | No — it gives none today | — |
| SCN-ERR-10 | Negative | **Manual** — a failed delete on the article page does not leave an unhandled rejection. | No — it does today | [BUG-021](../../bugs/open/BUG-021-unhandled-rejection-on-delete.md) |

## Coverage

3 of 10 automated.
