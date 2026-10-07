# API scenarios

The complete HTTP surface, endpoint by endpoint. Every automated case here runs against the
**real route handler code** with only the storage layer replaced — see
[../TESTING_STRATEGY.md](../TESTING_STRATEGY.md).

## `GET /api/posts`

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-API-01 | No query → published posts only. | AUTOMATED | TC-API-001 |
| SCN-API-02 | `?status=inactive` → the drafts. | AUTOMATED | TC-API-002 |
| SCN-API-03 | `?userId=` scopes the result set. | AUTOMATED | TC-API-003 |
| SCN-API-04 | Both parameters together. | AUTOMATED | TC-API-003 |
| SCN-API-05 | A user with no posts → `[]`, not an error. | AUTOMATED | TC-API-004 |
| SCN-API-06 | An unrecognised `status` value → `[]`. | NOT_EXECUTED | — |
| SCN-API-07 | `userId` containing URL-reserved characters. | NOT_EXECUTED — `services/config.js` interpolates without encoding | — |

## `POST /api/posts`

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-API-08 | A valid payload → 201 with the stored document. | AUTOMATED | TC-API-005 |
| SCN-API-09 | Missing required field → error, nothing stored. | AUTOMATED | TC-NEG-001 |
| SCN-API-10 | Duplicate slug → error. | AUTOMATED | TC-NEG-002 |
| SCN-API-11 | Malformed JSON → error. | AUTOMATED | TC-NEG-003 |
| SCN-API-12 | A caller-supplied `userId` is honoured. | AUTOMATED — **this is BUG-004** | TC-SEC-003 |
| SCN-API-13 | Extra, unknown keys in the body. | NOT_EXECUTED for create; proven for update | TC-SEC-006 |

## `GET /api/posts/{slug}`

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-API-14 | A known slug → the document. | AUTOMATED | TC-API-006 |
| SCN-API-15 | An unknown slug → 404 with a stable message. | AUTOMATED | TC-API-007 |
| SCN-API-16 | A **draft** slug → served to anyone. | AUTOMATED — **this is BUG-006** | TC-SEC-004 |

## `PUT /api/posts/{slug}`

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-API-17 | A valid update → 200 with the new document. | AUTOMATED | TC-API-008 |
| SCN-API-18 | An unknown slug → 404, nothing changed. | AUTOMATED | TC-API-009 |
| SCN-API-19 | Fields outside the schema are accepted. | AUTOMATED — **this is BUG-007** | TC-SEC-006 |

## `DELETE /api/posts/{slug}`

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-API-20 | A known slug → deleted and confirmed. | AUTOMATED | TC-API-010 |
| SCN-API-21 | A repeat delete → 404. | AUTOMATED | TC-API-011 |

## `POST /api/upload`

Covered in [../features/FEAT-005-image-upload/test-scenarios.md](../features/FEAT-005-image-upload/test-scenarios.md)
(`SCN-UP-01`…`SCN-UP-12`).

## Methods the app does not implement

`PATCH`, `HEAD` and `OPTIONS` are not exported by any route. Next.js answers them with
`405`. `NOT_EXECUTED` — no test asserts this, and nothing in the app depends on it.

**16 of 21 automated.**
