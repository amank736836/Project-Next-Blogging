# Edge-case scenarios

Empty values, nulls, zero, maximums, minimums, large data, duplicates, special characters,
concurrency and boundaries.

## Data boundaries — [FEAT-002](../features/FEAT-002-post-crud/README.md)

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-EDGE-01 | Empty string for every required field. | AUTOMATED — **rejected**, contrary to an earlier hypothesis | TC-EDGE-001 |
| SCN-EDGE-02 | Whitespace-only title (`"   "`). | AUTOMATED — accepted; no trim rule | TC-EDGE-005 |
| SCN-EDGE-03 | 2000-character title and 1 MB body. | AUTOMATED — accepted; no length limits | TC-EDGE-002 |
| SCN-EDGE-04 | Hostile markup in `content`. | AUTOMATED — stored verbatim | TC-EDGE-003 |
| SCN-EDGE-05 | A mixed-case slug with spaces and punctuation. | AUTOMATED — not normalised, so uniqueness is byte-exact | TC-EDGE-004 |
| SCN-EDGE-06 | A duplicate slug. | AUTOMATED | TC-NEG-002 |
| SCN-EDGE-07 | Deleting the same post twice. | AUTOMATED | TC-API-011 |
| SCN-EDGE-08 | An empty result set for a user with no posts. | AUTOMATED | TC-API-004 |
| SCN-EDGE-09 | A 9 MB image. | AUTOMATED | TC-EDGE-009 |
| SCN-EDGE-10 | **Concurrent** writes to the same slug. | BLOCKED — no MongoDB | — |
| SCN-EDGE-11 | **Concurrent** create with an identical slug (unique index race). | BLOCKED — no MongoDB | — |
| SCN-EDGE-12 | A title containing only emoji, or RTL text. | NOT_EXECUTED | — |
| SCN-EDGE-13 | A `createdAt` in the future, or a non-ISO string. | PARTIAL — TC-EDGE-008 covers an invalid date on the card | TC-EDGE-008 |

## UI boundaries

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-EDGE-14 | Contact message at 11 vs 12 characters. | AUTOMATED | TC-EDGE-006 |
| SCN-EDGE-15 | A post with almost no content — reading time floors at 1 minute. | AUTOMATED | TC-EDGE-007 |
| SCN-EDGE-16 | A missing or invalid `createdAt` renders "undated". | AUTOMATED | TC-EDGE-008 |
| SCN-EDGE-17 | Clerk transitions from loading to signed-out without flashing content. | AUTOMATED | TC-UI-004 |
| SCN-EDGE-18 | The armed delete disarms itself at 4.5 s. | AUTOMATED | TC-UI-037 |
| SCN-EDGE-19 | `useTheme()` used outside its provider. | AUTOMATED | TC-UI-022 |

## Boundaries that were probed and turned out not to exist

Worth recording, because a future tester will ask:

* **There is no title length limit.** 2000 characters is accepted (TC-EDGE-002).
* **There is no content length limit.** 1 MB is accepted.
* **There is no server-side image size limit.** Only the client's 8 MB rule.
* **There is no request body size limit** configured in `next.config.mjs`.
* **There is no rate limit** anywhere.

**16 of 20 automated; 2 blocked on MongoDB; 1 not executed; 1 partial.**
