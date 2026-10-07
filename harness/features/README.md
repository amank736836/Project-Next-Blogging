# Feature Inventory

Twelve features were identified. Every one is backed by code in `src/`; none is speculative.

| ID | Feature | Primary code | Tier | Docs |
| --- | --- | --- | --- | --- |
| FEAT-001 | Authentication & session | `src/proxy.js`, `components/{AuthLayout,AuthShell,Login,Signup}.jsx` | A | [→](FEAT-001-authentication/README.md) |
| FEAT-002 | Post authoring & editing (CRUD) | `components/PostForm/PostForm.jsx`, `api/posts/**`, `models/Post.js` | A | [→](FEAT-002-post-crud/README.md) |
| FEAT-003 | Public archive & home dashboard | `app/page.js`, `components/Landing.jsx` | B | [→](FEAT-003-public-archive/README.md) |
| FEAT-004 | Article reader | `app/post/[slug]/page.js` | A | [→](FEAT-004-article-reader/README.md) |
| FEAT-005 | Image upload | `api/upload/route.js`, `lib/cloudinary.js` | A | [→](FEAT-005-image-upload/README.md) |
| FEAT-006 | Writer's shelf | `app/all-posts/page.js` | B | [→](FEAT-006-my-shelf/README.md) |
| FEAT-007 | Marketing & legal pages | `app/{features,pricing,privacy,terms}/page.js`, `components/landing/**` | B | [→](FEAT-007-marketing-pages/README.md) |
| FEAT-008 | Contact form | `app/contact/page.js` | B | [→](FEAT-008-contact-form/README.md) |
| FEAT-009 | Theme system | `hooks/theme-context.js`, `components/ThemeBtn.jsx` | B | [→](FEAT-009-theme-system/README.md) |
| FEAT-010 | Motion & design system | `lib/motion.js`, `components/motion/**`, `app/globals.css` | B | [→](FEAT-010-motion-design-system/README.md) |
| FEAT-011 | Error & 404 handling | `app/error.js`, `app/not-found.js` | B | [→](FEAT-011-error-handling/README.md) |
| FEAT-012 | Design preview (`/demo`) | `app/demo/page.js`, `components/demo/**` | B | [→](FEAT-012-design-preview/README.md) |

## Documentation tiers

The folder structure is deliberately not uniform, because uniformity here would mean
eight near-empty files per marketing page.

**Tier A** — features with real business logic, an API surface, or security exposure.
Full set:

```text
FEAT-xxx-<name>/
├── README.md               the feature card (all 18 fields)
├── requirements.md         REQ-xxx this feature satisfies
├── behavior.md             what it does, precisely, with the code that does it
├── acceptance-criteria.md  Given/When/Then, reviewable by a non-engineer
├── test-scenarios.md       SCN-xxx catalogue for this feature
├── test-cases.md           index into test-cases/<module>/ (the cases themselves live there)
├── test-data.md            what data this feature's tests need, and where it lives
└── known-issues.md         BUG-xxx affecting this feature
```

**Tier B** — features that are mostly presentation. Four files:
`README.md` (the same feature card, plus behaviour and acceptance criteria inline),
`test-scenarios.md`, `test-cases.md`, `known-issues.md`.

## Feature card template

Every `README.md` in this folder answers the same eighteen fields:

```text
Feature:
Purpose:
User:
Entry Point:
Dependencies:
Inputs:
Outputs:
Business Rules:
Expected Behavior:
Error Handling:
Permissions:
Related APIs:
Related Database Tables:
Related UI:
Existing Tests:
Missing Tests:
Known Issues:
Status:
```

`Status:` is one of `IMPLEMENTED`, `IMPLEMENTED — UNTESTED`, `PARTIAL`, `BROKEN`.
