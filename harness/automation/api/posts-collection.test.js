/**
 * API-001 · GET/POST /api/posts — the collection endpoint.
 *
 * Code under test : src/app/api/posts/route.js        (real, unmodified)
 * Replaced        : @/lib/db (connection) and the Post model's data statics
 *                   (see harness/automation/utilities/fake-post-model.js)
 *
 * Traceability: REQ-004 REQ-005 REQ-006 REQ-021 / FEAT-002 FEAT-003
 *               SCN-API-01..06, SCN-SEC-02, SCN-SEC-03
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

const { GET, POST } = await import('@/app/api/posts/route.js');

let store;

beforeEach(() => {
  store = installFakePersistence(Post, SEED_ARCHIVE);
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

  it('TC-API-002 honours an explicit status=inactive filter and returns the draft', async () => {
    const response = await GET(get('/api/posts?status=inactive'));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].slug).toBe('draft-never-shipped');
  });

  it('TC-API-003 scopes results to userId when the parameter is supplied', async () => {
    const response = await GET(get(`/api/posts?status=active&userId=${USER_A}`));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.map((p) => p.slug).sort()).toEqual([
      'fog-on-the-lake-at-six',
      'long-shadows-one-ridge',
    ]);
    expect(body.every((p) => p.userId === USER_A)).toBe(true);
  });

  it('TC-API-004 returns an empty array (not an error) for a user with no posts', async () => {
    const response = await GET(get('/api/posts?status=active&userId=user_nobody'));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toEqual([]);
  });

  it('TC-SEC-002 [BUG-005] exposes another writer\'s drafts via ?userId= — no auth check exists', async () => {
    // SECURITY REGRESSION. Asserts the CURRENT (insecure) behaviour so that when
    // the authorisation fix lands this test fails loudly and gets inverted.
    // See harness/bugs/open/BUG-005-idor-draft-exposure.md.
    const response = await GET(get(`/api/posts?status=inactive&userId=${USER_B}`));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.map((p) => p.slug)).toEqual(['draft-never-shipped']);
    expect(body[0].userId).toBe(USER_B);
  });
});

describe('POST /api/posts', () => {
  it('TC-API-005 creates a post and answers 201 with the stored document', async () => {
    const response = await POST(post('/api/posts', { body: VALID_NEW_POST }));
    const body = await readJson(response);

    expect(response.status).toBe(201);
    expect(body.title).toBe(VALID_NEW_POST.title);
    expect(body.slug).toBe(VALID_NEW_POST.slug);
    expect(body.status).toBe('inactive');
    expect(body._id).toBeDefined();
    expect(store._count()).toBe(SEED_ARCHIVE.length + 1);
  });

  it('TC-NEG-001 rejects a payload missing the required title with 500 and an error message', async () => {
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
    const response = await POST(
      post('/api/posts', { body: { ...VALID_NEW_POST, slug: SEED_ARCHIVE[0].slug } })
    );
    const body = await readJson(response);

    expect(response.status).toBe(500);
    expect(body.error).toMatch(/slug/i);
  });

  it('TC-NEG-003 answers 500 (not 400) on malformed JSON — there is no body guard', async () => {
    const response = await POST(
      post('/api/posts', { body: '{ this is not json', headers: { 'content-type': 'application/json' } })
    );
    const body = await readJson(response);

    expect(response.status).toBe(500);
    expect(body.error).toBeDefined();
  });

  it('TC-SEC-003 [BUG-004] accepts an arbitrary userId — the endpoint is mass-assignable and unauthenticated', async () => {
    // SECURITY REGRESSION: an anonymous caller can author a post as ANY user.
    // Asserts current behaviour deliberately; invert when BUG-004 is fixed.
    const response = await POST(
      post('/api/posts', {
        body: { ...VALID_NEW_POST, slug: 'impersonated-frame', userId: USER_B },
      })
    );
    const body = await readJson(response);

    expect(response.status).toBe(201);
    expect(body.userId).toBe(USER_B);
  });
});
