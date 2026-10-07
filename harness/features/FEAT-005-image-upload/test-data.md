# FEAT-005 · Test data

No binary fixture is committed. Files are synthesised in the test:

```js
// harness/automation/utilities/request.js
export function fileFormData({ name = 'frame.jpg', type = 'image/jpeg', content = 'harness-binary-payload' }) {
  const form = new FormData();
  form.append('file', new Blob([content], { type }), name);
  return form;
}
```

| Case | File |
| --- | --- |
| TC-API-012, TC-API-013 | `frame.jpg`, `image/jpeg`, 20 bytes of text |
| TC-API-014 | an **empty** `FormData` — the part is absent |
| TC-SEC-008 | `payload.sh`, `application/x-sh`, body `#!/bin/sh\necho pwned` |
| TC-EDGE-009 | `huge.jpg`, `image/jpeg`, `9 * 1024 * 1024` bytes, allocated in memory |

## Expected Cloudinary response (mocked)

```json
{
  "public_id": "blog_posts/harness_frame",
  "secure_url": "https://res.cloudinary.com/harness/image/upload/v1/blog_posts/harness_frame.jpg"
}
```

The cloud name `harness` is not a real account. Real credentials are never referenced:
`CLOUDINARY_*` values in `automation/utilities/setup.js` are placeholders.
