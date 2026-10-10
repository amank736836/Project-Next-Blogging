'use client';
import React from 'react';
import { MOTION, useMotionEffect } from '@/lib/motion';

/**
 * Scroll-triggered entrance.
 *
 * With `stagger`, the direct children are revealed in sequence; without, the
 * element itself rises into place. Content is only ever hidden by GSAP inside
 * a layout effect, so a reduced-motion (or no-JS) visitor always sees it.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  y = 26,
  x = 0,
  scale,
  opacity = 0,
  blur = false,
  rotate = 0,
  duration = MOTION.duration,
  delay = 0,
  stagger = 0,
  start = MOTION.start,
  scroll = true,
  once = true,
  className = '',
  ...props
}) {
  const { ref } = useMotionEffect(
    (g, node) => {
      const from = {
        y,
        x,
        opacity,
        rotation: rotate || undefined,
        filter: blur ? 'blur(9px)' : undefined,
        ...(scale ? { scale } : {}),
      };
      const targets = stagger ? Array.from(node.children) : node;

      g.from(targets, {
        ...from,
        duration,
        delay,
        ease: MOTION.ease,
        ...(stagger ? { stagger } : {}),
        ...(scroll ? { scrollTrigger: { trigger: node, start, once } } : {}),
      });
    },
    [stagger, y, x, scale, opacity, blur, rotate, duration, delay, start, scroll, once]
  );

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
}
