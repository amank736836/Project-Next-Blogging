# Functional Requirements

Source of each requirement is cited. Status is verified against `src/` at commit `9d413cd`.

| ID | Requirement | Source | Feature | Status |
| --- | --- | --- | --- | --- |
| REQ-001 | A visitor can create an account and sign in using Clerk's hosted widgets. | `src/components/{Signup,Login}.jsx` | [FEAT-001](../features/FEAT-001-authentication/README.md) | IMPLEMENTED — UNTESTED (needs a live Clerk tenant) |
| REQ-002 | Writer-only routes must not render their content to a signed-out visitor, and must send them to `/login`. | `src/components/AuthLayout.jsx` | [FEAT-001](../features/FEAT-001-authentication/README.md) | IMPLEMENTED (TC-UI-001…006) |
| REQ-003 | A post is composed of `title`, `slug`, `content`, `featuredImage`, `status`, `userId`. | `src/models/Post.js` | [FEAT-002](../features/FEAT-002-post-crud/README.md) | IMPLEMENTED (TC-DB-001) |
| REQ-004 | Creating a post requires `title`, `slug`, `content`, `featuredImage` and `userId`; the API rejects anything missing one. | `src/models/Post.js`, `api/posts/route.js:POST` | [FEAT-002](../features/FEAT-002-post-crud/README.md) | IMPLEMENTED (TC-DB-002, TC-DB-008, TC-NEG-001) |
| REQ-005 | `GET /api/posts` returns published posts (`status=active`) when no status is given. | `api/posts/route.js:12` | [FEAT-003](../features/FEAT-003-public-archive/README.md) | IMPLEMENTED (TC-API-001) |
| REQ-006 | `GET /api/posts` can be filtered by `status` and scoped by `userId`. | `api/posts/route.js:12-19` | [FEAT-003](../features/FEAT-003-public-archive/README.md) | IMPLEMENTED (TC-API-002…004) |
| REQ-007 | `GET /api/posts/{slug}` returns one post, or `404 { error: "Post not found" }`. | `api/posts/[slug]/route.js:GET` | [FEAT-004](../features/FEAT-004-article-reader/README.md) | IMPLEMENTED (TC-API-006, TC-API-007) |
| REQ-008 | `PUT /api/posts/{slug}` updates the post and returns the new document, or 404. | `api/posts/[slug]/route.js:PUT` | [FEAT-002](../features/FEAT-002-post-crud/README.md) | IMPLEMENTED (TC-API-008, TC-API-009) |
| REQ-009 | `DELETE /api/posts/{slug}` removes the post and confirms, or 404s on a repeat. | `api/posts/[slug]/route.js:DELETE` | [FEAT-002](../features/FEAT-002-post-crud/README.md) | IMPLEMENTED (TC-API-010, TC-API-011) |
| REQ-010 | A featured image is uploaded to Cloudinary under the `blog_posts` folder; the returned `secure_url` is stored on the post. | `api/upload/route.js`, `PostForm.jsx:97-104` | [FEAT-005](../features/FEAT-005-image-upload/README.md) | IMPLEMENTED (TC-API-012, TC-API-013) |
| REQ-011 | Archive cards show a reading-time estimate (≈220 wpm, minimum 1 minute) and a formatted date. | `PostCard.jsx:10-24` | [FEAT-003](../features/FEAT-003-public-archive/README.md) | IMPLEMENTED (TC-UI-014, TC-EDGE-007, TC-EDGE-008) |
| REQ-012 | A post shows edit controls only to its author. | `PostCard.jsx:36-37`, `post/[slug]/page.js:33` | [FEAT-004](../features/FEAT-004-article-reader/README.md) | IMPLEMENTED in the UI (TC-UI-016, TC-SEC-009, TC-SEC-010); **NOT IMPLEMENTED** server-side → [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) |
| REQ-013 | The theme follows the OS until the visitor chooses, persists across visits, and never flashes on load. | `src/hooks/theme-context.js`, `src/app/layout.js` inline script | [FEAT-009](../features/FEAT-009-theme-system/README.md) | IMPLEMENTED (TC-UI-017…022) |
| REQ-014 | Navigation adapts to auth state and is operable on mobile (toggle, Escape, scroll lock, close on navigation). | `src/components/header/Header.jsx` | [FEAT-003](../features/FEAT-003-public-archive/README.md) | IMPLEMENTED (TC-UI-023…028) |
| REQ-015 | The slug is derived from the title until the writer takes it over, and does not change once published. | `PostForm.jsx:123-138` | [FEAT-002](../features/FEAT-002-post-crud/README.md) | PARTIAL — derivation works (TC-UI-030), manual editing is broken ([BUG-011](../bugs/open/BUG-011-manual-slug-strips-hyphens.md), TC-NEG-010) |
| REQ-016 | A post is either `active` (public archive) or `inactive` (private draft); the default is `active`. | `src/models/Post.js`, `PostForm.jsx` status select | [FEAT-002](../features/FEAT-002-post-crud/README.md) | IMPLEMENTED (TC-DB-003, TC-DB-009) |
| REQ-017 | The contact form validates name (≥ 2 chars), email (regex) and message (≥ 12 chars) and reports each failure. | `src/app/contact/page.js:26-31` | [FEAT-008](../features/FEAT-008-contact-form/README.md) | IMPLEMENTED (TC-UI-007…009, TC-NEG-006, TC-NEG-007, TC-EDGE-006) |
| REQ-018 | Marketing and legal pages are readable without an account. | `src/app/{features,pricing,contact,privacy,terms}/page.js` | [FEAT-007](../features/FEAT-007-marketing-pages/README.md) | IMPLEMENTED (SMK-03…07) |
| REQ-019 | An unknown route renders a branded 404; an unhandled render error renders a branded boundary with a retry action. | `src/app/not-found.js`, `src/app/error.js` | [FEAT-011](../features/FEAT-011-error-handling/README.md) | PARTIAL — 404 verified live (SMK-12); the error boundary has no automated coverage |
| REQ-020 | `slug` is unique across all posts; `status` is constrained to the two-value enum. | `src/models/Post.js` | [FEAT-002](../features/FEAT-002-post-crud/README.md) | IMPLEMENTED (TC-DB-004, TC-DB-003); **VIOLATED** on update — `findOneAndUpdate` runs without `runValidators` → [BUG-007](../bugs/open/BUG-007-mass-assignment-put.md) |
| REQ-021 | `/` is the marketing landing page for guests and the archive dashboard for members. | `src/app/page.js:57` | [FEAT-003](../features/FEAT-003-public-archive/README.md) | IMPLEMENTED — UNTESTED (needs Clerk + DB) |
| REQ-022 | `/demo` renders the design system from local fixtures with no database, and is excluded from search indexing. | `src/app/demo/page.js`, `src/components/demo/fixtures.js` | [FEAT-012](../features/FEAT-012-design-preview/README.md) | IMPLEMENTED (SMK-02; `robots: { index: false }` verified in source) |

## Requirements the product implies but does not implement

These are not in the codebase; they are recorded because the product cannot be considered
finished without them and the harness must not pretend they exist.

| ID | Requirement | Status | Bug |
| --- | --- | --- | --- |
| REQ-023 | Every mutating API endpoint must authenticate the caller. | **NOT IMPLEMENTED** | [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) |
| REQ-024 | Every read of a non-public resource must check that the caller may read it. | **NOT IMPLEMENTED** | [BUG-005](../bugs/open/BUG-005-idor-draft-exposure.md), [BUG-006](../bugs/open/BUG-006-draft-readable-by-slug.md) |
| REQ-025 | API input must be validated against an allow-list before it reaches the database. | **NOT IMPLEMENTED** | [BUG-007](../bugs/open/BUG-007-mass-assignment-put.md) |
| REQ-026 | Author-supplied HTML must be sanitised before it is rendered to another visitor. | **NOT IMPLEMENTED** | [BUG-022](../bugs/open/BUG-022-stored-xss-post-content.md) |
| REQ-027 | The article page must display the *author's* identity. | **NOT IMPLEMENTED** | [BUG-003](../bugs/open/BUG-003-article-shows-viewer-as-author.md) |
| REQ-028 | A writer must be able to see their own drafts on their shelf. | **VIOLATED** | [BUG-001](../bugs/open/BUG-001-all-posts-drafts-never-shown.md), [BUG-002](../bugs/open/BUG-002-home-drafts-filter-dead.md) |
| REQ-029 | Uploading must be limited to images and to a maximum size, enforced server-side. | **NOT IMPLEMENTED** (client-side only) | [BUG-008](../bugs/open/BUG-008-upload-no-server-validation.md) |
