# BUG-018 — Five runtime dependencies are never imported

| Field | Value |
| --- | --- |
| Bug ID | BUG-018 |
| Title | Five runtime dependencies are never imported |
| Severity | Low |
| Priority | P3 |
| Status | OPEN |
| Feature | infrastructure |
| Requirement | REQ-NF-01 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | `grep -r` across `src/` |
| Reported in | code review |
| Test | none |
| Evidence | Zero import matches in `src/` for any of the five |
| Fix | Remove them from `dependencies` |
| Regression test | Add a `depcheck` script, or leave it — this is hygiene |

## Observed behaviour

Five packages are declared as runtime dependencies and imported nowhere in `src/`:

| Package | Imports in `src/` |
| --- | --- |
| `@reduxjs/toolkit` | 0 |
| `react-redux` | 0 |
| `firebase` | 0 |
| `firebase-admin` | 0 |
| `validator` | 0 |

## Expected behaviour

`dependencies` lists what the application runs.

## Steps to reproduce

```bash
for p in @reduxjs/toolkit react-redux firebase firebase-admin validator; do
  printf '%s: ' "$p"; grep -rl "$p" src/ | wc -l
done
```

## Root cause

Leftovers from an earlier architecture. `firebase`/`firebase-admin` predate the move to
Clerk and MongoDB — the stale `// Firebase UID` comment in `src/models/Post.js:28`
([BUG-020](BUG-020-stale-firebase-comment.md)) is the same fossil. `validator` was presumably
intended for input validation that was never written.

## Notes

`firebase-admin` is particularly worth removing: it is a large server-side package carrying
service-account credential types, and its presence invites a future contributor to wire it up.

None of these should reach the client bundle — they are server-only or tree-shakeable, and
the build succeeds without importing them. The cost is install time, audit surface and
misleading signal, not page weight. Bundle composition itself is `NOT_EXECUTED` — see
[../../test-scenarios/performance.md](../../test-scenarios/performance.md).
