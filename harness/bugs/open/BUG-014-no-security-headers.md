# BUG-014 — No security headers, and the framework is advertised

| Field | Value |
| --- | --- |
| Bug ID | BUG-014 |
| Title | No security headers, and the framework is advertised |
| Severity | Medium |
| Priority | P2 |
| Status | OPEN |
| Feature | infrastructure |
| Requirement | REQ-NF-05 — **NOT IMPLEMENTED** |
| Reproducible | ALWAYS |
| Environment | Live, against the production build |
| Reported in | RUN-2026-10-07-001 |
| Test | SMK-19 |
| Evidence | `evidence/api-responses/smoke-RUN-2026-10-07-001.json`, entry `SMK-19` (`headerInventory`) |
| Fix | Add a `headers()` block to `next.config.mjs`; set `poweredByHeader: false` |
| Regression test | Extend SMK-19 to *assert* the headers rather than record them |

## Observed behaviour

`SMK-19` inventories the response headers on `GET /`. All seven are `null`:

| Header | Present |
| --- | --- |
| `Content-Security-Policy` | no |
| `Strict-Transport-Security` | no |
| `X-Frame-Options` | no |
| `X-Content-Type-Options` | no |
| `Referrer-Policy` | no |
| `Permissions-Policy` | no |
| `Cross-Origin-Opener-Policy` | no |

And `X-Powered-By: Next.js` **is** sent.

## Expected behaviour

The seven headers present with sensible values; no `X-Powered-By`.

## Steps to reproduce

```bash
curl -sI http://127.0.0.1:3000/ | grep -iE 'content-security|strict-transport|frame-options|content-type-options|referrer-policy|permissions-policy|powered-by'
```

## Root cause

`next.config.mjs` configures `images.remotePatterns` and nothing else. There is no
`headers()` export and no `poweredByHeader: false`.

## Notes

Cheap to fix and worth doing early, because CSP is the control that would blunt
[BUG-022](BUG-022-stored-xss-post-content.md) even before the sanitisation lands.

A starter block:

```js
async headers() {
  return [{
    source: "/(.*)",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ],
  }];
}
```

CSP needs care with Next.js inline scripts — use a nonce rather than `unsafe-inline`. That is
why it is not in the snippet above.
