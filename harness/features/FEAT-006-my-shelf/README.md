# FEAT-006 · Writer's shelf

```text
Feature:        /all-posts — the signed-in writer's own collection.
Purpose:        Show a writer their published pieces and their parked drafts together.
User:           Writer.
Entry Point:    /all-posts (src/app/all-posts/page.js), wrapped in <AuthLayout authentication>.
Dependencies:   Clerk useUser; postService.getPosts; AuthLayout; PostCard; EmptyShelf.
Inputs:         Local state `tab` ('all' | 'active' | 'inactive').
Outputs:        Three summary stats (total / published / drafts) and a filtered grid.
Business Rules: BR-13 (edit affordance), BR-05 (status semantics).
Expected Behavior:
                - Fetch the writer's own posts and show them, newest first.
                - Tabs: All, Published, Drafts — each with a live count.
                - Empty states differ for "no posts", "no drafts" and "nothing published".
Error Handling: A failed fetch sets posts to [] and stops loading.
Permissions:    Client gate only. The fetch is scoped by userId, but the API does not
                verify that the caller IS that user (BUG-005).
Related APIs:   GET /api/posts?status=active&userId=<me>
Related Database Tables: posts
Related UI:     app/all-posts/page.js, components/ui/PageHeader.jsx, PostCard, EmptyShelf
Existing Tests: TC-API-003 (userId scoping), TC-SEC-002 (the same endpoint leaks drafts),
                TC-UI-001…006 (the gate that wraps the page), SMK-10.
Missing Tests:  app/all-posts/page.js is at 0% coverage. No test for the tabs, the stats,
                or the three empty states.
Known Issues:   BUG-001 (Major).
Status:         BROKEN — the headline promise of the page does not work.
```

## The empty Drafts tab (BUG-001)

The page's own copy says: *"Private drafts and published pieces side by side."* It does
not do that. `app/all-posts/page.js:37`:

```js
postService.getPosts('active', user.id)     // → GET /api/posts?status=active&userId=…
```

Only `active` documents are ever fetched. Then `:52`:

```js
const active = posts.filter((p) => p.status !== 'inactive').length;
return { all: posts.length, active, inactive: posts.length - active };   // always 0
```

and the tab filter `tab === 'inactive' ? p.status === 'inactive' : …` can never match.
So `Drafts` always reads `0` and always shows "No drafts parked here" — even for a writer
with a hundred drafts.

The fix is one argument: `postService.getPosts('all', user.id)` would need an API change
(the handler has no "any status" branch), or two fetches, or dropping the `status` param
and filtering client-side.
