# FEAT-010 · Known issues

| Bug | Severity | Summary |
| --- | --- | --- |
| [BUG-023](../../bugs/resolved/BUG-023-blank-footer-after-navigation.md) — **resolved** | Major | `ScrollTrigger` caches each trigger's `start`/`end` when it is created, and nothing re-measures on an App Router navigation. The footer's triggers, created on the first page of a session, kept those stale offsets, pointed past the end of every shorter page, never activated — so the footer's brand block and three link columns sat at `opacity: 0` on `/contact`, `/pricing`, `/features`, `/terms`, `/privacy`, `/all-posts` and `/post/*`. Fixed by `useScrollTriggerRefresh([pathname])` in `src/lib/motion.js` + `PageShell.jsx`. |

## Unfiled observations

* **`src/components/motion/**` and `src/components/demo/**` are excluded from coverage**
  in `harness/vitest.config.mjs`. That was a deliberate choice — they are presentational
  wrappers whose behaviour cannot be asserted in jsdom — but it means the coverage number
  in [../../reports/coverage.md](../../reports/coverage.md) is measured over the rest of
  `src/` only. Stated here so the number is not over-read.
* **`src/components/ui/Ambient.jsx` is at 0%.** It renders three drifting light fields, a
  grid and film grain, and is mounted globally in `app/layout.js`.
* **`once: true` reveals near the end of a document can be missed entirely.** If a reader
  reaches the bottom of a long page before GSAP has fired the trigger (a fast flick, a jump
  to `#anchor`, a restored scroll position), the reveal never plays and the content stays
  hidden. BUG-023's fix re-measures offsets, which removes the stale-coordinate cause, but
  not this one: on `/features` a single jump to the end still leaves 7 of 27 revealed blocks
  opaque at `opacity: 0` (measured in headless Chromium). They are link affordances that
  only appear on hover, so nothing is lost to a reader today — but any future reveal that
  *matters* should not be a `once` scroll trigger.
* **The GSAP/jsdom interaction is a real hazard for future test authors.** GSAP's ticker
  takes focus away from the element under test, which silently truncates `userEvent`
  typing. Measured: 23 characters typed, 1–6 landed. The mitigation is the global
  reduced-motion stub in `automation/utilities/setup.js`. If you write a test that needs
  motion enabled, expect this and budget for it.
