# Archive UI — negative cases

Features: FEAT-003, FEAT-001

There is no failing path in `PostCard` or `Header` to exercise — both are pure presentational components with no data fetching and no error branch. The negative cases that matter live one level up, in the pages that feed them, and those pages are at 0% coverage.

| SCN ID | Case | Status | Why |
| --- | --- | --- | --- |
| SCN-INT-03 | A failed list fetch renders the archive's empty/error state | NOT_EXECUTED | `app/all-posts/page.js` and `app/page.js` are both at 0% statement coverage. Each needs `@clerk/nextjs` **and** `@/services/config` mocked at once. |
| SCN-NEG-13 | A post with a missing `featuredImage` renders without a broken image | NOT_EXECUTED | The field is `required` in the schema, so it should not happen — but nothing stops a `PUT` from clearing it (TC-SEC-006). |
| SCN-NEG-14 | A post whose `userId` matches no real user still renders | NOT_EXECUTED | `useUser()` returns the viewer, not the author, so the byline is wrong anyway — [BUG-003](../../bugs/open/BUG-003-article-shows-viewer-as-author.md). |
| SCN-UI-40 | `app/all-posts/page.js` renders its three empty states | NOT_EXECUTED | Also the regression test for [BUG-001](../../bugs/open/BUG-001-all-posts-drafts-never-shown.md). |
