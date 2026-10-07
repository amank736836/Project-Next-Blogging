/**
 * UI-004 · Theme system — src/hooks/theme-context.js
 *
 * The theme is the one piece of global state the app owns outright: it is
 * mirrored off <html class="dark"> with useSyncExternalStore and persisted to
 * localStorage under `themeMode`. The inline script in src/app/layout.js reads
 * that same key before first paint, so a regression here causes a white flash
 * on every dark visit.
 *
 * Traceability: REQ-013 / FEAT-009 / SCN-UI-19..22
 */
import { afterEach, describe, expect, it } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const { ThemeProvider, useTheme } = await import('@/hooks/theme-context.js');

const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

function Probe() {
  const { themeMode, toggleTheme, setTheme, mounted } = useTheme();
  return (
    <div>
      <output data-testid="mode">{themeMode}</output>
      <output data-testid="mounted">{String(mounted)}</output>
      <button type="button" onClick={toggleTheme}>toggle</button>
      <button type="button" onClick={() => setTheme('dark')}>force dark</button>
    </div>
  );
}

afterEach(() => {
  document.documentElement.classList.remove('dark');
});

describe('Theme context', () => {
  it('TC-UI-017 starts in light mode when nothing is stored', () => {
    render(<Probe />, { wrapper });

    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('TC-UI-018 toggling flips the <html> class, the context value and localStorage together', async () => {
    const user = userEvent.setup();
    render(<Probe />, { wrapper });

    await user.click(screen.getByRole('button', { name: 'toggle' }));

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(localStorage.getItem('themeMode')).toBe('dark');
  });

  it('TC-UI-019 a second toggle returns to light and persists that too', async () => {
    const user = userEvent.setup();
    render(<Probe />, { wrapper });

    await user.click(screen.getByRole('button', { name: 'toggle' }));
    await user.click(screen.getByRole('button', { name: 'toggle' }));

    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('themeMode')).toBe('light');
  });

  it('TC-UI-020 setTheme("dark") is idempotent — repeated calls do not drift', async () => {
    const user = userEvent.setup();
    render(<Probe />, { wrapper });

    await user.click(screen.getByRole('button', { name: 'force dark' }));
    await user.click(screen.getByRole('button', { name: 'force dark' }));

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(localStorage.getItem('themeMode')).toBe('dark');
  });

  it('TC-UI-021 reports mounted=true once hydrated in a browser', () => {
    render(<Probe />, { wrapper });
    expect(screen.getByTestId('mounted')).toHaveTextContent('true');
  });
});

describe('Theme context · defaults', () => {
  it('TC-UI-022 useTheme() outside a provider degrades to a light no-op instead of throwing', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.themeMode).toBe('light');
    expect(result.current.mounted).toBe(false);
    expect(() => result.current.setTheme('dark')).not.toThrow();
    expect(() => result.current.toggleTheme()).not.toThrow();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
