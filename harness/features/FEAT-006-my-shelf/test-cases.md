# FEAT-006 · Test cases — index

| Sheet | Cases |
| --- | --- |
| [../../test-cases/post-api/positive.md](../../test-cases/post-api/positive.md) | TC-API-003 |
| [../../test-cases/post-api/negative.md](../../test-cases/post-api/negative.md) | TC-SEC-002 |
| [../../test-cases/authentication/positive.md](../../test-cases/authentication/positive.md) | TC-UI-001, TC-UI-002 (the gate) |

No page-level cases exist yet — `app/all-posts/page.js` is at 0% coverage. The first case
written here should be the regression test for
[BUG-001](../../bugs/open/BUG-001-all-posts-drafts-never-shown.md): mock `postService`,
seed one `active` and one `inactive` post, and assert the Drafts tab shows one.
