# FEAT-010 · Known issues

None filed.

## Unfiled observations

* **`src/components/motion/**` and `src/components/demo/**` are excluded from coverage**
  in `harness/vitest.config.mjs`. That was a deliberate choice — they are presentational
  wrappers whose behaviour cannot be asserted in jsdom — but it means the coverage number
  in [../../reports/coverage.md](../../reports/coverage.md) is measured over the rest of
  `src/` only. Stated here so the number is not over-read.
* **`src/components/ui/Ambient.jsx` is at 0%.** It renders three drifting light fields, a
  grid and film grain, and is mounted globally in `app/layout.js`.
* **The GSAP/jsdom interaction is a real hazard for future test authors.** GSAP's ticker
  takes focus away from the element under test, which silently truncates `userEvent`
  typing. Measured: 23 characters typed, 1–6 landed. The mitigation is the global
  reduced-motion stub in `automation/utilities/setup.js`. If you write a test that needs
  motion enabled, expect this and budget for it.
