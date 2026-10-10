'use client';
import React from 'react';
import { useMotionEffect } from '@/lib/motion';

/**
 * Site-wide ambient layer: three drifting light fields, an engineering grid
 * and film grain. Fixed + pointer-events-none, so it never scrolls, never
 * blocks clicks and costs one compositing layer.
 */
export default function Ambient() {
  const { ref } = useMotionEffect((g, node) => {
    const layers = g.utils.toArray('[data-depth]', node);

    // Cursor parallax — transform only, so it stays on the compositor.
    const move = (e) => {
      const px = e.clientX / window.innerWidth - 0.5;
      const py = e.clientY / window.innerHeight - 0.5;
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 1);
        g.to(layer, {
          x: px * 22 * depth,
          y: py * 18 * depth,
          duration: 1.1,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden noise"
    >
      {/* base wash */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background:
            'radial-gradient(120% 80% at 50% -10%, color-mix(in oklab, var(--accent) 9%, transparent), transparent 60%)',
        }}
      />

      {/* drifting light fields */}
      <div data-depth="1.6" className="absolute inset-0 will-change-transform">
        <div
          className="aurora-blob animate-drift"
          style={{
            width: '46vw',
            height: '46vw',
            top: '-14vw',
            left: '-8vw',
            background: 'var(--aurora-1)',
          }}
        />
        <div
          className="aurora-blob animate-drift-slow"
          style={{
            width: '38vw',
            height: '38vw',
            top: '26vh',
            right: '-10vw',
            background: 'var(--aurora-2)',
          }}
        />
        <div
          className="aurora-blob animate-float-slow"
          style={{
            width: '30vw',
            height: '30vw',
            bottom: '-12vw',
            left: '22vw',
            background: 'var(--aurora-3)',
          }}
        />
      </div>

      {/* grid, fading out toward the middle of the page */}
      <div
        data-depth="0.5"
        className="absolute inset-0 ambient-grid opacity-70 will-change-transform"
        style={{
          maskImage: 'radial-gradient(110% 70% at 50% 0%, #000 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(110% 70% at 50% 0%, #000 20%, transparent 75%)',
        }}
      />
    </div>
  );
}
