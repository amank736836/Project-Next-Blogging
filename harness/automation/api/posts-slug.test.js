/**
 * API-002 · GET/PUT/DELETE /api/posts/[slug] — the single-resource endpoint.
 *
 * Code under test : src/app/api/posts/[slug]/route.js
 * Traceability: REQ-007 REQ-008 REQ-009 / FEAT-002 FEAT-004
 *               SCN-API-07..14, SCN-SEC-04, SCN-NEG-*
 *
 * BUG-004, BUG-006, BUG-007 fixes applied:
 *   - GET: anonymous callers only see active posts; drafts require auth + ownership.
 *   - PUT/DELETE: require authentication and ownership check.
 *   - PUT: field allow-list + runValidators enforced.
 */
// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Post from '@/models/Post';
import { installFakePersistence } from '@harness/automation/utilities/fake-post-model';
import { del, get, params, put, readJson } from '@harness/automation/utilities/request';
import { SEED_ARCHIVE, USER_A, USER_B, VALID_UPDATE } from '@harness/test-data/fixtures/posts.js';

vi.mock('@/lib/db', () => ({
  default: vi.fn(async () => ({ name: 'harness-fake-connection' })),
}));

// Mock @clerk/nextjs/server so we can control auth() per test.
const mockAuth = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: (...args) => mockAuth(...args),
  clerkMiddleware: vi.fn(() => vi.fn()),
}));

const { GET, PUT, DELETE } = await import('@/app/api/posts/[slug]/route.js');

let store;

beforeEach(() => {
  store = installFakePersistence(Post, SEED_ARCHIVE);
  mockAuth.mockReset();
  // Default: no authenticated user (anonymous).
  mockAuth.mockResolvedValue({ userId: null });
});

const EXISTING = SEED_ARCHIVE[0].slug; // fog-on-the-lake-at-six
const MISSING = 'this-slug-does-not-exist';

describe('GET /api/posts/[slug]', () => {
  it('TC-API-006 returns the full document for a known active slug with 200', async () => {
    // Anonymous callers can see active (published) posts.
    const response = await GET(get(`/api/posts/${EXISTING}`), params({ slug: EXISTING }));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.slug).toBe(EXISTING);
    expect(body.title).toBe('Fog on the lake at six');
    expect(body.content).toContain('<p>');
  });

  it('TC-API-007 answers 404 with { error: "Post not found" } for an unknown slug', async () => {
    const response = await GET(get(`/api/posts/${MISSING}`), params({ slug: MISSING }));
    const body = await readJson(response);

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: 'Post not found' });
  });

  it('TC-SEC-004 [BUG-006 FIX] returns 404 for an anonymous caller requesting a draft', async () => {
    // Inverted from the original regression test.
    // BUG-006 fix: anonymous callers only see active posts; drafts return 404.
    const draft = SEED_ARCHIVE.find((p) => p.status === 'inactive');
    const response = await GET(get(`/api/posts/${draft.slug}`), params({ slug: draft.slug }));

    expect(response.status).toBe(404);
  });

  it('TC-SEC-004b [BUG-006 FIX] allows the owner to view their own draft', async () => {
    mockAuth.mockResolvedValue({ userId: USER_B });

    const draft = SEED_ARCHIVE.find((p) => p.status === 'inactive');
    const response = await GET(get(`/api/posts/${draft.slug}`), params({ slug: draft.slug }));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.status).toBe('inactive');
    expect(body.slug).toBe('draft-never-shipped');
  });

  it('TC-SEC-004c [BUG-006 FIX] returns 404 when a non-owner requests a draft', async () => {
    mockAuth.mockResolvedValue({ userId: USER_A });

    const draft = SEED_ARCHIVE.find((p) => p.status === 'inactive'); // owned by USER_B
    const response = await GET(get(`/api/posts/${draft.slug}`), params({ slug: draft.slug }));

    expect(response.status).toBe(404);
  });
});

describe('PUT /api/posts/[slug]', () => {
  it('TC-API-008 updates the matched fields and returns the new document', async () => {
    // BUG-004 fix: PUT requires authentication and ownership.
    // EXISTING is owned by USER_A.
    mockAuth.mockResolvedValue({ userId: USER_A });

    const response = await PUT(
      put(`/api/posts/${EXISTING}`, { body: VALID_UPDATE }),
      params({ slug: EXISTING })
    );
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.title).toBe(VALID_UPDATE.title);
    expect(body.status).toBe('inactive');
    expect(body.slug).toBe(EXISTING);
  });

  it('TC-API-009 answers 404 when updating an unknown slug and changes nothing', async () => {
    mockAuth.mockResolvedValue({ userId: USER_A });

    const response = await PUT(
      put(`/api/posts/${MISSING}`, { body: VALID_UPDATE }),
      params({ slug: MISSING })
    );
    const body = await readJson(response);

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: 'Post not found' });
    expect(store._count()).toBe(SEED_ARCHIVE.length);
  });

  it('TC-SEC-005 [BUG-004 FIX] returns 401 when an unauthenticated caller tries to update', async () => {
    // Inverted from the original regression test.
    mockAuth.mockResolvedValue({ userId: null });

    const victim = SEED_ARCHIVE.find((p) => p.userId === USER_B && p.status === 'active');
    const response = await PUT(
      put(`/api/posts/${victim.slug}`, { body: { title: 'Hijacked by an anonymous caller' } }),
      params({ slug: victim.slug })
    );

    expect(response.status).toBe(401);
  });

  it('TC-SEC-005b [BUG-004 FIX] returns 404 when a non-owner tries to update', async () => {
    // BUG-004 fix: even with auth, non-owners cannot modify others' posts.
    mockAuth.mockResolvedValue({ userId: USER_A });

    const victim = SEED_ARCHIVE.find((p) => p.userId === USER_B && p.status === 'active');
    const response = await PUT(
      put(`/api/posts/${victim.slug}`, { body: { title: 'Hijacked' } }),
      params({ slug: victim.slug })
    );

    expect(response.status).toBe(404);
  });

  it('TC-SEC-006 [BUG-007 FIX] drops unknown fields and enforces validators', async () => {
    // BUG-007 fix: PUT now has a field allow-list and runValidators: true.
    mockAuth.mockResolvedValue({ userId: USER_A });

    const response = await PUT(
      put(`/api/posts/${EXISTING}`, {
        body: { status: 'not-a-valid-status', role: 'admin', isAdmin: true },
      }),
      params({ slug: EXISTING })
    );

    // Should fail because 'not-a-valid-status' is not in the enum.
    expect(response.status).toBe(500);
  });

  it('TC-NEG-004 answers 500 on malformed JSON instead of 400', async () => {
    mockAuth.mockResolvedValue({ userId: USER_A });

    const response = await PUT(
      put(`/api/posts/${EXISTING}`, { body: 'not-json', headers: { 'content-type': 'application/json' } }),
      params({ slug: EXISTING })
    );
    expect(response.status).toBe(500);
  });
});

describe('DELETE /api/posts/[slug]', () => {
  it('TC-API-010 deletes the post and returns a confirmation message', async () => {
    // BUG-004 fix: DELETE requires authentication and ownership.
    // EXISTING is owned by USER_A.
    mockAuth.mockResolvedValue({ userId: USER_A });

    const response = await DELETE(del(`/api/posts/${EXISTING}`), params({ slug: EXISTING }));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({ message: 'Post deleted successfully' });
    expect(store._count()).toBe(SEED_ARCHIVE.length - 1);
  });

  it('TC-API-011 answers 404 on the second delete of the same slug (idempotency guard)', async () => {
    mockAuth.mockResolvedValue({ userId: USER_A });

    await DELETE(del(`/api/posts/${EXISTING}`), params({ slug: EXISTING }));
    const response = await DELETE(del(`/api/posts/${EXISTING}`), params({ slug: EXISTING }));
    const body = await readJson(response);

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: 'Post not found' });
  });

  it('TC-SEC-007 [BUG-004 FIX] returns 401 when an unauthenticated caller tries to delete', async () => {
    // Inverted from the original regression test.
    mockAuth.mockResolvedValue({ userId: null });

    const victim = SEED_ARCHIVE.find((p) => p.userId === USER_B && p.status === 'active');
    const response = await DELETE(del(`/api/posts/${victim.slug}`), params({ slug: victim.slug }));

    expect(response.status).toBe(401);
    // The post should still exist — the delete was rejected.
    expect(store._all().some((p) => p.slug === victim.slug)).toBe(true);
  });

  it('TC-SEC-007b [BUG-004 FIX] returns 404 when a non-owner tries to delete', async () => {
    // BUG-004 fix: even authenticated, non-owners cannot delete others' posts.
    mockAuth.mockResolvedValue({ userId: USER_A });

    const victim = SEED_ARCHIVE.find((p) => p.userId === USER_B && p.status === 'active');
    const response = await DELETE(del(`/api/posts/${victim.slug}`), params({ slug: victim.slug }));

    expect(response.status).toBe(404);
    // The post should still exist.
    expect(store._all().some((p) => p.slug === victim.slug)).toBe(true);
  });
});
