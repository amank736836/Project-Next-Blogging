# BUG-019 — No `.env.example`

| Field | Value |
| --- | --- |
| Bug ID | BUG-019 |
| Title | No `.env.example` |
| Severity | Low |
| Priority | P3 |
| Status | OPEN |
| Feature | infrastructure |
| Requirement | REQ-NF-01 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | repository root |
| Reported in | code review |
| Test | none |
| Evidence | No `.env.example`, `.env.sample` or `.env.template` at the repository root |
| Fix | Add one, generated from the table in `test-tools/setup.md` |
| Regression test | None needed |

## Observed behaviour

Six variables are required for the application to build and serve, and the only record of
them is the error messages you get when each is missing. `src/lib/db.js:6` even points at
`.env.local`, a file the repository does not provide a template for.

## Expected behaviour

A committed `.env.example` with every variable, its purpose, and a placeholder value.

## Steps to reproduce

`ls -a | grep env` at the repository root.

## Root cause

Never created.

## Notes

The variable contract, derived by observing each failure, is recorded in
[../../test-tools/setup.md](../../test-tools/setup.md). It is a direct transcription into
`.env.example` form:

```
MONGO_URI=
MONGO_DB=blog
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_TINYMCE_API_KEY=
```

No real values, ever — placeholders only.
