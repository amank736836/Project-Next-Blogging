# Business Rules

Invariants the application enforces — or is supposed to. Each names the exact code that
carries it, so a change there is a signal to re-check the rule.

| ID | Rule | Enforced by | Verified by |
| --- | --- | --- | --- |
| BR-01 | A post **must** have a title, slug, content, featured image and owner. | `src/models/Post.js` `required: true` | TC-DB-002, TC-DB-008 (×5), TC-NEG-001 |
| BR-02 | A slug is unique across the whole collection — not per user. | `src/models/Post.js` `unique: true` | TC-DB-004, TC-NEG-002 |
| BR-03 | Status is exactly `active` or `inactive`; anything else is rejected on create. | `src/models/Post.js` `enum` | TC-DB-003, TC-DB-009 |
| BR-04 | Status defaults to `active` — **a post is public unless the writer says otherwise.** | `src/models/Post.js` `default: "active"`, and `PostForm`'s select defaults to `active` | TC-DB-003, TC-UI-032 |
| BR-05 | `active` posts appear in the public archive; `inactive` posts do not. | `api/posts/route.js:12` (`status` defaults to `"active"`) | TC-API-001, TC-API-002 |
| BR-06 | The slug is the public identity of a post. Editing a post never changes its URL. | `services/config.js:updatePost` deliberately omits `slug`; `PostForm` does not send it | TC-API-008, TC-UI-035 |
| BR-07 | The slug is derived from the title until the writer edits it; after that it is frozen. | `PostForm.jsx:35` and `:135-138` (`slugTouched`) | TC-UI-030, TC-UI-033 |
| BR-08 | A slug is lowercase words separated by dashes; anything else is stripped. | `PostForm.jsx:123-132` `slugTransform`, plus the RHF `pattern` rule at `:206-212` | TC-UI-030, TC-NEG-010 — **and see [BUG-011](../bugs/open/BUG-011-manual-slug-strips-hyphens.md): in manual mode the same transform removes the dashes it is supposed to allow** |
| BR-09 | A featured image is required for a new post but optional when editing (the existing image is kept). | `PostForm.jsx:164` (`required: !post`) | TC-NEG-009, TC-UI-034, TC-UI-035 |
| BR-10 | An upload may not exceed 8 MB. | `PostForm.jsx:12` `MAX_MB = 8`, enforced at `:166-167` — **client-side only** | TC-EDGE-009; server side is unchecked → [BUG-008](../bugs/open/BUG-008-upload-no-server-validation.md), TC-SEC-008 |
| BR-11 | Deleting is destructive and must take two deliberate clicks, with a 4.5 s window. | `PostForm.jsx:140-153` and `post/[slug]/page.js:58-81` | TC-UI-036, TC-UI-037 |
| BR-12 | Reading time is `round(words / 220)`, never less than one minute. | `PostCard.jsx:10-17`, `post/[slug]/page.js:115-116`, `PostForm.jsx:14-16` + `:257` (three copies) | TC-UI-014, TC-EDGE-007 |
| BR-13 | Edit affordances appear only for the post's owner. | `PostCard.jsx:36-37`, `post/[slug]/page.js:33` | TC-UI-016, TC-SEC-009, TC-SEC-010 — **UI only**; the API ignores ownership → [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) |
| BR-14 | The theme follows the OS only until the visitor makes an explicit choice. | `src/hooks/theme-context.js:66-77` | TC-UI-017, TC-UI-019 |
| BR-15 | Contact messages need a name (≥ 2), a plausible email and at least 12 characters of message. | `src/app/contact/page.js:26-31` | TC-UI-007…009, TC-NEG-006, TC-NEG-007, TC-EDGE-006 |

## Rules that should exist and do not

| ID | Missing rule | Consequence | Bug |
| --- | --- | --- | --- |
| BR-16 | Only the owner may update or delete a post. | Anyone can overwrite or destroy any post | [BUG-004](../bugs/open/BUG-004-unauthenticated-post-api.md) |
| BR-17 | Only the owner may read an `inactive` post. | Every draft in the database is public | [BUG-005](../bugs/open/BUG-005-idor-draft-exposure.md), [BUG-006](../bugs/open/BUG-006-draft-readable-by-slug.md) |
| BR-18 | A write may only set fields that exist in the schema. | Arbitrary keys land in MongoDB; `status` can be set outside the enum | [BUG-007](../bugs/open/BUG-007-mass-assignment-put.md) |
| BR-19 | Rendered post HTML must be sanitised. | Stored XSS | [BUG-022](../bugs/open/BUG-022-stored-xss-post-content.md) |
| BR-20 | Title and content should have length limits. | A 1 MB body and a 2000-character title are both accepted — TC-EDGE-002 | (unfiled; tracked in [test-scenarios/edge-cases.md](../test-scenarios/edge-cases.md)) |
