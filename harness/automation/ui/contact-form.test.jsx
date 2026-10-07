/**
 * UI-002 · Contact form — the only hand-written validation in the app.
 *
 * Code under test : src/app/contact/page.js (real, unmodified)
 *
 * The three rules live inside the page component, so the only honest way to
 * test them is to drive the rendered form.
 *
 * Traceability: REQ-017 / FEAT-008 / SCN-UI-06..13, SCN-NEG-*
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('@/components/motion/Reveal', () => ({
  default: ({ children, className = '' }) => <div className={className}>{children}</div>,
}));
vi.mock('@/components/motion/Effects', () => ({
  DrawSvg: ({ children }) => <svg data-testid="draw-svg">{children}</svg>,
}));

const ContactPage = (await import('@/app/contact/page.js')).default;
const { VALID_CONTACT } = await import('@harness/test-data/fixtures/posts.js');

const fill = async (user, { name, email, message }) => {
  if (name !== undefined) await user.type(screen.getByLabelText(/your name/i), name);
  if (email !== undefined) await user.type(screen.getByLabelText(/^email$/i), email);
  if (message !== undefined) await user.type(screen.getByLabelText(/^message$/i), message);
};

beforeEach(() => {
  // The submit handler defers its success state with a 700 ms setTimeout.
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Contact form · validation', () => {
  it('TC-UI-007 blocks submission and names all three missing fields when the form is empty', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactPage />);

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText('Tell us who is writing')).toBeInTheDocument();
    expect(await screen.findByText('That address will not reach you')).toBeInTheDocument();
    expect(await screen.findByText('A little more context, please')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /message sent/i })).not.toBeInTheDocument();
  });

  it('TC-NEG-006 rejects a name shorter than 2 characters', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactPage />);
    await fill(user, { ...VALID_CONTACT, name: 'A' });

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText('Tell us who is writing')).toBeInTheDocument();
  });

  it('TC-NEG-007 rejects an email without a domain', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactPage />);
    await fill(user, { ...VALID_CONTACT, email: 'not-an-email' });

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText('That address will not reach you')).toBeInTheDocument();
  });

  it('TC-EDGE-006 rejects a message of 11 characters and accepts exactly 12', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { unmount } = render(<ContactPage />);
    await fill(user, { ...VALID_CONTACT, message: 'x'.repeat(11) });
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText('A little more context, please')).toBeInTheDocument();
    unmount();

    render(<ContactPage />);
    await fill(user, { ...VALID_CONTACT, message: 'x'.repeat(12) });
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByRole('heading', { name: /message sent/i })).toBeInTheDocument();
  });

  it('TC-UI-008 marks the message field invalid for assistive technology', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactPage />);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByLabelText(/^message$/i)).toHaveAttribute('aria-invalid', 'true')
    );
  });
});

describe('Contact form · happy path', () => {
  it('TC-UI-009 accepts valid input, clears the fields and shows the success state', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactPage />);
    await fill(user, VALID_CONTACT);

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByRole('heading', { name: /message sent/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/your name/i)).not.toBeInTheDocument();
  });

  it('TC-UI-010 "Write another" returns to an empty form', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactPage />);
    await fill(user, VALID_CONTACT);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    await screen.findByRole('heading', { name: /message sent/i });

    await user.click(screen.getByRole('button', { name: /write another/i }));

    expect(await screen.findByLabelText(/your name/i)).toHaveValue('');
  });

  it('TC-UI-011 switches the topic chip and keeps it in the pressed state', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactPage />);

    const billing = screen.getByRole('button', { name: 'Billing' });
    await user.click(billing);

    expect(billing).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'A bug' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('TC-UI-012 [BUG-010] reports success without ever sending anything — the form has no backend', async () => {
    // Documented limitation, asserted so it cannot regress silently into a
    // half-wired endpoint. src/app/contact/page.js says so in a comment:
    // "No inbox on the other end yet — the UI promise is the deliverable."
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(<ContactPage />);
    await fill(user, VALID_CONTACT);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await screen.findByRole('heading', { name: /message sent/i });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
