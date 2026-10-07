# FEAT-002 · Known issues

| Bug | Severity | Summary |
| --- | --- | --- |
| [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md) | **Critical** | Create, update and delete are all unauthenticated; `userId` is caller-controlled. |
| [BUG-007](../../bugs/open/BUG-007-mass-assignment-put.md) | High | `PUT` accepts arbitrary fields and an out-of-enum `status`. |
| [BUG-022](../../bugs/open/BUG-022-stored-xss-post-content.md) | High | `content` is stored and rendered unsanitised. |
| [BUG-011](../../bugs/open/BUG-011-manual-slug-strips-hyphens.md) | Major | The manual slug field deletes every hyphen as it is typed. |
| [BUG-013](../../bugs/open/BUG-013-api-leaks-internal-errors.md) | Medium | Every failure becomes `500 { error: <raw message> }`. |
| [BUG-021](../../bugs/open/BUG-021-unhandled-rejection-on-delete.md) | Low | The article page's delete has no `catch`. |

## Unfiled observations

* **No pagination.** `GET /api/posts` returns every matching document. Fine at ten posts,
  not at ten thousand. Tracked as REQ-NF-11 and SCN-PERF-04.
* **Orphaned images.** Upload and create are two requests with no compensation.
  SCN-INT-03 (manual, `NOT_EXECUTED`).
* **A stuck button.** If `uploadFile` resolves falsy on create, `loading` is never reset
  and the submit button stays disabled with no message.
  `PostForm.jsx:96-104`. Not yet filed — no test exercises it because the mock never
  returns falsy. Worth a TC.
