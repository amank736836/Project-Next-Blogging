# BUG-017 — `db.js` throws at import without `MONGO_URI`, so the build fails

| Field | Value |
| --- | --- |
| Bug ID | BUG-017 |
| Title | `db.js` throws at import without `MONGO_URI`, so the build fails |
| Severity | Medium |
| Priority | P3 |
| Status | RESOLVED |
| Feature | infrastructure |
| Requirement | REQ-NF-01 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | `npm run build` with `MONGO_URI` unset |
| Reported in | build verification |
| Test | none |
| Evidence | `src/lib/db.js:5-7`; build fails with `Please define the MONGO_URI environment variable inside .env.local` |
| Fix | Move the check inside `dbConnect()`, or into an instrumentation hook that runs at boot |
| Regression test | Add a case asserting the module imports cleanly without the variable |

## Observed behaviour

`npm run build` fails outright when `MONGO_URI` is unset. The message is clear, but the
*timing* is wrong: a module-level throw executes during import, which happens while Next.js
collects the route graph — long before any request could use a database.

## Expected behaviour

The build succeeds. The connection is attempted on first use, and fails there.

## Steps to reproduce

```bash
env -u MONGO_URI npm run build   # fails during route collection
```

## Root cause

`src/lib/db.js:3-7`:

```js
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}
```

Module scope. Every file that imports `Post` transitively imports `db.js`, so the whole
route graph fails to collect.

## Notes

The consequence for tooling is concrete: **the harness cannot run `npm run build` without a
`MONGO_URI`**, even a bogus one. Every build and smoke run in this project passes a
placeholder — see [../../test-tools/setup.md](../../test-tools/setup.md).

Also note the message references `.env.local`, and the repository ships no `.env.example`
([BUG-019](BUG-019-no-env-example.md)). A new contributor gets a pointer to a file that does
not exist and no list of what should be in it.

Fail-fast is a defensible instinct; the fix is to fail at *boot* rather than at *import*, so
the build stays usable for linting, type-checking and static analysis.
