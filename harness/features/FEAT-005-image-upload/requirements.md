# FEAT-005 · Requirements

| ID | Requirement | Status | Test |
| --- | --- | --- | --- |
| REQ-010 | Upload to Cloudinary under `blog_posts`; store the `secure_url`. | IMPLEMENTED | TC-API-012, TC-API-013 |
| REQ-029 | Uploads must be limited to images and a maximum size, **server-side**. | **NOT IMPLEMENTED** | TC-SEC-008 |
| BR-09 | Required on create, optional on edit. | IMPLEMENTED | TC-NEG-009, TC-UI-034, TC-UI-035 |
| BR-10 | 8 MB maximum. | IMPLEMENTED client-side only | TC-EDGE-009 |
| REQ-NF-03 | The endpoint must authenticate the caller. | **VIOLATED** | SMK-17 (anonymous request reaches the handler), TC-SEC-008 |
| REQ-NF-07 | Remote images must be allow-listed for `next/image`. | IMPLEMENTED | `next.config.mjs` `remotePatterns` |
