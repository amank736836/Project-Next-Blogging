/**
 * UI-006 · PostForm — the composer. Highest-risk form in the application.
 *
 * Code under test : src/components/PostForm/PostForm.jsx (real, unmodified)
 * Boundary mocked : @clerk/nextjs, next/navigation, @tinymce/tinymce-react
 *                   (replaced with a plain textarea) and @/services/config.
 *
 * This covers the client-side half of FEAT-002: slug derivation, the three
 * validation rules, the arm-then-confirm delete, and the exact payload handed
 * to the API layer that harness/automation/api/*.test.js covers separately.
 *
 * Traceability: REQ-004..REQ-009 REQ-015 / FEAT-002 / SCN-UI-28..38
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('@clerk/nextjs', async () =>
  (await import('@harness/automation/utilities/mocks/clerk')).createClerkMock()
);
vi.mock('next/navigation', async () =>
  (await import('@harness/automation/utilities/mocks/next-navigation')).createNextNavigationMock()
);

// TinyMCE cannot boot in jsdom. The stand-in owns its own value, exactly like
// the real uncontrolled widget — see the module header for why that matters.
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

const imageFile = (name = 'frame.jpg', sizeBytes = 1024) =>
  new File([new Uint8Array(sizeBytes)], name, { type: 'image/jpeg' });

const fileInput = (container) => container.querySelector('#featured-input');

const userTypeTitle = async (user, text) => {
  await user.type(screen.getByLabelText(/^title$/i), text);
};

beforeEach(() => {
  resetRouter();
  setAuth({ isSignedIn: true, user: AUTHOR });
  for (const spy of Object.values(__spies)) spy.mockClear();
});

describe('PostForm · create mode', () => {
  it('TC-UI-029 renders the composer in publish mode with an empty form', () => {
    render(<PostForm />);

    expect(screen.getByLabelText(/^title$/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /publish story/i })).toBeInTheDocument();
    expect(screen.getByText('new post')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete post/i })).not.toBeInTheDocument();
  });

  it('TC-UI-030 derives the slug from the title: lowercased, punctuation dropped, spaces dashed', async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    await userTypeTitle(user, 'The Morning, the Fog Lifted!');

    expect(await screen.findByText('the-morning-the-fog-lifted')).toBeInTheDocument();
  });

  it('TC-UI-031 shows a live word count and a 220 wpm reading estimate', async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    await user.type(screen.getByTestId('rte'), 'one two three four five');

    // The meter is one <span> whose text is split across expression
    // boundaries, so match on the element's whole textContent.
    const meter = await screen.findByText(
      (_content, element) =>
        element?.children.length === 0 && /^5 words\s*\S\s*~1 min read$/.test(element.textContent ?? '')
    );
    expect(meter.textContent).toMatch(/^5 words/);
    expect(meter.textContent).toMatch(/~1 min read$/);
  });

  it('TC-NEG-008 blocks submit and asks for a title when it is empty', async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    await user.click(screen.getByRole('button', { name: /publish story/i }));

    expect(await screen.findByText('A title keeps the frame square')).toBeInTheDocument();
    expect(__spies.createPost).not.toHaveBeenCalled();
  });

  it('TC-NEG-009 blocks submit and asks for a frame when no image is attached', async () => {
    const user = userEvent.setup();
    render(<PostForm />);
    await userTypeTitle(user, 'A post without a picture');

    await user.click(screen.getByRole('button', { name: /publish story/i }));

    expect(await screen.findByText('A frame makes it a post')).toBeInTheDocument();
    expect(__spies.createPost).not.toHaveBeenCalled();
  });

  it('TC-EDGE-009 rejects an image larger than the 8 MB limit and never uploads it', async () => {
    const user = userEvent.setup();
    const { container } = render(<PostForm />);
    await userTypeTitle(user, 'An enormous frame');

    await user.upload(fileInput(container), imageFile('huge.jpg', 9 * 1024 * 1024));
    await user.click(screen.getByRole('button', { name: /publish story/i }));

    expect(await screen.findByText('Keep it under 8MB')).toBeInTheDocument();
    expect(__spies.uploadFile).not.toHaveBeenCalled();
    expect(__spies.createPost).not.toHaveBeenCalled();
  });

  it('TC-UI-032 uploads, creates and navigates to /post/<slug> on a valid submit', async () => {
    const user = userEvent.setup();
    const { container } = render(<PostForm />);
    await userTypeTitle(user, 'The harness published this');
    await user.type(screen.getByTestId('rte'), '<p>Body copy from the harness.</p>');
    await user.upload(fileInput(container), imageFile());

    await user.click(screen.getByRole('button', { name: /publish story/i }));

    await waitFor(() => expect(__spies.uploadFile).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(__spies.createPost).toHaveBeenCalledTimes(1));

    const payload = __spies.createPost.mock.calls[0][0];
    expect(payload).toMatchObject({
      title: 'The harness published this',
      slug: 'the-harness-published-this',
      status: 'active',
      userId: AUTHOR.id,
      featuredImage:
        'https://res.cloudinary.com/harness/image/upload/v1/blog_posts/harness_frame.jpg',
    });
    expect(payload.image).toBeUndefined();

    await waitFor(() =>
      expect(getRouterSpy().push).toHaveBeenCalledWith('/post/the-harness-published-this')
    );
  });

  it('TC-UI-033 hands the writer control of the slug, then "auto" gives it back', async () => {
    const user = userEvent.setup();
    render(<PostForm />);
    await userTypeTitle(user, 'Hand tuned url');
    await screen.findByText('hand-tuned-url');

    await user.click(screen.getByRole('button', { name: /edit slug/i }));
    const slugField = await screen.findByLabelText(/^slug$/i);
    expect(slugField).toHaveValue('hand-tuned-url');

    await user.clear(slugField);
    await user.type(slugField, 'custompath');
    expect(slugField).toHaveValue('custompath');

    // Once slugTouched is true the title no longer drives the slug.
    await userTypeTitle(user, ' changed');
    expect(slugField).toHaveValue('custompath');

    await user.click(screen.getByRole('button', { name: /^auto$/i }));
    // Back to derived mode: slugTransform(title) is applied in one pass, so
    // the dashes survive here (unlike typing them by hand — see TC-NEG-010).
    expect(await screen.findByText('hand-tuned-url-changed')).toBeInTheDocument();
  });

  it('TC-NEG-010 [BUG-011] the manual slug field strips every hyphen as it is typed', async () => {
    // BUG REGRESSION. The onInput handler pipes each keystroke through
    // slugTransform, whose first step removes [^a-zA-Z0-9\s] — which includes
    // "-". RHF then writes the stripped value back into the input, so a writer
    // who clicks "edit slug" can never type a dash. The RHF `pattern` rule
    // happily allows dashes; the input handler makes them unreachable.
    // Asserts CURRENT behaviour so the fix fails this test and inverts it.
    const user = userEvent.setup();
    render(<PostForm />);
    await userTypeTitle(user, 'Something');
    await user.click(screen.getByRole('button', { name: /edit slug/i }));
    const slugField = await screen.findByLabelText(/^slug$/i);

    await user.clear(slugField);
    await user.type(slugField, 'Not A Valid Slug!!');
    expect(slugField).toHaveValue('notavalidslug');

    await user.clear(slugField);
    await user.type(slugField, 'my-own-permalink');
    expect(slugField).toHaveValue('myownpermalink');
    expect(screen.queryByText('Lowercase words, separated by dashes')).not.toBeInTheDocument();
  });
});

describe('PostForm · edit mode', () => {
  const existing = {
    _id: '64aaaaaaaaaaaaaaaaaaaaa1',
    title: 'Fog on the lake at six',
    slug: 'fog-on-the-lake-at-six',
    content: '<p>Original body copy.</p>',
    featuredImage: 'https://res.cloudinary.com/harness/image/upload/v1/blog_posts/fog.jpg',
    status: 'inactive',
    userId: AUTHOR.id,
  };

  it('TC-UI-034 pre-fills every field, drops the image requirement and offers delete', () => {
    render(<PostForm post={existing} />);

    expect(screen.getByLabelText(/^title$/i)).toHaveValue(existing.title);
    expect(screen.getByLabelText(/^slug$/i)).toHaveValue(existing.slug);
    expect(screen.getByLabelText(/^status$/i)).toHaveValue('inactive');
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete post/i })).toBeInTheDocument();
  });

  it('TC-UI-035 saves without re-uploading and keeps the original slug', async () => {
    const user = userEvent.setup();
    render(<PostForm post={existing} />);

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => expect(__spies.updatePost).toHaveBeenCalledTimes(1));
    expect(__spies.uploadFile).not.toHaveBeenCalled();

    const [slug, payload] = __spies.updatePost.mock.calls[0];
    expect(slug).toBe(existing.slug);
    expect(payload.featuredImage).toBe(existing.featuredImage);
    expect(payload.title).toBe(existing.title);

    await waitFor(() =>
      expect(getRouterSpy().push).toHaveBeenCalledWith(`/post/${existing.slug}`)
    );
  });

  it('TC-UI-036 deletes only on the second click (arm-then-confirm) and disarms after 4.5 s', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<PostForm post={existing} />);

    const del = screen.getByRole('button', { name: /delete post/i });
    await user.click(del);
    expect(__spies.deletePost).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /tap again to delete/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /tap again to delete/i }));
    await waitFor(() => expect(__spies.deletePost).toHaveBeenCalledWith(existing.slug));
    await waitFor(() => expect(getRouterSpy().push).toHaveBeenCalledWith('/'));

    vi.useRealTimers();
  });

  it('TC-UI-037 an armed delete disarms itself after the 4.5 s window', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<PostForm post={existing} />);

    await user.click(screen.getByRole('button', { name: /delete post/i }));
    expect(screen.getByRole('button', { name: /tap again to delete/i })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(4600));

    expect(screen.getByRole('button', { name: /^delete post$/i })).toBeInTheDocument();
    expect(__spies.deletePost).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
