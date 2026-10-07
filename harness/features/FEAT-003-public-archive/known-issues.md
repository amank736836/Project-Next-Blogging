# FEAT-003 · Known issues

| Bug | Severity | Summary |
| --- | --- | --- |
| [BUG-002](../../bugs/open/BUG-002-home-drafts-filter-dead.md) | Major | The "Drafts" chip always shows 0 and never has anything to show. |
| [BUG-005](../../bugs/open/BUG-005-idor-draft-exposure.md) | Critical | The archive's own status filter is the *only* thing keeping drafts private. |

## Unfiled observations

* **Search is client-side over a fetch that has no limit.** With a large archive the whole
  collection is shipped to the browser to be filtered in memory (REQ-NF-11).
* **`app/page.js` is 0% covered** despite being the most-visited route.
