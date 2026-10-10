# Database testing tools

Two independent things, often confused:

1. **The real schema**, compiled in-process. No server.
2. **The persistence fake**, which stands in for storage inside API handler tests.

## The real schema — `automation/database/post-schema.test.js`

`import Post from "@/models/Post"` compiles the genuine Mongoose schema. Validation runs
through `doc.validateSync()` and `schema.paths`, both of which are pure and need no
connection. 18 checks, and `src/models/Post.js` is at 100% statement coverage.

### Mongoose 9 behaviours, measured not assumed

| Expectation | Reality |
| --- | --- |
| `validateSync()` returns `null` when valid | Returns **`undefined`**. Assert falsy. |
| `schema.path('status').isRequired` is `false` when optional | Returns **`undefined`**. Assert falsy, never `toBe(false)`. |
| `required: true` on a String accepts `""` | It **rejects** `""`. This disproved an earlier hypothesis and BUG-009 was withdrawn; its number is retired, not reused. |

## The persistence fake — `automation/utilities/fake-post-model.js`

```js
import { installFakePersistence } from "../utilities/fake-post-model.js";
const store = installFakePersistence(Post, SEED_ARCHIVE);
// … run handlers …
expect(store._count()).toBe(4);
store._reset();
```

It **spies on the real model's statics** (`find`, `findOne`, `create`, `findOneAndUpdate`,
`findOneAndDelete`) rather than replacing the model. The route handler therefore imports
and calls the genuine `Post`, and only the storage call is intercepted. That is what makes
these API tests meaningful: the handler code under test is the shipping code.

## What the fake does *not* reproduce

This is the honest limit, and it matters for anything that depends on server behaviour.

| Real behaviour | The fake's substitute | Consequence |
| --- | --- | --- |
| A unique index raises `E11000` | Raises a `ValidationError` | TC-NEG-002 proves *rejection*, not the duplicate-key error path. [SCN-INT-05](../../test-scenarios/integration.md), BLOCKED. |
| `findOneAndUpdate` without `runValidators` skips validation | The fake applies no validation either | The observed outcome is right for the wrong reason. TC-SEC-006 additionally proves the handler passes the body through untouched, which is the part that lives in *this* codebase. |
| Query operators (`$gt`, `$regex`, …) | Shallow equality | Untested. The handlers only ever build exact-match filters, so this is currently safe by construction. |
| Projection, sort, `lean()` | Ignored | `sort: { createdAt: -1 }` is asserted as an *argument*, never as an outcome. |
| Connection failures, retries, pooling | Not modelled | [BUG-012](../../bugs/open/BUG-012-db-caches-rejected-promise.md) is code-verified, not executed. |

`src/lib/db.js` itself is at **0% coverage** — no test imports it, because importing it
without `MONGO_URI` throws at module scope.

## No `mongodb-memory-server`

It downloads a `mongod` binary from a host that is not reachable in this environment. When
one is available, replace the fake with it and the blocked cases in
[../../test-scenarios/database.md](../../test-scenarios/database.md) become executable
without rewriting a single assertion.
