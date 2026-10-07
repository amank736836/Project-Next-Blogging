# FEAT-009 · Theme system

```text
Feature:        Light/dark theme with no flash and no duplicate state.
Purpose:        Semantic surface tokens swapped by one class on <html>, so a component
                written once works in both themes.
User:           Everyone.
Entry Point:    ThemeBtn in the header; state via useTheme().
Dependencies:   src/hooks/theme-context.js (useSyncExternalStore), the inline script in
                src/app/layout.js, the token layer in src/app/globals.css.
Inputs:         A click on ThemeBtn, an OS preference change, or a `storage` event from
                another tab.
Outputs:        `document.documentElement.classList` gains/loses `dark`,
                `style.colorScheme` follows, and `localStorage.themeMode` is written.
Business Rules: BR-14 (follow the OS only until the visitor chooses).
Expected Behavior:
                - Before first paint the inline script reads localStorage.themeMode, or
                  falls back to prefers-color-scheme, and paints it. No white flash.
                - useSyncExternalStore mirrors the class on <html>; there is no second
                  source of truth and no effect that has to sync it back.
                - A storage event from another tab updates every subscriber.
                - While no explicit choice exists, an OS preference change is followed live.
Error Handling: localStorage access is wrapped in try/catch — private browsing still gets
                the theme for the session.
Permissions:    Public.
Related APIs:   None.
Related Database Tables: None.
Related UI:     hooks/theme-context.js, components/ThemeBtn.jsx, app/globals.css,
                the themeInit script in app/layout.js.
Existing Tests: TC-UI-017, TC-UI-018, TC-UI-019, TC-UI-020, TC-UI-021, TC-UI-022 —
                6 cases; 95.23% line coverage of theme-context.js.
Missing Tests:  ThemeBtn itself (2.15% coverage) — its icon swap and aria label.
                Cross-tab synchronisation via a `storage` event.
                Following a live OS preference change.
                The inline pre-paint script (it is a string in layout.js and is not
                executed by any test).
Known Issues:   None.
Status:         IMPLEMENTED — well tested at the context level.
```

## Why `useSyncExternalStore`

The comment in the source states the intent plainly: theme state lives on `<html>`, painted
by an inline script before first frame, and `useSyncExternalStore` mirrors that single
source of truth — "so there is no flash, no duplicate state and no effect that has to
'sync' a value back from the DOM."

The server snapshot is `'light'` and `mounted` is `false` on the server, `true` in the
browser. `TC-UI-021` covers the browser half; the server half is only reachable in a real
SSR render, which the harness does not perform.

## Harness interaction

The whole DOM suite runs with `prefers-reduced-motion: reduce` reporting `true` (see
[../../TESTING_STRATEGY.md](../../TESTING_STRATEGY.md) §Environment strategy). That stub
also reports `false` for `prefers-color-scheme: dark`, so every test starts in light mode
— which is what `TC-UI-017` asserts.
