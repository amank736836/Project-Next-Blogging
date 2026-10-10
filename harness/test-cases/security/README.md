# Security test cases — cross-cutting index

There is no separate `security/` suite. Security cases live with the module they protect and
are summarised here so they can be reviewed as one set.

## Cases proving a protection exists

| TC ID | Case | Module | Status |
| --- | --- | --- | --- |
| TC-SEC-009 | A signed-in non-author sees no Edit link | [archive-ui](../archive-ui/security.md) | PASS |
| TC-SEC-010 | An anonymous visitor sees no Edit link | [archive-ui](../archive-ui/security.md) | PASS |

Both are **UI-only**. Neither stops anything: the API behind them accepts the same request
from anyone.

## Cases proving a protection is missing

Each asserts the defective behaviour and names the bug in its title. Fixing the bug turns
the test red — that is the design.

| TC ID | Missing protection | Bug | Module |
| --- | --- | --- | --- |
| TC-SEC-002 | `?status=inactive` returns another writer's drafts | [BUG-005](../../bugs/open/BUG-005-idor-draft-exposure.md) | [post-api](../post-api/security.md) |
| TC-SEC-003 | `POST` accepts an arbitrary `userId` | [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md) | [post-api](../post-api/security.md) |
| TC-SEC-004 | `GET /{slug}` serves a draft to anyone | [BUG-006](../../bugs/open/BUG-006-draft-readable-by-slug.md) | [post-api](../post-api/security.md) |
| TC-SEC-005 | `PUT` lets anyone overwrite anything | [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md) | [post-api](../post-api/security.md) |
| TC-SEC-006 | `PUT` accepts out-of-schema fields; enum bypassed | [BUG-007](../../bugs/open/BUG-007-mass-assignment-put.md) | [post-api](../post-api/security.md) |
| TC-SEC-007 | `DELETE` removes anyone's post | [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md) | [post-api](../post-api/security.md) |
| TC-SEC-008 | Any MIME type accepted server-side | [BUG-008](../../bugs/open/BUG-008-upload-no-server-validation.md) | [upload-api](../upload-api/negative.md) |

## Live checks

| SMK ID | Finding | Bug |
| --- | --- | --- |
| SMK-15, SMK-16, SMK-18 | The data API never challenges for credentials | [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md) |
| SMK-17 | The upload endpoint never challenges for credentials | [BUG-008](../../bugs/open/BUG-008-upload-no-server-validation.md) |
| SMK-19 | No security headers; `X-Powered-By: Next.js` advertised | [BUG-014](../../bugs/open/BUG-014-no-security-headers.md) |
| SMK-13, SMK-14 | Internal driver errors echoed to the client | [BUG-013](../../bugs/open/BUG-013-api-leaks-internal-errors.md) |

## Never tested

Full reasoning in [../../test-scenarios/security.md](../../test-scenarios/security.md):

* Real Clerk authentication — **BLOCKED**, no tenant
* NoSQL operator injection — **NOT_EXECUTED**
* Rate limiting, upload size caps, CORS — **NOT_IMPLEMENTED** in the application
* Stored XSS in a browser — **NOT_EXECUTED**; storage is proven by TC-EDGE-003, execution
  is not, because there is no browser here

**No VAPT tooling was run.** No OWASP ZAP, Burp Suite or nuclei scan exists in this
harness — see [../../test-tools/security/README.md](../../test-tools/security/README.md).
