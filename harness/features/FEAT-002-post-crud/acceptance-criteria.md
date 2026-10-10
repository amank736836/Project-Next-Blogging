# FEAT-002 · Acceptance criteria

### AC-010 — A writer can publish
**Given** I am signed in and on `/add-post`
**When** I give the post a title, attach an image, write a body and submit
**Then** the image is uploaded, the post is created with my user id, and I land on `/post/<slug>`
→ TC-UI-032

### AC-011 — The URL is derived, then mine
**Given** I type a title
**Then** the slug fills in as lowercase dashed words
**When** I click **edit slug** and type my own
**Then** the title no longer changes it
**When** I click **auto**
**Then** it is re-derived from the title
→ TC-UI-030, TC-UI-033

### AC-012 — *(currently failing)* I can type a dash into my own slug
**Given** I have clicked **edit slug**
**When** I type `my-own-permalink`
**Then** the field holds `my-own-permalink`
**Actual** — it holds `myownpermalink`; every dash is deleted as I type.
→ TC-NEG-010 · [BUG-011](../../bugs/open/BUG-011-manual-slug-strips-hyphens.md)

### AC-013 — Nothing publishes without the essentials
**Given** an empty form **When** I submit **Then** I am told a title is required and nothing is sent
**Given** a title but no image **When** I submit **Then** I am told a frame is required and nothing is sent
**Given** a 9 MB image **When** I submit **Then** I am told to keep it under 8 MB and nothing is uploaded
→ TC-NEG-008, TC-NEG-009, TC-EDGE-009

### AC-014 — Editing keeps the URL
**Given** I edit an existing post and change only the title
**When** I save
**Then** no re-upload happens, the slug is unchanged, and I land on the same `/post/<slug>`
→ TC-UI-035

### AC-015 — Deleting takes two deliberate clicks
**Given** I am editing a post
**When** I click **delete post**
**Then** the button asks me to tap again and nothing is deleted
**When** I click again
**Then** the post is deleted and I return to `/`
**And** if I wait more than 4.5 s the button disarms itself
→ TC-UI-036, TC-UI-037

### AC-016 — The API returns sensible status codes
**Given** a malformed request **Then** `400`
**Given** a duplicate slug **Then** `409`
**Actual** — both return `500` with the raw internal message.
→ TC-NEG-001, TC-NEG-002, TC-NEG-003 · [BUG-013](../../bugs/open/BUG-013-api-leaks-internal-errors.md)

### AC-017 — *(currently failing)* Only the owner can change a post
**Given** I am signed in as someone else, or not signed in at all
**When** I `PUT` or `DELETE` `/api/posts/<their slug>`
**Then** the request is rejected
**Actual** — it succeeds.
→ TC-SEC-005, TC-SEC-007 · [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md)
