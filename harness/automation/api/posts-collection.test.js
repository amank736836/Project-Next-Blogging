/**
 * API-001 · GET/POST /api/posts — the collection endpoint.
 *
 * Code under test : src/app/api/posts/route.js
 * Replaced        : @/lib/db (connection), the Post model's data statics
 *                   (see harness/automation/utilities/fake-post-model.js),
 *                   and @clerk/nextjs/server (auth).
 *
 * Traceability: REQ-004 REQ-005 REQ-006 REQ-021 / FEAT-002 FEAT-003
 *               SCN-API-01..06, SCN-SEC-02, SCN-SEC-03
 *
 * BUG-004, BUG-005 fixes applied:
 *   - POST requires authentication; userId is taken from the session.
 *   - GET with status=inactive requires authentication and scopes to session userId.
 */
// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Post from '@/models/Post';
import { installFakePersistence } from '@harness/automation/utilities/fake-post-model';
import { get, post, readJson } from '@harness/automation/utilities/request';
import { SEED_ARCHIVE, USER_A, USER_B, VALID_NEW_POST } from '@harness/test-data/fixtures/posts.js';

vi.mock('@/lib/db', () => ({
  default: vi.fn(async () => ({ name: 'harness-fake-connection' })),
}));

// Mock @clerk/nextjs/server so we can control auth() per test.
const mockAuth = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: (...args) => mockAuth(...args),
  clerkMiddleware: vi.fn(() => vi.fn()),
}));

const { GET, POST } = await import('@/app/api/posts/route.js');

let store;

beforeEach(() => {
  store = installFakePersistence(Post, SEED_ARCHIVE);
  mockAuth.mockReset();
  // Default: no authenticated user (anonymous).
  mockAuth.mockResolvedValue({ userId: null });
});

describe('GET /api/posts', () => {
  it('TC-API-001 returns only published (status=active) posts when no query is sent', async () => {
    const response = await GET(get('/api/posts'));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(3);
    expect(body.every((p) => p.status === 'active')).toBe(true);
  });

  it('TC-API-002 honours an explicit status=inactive filter for the authenticated user', async () => {
    // BUG-005 fix: drafts require authentication and are scoped to the session user.
    mockAuth.mockResolvedValue({ userId: USER_B });

    const response = await GET(get('/api/posts?status=inactive'));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].slug).toBe('draft-never-shipped');
    expect(body[0].userId).toBe(USER_B);
  });

  it('TC-API-002a returns 401 for unauthenticated draft requests', async () => {
    // BUG-005 fix: anonymous callers cannot request drafts.
    mockAuth.mockResolvedValue({ userId: null });

    const response = await GET(get('/api/posts?status=inactive'));
    const body = await readJson(response);

    expect(response.status).toBe(401);
  });

  it('TC-API-003 returns active posts (public endpoint, no auth needed)', async () => {
    // BUG-005 fix: userId query parameter is ignored for public (active) posts.
    // All active posts are returned regardless of userId parameter.
    const response = await GET(get('/api/posts?status=active'));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toHaveLength(3);
    expect(body.every((p) => p.status === 'active')).toBe(true);
  });

  it('TC-API-004 returns an empty array (not an error) for a user with no drafts', async () => {
    // BUG-005 fix: USER_A has no drafts, so an authenticated request returns [].
    mockAuth.mockResolvedValue({ userId: USER_A });

    const response = await GET(get('/api/posts?status=inactive'));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toEqual([]);
  });

  it('TC-SEC-002 [BUG-005 FIX] returns 401 when an unauthenticated caller requests drafts', async () => {
    // Inverted from the original regression test.
    // The userId query parameter is no longer accepted; auth is required.
    const response = await GET(get(`/api/posts?status=inactive&userId=${USER_B}`));
    const body = await readJson(response);

    expect(response.status).toBe(401);
  });
});

describe('POST /api/posts', () => {
  it('TC-API-005 creates a post and answers 201 with the stored document', async () => {
    // BUG-004 fix: POST requires authentication; userId comes from the session.
    mockAuth.mockResolvedValue({ userId: USER_A });

    const response = await POST(post('/api/posts', { body: VALID_NEW_POST }));
    const body = await readJson(response);

    expect(response.status).toBe(201);
    expect(body.title).toBe(VALID_NEW_POST.title);
    expect(body.slug).toBe(VALID_NEW_POST.slug);
    expect(body.status).toBe('inactive');
    expect(body._id).toBeDefined();
    // BUG-004 fix: userId is from the session, not the body.
    expect(body.userId).toBe(USER_A);
    expect(store._count()).toBe(SEED_ARCHIVE.length + 1);
  });

  it('TC-NEG-001 rejects a payload missing the required title with 500 and an error message', async () => {
    mockAuth.mockResolvedValue({ userId: USER_A });

    const { title: _title, ...withoutTitle } = VALID_NEW_POST;
    const response = await POST(
      post('/api/posts', { body: { ...withoutTitle, slug: 'no-title-here' } })
    );
    const body = await readJson(response);

    expect(response.status).toBe(500);
    expect(typeof body.error).toBe('string');
    expect(body.error).toMatch(/title/i);
    expect(store._count()).toBe(SEED_ARCHIVE.length);
  });

  it('TC-NEG-002 rejects a duplicate slug instead of silently overwriting', async () => {
    mockAuth.mockResolvedValue({ userId: USER_A });

    const response = await POST(
      post('/api/posts', { body: { ...VALID_NEW_POST, slug: SEED_ARCHIVE[0].slug } })
    );
    const body = await readJson(response);

    expect(response.status).toBe(500);
    expect(body.error).toMatch(/slug/i);
  });

  it('TC-NEG-003 answers 500 on malformed JSON — there is no body guard', async () => {
    mockAuth.mockResolvedValue({ userId: USER_A });

    const response = await POST(
      post('/api/posts', { body: '{ this is not json', headers: { 'content-type': 'application/json' } })
    );
    const body = await readJson(response);

    expect(response.status).toBe(500);
    expect(body.error).toBeDefined();
  });

  it('TC-SEC-003 [BUG-004 FIX] returns 401 when an unauthenticated caller tries to create a post', async () => {
    // Inverted from the original regression test.
    mockAuth.mockResolvedValue({ userId: null });

    const response = await POST(
      post('/api/posts', {
        body: { ...VALID_NEW_POST, slug: 'impersonated-frame', userId: USER_B },
      })
    );

    expect(response.status).toBe(401);
  });

  it('TC-SEC-003b [BUG-004 FIX] ignores userId in the request body and uses the session user', async () => {
    // BUG-004 fix: even with a userId in the body, the session userId is used.
    mockAuth.mockResolvedValue({ userId: USER_A });

    const response = await POST(
      post('/api/posts', {
        body: { ...VALID_NEW_POST, slug: 'session-user-frame', userId: USER_B },
      })
    );
    const body = await readJson(response);

    expect(response.status).toBe(201);
    expect(body.userId).toBe(USER_A); // NOT USER_B
  });
});

describe('POST security regressions', () => {
  it('does not pass caller-controlled identifiers or internal fields to the model', async () => {
    mockAuth.mockResolvedValue({ userId: USER_A });
    const response = await POST(post('/api/posts', {
      body: {
        ...VALID_NEW_POST,
        _id: '507f1f77bcf86cd799439011',
        __v: 99,
        createdAt: '2000-01-01',
        updatedAt: '2000-01-01',
        $set: { userId: USER_B },
      },
    }));
    expect(response.status).toBe(201);
    const payload = Post.create.mock.calls[0][0];
    for (const field of ['_id', '__v', 'createdAt', 'updatedAt', '$set']) {
      expect(payload).not.toHaveProperty(field);
    }
    expect(payload.userId).toBe(USER_A);
  });

  it('sanitizes entity-encoded executable URLs before storing content', async () => {
    mockAuth.mockResolvedValue({ userId: USER_A });
    const response = await POST(post('/api/posts', {
      body: { ...VALID_NEW_POST, content: '<a href="jav&#x61;script:alert(1)">link</a>' },
    }));
    expect(response.status).toBe(201);
    expect((await readJson(response)).content).toBe('<a>link</a>');
  });
});
