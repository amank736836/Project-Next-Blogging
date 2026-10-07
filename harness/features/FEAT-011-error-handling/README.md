# FEAT-011 · Error & 404 handling

```text
Feature:        Branded failure states instead of a framework default.
Purpose:        A missing page and a crashed page should both look like the product.
User:           Everyone.
Entry Point:    app/not-found.js (any unmatched route), app/error.js (any render error in
                the segment below it).
Dependencies:   Container, Button, BrandMark, Reveal, SplitHeadline, DrawSvg.
Inputs:         error.js receives { error, reset } from Next.js.
Outputs:        A 404 page with a ghost "404", a brand mark, and links to / and /all-posts;
                an error page with a retry button, a link home, and the first 320
                characters of error.message in a <pre>.
Business Rules: None.
Expected Behavior:
                - /this-does-not-exist → 404 page, HTTP 404.
                - A thrown error during render → the boundary, with "Try again" calling
                  reset() and the message logged to the console.
Error Handling: This IS the error handling. Note that the boundary prints
                error.message to the visitor — acceptable for a client boundary, but it
                should never be relied on to hide a server-side detail.
Permissions:    Public.
Related APIs:   None. The API routes have their own (bad) handling — see BUG-013.
Related Database Tables: None.
Related UI:     app/not-found.js, app/error.js, components/BrandMark.jsx,
                components/motion/Effects.jsx (DrawSvg).
Existing Tests: SMK-12 — GET an unknown route returns HTTP 404 (verified live).
Missing Tests:  Neither component has a test. Line coverage: app/not-found.js 0%,
                app/error.js 0%.
                Nothing verifies that the boundary actually catches, that reset() re-renders,
                or that the message is truncated to 320 characters.
Known Issues:   None filed for these two components.
Status:         IMPLEMENTED — UNTESTED beyond the live 404 status code.
```

## What was verified, and how

```text
$ curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/harness-route-that-does-not-exist
404
```

Recorded as `SMK-12` in
[../../test-results/latest/smoke-result.json](../../test-results/latest/smoke-result.json).
That proves the *routing*, not the *rendering*.

## The error surface elsewhere in the app

| Layer | Behaviour | Tested? |
| --- | --- | --- |
| `app/error.js` | Branded boundary + `reset()` | No |
| `app/not-found.js` | Branded 404 | Status only (SMK-12) |
| API routes | `500 { error: <raw message> }` | Yes — TC-NEG-001…005, SMK-13, SMK-20 |
| `services/config.js` | Logs and rethrows | No |
| List pages | `.catch(() => setPosts([]))` | No |
| `post/[slug]` | `.catch(() => router.push('/'))` | No |
| `PostForm.submit` | Logs, resets `loading`, **no user feedback** | No |
| `post/[slug].deletePost` | `finally`, no `catch` | No → [BUG-021](../../bugs/open/BUG-021-unhandled-rejection-on-delete.md) |
