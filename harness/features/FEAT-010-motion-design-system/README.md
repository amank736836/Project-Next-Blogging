# FEAT-010 · Motion & design system

```text
Feature:        One animation vocabulary and one token layer for the whole site.
Purpose:        Every component moves the same way, and honours reduced motion in exactly
                one place.
User:           Everyone, indirectly.
Entry Point:    src/lib/motion.js (the only GSAP importer); components/motion/*.
Dependencies:   gsap ^3.15.0 + ScrollTrigger; the token layer in src/app/globals.css;
                three @fontsource-variable font families.
Inputs:         Scroll position, pointer position, viewport intersection, and the
                prefers-reduced-motion media query.
Outputs:        Tweens, scroll progress, in-view flags, count-ups, pointer CSS variables.
Business Rules: REQ-NF-06 — reduced motion disables every animation and hides nothing.
Expected Behavior:
                - gsapOnce() registers ScrollTrigger once, lazily, browser-only.
                - useMotionEffect scopes every tween to a gsap.context() reverted on
                  unmount, so a route change never leaks a ScrollTrigger.
                - build() never runs when reduced motion is requested.
                - useScrollInfo / ScrollProgress drive the reading and page bars.
                - DrawSvg self-draws any path/line/circle it contains.
Error Handling: gsapOnce() returns null off the browser; callers bail out.
Permissions:    Public.
Related APIs:   None.
Related Database Tables: None.
Related UI:     lib/motion.js, components/motion/{Reveal,SplitHeadline,Effects,index},
                components/ui/{Ambient,ScrollProgress}.jsx, app/globals.css.
Existing Tests: No direct tests. Exercised indirectly: the entire DOM suite runs with
                reduced motion on, which is the `reduced === true` branch of
                useMotionEffect. lib/motion.js is at 45.36% line coverage as a side effect
                of components importing it.
Missing Tests:  splitWords() — a pure exported function that is trivially testable and is
                not tested. MOTION constants. gsapOnce() idempotence.
                useCountUp, useInView, useMagnetic, usePointerVars, useScrollInfo — all
                need a real layout engine.
                Every visual outcome: parallax depth, tilt, marquee speed, reveal stagger.
Known Issues:   None filed.
Status:         IMPLEMENTED — UNTESTED, and largely untestable without a browser.
```

## The reduced-motion contract

`usePrefersReducedMotion()` is described in the source as "the single source of truth for
motion permission". `useMotionEffect` reads it and returns early:

```js
useIsoLayoutEffect(() => {
  const node = ref.current;
  if (!node || reduced || !build) return;      // ← nothing is built, nothing is hidden
  …
}, [reduced, ...deps]);
```

This is why the harness can run the whole DOM suite in reduced-motion mode without hiding
content from the tests: with `reduced === true` the components render their children
untouched.

## Pure functions that are testable today and are not tested

```js
splitWords('one two  three')
// → [{ word: 'one', chars: ['o','n','e'], last: false },
//    { word: 'two', chars: ['t','w','o'], last: false },
//    { word: 'three', chars: [...], last: true }]
splitWords('')      // → []
splitWords(null)    // → []
```

`src/lib/motion.js:108-115`. A five-line test file would cover it. See
[../../test-scenarios/ui.md](../../test-scenarios/ui.md) `SCN-UI-39`.
