/**
 * API-003 · POST /api/upload — Cloudinary image upload.
 *
 * Code under test : src/app/api/upload/route.js
 * Replaced        : @/lib/cloudinary (no real network calls, no real account)
 *                   and @clerk/nextjs/server (auth)
 * Traceability: REQ-010 / FEAT-005 / SCN-API-15..17, SCN-SEC-08
 *
 * BUG-008 fix: server now validates MIME type, size, and auth.
 * BUG-016 fix: non-multipart requests return 415 instead of 500.
 */
// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

const uploadStream = vi.fn();

vi.mock('@/lib/cloudinary', () => ({
  default: {
    uploader: {
      upload_stream: (...args) => {
        const stream = uploadStream(...args);
        return stream ?? { end: () => undefined };
      },
    },
  },
}));

// Mock @clerk/nextjs/server for auth checks.
const mockAuth = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: (...args) => mockAuth(...args),
  clerkMiddleware: vi.fn(() => vi.fn()),
}));

const { POST } = await import('@/app/api/upload/route.js');
const { fileFormData } = await import('@harness/automation/utilities/request');

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
  mockAuth.mockReset();
  // Default: authenticated user.
  mockAuth.mockResolvedValue({ userId: 'user_harness_alice' });
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
    const form = new FormData();
    const response = await POST(new Request('http://harness.local/api/upload', {
      method: 'POST',
      body: form,
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: 'No file provided' });
    expect(uploadStream).not.toHaveBeenCalled();
  });

  it('TC-NEG-005 surfaces a Cloudinary failure as 500 with a generic message', async () => {
    // BUG-013 fix: internal errors are no longer leaked to the client.
    willFail('Invalid image file');
    const response = await POST(new Request('http://harness.local/api/upload', {
      method: 'POST',
      body: fileFormData(),
    }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Upload failed');
  });

  it('TC-SEC-008 [BUG-008 FIX] rejects non-image MIME types with 415', async () => {
    // Inverted from the original regression test.
    willSucceed('blog_posts/not_an_image');
    const form = new FormData();
    form.append('file', new Blob(['#!/bin/sh\necho pwned'], { type: 'application/x-sh' }), 'payload.sh');

    const response = await POST(new Request('http://harness.local/api/upload', {
      method: 'POST',
      body: form,
    }));

    expect(response.status).toBe(415);
    expect(uploadStream).not.toHaveBeenCalled();
  });

  it('TC-SEC-008b [BUG-008 FIX] rejects files larger than 8 MB with 413', async () => {
    const form = new FormData();
    const bigContent = new Uint8Array(9 * 1024 * 1024); // 9 MB
    form.append('file', new Blob([bigContent], { type: 'image/jpeg' }), 'huge.jpg');

    const response = await POST(new Request('http://harness.local/api/upload', {
      method: 'POST',
      body: form,
    }));

    expect(response.status).toBe(413);
    expect(uploadStream).not.toHaveBeenCalled();
  });

  it('TC-SEC-008c [BUG-008 FIX] rejects unauthenticated uploads with 401', async () => {
    mockAuth.mockResolvedValue({ userId: null });
    willSucceed();

    const response = await POST(new Request('http://harness.local/api/upload', {
      method: 'POST',
      body: fileFormData(),
    }));

    expect(response.status).toBe(401);
    expect(uploadStream).not.toHaveBeenCalled();
  });

  it('TC-SEC-016 [BUG-016 FIX] non-multipart requests return 415 instead of 500', async () => {
    const response = await POST(new Request('http://harness.local/api/upload', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    }));

    expect(response.status).toBe(415);
    expect(uploadStream).not.toHaveBeenCalled();
  });
});
