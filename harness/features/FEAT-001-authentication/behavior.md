# FEAT-001 · Behavior

Precise, code-referenced description of what the authentication feature does today.

## 1. Middleware (`src/proxy.js`)

* Runs on every request matching `["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]` —
  i.e. every page and every API route, excluding static assets and `_next/*`.
* Calls `clerkMiddleware()` with **no options**. Effect: Clerk state is attached to the
  request; nothing is blocked.
* Requires `CLERK_SECRET_KEY` at runtime. Without it, the middleware throws and Next
  returns a bare `500 Internal Server Error` for **every** route, static pages included.
  Evidence: [../../evidence/logs/RUN-2026-10-07-001-missing-clerk-secret-key.log](../../evidence/logs/RUN-2026-10-07-001-missing-clerk-secret-key.log).

## 2. Provider (`src/app/layout.js`)

`<ClerkProvider>` wraps `<html>`. Requires `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`; without it
the build fails while prerendering `/_not-found`.

## 3. The gate (`src/components/AuthLayout.jsx`)

```js
const blocked = !isLoaded || (authentication ? !isSignedIn : Boolean(isSignedIn));

useEffect(() => {
  if (!isLoaded) return;
  if (authentication && !isSignedIn) router.push("/login");
  else if (!authentication && isSignedIn) router.push("/");
}, [isSignedIn, isLoaded, router, authentication]);

if (blocked) return <branded loader />;
return <>{children}</>;
```

Three states, and the ordering matters:

| `isLoaded` | `isSignedIn` | `authentication` | Result |
| --- | --- | --- | --- |
| false | any | any | Branded loader. **No redirect yet.** Children never mount. |
| true | false | true | Loader + `router.push('/login')` |
| true | true | true | Children |
| true | true | false | Loader + `router.push('/')` |
| true | false | false | Children |

`TC-UI-004` exists specifically to pin the `!isLoaded` half of `blocked`: without it a
slow Clerk round-trip would mount protected content for a guest for one frame.

## 4. Where the gate is applied

| Route | Wrapped in `AuthLayout`? |
| --- | --- |
| `/add-post` | Yes — but only around the form; the `PageHeader` renders regardless |
| `/all-posts` | Yes — around everything |
| `/edit-post/[slug]` | Yes, but **only the loaded branch**. The loading and "nothing to edit" branches render for anyone. |
| `/post/[slug]` | No — public by design |
| `/` | No — the page itself branches on `isSignedIn` |

## 5. Auth-aware navigation (`src/components/header/Header.jsx`)

`nav` is filtered by `isSignedIn`, so `Stories` exists only for members. The desktop bar
and the mobile sheet are rendered from the same `nav` array, which is why several UI tests
use `getAllByRole` rather than `getByRole`.

## 6. Identity propagation

`useUser().user.id` is written into `Post.userId` at creation
(`PostForm.jsx:112`) and compared against it to decide whether to show Edit/Delete
(`PostCard.jsx:36-37`, `post/[slug]/page.js:33`). No name, avatar or email is stored on the
post — which is the root cause of [BUG-003](../../bugs/open/BUG-003-article-shows-viewer-as-author.md).
