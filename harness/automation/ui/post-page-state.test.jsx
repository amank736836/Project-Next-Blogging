/**
 * UI-007b · Post reader — missing or failed post.
 *
 * Regression for the QA audit: a failed or empty fetch used to call
 * router.push('/') and bounce the reader to the archive with no explanation.
 * It now stays on /post/<slug> and shows the "not on the shelf" state with a
 * way back.
 *
 * Code under test : src/app/post/[slug]/page.js (real)
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';

vi.mock('@clerk/nextjs', async () =>
  (await import('@harness/automation/utilities/mocks/clerk')).createClerkMock()
);
vi.mock('next/navigation', async () =>
  (await import('@harness/automation/utilities/mocks/next-navigation')).createNextNavigationMock()
);
vi.mock('@/services/config', () => {
  const getPost = vi.fn();
  return { default: { getPost, getPosts: vi.fn(), createPost: vi.fn(), updatePost: vi.fn(), deletePost: vi.fn(), uploadFile: vi.fn() }, __spies: { getPost } };
});
vi.mock('@/components/motion/Reveal', () => ({
  default: ({ children, className = '' }) => <div className={className}>{children}</div>,
}));
vi.mock('@/components/motion/SplitHeadline', () => ({
  default: ({ text }) => <span>{text}</span>,
}));
vi.mock('@/components/motion/Effects', () => ({
  DrawSvg: ({ children }) => <svg>{children}</svg>,
  Magnetic: ({ children }) => <>{children}</>,
  Parallax: ({ children }) => <>{children}</>,
}));
vi.mock('@/components/ui/ScrollProgress', () => ({ default: () => null }));

const { setAuth } = await import('@harness/automation/utilities/mocks/clerk');
const { getRouterSpy, resetRouter } = await import(
  '@harness/automation/utilities/mocks/next-navigation'
);
const { __spies } = await import('@/services/config');
const PostPage = (await import('@/app/post/[slug]/page.js')).default;

// React.use() on a pending promise suspends, which act() cannot flush. A
// thenable already marked fulfilled is unwrapped synchronously instead.
const resolvedParams = (value) => Object.assign(Promise.resolve(value), { status: 'fulfilled', value });

const renderPage = (slug) =>
  render(
    <Suspense fallback={null}>
      <PostPage params={resolvedParams({ slug })} />
    </Suspense>
  );

beforeEach(() => {
  resetRouter();
  setAuth({ isSignedIn: false, user: null });
  __spies.getPost.mockReset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('Post reader · missing or failed post', () => {
  it('stays on the page and explains when the fetch fails', async () => {
    __spies.getPost.mockRejectedValueOnce(new Error('500'));

    renderPage('gone-post');

    expect(await screen.findByText(/not on the shelf/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to the archive/i })).toHaveAttribute('href', '/');
    expect(getRouterSpy().push).not.toHaveBeenCalled();
  });

  it('stays on the page and explains when the post does not exist', async () => {
    __spies.getPost.mockResolvedValueOnce(null);

    renderPage('no-such-post');

    expect(await screen.findByText(/not on the shelf/i)).toBeInTheDocument();
    expect(getRouterSpy().push).not.toHaveBeenCalled();
  });
});
