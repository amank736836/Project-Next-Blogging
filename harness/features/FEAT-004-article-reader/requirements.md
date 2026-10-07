# FEAT-004 · Requirements

| ID | Requirement | Status | Test |
| --- | --- | --- | --- |
| REQ-007 | `GET /api/posts/{slug}` returns one post or `404 { error: "Post not found" }`. | IMPLEMENTED | TC-API-006, TC-API-007 |
| REQ-011 | Reading time at ~220 wpm, minimum one minute. | IMPLEMENTED | TC-UI-014, TC-EDGE-007 |
| REQ-012 | Edit controls only for the author. | IMPLEMENTED in the UI only | TC-UI-016, TC-SEC-009, TC-SEC-010 |
| REQ-019 | Unknown routes render a branded 404. | PARTIAL | SMK-12 (live); no automated case for the boundary |
| REQ-024 | Reading a non-public resource must check the caller. | **NOT IMPLEMENTED** | TC-SEC-004 |
| REQ-027 | The article must display the **author's** identity. | **NOT IMPLEMENTED** | [BUG-003](../../bugs/open/BUG-003-article-shows-viewer-as-author.md) |
| REQ-NF-04 | Author HTML must be sanitised before rendering. | **VIOLATED** | TC-EDGE-003, [BUG-022](../../bugs/open/BUG-022-stored-xss-post-content.md) |
| REQ-NF-06 | Motion disabled under reduced motion. | IMPLEMENTED | `usePrefersReducedMotion()` gates `BackToTop` |
