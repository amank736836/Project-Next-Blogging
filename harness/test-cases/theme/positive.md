# Theme system — positive cases

Feature: FEAT-009 · Requirements: REQ-013…04

6 cases in `automation/ui/theme.test.jsx`. `src/hooks/theme-context.js` is at 95.23%; the uncovered lines are the `catch` at `:55` and the OS-preference listener at `:69-70`.

## TC-UI-017 — With nothing stored, the theme starts light

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-017 |
| Title | With nothing stored, the theme starts light |
| Feature | [FEAT-009](../../features/FEAT-009-theme-system/README.md) |
| Requirement | REQ-013 |
| Preconditions | `@vitest-environment jsdom`; `localStorage` and the `dark` class cleared in `beforeEach` by `automation/utilities/setup.js` |
| Test Data | An empty `localStorage` |
| Steps | 1. Render a probe inside `<ThemeProvider>` 2. Assert the context reports `light` 3. Assert `document.documentElement` has no `dark` class 4. Assert `style.colorScheme` is `light` |
| Expected Result | Light everywhere |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/theme.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The provider defaults to light rather than following the OS — see TC-UI-022's note |

## TC-UI-018 — Toggling flips the class, the context, `colorScheme` and storage together

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-018 |
| Title | Toggling flips the class, the context, `colorScheme` and storage together |
| Feature | [FEAT-009](../../features/FEAT-009-theme-system/README.md) |
| Requirement | REQ-013/03 |
| Preconditions | `@vitest-environment jsdom`; `localStorage` and the `dark` class cleared in `beforeEach` by `automation/utilities/setup.js` |
| Test Data | Starting state light |
| Steps | 1. Call `toggleTheme()` 2. Assert the context reads `dark` 3. Assert `documentElement.classList` contains `dark` 4. Assert `style.colorScheme` is `dark` 5. Assert `localStorage['themeMode']` is `dark` |
| Expected Result | All four in agreement |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/theme.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | Four separate sinks; a regression in any one of them leaves the UI inconsistent |

## TC-UI-019 — A second toggle returns to light and persists that

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-019 |
| Title | A second toggle returns to light and persists that |
| Feature | [FEAT-009](../../features/FEAT-009-theme-system/README.md) |
| Requirement | REQ-013 |
| Preconditions | `@vitest-environment jsdom`; `localStorage` and the `dark` class cleared in `beforeEach` by `automation/utilities/setup.js` |
| Test Data | — |
| Steps | 1. Toggle twice 2. Assert light in all four places |
| Expected Result | Back to light, persisted |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/theme.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-UI-020 — `setTheme` is idempotent

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-020 |
| Title | `setTheme` is idempotent |
| Feature | [FEAT-009](../../features/FEAT-009-theme-system/README.md) |
| Requirement | REQ-013 |
| Preconditions | `@vitest-environment jsdom`; `localStorage` and the `dark` class cleared in `beforeEach` by `automation/utilities/setup.js` |
| Test Data | — |
| Steps | 1. Call `setTheme('dark')` three times 2. Assert `dark` in all four places 3. Assert no drift or duplicated class |
| Expected Result | Stable at `dark` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/theme.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |
