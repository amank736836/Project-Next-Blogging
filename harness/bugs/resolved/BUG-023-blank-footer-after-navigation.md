# BUG-023 — Scroll triggers keep the previous page's offsets, so the footer renders blank

| Field | Value |
| --- | --- |
| Bug ID | BUG-023 |
| Title | The footer renders as blank space on every interior page reached by a route change |
| Severity | Major |
| Priority | P1 (it is the whole footer, on most of the site) |
| Status | RESOLVED |
| Feature | [FEAT-010](../../features/FEAT-010-motion-design-system/README.md) — the defect is in the motion layer; the symptom lands on [FEAT-007](../../features/FEAT-007-marketing-pages/README.md) pages |
| Requirement | REQ-030 (added with this fix) — **VIOLATED** before it |
| Reproducible | ALWAYS (browser-verified, headless Chromium 153, 1568 × 946) |
| Environment | `next dev` (16.4.0) + headless Chromium; GSAP 3.15.0 |
| Reported in | user report — *"fix the blank space"*, with screenshots of `/contact`, `/pricing`, `/features` |
| Test | TC-UI-038, TC-UI-039, TC-UI-040, TC-UI-041 |
| Evidence | Measured numbers below; the screenshot pair is in the session workspace (`.png` is gitignored under `harness/evidence/**` by design) |
| Fix | `src/lib/motion.js` — `useScrollTriggerRefresh(deps)`; `src/components/ui/PageShell.jsx` passes the pathname |
| Regression test | [../../automation/ui/scroll-trigger-refresh.test.jsx](../../automation/ui/scroll-trigger-refresh.test.jsx) |

## Observed behaviour

Open almost any page that is not the home page and the footer is missing its
contents — the brand block, the tagline and all three link columns are there in
the DOM but never painted. What a reader sees is a band of empty page roughly
870 px tall with only the hairline and the "back to top" row at the bottom of it.

Measured on `/features` (viewport 1568 × 946), reached by clicking **Features**
in the header and then scrolling to the end of the page:

| | BUG-023 reproduced |
| --- | --- |
| Document height | 4402 px |
| Footer occupies | 3484 → 4402 px |
| Footer blocks painted | brand block `opacity: 0`, 3 × link columns `opacity: 0` |
| Footer blocks invisible | **20 of 20** (heading + list + links) |

The same thing happens on `/contact`, `/pricing`, `/terms`, `/privacy`,
`/all-posts`, `/demo`, `/post/*` — every page, because the footer is mounted once
in `src/app/layout.js` and never re-renders.

## Expected behaviour

The footer's reveal plays the first time it comes into view, on every page.

## Steps to reproduce

1. `npm run dev`, open `/` at a desktop width.
2. Click **Contact**, **Pricing** or **Features** in the header.
3. Scroll to the end of the page.
4. The footer's brand block and link columns are invisible. Reload the page and
   they appear — so it only reproduces after a client-side navigation.

## Root cause

`ScrollTrigger` measures and caches each trigger's `start`/`end` when the trigger
is created. Nothing re-measures on a route change: `ScrollTrigger.refresh()` runs
on window resize and on `load` only, and `_refreshAll()` bails out entirely while
the user is scrolling —

```js
// node_modules/gsap/ScrollTrigger.js:484
if (_lastScrollTime && !force && !_isReverted) {
  _addListener(ScrollTrigger, "scrollEnd", _softRefresh);
  return;
}
```

The footer's triggers are created on the **first** page of the session
(`Footer.jsx:53-64`, the wordmark animation) and are still alive after the App
Router swaps the page underneath them, holding the *previous* page's offsets.
`Reveal` on the footer's link columns (`Footer.jsx:101-119`) is created when the
footer first mounts — that one at least re-measures when its context is rebuilt,
but the `once: true` tween it owns is set up with the same stale coordinates
during the frame in which the page swaps.

Because the offsets are stale, they point past the end of the shorter page. Read
with an instrumented build, on `/pricing` (document 2471 px, maximum scroll
1714 px) after a client-side navigation:

```
footer wordmark trigger   start 3927   end 4917   real element top 1618
footer link columns       start 3927   end 4917   real element top 1618
```

`start` is 3927 px on a page whose furthest scroll is 1714 px, so the trigger can
never activate, the reveal never plays, and the targets stay at the values GSAP
set in the `from()` call — `opacity: 0`. `ScrollTrigger.getAll()` reports them as
`isActive: false, progress: 0` even with the page scrolled to the very bottom.

A trigger is only re-measured by `ScrollTrigger.refresh()`. Forcing one by hand
puts the same triggers at `start 993, end 1984` and the footer paints immediately,
which is what identified the cause.

## Fix

`useScrollTriggerRefresh` now:

* re-measures on mount **and on every `deps` change** — `PageShell` passes the
  pathname, so a route change re-measures the triggers the page did not own;
* re-measures whenever the document height actually moves, via a
  `ResizeObserver` on `<html>` — this also catches async rows, images and fonts;
* kills triggers whose element has left the document, so a removed route stops
  contributing its offsets to everybody else's;
* still re-measures once fonts and the `load` event have settled, as before.

```js
// src/components/ui/PageShell.jsx
useScrollTriggerRefresh([pathname]);
```

After the fix the same measured triggers read `start 993, end 1984` on `/pricing`
and the footer paints on every route, however it was reached.

## Notes

* **The stale numbers were not the only trigger.** The same blank band appears
  when a reader jumps to the end of a long page faster than GSAP's `once: true`
  ScrollTriggers can fire (for example `/features`: 7 of 27 blocks left hidden by
  a single jump). That is the same class of defect — a reveal that depends on
  scroll arrival rather than on being in the document — and it is why the
  regression test asserts the *re-measurement contract* rather than one route.
  A stricter option is to drop the scroll condition (and `once`) on reveals whose
  trigger sits within one viewport of the document end; that would need a product
  decision, so it is recorded here rather than done silently.
* The header's `data-head-item` intro (`Header.jsx:62-70`) has the same
  fire-once-on-the-first-page shape, but it is a visible element on every route,
  so its worst case is a missing slide-in, not missing content.

## Related

`src/components/motion/**` is excluded from coverage in
[`harness/vitest.config.mjs`](../../vitest.config.mjs), so nothing in the suite
could have caught this. The new test covers the hook that owns the fix —
`src/lib/motion.js` — and runs with GSAP mocked, so it still needs the browser
run above for the end-to-end claim.
