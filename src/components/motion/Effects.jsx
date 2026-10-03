'use client';
import React from 'react';
import { useMotionEffect, useMagnetic, usePointerVars, useCountUp, gsap } from '@/lib/motion';

/* ---------------------------------------------------------------- Tilt -- */

/**
 * Faux-3D tilt that follows the pointer, plus a soft glare. `depth` is the
 * maximum rotation in degrees.
 */
export function Tilt({ children, depth = 7, scale = 1.015, className = '', ...props }) {
  const ref = React.useRef(null);
  usePointerVars(ref);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const rx = gsap.quickTo(node, 'rotateX', { duration: 0.55, ease: 'power3.out' });
    const ry = gsap.quickTo(node, 'rotateY', { duration: 0.55, ease: 'power3.out' });
    const sc = gsap.quickTo(node, 'scale', { duration: 0.55, ease: 'power3.out' });

    const onMove = (e) => {
      const r = node.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * depth * 2);
      rx(-py * depth * 2);
    };
    const onEnter = () => sc(scale);
    const onLeave = () => {
      rx(0);
      ry(0);
      sc(1);
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerenter', onEnter);
    node.addEventListener('pointerleave', onLeave);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerenter', onEnter);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, [depth, scale]);

  return (
    <div className="perspective">
      <div
        ref={ref}
        className={`group/tilt relative will-change-transform ${className}`}
        {...props}
      >
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
          style={{
            background:
              'radial-gradient(380px circle at var(--mx,50%) var(--my,50%), rgb(255 255 255 / .13), transparent 68%)',
          }}
        />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- Parallax -- */

/** Vertical drift tied to scroll position — `speed` is in percent. */
export function Parallax({ children, speed = 12, className = '', as: Tag = 'div', ...props }) {
  const { ref } = useMotionEffect(
    (g, node) => {
      g.fromTo(
        node,
        { yPercent: -speed / 2 },
        {
          yPercent: speed / 2,
          ease: 'none',
          scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    },
    [speed]
  );

  return (
    <Tag ref={ref} className={`will-change-transform ${className}`} {...props}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------ Marquee -- */

/**
 * Seamless ticker. One animated track holds two identical copies and slides
 * exactly -50%, so the loop has no seam regardless of the content width.
 */
export function Marquee({ children, duration = 38, reverse = false, className = '' }) {
  const copy = (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden>
      {children}
    </div>
  );

  return (
    <div className={`marquee-mask group relative overflow-hidden ${className}`} role="presentation">
      <div
        className="flex w-max group-hover:[animation-play-state:paused]"
        style={{ animation: `marquee ${duration}s linear infinite${reverse ? ' reverse' : ''}` }}
      >
        {copy}
        {copy}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- DrawSvg -- */

/**
 * Self-drawing vector. Every stroked shape inside is inked in as it enters the
 * viewport — used for the brand mark, dividers and the success check.
 */
export function DrawSvg({
  children,
  duration = 1.5,
  stagger = 0.1,
  start = 'top 82%',
  scrub = false,
  play = 'view',
  className = '',
  viewBox = '0 0 24 24',
  ...props
}) {
  const { ref } = useMotionEffect(
    (g, node) => {
      const paths = g.utils.toArray('path,line,polyline,polygon,circle,rect', node);
      if (!paths.length) return;

      paths.forEach((p) => {
        let len = 0;
        try {
          len = typeof p.getTotalLength === 'function' ? p.getTotalLength() : 0;
        } catch {
          len = 0;
        }
        if (len && p.getAttribute('stroke') !== 'none') {
          g.set(p, { strokeDasharray: len, strokeDashoffset: len });
        }
      });

      g.to(paths, {
        strokeDashoffset: 0,
        duration,
        ease: 'power2.inOut',
        stagger,
        ...(play === 'auto'
          ? {}
          : { scrollTrigger: { trigger: node, start, ...(scrub ? { end: 'bottom 65%', scrub: 0.5 } : { once: true }) } }),
      });
    },
    [duration, stagger, start, scrub, play]
  );

  return (
    <svg ref={ref} viewBox={viewBox} className={className} fill="none" {...props}>
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------- CountUp -- */

/** Number that inks itself up when scrolled into view. */
export function CountUp({ value, prefix = '', suffix = '', decimals = 0, className = '' }) {
  const [ref, text] = useCountUp(value, { prefix, suffix, decimals });
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {text}
    </span>
  );
}

/* ----------------------------------------------------------- Magnetic -- */

/** Wrapper that leans toward the cursor (used on primary CTAs). */
export function Magnetic({ children, strength = 0.3, className = '', as: Tag = 'div', ...props }) {
  const ref = useMagnetic(strength);
  return (
    <Tag ref={ref} className={`inline-block will-change-transform ${className}`} {...props}>
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------- Spotlight -- */

/** Adds --mx/--my so CSS can track the cursor across a surface. */
export function Spotlight({ children, className = '', as: Tag = 'div', ...props }) {
  const ref = React.useRef(null);
  usePointerVars(ref);
  return (
    <Tag ref={ref} className={`spotlight ${className}`} {...props}>
      {children}
    </Tag>
  );
}
