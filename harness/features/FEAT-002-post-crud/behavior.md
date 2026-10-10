# FEAT-002 · Behavior

## Slug derivation (`PostForm.jsx:123-132`)

```js
const slugTransform = (value) => value
  .trim()
  .toLowerCase()
  .replace(/[^a-zA-Z\d\s]+/g, "")   // ← removes dashes too
  .replace(/\s/g, "-");
```

* While `slugTouched === false`, an effect mirrors `slugTransform(title)` into the slug on
  every title keystroke. One pass, so dashes survive: `"The Morning, the Fog Lifted!"` →
  `the-morning-the-fog-lifted` (TC-UI-030).
* Clicking **edit slug** sets `slugTouched = true` and reveals the field. From then on the
  title no longer drives it.
* The revealed field has an `onInput` handler that runs `slugTransform` on **every
  keystroke**, and react-hook-form writes the result back into the input. Because the
  first `replace` deletes `-`, a hand-typed dash is removed the instant it appears.
  `"my-own-permalink"` → `myownpermalink`.
  → [BUG-011](../../bugs/open/BUG-011-manual-slug-strips-hyphens.md), TC-NEG-010.
* Clicking **auto** clears `slugTouched` and re-derives from the current title.
* An RHF `pattern` rule (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`) also validates the slug — but the
  `onInput` transform makes it impossible to reach a state that violates it, so the rule
  never fires in practice.

## Submit (create)

```text
1. postService.uploadFile(file)          → POST /api/upload   → { fileId, url }
2. postService.createPost({ ...form, image: undefined, featuredImage: url, userId })
                                         → POST /api/posts    → document
3. router.push(`/post/${dbPost.slug}`)
```

Not transactional: if step 2 fails, the image from step 1 is orphaned in Cloudinary.
If `uploadFile` resolves falsy, nothing happens at all — `loading` stays `true` and the
button is stuck. There is no timeout.

## Submit (edit)

Same shape, but the upload is skipped when no new file was chosen, and
`featuredImage` falls back to `post.featuredImage`. `slug` is not sent, so the URL is
stable (BR-06).

## Delete

`PostForm` and `post/[slug]/page.js` each implement their own arm-then-confirm: first click
sets a flag and starts a 4500 ms timer; a second click inside the window deletes. The
article page's version has a `finally` but no `catch`, so a failed delete produces an
unhandled rejection ([BUG-021](../../bugs/open/BUG-021-unhandled-rejection-on-delete.md)).

## Word count

`words(html)` strips tags, splits on whitespace and counts. Shown live in the composer
header as `"{n} words · ~{round(n/220)} min read"` (TC-UI-031). The same calculation is
duplicated in `PostCard.jsx` and `post/[slug]/page.js`.
