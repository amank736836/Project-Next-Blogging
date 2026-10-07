# FEAT-004 · Test scenarios

| SCN ID | Type | Scenario | Automated? | Test case |
| --- | --- | --- | --- | --- |
| SCN-READ-01 | API | A known slug returns the full document. | Yes | TC-API-006 |
| SCN-READ-02 | Negative | An unknown slug returns 404 with a stable message. | Yes | TC-API-007 |
| SCN-READ-03 | Security | **A draft is served to an anonymous caller** — the route ignores `status`. | Yes | TC-SEC-004 |
| SCN-READ-04 | UI | The ownership affordance is shown to the author and hidden from everyone else. | Yes (via `PostCard`, identical logic) | TC-UI-016, TC-SEC-009, TC-SEC-010 |
| SCN-READ-05 | UI | **Manual** — the masthead shows the *author*, not the viewer. | No — fails today | [BUG-003](../../bugs/open/BUG-003-article-shows-viewer-as-author.md) |
| SCN-READ-06 | UI | **Manual** — the reading rail progress tracks scroll and the minutes estimate matches the word count. | No | — |
| SCN-READ-07 | UI | **Manual** — Copy link writes the current URL and reverts after 2.2 s; a blocked clipboard is swallowed silently. | No | — |
| SCN-READ-08 | Edge | **Manual** — back-to-top appears past 900 px and is absent under reduced motion. | No | — |
| SCN-READ-09 | Negative | **Manual** — a fetch failure redirects to `/` rather than showing an error. | No | — |
| SCN-READ-10 | Security | **Manual** — a post whose `content` contains `<img src=x onerror=…>` must not execute in a reader's browser. | No — storage proven, execution `NOT_EXECUTED` | [BUG-022](../../bugs/open/BUG-022-stored-xss-post-content.md) |
| SCN-REG-03 | Regression | Changing `html-react-parser` usage must not reintroduce raw `dangerouslySetInnerHTML`. | Partially | TC-EDGE-003 pins that markup is stored verbatim |
| SCN-PERF-05 | Performance | **Manual** — the hero image is the LCP element and is marked `priority`. | No | [../../test-scenarios/performance.md](../../test-scenarios/performance.md) |

## Coverage

4 of 11 scenarios automated. The page component is at **0% line coverage** — the single
largest gap in the harness, because it is 308 lines of the most user-visible code.
