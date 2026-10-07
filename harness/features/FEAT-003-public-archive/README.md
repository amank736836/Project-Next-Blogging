# FEAT-003 · Public archive & home dashboard

```text
Feature:        The home route — landing page for guests, archive for members.
Purpose:        Give guests a reason to sign up; give writers a browsable grid.
User:           Guest and Writer.
Entry Point:    /  (src/app/page.js)
Dependencies:   Clerk useAuth; postService.getPosts; Landing components; PostCard;
                EmptyShelf; GridSkeleton.
Inputs:         None from the URL. Local state: `query` (search text), `filter`
                ('all' | 'active' | 'inactive').
Outputs:        <Landing/> when signed out; a filterable grid of PostCards when signed in.
Business Rules: BR-05 (only `active` posts are public), BR-12 (reading time on cards),
                BR-13 (edit affordance for the owner).
Expected Behavior:
                - While Clerk is unresolved, or for any guest, the landing page renders.
                - Once signed in, fetch getPosts() — which is status=active with NO userId,
                  i.e. every published post in the database.
                - Client-side search over `${title} ${slug}`, case-insensitive.
                - Three filter chips with live counts; results sorted newest-first.
                - Skeleton grid while loading; EmptyShelf when there is nothing to show,
                  with copy that differs for "no posts at all" vs "no matches".
Error Handling: A failed fetch sets posts to [] and stops loading — the reader sees an
                empty shelf, never an error.
Permissions:    Public content only, by virtue of the status filter. The gate is in the
                API's default, not in an authorisation check.
Related APIs:   GET /api/posts
Related Database Tables: posts
Related UI:     app/page.js, components/Landing.jsx, components/landing/*,
                components/PostCard.jsx, components/ui/EmptyShelf.jsx
Existing Tests: TC-API-001…004 (the query semantics), TC-UI-013…016 (PostCard),
                TC-UI-023…028 (header), SMK-01.
Missing Tests:  app/page.js is at 0% coverage. No test for the search box, the filter
                chips, the counts, the sort order, or the two EmptyShelf variants.
                All of it needs Clerk + postService mocked together.
Known Issues:   BUG-002.
Status:         IMPLEMENTED — UNTESTED at the page level, with one functional defect.
```

## The dead Drafts filter (BUG-002)

`app/page.js:29` fetches `postService.getPosts()`, whose signature is
`getPosts(status = "active", userId = null)`. So the request is
`GET /api/posts?status=active` — **drafts are never in the array**.

`app/page.js:44` then computes:

```js
inactive: posts.filter((p) => p.status === "inactive").length,   // always 0
```

The third chip therefore always reads `Drafts 0` and selecting it always shows the
"No frames match that" empty state. Either the fetch must include both statuses or the
chip must go.
