'use client';
import React from 'react';
import BrandMark from './BrandMark';

/**
 * Wordmark lockup. Uses the redrawable vector mark so it stays crisp on both
 * themes (the shipped PNG has a solid background); pass `badge` to get the
 * bitmap inside a rounded tile instead.
 */
export default function Logo({
  size = 'md',
  showWordmark = true,
  stacked = false,
  badge = false,
  className = '',
}) {
  const box = { sm: 'h-7 w-7', md: 'h-9 w-9', lg: 'h-12 w-12', xl: 'h-16 w-16' }[size];
  const title = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl md:text-4xl',
  }[size];

  return (
    <span className={`group inline-flex items-center gap-2.5 ${className}`}>
      {badge ? (
        <span
          className={`${box} shrink-0 overflow-hidden rounded-xl ring-1 ring-line transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/frame_phrase_logo_premium_1771127061725.png"
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </span>
      ) : (
        <BrandMark className={`${box} shrink-0`} strokeWidth={2.6} />
      )}

      {showWordmark && (
        <span className={`flex flex-col leading-none ${stacked ? 'items-start' : ''}`}>
          <span
            className={`${title} font-display font-semibold tracking-[-0.03em] text-fg transition-colors duration-500 group-hover:text-accent`}
          >
            Frame&nbsp;<span className="text-accent/85">&amp;</span>&nbsp;Phrase
          </span>
          {!stacked && size !== 'sm' && (
            <span className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.3em] text-faint">
              prose finds home
            </span>
          )}
        </span>
      )}
    </span>
  );
}
