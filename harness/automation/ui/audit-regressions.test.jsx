/**
 * UI-040 · QA-audit regressions for shared UI.
 *
 *  - Header: the closed mobile sheet is `invisible` (removed from the
 *    accessibility tree and tab order), not merely transparent.
 *  - Pricing FAQ: each accordion trigger is wired to its panel with
 *    aria-controls, and the closed panel is inert so its links cannot be
 *    tabbed to.
 *  - Contact: the topic chip reads "An idea" (was the ungrammatical "A idea").
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
  default: () => <span>Frame &amp; Phrase</span>,
}));
vi.mock('@/components/ThemeBtn', () => ({
  default: () => <button type="button">theme</button>,
}));
vi.mock('@/components/motion/Reveal', () => ({
  default: ({ children, className = '' }) => <div className={className}>{children}</div>,
}));
vi.mock('@/components/motion/Effects', () => ({
  DrawSvg: ({ children }) => <svg>{children}</svg>,
  Spotlight: ({ children }) => <>{children}</>,
  Magnetic: ({ children }) => <>{children}</>,
  Parallax: ({ children }) => <>{children}</>,
}));

const { setAuth } = await import('@harness/automation/utilities/mocks/clerk');
const { resetRouter, setPathname } = await import(
  '@harness/automation/utilities/mocks/next-navigation'
);
const Header = (await import('@/components/header/Header.jsx')).default;
const PricingPage = (await import('@/app/pricing/page.js')).default;
const ContactPage = (await import('@/app/contact/page.js')).default;

beforeEach(() => {
  resetRouter();
  setPathname('/');
  setAuth({ isSignedIn: false, user: null });
});

describe('Header · mobile sheet visibility', () => {
  it('is visible and interactive only while the menu is open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Header />);
    const sheet = container.querySelector('#mobile-nav');

    expect(sheet).toHaveClass('invisible', 'pointer-events-none');
    expect(sheet).not.toHaveClass('visible');

    await user.click(screen.getByRole('button', { name: /open menu/i }));

    expect(sheet).toHaveClass('visible', 'pointer-events-auto');
    expect(sheet).not.toHaveClass('invisible');
  });
});

describe('Pricing · FAQ accordion semantics', () => {
  it('links each question to its panel and keeps the closed panel inert', async () => {
    const user = userEvent.setup();
    const { container } = render(<PricingPage />);
    const trigger = screen.getByRole('button', { name: /what actually happens if i stop paying/i });
    const panelId = trigger.getAttribute('aria-controls');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(panelId).toBeTruthy();
    const panel = container.querySelector(`[id="${panelId}"]`);
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute('inert');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(container.querySelector(`[id="${panelId}"]`)).not.toHaveAttribute('inert');
  });
});

describe('Contact · topic chips', () => {
  it('spells the idea topic "An idea"', () => {
    render(<ContactPage />);
    expect(screen.getByRole('button', { name: 'An idea' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'A idea' })).not.toBeInTheDocument();
  });
});
