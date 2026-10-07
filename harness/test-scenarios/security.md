# Security scenarios

This is the most important file in the harness. **Every automated security case in this
project currently passes by asserting that the protection is missing.** They are wired to
bug IDs so that fixing the defect breaks the test and forces it to be inverted — not
deleted.

## Authentication

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-SEC-01 | Real Clerk sign-up, sign-in, MFA, OAuth, magic link, session expiry, sign-out. | BLOCKED — needs a live Clerk tenant | — |
| SCN-SEC-02 | A forged or expired Clerk session cookie does not grant access. | BLOCKED — needs a live Clerk tenant | — |
| SCN-SEC-03 | The client gate never mounts protected content before auth resolves. | AUTOMATED | TC-UI-003, TC-UI-004 |

## Authorization / IDOR

| SCN ID | Scenario | Status | Case | Finding |
| --- | --- | --- | --- | --- |
| SCN-SEC-04 | `GET /api/posts?status=inactive` does not return another user's drafts. | AUTOMATED — **fails the intent** | TC-SEC-002 | [BUG-005](../bugs/open/BUG-005-idor-draft-exposure.md) |
| SCN-SEC-05 | `GET /api/posts/{slug}` does not serve a draft to a stranger. | AUTOMATED — **fails the intent** | TC-SEC-004 | [BUG-006](../bugs/open/BUG-006-draft-readable-by-slug.md) |
| SCN-SEC-06 | `POST /api/posts` does not accept a caller-chosen `userId`. | AUTOMATED — **fails the intent** | TC-SEC-003 | [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) |
| SCN-SEC-07 | `PUT /api/posts/{slug}` rejects a non-owner. | AUTOMATED — **fails the intent** | TC-SEC-005 | [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) |
| SCN-SEC-08 | `DELETE /api/posts/{slug}` rejects a non-owner. | AUTOMATED — **fails the intent** | TC-SEC-007 | [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) |
| SCN-SEC-09 | `POST /api/upload` rejects an anonymous caller. | AUTOMATED (live) — **fails the intent** | SMK-17 — reaches the handler; only the missing file part stops it | [BUG-008](../bugs/open/BUG-008-upload-no-server-validation.md) |
| SCN-SEC-10 | No `WWW-Authenticate` challenge is offered, because nothing checks. | AUTOMATED (live) | SMK-18 | [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) |
| SCN-SEC-11 | The edit affordance is hidden from a signed-in non-owner. | AUTOMATED — passes | TC-SEC-009 | UI only |
| SCN-SEC-12 | The edit affordance is hidden from an anonymous visitor. | AUTOMATED — passes | TC-SEC-010 | UI only |

## Injection and input validation

| SCN ID | Scenario | Status | Case | Finding |
| --- | --- | --- | --- | --- |
| SCN-SEC-13 | Hostile HTML in `content` is neutralised before another visitor renders it. | PARTIAL — storage proven, browser execution `NOT_EXECUTED` | TC-EDGE-003 | [BUG-022](../bugs/open/BUG-022-stored-xss-post-content.md) |
| SCN-SEC-14 | NoSQL operator injection via a JSON body (`{"$ne": null}`, `{"$gt": ""}`). | NOT_EXECUTED | — | The body is passed straight to `Post.create` / `findOneAndUpdate`; Mongoose casts by schema type, so a String path given an object is likely rejected — but this has not been tested. |
| SCN-SEC-15 | Query-parameter injection into the Mongo filter (`status`, `userId`). | NOT_EXECUTED | — | Values come from `searchParams.get()` and are always strings, so this is probably safe by construction. Untested. |
| SCN-SEC-16 | Arbitrary fields cannot be written through `PUT`. | AUTOMATED — **fails the intent** | TC-SEC-006 | [BUG-007](../bugs/open/BUG-007-mass-assignment-put.md) |
| SCN-SEC-17 | `status` cannot be set outside the enum through `PUT`. | AUTOMATED — **fails the intent** | TC-SEC-006 | [BUG-007](../bugs/open/BUG-007-mass-assignment-put.md) |
| SCN-SEC-18 | A non-image upload is rejected server-side. | AUTOMATED — **fails the intent** | TC-SEC-008 | [BUG-008](../bugs/open/BUG-008-upload-no-server-validation.md) |
| SCN-SEC-19 | A polyglot file (valid image header + embedded script) is served inertly from the CDN. | BLOCKED — needs a Cloudinary account and a browser | — |

## Sensitive data exposure

| SCN ID | Scenario | Status | Case | Finding |
| --- | --- | --- | --- | --- |
| SCN-SEC-20 | Error responses do not disclose hosts, ports or driver messages. | AUTOMATED (live) — **fails the intent** | SMK-13, SMK-14 | [BUG-013](../bugs/open/BUG-013-api-leaks-internal-errors.md) |
| SCN-SEC-21 | No secrets are committed to the repository. | AUTOMATED — passes | see [../reports/release-readiness.md](../reports/release-readiness.md) §Secrets scan | — |
| SCN-SEC-22 | `NEXT_PUBLIC_*` variables contain nothing sensitive (they ship to the browser). | Verified by inspection | — | Only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `NEXT_PUBLIC_TINYMCE_API_KEY`, both designed to be public |

## Transport and headers

| SCN ID | Scenario | Status | Case | Finding |
| --- | --- | --- | --- | --- |
| SCN-SEC-23 | Responses carry CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP. | AUTOMATED (live) — **all seven absent** | SMK-19 | [BUG-014](../bugs/open/BUG-014-no-security-headers.md) |
| SCN-SEC-24 | The framework is not advertised. | AUTOMATED (live) — **`X-Powered-By: Next.js` is sent** | SMK-19 | [BUG-014](../bugs/open/BUG-014-no-security-headers.md) |
| SCN-SEC-25 | `next/image` only fetches from allow-listed hosts. | Verified by inspection of `next.config.mjs` | — | `remotePatterns` permits `https://res.cloudinary.com/**` only |

## API abuse

| SCN ID | Scenario | Status | Finding |
| --- | --- | --- | --- |
| SCN-SEC-26 | Rate limiting on the API. | NOT_IMPLEMENTED | None anywhere |
| SCN-SEC-27 | An upload size cap enforced server-side. | NOT_IMPLEMENTED | [BUG-008](../bugs/open/BUG-008-upload-no-server-validation.md) |
| SCN-SEC-28 | A CORS policy. | NOT_IMPLEMENTED | No `Access-Control-*` header is set by any route; same-origin only by default |

## Summary

| Outcome | Count |
| --- | --- |
| Automated and **passing as intended** | 3 (TC-SEC-009, TC-SEC-010, SCN-SEC-21) plus `SMK-17`, which asserts a correct `400` |
| Automated and **proving a defect** | 10 |
| Blocked (no Clerk tenant / Cloudinary / browser) | 4 |
| Not executed | 3 |
| Not implemented at all | 3 |

**No VAPT tooling has been run.** There is no OWASP ZAP, Burp or nuclei scan in this
harness and none was added — see [../test-tools/security/README.md](../test-tools/security/README.md).
