# FEAT-007 · Known issues

| Bug | Severity | Summary |
| --- | --- | --- |
| [BUG-014](../../bugs/open/BUG-014-no-security-headers.md) | Medium | These public responses carry no CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy or Permissions-Policy, and expose `X-Powered-By: Next.js`. |

## Unfiled observations

* **Unmeasured marketing numbers.** `98 ms median TTFB` and `under 4 minutes` to first
  post are published as facts. They are not measurements.
* **Capabilities advertised but absent.** Pro/Studio lists custom redirects, metrics,
  newsletter hooks, teams, SSO and invoicing. None exist in the code, and there is no
  billing or plan model at all.
* `app/pricing/page.js:43` initialises `yearly` to `false` and then compares it against
  `opt.id` strings. It works because `false !== 'monthly'`, but the state's type is
  inconsistent from the first render.
