'use client';
import React from 'react';
import Link from 'next/link';

const VARIANTS = {
  primary: 'btn-primary btn-sheen',
  ghost: 'btn-ghost',
  outline:
    'border border-line text-fg hover:border-accent/60 hover:text-accent bg-transparent',
  danger: 'btn-danger btn-sheen',
  subtle:
    'bg-accent/10 text-accent hover:bg-accent/18 border border-accent/25',
  link: 'text-fg hover:text-accent underline-offset-4',
};

const SIZES = {
  xs: 'text-xs px-3 py-1.5 gap-1.5',
  sm: 'text-sm px-3.5 py-2 gap-2',
  md: 'text-sm px-5 py-2.5 gap-2',
  lg: 'text-base px-7 py-3.5 gap-2.5',
  xl: 'text-base md:text-lg px-9 py-4 gap-3',
};

/**
 * Shared button. `variant` covers the visual family, `loading` swaps in the
 * ink spinner, and `iconRight` slides on hover for "read more" affordances.
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  css = '',
  loading = false,
  disabled = false,
  iconRight,
  iconLeft,
  href,
  external = false,
  onClick,
  ...props
}) {
  const classes = [
    'btn group/btn',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    className,
    css,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {loading && (
        <span
          aria-hidden
          className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80"
        />
      )}
      {!loading && iconLeft && <span className="shrink-0 transition-transform duration-500 group-hover/btn:-translate-x-0.5">{iconLeft}</span>}
      <span className="relative">{children}</span>
      {!loading && (iconRight ?? null) && (
        <span className="shrink-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover/btn:translate-x-1">
          {iconRight}
        </span>
      )}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer noopener" className={classes} {...props}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...props}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={classes} {...props}>
      {inner}
    </button>
  );
}
