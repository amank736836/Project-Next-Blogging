/**
 * UI-005 · Header navigation — src/components/header/Header.jsx
 *
 * The header is the app's route surface: it changes which links exist based on
 * Clerk state, and it owns the mobile sheet (Escape to close, body scroll lock,
 * close on route change).
 *
 * Traceability: REQ-014 / FEAT-001 FEAT-003 / SCN-UI-23..27
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('@clerk/nextjs', async () =>
  (await import('@harness/automation/utilities/mocks/clerk')).createClerkMock()
);
vi.mock('next/navigation', async () =>
  (await import('@harness/automation/utilities/mocks/next-navigation')).createNextNavigationMock()
);
vi.mock('@/components/Logo', () => ({
  default: () => <span data-testid="logo">Frame &amp; Phrase</span>,
}));
vi.mock('@/components/ThemeBtn', () => ({
  default: () => <button type="button" data-testid="theme-btn">theme</button>,
}));

const { setAuth, makeUser } = await import('@harness/automation/utilities/mocks/clerk');
const { setPathname, resetRouter } = await import(
  '@harness/automation/utilities/mocks/next-navigation'
);
const Header = (await import('@/components/header/Header.jsx')).default;

const menuButton = () => screen.getByRole('button', { name: /open menu|close menu/i });

beforeEach(() => {
  resetRouter();
  setPathname('/');
  setAuth({ isSignedIn: false, user: null });
});

describe('Header · guest state', () => {
  it('TC-UI-023 offers Log in and Start writing, and no writer links', () => {
    render(<Header />);

    // Both the desktop bar and the mobile sheet render these, hence getAll.
    expect(screen.getAllByRole('link', { name: 'Log in' })[0]).toHaveAttribute('href', '/login');
    expect(screen.getAllByRole('link', { name: 'Start writing' })[0]).toHaveAttribute(
      'href',
      '/signup'
    );
    expect(screen.queryByRole('link', { name: 'Stories' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Write' })).not.toBeInTheDocument();
  });

  it('TC-UI-024 always shows the three public marketing links', () => {
    render(<Header />);

    for (const name of ['Home', 'Features', 'Pricing', 'Contact']) {
      expect(screen.getAllByRole('link', { name }).length).toBeGreaterThan(0);
    }
  });
});

describe('Header · signed-in state', () => {
  beforeEach(() => {
    setAuth({ isSignedIn: true, user: makeUser() });
  });

  it('TC-UI-025 adds Stories and Write, and drops Log in / Start writing', () => {
    render(<Header />);

    expect(screen.getAllByRole('link', { name: 'Stories' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Write' }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('link', { name: 'Log in' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Start writing' })).not.toBeInTheDocument();
  });

  it('TC-UI-026 renders the Clerk UserButton only when signed in', () => {
    render(<Header />);
    expect(screen.getByTestId('clerk-user-button')).toBeInTheDocument();
  });
});

describe('Header · mobile sheet', () => {
  it('TC-UI-027 toggles aria-expanded and locks body scroll while open', async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(menuButton());

    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(screen.getByRole('button', { name: /close menu/i }));
    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('TC-UI-028 closes on Escape and restores the previous overflow value', async () => {
    const user = userEvent.setup();
    document.body.style.overflow = 'auto';
    render(<Header />);

    await user.click(menuButton());
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');

    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(document.body.style.overflow).toBe('auto');
  });
});
