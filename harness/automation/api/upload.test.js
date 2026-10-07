/**
 * API-003 · POST /api/upload — Cloudinary image upload.
 *
 * Code under test : src/app/api/upload/route.js (real, unmodified)
 * Replaced        : @/lib/cloudinary (no real network calls, no real account)
 * Traceability: REQ-010 / FEAT-005 / SCN-API-15..17, SCN-SEC-08
 */
// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

const uploadStream = vi.fn();

vi.mock('@/lib/cloudinary', () => ({
  default: {
    uploader: {
      // Emulates cloudinary.uploader.upload_stream(opts, cb).end(buffer).
      // Each test replaces `uploadStream`'s implementation via willSucceed /
      // willFail below so no real network call is ever made.
      upload_stream: (...args) => {
        const stream = uploadStream(...args);
        return stream ?? { end: () => undefined };
      },
    },
  },
}));

const { POST } = await import('@/app/api/upload/route.js');
const { fileFormData } = await import('@harness/automation/utilities/request');

/** Resolve the pending upload as Cloudinary would. */
function willSucceed(publicId = 'blog_posts/harness_frame') {
  uploadStream.mockImplementation((options, callback) => {
    callback(null, {
      public_id: publicId,
      secure_url: `https://res.cloudinary.com/harness/image/upload/v1/${publicId}.jpg`,
      folder: options.folder,
    });
    return { end: () => undefined };
  });
}

function willFail(message = 'Invalid image file') {
  uploadStream.mockImplementation((_options, callback) => {
    callback(new Error(message), null);
    return { end: () => undefined };
  });
}

beforeEach(() => {
  uploadStream.mockReset();
});

describe('POST /api/upload', () => {
  it('TC-API-012 uploads a file and returns { fileId, url }', async () => {
    willSucceed();
    const response = await POST(new Request('http://harness.local/api/upload', {
      method: 'POST',
      body: fileFormData(),
    }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.fileId).toBe('blog_posts/harness_frame');
    expect(body.url).toBe(
      'https://res.cloudinary.com/harness/image/upload/v1/blog_posts/harness_frame.jpg'
    );
  });

  it('TC-API-013 stores every upload under the blog_posts folder', async () => {
    willSucceed();
    await POST(new Request('http://harness.local/api/upload', {
      method: 'POST',
      body: fileFormData(),
    }));

    const options = uploadStream.mock.calls[0][0];
    expect(options).toEqual({ folder: 'blog_posts' });
  });

  it('TC-API-014 answers 400 with { error: "No file provided" } when the part is absent', async () => {
    const form = new FormData(); // deliberately empty
    const response = await POST(new Request('http://harness.local/api/upload', {
      method: 'POST',
      body: form,
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: 'No file provided' });
    expect(uploadStream).not.toHaveBeenCalled();
  });

  it('TC-NEG-005 surfaces a Cloudinary failure as 500 with the provider message', async () => {
    willFail('Invalid image file');
    const response = await POST(new Request('http://harness.local/api/upload', {
      method: 'POST',
      body: fileFormData(),
    }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Invalid image file');
  });

  it('TC-SEC-008 [BUG-008] accepts ANY MIME type server-side — validation is client-only', async () => {
    // The browser input restricts accept="image/*", but the endpoint itself
    // never inspects the content type or size, so an arbitrary payload is
    // forwarded to Cloudinary. Asserts current behaviour.
    willSucceed('blog_posts/not_an_image');
    const form = new FormData();
    form.append('file', new Blob(['#!/bin/sh\necho pwned'], { type: 'application/x-sh' }), 'payload.sh');

    const response = await POST(new Request('http://harness.local/api/upload', {
      method: 'POST',
      body: form,
    }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.fileId).toBe('blog_posts/not_an_image');
  });
});
