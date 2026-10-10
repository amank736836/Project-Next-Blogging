# BUG-012 — A rejected database connection is cached forever

| Field | Value |
| --- | --- |
| Bug ID | BUG-012 |
| Title | A rejected database connection is cached forever |
| Severity | Medium |
| Priority | P2 |
| Status | RESOLVED |
| Feature | infrastructure |
| Requirement | REQ-NF-02 — **VIOLATED** |
| Reproducible | ALWAYS (code-verified; `src/lib/db.js` is at 0% coverage) |
| Environment | Read from source |
| Reported in | code review |
| Test | none |
| Evidence | `src/lib/db.js:20-30` |
| Fix | Clear `cached.promise` in a `.catch` so the next call retries |
| Regression test | Add a case: reject the first `mongoose.connect`, assert the second call attempts a new connection |

## Observed behaviour

If the first connection attempt fails, every subsequent request in that process fails the
same way, permanently. A database that is briefly unavailable takes the API down until the
process is restarted — which on a serverless platform means until the container is recycled.

## Expected behaviour

A transient connection failure is retried on the next request.

## Steps to reproduce

```bash
# start the server with no MongoDB listening
curl -s http://127.0.0.1:3000/api/posts        # 500
# now start MongoDB on that port
curl -s http://127.0.0.1:3000/api/posts        # still 500, forever
```

## Root cause

`src/lib/db.js:20-30`:

```js
if (!cached.promise) {
  cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => mongoose);
}
cached.conn = await cached.promise;
```

`cached.promise` is assigned once and never cleared. When it rejects, the rejected promise
stays in the cache; `await` on it re-throws the original error on every later call. There is
no `.catch` anywhere in the function, so the cache is never repaired.

## Notes

One-line fix:

```js
cached.promise = mongoose.connect(MONGO_URI, opts)
  .catch((err) => { cached.promise = null; throw err; });
```

`src/lib/db.js` is at **0% coverage** — no test imports it, because importing it without
`MONGO_URI` throws at module scope (BUG-017). That is why this defect was found by reading
rather than by running, and why the reproduction above is described rather than executed.

`bufferCommands: false` at `:22` makes this worse: Mongoose will not queue operations while
disconnected, so there is no grace period either.
