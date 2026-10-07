# FEAT-008 · Known issues

| Bug | Severity | Summary |
| --- | --- | --- |
| [BUG-010](../../bugs/open/BUG-010-contact-form-has-no-backend.md) | Medium | The form reports "Message sent" after a 700 ms `setTimeout` without making any network request. |

## Unfiled observations

* The topic selection is collected into state but is not part of the (non-existent)
  payload, so it currently has no effect at all beyond the pressed styling.
* The email regex requires a TLD of at least 2 characters, so `a@b.c` is rejected — a
  reasonable choice, but worth stating as intended rather than accidental.
* `hello@framephrase.app` is published on the page as a `mailto:` channel. Whether that
  mailbox exists is `UNKNOWN / REQUIRES VALIDATION`.
