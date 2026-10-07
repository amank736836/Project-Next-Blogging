# FEAT-002 · Test scenarios

| SCN ID | Type | Scenario | Automated? | Test case |
| --- | --- | --- | --- | --- |
| SCN-API-01 | API | `GET /api/posts` with no query returns only `active` posts. | Yes | TC-API-001 |
| SCN-API-02 | API | `?status=inactive` returns the draft. | Yes | TC-API-002 |
| SCN-API-03 | API | `?userId=` scopes the result set. | Yes | TC-API-003 |
| SCN-API-04 | Edge | A user with no posts yields `[]`, not an error. | Yes | TC-API-004 |
| SCN-API-05 | API | `POST /api/posts` creates and returns `201`. | Yes | TC-API-005 |
| SCN-API-06 | API | `GET /api/posts/{slug}` returns the document. | Yes | TC-API-006 |
| SCN-API-07 | Negative | Unknown slug → `404 { error: "Post not found" }`. | Yes | TC-API-007 |
| SCN-API-08 | API | `PUT` updates and returns the new document. | Yes | TC-API-008 |
| SCN-API-09 | Negative | `PUT` on an unknown slug → 404 and no change. | Yes | TC-API-009 |
| SCN-API-10 | API | `DELETE` removes and confirms. | Yes | TC-API-010 |
| SCN-API-11 | Edge | Deleting twice → the second call 404s. | Yes | TC-API-011 |
| SCN-NEG-01 | Negative | Missing `title` is rejected and nothing is stored. | Yes | TC-NEG-001 |
| SCN-NEG-02 | Edge | Duplicate slug is rejected rather than overwriting. | Yes | TC-NEG-002 |
| SCN-NEG-03 | Negative | Malformed JSON body → 500 (should be 400). | Yes | TC-NEG-003 |
| SCN-NEG-04 | Negative | Malformed JSON on `PUT` → 500. | Yes | TC-NEG-004 |
| SCN-DB-01 | Database | The schema declares exactly the expected paths plus timestamps. | Yes | TC-DB-001 |
| SCN-DB-02 | Database | Five fields are required. | Yes | TC-DB-002 |
| SCN-DB-03 | Database | `status` is an enum with a default. | Yes | TC-DB-003 |
| SCN-DB-04 | Database | `slug` carries a unique index. | Yes | TC-DB-004 |
| SCN-DB-05 | Database | **Manual** — the unique index rejects a real concurrent duplicate insert (E11000), and the API turns it into 409. | No | [../../test-scenarios/database.md](../../test-scenarios/database.md) |
| SCN-DB-06 | Database | `userId` is a String, not an ObjectId reference. | Yes | TC-DB-006 |
| SCN-EDGE-01 | Edge | Empty strings are rejected for required fields. | Yes | TC-EDGE-001 |
| SCN-EDGE-02 | Edge | A whitespace-only title is accepted (no trim rule). | Yes | TC-EDGE-005 |
| SCN-EDGE-03 | Edge | A 2000-char title and a 1 MB body are accepted (no length limits). | Yes | TC-EDGE-002 |
| SCN-EDGE-04 | Edge | Markup is stored verbatim — no sanitisation. | Yes | TC-EDGE-003 |
| SCN-EDGE-05 | Edge | Slugs are not normalised, so uniqueness is byte-exact. | Yes | TC-EDGE-004 |
| SCN-UI-01 | UI | The composer renders in publish mode. | Yes | TC-UI-029 |
| SCN-UI-02 | UI | The slug is derived from the title. | Yes | TC-UI-030 |
| SCN-UI-03 | UI | Word count and reading estimate update live. | Yes | TC-UI-031 |
| SCN-UI-04 | UI | A valid submit uploads, creates and navigates. | Yes | TC-UI-032 |
| SCN-UI-05 | UI | Manual slug mode, then **auto** restores derivation. | Yes | TC-UI-033 |
| SCN-UI-06 | UI | Edit mode pre-fills, drops the image requirement, offers delete. | Yes | TC-UI-034 |
| SCN-UI-07 | UI | Save without re-uploading keeps the existing image and slug. | Yes | TC-UI-035 |
| SCN-UI-08 | UI | Arm-then-confirm delete. | Yes | TC-UI-036 |
| SCN-UI-09 | Edge | The armed delete disarms after 4.5 s. | Yes | TC-UI-037 |
| SCN-INT-02 | Integration | **Manual** — create through the UI, verify the MongoDB document and the Cloudinary asset both exist. | No | [../../test-scenarios/integration.md](../../test-scenarios/integration.md) |
| SCN-INT-03 | Integration | **Manual** — fail the create after a successful upload and confirm whether the image is orphaned. | No | [../../test-scenarios/integration.md](../../test-scenarios/integration.md) |
| SCN-REG-01 | Regression | Changing `slugTransform` must not break auto-derivation. | Yes | TC-UI-030 |
| SCN-REG-02 | Regression | Changing the schema must not silently relax `required`. | Yes | TC-DB-002, TC-DB-008 |
