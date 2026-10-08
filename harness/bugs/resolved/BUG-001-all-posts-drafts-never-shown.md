# BUG-001 — The Drafts tab on `/all-posts` is always empty

| Field | Value |
| --- | --- |
| Bug ID | BUG-001 |
| Title | The Drafts tab on `/all-posts` is always empty |
| Severity | Major |
| Priority | P1 |
| Status | RESOLVED |
| Feature | [FEAT-006](../../features/FEAT-006-my-shelf/README.md) |
| Requirement | REQ-028 — **VIOLATED** |
| Reproducible | ALWAYS (code-verified; the page is at 0% coverage) |
| Environment | Read from source |
| Reported in | code review |
| Test | none |
| Evidence | `src/app/all-posts/page.js:37` and `:52` |
| Fix | Fetch both statuses, or fetch `status=all` and filter client-side |
| Regression test | Add a case: seed a draft owned by the viewer, open the Drafts tab, assert it appears |

## Observed behaviour

The shelf fetches once with `status=active` and then filters the result in memory by tab.
The Drafts tab filters for `status !== "active"` over a result set that contains nothing but
`active` documents. It is empty for every user, always, no matter how many drafts exist.

## Expected behaviour

The Drafts tab lists the signed-in writer's unpublished posts.

## Steps to reproduce

Sign in, create a post as a draft, open `/all-posts`, click **Drafts**.

## Root cause

`src/app/all-posts/page.js:37` fetches with `status: "active"` hard-coded. `:52` then
partitions that same array by status. The partition step can never produce a non-empty
drafts group.

Note that the API supports this perfectly well — `GET /api/posts?status=inactive` works
(that is BUG-005, from the other direction). The client simply never asks.

## Notes

The mirror image of BUG-005: the API is too permissive and the client is too restrictive, and
the two errors happen to point in opposite directions.

There is no test. `app/all-posts/page.js` is 120 lines at 0% statement coverage, and testing
it requires mocking `@clerk/nextjs` and `@/services/config` together. That is the cheapest
high-value test left in this project — see
[../../test-scenarios/ui.md](../../test-scenarios/ui.md) `SCN-UI-40`.
