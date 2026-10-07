# API testing tools

Two layers, deliberately.

## Layer 1 — in-process handler calls (26 checks)

`automation/utilities/request.js` builds real `Request` objects and calls the route
handlers directly. No socket, no server.

```js
import { get, post, put, del, makeRequest, readJson, params, fileFormData }
  from "../utilities/request.js";

const res = await get("/api/posts", params({ status: "inactive" }));
const body = await readJson(res);
```

| Helper | Does |
| --- | --- |
| `get(path, query)` | `GET` with an optional `URLSearchParams` |
| `post(path, body)` | `POST` JSON; pass a string to send raw text (used for malformed-JSON cases) |
| `put(path, body)` | `PUT` JSON |
| `del(path)` | `DELETE` |
| `makeRequest(path, init)` | Escape hatch; everything above is built on it |
| `readJson(res)` | `res.json()` with a readable failure message |
| `params(obj)` | `URLSearchParams`, skipping `undefined` values |
| `fileFormData({name, type, content})` | A real multipart body for the upload route |

Base URL is `http://harness.local` — a placeholder that never resolves, so a test that
accidentally performs real network I/O fails loudly instead of quietly succeeding.

**Every file that uses this must start with `// @vitest-environment node`.** Under jsdom,
`await request.formData()` hangs indefinitely — the request never settles and Vitest waits
forever. This cost a debugging session; do not remove the pragma.

## Layer 2 — live smoke (20 checks)

`automation/scripts/api-smoke.mjs` fires real HTTP at a running `next start`. Zero
dependencies: Node's built-in `fetch`, `FormData` and `URL`.

```bash
HARNESS_RUN_ID=RUN-2026-10-07-001 node harness/automation/scripts/api-smoke.mjs
```

| Setting | Default | Effect |
| --- | --- | --- |
| `HARNESS_BASE_URL` | `http://127.0.0.1:3000` | Where to point |
| `HARNESS_RUN_ID` | a generated id | Names the evidence file |

Outputs, both overwritten on every run:

* `test-results/latest/smoke-result.json` — per-check id, method, URL, status, duration,
  and a `documentsDefect` field on the checks that assert broken behaviour
* `evidence/api-responses/smoke-<RUN-ID>.json` — the same plus every response header and a
  body excerpt

Exit code equals the number of failed checks, so it works directly as a CI gate.

### Two traps found while writing it

1. **`new FormData(iterable)` throws.** The constructor rejects an iterable argument; use
   `new FormData()` then `.append()`. This produced a `BLOCKED` result before it was fixed.
2. **A body-less `POST` does not reach the 400 branch.** With no `content-type`,
   `request.formData()` throws first and the route answers 500. To exercise `400 No file
   provided` you must send a genuine — possibly empty — multipart body. Both outcomes are
   now separate checks: `SMK-17` and `SMK-20`.

## What neither layer covers

Real MongoDB, real Cloudinary, real Clerk. See [../database/README.md](../database/README.md)
and [../../test-scenarios/integration.md](../../test-scenarios/integration.md).
