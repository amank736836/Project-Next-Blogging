# FEAT-008 · Test scenarios

| SCN ID | Type | Scenario | Automated? | Test case |
| --- | --- | --- | --- | --- |
| SCN-CT-01 | Negative | An empty submit names all three problems and sends nothing. | Yes | TC-UI-007 |
| SCN-CT-02 | Negative | A 1-character name is rejected. | Yes | TC-NEG-006 |
| SCN-CT-03 | Negative | An email without a domain is rejected. | Yes | TC-NEG-007 |
| SCN-CT-04 | Edge | 11 characters of message fails; 12 passes. | Yes | TC-EDGE-006 |
| SCN-CT-05 | UI | The failing field is marked `aria-invalid="true"`. | Yes | TC-UI-008 |
| SCN-CT-06 | Functional | A valid submit clears the fields and shows the success state. | Yes | TC-UI-009 |
| SCN-CT-07 | Functional | "Write another" returns to an empty form. | Yes | TC-UI-010 |
| SCN-CT-08 | UI | The topic chips are single-select and expose `aria-pressed`. | Yes | TC-UI-011 |
| SCN-CT-09 | Negative | **Nothing is transmitted** — success is reported with no network call. | Yes | TC-UI-012 |
| SCN-CT-10 | Edge | **Manual** — pasting multi-line content, emoji and RTL text into the message. | No | — |
| SCN-CT-11 | Security | **Manual** — the form is not a spam relay once a backend exists (rate limit, honeypot). | No — blocked until a backend exists | — |

## Coverage

9 of 11 automated. `app/contact/page.js` is at **100% line and branch coverage**.
