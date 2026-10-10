/**
 * UI-001 · AuthLayout — the client-side gate for writer-only routes.
 *
 * Code under test : src/components/AuthLayout.jsx (real, unmodified)
 * Boundary mocked : @clerk/nextjs (useAuth), next/navigation (useRouter)
 *
 * This is the ONLY authorisation gate the application has — every protected
 * route (/add-post, /all-posts, /edit-post/[slug]) is wrapped in it. It is
 * therefore the highest-value UI test in the harness.
 *
 * Traceability: REQ-001 REQ-002 / FEAT-001 / SCN-UI-01..06, SCN-SEC-01
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('@clerk/nextjs', async () =>
  (await import('@harness/automation/utilities/mocks/clerk')).createClerkMock()
);
vi.mock('next/navigation', async () =>
  (await import('@harness/automation/utilities/mocks/next-navigation')).createNextNavigationMock()
);
vi.mock('@/components/loaders/Loader', () => ({
  default: ({ label = 'loading' }) => <div data-testid="loader">{label}</div>,
}));

const { setAuth, makeUser } = await import('@harness/automation/utilities/mocks/clerk');
const { getRouterSpy, resetRouter } = await import(
  '@harness/automation/utilities/mocks/next-navigation'
);
const AuthLayout = (await import('@/components/AuthLayout.jsx')).default;

const renderGate = (props = {}) =>
  render(
    <AuthLayout {...props}>
      <div data-testid="protected-content">writer-only content</div>
    </AuthLayout>
  );

beforeEach(() => {
  resetRouter();
});

describe('AuthLayout · protected mode (authentication = true)', () => {
  it('TC-UI-001 renders children and never redirects for a signed-in writer', () => {
    setAuth({ isSignedIn: true, user: makeUser() });
    renderGate();

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(getRouterSpy().push).not.toHaveBeenCalled();
  });

  it('TC-UI-002 redirects an anonymous visitor to /login', async () => {
    setAuth({ isSignedIn: false, user: null });
    renderGate();

    await waitFor(() => expect(getRouterSpy().push).toHaveBeenCalledWith('/login'));
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('TC-UI-003 shows the branded waiting state — not the content — while Clerk is still loading', () => {
    setAuth({ isLoaded: false, isSignedIn: false, user: null });
    renderGate();

    expect(screen.getByText('Checking your session')).toBeInTheDocument();
    expect(screen.getByText('opening your shelf')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(getRouterSpy().push).not.toHaveBeenCalled();
  });

  it('TC-UI-004 does not flash protected content on the transition from loading to signed-out', async () => {
    // Regression guard: `blocked` must be true for BOTH states (!isLoaded and
    // !isSignedIn) so the children are never mounted for a guest.
    setAuth({ isLoaded: false, isSignedIn: false, user: null });
    const { rerender } = renderGate();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

    setAuth({ isLoaded: true, isSignedIn: false, user: null });
    rerender(
      <AuthLayout>
        <div data-testid="protected-content">writer-only content</div>
      </AuthLayout>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    await waitFor(() => expect(getRouterSpy().push).toHaveBeenCalledWith('/login'));
  });
});

describe('AuthLayout · inverse mode (authentication = false)', () => {
  it('TC-UI-005 redirects an already-signed-in visitor away to /', async () => {
    setAuth({ isSignedIn: true, user: makeUser() });
    renderGate({ authentication: false });

    await waitFor(() => expect(getRouterSpy().push).toHaveBeenCalledWith('/'));
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('TC-UI-006 renders children for an anonymous visitor in inverse mode', () => {
    setAuth({ isSignedIn: false, user: null });
    renderGate({ authentication: false });

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(getRouterSpy().push).not.toHaveBeenCalled();
  });
});
