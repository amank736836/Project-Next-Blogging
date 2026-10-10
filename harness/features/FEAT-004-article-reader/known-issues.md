# FEAT-004 · Known issues

| Bug | Severity | Summary |
| --- | --- | --- |
| [BUG-003](../../bugs/open/BUG-003-article-shows-viewer-as-author.md) | Major | The masthead shows the *viewer's* name and initial, not the author's. |
| [BUG-006](../../bugs/open/BUG-006-draft-readable-by-slug.md) | High | Drafts are publicly readable by URL. |
| [BUG-022](../../bugs/open/BUG-022-stored-xss-post-content.md) | High | `parse(post.content)` renders unsanitised author HTML. |
| [BUG-021](../../bugs/open/BUG-021-unhandled-rejection-on-delete.md) | Low | `deletePost` has `try/finally` with no `catch`. |
| [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md) | Critical | The Edit/Delete controls are cosmetic; the API does not check ownership. |

## Coverage gap

`src/app/post/[slug]/page.js` — 308 lines, **0% covered**. The highest-value missing
automation in the harness.
