# Resolved bugs

Two entries. Both were found by executing the application rather than by reading it.

| ID | Summary | Severity | Test |
| --- | --- | --- | --- |
| [BUG-023](BUG-023-blank-footer-after-navigation.md) | Scroll triggers keep the previous page's offsets, so the footer's contents never paint | Major | TC-UI-038…041 |
| [BUG-024](BUG-024-react-dom-version-mismatch.md) | `react-dom` was pinned one minor below `react`, so no test file could load | Medium | the suite itself |

Everything else in [../README.md](../README.md) is still open. When a bug is fixed, move its
file here and update four things:

1. **Status** → `RESOLVED`, with the commit that fixed it
2. **The regression test** — invert the assertion, do not delete it. A `TC-SEC-*` test going
   red is the expected signal that its bug was fixed.
3. **The requirement row** in [../../requirements/](../../requirements/README.md) — `VIOLATED`
   becomes `IMPLEMENTED`, with the test that now proves it
4. **The register** in [../README.md](../README.md) — move the row and re-run the counts

Note that **BUG-009 was withdrawn, not resolved**: `TC-EDGE-001` disproved it by execution.
Its number is retired rather than reused, so older references stay traceable. The note lives
in [../README.md](../README.md) §Withdrawn.

## A note on BUG-023's evidence

It is the first bug in this harness with browser evidence. `.png` under
`harness/evidence/**` is gitignored, so the measurements are inlined in the bug file as
numbers — document height, trigger start/end, how many blocks stayed at `opacity: 0`. The
reproduction is four steps and needs nothing but a dev server and a desktop width; the
probe used is described in [../../evidence/screenshots/README.md](../../evidence/screenshots/README.md).
