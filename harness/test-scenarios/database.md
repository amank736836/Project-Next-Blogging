# Database scenarios

There is one collection. These scenarios cover its contract, its indexes, and the integrity
rules the application relies on.

## Schema contract (automated against the real Mongoose schema)

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-DB-01 | The schema declares exactly the expected paths plus timestamps. | AUTOMATED | TC-DB-001 |
| SCN-DB-02 | Five fields are required. | AUTOMATED | TC-DB-002 |
| SCN-DB-03 | `status` is `['active','inactive']` with default `active`. | AUTOMATED | TC-DB-003 |
| SCN-DB-04 | `slug` carries a unique index. | AUTOMATED | TC-DB-004 |
| SCN-DB-05 | `timestamps: true` provides `createdAt`/`updatedAt`. | AUTOMATED | TC-DB-005 |
| SCN-DB-06 | `userId` is a String, not an ObjectId reference. | AUTOMATED | TC-DB-006 |
| SCN-DB-07 | A valid document validates. | AUTOMATED | TC-DB-007 |
| SCN-DB-08 | Each required field individually rejects its absence. | AUTOMATED | TC-DB-008 (×5) |
| SCN-DB-09 | An out-of-enum `status` is rejected. | AUTOMATED | TC-DB-009 |

## Integrity and behaviour that need a real server

| SCN ID | Scenario | Status | Why |
| --- | --- | --- | --- |
| SCN-DB-10 | The unique index on `slug` actually rejects a concurrent duplicate insert with `E11000`. | BLOCKED | No MongoDB. The in-memory fake raises a `ValidationError` instead — documented in `automation/utilities/fake-post-model.js`. |
| SCN-DB-11 | `findOneAndUpdate` **without** `runValidators` really does bypass the enum in MongoDB, not just in the fake. | BLOCKED | No MongoDB. TC-SEC-006 proves the handler passes the body through unchanged. |
| SCN-DB-12 | Indexes are created on first connect against a fresh database. | BLOCKED | No MongoDB |
| SCN-DB-13 | `dbName` defaults to `blog` when `MONGO_DB` is unset. | NOT_EXECUTED | `src/lib/db.js` is at 0% coverage; the default is readable at line 23 |
| SCN-DB-14 | A rejected connection is retried on the next request. | NOT_EXECUTED — and it is **not** retried | [BUG-012](../bugs/open/BUG-012-db-caches-rejected-promise.md) |

**9 of 14 automated.**

## Manual procedure for the blocked cases

When a MongoDB instance is available:

```bash
export MONGO_URI="mongodb://127.0.0.1:27017/harness_integration"
mongosh "$MONGO_URI" --eval 'db.posts.createIndex({ slug: 1 }, { unique: true })'

# SCN-DB-10 — concurrent duplicate slug
curl -s -X POST localhost:3000/api/posts -H 'content-type: application/json' \
  -d '{"title":"a","slug":"same","content":"c","featuredImage":"f","userId":"u1"}' &
curl -s -X POST localhost:3000/api/posts -H 'content-type: application/json' \
  -d '{"title":"b","slug":"same","content":"c","featuredImage":"f","userId":"u2"}' &
wait
# Expect: one 201, one error. Today both are 500 with a raw E11000 message (BUG-013).

mongosh "$MONGO_URI" --eval 'db.posts.find({}, {slug:1,userId:1}).toArray()'
```

Record the output in `../evidence/database-results/` and reference it from the case sheet.
