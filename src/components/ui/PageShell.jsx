'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useMotionEffect, useScrollTriggerRefresh } from '@/lib/motion';

/**
 * Page-transition wrapper. Each navigation fades the new view up and runs a
 * light sweep across the top of the viewport. Transform props are cleared on
 * complete so `position: fixed` children are never affected afterwards.
 */
export default function PageShell({ children }) {
  const pathname = usePathname();
  const content = React.useRef(null);
  const sweep = React.useRef(null);

  // Keep every ScrollTrigger on the page honest after fonts/images settle.
  useScrollTriggerRefresh();

  const { ref } = useMotionEffect(
    (g) => {
      const tl = g.timeline();
      tl.fromTo(
        content.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
          clearProps: 'transform,opacity',
        },
        0
      );
      tl.fromTo(
        sweep.current,
        { xPercent: -100, opacity: 0.9 },
        {
          xPercent: 100,
          opacity: 0,
          duration: 1.05,
          ease: 'power3.inOut',
          clearProps: 'transform,opacity',
        },
        0
      );
    },
    [pathname]
  );

  return (
    <div ref={ref} className="relative">
      <span
        aria-hidden
        ref={sweep}
        className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-[2px] will-change-transform"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--accent), transparent)',
        }}
      />
      <div ref={content}>{children}</div>
    </div>
  );
}
