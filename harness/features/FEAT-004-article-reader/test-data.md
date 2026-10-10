# FEAT-004 · Test data

| Need | Source |
| --- | --- |
| A published post to read | `SEED_ARCHIVE[0]` in [../../test-data/fixtures/posts.js](../../test-data/fixtures/posts.js) |
| A draft to prove it must not be readable | `SEED_ARCHIVE[3]` (`draft-never-shipped`, owned by `USER_B`) |
| A slug that does not exist | `this-slug-does-not-exist` (literal in the test) |
| Long body copy for reading-time cases | `PostCard` test builds 440 words inline |
| Hostile HTML | `<img src=x onerror="window.__harnessXss=1">` — TC-EDGE-003 |

## For the manual scenarios

`SCN-READ-05` and `SCN-READ-10` need two real accounts and a browser:

```bash
WRITER_A_EMAIL=${WRITER_A_EMAIL}
WRITER_A_PASSWORD=${WRITER_A_PASSWORD}
READER_B_EMAIL=${READER_B_EMAIL}
READER_B_PASSWORD=${READER_B_PASSWORD}
```

`SCN-READ-10` (stored XSS) must only ever be run against a throwaway environment, with a
payload that writes to a variable rather than exfiltrating anything.
