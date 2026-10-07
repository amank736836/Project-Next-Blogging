# Functional scenarios

Happy paths and alternate flows. Everything here is either automated or explicitly marked
as blocked.

## Authentication — [FEAT-001](../features/FEAT-001-authentication/README.md)

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-FN-01 | A signed-in writer reaches a protected page with no redirect. | AUTOMATED | TC-UI-001 |
| SCN-FN-02 | A signed-out visitor is sent to `/login`. | AUTOMATED | TC-UI-002 |
| SCN-FN-03 | The header shows the guest action set. | AUTOMATED | TC-UI-023 |
| SCN-FN-04 | The header shows the member action set and the avatar. | AUTOMATED | TC-UI-024, TC-UI-025 |
| SCN-FN-05 | Real sign-up through the Clerk widget. | BLOCKED — needs a live Clerk tenant | — |
| SCN-FN-06 | Real sign-in and sign-out. | BLOCKED — needs a live Clerk tenant | — |

## Post authoring — [FEAT-002](../features/FEAT-002-post-crud/README.md)

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-FN-07 | The composer renders empty in publish mode. | AUTOMATED | TC-UI-029 |
| SCN-FN-08 | The slug is derived from the title as it is typed. | AUTOMATED | TC-UI-030 |
| SCN-FN-09 | The word count and reading estimate update live. | AUTOMATED | TC-UI-031 |
| SCN-FN-10 | A valid submit uploads, creates and navigates to the new post. | AUTOMATED | TC-UI-032 |
| SCN-FN-11 | The writer takes over the slug, then hands it back with **auto**. | AUTOMATED | TC-UI-033 |
| SCN-FN-12 | `POST /api/posts` creates and returns 201. | AUTOMATED | TC-API-005 |
| SCN-FN-13 | `GET /api/posts` returns published posts by default. | AUTOMATED | TC-API-001 |
| SCN-FN-14 | `GET /api/posts?status=` and `?userId=` filter correctly. | AUTOMATED | TC-API-002, TC-API-003 |
| SCN-FN-15 | Edit mode pre-fills every field and drops the image requirement. | AUTOMATED | TC-UI-034 |
| SCN-FN-16 | Saving without a new image keeps the existing one and the slug. | AUTOMATED | TC-UI-035 |
| SCN-FN-17 | `PUT /api/posts/{slug}` updates and returns the new document. | AUTOMATED | TC-API-008 |
| SCN-FN-18 | `DELETE /api/posts/{slug}` removes and confirms. | AUTOMATED | TC-API-010 |
| SCN-FN-19 | Delete takes two deliberate clicks and disarms after 4.5 s. | AUTOMATED | TC-UI-036, TC-UI-037 |
| SCN-FN-20 | Create a post through the real UI and see it in MongoDB. | BLOCKED — no MongoDB | — |

## Reading — [FEAT-004](../features/FEAT-004-article-reader/README.md)

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-FN-21 | `GET /api/posts/{slug}` returns the document. | AUTOMATED | TC-API-006 |
| SCN-FN-22 | An unknown slug 404s with a stable message. | AUTOMATED | TC-API-007 |
| SCN-FN-23 | The article renders with rail, hero, body and byline. | MANUAL — page at 0% coverage | — |
| SCN-FN-24 | Copy link writes the URL and reverts after 2.2 s. | MANUAL | — |

## Archive & shelf — [FEAT-003](../features/FEAT-003-public-archive/README.md), [FEAT-006](../features/FEAT-006-my-shelf/README.md)

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-FN-25 | A card links to the post and shows date and reading time. | AUTOMATED | TC-UI-013, TC-UI-014 |
| SCN-FN-26 | A draft card carries a `draft` badge. | AUTOMATED | TC-UI-015 |
| SCN-FN-27 | Home search filters on title and slug. | MANUAL — page at 0% coverage | — |
| SCN-FN-28 | The shelf's tabs filter the grid. | MANUAL — **fails today** (BUG-001) | — |

## Upload — [FEAT-005](../features/FEAT-005-image-upload/README.md)

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-FN-29 | A valid upload returns `{ fileId, url }`. | AUTOMATED | TC-API-012 |
| SCN-FN-30 | Every asset lands in `blog_posts`. | AUTOMATED | TC-API-013 |
| SCN-FN-31 | A real Cloudinary round-trip produces a servable URL. | BLOCKED — no Cloudinary account | — |

## Theme & contact — [FEAT-009](../features/FEAT-009-theme-system/README.md), [FEAT-008](../features/FEAT-008-contact-form/README.md)

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-FN-32 | Toggling the theme flips class, `colorScheme` and `localStorage` together. | AUTOMATED | TC-UI-018 |
| SCN-FN-33 | A valid contact submission clears the form and confirms. | AUTOMATED | TC-UI-009 |
| SCN-FN-34 | The contact topic chips are single-select. | AUTOMATED | TC-UI-011 |

**28 of 34 automated.** The six that are not are blocked on a Clerk tenant, a MongoDB
instance, a Cloudinary account, or a page component that has no coverage yet.
