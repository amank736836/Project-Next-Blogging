# UI testing tools

jsdom + Testing Library, with four hand-written mocks. `src/` is never modified for a test.

## The global setup

`automation/utilities/setup.js` runs before every file:

* registers `@testing-library/jest-dom` matchers
* installs the environment variables the application reads at import time
* installs DOM stubs, guarded behind `const hasDom` so node-environment files can share the
  file without crashing
* **`matchMedia` reports `prefers-reduced-motion` as matching**
* `beforeEach` clears `localStorage` and the `dark` class; `afterEach` runs `cleanup()` and
  `vi.restoreAllMocks()`

### Why the reduced-motion stub is load-bearing

The app's `useMotionEffect` builds a GSAP timeline that calls `gsap.registerPlugin(ScrollTrigger)`,
which takes focus in jsdom. The result is intermittent: `userEvent.type` landed only 1–6 of
23 characters, and `document.activeElement` became `BODY`. It only failed *after* another
test in the same worker had mounted a motion component — a textbook order dependency.

Reporting reduced motion makes the app's own `usePrefersReducedMotion` skip the GSAP build.
That is the correct fix: it exercises a real code path in the application rather than
stubbing a library. **Do not** solve this by mocking `@/lib/motion` — that was tried and
removed, because it would hide regressions in the very module the suite should be covering.

## The mocks

| File | Replaces | Notes |
| --- | --- | --- |
| `utilities/mocks/tinymce.jsx` | `@tinymce/tinymce-react` | A **stateful** `<textarea data-testid="rte">` that owns its value via `useState`. A controlled-but-stateless stub breaks typing. Exports `FakeEditor` and a named `Editor`. |
| `utilities/mocks/clerk.jsx` | `@clerk/nextjs` | `createClerkMock()`, `setAuth({ isLoaded, isSignedIn, user })`, `resetAuth()`, `makeUser()` |
| `utilities/mocks/next-navigation.js` | `next/navigation` | `createNextNavigationMock()`, `setPathname()`, `getRouterSpy()`, `resetRouter()` |
| `utilities/fake-post-model.js` | nothing — it spies on the real model | `installFakePersistence(Model, seed)`; the store exposes `_all()`, `_count()`, `_reset()` |

### Never mock the model

`vi.mock('@/models/Post', …)` **hangs Vitest forever** when the factory dynamically imports
a module that itself imports `@/models/Post`. The suite spies on the real model's statics
instead. Do not reintroduce that mock.

## Querying gotchas that cost time

* **`getByText` fails on text split across JSX boundaries.** Use a function matcher on
  `element.textContent` with `element.children.length === 0`.
* **`getByRole('link', { name: 'Log in' })` throws "Found multiple elements"** in the
  Header tests, because the desktop and mobile trees both render the label. Use
  `getAllByRole(...)[0]`.
* **`vi.useFakeTimers({ shouldAdvanceTime: false })` deadlocks `userEvent`.** Use
  `shouldAdvanceTime: true` with `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`.
  TC-UI-036 and TC-UI-037 depend on this.

## What jsdom cannot do

No layout, no paint, no real focus ring, no scroll, no CSS cascade. Every accessibility
assertion in this suite is an ARIA *attribute* assertion, which is real and useful — but it
is not the same as a screen-reader pass. Colour contrast, responsive breakpoints and
keyboard focus order all need a browser and are recorded `BLOCKED` in
[../../test-scenarios/ui.md](../../test-scenarios/ui.md).

## Coverage

```bash
npm run test:coverage    # writes test-results/latest/coverage/
```

`src/components/motion/**` and `src/components/demo/**` are **excluded** by
`harness/vitest.config.mjs`, because they are presentational and GSAP-dependent. State that
wherever the 36% figure is quoted.
