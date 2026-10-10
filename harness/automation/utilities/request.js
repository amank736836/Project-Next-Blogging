/**
 * Small helpers for driving the Next.js route handlers in src/app/api/**.
 *
 * Next 16 App Router handlers are ordinary exported async functions with the
 * signature `(request: Request, context) => Promise<Response>`, so they can be
 * called directly from Vitest. `next/server`'s NextResponse extends the Web
 * Response class, which Node 22 implements natively — no server needed.
 */

const BASE = 'http://harness.local';

export function makeRequest(method, path, { body, headers = {}, formData } = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const init = { method, headers: { ...headers } };

  if (formData) {
    init.body = formData;
  } else if (body !== undefined) {
    init.headers['content-type'] = init.headers['content-type'] || 'application/json';
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return new Request(url, init);
}

export const get = (path, options) => makeRequest('GET', path, options);
export const post = (path, options) => makeRequest('POST', path, options);
export const put = (path, options) => makeRequest('PUT', path, options);
export const del = (path, options) => makeRequest('DELETE', path, options);

/** Route-handler context for dynamic segments, e.g. slugContext('my-post'). */
export function params(object) {
  return { params: Promise.resolve(object) };
}

export async function readJson(response) {
  return response.json();
}

/** A minimal multipart/form-data body carrying one file part named `file`. */
export function fileFormData({
  name = 'frame.jpg',
  type = 'image/jpeg',
  content = 'harness-binary-payload',
} = {}) {
  const form = new FormData();
  form.append('file', new Blob([content], { type }), name);
  return form;
}
