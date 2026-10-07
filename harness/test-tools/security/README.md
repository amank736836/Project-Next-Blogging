# Security testing tools

## What was used

Nothing specialised. The security work is ordinary Vitest assertions pointed at the real
route handlers, plus the live smoke script's header and status inspection.

| Tool | Used for |
| --- | --- |
| `automation/utilities/request.js` | Sending unauthenticated requests to the real handlers |
| `automation/scripts/api-smoke.mjs` | Header inventory (`SMK-19`), missing-auth-challenge checks (`SMK-15`…`SMK-18`) |
| Node's built-in `fetch` | Everything — no HTTP client library |
| Source inspection | `next.config.mjs` `remotePatterns`, `src/proxy.js` matcher, the committed-secret scan |

## What was found

Ten automated cases assert that a protection is **absent**, and they pass. Two assert a
protection that genuinely exists. Full inventory:
[../../test-cases/security/README.md](../../test-cases/security/README.md) and
[../../test-scenarios/security.md](../../test-scenarios/security.md).

The headline is architectural rather than a single bug: `src/proxy.js:6` is
`clerkMiddleware()` with **no** `protect()` call, and the matcher covers
`["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]`. Nothing in the request path ever
checks who is asking. Every IDOR in this application follows from that one fact.

## What was never run

Be clear about this, because the absence is easy to mistake for a clean result.

| Technique | Status |
| --- | --- |
| OWASP ZAP | **Not installed, not run** |
| Burp Suite | **Not installed, not run** |
| nuclei / template scanning | **Not installed, not run** |
| Dependency audit (`npm audit`) | **Not run** — it requires a registry advisory call and was not part of this pass |
| Authenticated-session testing | **BLOCKED** — no Clerk tenant |
| Browser-based XSS exploitation | **NOT_EXECUTED** — no browser. TC-EDGE-003 proves hostile markup is *stored*; nothing proves it *executes*. |
| Penetration test by a human | **Not performed** |

So: the security findings here come from reading the code and calling the endpoints. That
found a Critical and two High issues without any tooling, which is a reasonable argument
that the basics were worth checking first — but it is not a substitute for a scan, and this
harness does not claim to be one.

## Adding a scan later

The cheapest useful addition, given the stack, is a dependency audit and a DAST pass
against a deployed preview:

```bash
npm audit --omit=dev          # advisory database, no code execution
npx @zap/automate -t <target> # or zap-baseline.py against a preview URL
```

Neither has been run. Both would write their output to
[../../evidence/](../../evidence/README.md) and be referenced from the case sheets.
