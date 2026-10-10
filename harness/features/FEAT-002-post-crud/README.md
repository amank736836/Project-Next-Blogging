# FEAT-002 · Post authoring & editing (CRUD)

```text
Feature:        Create, read, update and delete a post — the only business entity.
Purpose:        Let a writer pair one image with one piece of prose and control
                whether the world can see it.
User:           Writer (create/update/delete). Anyone (read).
Entry Point:    /add-post (create), /edit-post/[slug] (update),
                /post/[slug] (read + delete), API /api/posts and /api/posts/[slug].
Dependencies:   Mongoose + MongoDB; Cloudinary (for the image); Clerk (for userId);
                react-hook-form; TinyMCE; src/services/config.js (PostService).
Inputs:         title (String), slug (String, derived or hand-set), content (raw HTML),
                featuredImage (File → Cloudinary URL), status ('active' | 'inactive'),
                userId (taken from useUser().user.id, never from the form).
Outputs:        A posts document; a redirect to /post/<slug>; or
                { message: "Post deleted successfully" }.
Business Rules: BR-01, BR-02, BR-03, BR-04, BR-06, BR-07, BR-08, BR-09, BR-10, BR-11.
                Missing: BR-16, BR-17, BR-18.
Expected Behavior:
                CREATE — image uploads first; only on success is the post created;
                         the writer is sent to /post/<new slug>.
                READ   — by slug; 404 with { error: "Post not found" } otherwise.
                UPDATE — the slug never changes; a new image is optional (the existing
                         one is kept); redirect to /post/<slug>.
                DELETE — two clicks within 4.5 s, then redirect to /.
Error Handling: Client — react-hook-form messages for title, slug pattern, image presence
                and image size. Submit failures are console.error'd and `loading` is
                reset, with NO user-visible message.
                Server — every exception becomes 500 { error: <raw message> }, including
                validation failures that should be 400 and duplicate keys that should
                be 409.
Permissions:    None enforced server-side. Any caller can create, read, update or delete
                any post, and can set `userId` to anyone.
Related APIs:   POST /api/posts · GET /api/posts · GET|PUT|DELETE /api/posts/[slug]
                POST /api/upload
Related Database Tables:
                posts (the only collection). See requirements/…/BR-01…BR-04.
Related UI:     components/PostForm/PostForm.jsx (composer), components/RTE.jsx,
                components/{Input,Select,Button}.jsx,
                app/add-post/page.js, app/edit-post/[slug]/page.js,
                app/post/[slug]/page.js (delete control).
Existing Tests: 26 API cases (TC-API-001…014, TC-NEG-001…005, TC-SEC-002…008),
                18 schema cases (TC-DB-001…009, TC-EDGE-001…005),
                13 composer cases (TC-UI-029…037, TC-NEG-008…010, TC-EDGE-009).
                57 automated cases in total for this feature.
Missing Tests:  The /edit-post/[slug] page component (0% coverage).
                Concurrent-edit / lost-update behaviour.
                Orphaned-image cleanup when create fails after upload.
                Duplicate-slug behaviour against a REAL unique index (the fake raises a
                ValidationError, not E11000) — see test-scenarios/database.md SCN-DB-05.
Known Issues:   BUG-004, BUG-005, BUG-006, BUG-007, BUG-011, BUG-013, BUG-022.
Status:         PARTIAL — happy paths and the schema contract are solid and tested;
                authorisation, input validation and error semantics are broken.
```

## API contract (as implemented, not as designed)

### `GET /api/posts`

| Query | Effect |
| --- | --- |
| *(none)* | `status` defaults to `"active"` — published posts only |
| `?status=inactive` | **Every user's drafts.** No auth. ([BUG-005](../../bugs/open/BUG-005-idor-draft-exposure.md)) |
| `?userId=<id>` | Scopes to that user, any status. |
| `?status=…&userId=…` | Both. |

`200` → JSON array. `500 { error }` on any failure. No pagination, no limit, no projection,
no sorting.

### `POST /api/posts`

Body is passed straight to `Post.create(body)`. `201` with the document, or `500 { error }`
— including for validation failures and duplicate slugs.

### `GET /api/posts/{slug}`

`200` with the document (any status), or `404 { error: "Post not found" }`.

### `PUT /api/posts/{slug}`

Body passed straight to `Post.findOneAndUpdate({ slug }, body, { new: true })` — no
`runValidators`, no allow-list. `200` with the new document, or `404`.
Proven to accept `status: "not-a-valid-status"` and an invented `isAdmin` field
(TC-SEC-006).

### `DELETE /api/posts/{slug}`

`200 { message: "Post deleted successfully" }`, or `404 { error: "Post not found" }`.

### `POST /api/upload`

`multipart/form-data` with a `file` part. `200 { fileId, url }`, `400 { error: "No file
provided" }` when the part is missing, `500 { error }` on a Cloudinary failure — and also
`500` when the body is not multipart at all (SMK-20,
[BUG-016](../../bugs/open/BUG-016-upload-non-multipart-500.md)).
