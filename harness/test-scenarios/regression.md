# Regression scenarios

What a change is most likely to break. Run this set before merging anything that touches the
listed file.

| SCN ID | Change to… | Would break… | Guard | Status |
| --- | --- | --- | --- | --- |
| SCN-REG-01 | `slugTransform` in `PostForm.jsx` | Slug derivation for every new post | TC-UI-030 | AUTOMATED |
| SCN-REG-02 | `src/models/Post.js` | Every write path, silently | TC-DB-001…009 | AUTOMATED |
| SCN-REG-03 | `html-react-parser` usage in `post/[slug]` | Reader safety | TC-EDGE-003 pins that markup is stored verbatim | PARTIAL |
| SCN-REG-04 | `src/components/AuthLayout.jsx` | Every protected route | TC-UI-001…006 | AUTOMATED |
| SCN-REG-05 | `src/hooks/theme-context.js` | Theme persistence and the pre-paint contract | TC-UI-017…022 | AUTOMATED |
| SCN-REG-06 | `PostCard.readingTime` | Reading estimates across the archive | TC-UI-014, TC-EDGE-007 | AUTOMATED |
| SCN-REG-07 | `src/app/api/posts/route.js` query handling | The public/private split — the only thing keeping drafts out of the archive | TC-API-001, TC-API-002 | AUTOMATED |
| SCN-REG-08 | `src/app/api/upload/route.js` | Every featured image | TC-API-012…014 | AUTOMATED |
| SCN-REG-09 | The contact validation thresholds | The only hand-written validation in the app | TC-UI-007…009, TC-EDGE-006 | AUTOMATED |
| SCN-REG-10 | `src/components/header/Header.jsx` | Navigation for every persona, desktop and mobile | TC-UI-023…028 | AUTOMATED |
| SCN-REG-11 | `src/proxy.js` matcher | Route protection, static asset serving, API reachability | SMK-01…12 | AUTOMATED (live) |
| SCN-REG-12 | `next.config.mjs` `remotePatterns` | Every featured image | — | NOT_EXECUTED |
| SCN-REG-13 | `package.json` dependency versions | Build and boot | `npm run build`, SMK-01…12 | AUTOMATED |
| SCN-REG-14 | `src/lib/db.js` caching | Warm-start latency, and outage recovery | — | NOT_EXECUTED (see BUG-012) |

**11 of 14 automated.**

## The two highest-risk changes in the repository

1. **Anything touching the `status` default in `api/posts/route.js`.** That one line
   (`const status = searchParams.get("status") || "active"`) is the only thing preventing
   the public archive from serving every draft in the database. `TC-API-001` guards it.

2. **Anything touching `AuthLayout`'s `blocked` expression.** Removing `!isLoaded` would
   mount protected content for one frame on every slow auth round-trip. `TC-UI-004` exists
   solely to catch that.
