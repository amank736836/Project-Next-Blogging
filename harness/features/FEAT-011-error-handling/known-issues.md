# FEAT-011 · Known issues

No bug is filed against `app/error.js` or `app/not-found.js` themselves. The defects below
live in the layers around them.

| Bug | Severity | Summary |
| --- | --- | --- |
| [BUG-013](../../bugs/open/BUG-013-api-leaks-internal-errors.md) | Medium | The API's error handling is a single `catch` that echoes the raw message to the client. |
| [BUG-021](../../bugs/open/BUG-021-unhandled-rejection-on-delete.md) | Low | The article page's delete path has no `catch`. |
| [BUG-016](../../bugs/open/BUG-016-upload-non-multipart-500.md) | Low | A wrong content type becomes a 500 instead of a 4xx. |

## Unfiled observations

* **A silent failure in the composer.** `PostForm.submit`'s `catch` logs and resets
  `loading`, and the writer sees the button stop spinning with no message. If the upload or
  the create fails, they have no way to know whether it worked.
* **`error.js` prints `error.message` to the visitor.** Truncated to 320 characters, and
  this is a client boundary, so it is a defensible choice — but it must never become the
  place where a server-side detail is exposed.
* **0% coverage** on both components.
