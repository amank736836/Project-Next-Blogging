# Reports

Five documents, all derived from `RUN-2026-10-07-001`. Nothing here is a plan or an
intention — every number traces back to a result file or to a line of source.

| Report | Question it answers | Verdict |
| --- | --- | --- |
| [coverage.md](coverage.md) | How much of the application is exercised, and at what depth? | 36.26% lines, 61.01% functions, 82.77% branches — across the tested slice only |
| [traceability.md](traceability.md) | Does every requirement reach a test, and every test reach a requirement? | 22 of 41 requirements traced to an executed check |
| [regression-report.md](regression-report.md) | What did this run change, and what did it break? | Nothing broken; 92/92 and 20/20 green |
| [release-readiness.md](release-readiness.md) | Should this ship? | **NOT READY** |

## Read the verdict, not the pass rate

112 of 112 checks pass. That number is misleading on its own, because sixteen of those
checks pass *by asserting that a protection is missing*:

* Seven Vitest cases — `TC-SEC-002`…`TC-SEC-008` — prove an unauthenticated caller can read,
  overwrite or delete anyone's data, and that any MIME type is accepted on upload.
* Seven smoke checks — `SMK-13`, `SMK-14`, `SMK-15`, `SMK-16`, `SMK-18`, `SMK-19`, `SMK-20` —
  prove the same thing over a real socket, plus that no security headers are sent.
* Two more — `TC-UI-012` and `TC-NEG-010` — prove the contact form sends nothing and the
  slug field destroys its own input.

They are written that way deliberately: fixing the bug turns the test red, which forces the
assertion to be rewritten rather than deleted.

## How these reports are produced

`coverage.md` and `traceability.md` are generated from the JSON result files — re-running the
suites and re-running the generator keeps them honest by construction. The other three are
written, but every figure in them is copied from a file rather than recalled.

`coverage/` itself is gitignored; regenerate it with `npm run test:coverage`.

## Reproducing this run

```bash
bash harness/automation/scripts/run-all.sh
```

That runs lint, the Vitest suite, coverage, and — if a server is reachable — the smoke
checks. See [../test-tools/setup.md](../test-tools/setup.md) for the environment variables
it needs.
