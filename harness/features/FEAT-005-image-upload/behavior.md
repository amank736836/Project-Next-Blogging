# FEAT-005 · Behavior

## Client: the drop zone (`PostForm.jsx`)

```text
onDragOver  → preventDefault, setDragging(true)
onDragLeave → setDragging(false)
onDrop      → preventDefault, take dataTransfer.files[0], preview it,
              setValue("image", [file]), and try to assign input.files
onPick      → the <input type=file> onChange → preview the chosen file
clearImage  → null the preview, null the form value, reset input.value
```

Two things worth knowing:

1. **A dropped `FileList` cannot be assigned to an `<input>`.** The code keeps the `File`
   in react-hook-form state (`setValue("image", [file])`) *and* attempts the assignment in
   a `try/catch`. Submit reads `data.image?.[0]`, so the form value is authoritative and
   the input assignment is a best-effort nicety.
2. **The preview is a local data URL**, produced with `FileReader.readAsDataURL`, so
   nothing is uploaded before submit.

## Client validation

Registered once, so the drop zone shares the element ref with RHF:

```js
register("image", {
  required: !post ? "A frame makes it a post" : false,
  validate: {
    size: (file) => !file?.[0] || file[0].size <= 8 * 1024 * 1024 || "Keep it under 8MB",
  },
  onChange: onPick,
});
```

`accept="image/png, image/jpeg, image/jpg, image/gif"` is a browser hint only.

## Server (`src/app/api/upload/route.js`)

```js
const formData = await request.formData();
const file = formData.get("file");
if (!file) return 400 { error: "No file provided" };

const buffer = Buffer.from(await file.arrayBuffer());
const result = await new Promise((resolve, reject) =>
  cloudinary.uploader.upload_stream({ folder: "blog_posts" }, (error, result) =>
    error ? reject(error) : resolve(result)
  ).end(buffer)
);
return 200 { fileId: result.public_id, url: result.secure_url };
```

Whole file buffered into memory — a large upload is fully resident before it is streamed
on. No size cap, no MIME check, no auth, no rate limit.

## Consumption

`featuredImage` holds the `secure_url`. `next/image` renders it in `PostCard` and
`post/[slug]`; `next.config.mjs` allow-lists only `https://res.cloudinary.com/**`, so a
`featuredImage` pointing anywhere else fails to render.
