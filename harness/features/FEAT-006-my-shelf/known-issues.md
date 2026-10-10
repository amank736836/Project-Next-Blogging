# FEAT-006 · Known issues

| Bug | Severity | Summary |
| --- | --- | --- |
| [BUG-001](../../bugs/open/BUG-001-all-posts-drafts-never-shown.md) | Major | Drafts are never fetched, so the Drafts tab and the drafts stat are permanently empty/zero. |
| [BUG-005](../../bugs/open/BUG-005-idor-draft-exposure.md) | Critical | The `userId` filter is caller-supplied and unverified — the scoping that this page relies on is not a security control. |

## Unfiled observations

* **`0%` coverage** on a 144-line page that carries the product's core promise.
* The `Stat` component is defined inline in the page file and is not reused.
