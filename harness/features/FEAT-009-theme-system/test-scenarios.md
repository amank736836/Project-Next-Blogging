# FEAT-009 · Test scenarios

| SCN ID | Type | Scenario | Automated? | Test case |
| --- | --- | --- | --- | --- |
| SCN-TH-01 | Functional | With nothing stored, the app starts in light mode. | Yes | TC-UI-017 |
| SCN-TH-02 | Functional | Toggling flips the `<html>` class, the context value, `colorScheme` and `localStorage` together. | Yes | TC-UI-018 |
| SCN-TH-03 | Functional | Toggling twice returns to light and persists that. | Yes | TC-UI-019 |
| SCN-TH-04 | Edge | `setTheme('dark')` is idempotent — repeated calls do not drift. | Yes | TC-UI-020 |
| SCN-TH-05 | Functional | `mounted` is true once hydrated. | Yes | TC-UI-021 |
| SCN-TH-06 | Edge | `useTheme()` outside a provider degrades to a light no-op instead of throwing. | Yes | TC-UI-022 |
| SCN-TH-07 | Integration | **Manual** — change the theme in one tab and confirm the other follows (the `storage` listener). | No | — |
| SCN-TH-08 | Edge | **Manual** — with no stored choice, change the OS preference and confirm the app follows live. | No | — |
| SCN-TH-09 | Edge | **Manual** — in private browsing (localStorage throws), the theme still applies for the session. | No | — |
| SCN-TH-10 | UI | **Manual** — a dark visit shows no white flash on first paint (the inline script). | No | — |
| SCN-TH-11 | UI | **Manual** — ThemeBtn swaps icon and accessible name between the two modes. | No | — |

## Coverage

6 of 11 automated.
