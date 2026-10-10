# UI scenarios

Components, forms, navigation and accessibility. The DOM suite runs in jsdom with reduced
motion enabled — see [../TESTING_STRATEGY.md](../TESTING_STRATEGY.md) §Environment strategy
for why, and what that means for the results.

## The auth gate — [FEAT-001](../features/FEAT-001-authentication/README.md)

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-UI-01 | Signed-in → children render, no redirect. | AUTOMATED | TC-UI-001 |
| SCN-UI-02 | Signed-out → redirect to `/login`, no content. | AUTOMATED | TC-UI-002 |
| SCN-UI-03 | Loading → branded loader, no redirect, no content. | AUTOMATED | TC-UI-003 |
| SCN-UI-04 | Loading → signed-out must not flash content. | AUTOMATED | TC-UI-004 |
| SCN-UI-05 | Inverse gate redirects a signed-in visitor to `/`. | AUTOMATED | TC-UI-005 |
| SCN-UI-06 | Inverse gate renders children for a guest. | AUTOMATED | TC-UI-006 |

## Header and navigation

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-UI-07 | Guest action set. | AUTOMATED | TC-UI-023 |
| SCN-UI-08 | The three public marketing links are always present. | AUTOMATED | TC-UI-024 |
| SCN-UI-09 | Member action set replaces the guest one. | AUTOMATED | TC-UI-025 |
| SCN-UI-10 | The Clerk `UserButton` renders only when signed in. | AUTOMATED | TC-UI-026 |
| SCN-UI-11 | The mobile sheet toggles `aria-expanded` and locks body scroll. | AUTOMATED | TC-UI-027 |
| SCN-UI-12 | Escape closes the sheet and restores the previous `overflow`. | AUTOMATED | TC-UI-028 |

## PostCard

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-UI-13 | Title renders; the whole tile links to `/post/<slug>`. | AUTOMATED | TC-UI-013 |
| SCN-UI-14 | Reading time at ~220 wpm. | AUTOMATED | TC-UI-014 |
| SCN-UI-15 | A draft badge appears for `inactive`. | AUTOMATED | TC-UI-015 |
| SCN-UI-16 | The Edit link appears only for the owner. | AUTOMATED | TC-UI-016 |

## Composer — [FEAT-002](../features/FEAT-002-post-crud/README.md)

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-UI-17 | Renders empty in publish mode. | AUTOMATED | TC-UI-029 |
| SCN-UI-18 | The slug is derived from the title. | AUTOMATED | TC-UI-030 |
| SCN-UI-19 | Word count and reading estimate update live. | AUTOMATED | TC-UI-031 |
| SCN-UI-20 | A valid submit uploads, creates and navigates. | AUTOMATED | TC-UI-032 |
| SCN-UI-21 | Manual slug mode, then **auto** restores derivation. | AUTOMATED | TC-UI-033 |
| SCN-UI-22 | Edit mode pre-fills and drops the image requirement. | AUTOMATED | TC-UI-034 |
| SCN-UI-23 | Save without re-uploading keeps image and slug. | AUTOMATED | TC-UI-035 |
| SCN-UI-24 | Arm-then-confirm delete. | AUTOMATED | TC-UI-036 |
| SCN-UI-25 | The armed delete disarms at 4.5 s. | AUTOMATED | TC-UI-037 |

## Theme — [FEAT-009](../features/FEAT-009-theme-system/README.md)

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-UI-26 | Starts in light mode with nothing stored. | AUTOMATED | TC-UI-017 |
| SCN-UI-27 | Toggle flips class, context, `colorScheme` and storage together. | AUTOMATED | TC-UI-018 |
| SCN-UI-28 | Toggling twice returns to light. | AUTOMATED | TC-UI-019 |
| SCN-UI-29 | `setTheme` is idempotent. | AUTOMATED | TC-UI-020 |
| SCN-UI-30 | `mounted` is true once hydrated. | AUTOMATED | TC-UI-021 |
| SCN-UI-31 | `useTheme()` outside a provider degrades safely. | AUTOMATED | TC-UI-022 |

## Contact form — [FEAT-008](../features/FEAT-008-contact-form/README.md)

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-UI-32 | An empty submit names all three problems. | AUTOMATED | TC-UI-007 |
| SCN-UI-33 | The failing field is marked `aria-invalid`. | AUTOMATED | TC-UI-008 |
| SCN-UI-34 | A valid submit clears the form and confirms. | AUTOMATED | TC-UI-009 |
| SCN-UI-35 | "Write another" returns to an empty form. | AUTOMATED | TC-UI-010 |
| SCN-UI-36 | Topic chips are single-select with `aria-pressed`. | AUTOMATED | TC-UI-011 |
| SCN-UI-37 | Nothing is transmitted. | AUTOMATED — **documents BUG-010** | TC-UI-012 |

## Not covered, and what it would take

| SCN ID | Target | Status | Notes |
| --- | --- | --- | --- |
| SCN-UI-38 | `app/page.js` — search, chips, counts, sort, two empty states | NOT_EXECUTED | 148 lines, 0% covered. Needs `@clerk/nextjs` + `@/services/config` mocked together. |
| SCN-UI-39 | `splitWords` and `MOTION` in `lib/motion.js` | NOT_EXECUTED | Pure functions, ~15 lines of test, no mocks. Cheapest win available. |
| SCN-UI-40 | `app/all-posts/page.js` — tabs, stats, three empty states | NOT_EXECUTED | 120 lines, 0%. Also the regression test for BUG-001. |
| SCN-UI-41 | `app/post/[slug]/page.js` — rail, hero, byline, copy link, back to top | NOT_EXECUTED | 308 lines, 0%. The largest single gap. |
| SCN-UI-42 | `app/edit-post/[slug]/page.js` | NOT_EXECUTED | 67 lines, 0% |
| SCN-UI-43 | `app/error.js` and `app/not-found.js` | NOT_EXECUTED | Both are plain client components; easy to test |
| SCN-UI-44 | `components/ThemeBtn.jsx` | NOT_EXECUTED | 2.15% covered |
| SCN-UI-45 | `components/AuthShell.jsx`, `Login.jsx`, `Signup.jsx` | BLOCKED | Thin wrappers around Clerk widgets |
| SCN-UI-46 | Every landing component (`Hero`, `FeatureGrid`, `HowItWorks`, `Manifesto`, `CtaBand`) | NOT_EXECUTED | Presentational; excluded from coverage |
| SCN-UI-47 | Keyboard-only traversal of the composer | NOT_EXECUTED | Needs a browser for meaningful focus assertions |
| SCN-UI-48 | Colour contrast in both themes | BLOCKED | No browser |
| SCN-UI-49 | Responsive breakpoints | BLOCKED | jsdom has no layout |

**37 of 49 automated.**

## Accessibility assertions that *are* made

These are worth calling out because they are real, passing assertions rather than good
intentions:

* `aria-invalid="true"` on a failing field — TC-UI-008
* `aria-pressed` on filter/topic chips — TC-UI-011, TC-UI-027
* `aria-expanded` / `aria-controls` / `aria-label` on the mobile menu toggle — TC-UI-027
* `aria-label="Read: <title>"` on the full-tile card link — TC-UI-013
* The skip link in `app/layout.js` (`<a href="#main" class="skip-link">`) — verified by
  inspection, **not** tested
* Body scroll lock is released with the *previous* value, not blindly cleared — TC-UI-028
