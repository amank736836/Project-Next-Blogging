# FEAT-005 · Acceptance criteria

### AC-030 — A writer can attach a frame
**Given** I am composing **When** I choose or drop an image **Then** I see a preview immediately and nothing is uploaded yet
**When** I submit **Then** the image is uploaded to Cloudinary and its URL is stored
→ TC-API-012, TC-API-013, TC-UI-032

### AC-031 — Every asset is filed under one folder
**Given** any upload **Then** it lands in `blog_posts`
→ TC-API-013

### AC-032 — A create needs a frame
**Given** a title and a body but no image **When** I submit **Then** I am told "A frame makes it a post" and nothing is uploaded
→ TC-NEG-009

### AC-033 — An edit may keep its frame
**Given** I edit a post and do not choose a new image **When** I save **Then** the existing `featuredImage` is retained and no upload happens
→ TC-UI-035

### AC-034 — Oversized images are refused
**Given** a 9 MB image **When** I submit **Then** I am told to keep it under 8 MB and no upload happens
→ TC-EDGE-009

### AC-035 — A missing part is a client error
**Given** a request with no `file` part **Then** `400 { error: "No file provided" }` and Cloudinary is never called
→ TC-API-014, SMK-17

### AC-036 — *(currently failing)* Only images are accepted
**Given** a request carrying `payload.sh` with type `application/x-sh`
**Then** it must be rejected
**Actual** — `200 { fileId: "blog_posts/not_an_image" }`.
→ TC-SEC-008 · [BUG-008](../../bugs/open/BUG-008-upload-no-server-validation.md)

### AC-037 — *(currently failing)* Only a signed-in writer may upload
**Given** an anonymous request **Then** `401`
**Actual** — no `401` exists. `SMK-17` sent an anonymous empty-multipart `POST /api/upload`
and got `400 {"error":"No file provided"}`: the handler ran, and the only thing that stopped
it was the absent file part. `TC-SEC-008` shows the same anonymous request *with* a file is
streamed straight to the provider.
→ SMK-17, TC-SEC-008 · [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md),
[BUG-008](../../bugs/open/BUG-008-upload-no-server-validation.md)
