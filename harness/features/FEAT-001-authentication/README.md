# FEAT-001 · Authentication & session

```text
Feature:        Authentication and session management (Clerk)
Purpose:        Give a visitor an identity so they can own posts, and keep
                writer-only screens away from everyone else.
User:           Guest (becoming a writer) and Writer.
Entry Point:    /signup and /login (pages); every protected page via
                <AuthLayout authentication>; global state via useAuth()/useUser().
Dependencies:   @clerk/nextjs ^6.37.4; CLERK_SECRET_KEY + NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
                src/proxy.js (clerkMiddleware); src/app/layout.js (ClerkProvider).
Inputs:         Credentials entered into Clerk's own hosted widget. The application
                never sees or handles a password.
Outputs:        A Clerk session; `useAuth().isSignedIn`, `useUser().user.id`.
                `user.id` is persisted as `Post.userId`.
Business Rules: BR-13 (edit affordances appear only for the owner).
Expected Behavior:
                - Signed-out visitor on a protected route sees the branded "opening your
                  shelf" loader and is pushed to /login.
                - Signed-in visitor sees the content immediately, with no extra render.
                - While Clerk is resolving (isLoaded === false) the loader is shown —
                  protected content is NEVER mounted, not even for one frame.
                - The header swaps Log in / Start writing for Stories / Write / UserButton.
                - Signing out returns to / (UserButton afterSignOutUrl).
Error Handling: No error UI of its own. A Clerk configuration failure is fatal at the
                proxy layer: without CLERK_SECRET_KEY every route returns HTTP 500
                (BUG-015). With a publishable key but no secret key the build fails on
                /_not-found.
Permissions:    Client-side only. There is no server-side authorisation anywhere.
Related APIs:   None. No API route reads or verifies the session.
Related Database Tables:
                posts.userId (String, Clerk user id, no foreign key).
Related UI:     components/AuthShell.jsx (split-screen chrome, rotating quotes),
                components/Login.jsx, components/Signup.jsx,
                components/AuthLayout.jsx (the gate),
                components/header/Header.jsx (auth-aware nav),
                app/{login,signup}/page.js.
Existing Tests: TC-UI-001, TC-UI-002, TC-UI-003, TC-UI-004, TC-UI-005, TC-UI-006
                (harness/automation/ui/auth-gate.test.jsx);
                TC-UI-023…TC-UI-028 (header nav);
                TC-SEC-009, TC-SEC-010 (ownership affordance);
                SMK-08, SMK-09, SMK-15, SMK-16, SMK-18 (live).
Missing Tests:  Real sign-up, sign-in, sign-out, MFA, session expiry, OAuth, magic link —
                all require a live Clerk tenant (SCN-SEC-01, manual).
                Server-side session verification — cannot be written until it exists.
Known Issues:   BUG-004 (Critical), BUG-015, BUG-005, BUG-006, BUG-020.
Status:         PARTIAL — the client gate is solid and tested; server-side auth is absent.
```

## Why this feature matters more than any other

`AuthLayout` is the **only** authorisation check in the entire application. It runs in the
browser. Everything it protects is also reachable by `curl`:

```bash
curl -X DELETE http://localhost:3000/api/posts/any-slug        # succeeds
curl -X PUT    http://localhost:3000/api/posts/any-slug \
     -H 'content-type: application/json' -d '{"title":"mine"}'  # succeeds
```

`src/proxy.js` looks like protection and is not:

```js
export default clerkMiddleware();   // no createRouteMatcher, no isPublic, no protect()
export const config = { matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"] };
```

`clerkMiddleware()` with no arguments only *loads* auth state onto the request; it never
rejects. The matcher covers `/api/**`, so the middleware runs on the API — and then lets
everything through.

Verified live: `SMK-15`, `SMK-16` reached the data layer unauthenticated (they returned
500 only because MongoDB was not running, not because of auth), and `SMK-18` confirmed no
`WWW-Authenticate` header is ever sent.
