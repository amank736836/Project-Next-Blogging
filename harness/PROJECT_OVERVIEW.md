# Project Overview — Frame & Phrase

> Derived entirely from the repository. Line references are to commit `9d413cd`.
> Anything that could not be established from the code is marked
> `UNKNOWN / REQUIRES VALIDATION`.

## Purpose

A photography-first blogging platform. The product premise, quoted from the application's
own copy (`src/components/AuthShell.jsx`, `src/app/features/page.js`), is *"one photo, one
piece of writing"* — a writer uploads a single image, writes the prose around it, and
either publishes it to a public archive or parks it as a private draft.

The repository name is `Project-Next-Blogging`; the product name in code and metadata is
**Frame & Phrase** (`applicationName` in `src/app/layout.js`).

## Main users

| Persona | Evidence |
| --- | --- |
| **Guest / reader** | Landing page at `/`, article reading at `/post/[slug]`, marketing pages. No account required. |
| **Writer** | Signs up via Clerk, composes at `/add-post`, manages a shelf at `/all-posts`. |
| **Administrator** | **None.** There is no admin role, no admin route and no authorisation model anywhere in the codebase. `UNKNOWN / REQUIRES VALIDATION` whether one is planned. |

## Main workflows

1. **Sign up / sign in** — `/signup` and `/login` render Clerk's `<SignUp>` / `<SignIn>`
   widgets inside a branded split-screen shell.
2. **Compose** — `/add-post`: upload a frame (drag-drop or browse), title auto-derives a
   slug, write in TinyMCE, choose `active`/`inactive`, publish.
3. **Read** — `/post/[slug]`: hero image, reading rail with progress, article typography,
   author-facing Edit/Delete controls.
4. **Manage** — `/all-posts`: the writer's shelf with All / Published / Drafts tabs.
5. **Edit** — `/edit-post/[slug]`: same form, pre-filled; the slug does not change.
6. **Delete** — arm-then-confirm (two clicks, 4.5 s window) from either the article page or
   the editor.
7. **Browse as guest** — `/`, `/features`, `/pricing`, `/contact`, `/privacy`, `/terms`.
8. **Preview the design system** — `/demo`, rendered from local fixtures with no database.

## Technology stack

| Layer | Choice | Version | Where |
| --- | --- | --- | --- |
| Framework | Next.js (App Router, Turbopack) | 16.1.6 | `package.json` |
| UI library | React | 19.2.3 | `package.json` |
| Language | JavaScript (JSX in `.js` and `.jsx`) — **no TypeScript** | — | `jsconfig.json` has only a path alias |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss` | ^4 | `postcss.config.mjs`, `src/app/globals.css` |
| Auth | Clerk (`@clerk/nextjs`) | ^6.37.4 | `src/proxy.js`, `src/components/{Login,Signup,AuthLayout,AuthShell}.jsx` |
| Database | MongoDB via Mongoose | mongoose ^9.2.1 | `src/lib/db.js`, `src/models/Post.js` |
| Image storage | Cloudinary (`cloudinary` v2 SDK) | ^2.9.0 | `src/lib/cloudinary.js`, `src/app/api/upload/route.js` |
| Rich text | TinyMCE Cloud (`@tinymce/tinymce-react`) | ^6.3.0 | `src/components/RTE.jsx` |
| HTTP client | axios (browser → own API routes) | ^1.13.5 | `src/services/config.js` |
| Forms | react-hook-form | ^7.71.1 | `src/components/PostForm/PostForm.jsx` |
| Animation | GSAP + ScrollTrigger | ^3.15.0 | `src/lib/motion.js` (only importer) |
| HTML rendering | html-react-parser | ^5.2.17 | `src/app/post/[slug]/page.js:246` |
| Analytics | `@vercel/analytics` | ^2.0.1 | `src/app/layout.js` |
| Icons | lucide-react | ^0.564.0 | 18 files |
| Lint | ESLint 9 + `eslint-config-next` | ^9 / 16.1.6 | `eslint.config.mjs` |
| Tests | Vitest 3 + Testing Library + jsdom — **added by this harness** | ^3.2.7 | `harness/vitest.config.mjs` |

### Declared but unused dependencies

Verified by grepping every `import` in `src/`: **`@reduxjs/toolkit`, `react-redux`,
`firebase`, `firebase-admin` and `validator` are installed but never imported anywhere.**
Tracked as [BUG-018](bugs/open/BUG-018-unused-dependencies.md).

## Frontend

* **18 routes** (confirmed by the `next build` route table in
  [evidence/logs/build-RUN-smoke.log](evidence/logs/build-RUN-smoke.log)).
* 12 are prerendered static (`○`), 6 are dynamic (`ƒ`): the three API routes,
  `/edit-post/[slug]`, `/post/[slug]`, and the proxy.
* ~40 components under `src/components/`, organised as `ui/`, `motion/`, `landing/`,
  `loaders/`, `demo/`, `container/`, `header/`, `footer/`, `PostForm/`.
* Design system lives entirely in `src/app/globals.css` as CSS custom properties; semantic
  surface tokens are swapped by a `.dark` class on `<html>`, so components rarely need
  `dark:` variants.
* Three self-hosted variable fonts (Fraunces, Inter, JetBrains Mono) via `@fontsource-variable/*`.

## Backend

There is no separate backend process. The server side is Next.js:

| Route | Methods | File |
| --- | --- | --- |
| `/api/posts` | `GET`, `POST` | `src/app/api/posts/route.js` |
| `/api/posts/[slug]` | `GET`, `PUT`, `DELETE` | `src/app/api/posts/[slug]/route.js` |
| `/api/upload` | `POST` | `src/app/api/upload/route.js` |
| *proxy (middleware)* | all | `src/proxy.js` |

`src/proxy.js` is the Next 16 name for the middleware file — confirmed against
`node_modules/next/dist/lib/constants.js:274` (`const PROXY_FILENAME = 'proxy'`) and by the
`ƒ Proxy (Middleware)` line in the build output.

All three API routes are thin: connect → query Mongoose / stream to Cloudinary → return
JSON. There is no service layer, no DTO, no validation layer and no rate limiting on the
server.

## Database

**One collection.** `src/models/Post.js`:

| Field | Type | Constraints |
| --- | --- | --- |
| `title` | String | required |
| `slug` | String | required, **unique index** |
| `content` | String | required (raw HTML from TinyMCE) |
| `featuredImage` | String | required (Cloudinary `secure_url`) |
| `status` | String | enum `['active','inactive']`, default `'active'` |
| `userId` | String | required (Clerk user id — the source comment still says `// Firebase UID`, see [BUG-020](bugs/open/BUG-020-stale-firebase-comment.md)) |
| `createdAt` / `updatedAt` | Date | `timestamps: true` |

There are **no migrations** and no migration tool. The schema is the contract; Mongoose
creates the collection and the unique index on first use.
`UNKNOWN / REQUIRES VALIDATION`: whether an Atlas index was ever created manually.

`userId` is a plain String with **no foreign key** to any user collection — user records
live only in Clerk.

## External services

| Service | Purpose | Credentials (env) | Called from |
| --- | --- | --- | --- |
| Clerk | Sessions, sign-in/up, user identity | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | `src/proxy.js`, `ClerkProvider`, `useAuth`/`useUser` |
| MongoDB (Atlas in production) | Post storage | `MONGO_URI`, `MONGO_DB` (optional, default `blog`) | `src/lib/db.js` |
| Cloudinary | Image hosting and CDN | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | `src/lib/cloudinary.js` |
| TinyMCE Cloud | Rich text editor | `NEXT_PUBLIC_TINYMCE_API_KEY` (optional — falls back to the free tier) | `src/components/RTE.jsx` |
| Vercel Analytics | Privacy-friendly pageviews | none | `src/app/layout.js` |

## Authentication

Clerk, client-driven:

* `src/proxy.js` exports `clerkMiddleware()` **with no arguments and no route matcher
  guard**. It loads auth state on every matched request; it does **not** protect anything.
  Matcher: `["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]`.
* `<ClerkProvider>` wraps the app in `src/app/layout.js`.
* `src/components/AuthLayout.jsx` is the **only** authorisation gate: a client component
  that reads `useAuth()` and `router.push('/login')` when signed out.
* `SignIn` / `SignUp` use `routing="hash"` and cross-link via `signUpUrl` / `signInUrl`.
* `UserButton` with `afterSignOutUrl="/"`.

Covered by [TC-UI-001 … TC-UI-006](test-cases/authentication/positive.md).

## Authorization

**Effectively none at the API boundary.** This is the single most important finding in the
harness.

| Check | Where it exists | Where it does not |
| --- | --- | --- |
| Is the caller signed in? | Client components only (`AuthLayout`, `useAuth`) | ❌ `/api/posts`, `/api/posts/[slug]`, `/api/upload` |
| Is the caller the owner? | `PostCard` and `post/[slug]` compare `user.id === post.userId` to *show* controls | ❌ The API never compares anything |
| Are roles enforced? | n/a — no roles exist | ❌ |

The UI hiding an Edit button is not authorisation: a `curl` to
`DELETE /api/posts/<any-slug>` succeeds. Proven by
[TC-SEC-003 … TC-SEC-007](test-cases/post-api/negative.md) and live checks
`SMK-15`, `SMK-16`, `SMK-18`. See [BUG-004](bugs/open/BUG-004-unauthenticated-post-api.md).

## APIs

Full contract, request/response shapes and status codes:
[features/FEAT-002-post-crud/README.md](features/FEAT-002-post-crud/README.md) and
[test-scenarios/api.md](test-scenarios/api.md).

Client-side consumption is centralised in `src/services/config.js` (`PostService`), which
is the only module that calls the API from the browser.

## Important modules

| Module | Responsibility |
| --- | --- |
| `src/app/api/**` | The whole HTTP surface |
| `src/models/Post.js` | The data contract |
| `src/lib/db.js` | Cached Mongoose connection (throws at import if `MONGO_URI` is missing) |
| `src/lib/cloudinary.js` | Cloudinary v2 client configuration |
| `src/lib/motion.js` | The only GSAP import point; reduced-motion policy |
| `src/services/config.js` | Browser → API client |
| `src/components/PostForm/PostForm.jsx` | Composer: slug derivation, validation, upload, submit, delete |
| `src/components/AuthLayout.jsx` | The auth gate |
| `src/hooks/theme-context.js` | Theme state via `useSyncExternalStore` |

## Important business logic

1. **`active` vs `inactive`** — `active` is public, `inactive` is a private draft
   (`src/app/api/posts/route.js` defaults `status` to `"active"` for reads).
2. **Slug is the public identifier** — every read/update/delete is keyed on `slug`, never
   `_id`. Editing preserves the slug by design ("The URL stays put").
3. **Slug derivation** — `slugTransform()` in `PostForm.jsx:123-132`: trim → lowercase →
   strip `[^a-zA-Z\d\s]` → spaces to dashes. Applied automatically until the writer edits
   the slug; afterwards it is frozen. (The per-keystroke application in manual mode is
   [BUG-011](bugs/open/BUG-011-manual-slug-strips-hyphens.md).)
4. **Reading time** — `words / 220`, rounded, floored at 1 minute. Implemented three times
   independently: `PostCard.jsx:10-17`, `post/[slug]/page.js:115-116`, `PostForm.jsx:14-16`.
5. **Arm-then-confirm delete** — first click arms, second deletes, auto-disarm after 4500 ms.
   Implemented twice: `PostForm.jsx` and `post/[slug]/page.js`.
6. **Image limit** — 8 MB, client-side only (`PostForm.jsx:12`, enforced at `:166-167`).
7. **Contact form thresholds** — name ≥ 2 chars, email regex, message ≥ 12 chars
   (`src/app/contact/page.js:26-31`).

## Deployment architecture

* Target: **Vercel** (`README.md` §Deploy, `.vercel` in `.gitignore`).
  `UNKNOWN / REQUIRES VALIDATION`: no `vercel.json`, no CI workflow and no deployment
  configuration file exists in the repository.
* Serverless: `/api/*` route handlers run per-request; `src/lib/db.js` caches the Mongoose
  connection on `global.mongoose` to survive warm-lambda reuse.
* Static: 12 routes are prerendered at build time.
* No Docker, no infrastructure-as-code, no CI pipeline in the repo.

## Environments

| Environment | Evidence | Status |
| --- | --- | --- |
| Local dev | `npm run dev` | Documented and works |
| Preview / staging | — | `UNKNOWN / REQUIRES VALIDATION` — nothing in the repo |
| Production | `README.md` mentions Vercel and `framephrase.app` appears in UI copy | `UNKNOWN / REQUIRES VALIDATION` — no config in the repo |

## Known dependencies (runtime)

Six environment variables are required for a full boot. **All six, and their exact failure
modes, were determined by execution** — see
[test-tools/setup.md](test-tools/setup.md) §Environment contract:

| Variable | Required for | Failure mode when missing (observed) |
| --- | --- | --- |
| `MONGO_URI` | `next build` and any `/api/posts*` request | Build fails at "Collecting page data" — [BUG-017](bugs/open/BUG-017-db-throws-at-import.md) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `next build` prerendering | Build fails on `/_not-found` |
| `CLERK_SECRET_KEY` | Any request through the proxy | **Every route returns HTTP 500** — [BUG-015](bugs/open/BUG-015-missing-clerk-secret-key-500s-site.md) |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | `/api/upload` | Cloudinary rejects the upload; route returns 500 |
| `NEXT_PUBLIC_TINYMCE_API_KEY` | Editor | Falls back to the TinyMCE free tier (documented in `README.md`) |
| `MONGO_DB` | Optional | Defaults to `blog` (`src/lib/db.js:23`) |

There is **no `.env.example`** in the repository — the contract exists only as a Markdown
table in `README.md`. Tracked as [BUG-019](bugs/open/BUG-019-no-env-example.md).
