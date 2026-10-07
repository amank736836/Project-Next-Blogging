# FEAT-012 · Known issues

None filed.

## Unfiled observations

* **Fixture/model drift.** `DEMO_POSTS` omits `updatedAt` and relies on `withAuthor` to add
  `userId`. Nothing enforces that the fixtures still satisfy `src/models/Post.js`.
* **Public in production.** `/demo` is `noindex` but not gated and not obscure. Whether an
  internal design preview should ship publicly is a product decision; `UNKNOWN / REQUIRES
  VALIDATION`.
* `src/components/demo/**` is **excluded from coverage** in `harness/vitest.config.mjs`,
  so its lines are not counted in [../../reports/coverage.md](../../reports/coverage.md).
