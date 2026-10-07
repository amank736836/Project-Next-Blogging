# Evidence

Raw artefacts from a run, not summaries of one. If a claim in this harness cannot be traced
to a file in here, it is a claim about the source code rather than about an execution.

## What exists

| Path | Contents | Status |
| --- | --- | --- |
| [api-responses/smoke-RUN-2026-10-07-001.json](api-responses/smoke-RUN-2026-10-07-001.json) | All 20 smoke checks: status, **every response header**, a body excerpt, duration | Real, from the live run |
| [logs/RUN-2026-10-07-001-missing-clerk-secret-key.log](logs/RUN-2026-10-07-001-missing-clerk-secret-key.log) | Verbatim server output when `CLERK_SECRET_KEY` is absent — proof of [BUG-015](../bugs/open/BUG-015-missing-clerk-secret-key-500s-site.md) | Real |
| [logs/build-RUN-smoke.log](logs/build-RUN-smoke.log) | The production build output, including the 18-route table | Real |
| [screenshots/README.md](screenshots/README.md) | **No screenshots exist** — see below | Empty, deliberately |

## What does not exist, and why

| Path | Why it is empty |
| --- | --- |
| `screenshots/` | There is no browser in this environment. No screenshot was taken, and none was fabricated. |
| `videos/` | Same reason. |
| `database-results/` | There is no MongoDB. No query was ever executed against a real database. |

These three directories are kept rather than deleted because they are where the artefacts
belong once the environment has a browser and a database. Their emptiness is a finding
about this run, recorded in
[../test-results/latest/execution-RUN-2026-10-07-001.md](../test-results/latest/execution-RUN-2026-10-07-001.md)
under "What this run did not cover".

## What the API evidence actually contains

One entry per check:

```json
{
  "id": "SMK-13",
  "url": "http://127.0.0.1:3000/api/posts",
  "method": "GET",
  "status": 500,
  "headers": {
    "content-type": "application/json",
    "x-clerk-auth-reason": "dev-browser-missing",
    "x-clerk-auth-status": "signed-out",
    "x-middleware-rewrite": "/api/posts"
  },
  "bodyExcerpt": "{\"error\":\"connect ECONNREFUSED 127.0.0.1:27017\"}",
  "durationMs": 7
}
```

Two things are visible here that no summary would carry:

* `x-clerk-auth-status: signed-out` on an API response that returned data-layer access.
  That single header is the whole of [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md)
  in one line of evidence — Clerk *knew* the caller was signed out, and the route did not ask.
* The driver's own error text reaching the client, which is
  [BUG-013](../bugs/open/BUG-013-api-leaks-internal-errors.md).

`SMK-19` additionally carries a `headerInventory` with all seven security headers `null` —
[BUG-014](../bugs/open/BUG-014-no-security-headers.md).

## No secrets

Placeholder values only. The smoke run used a placeholder `CLERK_SECRET_KEY` and
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`; no Cloudinary credentials were set at all. Nothing in
this directory should ever need redacting, and if a future artefact contains a real
credential, it should be deleted rather than masked.

## Binary artefacts

`.png`, `.jpg`, `.mp4` and `.webm` are gitignored — the repository should not accumulate
megabytes of screenshots. Reference them by run id in a markdown record and keep the files
outside version control, or store only the handful that a specific bug report depends on.
