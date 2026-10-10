# BUG-011 — The manual slug field strips every hyphen as it is typed

| Field | Value |
| --- | --- |
| Bug ID | BUG-011 |
| Title | The manual slug field strips every hyphen as it is typed |
| Severity | Major |
| Priority | P2 |
| Status | RESOLVED |
| Feature | [FEAT-002](../../features/FEAT-002-post-crud/README.md) |
| Requirement | REQ-015, BR-08 — **VIOLATED** |
| Reproducible | ALWAYS |
| Environment | jsdom, real `PostForm`, `userEvent` typing |
| Reported in | RUN-2026-10-07-001 |
| Test | TC-NEG-010 |
| Evidence | `automation/ui/post-form.test.jsx`, case `TC-NEG-010` |
| Fix | Do not run `slugTransform` on the manual field; validate against the `pattern` rule instead |
| Regression test | Invert TC-NEG-010 to assert the hyphens survive |

## Observed behaviour

`TC-NEG-010` switches the slug control to manual and types `my-cool-slug`. The field reads
**`mycoolslug`**. Every hyphen disappears as it is entered, so the writer cannot type the one
character the format requires.

The RHF `pattern` rule at `PostForm.jsx:206-212` then rejects the result if the writer types
anything else, because `^[a-z0-9]+(?:-[a-z0-9]+)*$` demands the hyphens the transform just
removed.

## Expected behaviour

Manual mode means manual: the writer's text is kept and only validated.

## Steps to reproduce

Open `/add-post`, type a title, switch the slug control to manual, type `my-cool-slug`.

## Root cause

`src/components/PostForm/PostForm.jsx:214` runs `slugTransform` on the manual input's
`onChange`:

```js
setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
```

and `slugTransform` (`:123-132`) includes `.replace(/[^a-zA-Z\d\s]+/g, "")`. That character
class keeps letters, digits and whitespace — and `-` is none of those. It is stripped on every
keystroke, before `.replace(/\s/g, "-")` ever gets a chance to add one back.

The transform is correct for deriving a slug *from a title*. Applying it to a slug field is
the defect: it removes the separator it is meant to produce.

## Notes

A tidy illustration of a helper being reused one level too far. The fix is a one-line
deletion — drop `slugTransform` from the manual `onChange` and let the `pattern` rule do the
work it was written for.

Note the interaction with BUG-007: since `PUT` does not run validators, a corrupt slug
written this way would persist without complaint.
