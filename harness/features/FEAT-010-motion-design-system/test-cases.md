# FEAT-010 · Test cases — index

**No cases exist.** This is the deliberate, documented gap: motion outcomes need a real
layout engine, and none is available in this environment (see
[../../TESTING_STRATEGY.md](../../TESTING_STRATEGY.md) §What is explicitly out of scope).

Two cases *should* exist and can be written without a browser:

| Proposed ID | Target | Effort |
| --- | --- | --- |
| TC-UI-038 | `splitWords` — splits on whitespace, drops empties, flags `last`, returns `[]` for `''`/`null` | ~10 lines |
| TC-UI-039 | `MOTION` matches the documented vocabulary | ~5 lines |

Both belong in a new `harness/automation/ui/motion-utils.test.js` (jsdom, no mocks needed).
