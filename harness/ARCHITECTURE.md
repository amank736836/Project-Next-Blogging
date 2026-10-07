# Architecture — Frame & Phrase

All statements below were checked against source at commit `9d413cd`.

## System context

```text
                     ┌──────────────────────────────────────────────┐
   Browser ─────────▶│  Next.js 16 (App Router) on Vercel            │
                     │                                              │
                     │  src/proxy.js  →  clerkMiddleware()           │
                     │       │        (loads auth, protects nothing) │
                     │       ▼                                      │
                     │  12 static routes + 3 dynamic pages           │
                     │  3 API route handlers                         │
                     └───┬──────────────┬──────────────┬────────────┘
                         │              │              │
                ┌────────▼──────┐ ┌─────▼──────┐ ┌─────▼──────────┐
                │  MongoDB      │ │ Cloudinary │ │ Clerk Frontend │
                │  (Atlas)      │ │            │ │ API            │
                │  1 collection │ │ blog_posts │ │                │
                │  `posts`      │ │  folder    │ │  sessions/users│
                └───────────────┘ └────────────┘ └────────────────┘
                                                        ▲
                             Browser ─── Clerk JS SDK ──┘
                             (sign-in, sign-up, session refresh)
```

TinyMCE Cloud is loaded directly by the browser from `cdn.tiny.cloud`
(`@tinymce/tinymce-react`), and Vercel Analytics posts from the browser. Neither is
proxied through the app.

## Request paths

### 1. Page request

```text
GET /post/fog-on-the-lake-at-six
  → src/proxy.js (clerkMiddleware) — attaches auth to the request, never rejects
  → src/app/post/[slug]/page.js — 'use client', server-renders a skeleton
  → hydrate → useEffect → postService.getPost(slug)
  → axios GET /api/posts/<slug>
  → route handler → dbConnect() → Post.findOne({ slug })
  → JSON → setPost() → render
```

Every data-bearing page follows this shape: **the server renders a shell, the client fetches
the data.** There is no `generateStaticParams`, no server-side data fetching and no React
Server Component that touches the database. Consequence: no page has real SEO content for a
post, and first paint always shows a skeleton. Verified in
`src/app/post/[slug]/page.js:36-53` and `src/app/page.js:26-38`.

### 2. API request

```text
axios → /api/posts[?]
  → src/proxy.js
  → route handler: try { await dbConnect(); … } catch (e) { 500 { error: e.message } }
  → Mongoose → MongoDB
```

Every handler has the identical structure and the identical failure mode: **any** exception
— validation, duplicate key, connection, malformed JSON — becomes
`500 { "error": <raw message> }`. See [BUG-013](bugs/open/BUG-013-api-leaks-internal-errors.md).

### 3. Image upload

```text
PostForm submit
  → postService.uploadFile(file)  →  POST /api/upload (multipart)
  → route reads formData.get('file') → arrayBuffer → Buffer
  → cloudinary.uploader.upload_stream({ folder: 'blog_posts' })
  → 200 { fileId: public_id, url: secure_url }
  → then POST /api/posts with featuredImage = url
```

Two sequential requests, **not transactional**: if the create fails after a successful
upload, the image is orphaned in Cloudinary. No cleanup, no reference counting.

## Data model

One Mongoose model, `Post`. See [features/FEAT-002-post-crud/README.md](features/FEAT-002-post-crud/README.md)
for the full field table and [automation/database/post-schema.test.js](automation/database/post-schema.test.js)
for the enforced contract (18 tests).

```text
posts
 ├── _id            ObjectId
 ├── title          String   required
 ├── slug           String   required, UNIQUE INDEX   ← the public identifier
 ├── content        String   required, raw HTML
 ├── featuredImage  String   required, Cloudinary secure_url
 ├── status         String   enum ['active','inactive'], default 'active'
 ├── userId         String   required, Clerk user id, NO foreign key
 ├── createdAt      Date     timestamps: true
 └── updatedAt      Date     timestamps: true
```

No migrations, no seeds, no secondary indexes beyond `slug`.

## Component architecture

```text
src/
├── app/                     routes only — 12 pages, 3 API routes, layout, error, 404
├── components/
│   ├── index.js             barrel used by pages
│   ├── PostForm/            the composer (highest-complexity client component)
│   ├── header/ footer/ container/
│   ├── ui/                  Ambient, PageHeader, PageShell, EmptyShelf, LegalLayout, ScrollProgress
│   ├── motion/              Reveal, SplitHeadline, Effects (Tilt, Parallax, Marquee, DrawSvg, CountUp, Magnetic, Spotlight)
│   ├── landing/             Hero, FeatureGrid, HowItWorks, Manifesto, CtaBand
│   ├── loaders/             Loader, Skeleton
│   ├── demo/                DemoPreview + fixtures (the /demo route)
│   └── *.jsx                AuthLayout, AuthShell, Login, Signup, PostCard, RTE, Button, Input, Select, Logo, BrandMark, ThemeBtn
├── hooks/theme-context.js
├── lib/                     db.js, cloudinary.js, motion.js
├── models/Post.js
├── services/config.js       PostService — the only browser→API client
└── proxy.js                 Next 16 middleware
```

State management is **local component state only**. Redux Toolkit and react-redux are
installed but unused ([BUG-018](bugs/open/BUG-018-unused-dependencies.md)).

## Cross-cutting concerns

### Theme

`src/hooks/theme-context.js` mirrors `<html class="dark">` through
`useSyncExternalStore`, so there is exactly one source of truth. An inline script in
`src/app/layout.js` reads `localStorage.themeMode` before first paint to avoid a flash.
Follows `prefers-color-scheme` only until the visitor chooses explicitly.
Covered by [TC-UI-017 … TC-UI-022](test-cases/theme/positive.md).

### Motion

`src/lib/motion.js` is the **only** module that imports GSAP. `gsapOnce()` registers
ScrollTrigger lazily; `useMotionEffect` scopes every tween to a `gsap.context()` that is
reverted on unmount. `usePrefersReducedMotion()` is the single permission check, and
`build` never runs when it returns true.

> **Harness note.** The DOM test suite deliberately runs with
> `prefers-reduced-motion: reduce` reporting `true`. This is a genuine supported mode of
> the application, and it keeps GSAP out of jsdom — where GSAP's ticker takes focus away
> from the element under test and truncates `userEvent` typing mid-string. Measured: with
> GSAP active, typing 23 characters into the editor landed between 1 and 6 characters at
> random; with reduced motion on, all 23 landed. See
> [automation/utilities/setup.js](automation/utilities/setup.js).

### Error handling

| Layer | Mechanism |
| --- | --- |
| Route-level | `src/app/error.js` — branded boundary with `reset()` and a truncated `error.message` |
| Missing route | `src/app/not-found.js` — branded 404 |
| API | `try/catch` → `500 { error }` in every handler |
| Client fetch | `src/services/config.js` logs and **rethrows**; callers decide |
| List pages | `page.js` / `all-posts/page.js` catch and fall back to `setPosts([])` |
| `post/[slug]` | Catches and `router.push('/')` |
| `PostForm.submit` | Catches, logs, resets `loading` — **no user-visible error** |
| `post/[slug].deletePost` | `try/finally` with **no catch** → unhandled rejection ([BUG-021](bugs/open/BUG-021-unhandled-rejection-on-delete.md)) |

### Security posture

See [test-scenarios/security.md](test-scenarios/security.md) and
[bugs/open/](bugs/open/) — BUG-004 through BUG-008 and BUG-014 are all security findings.

Summary of the server-side posture, all verified by execution:

* No authentication on any `/api/*` route.
* No authorisation check anywhere server-side.
* No input validation layer; `Post.create(body)` and `findOneAndUpdate({slug}, body)` pass
  the request body straight through.
* No HTML sanitisation on `content`, which is later rendered by `html-react-parser`.
* No rate limiting, no CORS policy, no CSP, no HSTS, no `X-Frame-Options`,
  no `X-Content-Type-Options`, no `Referrer-Policy`, no `Permissions-Policy`,
  no `Cross-Origin-Opener-Policy`. `X-Powered-By: Next.js` is sent.
  Header inventory recorded in
  [test-results/latest/smoke-result.json](test-results/latest/smoke-result.json) (`SMK-19`).

## Build and runtime

```text
npm run build
  1. Turbopack compile                                  ~10.5 s
  2. TypeScript check (no-op — no TS in the project)
  3. Collect page data   ← imports src/lib/db.js; THROWS without MONGO_URI
  4. Generate static pages (16/16)  ← prerenders /_not-found; THROWS without
  5. Route table emitted            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

Full verified output: [evidence/logs/build-RUN-smoke.log](evidence/logs/build-RUN-smoke.log).

`next start` additionally requires `CLERK_SECRET_KEY`, because the proxy runs on every
non-asset request — without it every route, including `/features`, returns a bare
`500 Internal Server Error`.
Evidence: [evidence/logs/RUN-2026-10-07-001-missing-clerk-secret-key.log](evidence/logs/RUN-2026-10-07-001-missing-clerk-secret-key.log).

## What is deliberately *not* here

* No TypeScript, no type contracts at any boundary.
* No server-side validation library (`zod`, `yup`, `joi` are absent).
* No API versioning.
* No pagination on `GET /api/posts` — it returns every matching document.
* No caching headers on API responses; no `revalidate` on data pages.
* No CI configuration, no Dockerfile, no IaC.
* No logging or observability beyond `console.error`.
