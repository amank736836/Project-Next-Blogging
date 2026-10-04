'use client';
import React from 'react';
import { DrawSvg } from '@/components/motion';

/**
 * Vector re-draw of the brand: a camera frame holding a nib. Because it is
 * real geometry it can ink itself in on view and flash on hover — the bitmap
 * logo can't. `animated={false}` falls back to the shipped PNG elsewhere.
 */
export default function BrandMark({
  className = 'h-10 w-10',
  play = 'view',
  strokeWidth = 2.4,
  accent = true,
  ...props
}) {
  return (
    <span className={`group relative inline-flex items-center justify-center ${className}`}>
      <DrawSvg
        viewBox="0 0 64 64"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        play={play}
        duration={1.8}
        stagger={0.14}
        className="relative z-10 h-full w-full text-ink-800 transition-colors duration-500 group-hover:text-accent dark:text-brand-100"
        aria-hidden
        {...props}
      >
        {/* body */}
        <rect x="6" y="17" width="52" height="34" rx="9" stroke="currentColor" />
        {/* viewfinder bump */}
        <path d="M23 17l4-8h11l4 8" stroke="currentColor" />
        {/* framing brackets */}
        <path d="M14 25h6M14 25v5M50 43h-6M50 43v-5" stroke="currentColor" />
        {/* nib */}
        <path
          d="M32 26c-8 6-10.5 13.5 0 19 10.5-5.5 8-13 0-19z"
          stroke={accent ? 'var(--accent)' : 'currentColor'}
        />
        <path d="M32 36.5V46" stroke={accent ? 'var(--accent)' : 'currentColor'} />
        <circle cx="32" cy="38" r="2.3" stroke="currentColor" />
      </DrawSvg>

      {accent && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 rounded-full opacity-0 blur-lg transition-opacity duration-700 group-hover:opacity-60"
          style={{ background: 'var(--accent)' }}
        />
      )}
    </span>
  );
}
