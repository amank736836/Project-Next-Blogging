# Archive UI — test cases

Features: [FEAT-003](../../features/FEAT-003-public-archive/README.md),
[FEAT-001](../../features/FEAT-001-authentication/README.md) ·
Requirements: REQ-018/03, REQ-014, REQ-023

| Cases | Sheets |
| --- | --- |
| 14 | [positive](positive.md) (10) · [negative](negative.md) (0 executed) · [edge-cases](edge-cases.md) (2) · [security](security.md) (2) |

`PostCard.jsx` is at 100% statement coverage; `Header.jsx` is at 96.07%.

The pages that *use* these components — `app/page.js` (148 lines) and
`app/all-posts/page.js` (120 lines) — are at **0%**. The component is tested; the archive
is not. That gap is where BUG-001 and BUG-002 live.
