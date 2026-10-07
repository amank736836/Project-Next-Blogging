# Post schema — regression cases

`src/models/Post.js` is the only place a data rule is enforced anywhere in this
application. Changing it changes behaviour everywhere at once, silently.
[SCN-REG-02](../../test-scenarios/regression.md) exists for that reason.

| SCN ID | Change | Guard | Status |
| --- | --- | --- | --- |
| SCN-REG-02 | Any field added, renamed, removed, or made optional | TC-DB-001…009 | AUTOMATED |

## What the guard actually catches

| If someone… | Which case goes red |
| --- | --- |
| Makes `featuredImage` optional | TC-DB-002, TC-DB-008 |
| Adds `views` to the schema | TC-DB-001 |
| Changes the default `status` to `inactive` | TC-DB-003 |
| Drops the unique index on `slug` | TC-DB-004 |
| Turns off `timestamps` | TC-DB-005 |
| Converts `userId` to an `ObjectId` ref | TC-DB-006 |
| Adds `enum: ['active','inactive','draft']` | TC-DB-001 (paths unchanged) — but TC-DB-003 would catch a *different* enum |

## What it does not catch

Nothing here touches a real MongoDB. Index creation, `E11000` on a concurrent duplicate,
and whether `findOneAndUpdate` really skips validators against a live server are all
[SCN-DB-10…12](../../test-scenarios/database.md) and remain **BLOCKED**.
