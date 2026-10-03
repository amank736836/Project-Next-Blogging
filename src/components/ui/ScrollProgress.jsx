'use client';
import React from 'react';
import { useScrollInfo } from '@/lib/motion';

/**
 * Thin gradient progress line. Defaults to the whole document; pass
 * `targetId` to track one element instead (used for article reading progress).
 */
export default function ScrollProgress({ targetId, variant = 'fixed', className = '' }) {
  const { progress } = useScrollInfo(targetId);

  const bar = (
    <div
      className="h-full w-full origin-left rounded-full will-change-transform"
      style={{
        transform: `scaleX(${progress})`,
        transition: 'transform 120ms linear',
        background:
          'linear-gradient(90deg, var(--accent), color-mix(in oklab, var(--accent) 40%, #7c5cff) 55%, #f5b642)',
      }}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );

  if (variant === 'inline') {
    // Bare bar: the parent owns height, rounding and track colour.
    return bar;
  }

  return (
    <div className={`fixed inset-x-0 top-0 z-[70] h-[2px] ${className}`}>{bar}</div>
  );
}
