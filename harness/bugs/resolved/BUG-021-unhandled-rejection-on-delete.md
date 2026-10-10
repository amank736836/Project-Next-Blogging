# BUG-021 — `deletePost` has `try/finally` with no `catch`

| Field | Value |
| --- | --- |
| Bug ID | BUG-021 |
| Title | `deletePost` has `try/finally` with no `catch` |
| Severity | Low |
| Priority | P3 |
| Status | RESOLVED |
| Feature | [FEAT-004](../../features/FEAT-004-article-reader/README.md) |
| Requirement | REQ-019 — **VIOLATED** |
| Reproducible | ALWAYS (code-verified; the page is at 0% coverage) |
| Environment | Read from source |
| Reported in | code review |
| Test | none |
| Evidence | `src/app/post/[slug]/page.js:75-81` |
| Fix | Add a `catch` that surfaces the failure and keeps the user on the page |
| Regression test | Add a case: make `deletePost` reject, assert an error is shown and no navigation occurs |

## Observed behaviour

If the delete request fails, the error propagates out of an async event handler with nothing
to catch it. The `finally` block resets the button state, so the UI returns to normal — and
the user gets no indication that anything went wrong, or that their post still exists.

## Expected behaviour

A visible error, and the user stays on the article.

## Steps to reproduce

Delete a post while the API is unreachable.

## Root cause

`src/app/post/[slug]/page.js:75-81`:

```js
try {
    const status = await postService.deletePost(post.slug);
    if (status) router.push('/');
} finally {
    setDeleting(false);
    setConfirming(false);
}
```

A `finally` without a `catch` cleans up and re-throws. In an `onClick` handler that rejection
is unhandled. Compare `:85-89` in the same file, where `copyLink` *does* have a `catch` with
a comment explaining why — so the pattern was understood, just not applied here.

## Notes

`src/components/PostForm/PostForm.jsx:146-158` has the same handler for the composer's
delete button — and that one **does** have a `catch` at `:155`. Two copies of one behaviour,
one correct and one not, which is the more useful signal: the fix is to make the page match
the form.

Low severity because the failure needs an API outage to trigger, and the outcome is a silent
no-op rather than data loss. Worth fixing while touching the file for BUG-003.
