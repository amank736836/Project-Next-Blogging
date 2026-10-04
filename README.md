# Frame & Phrase

A premium blogging platform where snapshots tell stories and prose finds its tranquil home.
Next.js 16 (App Router) · Tailwind CSS v4 · Clerk · MongoDB · Cloudinary · TinyMCE · GSAP.

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Create `.env.local` (gitignored) with:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string (`MONGO_DB` optional, defaults to `blog`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk auth |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | image uploads |
| `NEXT_PUBLIC_TINYMCE_API_KEY` | rich text editor (optional — falls back to the free tier) |

Scripts: `npm run dev` · `npm run build` · `npm run start` · `npm run lint`.

### Reviewing the UI without a database

`/demo` renders the archive grid, the full article layout and the interface kit from
local fixtures (`src/components/demo/fixtures.js`) — no Mongo, no Cloudinary, no
account. It is `noindex` and not linked from the site navigation; use it to check
new components in both themes before wiring them up.

---

## Design system

Everything lives in `src/app/globals.css`, driven by tokens rather than per-component
colour choices — so a component written once works in both themes.

**Type.** Three self-hosted variable fonts (no third-party requests, no layout shift):

| Token | Family | Used for |
| --- | --- | --- |
| `--font-display` | Fraunces Variable | headlines, card titles, pull-quotes |
| `--font-sans` | Inter Variable | body copy, UI |
| `--font-mono` | JetBrains Mono Variable | kickers, metadata, slugs |

Fluid display sizes ship as font-size tokens, so they are plain utilities:
`text-hero`, `text-hero-sm`, `text-section`, `text-wordmark`.

**Colour.** Semantic surfaces (`surface`, `surface-1/2/3`, `fg`, `muted`, `faint`,
`line`, `accent`) are CSS variables swapped by the `.dark` class — meaning almost no
component needs a `dark:` variant. Raw ramps (`ink-*`, `brand-*`, `ember-*`) are
available for the rare cases that need them. The palette is lifted from the logo:
camera-frame navy plus neon-nib cyan, warmed by a little amber.

**Surfaces & controls.** Reusable classes: `.glass`, `.card`, `.surface-card`,
`.btn` + `.btn-primary|ghost|danger|subtle`, `.field`, `.field-label`, `.float-wrap`,
`.kicker`, `.link-line`, `.rule-draw`, `.spotlight`, `.ring-grad`, `.skeleton`,
`.prose-fp` (article typography with drop cap, pull-quotes, code and tables).

**Motion.** One vocabulary: `expo.out`, ~0.9s reveals, 0.06s stagger, defined as
`--ease-*` tokens. Every animation is disabled under
`prefers-reduced-motion: reduce` — GSAP helpers skip entirely, so nothing is ever
hidden from someone who opted out.

---

## Motion API

`src/lib/motion.js` is the only place GSAP is imported. It registers the plugin
once, scopes every tween to a GSAP context (auto-reverted on unmount, so route
changes never leak ScrollTriggers) and runs in a layout effect so content does not
flash before animating.

```jsx
const { ref } = useMotionEffect((g, node) => {
  g.from(node.querySelectorAll('li'), {
    y: 24, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out',
    scrollTrigger: { trigger: node, start: 'top 86%', once: true },
  });
}, []);
// <ul ref={ref}> …
```

| Helper | What it does |
| --- | --- |
| `useMotionEffect(build, deps)` | scoped, auto-reverted GSAP context (returns `{ ref, reduced }`) |
| `useScrollInfo(id?)` | page or element scroll progress (drives the progress bars) |
| `useInView()` / `useCountUp()` | in-view state, and numbers that count up |
| `useMagnetic()` / `usePointerVars()` | cursor-follow lean and `--mx/--my` for CSS spotlights |
| `usePrefersReducedMotion()` | the single source of truth for motion permission |
| `splitWords()` / `MOTION` | shared timing constants and text splitting |

Declarative wrappers in `src/components/motion/`:

```jsx
<Reveal stagger={0.07}>…children rise in sequence…</Reveal>
<Reveal as="section" blur>…fades up from a blur…</Reveal>

<SplitHeadline text="Where every snapshot finds its sentence." accent="sentence." />
<Marquee duration={30}>{items}</Marquee>
<Parallax speed={12}><Image … /></Parallax>
<Tilt depth={6}><PostCard … /></Tilt>
<Magnetic strength={0.2}><Button>Start writing</Button></Magnetic>
<CountUp value={480} suffix="+" />
<DrawSvg viewBox="0 0 24 24" play="auto"><path d="…" /></DrawSvg>
```

`DrawSvg` self-draws any `path`/`line`/`circle` it contains — it powers the vector
brand mark (`BrandMark`), the empty state, section rules and the success checkmark.

### Ambient layer

`src/components/ui/Ambient.jsx` renders three drifting light fields, an engineering
grid and film grain once, behind everything, and nudges them with the cursor. It is
`position: fixed`, `pointer-events: none` and demands no per-page setup.

---

## Routes

| Route | Notes |
| --- | --- |
| `/` | marketing landing for guests; archive dashboard (search, status filters) when signed in |
| `/post/[slug]` | article: sticky reading rail, parallax hero, article typography, arm-then-confirm delete |
| `/all-posts` | the writer's own shelf with published/draft tabs |
| `/add-post`, `/edit-post/[slug]` | editor: drag-and-drop frame upload, live slug, word count, status |
| `/features`, `/pricing`, `/contact` | marketing pages (pricing toggle, FAQ accordion, validated contact form) |
| `/privacy`, `/terms` | long-form legal layout with a section index that tracks scroll |
| `/demo` | fixture-driven design preview (see above) |
| `not-found`, `error` | branded 404 and error boundary |

## Deploy

Deploys cleanly to Vercel. Set the environment variables above in the project
settings; `/api/*` routes require Mongo and Cloudinary at runtime.
