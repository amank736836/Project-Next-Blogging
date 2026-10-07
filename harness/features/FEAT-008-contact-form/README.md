# FEAT-008 · Contact form

```text
Feature:        The /contact page — the only hand-written validation in the app.
Purpose:        Give visitors a way to report a bug or send an idea.
User:           Anyone. No account needed ("No account needed. We keep it in a thread,
                not a CRM.").
Entry Point:    /contact (src/app/contact/page.js)
Dependencies:   Input, Button, PageHeader, Reveal, DrawSvg. No API, no database.
Inputs:         topic chip (one of: A bug, A idea, Billing, Something else),
                name, email, message.
Outputs:        A success state. Nothing is transmitted — see BUG-010.
Business Rules: BR-15 (name ≥ 2, plausible email, message ≥ 12).
Expected Behavior:
                - Submitting with errors marks each field, shows its message, and does not
                  clear anything the visitor typed.
                - A valid submit shows a spinner for 700 ms, then the success state, and
                  clears all three fields.
                - "Write another" returns to an empty form.
                - The topic chips are single-select with aria-pressed.
Error Handling: Inline per-field messages. `aria-invalid` on the offending field and a
                shake animation via the `field-error` class.
Permissions:    Public.
Related APIs:   NONE. This is the finding.
Related Database Tables: None.
Related UI:     app/contact/page.js, components/Input.jsx, components/Button.jsx
Existing Tests: TC-UI-007, TC-UI-008, TC-UI-009, TC-UI-010, TC-UI-011, TC-UI-012,
                TC-NEG-006, TC-NEG-007, TC-EDGE-006 — 9 cases, 100% line coverage of the
                page. The best-covered page in the application.
Missing Tests:  Nothing meaningful is missing at unit level. A real send path cannot be
                tested until one exists.
Known Issues:   BUG-010.
Status:         PARTIAL — validation is complete and fully tested; delivery does not exist.
```

## Validation rules, exactly as coded (`app/contact/page.js:26-31`)

```js
if (values.name.trim().length < 2) next.name = 'Tell us who is writing';
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) next.email = 'That address will not reach you';
if (values.message.trim().length < 12) next.message = 'A little more context, please';
```

Boundaries verified: a 1-character name fails, a 12-character message passes and an
11-character one fails (TC-EDGE-006). The email rule accepts `a@b.co` and rejects
`not-an-email`; it does not reject `a@b.c` (TLD shorter than 2).

## BUG-010 — success without sending

```js
setBusy(true);
// No inbox on the other end yet — the UI promise is the deliverable.
setTimeout(() => { setBusy(false); setSent(true); setValues({…}); }, 700);
```

The comment is candid, and the harness asserts the behaviour rather than hiding it:
`TC-UI-012` spies on `globalThis.fetch` and proves it is never called, yet the visitor is
told "Message sent … A reply usually lands within a day."
