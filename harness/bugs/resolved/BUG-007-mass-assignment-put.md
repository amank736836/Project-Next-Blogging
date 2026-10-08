# BUG-007 — `PUT` has no field allow-list and does not run validators

| Field | Value |
| --- | --- |
| Bug ID | BUG-007 |
| Title | `PUT` has no field allow-list and does not run validators |
| Severity | High |
| Priority | P1 |
| Status | RESOLVED |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-025 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | In-process against the real handler |
| Reported in | RUN-2026-10-07-001 |
| Test | TC-SEC-006 |
| Evidence | `automation/api/posts-slug.test.js`, case `TC-SEC-006` |
| Fix | Allow-list the updatable fields and pass `{ runValidators: true }` |
| Regression test | Invert TC-SEC-006 to assert unknown keys are dropped and the enum is enforced |

## Observed behaviour

`TC-SEC-006` sends `{ "status": "published", "isAdmin": true, "views": 999 }` and all three
are persisted. `"published"` is not in the schema's enum — it is written anyway, because
validation never runs. The document is now in a state the schema declares impossible, and
`GET /api/posts` (which filters `status: "active"`) will silently exclude it from the public
archive forever.

## Expected behaviour

Unknown keys rejected or ignored; `status` constrained to `['active','inactive']`.

## Steps to reproduce

```bash
curl -si -X PUT http://127.0.0.1:3000/api/posts/<slug> \
  -H 'content-type: application/json' \
  -d '{"status":"published","isAdmin":true}'
```

## Root cause

`src/app/api/posts/[slug]/route.js:26`:

```js
const post = await Post.findOneAndUpdate({ slug }, body, { new: true });
```

Two omissions in one line:

1. `body` is the raw parsed request. No allow-list, no projection.
2. `{ new: true }` is the whole options object. Mongoose's `findOneAndUpdate` does **not**
   run validators by default — that needs `runValidators: true`.

So the update bypasses both the schema's enum and its `required` rules. `TC-DB-009` proves
the enum *is* enforced on create; this is what proves it is not enforced on update.

## Notes

`slug` is not updatable through this endpoint either — not by design, but because
`findOneAndUpdate` matches on `{ slug }` and a changed slug would move the document out from
under the response. `TC-API-008` pins that behaviour.

Combined with BUG-004 (no auth), any anonymous caller can corrupt any document in the
collection into an unrecoverable state.
