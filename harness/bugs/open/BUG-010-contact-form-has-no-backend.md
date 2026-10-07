# BUG-010 — The contact form reports success and sends nothing

| Field | Value |
| --- | --- |
| Bug ID | BUG-010 |
| Title | The contact form reports success and sends nothing |
| Severity | Medium |
| Priority | P2 |
| Status | OPEN |
| Feature | [FEAT-008](../../features/FEAT-008-contact-form/README.md) |
| Requirement | REQ-017 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | jsdom, real page component, `fetch` spied |
| Reported in | RUN-2026-10-07-001 |
| Test | TC-UI-012 |
| Evidence | `automation/ui/contact-form.test.jsx`, case `TC-UI-012` |
| Fix | Add an `/api/contact` route, or wire the form to a mail provider; keep the success state tied to the response |
| Regression test | Invert TC-UI-012 to assert exactly one request with the form payload |

## Observed behaviour

A visitor fills in the form, clicks send, and is shown a success panel. Nothing is
transmitted. `TC-UI-012` replaces `globalThis.fetch` with a spy, submits a fully valid
message, and asserts the spy was **never** called.

There is no `/api/contact` route in the application. The 18-route build table has no contact
endpoint of any kind.

## Expected behaviour

The message reaches someone, or the form says plainly that it does not.

## Steps to reproduce

Open `/contact`, fill every field with valid input, submit, then watch the network tab.

## Root cause

`src/app/contact/page.js` validates the three fields (`:26-31`), then sets local state to
the success view. There is no `fetch`, no `axios` call, no form action. The success state is
reached unconditionally once validation passes.

## Notes

Worse than a missing feature, because the UI actively lies. A support request, a bug report
or a sales enquiry entered here is discarded and the sender is told it was delivered.

This is the only hand-written validation in the entire application, which makes it the best-
tested form and the least functional one — `src/app/contact/page.js` is at 100% statement
coverage. Coverage measures execution, not correctness.
