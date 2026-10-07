# Screenshots

**This directory is empty. No screenshot was taken and none was fabricated.**

There is no browser available in the environment where this harness was built — no
Chromium, no Playwright, no Puppeteer. Every visual claim in this harness is therefore one
of two things, and the difference is always stated:

| Kind | Example | Confidence |
| --- | --- | --- |
| **Asserted in jsdom** | `aria-expanded` flips on the mobile menu toggle (`TC-UI-027`); the `dark` class lands on `<html>` (`TC-UI-018`) | Real, automated, but DOM-only — no layout, no paint, no CSS cascade |
| **Read from source** | The skip link in `app/layout.js`; `robots: { index: false }` on `/demo` | Verified by inspection, `NOT_EXECUTED` |

Nothing here is a visual verification. Colour contrast, responsive breakpoints, focus rings,
GSAP animation quality and the actual appearance of either theme are all unverified — they
are listed as `BLOCKED` in
[../../test-scenarios/ui.md](../../test-scenarios/ui.md) rather than glossed over.

## Filling this directory

When a browser is available:

```bash
npm i -D @playwright/test
npx playwright install chromium
```

Name files `<RUN-ID>/<route>-<state>.png`, e.g.
`RUN-2026-10-07-001/all-posts-drafts-tab.png`, and reference them from the case sheet that
needed them. The highest-value first five, in the order they would close the biggest gaps:

1. `/all-posts` on the **Drafts** tab — it will be empty, which is
   [BUG-001](../../bugs/open/BUG-001-all-posts-drafts-never-shown.md)
2. An article byline showing the *viewer's* name on someone else's post —
   [BUG-003](../../bugs/open/BUG-003-article-shows-viewer-as-author.md)
3. The composer's slug field with hyphens visibly stripped —
   [BUG-011](../../bugs/open/BUG-011-manual-slug-strips-hyphens.md)
4. A stored-XSS payload rendering in the article body —
   [BUG-022](../../bugs/open/BUG-022-stored-xss-post-content.md), the one High-severity
   finding that is currently code-verified only
5. Both themes side by side on `/` — the only visual check with no bug attached

Binary files are gitignored. Keep the handful that a bug report depends on; do not
accumulate the rest.
