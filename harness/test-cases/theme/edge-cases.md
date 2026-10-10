# Theme system — edge cases

Feature: FEAT-009 · Requirements: REQ-013, REQ-019

## TC-UI-021 — `mounted` is true once hydrated

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-021 |
| Title | `mounted` is true once hydrated |
| Feature | [FEAT-009](../../features/FEAT-009-theme-system/README.md) |
| Requirement | REQ-013, REQ-NF-06 |
| Preconditions | `@vitest-environment jsdom`; `localStorage` and the `dark` class cleared in `beforeEach` by `automation/utilities/setup.js` |
| Test Data | jsdom, which is a browser environment |
| Steps | 1. Render a probe inside the provider 2. Assert `mounted === true` after the effect runs |
| Expected Result | `true` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/theme.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | `mounted` is what suppresses the hydration flash. `ThemeBtn.jsx` consumes it and is at 2.15% coverage — the consumer is untested, the producer is not. |

## TC-UI-022 — `useTheme()` outside a provider degrades instead of throwing

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-022 |
| Title | `useTheme()` outside a provider degrades instead of throwing |
| Feature | [FEAT-009](../../features/FEAT-009-theme-system/README.md) |
| Requirement | REQ-019 |
| Preconditions | `@vitest-environment jsdom`; `localStorage` and the `dark` class cleared in `beforeEach` by `automation/utilities/setup.js` |
| Test Data | No `<ThemeProvider>` in the tree |
| Steps | 1. Render a probe that calls `useTheme()` bare 2. Assert it returns the light default 3. Assert calling `toggleTheme()` does not throw |
| Expected Result | A safe no-op default |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/theme.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The context's default value is a working object, not `undefined` |

## Not executed

| SCN ID | Case | Status | Why |
| --- | --- | --- | --- |
| SCN-EDGE-13 | A corrupt value in `localStorage['themeMode']` | NOT_EXECUTED | The `catch` at `theme-context.js:55` is the uncovered 4.77%. Reading `'not-a-theme'` from storage is a five-line test that would close it. |
| SCN-EDGE-14 | `localStorage` throws (private mode) | NOT_EXECUTED | Same `catch` branch. Needs a throwing storage stub. |
| SCN-THEME-04 | The theme follows an OS preference change | NOT_EXECUTED | `:69-70` registers a `matchMedia` listener. Untested — the harness's `matchMedia` stub returns a static object with no `addEventListener`-driven updates. |
| SCN-THEME-05 | No flash of the wrong theme on first paint | BLOCKED | A pre-paint assertion needs a real browser and a paint trace. The provider's inline script in `app/layout.js` was verified by inspection only. |
