# FEAT-007 · Test scenarios

| SCN ID | Type | Scenario | Automated? | Test case |
| --- | --- | --- | --- | --- |
| SCN-MKT-01 | Functional | `/features` renders for an anonymous visitor. | Yes (live) | SMK-03 |
| SCN-MKT-02 | Functional | `/pricing` renders for an anonymous visitor. | Yes (live) | SMK-04 |
| SCN-MKT-03 | Functional | `/privacy` renders for an anonymous visitor. | Yes (live) | SMK-06 |
| SCN-MKT-04 | Functional | `/terms` renders for an anonymous visitor. | Yes (live) | SMK-07 |
| SCN-MKT-05 | UI | **Manual** — the billing toggle switches every plan's displayed price. | No | — |
| SCN-MKT-06 | UI | **Manual** — the FAQ accordion opens one item at a time and exposes state to assistive tech. | No | — |
| SCN-MKT-07 | UI | **Manual** — the legal index highlights the section in view and its links jump correctly. | No | — |
| SCN-MKT-08 | UI | **Manual** — every CTA on these pages points at a route that exists. | No | — |
| SCN-MKT-09 | Regression | **Manual** — the pricing table must not advertise a capability that does not exist. | No | see README |
| SCN-SEC-12 | Security | These public responses carry the standard security headers. | Yes (live) — **fails** | SMK-19, [BUG-014](../../bugs/open/BUG-014-no-security-headers.md) |
| SCN-PERF-02 | Performance | **Manual** — these are the prerendered pages; measure TTFB and LCP against the advertised 98 ms. | No | [../../test-scenarios/performance.md](../../test-scenarios/performance.md) |

## Coverage

4 of 11 automated, all of them at the "does it answer" level only.
