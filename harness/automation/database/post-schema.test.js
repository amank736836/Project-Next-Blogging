/**
 * DB-001 · Post schema contract — src/models/Post.js
 *
 * This is the only collection in the application, so its shape *is* the data
 * contract for every API test above. Validation runs through real Mongoose
 * (`new Post(doc).validateSync()`); no server or connection is involved.
 *
 * Traceability: REQ-003 REQ-004 REQ-020 / FEAT-002 / SCN-DB-01..08
 */
// @vitest-environment node
import { beforeEach, describe, expect, it } from 'vitest';

import Post from '@/models/Post';
import { VALID_NEW_POST } from '@harness/test-data/fixtures/posts.js';

const schema = Post.schema;

const without = (key) => {
  const copy = { ...VALID_NEW_POST };
  delete copy[key];
  return copy;
};

// Mongoose 9 resolves validateSync() to `undefined` (not null) when valid.
const errorsFor = (doc) => new Post(doc).validateSync()?.errors ?? null;

beforeEach(() => {
  // Nothing to reset — schema tests are pure and share no mutable state.
});

describe('Post schema · structure', () => {
  it('TC-DB-001 declares exactly the six business fields plus timestamps', () => {
    const paths = Object.keys(schema.paths).sort();
    expect(paths).toEqual(
      ['__v', '_id', 'content', 'createdAt', 'featuredImage', 'slug', 'status', 'title', 'updatedAt', 'userId'].sort()
    );
  });

  it('TC-DB-002 marks title, slug, content, featuredImage and userId as required', () => {
    for (const field of ['title', 'slug', 'content', 'featuredImage', 'userId']) {
      expect(schema.path(field).isRequired, `${field} should be required`).toBe(true);
    }
  });

  it('TC-DB-003 constrains status to the enum [active, inactive] with default active', () => {
    const status = schema.path('status');
    expect(status.enumValues).toEqual(['active', 'inactive']);
    expect(status.defaultValue).toBe('active');
    // `status` is optional at the schema level and falls back to the default.
    expect(status.isRequired).toBeFalsy();
  });

  it('TC-DB-004 puts a UNIQUE index on slug', () => {
    const uniqueIndexes = schema.indexes().filter(([, options]) => options.unique);
    expect(uniqueIndexes.map(([keys]) => Object.keys(keys))).toContainEqual(['slug']);
  });

  it('TC-DB-005 enables timestamps so createdAt/updatedAt exist for archive sorting', () => {
    expect(schema.options.timestamps).toBe(true);
    expect(schema.path('createdAt')).toBeTruthy();
    expect(schema.path('updatedAt')).toBeTruthy();
  });

  it('TC-DB-006 stores userId as a String (Clerk id), not an ObjectId reference', () => {
    expect(schema.path('userId').instance).toBe('String');
  });
});

describe('Post schema · validation behaviour', () => {
  it('TC-DB-007 accepts a fully populated, valid document', () => {
    expect(errorsFor(VALID_NEW_POST)).toBeNull();
  });

  it.each(['title', 'slug', 'content', 'featuredImage', 'userId'])(
    'TC-DB-008 rejects a document missing the required field "%s"',
    (field) => {
      const errors = errorsFor(without(field));
      expect(errors, `expected a validation error for ${field}`).not.toBeNull();
      expect(errors[field]).toBeTruthy();
      expect(errors[field].kind).toBe('required');
    }
  );

  it('TC-DB-009 rejects a status outside the enum', () => {
    const errors = errorsFor({ ...VALID_NEW_POST, status: 'archived' });
    expect(errors.status).toBeTruthy();
    expect(errors.status.kind).toBe('enum');
  });

  it('TC-EDGE-001 rejects an empty string for every required String field', () => {
    // Verified against mongoose 9.2.1: `required` on a String path DOES reject
    // "". (An earlier draft of this harness assumed it did not; the run proved
    // otherwise, so the assumption was corrected rather than the test.)
    const errors = errorsFor({
      title: '',
      slug: '',
      content: '',
      featuredImage: '',
      userId: '',
    });
    expect(errors).not.toBeNull();
    for (const field of ['title', 'slug', 'content', 'featuredImage', 'userId']) {
      expect(errors[field]?.kind, `${field} should fail as required`).toBe('required');
    }
  });

  it('TC-EDGE-005 rejects a whitespace-only string only when the field is required — no trim/length rule exists', () => {
    // " " is not empty, so it passes `required`. Nothing else stops it.
    const errors = errorsFor({
      ...VALID_NEW_POST,
      slug: 'whitespace-only-title',
      title: '   ',
    });
    expect(errors).toBeNull();
  });

  it('TC-EDGE-002 accepts a 2000-character title and a 1 MB body (no length limits defined)', () => {
    const errors = errorsFor({
      ...VALID_NEW_POST,
      slug: 'edge-very-long-post',
      title: 'x'.repeat(2000),
      content: `<p>${'y'.repeat(1024 * 1024)}</p>`,
    });
    expect(errors).toBeNull();
  });

  it('TC-EDGE-003 accepts markup in title/content verbatim — the schema performs no sanitisation', () => {
    const hostile = '<img src=x onerror="window.__harnessXss=1">';
    const doc = new Post({ ...VALID_NEW_POST, slug: 'edge-hostile', content: hostile });
    expect(doc.validateSync()).toBeFalsy();
    expect(doc.content).toBe(hostile);
  });

  it('TC-EDGE-004 does not lowercase or normalise slug — uniqueness is byte-exact', () => {
    const doc = new Post({ ...VALID_NEW_POST, slug: 'Mixed-Case Slug!' });
    expect(doc.validateSync()).toBeFalsy();
    expect(doc.slug).toBe('Mixed-Case Slug!');
  });
});
