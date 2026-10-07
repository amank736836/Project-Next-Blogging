# Bug register

21 open, 0 resolved. Found by reading the source and by executing the suites — no bug here
is speculative. Every entry names the file and line it was found in, and every one that has
a test says which.

## Severity scale used

| Severity | Meaning in this project |
| --- | --- |
| Critical | An unauthenticated caller can read or destroy data that is not theirs |
| High | Data integrity, confidentiality or a whole feature is broken for real users |
| Major | A visible feature does not work, with no workaround |
| Medium | Wrong status codes, leaked internals, operational fragility |
| Low | Hygiene, dead weight, stale comments |

## Open

| ID | Summary | Severity | Feature | Test | Fix |
| --- | --- | --- | --- | --- | --- |
| [BUG-004](open/BUG-004-unauthenticated-post-api.md) | The post API has no authentication or ownership check at all | **Critical** | FEAT-002 | TC-SEC-003/005/007, SMK-15/16/18 | No |
| [BUG-005](open/BUG-005-idor-draft-exposure.md) | `?status=inactive` returns every writer's drafts | **Critical** | FEAT-002, FEAT-006 | TC-SEC-002 | No |
| [BUG-006](open/BUG-006-draft-readable-by-slug.md) | A draft is served to anyone who knows its slug | High | FEAT-004 | TC-SEC-004 | No |
| [BUG-007](open/BUG-007-mass-assignment-put.md) | `PUT` has no allow-list and no `runValidators` | High | FEAT-002 | TC-SEC-006 | No |
| [BUG-008](open/BUG-008-upload-no-server-validation.md) | Upload accepts any MIME and any size, unauthenticated | High | FEAT-005 | TC-SEC-008, SMK-17 | No |
| [BUG-022](open/BUG-022-stored-xss-post-content.md) | Post content is rendered unsanitised — stored XSS | High | FEAT-004 | TC-EDGE-003 (storage only) | No |
| [BUG-001](open/BUG-001-all-posts-drafts-never-shown.md) | The Drafts tab on `/all-posts` is always empty | Major | FEAT-006 | none | No |
| [BUG-002](open/BUG-002-home-drafts-filter-dead.md) | The home Drafts count is always 0 | Major | FEAT-003 | none | No |
| [BUG-003](open/BUG-003-article-shows-viewer-as-author.md) | The byline shows the viewer as the author | Major | FEAT-004 | none | No |
| [BUG-011](open/BUG-011-manual-slug-strips-hyphens.md) | The manual slug field strips every hyphen as you type | Major | FEAT-002 | TC-NEG-010 | No |
| [BUG-010](open/BUG-010-contact-form-has-no-backend.md) | The contact form reports success and sends nothing | Medium | FEAT-008 | TC-UI-012 | No |
| [BUG-012](open/BUG-012-db-caches-rejected-promise.md) | A rejected DB connection is cached forever | Medium | infrastructure | none | No |
| [BUG-013](open/BUG-013-api-leaks-internal-errors.md) | 500s echo the raw driver error to the client | Medium | FEAT-002 | TC-NEG-001/003/004, SMK-13/14 | No |
| [BUG-014](open/BUG-014-no-security-headers.md) | No security headers; framework advertised | Medium | infrastructure | SMK-19 | No |
| [BUG-015](open/BUG-015-missing-clerk-secret-key-500s-site.md) | A missing `CLERK_SECRET_KEY` 500s the entire site | Medium | infrastructure | log evidence | No |
| [BUG-017](open/BUG-017-db-throws-at-import.md) | `db.js` throws at import without `MONGO_URI`, so the build fails | Medium | infrastructure | none | No |
| [BUG-016](open/BUG-016-upload-non-multipart-500.md) | A non-multipart upload answers 500 instead of 400/415 | Low | FEAT-005 | SMK-20 | No |
| [BUG-018](open/BUG-018-unused-dependencies.md) | Five runtime dependencies are never imported | Low | infrastructure | none | No |
| [BUG-019](open/BUG-019-no-env-example.md) | No `.env.example` | Low | infrastructure | none | No |
| [BUG-020](open/BUG-020-stale-firebase-comment.md) | `userId` is documented as a Firebase UID and has no referential integrity | Low | FEAT-002 | TC-DB-006 | No |
| [BUG-021](open/BUG-021-unhandled-rejection-on-delete.md) | `deletePost` has `try/finally` with no `catch` | Low | FEAT-002 | none | No |

## Withdrawn

| ID | What it claimed | Why it was withdrawn |
| --- | --- | --- |
| **BUG-009** | An empty string would be accepted for required String fields | **Disproven by execution.** `TC-EDGE-001` sets every required field to `""` and Mongoose rejects all five — `required: true` on a String *does* reject the empty string. The number is retired rather than reused, so that any older reference to BUG-009 stays traceable to this note. |

## Resolved

Nothing. [resolved/](resolved/) is empty because no fix has been made — this harness was
built without modifying `src/`.

## Priority, and the order to fix things

Severity and priority are not the same. BUG-004 and BUG-005 are one root cause and should
be fixed together, first:

`src/proxy.js:6` is `clerkMiddleware()` with **no** `protect()` call. Nothing in the request
path ever establishes who is asking. Every authorisation bug in this application follows
from that single omission, and no amount of per-route patching will be as durable as
putting the check in the middleware.

Suggested order:

1. **BUG-004 + BUG-005 + BUG-006** — authenticate the API, scope every query to the
   session user, and filter drafts out of public reads. One change, three bugs.
2. **BUG-007 + BUG-008** — allow-list the update body, pass `runValidators`, and validate
   MIME and size on the server.
3. **BUG-022** — sanitise `post.content` before `parse()`.
4. **BUG-013 + BUG-014 + BUG-016** — error handling and headers.
5. **BUG-001 + BUG-002 + BUG-003 + BUG-011 + BUG-010** — the visible feature defects.
6. Everything Low.

## Regression-test policy

Every bug fixed from here must land with its regression test inverted, not deleted.

| Bug | What to do to its test |
| --- | --- |
| BUG-004…008, BUG-022 | The `TC-SEC-*` case currently asserts the *defective* behaviour. Rewrite the assertion to expect `401`/`403`/`415`. It will go red the moment the fix lands — that is the design, not a mistake. |
| BUG-010 | `TC-UI-012` asserts zero network calls. Once a backend exists, invert it to assert one. |
| BUG-011 | `TC-NEG-010` asserts hyphens are stripped. Invert to assert they survive. |
| BUG-001, BUG-002, BUG-003, BUG-012, BUG-017, BUG-021 | No test exists yet. **Write one before fixing** — otherwise the fix is unverifiable. The three Major UI bugs are the most important of these, because they are the ones a user would actually notice. |

## Writing a new bug report

Copy any file in [open/](open/). They all use this 14-field template:

```markdown
# BUG-nnn — <one-line summary>

| Field | Value |
| --- | --- |
| Bug ID | BUG-nnn |
| Title | |
| Severity | Critical / High / Major / Medium / Low |
| Priority | P0…P3 |
| Status | OPEN / IN_PROGRESS / RESOLVED / WITHDRAWN |
| Feature | FEAT-nnn |
| Requirement | REQ-xxx (and whether it is VIOLATED or simply absent) |
| Reproducible | ALWAYS / INTERMITTENT / ONCE / NOT_REPRODUCED |
| Environment | where it was observed |
| Reported in | RUN-xxx, or `code review` |
| Test | the TC/SMK id that covers it, or `none` |
| Evidence | a file under ../evidence/, or the exact command |
| Fix | proposed, or `none proposed` |
| Regression test | what should be added or inverted |

## Observed behaviour
## Expected behaviour
## Steps to reproduce
## Root cause
## Notes
```

`Reproducible` matters more than it looks. Two of the entries below are `ALWAYS` but were
never *executed* end to end — they are code-verified, and the report says so rather than
implying a reproduction that did not happen.
