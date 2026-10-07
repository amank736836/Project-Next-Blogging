# BUG-003 — The byline shows the reader as the author

| Field | Value |
| --- | --- |
| Bug ID | BUG-003 |
| Title | The byline shows the reader as the author |
| Severity | Major |
| Priority | P2 |
| Status | OPEN |
| Feature | [FEAT-004](../../features/FEAT-004-article-reader/README.md) |
| Requirement | REQ-027 — **VIOLATED** |
| Reproducible | ALWAYS (code-verified; the page is at 0% coverage) |
| Environment | Read from source |
| Reported in | code review |
| Test | none |
| Evidence | `src/app/post/[slug]/page.js:167` and `:170` |
| Fix | Resolve the author from `post.userId` against a user directory, or denormalise the name onto the document |
| Regression test | Add a case: a post owned by user B, viewed by user A, must not show A's name |

## Observed behaviour

Every article displays the *current viewer's* Clerk profile as its author. An anonymous
visitor sees nothing; a signed-in reader sees their own name and avatar on someone else's
work.

## Expected behaviour

The byline names the post's author.

## Steps to reproduce

Sign in as user A, open a post written by user B, read the byline.

## Root cause

`src/app/post/[slug]/page.js:167-170` reads the byline from `useUser()` — the *viewer's*
session — rather than from `post.userId`. The post document carries an author id
(`TC-DB-006`) and it is never used for display.

There is no user collection to resolve against, which is presumably why the shortcut was
taken: `userId` is a bare Clerk id with no profile attached (see BUG-020).

## Notes

This is also why `PostCard` can only offer an Edit link and not a real byline — the data
model has no author name to show. Fixing this properly means denormalising
`authorName`/`authorImageUrl` onto the post at write time, since there is no user store to
join against.

`TC-SEC-009` and `TC-SEC-010` test the *Edit link* logic in `PostCard`, which correctly
compares `post.userId` to the current user. That logic is right; the reader page's byline
is a separate, wrong code path.
