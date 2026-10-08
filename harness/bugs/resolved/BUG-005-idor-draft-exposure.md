# BUG-005 — `?status=inactive` returns every writer's drafts to anyone

| Field | Value |
| --- | --- |
| Bug ID | BUG-005 |
| Title | `?status=inactive` returns every writer's drafts to anyone |
| Severity | **Critical** |
| Priority | P0 |
| Status | RESOLVED |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md), [FEAT-006](../../features/FEAT-006-my-shelf/README.md) |
| Requirement | REQ-024 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | Production build and in-process against the real handler |
| Reported in | RUN-2026-10-07-001 |
| Test | TC-SEC-002 |
| Evidence | `automation/api/posts-collection.test.js`, case `TC-SEC-002` |
| Fix | Bind `userId` to the session server-side; never accept it as a query parameter |
| Regression test | Invert TC-SEC-002 to expect `401` |

## Observed behaviour

`GET /api/posts?status=inactive` returns every unpublished post in the collection, with no
credentials and no `userId` filter. `TC-SEC-002` seeds a draft owned by `USER_B`, issues the
request as nobody, and receives the draft.

## Expected behaviour

Drafts are visible only to their author, and only when authenticated.

## Steps to reproduce

```bash
curl -s "http://127.0.0.1:3000/api/posts?status=inactive" | head -c 800
```

## Root cause

`src/app/api/posts/route.js:9-15`:

```js
const status = searchParams.get("status") || "active";
const userId = searchParams.get("userId");
const query = { status };
if (userId) { query.userId = userId; }
```

`status` is caller-controlled and `userId` is **optional**. Omit it and the filter is
`{ status: "inactive" }` — the entire collection's drafts. The default of `"active"` is the
only thing keeping the *public* archive clean; there is nothing equivalent protecting the
private side.

## Notes

A textbook IDOR. Note the asymmetry: the same endpoint is safe for the public case purely by
accident of a default value, and unsafe for the private case because the filter is optional.

This is what makes the writer's shelf (FEAT-006) a leak rather than a feature — it is the
only reason the client can list drafts at all.
