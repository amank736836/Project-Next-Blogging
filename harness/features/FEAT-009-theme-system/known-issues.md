# FEAT-009 · Known issues

None filed. This is the only feature in the inventory with no open defect.

## Unfiled observations

* **`components/ThemeBtn.jsx` is at 2.15% line coverage.** The context is well tested; the
  button that drives it is not.
* **The pre-paint script is untested.** It is a template string in `app/layout.js` and
  nothing in the harness executes it. A regression there would reintroduce a white flash
  on every dark visit and no test would notice.
* Uncovered lines in `theme-context.js` are `55` (the `catch` around `localStorage.setItem`)
  and `69-70` (the OS-preference change listener) — both need a browser to reach.
