# FEAT-004 · Article reader

```text
Feature:        Public reading view for a single post.
Purpose:        Present one image and one piece of prose as a considered article.
User:           Anyone — the route is public. The author additionally gets controls.
Entry Point:    /post/[slug]. Reached from PostCard, the 404 page's "Browse stories",
                and the post-create/edit redirects.
Dependencies:   postService.getPost / deletePost; Clerk (useUser) for the ownership
                check; html-react-parser; next/image; ScrollProgress; GSAP helpers.
Inputs:         The `slug` route param.
Outputs:        A rendered article, or a redirect to `/` when the post cannot be loaded.
Business Rules: BR-11 (arm-then-confirm delete), BR-12 (reading time), BR-13 (owner-only controls).
Expected Behavior:
                - Fetch by slug on mount; show ArticleSkeleton while loading.
                - On failure or an empty response, router.push('/').
                - Render a sticky reading rail with scroll progress and a minutes estimate.
                - Render the hero image with a parallax wrapper and `priority` loading.
                - Render post.content as HTML.
                - If the viewer is the author, show Edit and a two-step Delete.
                - A "Copy link" button with a 2.2 s confirmation state.
                - A back-to-top button appears past 900 px, hidden under reduced motion.
Error Handling: Fetch errors are console.error'd and redirect home — the user gets no
                explanation. A failed delete has a `finally` but no `catch`, producing an
                unhandled rejection (BUG-021).
Permissions:    Public read of ANY post including drafts (BUG-006). Controls are shown
                only to the author, but the underlying API does not check (BUG-004).
Related APIs:   GET /api/posts/[slug], DELETE /api/posts/[slug]
Related Database Tables: posts
Related UI:     app/post/[slug]/page.js, components/loaders/{Loader,Skeleton}.jsx,
                components/ui/ScrollProgress.jsx, components/motion/Effects.jsx
Existing Tests: SMK-02 (routing), TC-SEC-004 (draft readable by slug), TC-UI-016,
                TC-SEC-009, TC-SEC-010 (ownership affordance in PostCard, the same logic).
Missing Tests:  The page component itself is at 0% coverage. Nothing renders it: it needs
                postService mocked plus Clerk, next/image, ScrollProgress and GSAP.
                No test for the copy-link flow, the back-to-top threshold, the reading
                rail, or the redirect-on-error path.
Known Issues:   BUG-003, BUG-006, BUG-021, BUG-022, BUG-004.
Status:         IMPLEMENTED — UNTESTED at the page level, with two content-integrity bugs.
```

## The author attribution defect (BUG-003)

`app/post/[slug]/page.js:167` and `:170`:

```jsx
{(user?.fullName || user?.username || 'F').trim().charAt(0).toUpperCase()}
…
{user?.fullName || user?.username || 'A writer at Frame & Phrase'}
```

`user` comes from `useUser()` — **the current visitor**, not the post's author. Reading
someone else's article shows *your* name and initial above it. An anonymous reader sees
"A writer at Frame & Phrase".

The cause is structural: `Post` stores only `userId`, no name or avatar
(see `src/models/Post.js`). Fixing this properly means either denormalising the author's
name onto the post at write time, or resolving it from Clerk's backend on read.
