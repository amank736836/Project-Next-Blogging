/**
 * Shared seed data for automated tests.
 *
 * Every value here is synthetic. No real email address, credential, token,
 * Cloudinary account or production identifier appears anywhere in harness/.
 * See harness/test-data/README.md for the rules.
 */

export const USER_A = 'user_harness_alice';
export const USER_B = 'user_harness_bob';

/** Mirrors the shape produced by src/models/Post.js (timestamps: true). */
export const SEED_ARCHIVE = [
  {
    _id: '64aaaaaaaaaaaaaaaaaaaaa1',
    title: 'Fog on the lake at six',
    slug: 'fog-on-the-lake-at-six',
    content: '<p>The water stopped being water.</p>',
    featuredImage: 'https://res.cloudinary.com/harness/image/upload/v1/blog_posts/fog.jpg',
    status: 'active',
    userId: USER_A,
    createdAt: '2026-09-28T06:41:00.000Z',
    updatedAt: '2026-09-28T06:41:00.000Z',
  },
  {
    _id: '64aaaaaaaaaaaaaaaaaaaaa2',
    title: 'Long shadows, one ridge',
    slug: 'long-shadows-one-ridge',
    content: '<p>Deserts are the most honest studio.</p>',
    featuredImage: 'https://res.cloudinary.com/harness/image/upload/v1/blog_posts/dunes.jpg',
    status: 'active',
    userId: USER_A,
    createdAt: '2026-07-04T18:05:00.000Z',
    updatedAt: '2026-07-04T18:05:00.000Z',
  },
  {
    _id: '64aaaaaaaaaaaaaaaaaaaaa3',
    title: 'Rain on the window in August',
    slug: 'rain-on-the-window-in-august',
    content: '<p>The city stops asking to be photographed.</p>',
    featuredImage: 'https://res.cloudinary.com/harness/image/upload/v1/blog_posts/rain.jpg',
    status: 'active',
    userId: USER_B,
    createdAt: '2026-08-19T21:12:00.000Z',
    updatedAt: '2026-08-19T21:12:00.000Z',
  },
  {
    _id: '64aaaaaaaaaaaaaaaaaaaaa4',
    title: 'A draft that never shipped',
    slug: 'draft-never-shipped',
    content: '<p>Unfinished on purpose.</p>',
    featuredImage: 'https://res.cloudinary.com/harness/image/upload/v1/blog_posts/draft.jpg',
    status: 'inactive',
    userId: USER_B,
    createdAt: '2026-06-15T11:30:00.000Z',
    updatedAt: '2026-06-15T11:30:00.000Z',
  },
];

export const VALID_NEW_POST = {
  title: 'A harness-authored frame',
  slug: 'a-harness-authored-frame',
  content: '<p>Written by the automated harness.</p>',
  featuredImage: 'https://res.cloudinary.com/harness/image/upload/v1/blog_posts/harness.jpg',
  status: 'inactive',
  userId: USER_A,
};

export const VALID_UPDATE = {
  title: 'Fog on the lake at six (revised)',
  content: '<p>Revised by the harness.</p>',
  featuredImage: 'https://res.cloudinary.com/harness/image/upload/v1/blog_posts/fog-v2.jpg',
  status: 'inactive',
};

/** Contact form (FEAT-008) — valid and boundary-valid inputs. */
export const VALID_CONTACT = {
  name: 'Harness Tester',
  email: 'tester@example.test',
  message: 'This message is comfortably over the twelve character minimum.',
};

const fixtures = {
  USER_A,
  USER_B,
  SEED_ARCHIVE,
  VALID_NEW_POST,
  VALID_UPDATE,
  VALID_CONTACT,
};

export default fixtures;
