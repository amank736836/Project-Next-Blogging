# FEAT-001 · Known issues

| Bug | Severity | Summary |
| --- | --- | --- |
| [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md) | **Critical** | Every `/api/posts` mutation is unauthenticated. The gate this feature provides is client-side only. |
| [BUG-005](../../bugs/open/BUG-005-idor-draft-exposure.md) | **Critical** | Any user's drafts are readable by anyone. |
| [BUG-006](../../bugs/open/BUG-006-draft-readable-by-slug.md) | High | `GET /api/posts/[slug]` ignores `status`, so drafts are public by URL. |
| [BUG-015](../../bugs/open/BUG-015-missing-clerk-secret-key-500s-site.md) | Medium | A missing `CLERK_SECRET_KEY` returns HTTP 500 for every route, including static marketing pages. |
| [BUG-020](../../bugs/open/BUG-020-stale-firebase-comment.md) | Low | `Post.userId` is documented as a "Firebase UID" in the schema comment; auth is Clerk and `firebase`/`firebase-admin` are unused dependencies. |

## Structural gap (not filed as a bug, because it is a design decision to make)

`/edit-post/[slug]` wraps only its loaded branch in `AuthLayout`. The loading skeleton and
the "Nothing to edit at that address" state render for an anonymous visitor before the
redirect fires. No post content is exposed — `PostForm` is inside the gate — but the route
is not consistently protected. Worth aligning with `/all-posts`, which wraps everything.
