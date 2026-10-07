# FEAT-002 · Test data

All of it lives in [../../test-data/](../../test-data/README.md); nothing is duplicated here.

| Set | Export | Used by |
| --- | --- | --- |
| Seed archive (3 published + 1 draft, 2 owners) | `SEED_ARCHIVE` | every API and DB test |
| Owner ids | `USER_A`, `USER_B` | ownership and IDOR cases |
| Valid new post | `VALID_NEW_POST` | TC-API-005, TC-DB-007, TC-NEG-001…003 |
| Valid update | `VALID_UPDATE` | TC-API-008, TC-API-009, TC-UI-035 |
| Invalid payloads | [invalid/post-missing-title.json](../../test-data/invalid/post-missing-title.json), [post-duplicate-slug.json](../../test-data/invalid/post-duplicate-slug.json), [post-empty-required.json](../../test-data/invalid/post-empty-required.json), [malformed-body.txt](../../test-data/invalid/malformed-body.txt) | TC-NEG-001…004, TC-EDGE-001 |
| Boundary payloads | [edge-cases/post-whitespace-title.json](../../test-data/edge-cases/post-whitespace-title.json), [post-hostile-markup.json](../../test-data/edge-cases/post-hostile-markup.json), [post-slug-case-variants.json](../../test-data/edge-cases/post-slug-case-variants.json) | TC-EDGE-003…005 (the 1 MB body for TC-EDGE-002 is generated in-test, not stored) |
| Binary files | created in-test (`new File([...])`) | TC-EDGE-009 (9 MB), TC-API-012 (1 KB) |

## Generating a large file without committing it

```js
new File([new Uint8Array(9 * 1024 * 1024)], 'huge.jpg', { type: 'image/jpeg' })
```

Nine megabytes is allocated in memory per test and released afterwards. No binary fixture
is stored in the repository.
