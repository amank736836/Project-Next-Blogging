# Test results

What actually happened when the suites ran. This directory is separated from
[../test-scenarios/](../test-scenarios/README.md) and [../test-cases/](../test-cases/README.md)
on purpose: those say what *should* happen, this says what *did*.

## Layout

```
test-results/
├── latest/       the most recent run — overwritten in place
│   ├── execution-RUN-2026-10-07-001.md   the human-readable record
│   ├── vitest-results.json               machine output, JSON reporter
│   ├── smoke-result.json                 per-check status and timing
│   └── coverage/                         generated, gitignored (~95 files, 1.5 MB)
├── historical/   nothing yet — there has been exactly one run
└── summaries/    cross-run rollups — nothing yet, for the same reason
```

`latest/` is a moving target. `historical/` and `summaries/` stay empty until a second run
exists to compare against; creating placeholder files in them would be noise.

## The one run so far

| Run | Date | Vitest | Smoke | Verdict |
| --- | --- | --- | --- | --- |
| [`RUN-2026-10-07-001`](latest/execution-RUN-2026-10-07-001.md) | 2026-10-07 | 92/92, exit 0 | 20/20, exit 0 | **NOT READY** |

Full record: [latest/execution-RUN-2026-10-07-001.md](latest/execution-RUN-2026-10-07-001.md).

**Read the verdict alongside the pass rate.** 112/112 passing is not a green light. Sixteen
of those checks pass because they assert that a protection is *absent*, and each is wired
to a bug ID. [../reports/release-readiness.md](../reports/release-readiness.md) explains the
reasoning; the answer is NOT READY.

## Machine-readable outputs

### `latest/vitest-results.json`

Written by the `json` reporter configured in `../vitest.config.mjs`.

| Field | Value at this run |
| --- | --- |
| `numTotalTestSuites` / `numPassedTestSuites` | 31 / 31 |
| `numTotalTests` / `numPassedTests` / `numFailedTests` | 92 / 92 / 0 |
| `success` | `true` |
| `testResults[].assertionResults[].title` | begins with the TC ID — this is the traceability link |

Suite count is 31 rather than 10 because Vitest counts each nested `describe` as a suite.
Ten *files* produced 92 checks.

### `latest/smoke-result.json`

Written by `../automation/scripts/api-smoke.mjs`.

| Field | Meaning |
| --- | --- |
| `summary.{total,passed,failed,blocked,passRate}` | 20 / 20 / 0 / 0 / `100%` |
| `results[].status2` | `PASS` or `FAIL` — **note the name**; `status` is the HTTP code |
| `results[].documentsDefect` | The bug ID when a check asserts defective behaviour, else `null` |
| `results[].failures` | Per-assertion failure messages; empty on every check at this run |
| `results[].headerInventory` | Only on `SMK-19`; all seven security headers `null` |

Seven checks carry a `documentsDefect`, verified by reading the field back out of the JSON:

| Check | Bug |
| --- | --- |
| `SMK-13`, `SMK-14` | [BUG-013](../bugs/open/BUG-013-api-leaks-internal-errors.md) |
| `SMK-15`, `SMK-16`, `SMK-18` | [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) |
| `SMK-19` | [BUG-014](../bugs/open/BUG-014-no-security-headers.md) |
| `SMK-20` | [BUG-016](../bugs/open/BUG-016-upload-non-multipart-500.md) |

`SMK-17` asserts genuinely correct behaviour — `400 No file provided` — so it carries no
bug id. The finding there is the *absence* of a `401`, which the check does not assert.

Nine Vitest checks carry a bug tag in their title: `TC-SEC-002`…`TC-SEC-008`,
`TC-UI-012` and `TC-NEG-010`. Seven plus nine is the sixteen referred to above.

## What is gitignored

`latest/coverage/` and binary evidence (`.png`, `.jpg`, `.mp4`, `.webm`) are in
`.gitignore`. Coverage is reproducible from `npm run test:coverage` in about ten seconds,
and the HTML reporter emits ~95 files. Everything else here — the JSON and the markdown
records — is committed, because it is the evidence.

## Running a new one

```bash
npm test                                  # rewrites latest/vitest-results.json
npm run test:coverage                     # rewrites latest/coverage/
node harness/automation/scripts/api-smoke.mjs   # rewrites latest/smoke-result.json
```

Then copy `latest/execution-RUN-*.md` into `historical/` before the next run overwrites it,
and add a row to the table above. `HARNESS_RUN_ID` controls the run id and the evidence
filename.
