# BUG-002 — The home page Drafts count is always 0

| Field | Value |
| --- | --- |
| Bug ID | BUG-002 |
| Title | The home page Drafts count is always 0 |
| Severity | Major |
| Priority | P2 |
| Status | RESOLVED |
| Feature | [FEAT-003](../../features/FEAT-003-public-archive/README.md) |
| Requirement | REQ-011 — **VIOLATED** |
| Reproducible | ALWAYS (code-verified; the page is at 0% coverage) |
| Environment | Read from source |
| Reported in | code review |
| Test | none |
| Evidence | `src/app/page.js:29` and `:44` |
| Fix | Fetch drafts separately for the signed-in user, or drop the counter |
| Regression test | Add a case: seed a draft for the viewer, assert the count is non-zero |

## Observed behaviour

The home page computes a Drafts count by filtering an `active`-only result set. It always
evaluates to 0.

## Expected behaviour

The count reflects the signed-in writer's unpublished posts.

## Steps to reproduce

Sign in, create a draft, open `/`.

## Root cause

`src/app/page.js:29` fetches `status: "active"`; `:44` filters that array for drafts. Same
shape as BUG-001, in a different file.

## Notes

Two bugs from one mistaken assumption — that the archive fetch returns everything. Worth
fixing together, and worth checking for a third instance anywhere else
`services/config.js#getPosts` is called with a hard-coded status.
