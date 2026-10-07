# FEAT-010 · Test scenarios

| SCN ID | Type | Scenario | Automated? | Test case |
| --- | --- | --- | --- | --- |
| SCN-UI-39 | Functional | `splitWords` splits on whitespace, drops empties, marks the last word, and returns `[]` for falsy input. | **No — should be** | — |
| SCN-UI-40 | Functional | `MOTION` exposes the documented vocabulary (`duration 0.9`, `stagger 0.06`, `start 'top 86%'`, `ease 'expo.out'`). | **No — should be** | — |
| SCN-MOT-01 | Functional | **Manual** — every reveal animation runs once and does not re-trigger on scroll back. | No | — |
| SCN-MOT-02 | Functional | **Manual** — with `prefers-reduced-motion: reduce`, no element animates and **nothing is hidden**. | No | — |
| SCN-MOT-03 | Edge | **Manual** — navigating away mid-animation leaves no leaked ScrollTrigger (the `gsap.context()` revert). | No | — |
| SCN-MOT-04 | UI | **Manual** — the reading progress bar on `/post/[slug]` tracks the article, not the document. | No | — |
| SCN-MOT-05 | UI | **Manual** — `DrawSvg` completes its stroke and leaves the shape fully visible. | No | — |
| SCN-MOT-06 | UI | **Manual** — the ambient layer is `pointer-events: none` and never blocks a click. | No | — |
| SCN-MOT-07 | UI | **Manual** — both themes render every component correctly (`/demo` exists for exactly this). | No | [FEAT-012](../FEAT-012-design-preview/README.md) |
| SCN-PERF-03 | Performance | **Manual** — scroll jank and main-thread time on a long archive with tilt + parallax active. | No | [../../test-scenarios/performance.md](../../test-scenarios/performance.md) |

## Coverage

0 of 10 automated. Two of them (`SCN-UI-39`, `SCN-UI-40`) are pure-function tests that
could be written immediately and are the cheapest coverage win available.
