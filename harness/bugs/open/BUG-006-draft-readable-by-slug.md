# BUG-006 — A draft is served to anyone who knows its slug

| Field | Value |
| --- | --- |
| Bug ID | BUG-006 |
| Title | A draft is served to anyone who knows its slug |
| Severity | High |
| Priority | P0 |
| Status | OPEN |
| Feature | [FEAT-004](../../features/FEAT-004-article-reader/README.md) |
| Requirement | REQ-024 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | In-process against the real handler |
| Reported in | RUN-2026-10-07-001 |
| Test | TC-SEC-004 |
| Evidence | `automation/api/posts-slug.test.js`, case `TC-SEC-004` |
| Fix | Filter `{ slug, status: "active" }` for anonymous callers; require ownership for the rest |
| Regression test | Invert TC-SEC-004 to expect `404` for an anonymous draft read |

## Observed behaviour

`GET /api/posts/<draft-slug>` returns the full draft — title, body and featured image — with
a `200`, to a caller with no session.

## Expected behaviour

`404` (or `403`) for an unpublished post requested by a non-owner.

## Steps to reproduce

```bash
curl -s http://127.0.0.1:3000/api/posts/draft-never-shipped
```

## Root cause

`src/app/api/posts/[slug]/route.js:10` — `Post.findOne({ slug })`. The `status` field is
never mentioned in the query. Once a slug is known, the draft is public.

## Notes

Slugs are guessable: they are derived from the title by `slugTransform`, so an unpublished
post about a known topic has a predictable slug. This compounds BUG-005 — that bug hands out
the slugs, this one serves the content.

The reader page (`app/post/[slug]/page.js`) fetches through this endpoint, so an unpublished
post also *renders* at its public URL.
