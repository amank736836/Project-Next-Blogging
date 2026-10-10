# Smoke scenarios

Run these first. If any fails, stop and fix before doing anything else.
All 20 are automated in
[../automation/scripts/api-smoke.mjs](../automation/scripts/api-smoke.mjs) and were executed
in [../test-results/latest/execution-RUN-2026-10-07-001.md](../test-results/latest/execution-RUN-2026-10-07-001.md).

| SCN ID | Scenario | Expected | Status |
| --- | --- | --- | --- |
| SCN-SMOKE-01 | The production build completes. | `npm run build` exits 0 | AUTOMATED — `SMK` prerequisite; verified |
| SCN-SMOKE-02 | The server starts and answers. | `next start` → `✓ Ready` | AUTOMATED — verified |
| SCN-SMOKE-03 | `GET /` renders the landing shell. | 200, `text/html` | AUTOMATED — `SMK-01` |
| SCN-SMOKE-04 | `GET /demo` renders without a database. | 200 | AUTOMATED — `SMK-02` |
| SCN-SMOKE-05 | `GET /features`, `/pricing`, `/contact`, `/privacy`, `/terms` render. | 200 each | AUTOMATED — `SMK-03`…`SMK-07` |
| SCN-SMOKE-06 | `GET /login` and `/signup` render. | 200 each | AUTOMATED — `SMK-08`, `SMK-09` |
| SCN-SMOKE-07 | `GET /all-posts` and `/add-post` are server-renderable. | 200 each | AUTOMATED — `SMK-10`, `SMK-11` |
| SCN-SMOKE-08 | An unknown route is a 404. | 404 | AUTOMATED — `SMK-12` |
| SCN-SMOKE-09 | `GET /api/posts` responds with JSON. | 200 with a DB; 500 without one | AUTOMATED — `SMK-13` |
| SCN-SMOKE-10 | `POST /api/upload` with an empty form is a client error. | 400 | AUTOMATED — `SMK-17` |
| SCN-SMOKE-11 | `npm run lint` is clean. | 0 errors, 0 warnings | AUTOMATED — verified |
| SCN-SMOKE-12 | `npm test` is green. | 92 passed | AUTOMATED — verified |

## Reading the results honestly

Checks `SMK-13`…`SMK-16`, `SMK-18`, `SMK-19` and `SMK-20` **assert defective behaviour** on
purpose. A green smoke run therefore means "the server did what the code says it does",
not "the server is healthy". Each of those checks carries a `documentsDefect` field naming
the bug it proves; when the bug is fixed the check fails and must be inverted.

## Running it

```bash
npm run test:smoke
# or against another environment
HARNESS_BASE_URL=https://staging.example.test npm run test:smoke
```
