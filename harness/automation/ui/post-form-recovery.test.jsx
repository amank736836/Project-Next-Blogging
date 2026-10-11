/**
 * UI-006b · PostForm — save recovery. Covers the QA-audit fixes:
 *   - "Save as draft" submits the composed post with status "inactive"
 *     (it used to call router.back() and silently discard the edits).
 *   - A failed save shows a role="alert" message and keeps the writer on the
 *     page with their input intact (it used to fail silently).
 *   - A resolved-but-empty server response is treated as a failure, not a
 *     forever-spinning button.
 *
 * Code under test : src/components/PostForm/PostForm.jsx (real)
 * Boundary mocked : @clerk/nextjs, next/navigation, @tinymce/tinymce-react,
 *                   @/services/config (same stand-ins as post-form.test.jsx).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('@clerk/nextjs', async () =>
  (await import('@harness/automation/utilities/mocks/clerk')).createClerkMock()
);
vi.mock('next/navigation', async () =>
  (await import('@harness/automation/utilities/mocks/next-navigation')).createNextNavigationMock()
);
vi.mock('@tinymce/tinymce-react', async () =>
  import('@harness/automation/utilities/mocks/tinymce')
);
vi.mock('@/services/config', () => {
  const uploadFile = vi.fn(async () => ({
    fileId: 'blog_posts/harness_frame',
    url: 'https://res.cloudinary.com/harness/image/upload/v1/blog_posts/harness_frame.jpg',
  }));
  const createPost = vi.fn(async (payload) => ({ ...payload, _id: 'new-id' }));
  const updatePost = vi.fn(async (slug, payload) => ({ slug, ...payload }));
  const deletePost = vi.fn(async () => ({ message: 'Post deleted successfully' }));
  return {
    default: { uploadFile, createPost, updatePost, deletePost, getPost: vi.fn(), getPosts: vi.fn() },
    __spies: { uploadFile, createPost, updatePost, deletePost },
  };
});

const { setAuth, makeUser } = await import('@harness/automation/utilities/mocks/clerk');
const { getRouterSpy, resetRouter } = await import(
  '@harness/automation/utilities/mocks/next-navigation'
);
const { __spies } = await import('@/services/config');
const PostForm = (await import('@/components/PostForm/PostForm.jsx')).default;

const AUTHOR = makeUser({ id: 'user_harness_alice' });
const imageFile = () => new File([new Uint8Array(1024)], 'frame.jpg', { type: 'image/jpeg' });

async function fillValidComposer(user, container) {
  await user.type(screen.getByLabelText(/^title$/i), 'Recovery draft');
  await user.type(screen.getByTestId('rte'), '<p>Body that must survive a failed save.</p>');
  await user.upload(container.querySelector('#featured-input'), imageFile());
}

beforeEach(() => {
  resetRouter();
  setAuth({ isSignedIn: true, user: AUTHOR });
  for (const spy of Object.values(__spies)) spy.mockReset();
  __spies.uploadFile.mockImplementation(async () => ({
    fileId: 'blog_posts/harness_frame',
    url: 'https://res.cloudinary.com/harness/image/upload/v1/blog_posts/harness_frame.jpg',
  }));
  __spies.createPost.mockImplementation(async (payload) => ({ ...payload, _id: 'new-id' }));
  __spies.updatePost.mockImplementation(async (slug, payload) => ({ slug, ...payload }));
  __spies.deletePost.mockImplementation(async () => ({ message: 'Post deleted successfully' }));
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('PostForm · Save as draft', () => {
  it('saves the composed post with status "inactive" and stays on the composer', async () => {
    const user = userEvent.setup();
    const { container } = render(<PostForm />);
    await fillValidComposer(user, container);

    await user.click(screen.getByRole('button', { name: /save as draft/i }));

    await waitFor(() => expect(__spies.createPost).toHaveBeenCalledTimes(1));
    expect(__spies.createPost).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Recovery draft', status: 'inactive', userId: AUTHOR.id })
    );
    await waitFor(() =>
      expect(getRouterSpy().push).toHaveBeenCalledWith('/post/recovery-draft')
    );
    expect(getRouterSpy().back).not.toHaveBeenCalled();
  });

  it('no longer offers the old "leave for now" action that discarded edits', () => {
    render(<PostForm />);
    expect(screen.queryByRole('button', { name: /leave for now/i })).not.toBeInTheDocument();
  });
});

describe('PostForm · save failures are announced', () => {
  it('shows a role="alert" message, keeps the title, and does not navigate when the save fails', async () => {
    const user = userEvent.setup();
    const { container } = render(<PostForm />);
    await fillValidComposer(user, container);
    __spies.createPost.mockRejectedValueOnce(new Error('network down'));

    await user.click(screen.getByRole('button', { name: /publish story/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /could not save your story/i
    );
    expect(getRouterSpy().push).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/^title$/i)).toHaveValue('Recovery draft');
    expect(screen.getByRole('button', { name: /publish story/i })).toBeEnabled();
  });

  it('explains an expired session on a 401 instead of a generic error', async () => {
    const user = userEvent.setup();
    const { container } = render(<PostForm />);
    await fillValidComposer(user, container);
    __spies.createPost.mockRejectedValueOnce(Object.assign(new Error('401'), { response: { status: 401 } }));

    await user.click(screen.getByRole('button', { name: /publish story/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/session has expired/i);
  });

  it('treats an empty server response as a failure rather than spinning forever', async () => {
    const user = userEvent.setup();
    const { container } = render(<PostForm />);
    await fillValidComposer(user, container);
    __spies.createPost.mockResolvedValueOnce(undefined);

    await user.click(screen.getByRole('button', { name: /publish story/i }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(getRouterSpy().push).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /publish story/i })).toBeEnabled();
  });
});
