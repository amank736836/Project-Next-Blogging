# FEAT-004 · Behavior

## Load sequence (`app/post/[slug]/page.js:36-53`)

```text
params.slug  ──(falsy)──▶  router.push('/')
     │
     └─▶ postService.getPost(slug)
              ├─ resolved with data ─▶ setPost(data)
              ├─ resolved falsy     ─▶ router.push('/')
              └─ rejected           ─▶ console.error + router.push('/')
              finally ─▶ setLoading(false)
```

An `alive` flag guards every setter so a fast navigation cannot set state on an unmounted
component.

While `loading` is true the page renders `ArticleSkeleton`. If `post` is still null after
loading, it renders "That frame is not on the shelf." with a link home.

## Derived values

| Value | Calculation | Source |
| --- | --- | --- |
| `words` | strip tags → split on whitespace → count | line 118 |
| `minutes` | `max(1, round(words / 220))` | line 119 |
| `date` | `new Date(post.createdAt)` or `null` | line 120 |
| `isAuthor` | `post && user ? post.userId === user.id : false` | line 31 |

## Reading rail

A sticky bar (`top-16`, `md:top-[4.25rem]`) carrying `ScrollProgress targetId="article-body"`.
The article root has `id="article-body"`; the progress bar measures that element's travel
through the viewport.

## Author controls

Rendered inside the hero `<figcaption>` only when `isAuthor`:
a `Link` to `/edit-post/<slug>` and a delete button.

Delete is arm-then-confirm:
```js
if (!confirming) { setConfirming(true); return; }   // first click
setDeleting(true);
try { const status = await postService.deletePost(post.slug); if (status) router.push('/'); }
finally { setDeleting(false); setConfirming(false); }
```
A 4500 ms timer disarms. `try/finally` without `catch` → a rejection escapes (BUG-021).

## Copy link

`navigator.clipboard.writeText(window.location.href)`; on success a 2.2 s "Link copied"
state; a thrown clipboard error is swallowed deliberately.

## Back to top

A separate component; a passive scroll listener flips visibility at `window.scrollY > 900`.
It is not rendered at all when `usePrefersReducedMotion()` is true.

## Content rendering

```jsx
<div className="prose-fp lead mx-auto mt-12 max-w-2xl">{parse(post.content)}</div>
```

`html-react-parser` converts HTML to React elements. It does **not** sanitise. React will
not execute an injected `<script>` (React does not run scripts it creates), but element
attributes such as `onerror` on an `<img>` are passed through and **are** executed by the
browser. See [BUG-022](../../bugs/open/BUG-022-stored-xss-post-content.md).
