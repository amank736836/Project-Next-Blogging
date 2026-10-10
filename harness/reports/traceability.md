# Traceability

Requirement → feature → scenario → case → automated test → result → evidence.

Generated from the requirement tables in [../requirements/](../requirements/README.md) and the
result files of `RUN-2026-10-07-001`. The test column is populated by matching the `TC-`/`SMK-`
ids that appear in each requirement row against the executed results — so a claim of "automated"
here means that check actually ran and passed.

**41 requirements** are traced below.

| Requirement | Feature | Scenario(s) | Case(s) | Automated test | Result | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-001 | FEAT-001 | — | — | — | NOT_AUTOMATED | — |
| REQ-002 | FEAT-001 | `SCN-FN-01`, `SCN-REG-04`, `SCN-UI-01` | `TC-UI-001` | `TC-UI-001` `ui/auth-gate.test.jsx` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-003 | FEAT-002 | `SCN-DB-01`, `SCN-REG-02` | `TC-DB-001` | `TC-DB-001` `database/post-schema.test.js` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-004 | FEAT-002 | `SCN-DB-02`, `SCN-DB-08`, `SCN-API-09`, `SCN-NEG-01` | `TC-DB-002`, `TC-DB-008`, `TC-NEG-001` | `TC-DB-002` `database/post-schema.test.js`<br>`TC-DB-008` `database/post-schema.test.js`<br>`TC-NEG-001` `api/posts-collection.test.js` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-005 | FEAT-003 | `SCN-API-01`, `SCN-FN-13`, `SCN-INT-04`, `SCN-REG-07` | `TC-API-001` | `TC-API-001` `api/posts-collection.test.js` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-006 | FEAT-003 | `SCN-API-02`, `SCN-FN-14`, `SCN-REG-07` | `TC-API-002` | `TC-API-002` `api/posts-collection.test.js` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-007 | FEAT-004 | `SCN-API-14`, `SCN-FN-21`, `SCN-API-15`, `SCN-FN-22`, `SCN-NEG-04` | `TC-API-006`, `TC-API-007` | `TC-API-006` `api/posts-slug.test.js`<br>`TC-API-007` `api/posts-slug.test.js` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-008 | FEAT-002 | `SCN-API-17`, `SCN-FN-17`, `SCN-API-18`, `SCN-NEG-04` | `TC-API-008`, `TC-API-009` | `TC-API-008` `api/posts-slug.test.js`<br>`TC-API-009` `api/posts-slug.test.js` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-009 | FEAT-002 | `SCN-API-20`, `SCN-FN-18`, `SCN-API-21`, `SCN-EDGE-07`, `SCN-NEG-04` | `TC-API-010`, `TC-API-011` | `TC-API-010` `api/posts-slug.test.js`<br>`TC-API-011` `api/posts-slug.test.js` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-010 | FEAT-005 | `SCN-FN-29`, `SCN-REG-08`, `SCN-FN-30` | `TC-API-012`, `TC-API-013` | `TC-API-012` `api/upload.test.js`<br>`TC-API-013` `api/upload.test.js` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-011 | FEAT-003 | `SCN-FN-25`, `SCN-REG-06`, `SCN-UI-14`, `SCN-EDGE-15`, `SCN-EDGE-13`, `SCN-EDGE-16` | `TC-UI-014`, `TC-EDGE-007`, `TC-EDGE-008` | `TC-UI-014` `ui/post-card.test.jsx`<br>`TC-EDGE-007` `ui/post-card.test.jsx`<br>`TC-EDGE-008` `ui/post-card.test.jsx` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-012 | FEAT-004 | `SCN-UI-16`, `SCN-SEC-11`, `SCN-SEC-21`, `SCN-SEC-12` | `TC-UI-016`, `TC-SEC-009`, `TC-SEC-010` | `TC-UI-016` `ui/post-card.test.jsx`<br>`TC-SEC-009` `ui/post-card.test.jsx`<br>`TC-SEC-010` `ui/post-card.test.jsx` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-013 | FEAT-009 | `SCN-REG-05`, `SCN-UI-26` | `TC-UI-017` | `TC-UI-017` `ui/theme.test.jsx` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-014 | FEAT-003 | `SCN-FN-03`, `SCN-REG-10`, `SCN-UI-07` | `TC-UI-023` | `TC-UI-023` `ui/header-nav.test.jsx` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-015 | FEAT-002 | `SCN-FN-08`, `SCN-REG-01`, `SCN-UI-18` | `TC-UI-030`, `TC-NEG-010` | `TC-UI-030` `ui/post-form.test.jsx`<br>`TC-NEG-010` `ui/post-form.test.jsx` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-016 | FEAT-002 | `SCN-DB-03`, `SCN-DB-09` | `TC-DB-003`, `TC-DB-009` | `TC-DB-003` `database/post-schema.test.js`<br>`TC-DB-009` `database/post-schema.test.js` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-017 | FEAT-008 | `SCN-NEG-10`, `SCN-REG-09`, `SCN-UI-32`, `SCN-NEG-11`, `SCN-NEG-12`, `SCN-EDGE-14` | `TC-UI-007`, `TC-NEG-006`, `TC-NEG-007`, `TC-EDGE-006` | `TC-UI-007` `ui/contact-form.test.jsx`<br>`TC-NEG-006` `ui/contact-form.test.jsx`<br>`TC-NEG-007` `ui/contact-form.test.jsx`<br>`TC-EDGE-006` `ui/contact-form.test.jsx` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-018 | FEAT-007 | `SCN-SMOKE-05` | `SMK-03` | `SMK-03` `scripts/api-smoke.mjs` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-019 | FEAT-011 | `SCN-SMOKE-08` | `SMK-12` | `SMK-12` `scripts/api-smoke.mjs` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-020 | FEAT-002 | `SCN-DB-04`, `SCN-DB-03` | `TC-DB-004`, `TC-DB-003` | `TC-DB-004` `database/post-schema.test.js`<br>`TC-DB-003` `database/post-schema.test.js` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-021 | FEAT-003 | — | — | — | NOT_AUTOMATED | — |
| REQ-022 | FEAT-012 | `SCN-SMOKE-04` | `SMK-02` | `SMK-02` `scripts/api-smoke.mjs` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-023 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-024 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-025 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-026 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-027 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-028 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-029 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-NF-01 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-NF-02 | — | `SCN-SEC-20`, `SCN-SMOKE-09` | `SMK-13` | `SMK-13` `scripts/api-smoke.mjs` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-NF-03 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-NF-04 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-NF-05 | — | `SCN-SEC-23`, `SCN-SEC-24` | `SMK-19` | `SMK-19` `scripts/api-smoke.mjs` | PASS | [`vitest-results.json`](../test-results/latest/vitest-results.json) |
| REQ-NF-06 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-NF-07 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-NF-08 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-NF-09 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-NF-10 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-NF-11 | — | — | — | — | NOT_AUTOMATED | — |
| REQ-NF-12 | — | — | — | — | NOT_AUTOMATED | — |

## Summary

| | Count |
| --- | --- |
| Requirements traced | 41 |
| With at least one executed check | 22 |
| With no automated check | 19 |

## The untraced requirements

These are the holes. Each is either a page the harness could not reach without a browser and
a database, or a requirement the application does not implement at all.

| Requirement | Why there is no test |
| --- | --- |
| REQ-001 | No automated coverage |
| REQ-021 | No automated coverage |
| REQ-023 | Not implemented — BUG-004, BUG-004 |
| REQ-024 | Not implemented — BUG-005, BUG-005, BUG-006, BUG-006 |
| REQ-025 | Not implemented — BUG-007, BUG-007 |
| REQ-026 | Not implemented — BUG-022, BUG-022 |
| REQ-027 | Not implemented — BUG-003, BUG-003 |
| REQ-028 | Not implemented — BUG-001, BUG-001, BUG-002, BUG-002 |
| REQ-029 | Not implemented — BUG-008, BUG-008 |
| REQ-NF-01 | Not implemented — BUG-017, BUG-017, BUG-015, BUG-015 |
| REQ-NF-03 | Not implemented — BUG-004, BUG-004 |
| REQ-NF-04 | Not implemented — BUG-022, BUG-022 |
| REQ-NF-06 | No automated coverage |
| REQ-NF-07 | No automated coverage |
| REQ-NF-08 | No automated coverage |
| REQ-NF-09 | No automated coverage |
| REQ-NF-10 | Not implemented — BUG-012, BUG-012 |
| REQ-NF-11 | No automated coverage |
| REQ-NF-12 | No automated coverage |

## Reverse index — case to requirement

Every executed check, and what it traces back to.

| TC / SMK | Automated test | Result | Requirement(s) |
| --- | --- | --- | --- |
| `SMK-01` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-02` | `scripts/api-smoke.mjs` | PASS | REQ-022 |
| `SMK-03` | `scripts/api-smoke.mjs` | PASS | REQ-018 |
| `SMK-04` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-05` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-06` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-07` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-08` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-09` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-10` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-11` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-12` | `scripts/api-smoke.mjs` | PASS | REQ-019 |
| `SMK-13` | `scripts/api-smoke.mjs` | PASS | REQ-NF-02 |
| `SMK-14` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-15` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-16` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-17` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-18` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `SMK-19` | `scripts/api-smoke.mjs` | PASS | REQ-NF-05 |
| `SMK-20` | `scripts/api-smoke.mjs` | PASS | — *(derived from source, not from a requirement row)* |
| `TC-API-001` | `api/posts-collection.test.js` | PASSED | REQ-005 |
| `TC-API-002` | `api/posts-collection.test.js` | PASSED | REQ-006 |
| `TC-API-003` | `api/posts-collection.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-API-004` | `api/posts-collection.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-API-005` | `api/posts-collection.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-API-006` | `api/posts-slug.test.js` | PASSED | REQ-007 |
| `TC-API-007` | `api/posts-slug.test.js` | PASSED | REQ-007 |
| `TC-API-008` | `api/posts-slug.test.js` | PASSED | REQ-008 |
| `TC-API-009` | `api/posts-slug.test.js` | PASSED | REQ-008 |
| `TC-API-010` | `api/posts-slug.test.js` | PASSED | REQ-009 |
| `TC-API-011` | `api/posts-slug.test.js` | PASSED | REQ-009 |
| `TC-API-012` | `api/upload.test.js` | PASSED | REQ-010 |
| `TC-API-013` | `api/upload.test.js` | PASSED | REQ-010 |
| `TC-API-014` | `api/upload.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-DB-001` | `database/post-schema.test.js` | PASSED | REQ-003 |
| `TC-DB-002` | `database/post-schema.test.js` | PASSED | REQ-004 |
| `TC-DB-003` | `database/post-schema.test.js` | PASSED | REQ-016, REQ-020 |
| `TC-DB-004` | `database/post-schema.test.js` | PASSED | REQ-020 |
| `TC-DB-005` | `database/post-schema.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-DB-006` | `database/post-schema.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-DB-007` | `database/post-schema.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-DB-008` | `database/post-schema.test.js` | PASSED | REQ-004 |
| `TC-DB-009` | `database/post-schema.test.js` | PASSED | REQ-016 |
| `TC-EDGE-001` | `database/post-schema.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-EDGE-002` | `database/post-schema.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-EDGE-003` | `database/post-schema.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-EDGE-004` | `database/post-schema.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-EDGE-005` | `database/post-schema.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-EDGE-006` | `ui/contact-form.test.jsx` | PASSED | REQ-017 |
| `TC-EDGE-007` | `ui/post-card.test.jsx` | PASSED | REQ-011 |
| `TC-EDGE-008` | `ui/post-card.test.jsx` | PASSED | REQ-011 |
| `TC-EDGE-009` | `ui/post-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-NEG-001` | `api/posts-collection.test.js` | PASSED | REQ-004 |
| `TC-NEG-002` | `api/posts-collection.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-NEG-003` | `api/posts-collection.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-NEG-004` | `api/posts-slug.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-NEG-005` | `api/upload.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-NEG-006` | `ui/contact-form.test.jsx` | PASSED | REQ-017 |
| `TC-NEG-007` | `ui/contact-form.test.jsx` | PASSED | REQ-017 |
| `TC-NEG-008` | `ui/post-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-NEG-009` | `ui/post-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-NEG-010` | `ui/post-form.test.jsx` | PASSED | REQ-015 |
| `TC-SEC-002` | `api/posts-collection.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-SEC-003` | `api/posts-collection.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-SEC-004` | `api/posts-slug.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-SEC-005` | `api/posts-slug.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-SEC-006` | `api/posts-slug.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-SEC-007` | `api/posts-slug.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-SEC-008` | `api/upload.test.js` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-SEC-009` | `ui/post-card.test.jsx` | PASSED | REQ-012 |
| `TC-SEC-010` | `ui/post-card.test.jsx` | PASSED | REQ-012 |
| `TC-UI-001` | `ui/auth-gate.test.jsx` | PASSED | REQ-002 |
| `TC-UI-002` | `ui/auth-gate.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-003` | `ui/auth-gate.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-004` | `ui/auth-gate.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-005` | `ui/auth-gate.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-006` | `ui/auth-gate.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-007` | `ui/contact-form.test.jsx` | PASSED | REQ-017 |
| `TC-UI-008` | `ui/contact-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-009` | `ui/contact-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-010` | `ui/contact-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-011` | `ui/contact-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-012` | `ui/contact-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-013` | `ui/post-card.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-014` | `ui/post-card.test.jsx` | PASSED | REQ-011 |
| `TC-UI-015` | `ui/post-card.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-016` | `ui/post-card.test.jsx` | PASSED | REQ-012 |
| `TC-UI-017` | `ui/theme.test.jsx` | PASSED | REQ-013 |
| `TC-UI-018` | `ui/theme.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-019` | `ui/theme.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-020` | `ui/theme.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-021` | `ui/theme.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-022` | `ui/theme.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-023` | `ui/header-nav.test.jsx` | PASSED | REQ-014 |
| `TC-UI-024` | `ui/header-nav.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-025` | `ui/header-nav.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-026` | `ui/header-nav.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-027` | `ui/header-nav.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-028` | `ui/header-nav.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-029` | `ui/post-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-030` | `ui/post-form.test.jsx` | PASSED | REQ-015 |
| `TC-UI-031` | `ui/post-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-032` | `ui/post-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-033` | `ui/post-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-034` | `ui/post-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-035` | `ui/post-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-036` | `ui/post-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |
| `TC-UI-037` | `ui/post-form.test.jsx` | PASSED | — *(derived from source, not from a requirement row)* |

`108` distinct check ids appear in the results. 71 of them are not named in any requirement row — they
were written by reading a branch in the code and asking what a test would prove. They are
still traced to a feature in [../test-cases/](../test-cases/README.md); the requirement column
above is the honest gap.
