# FEAT-012 · Test scenarios

| SCN ID | Type | Scenario | Automated? | Test case |
| --- | --- | --- | --- | --- |
| SCN-DEMO-01 | Functional | `/demo` renders on a server with no reachable database. | Yes (live) | SMK-02 |
| SCN-DEMO-02 | Functional | **Manual** — `/demo` is not linked from any navigation element. | No | — |
| SCN-DEMO-03 | Functional | `/demo` sends `robots: noindex, nofollow`. | No — verified by reading `app/demo/page.js:8` | — |
| SCN-DEMO-04 | Regression | Every `DEMO_POSTS` entry, passed through `withAuthor`, satisfies the real `Post` schema. | **No — should be** | — |
| SCN-DEMO-05 | UI | **Manual** — every component in the kit renders correctly in light **and** dark. | No | — |
| SCN-DEMO-06 | UI | **Manual** — the three local images in `public/demo/` resolve. | No | — |
| SCN-SEC-13 | Security | **Manual** — decide whether an ungated internal preview page should be public in production. | No | see README |

## Coverage

1 of 7 automated.

`SCN-DEMO-04` is the cheapest high-value case in this feature: it needs no mocks, no DOM
and about six lines, and it would catch schema/fixture drift permanently.
