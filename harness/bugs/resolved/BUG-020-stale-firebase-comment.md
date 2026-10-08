# BUG-020 — `userId` is documented as a Firebase UID and has no referential integrity

| Field | Value |
| --- | --- |
| Bug ID | BUG-020 |
| Title | `userId` is documented as a Firebase UID and has no referential integrity |
| Severity | Low |
| Priority | P3 |
| Status | RESOLVED |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-003 — **PARTIAL** |
| Reproducible | ALWAYS |
| Environment | Read from source; type asserted by TC-DB-006 |
| Reported in | code review |
| Test | TC-DB-006 |
| Evidence | `src/models/Post.js:28`; `TC-DB-006` asserts the path is a `String` |
| Fix | Correct the comment; denormalise author display data onto the post |
| Regression test | None for the comment; TC-DB-006 already pins the type |

## Observed behaviour

`src/models/Post.js:28` declares `userId` with the comment `// Firebase UID`. The
application authenticates with Clerk. `TC-DB-006` confirms the field is a plain `String`
with no `ref` and no index.

## Expected behaviour

The comment names Clerk. The field either references a user record or carries the display data the UI needs.

## Steps to reproduce

`grep -n 'Firebase' src/models/Post.js`

## Root cause

The project moved from Firebase to Clerk and the comment did not move with it. The
deeper issue is architectural: there is no user collection anywhere, so `userId` is a
dangling identifier that can only ever be compared for equality — never resolved to a name
or an avatar.

## Notes

This is the direct cause of [BUG-003](BUG-003-article-shows-viewer-as-author.md). With no
user record to look up, the reader page took the shortcut of displaying `useUser()` — the
viewer — as the author.

The pragmatic fix, given there is no user store and no plans in the repository for one:
write `authorName` and `authorImageUrl` onto the document at create time. They will go stale
if a Clerk profile changes, but a slightly stale byline is better than the wrong one.

Also worth noting: `userId` has no index, so `GET /api/posts?userId=…` — the query the
writer's shelf runs on every load — is a collection scan.
