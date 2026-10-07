# Post API — edge cases

Feature: FEAT-002 · Requirements: REQ-015/06, REQ-025

The schema-level boundary cases are executed in
[../database/edge-cases.md](../database/edge-cases.md) (`TC-EDGE-001`…`TC-EDGE-005`), which
is where they belong — the API adds no validation of its own, so the schema *is* the
boundary. Those results are restated here only to keep the API picture complete.

| TC ID | Boundary | Where executed | Status |
| --- | --- | --- | --- |
| TC-EDGE-001 | Empty string on every required field | `automation/database/post-schema.test.js` | PASS |
| TC-EDGE-002 | 2 000-char title, 1 MB body | `automation/database/post-schema.test.js` | PASS |
| TC-EDGE-003 | Hostile markup stored verbatim | `automation/database/post-schema.test.js` | PASS |
| TC-EDGE-004 | Slug case sensitivity (uniqueness is byte-exact) | `automation/database/post-schema.test.js` | PASS |
| TC-EDGE-005 | Whitespace-only value on a required field | `automation/database/post-schema.test.js` | PASS |

## API-level boundary cases that were not written

These are genuinely distinct from the schema cases and are recorded as `NOT_EXECUTED`.

| SCN ID | Case | Status | Why |
| --- | --- | --- | --- |
| SCN-API-13 | A create payload carrying unknown keys | NOT_EXECUTED | Proven for `PUT` by TC-SEC-006; the `POST` path uses `Post.create`, which applies schema casting, so the outcome likely differs. Untested. |
| SCN-EDGE-16 | A slug containing `/`, `?` or `%` | NOT_EXECUTED | Would need URL-encoding care in the test client; the app never sanitises slugs. |
| SCN-EDGE-17 | A request body at the platform limit | NOT_EXECUTED | No body-size cap is configured in `next.config.mjs`; the limit is whatever the host enforces. |
| SCN-EDGE-18 | Two concurrent creates with the same slug | NOT_EXECUTED | Needs a real unique index — BLOCKED without MongoDB. |
