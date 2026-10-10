# FEAT-004 · Acceptance criteria

### AC-020 — A published post is readable by anyone
**Given** a post with `status: "active"`
**When** anyone opens `/post/<slug>`
**Then** the title, hero image, body and reading estimate are shown
→ TC-API-006 (API half); page render is `NOT_EXECUTED`

### AC-021 — A missing post does not dead-end
**Given** a slug that does not exist
**When** the page loads
**Then** the reader is sent to `/`
→ TC-API-007 (API half); redirect is `NOT_EXECUTED`

### AC-022 — *(currently failing)* A draft is not readable by the public
**Given** a post with `status: "inactive"`
**When** someone who is not its author opens `/post/<slug>`
**Then** they must not see it
**Actual** — `GET /api/posts/<slug>` returns it with `200`.
→ TC-SEC-004 · [BUG-006](../../bugs/open/BUG-006-draft-readable-by-slug.md)

### AC-023 — *(currently failing)* The byline names the author
**Given** I am signed in as writer B and I read writer A's post
**Then** the byline reads writer A
**Actual** — it reads writer B.
→ [BUG-003](../../bugs/open/BUG-003-article-shows-viewer-as-author.md) · manual, `NOT_EXECUTED`

### AC-024 — Controls follow ownership
**Given** I did not write the post
**Then** no Edit or Delete control is offered
→ TC-SEC-009, TC-SEC-010 (verified on the card, which shares the comparison)

### AC-025 — Deleting takes two clicks
**Given** I am the author **When** I click Delete **Then** it asks me to tap again
**When** I click again **Then** the post is gone and I am back at `/`
→ TC-UI-036, TC-UI-037 cover the identical mechanism in the composer

### AC-026 — Reduced motion is honoured
**Given** I have asked my OS to reduce motion
**Then** the back-to-top button is not rendered
→ Code-verified; no automated case

### AC-027 — *(currently failing)* Author HTML cannot attack a reader
**Given** a post whose content contains `<img src=x onerror="…">`
**When** any reader opens it
**Then** nothing executes
**Actual** — the markup is stored verbatim (TC-EDGE-003) and rendered without sanitisation.
Browser execution is `NOT_EXECUTED` (no browser in this environment).
→ [BUG-022](../../bugs/open/BUG-022-stored-xss-post-content.md)
