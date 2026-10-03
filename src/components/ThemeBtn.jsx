'use client';
import React from 'react';
import { useTheme } from '@/hooks/theme-context';

/**
 * Theme switch with a circular view-transition wipe that grows out of the
 * button itself. Falls back to a plain swap when the browser (or the user's
 * motion preference) says no.
 */
export default function ThemeBtn({ compact = false, className = '' }) {
  const { themeMode, toggleTheme, mounted } = useTheme();
  const isDark = mounted && themeMode === 'dark';
  const [spin, setSpin] = React.useState(0);

  const handle = (event) => {
    setSpin((s) => s + 180);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof document.startViewTransition !== 'function' || reduce) {
      toggleTheme();
      return;
    }

    const root = document.documentElement;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const r = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    root.style.setProperty('--vt-x', `${x}px`);
    root.style.setProperty('--vt-y', `${y}px`);
    root.style.setProperty('--vt-r', `${r}px`);
    root.classList.add('theme-vt');

    const vt = document.startViewTransition(() => toggleTheme());
    vt.finished.finally(() => root.classList.remove('theme-vt')).catch(() => {
      root.classList.remove('theme-vt');
    });
  };

  return (
    <button
      type="button"
      onClick={handle}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`${isDark ? 'Light' : 'Dark'} mode`}
      className={`group relative inline-flex h-9 items-center gap-2 rounded-full border border-line bg-surface-1/70 pl-1 pr-1 text-fg backdrop-blur transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:border-accent/50 hover:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_12%,transparent)] ${
        compact ? '' : 'sm:pl-3'
      } ${className}`}
    >
      {/* mini label */}
      {!compact && (
        <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faint transition-colors duration-300 group-hover:text-fg sm:block">
          {isDark ? 'night' : 'day'}
        </span>
      )}

      <span
        aria-hidden
        className="relative flex h-7 w-[3.05rem] items-center overflow-hidden rounded-full bg-ink-100 transition-colors duration-500 dark:bg-ink-900"
      >
        {/* stars fade in at night */}
        <span
          className={`absolute inset-0 transition-opacity duration-700 ${
            isDark ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {[
            [6, 8],
            [14, 16],
            [22, 6],
            [30, 13],
            [40, 9],
          ].map(([left, top], i) => (
            <span
              key={i}
              className="absolute h-[3px] w-[3px] rounded-full bg-brand-200"
              style={{ left, top, opacity: 0.5 + (i % 3) * 0.2 }}
            />
          ))}
        </span>

        {/* horizon glow in day mode */}
        <span
          className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ember-400/40 to-transparent transition-opacity duration-700 ${
            isDark ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* travelling knob */}
        <span
          className="absolute left-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-[transform,background-color] duration-[650ms] ease-[cubic-bezier(.16,1,.3,1)] dark:translate-x-[1.45rem] dark:bg-ink-700"
          style={{ rotate: `${spin}deg`, transitionProperty: 'transform, rotate, background-color' }}
        >
          <SunIcon className="absolute h-3.5 w-3.5 text-ember-500 transition-all duration-500 dark:scale-0 dark:opacity-0" />
          <MoonIcon className="absolute h-3.5 w-3.5 text-brand-200 scale-0 opacity-0 transition-all duration-500 dark:scale-100 dark:opacity-100" />
        </span>
      </span>
    </button>
  );
}

function SunIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.4v2.2M12 19.4v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.4 12h2.2M19.4 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </svg>
  );
}

function MoonIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
    </svg>
  );
}
