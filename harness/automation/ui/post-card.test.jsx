/**
 * UI-003 · PostCard — the archive tile.
 *
 * Code under test : src/components/PostCard.jsx (real, unmodified)
 * Boundary mocked : @clerk/nextjs (useUser), next/image (jsdom has no layout)
 *
 * PostCard owns two pieces of derived logic worth pinning down: the 220 wpm
 * reading-time estimate and the "am I the author?" edit affordance.
 *
 * Traceability: REQ-011 REQ-012 / FEAT-003 FEAT-006 / SCN-UI-14..18
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('@clerk/nextjs', async () =>
  (await import('@harness/automation/utilities/mocks/clerk')).createClerkMock()
);
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element -- jsdom has no image pipeline
  default: ({ src, alt }) => <img src={src} alt={alt} data-testid="post-image" />,
}));

const { setAuth, makeUser } = await import('@harness/automation/utilities/mocks/clerk');
const PostCard = (await import('@/components/PostCard.jsx')).default;

const basePost = {
  slug: 'fog-on-the-lake-at-six',
  title: 'Fog on the lake at six',
  featuredImage: 'https://res.cloudinary.com/harness/image/upload/v1/blog_posts/fog.jpg',
  content: `<p>${Array.from({ length: 440 }, (_, i) => `word${i}`).join(' ')}</p>`,
  status: 'active',
  userId: 'user_harness_alice',
  createdAt: '2026-09-28T06:41:00.000Z',
};

beforeEach(() => {
  setAuth({ isSignedIn: false, user: null });
});

describe('PostCard · rendering', () => {
  it('TC-UI-013 renders the title and links the whole tile to /post/<slug>', () => {
    render(<PostCard {...basePost} tilt={false} />);

    expect(screen.getByRole('heading', { name: basePost.title })).toBeInTheDocument();
    expect(screen.getByLabelText(`Read: ${basePost.title}`)).toHaveAttribute(
      'href',
      `/post/${basePost.slug}`
    );
  });

  it('TC-UI-014 estimates reading time at ~220 wpm, rounded, minimum 1 minute', () => {
    // 440 words / 220 wpm = exactly 2 minutes.
    render(<PostCard {...basePost} tilt={false} />);
    expect(screen.getByText('2 min read')).toBeInTheDocument();
  });

  it('TC-EDGE-007 floors an almost-empty post at 1 minute rather than 0', () => {
    render(<PostCard {...basePost} content="<p>five short words</p>" tilt={false} />);
    expect(screen.getByText('1 min read')).toBeInTheDocument();
  });

  it('TC-EDGE-008 renders "undated" instead of Invalid Date for a missing/invalid createdAt', () => {
    const { rerender } = render(<PostCard {...basePost} createdAt={undefined} tilt={false} />);
    expect(screen.getByText('undated')).toBeInTheDocument();
    rerender(<PostCard {...basePost} createdAt="not-a-date" tilt={false} />);
    expect(screen.getByText('undated')).toBeInTheDocument();
  });

  it('TC-UI-015 badges a draft card and omits the badge on a published one', () => {
    const { rerender } = render(<PostCard {...basePost} status="inactive" tilt={false} />);
    expect(screen.getByText('draft')).toBeInTheDocument();

    rerender(<PostCard {...basePost} status="active" tilt={false} />);
    expect(screen.queryByText('draft')).not.toBeInTheDocument();
  });
});

describe('PostCard · ownership affordance', () => {
  it('TC-UI-016 shows an Edit link only to the post\'s own author', () => {
    setAuth({ isSignedIn: true, user: makeUser({ id: basePost.userId }) });
    render(<PostCard {...basePost} tilt={false} />);

    const edit = screen.getByRole('link', { name: /edit/i });
    expect(edit).toHaveAttribute('href', `/edit-post/${basePost.slug}`);
  });

  it('TC-SEC-009 hides the Edit link from a signed-in reader who is not the author', () => {
    setAuth({ isSignedIn: true, user: makeUser({ id: 'user_someone_else' }) });
    render(<PostCard {...basePost} tilt={false} />);

    expect(screen.queryByRole('link', { name: /edit/i })).not.toBeInTheDocument();
  });

  it('TC-SEC-010 hides the Edit link from anonymous visitors', () => {
    render(<PostCard {...basePost} tilt={false} />);
    expect(screen.queryByRole('link', { name: /edit/i })).not.toBeInTheDocument();
  });
});
