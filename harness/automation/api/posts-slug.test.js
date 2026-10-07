/**
 * API-002 · GET/PUT/DELETE /api/posts/[slug] — the single-resource endpoint.
 *
 * Code under test : src/app/api/posts/[slug]/route.js (real, unmodified)
 * Traceability: REQ-007 REQ-008 REQ-009 / FEAT-002 FEAT-004
 *               SCN-API-07..14, SCN-SEC-04, SCN-NEG-*
 */
// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Post from '@/models/Post';
import { installFakePersistence } from '@harness/automation/utilities/fake-post-model';
import { del, get, params, put, readJson } from '@harness/automation/utilities/request';
import { SEED_ARCHIVE, USER_B, VALID_UPDATE } from '@harness/test-data/fixtures/posts.js';

vi.mock('@/lib/db', () => ({
  default: vi.fn(async () => ({ name: 'harness-fake-connection' })),
}));

const { GET, PUT, DELETE } = await import('@/app/api/posts/[slug]/route.js');

let store;

beforeEach(() => {
  store = installFakePersistence(Post, SEED_ARCHIVE);
});

const EXISTING = SEED_ARCHIVE[0].slug; // fog-on-the-lake-at-six
const MISSING = 'this-slug-does-not-exist';

describe('GET /api/posts/[slug]', () => {
  it('TC-API-006 returns the full document for a known slug with 200', async () => {
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

  it('TC-SEC-004 [BUG-006] serves a DRAFT to any anonymous caller — the route ignores status', async () => {
    // SECURITY REGRESSION. /api/posts/[slug] has no status filter and no auth,
    // so an unpublished draft is readable by anyone who guesses the slug.
    const draft = SEED_ARCHIVE.find((p) => p.status === 'inactive');
    const response = await GET(get(`/api/posts/${draft.slug}`), params({ slug: draft.slug }));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.status).toBe('inactive');
    expect(body.slug).toBe('draft-never-shipped');
  });
});

describe('PUT /api/posts/[slug]', () => {
  it('TC-API-008 updates the matched fields and returns the new document', async () => {
    const response = await PUT(
      put(`/api/posts/${EXISTING}`, { body: VALID_UPDATE }),
      params({ slug: EXISTING })
    );
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.title).toBe(VALID_UPDATE.title);
    expect(body.status).toBe('inactive');
    expect(body.slug).toBe(EXISTING); // slug is intentionally not updatable here
  });

  it('TC-API-009 answers 404 when updating an unknown slug and changes nothing', async () => {
    const response = await PUT(
      put(`/api/posts/${MISSING}`, { body: VALID_UPDATE }),
      params({ slug: MISSING })
    );
    const body = await readJson(response);

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: 'Post not found' });
    expect(store._count()).toBe(SEED_ARCHIVE.length);
  });

  it('TC-SEC-005 [BUG-004] lets any caller overwrite a post owned by someone else', async () => {
    // The route never compares the caller against post.userId.
    const victim = SEED_ARCHIVE.find((p) => p.userId === USER_B && p.status === 'active');
    const response = await PUT(
      put(`/api/posts/${victim.slug}`, { body: { title: 'Hijacked by an anonymous caller' } }),
      params({ slug: victim.slug })
    );
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.title).toBe('Hijacked by an anonymous caller');
  });

  it('TC-SEC-006 [BUG-007] accepts fields that are not in the schema (mass assignment, no runValidators)', async () => {
    // findOneAndUpdate is called without runValidators or a field allow-list.
    const response = await PUT(
      put(`/api/posts/${EXISTING}`, {
        body: { status: 'not-a-valid-status', role: 'admin', isAdmin: true },
      }),
      params({ slug: EXISTING })
    );
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.status).toBe('not-a-valid-status');
    expect(body.isAdmin).toBe(true);
  });

  it('TC-NEG-004 answers 500 on malformed JSON instead of 400', async () => {
    const response = await PUT(
      put(`/api/posts/${EXISTING}`, { body: 'not-json', headers: { 'content-type': 'application/json' } }),
      params({ slug: EXISTING })
    );
    expect(response.status).toBe(500);
  });
});

describe('DELETE /api/posts/[slug]', () => {
  it('TC-API-010 deletes the post and returns a confirmation message', async () => {
    const response = await DELETE(del(`/api/posts/${EXISTING}`), params({ slug: EXISTING }));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({ message: 'Post deleted successfully' });
    expect(store._count()).toBe(SEED_ARCHIVE.length - 1);
  });

  it('TC-API-011 answers 404 on the second delete of the same slug (idempotency guard)', async () => {
    await DELETE(del(`/api/posts/${EXISTING}`), params({ slug: EXISTING }));
    const response = await DELETE(del(`/api/posts/${EXISTING}`), params({ slug: EXISTING }));
    const body = await readJson(response);

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: 'Post not found' });
  });

  it('TC-SEC-007 [BUG-004] deletes any writer\'s post without authentication', async () => {
    const victim = SEED_ARCHIVE.find((p) => p.userId === USER_B && p.status === 'active');
    const response = await DELETE(del(`/api/posts/${victim.slug}`), params({ slug: victim.slug }));

    expect(response.status).toBe(200);
    expect(store._all().some((p) => p.slug === victim.slug)).toBe(false);
  });
});
