# FEAT-005 · Known issues

| Bug | Severity | Summary |
| --- | --- | --- |
| [BUG-008](../../bugs/open/BUG-008-upload-no-server-validation.md) | High | No MIME or size check server-side, and the endpoint is unauthenticated — an open, unlimited upload proxy to a paid Cloudinary account. |
| [BUG-016](../../bugs/open/BUG-016-upload-non-multipart-500.md) | Low | A non-multipart body produces 500 rather than 400/415. |

## Unfiled observations

* **No orphan cleanup.** Upload and create are separate requests; a failed create leaves
  the asset in Cloudinary forever.
* **No filename or extension handling.** `public_id` comes from Cloudinary's own
  generation; the original filename is discarded.
* **`result` may be undefined.** The `upload_stream` callback resolves with whatever
  Cloudinary passes; a success callback carrying no result would make
  `result.public_id` throw. Not observed — no test can reach it with the current mock.
