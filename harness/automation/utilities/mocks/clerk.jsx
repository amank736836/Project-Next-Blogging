/**
 * Clerk mock for UI tests.
 *
 * Clerk's real widgets require a network round-trip to a Clerk Frontend API and
 * a genuine publishable key, so they cannot run in the harness. What we *can*
 * test — and what actually carries the app's authorisation decisions — is how
 * our own components react to the values Clerk hands them:
 * `isLoaded`, `isSignedIn`, and `user.id`.
 *
 * Usage inside a test file:
 *
 *   vi.mock('@clerk/nextjs', async () =>
 *     (await import('@harness/automation/utilities/mocks/clerk')).createClerkMock());
 *
 *   import { setAuth } from '@harness/automation/utilities/mocks/clerk';
 *   setAuth({ isSignedIn: true, user: { id: 'user_a' } });
 *
 * NOTE: this mocks the boundary, not the app. It proves our gates behave; it
 * does NOT prove Clerk itself authenticates. That gap is tracked as
 * harness/test-scenarios/security.md SCN-SEC-01 (manual, NOT_EXECUTED).
 */
import React from 'react';

const state = {
  isLoaded: true,
  isSignedIn: false,
  user: null,
  session: null,
  orgId: null,
};

export function setAuth(next = {}) {
  Object.assign(state, {
    isLoaded: true,
    isSignedIn: false,
    user: null,
  }, next);
  return state;
}

export function resetAuth() {
  setAuth({ isLoaded: true, isSignedIn: false, user: null });
}

export function getAuthState() {
  return { ...state };
}

/** A Clerk user object shaped like the fields this app actually reads. */
export function makeUser(overrides = {}) {
  return {
    id: 'user_harness_default',
    username: 'harness_writer',
    fullName: 'Harness Writer',
    firstName: 'Harness',
    lastName: 'Writer',
    primaryEmailAddress: { emailAddress: 'writer@example.test' },
    imageUrl: 'https://example.test/avatar.png',
    ...overrides,
  };
}

export function createClerkMock() {
  return {
    ClerkProvider: ({ children }) => <>{children}</>,
    useAuth: () => ({
      isLoaded: state.isLoaded,
      isSignedIn: state.isSignedIn,
      userId: state.user?.id ?? null,
      sessionId: state.session?.id ?? null,
      orgId: state.orgId,
      getToken: async () => 'harness-fake-session-token',
      signOut: async () => undefined,
    }),
    useUser: () => ({
      isLoaded: state.isLoaded,
      isSignedIn: state.isSignedIn,
      user: state.isSignedIn ? state.user : null,
    }),
    UserButton: () => <div data-testid="clerk-user-button" />,
    SignIn: () => <div data-testid="clerk-sign-in" />,
    SignUp: () => <div data-testid="clerk-sign-up" />,
    SignedIn: ({ children }) => (state.isSignedIn ? <>{children}</> : null),
    SignedOut: ({ children }) => (state.isSignedIn ? null : <>{children}</>),
    currentUser: () => (state.isSignedIn ? state.user : null),
    auth: () => ({ userId: state.user?.id ?? null }),
  };
}
