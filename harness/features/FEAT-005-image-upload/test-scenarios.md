# FEAT-005 · Test scenarios

| SCN ID | Type | Scenario | Automated? | Test case |
| --- | --- | --- | --- | --- |
| SCN-UP-01 | API | A valid upload returns `{ fileId, url }`. | Yes | TC-API-012 |
| SCN-UP-02 | API | Every asset lands in the `blog_posts` folder. | Yes | TC-API-013 |
| SCN-UP-03 | Negative | No `file` part → `400 { error: "No file provided" }`, Cloudinary never called. | Yes | TC-API-014 |
| SCN-UP-04 | Negative | A Cloudinary failure surfaces as 500 with the provider message. | Yes | TC-NEG-005 |
| SCN-UP-05 | Security | **A non-image MIME type is accepted server-side.** | Yes | TC-SEC-008 |
| SCN-UP-06 | Edge | A 9 MB file is rejected client-side and never uploaded. | Yes | TC-EDGE-009 |
| SCN-UP-07 | Negative | A non-multipart body → 500 instead of 400/415. | Yes (live) | SMK-20 |
| SCN-UP-08 | UI | **Manual** — drag a file onto the zone, see the highlight, drop, see the preview. | No | — |
| SCN-UP-09 | UI | **Manual** — clear the preview, then submit: create is blocked, edit keeps the old image. | No | — |
| SCN-UP-10 | Integration | **Manual** — a real upload produces a working `secure_url` that `next/image` can serve. | No | [../../test-scenarios/integration.md](../../test-scenarios/integration.md) |
| SCN-SEC-11 | Security | **Manual** — upload a polyglot file (valid image header, embedded script) and confirm it is served inertly from the Cloudinary CDN. | No | [../../test-scenarios/security.md](../../test-scenarios/security.md) |
| SCN-PERF-06 | Performance | **Manual** — an 8 MB upload completes within the serverless timeout. | No | [../../test-scenarios/performance.md](../../test-scenarios/performance.md) |

## Coverage

7 of 12 scenarios automated.
