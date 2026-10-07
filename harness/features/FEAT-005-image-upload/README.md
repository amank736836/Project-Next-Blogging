# FEAT-005 · Image upload

```text
Feature:        Upload the featured frame to Cloudinary and store its URL.
Purpose:        Every post is anchored to exactly one photograph.
User:           Writer.
Entry Point:    The drop zone in PostForm ("Drop a photo, or browse"), POST /api/upload.
Dependencies:   cloudinary ^2.9.0; CLOUDINARY_CLOUD_NAME / _API_KEY / _API_SECRET;
                next/image + the res.cloudinary.com allow-list in next.config.mjs.
Inputs:         A single File, sent as multipart/form-data part named `file`.
                Client accepts image/png, image/jpeg, image/jpg, image/gif and rejects
                anything over 8 MB.
Outputs:        200 { fileId: <public_id>, url: <secure_url> }.
                The `url` is written to Post.featuredImage.
Business Rules: BR-09 (required on create, optional on edit), BR-10 (8 MB, client-side only).
Expected Behavior:
                - Drag over highlights the zone; drop or browse both populate the preview.
                - A FileReader data URL gives an instant local preview.
                - The file is kept in react-hook-form state so a dropped FileList (which
                  cannot be assigned to <input>) still reaches submit.
                - On submit the file is streamed to Cloudinary under folder `blog_posts`.
                - The clear button resets the preview, the form value and the input.
Error Handling: Missing `file` part → 400 { error: "No file provided" }.
                A Cloudinary error → 500 { error: <provider message> }.
                A non-multipart body → 500 (should be 400/415) — BUG-016.
                On the client, an upload failure is console.error'd; the button stops
                spinning and the writer sees nothing.
Permissions:    NONE. The endpoint is public and unauthenticated.
Related APIs:   POST /api/upload
Related Database Tables: posts.featuredImage
Related UI:     components/PostForm/PostForm.jsx (drop zone, preview, clear),
                next/image consumers in PostCard and post/[slug].
Existing Tests: TC-API-012, TC-API-013, TC-API-014, TC-NEG-005, TC-SEC-008,
                TC-EDGE-009 (client size rule), SMK-17, SMK-20.
Missing Tests:  Real Cloudinary round-trip (needs an account).
                Server-side MIME sniffing — cannot be tested until it exists.
                Orphaned assets after a failed create.
                The drop-and-replace path in a real browser (jsdom cannot simulate
                DataTransfer file drops reliably).
Known Issues:   BUG-008, BUG-016.
Status:         IMPLEMENTED — PARTIAL. The happy path is fully automated; server-side
                validation is absent.
```

## Server-side validation gap (BUG-008)

The 8 MB limit and the `accept="image/png, image/jpeg, image/jpg, image/gif"` restriction
live in the browser only. `src/app/api/upload/route.js` never inspects
`file.type`, `file.size` or the magic bytes — it forwards whatever arrives:

```js
const file = formData.get("file");
if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
const buffer = Buffer.from(await file.arrayBuffer());
cloudinary.uploader.upload_stream({ folder: "blog_posts" }, cb).end(buffer);
```

`TC-SEC-008` uploads a shell script named `payload.sh` with type
`application/x-sh` and gets `200 { fileId: "blog_posts/not_an_image" }`.
