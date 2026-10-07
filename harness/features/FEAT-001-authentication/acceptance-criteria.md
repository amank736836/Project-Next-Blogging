# FEAT-001 · Acceptance criteria

Reviewable by a non-engineer. Each maps to at least one executed test case or one manual
scenario.

### AC-001 — A signed-out visitor cannot see a protected page
**Given** I am not signed in
**When** I open `/add-post`, `/all-posts` or `/edit-post/<any slug>`
**Then** I see the branded "opening your shelf" screen and I am taken to `/login`
**And** at no point is the protected content in the document
→ TC-UI-002, TC-UI-004

### AC-002 — A signed-in writer goes straight through
**Given** I am signed in
**When** I open `/all-posts`
**Then** the page renders immediately and no redirect happens
→ TC-UI-001

### AC-003 — No flash while the session resolves
**Given** Clerk has not finished loading
**When** any protected page mounts
**Then** the loader is shown and the protected content is not mounted
→ TC-UI-003, TC-UI-004

### AC-004 — Signed-in visitors are pushed away from guest-only screens
**Given** I am signed in
**When** a component is rendered with `authentication={false}`
**Then** I am redirected to `/`
→ TC-UI-005

### AC-005 — Navigation reflects who I am
**Given** I am signed out **When** I look at the header **Then** I see Log in and Start writing, and no Stories or Write link
**Given** I am signed in **When** I look at the header **Then** I see Stories, Write and my avatar, and no Log in
→ TC-UI-023, TC-UI-024, TC-UI-025

### AC-006 — The mobile menu is operable without a mouse
**Given** the mobile menu is open
**When** I press Escape
**Then** it closes and the page scroll lock is released, restoring the previous overflow value
→ TC-UI-027

### AC-007 — Ownership is respected
**Given** I am signed in as someone who did not write a post
**When** I view it in the archive or on its own page
**Then** no Edit control is offered
→ TC-SEC-009, TC-SEC-010

### AC-008 — *(currently failing)* The API must respect the same rules as the UI
**Given** I am not signed in
**When** I call `PUT /api/posts/<any slug>`
**Then** the request must be rejected with 401
**Actual** — the request reaches the database and succeeds.
→ TC-SEC-005, SMK-15, SMK-18 · [BUG-004](../../bugs/open/BUG-004-unauthenticated-post-api.md)
