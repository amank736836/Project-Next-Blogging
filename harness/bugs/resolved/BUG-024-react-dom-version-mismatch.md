# BUG-024 — `react` and `react-dom` are pinned to different versions, so the whole test suite fails to load

| Field | Value |
| --- | --- |
| Bug ID | BUG-024 |
| Title | `react@19.3.0` is paired with `react-dom@19.2.3`; React refuses to boot, and every Vitest file dies on import |
| Severity | Medium (no effect on the shipped app; the entire automated suite is dead) |
| Priority | P1 for the suite |
| Status | RESOLVED |
| Feature | infrastructure |
| Requirement | — |
| Reproducible | ALWAYS (executed) |
| Environment | `npm test` on a clean `npm install`, Node 22.22.3 |
| Reported in | found while validating BUG-023 |
| Test | any test file — none of them could load |
| Evidence | the error below, verbatim |
| Fix | `npm install --save-exact react-dom@19.3.0` |
| Regression test | the suite itself: 12 files, 115 cases |

## Observed behaviour

A clean install followed by `npm test` fails before a single assertion runs:

```
Error: Incompatible React versions: The "react" and "react-dom" packages must
have the exact same version. Instead got:
  - react:      19.3.0
  - react-dom:  19.2.3
  ❯ node_modules/react-dom/cjs/react-dom-client.development.js:27935:15
```

Every one of the 12 test files reports `Tests no tests` — the failure is at import
time, in `react-dom`, which Testing Library pulls in. The suite that
[../../TESTING_STATUS.md](../../TESTING_STATUS.md) records as 92/92 passing could
not be executed at all on this checkout.

## Steps to reproduce

```bash
npm install
npm test
```

## Root cause

`package.json` and `package-lock.json` pin `react` at `19.3.0` and `react-dom` at
`19.2.3`. `react` was bumped by Dependabot (`build(deps): bump react from 19.2.3
to 19.3.0`, commit `40b868c`) without the matching `react-dom` bump. React treats
a minor mismatch between the two packages as fatal in development builds, which
is where the suite runs.

## Expected behaviour

`npm test` runs the suite.

## Fix

```bash
npm install --save-exact react-dom@19.3.0
```

Both packages now resolve to `19.3.0`. `react-dom` is a direct dependency of this
project, so it has to move with `react` whenever Dependabot bumps it — worth
adding to the dependabot grouping rule (`.github/dependabot.yml`) rather than
relying on the next person to notice.

## Notes

Found because BUG-023 needed a regression test. It is filed rather than folded
into that fix because it is unrelated to it — the same failure would have hit
anyone who touched the suite.
