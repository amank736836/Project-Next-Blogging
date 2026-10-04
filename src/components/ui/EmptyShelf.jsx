'use client';
import React from 'react';
import { DrawSvg } from '@/components/motion/Effects';
import Reveal from '@/components/motion/Reveal';

/**
 * Empty state with a self-drawing frame — an invitation rather than an error.
 */
export default function EmptyShelf({ title, body, action, className = '' }) {
  return (
    <Reveal y={24} className={`w-full ${className}`}>
      <div className="relative flex flex-col items-center overflow-hidden rounded-[2rem] border border-dashed border-line px-6 py-16 text-center">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-32 opacity-60"
          style={{
            background:
              'radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)',
          }}
        />

        <DrawSvg
          viewBox="0 0 64 64"
          play="auto"
          duration={1.5}
          stagger={0.12}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative h-20 w-20 text-accent/70"
          aria-hidden
        >
          <rect x="6" y="17" width="52" height="34" rx="9" stroke="currentColor" />
          <path d="M23 17l4-8h11l4 8" stroke="currentColor" />
          <path d="M14 25h6M14 25v5M50 43h-6M50 43v-5" stroke="currentColor" />
          <path d="M32 26c-8 6-10.5 13.5 0 19 10.5-5.5 8-13 0-19z" stroke="currentColor" />
          <path d="M32 36.5V46" stroke="currentColor" />
        </DrawSvg>

        <h2 className="relative mt-7 font-display text-2xl font-semibold tracking-tight text-fg md:text-[1.7rem]">
          {title}
        </h2>
        <p className="relative mt-3 max-w-md text-[0.98rem] leading-relaxed text-muted text-pretty">
          {body}
        </p>
        {action && <div className="relative mt-8">{action}</div>}
      </div>
    </Reveal>
  );
}
