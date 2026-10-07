# Negative scenarios

Invalid input, missing input, unauthorised access, invalid state, invalid API requests.

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-NEG-01 | `POST /api/posts` missing `title`. | AUTOMATED | TC-NEG-001 |
| SCN-NEG-02 | `POST /api/posts` with malformed JSON. | AUTOMATED | TC-NEG-003 |
| SCN-NEG-03 | `PUT /api/posts/{slug}` with malformed JSON. | AUTOMATED | TC-NEG-004 |
| SCN-NEG-04 | `GET`/`PUT`/`DELETE` on a slug that does not exist. | AUTOMATED | TC-API-007, TC-API-009, TC-API-011 |
| SCN-NEG-05 | `POST /api/upload` with no `file` part. | AUTOMATED | TC-API-014, SMK-17 |
| SCN-NEG-06 | `POST /api/upload` with a non-multipart body. | AUTOMATED | SMK-20 |
| SCN-NEG-07 | A Cloudinary failure during upload. | AUTOMATED | TC-NEG-005 |
| SCN-NEG-08 | Composer submitted with no title. | AUTOMATED | TC-NEG-008 |
| SCN-NEG-09 | Composer submitted with no image. | AUTOMATED | TC-NEG-009 |
| SCN-NEG-10 | Contact form submitted empty — all three errors named. | AUTOMATED | TC-UI-007 |
| SCN-NEG-11 | Contact name shorter than 2 characters. | AUTOMATED | TC-NEG-006 |
| SCN-NEG-12 | Contact email without a domain. | AUTOMATED | TC-NEG-007 |
| SCN-NEG-13 | Protected page opened while signed out. | AUTOMATED | TC-UI-002 |
| SCN-NEG-14 | Guest-only screen opened while signed in. | AUTOMATED | TC-UI-005 |
| SCN-NEG-15 | An unauthenticated `PUT`/`DELETE`/`POST` to `/api/posts`. | AUTOMATED — **succeeds, which is the bug** | TC-SEC-003, TC-SEC-005, TC-SEC-007 |
| SCN-NEG-16 | A failed list fetch. | MANUAL — page at 0% coverage | — |
| SCN-NEG-17 | A failed composer submit — the writer gets no feedback. | MANUAL | — |

**15 of 17 automated.**

## A note on "negative" here

Several of these scenarios pass while proving a defect. `SCN-NEG-15` is the clearest: the
expected behaviour is a 401, the actual behaviour is a successful write, and the test
asserts the actual behaviour so that it cannot change unnoticed. Every such case is tagged
with the bug it documents.
