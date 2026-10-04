import React from 'react';

/**
 * Brand loader: a nib dipped in ink — a ring that draws itself with a travelling
 * dot. Inherits `currentColor`, so it works on any surface.
 */
export default function Loader({ size = 28, className = '', label = 'Loading' }) {
  const dim = `${size}px`;
  return (
    <span
      role="status"
      aria-live="polite"
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: dim, height: dim }}
    >
      <span
        className="absolute inset-0 animate-spin rounded-full border-2 border-current opacity-25"
        style={{ animationDuration: '1.5s', borderTopColor: 'transparent', borderRightColor: 'transparent' }}
      />
      <span
        className="absolute inset-[26%] animate-spin rounded-full border-2 border-current"
        style={{
          animationDuration: '1s',
          animationDirection: 'reverse',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
          opacity: 0.85,
        }}
      />
      <span className="absolute inset-0 m-auto h-1 w-1 rounded-full bg-current" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
