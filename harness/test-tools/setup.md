# Setup

## Install

```bash
npm install          # 613 packages; the harness devDeps are already in package.json
```

Nothing else to install. There is no `postinstall` script and no codegen step.

## The six variables

There is **no `.env.example`** in this repository — that is
[BUG-019](../bugs/open/BUG-019-no-env-example.md). This table is the substitute, and every
entry was derived by observing a real failure, not by reading documentation.

| Variable | Needed for | What happens without it |
| --- | --- | --- |
| `MONGO_URI` | `npm run build`, every `/api/posts*` call | **Build fails.** `src/lib/db.js:6` throws at import time when the variable is absent — [BUG-017](../bugs/open/BUG-017-db-throws-at-import.md). At runtime, API calls return 500 with the driver's message. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `npm run build` | Prerendering fails for the Clerk-wrapped routes |
| `CLERK_SECRET_KEY` | **Every HTTP request** | **Every route returns 500**, including static marketing pages. `clerkMiddleware()` covers all non-asset requests. Verbatim log: [`../evidence/logs/RUN-2026-10-07-001-missing-clerk-secret-key.log`](../evidence/logs/RUN-2026-10-07-001-missing-clerk-secret-key.log) — [BUG-015](../bugs/open/BUG-015-missing-clerk-secret-key-500s-site.md) |
| `CLOUDINARY_CLOUD_NAME` | `POST /api/upload` | The provider call fails and the error is echoed to the client |
| `CLOUDINARY_API_KEY` | `POST /api/upload` | Same |
| `CLOUDINARY_API_SECRET` | `POST /api/upload` | Same |

Optional, with the default observed in source:

| Variable | Default | Effect |
| --- | --- | --- |
| `MONGO_DB` | `blog` (`src/lib/db.js:23`) | Database name |
| `NEXT_PUBLIC_TINYMCE_API_KEY` | none | The editor shows a key-missing notice but still works |

**Never commit real values.** Every example in this harness uses `${VAR}` placeholders.
Placeholder values are sufficient for the Vitest suites and for the smoke run — the smoke
run's entire purpose is to observe what happens when the backing services are absent.

## Running the Vitest suites

```bash
npm test
```

No environment variables are required. `automation/utilities/setup.js` installs the values
the application reads at import time, so the suites are self-contained.

## Running the smoke suite

```bash
# 1. build
MONGO_URI="mongodb://127.0.0.1:27017/harness_smoke?serverSelectionTimeoutMS=1500" \
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<placeholder>" \
  npm run build

# 2. serve — CLERK_SECRET_KEY is mandatory even as a placeholder
MONGO_URI="mongodb://127.0.0.1:27017/harness_smoke?serverSelectionTimeoutMS=1500" \
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<placeholder>" \
CLERK_SECRET_KEY="<placeholder>" \
  npx next start -H 0.0.0.0 -p 3000 &

# 3. smoke
HARNESS_RUN_ID=RUN-2026-10-07-001 node harness/automation/scripts/api-smoke.mjs
echo "exit=$?"      # the number of failed checks
```

Two settings that are easy to get wrong:

* **`serverSelectionTimeoutMS` must be inside the URI.** Without it, each API check blocks
  for ~30 s while the driver retries.
* **`CLERK_SECRET_KEY` must be present**, even as a placeholder, or all 20 checks fail with
  500 and the run tells you nothing.

## Environment used to produce `RUN-2026-10-07-001`

| | |
| --- | --- |
| Node | v22.22.3 |
| npm | 10.9.8 |
| OS | Linux (sandboxed) |
| MongoDB | **not available** |
| Browser | **not available** |
| Clerk tenant | **not available** |
| Cloudinary account | **not available** |

Those four absences are the reason for every `BLOCKED` in
[../test-scenarios/](../test-scenarios/README.md). They are environmental, not effort — and
they are the first thing to remove when this harness is picked up elsewhere.
