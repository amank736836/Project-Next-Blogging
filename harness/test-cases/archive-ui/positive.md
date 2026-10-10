# Archive UI — positive cases

Features: FEAT-003 (card, navigation) · FEAT-001 (header action set)

## TC-UI-013 — The tile links to the article with an accessible name

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-013 |
| Title | The tile links to the article with an accessible name |
| Feature | [FEAT-003](../../features/FEAT-003-public-archive/README.md) |
| Requirement | REQ-011 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | `SEED_ARCHIVE[0]` |
| Steps | 1. Render `<PostCard post={post} />` 2. Assert the title text is present 3. Find the link 4. Assert `href` is `/post/<slug>` 5. Assert its accessible name is `Read: <title>` |
| Expected Result | One link, correct href, accessible label |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-card.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The whole tile is one `<a>`; the `aria-label` is what a screen reader announces |

## TC-UI-014 — Reading time is estimated at 220 wpm

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-014 |
| Title | Reading time is estimated at 220 wpm |
| Feature | [FEAT-003](../../features/FEAT-003-public-archive/README.md) |
| Requirement | REQ-011 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | A post whose `content` is 660 words |
| Steps | 1. Render the card 2. Assert the meta line contains `~3 min read` |
| Expected Result | `~3 min read` |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-card.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | `Math.max(1, Math.round(words/220))` |

## TC-UI-015 — A draft is badged; a published post is not

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-015 |
| Title | A draft is badged; a published post is not |
| Feature | [FEAT-003](../../features/FEAT-003-public-archive/README.md) |
| Requirement | REQ-016 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | One `inactive` and one `active` post |
| Steps | 1. Render the inactive card, assert the draft badge 2. Render the active card, assert no badge |
| Expected Result | Badge on the draft only |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-card.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The condition is `status !== 'active'`, so any future status also badges as a draft |

## TC-UI-016 — The Edit link appears only for the post's author

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-016 |
| Title | The Edit link appears only for the post's author |
| Feature | [FEAT-003](../../features/FEAT-003-public-archive/README.md) |
| Requirement | REQ-023 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | A post owned by `USER_A`; the signed-in user is `USER_A` |
| Steps | 1. Render with `currentUserId = USER_A` 2. Assert an Edit link to `/edit-post/<slug>` 3. Re-render with a different id 4. Assert it is gone |
| Expected Result | Present for the owner, absent otherwise |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/post-card.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | UI only — the API does not check ownership (TC-SEC-005) |

## TC-UI-023 — A guest sees `Log in` and `Start writing`

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-023 |
| Title | A guest sees `Log in` and `Start writing` |
| Feature | [FEAT-001](../../features/FEAT-001-authentication/README.md) |
| Requirement | REQ-014 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | Signed-out Clerk state |
| Steps | 1. Render `<Header />` 2. Assert `Log in` and `Start writing` are present 3. Assert `Stories` and `Write` are absent |
| Expected Result | Guest action set only |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/header-nav.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-UI-024 — The three public marketing links are always present

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-024 |
| Title | The three public marketing links are always present |
| Feature | [FEAT-001](../../features/FEAT-001-authentication/README.md) |
| Requirement | REQ-018 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | Either auth state |
| Steps | 1. Render signed out, assert the three links 2. Re-render signed in, assert they are still there |
| Expected Result | Features, Pricing and Demo in both states |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/header-nav.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-UI-025 — A member sees `Stories` and `Write` instead

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-025 |
| Title | A member sees `Stories` and `Write` instead |
| Feature | [FEAT-001](../../features/FEAT-001-authentication/README.md) |
| Requirement | REQ-014 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | Signed-in Clerk state |
| Steps | 1. Render `<Header />` 2. Assert `Stories` and `Write` 3. Assert `Log in` and `Start writing` are gone |
| Expected Result | Member action set only |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/header-nav.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | — |

## TC-UI-026 — The Clerk `UserButton` renders only when signed in

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-026 |
| Title | The Clerk `UserButton` renders only when signed in |
| Feature | [FEAT-001](../../features/FEAT-001-authentication/README.md) |
| Requirement | REQ-014 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | Both auth states |
| Steps | 1. Render signed in, assert the `UserButton` test id 2. Render signed out, assert it is absent |
| Expected Result | Present only when signed in |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/header-nav.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The mock renders a stable `data-testid`; the real widget is a Clerk component |

## TC-UI-027 — The mobile sheet toggles `aria-expanded` and locks body scroll

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-027 |
| Title | The mobile sheet toggles `aria-expanded` and locks body scroll |
| Feature | [FEAT-001](../../features/FEAT-001-authentication/README.md) |
| Requirement | REQ-014 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | Signed-in state, viewport-independent |
| Steps | 1. Assert `aria-expanded="false"` 2. Click the toggle 3. Assert `aria-expanded="true"` 4. Assert `document.body.style.overflow === 'hidden'` |
| Expected Result | Expanded, scroll locked |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/header-nav.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | `getAllByRole('button', …)[0]` — the desktop and mobile trees both contain matches |

## TC-UI-028 — Escape closes the sheet and restores the previous `overflow`

| Field | Value |
| --- | --- |
| Test Case ID | TC-UI-028 |
| Title | Escape closes the sheet and restores the previous `overflow` |
| Feature | [FEAT-001](../../features/FEAT-001-authentication/README.md) |
| Requirement | REQ-014 |
| Preconditions | `@vitest-environment jsdom`; Clerk and `next/navigation` mocked; `prefers-reduced-motion` reported as matching so GSAP does not run |
| Test Data | The sheet open; `document.body.style.overflow` pre-set to `'auto'` |
| Steps | 1. Open the sheet 2. Press Escape 3. Assert `aria-expanded="false"` 4. Assert `document.body.style.overflow` is `'auto'`, not `''` |
| Expected Result | Closed; previous value restored |
| Actual Result | As expected |
| Status | PASS |
| Automation | AUTOMATED |
| Test File | `automation/ui/header-nav.test.jsx` |
| Run ID | RUN-2026-10-07-001 |
| Evidence | `test-results/latest/vitest-results.json` |
| Notes | The component restores the value it captured rather than clearing it — worth guarding |
