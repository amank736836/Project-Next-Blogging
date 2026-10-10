# Resolved bugs

Empty. Nothing has been fixed — this harness was built without modifying `src/`, so every
defect found is still open. See [../README.md](../README.md) for all 21.

When a bug is fixed, move its file here and update four things:

1. **Status** → `RESOLVED`, with the commit that fixed it
2. **The regression test** — invert the assertion, do not delete it. A `TC-SEC-*` test going
   red is the expected signal that its bug was fixed.
3. **The requirement row** in [../../requirements/](../../requirements/README.md) — `VIOLATED`
   becomes `IMPLEMENTED`, with the test that now proves it
4. **The register** in [../README.md](../README.md) — move the row and re-run the counts

Note that **BUG-009 was withdrawn, not resolved**: `TC-EDGE-001` disproved it by execution.
Its number is retired rather than reused, so older references stay traceable. The note lives
in [../README.md](../README.md) §Withdrawn.
