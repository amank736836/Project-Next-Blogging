# FEAT-002 · Requirements

| ID | Requirement | Status | Test |
| --- | --- | --- | --- |
| REQ-003 | A post is `title`, `slug`, `content`, `featuredImage`, `status`, `userId`. | IMPLEMENTED | TC-DB-001 |
| REQ-004 | Create rejects a document missing any required field. | IMPLEMENTED | TC-DB-008, TC-NEG-001 |
| REQ-008 | `PUT /api/posts/{slug}` updates and returns the new document, or 404. | IMPLEMENTED | TC-API-008, TC-API-009 |
| REQ-009 | `DELETE /api/posts/{slug}` deletes and confirms, or 404 on a repeat. | IMPLEMENTED | TC-API-010, TC-API-011 |
| REQ-015 | The slug is derived from the title until edited, then frozen. | PARTIAL | TC-UI-030, TC-UI-033, TC-NEG-010 |
| REQ-016 | Status is `active` or `inactive`, default `active`. | IMPLEMENTED | TC-DB-003, TC-DB-009 |
| REQ-020 | `slug` is unique; `status` is enum-constrained. | IMPLEMENTED on create, **VIOLATED** on update | TC-DB-004, TC-NEG-002, TC-SEC-006 |
| REQ-025 | API input must be validated against an allow-list. | **NOT IMPLEMENTED** | TC-SEC-003, TC-SEC-006 |
| BR-11 | Delete needs two deliberate clicks with a 4.5 s window. | IMPLEMENTED | TC-UI-036, TC-UI-037 |
| BR-09 | An image is required on create, optional on edit. | IMPLEMENTED | TC-NEG-009, TC-UI-035 |
