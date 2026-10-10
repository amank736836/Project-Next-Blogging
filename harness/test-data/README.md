# Test data

Every value here is synthetic. There is no real email address, credential, token,
Cloudinary account, Clerk user id or production identifier anywhere in `harness/`.
Where a secret would be needed, the placeholder form `${ENV_VAR}` is used.

## What the suites actually import

The tests import **`fixtures/posts.js`**, not the JSON files. That module is the single
source of truth:

```js
import { SEED_ARCHIVE, VALID_NEW_POST, USER_A } from "../../test-data/fixtures/posts.js";
```

| Export | Contents | Used by |
| --- | --- | --- |
| `USER_A`, `USER_B` | Two distinct synthetic user ids | every API and card test |
| `SEED_ARCHIVE` | 4 documents — 3 `active`, 1 `inactive` (`draft-never-shipped`, owned by `USER_B`) | `automation/api/*`, `automation/ui/post-card.test.jsx` |
| `VALID_NEW_POST` | A complete, schema-valid create payload | `TC-API-005`, `TC-DB-007` |
| `VALID_UPDATE` | A partial update — no `userId`, no `slug` | `TC-API-008` |
| `VALID_CONTACT` | Name, email and message that all clear the thresholds | `TC-UI-009` |

The seed is deliberately shaped to make the security cases possible: the draft belongs to
`USER_B` while most tests act as `USER_A`. Without that asymmetry, `TC-SEC-002` could not
distinguish "the archive is empty" from "someone else's draft leaked".

## The JSON files

Derived from the same fixture module and used for manual `curl` reproduction — paste them
into a request body when reproducing a bug by hand.

| Path | Contents | Case |
| --- | --- | --- |
| [valid/post.json](valid/post.json) | A complete create payload | TC-API-005 |
| [valid/post-update.json](valid/post-update.json) | A partial update | TC-API-008 |
| [valid/contact.json](valid/contact.json) | A valid contact submission | TC-UI-009 |
| [invalid/post-missing-title.json](invalid/post-missing-title.json) | `title` removed | TC-NEG-001 |
| [invalid/post-duplicate-slug.json](invalid/post-duplicate-slug.json) | A slug that collides with the seed | TC-NEG-002 |
| [invalid/post-empty-required.json](invalid/post-empty-required.json) | Every required field set to `""` | TC-EDGE-001 |
| [invalid/malformed-body.txt](invalid/malformed-body.txt) | `{"title":` — truncated JSON | TC-NEG-003, TC-NEG-004 |
| [invalid/contact-short-name.json](invalid/contact-short-name.json) | A one-character name | TC-NEG-006 |
| [invalid/contact-bad-email.json](invalid/contact-bad-email.json) | `someone@nowhere` | TC-NEG-007 |
| [invalid/contact-short-message.json](invalid/contact-short-message.json) | An 11-character message | TC-EDGE-006 |
| [edge-cases/post-whitespace-title.json](edge-cases/post-whitespace-title.json) | A three-space title | TC-EDGE-005 |
| [edge-cases/post-hostile-markup.json](edge-cases/post-hostile-markup.json) | `onerror` and `<script>` payloads | TC-EDGE-003 |
| [edge-cases/post-slug-case-variants.json](edge-cases/post-slug-case-variants.json) | Four casings of one slug | TC-EDGE-004 |
| [sample-data/archive.json](sample-data/archive.json) | The full seed, as JSON | manual archive reproduction |

### The 1 MB payload is not stored

`TC-EDGE-002` needs a ~1 MB body. It builds `'b'.repeat(1024 * 1024)` inline rather than
committing a megabyte of repeated characters to the repository. Do the same for any future
large-input case: generate it, don't store it.

## Manual reproduction

```bash
BASE=http://127.0.0.1:3000
curl -s -X POST "$BASE/api/posts" -H 'content-type: application/json' \
  --data @test-data/valid/post.json | head -c 400
curl -s -X POST "$BASE/api/posts" -H 'content-type: application/json' \
  --data @test-data/invalid/malformed-body.txt          # 500, not 400 — BUG-013
curl -s "$BASE/api/posts?status=inactive"               # leaks a draft — BUG-005
```

## Rules

1. **Synthetic only.** If a test seems to need a real account, it needs a mock instead.
2. **One source of truth.** Add to `fixtures/posts.js` and re-derive the JSON, rather than
   editing a JSON file directly — otherwise the two drift apart.
3. **Generate bulk data.** Never commit a file whose size comes from repetition.
4. **Name the defect.** If a fixture exists only to trigger a bug, say which bug in a
   comment, or the next reader will delete it as dead data.
5. **Reset between cases.** `installFakePersistence` returns a store with `_reset()`; the
   API suites call it in `beforeEach`. Shared mutable seed data is how order-dependency
   bugs get written.
