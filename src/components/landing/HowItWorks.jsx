'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Camera, PenLine, Archive, Compass } from 'lucide-react';
import Container from '@/components/container/Container';
import Reveal from '@/components/motion/Reveal';
import SplitHeadline from '@/components/motion/SplitHeadline';
import { useInView, useMotionEffect } from '@/lib/motion';

const STEPS = [
  {
    Icon: Camera,
    title: 'Frame it',
    body: 'Drop a photo anywhere on the page. It uploads to Cloudinary, gets a sane filename and never leaves your side again.',
    meta: '00:00',
  },
  {
    Icon: PenLine,
    title: 'Phrase it',
    body: 'Write while the moment is still warm. Headings, pull-quotes, links — the editor only offers what a paragraph needs.',
    meta: '00:12',
  },
  {
    Icon: Archive,
    title: 'Keep or publish',
    body: 'Park it as inactive and it stays in your shelf. Flip it to active and it joins the archive at its own URL.',
    meta: '03:41',
  },
  {
    Icon: Compass,
    title: 'Find it again',
    body: 'Every post keeps a hand-tuned slug, so a link you sent in 2026 still opens the exact same story in 2031.',
    meta: '∞',
  },
];

export default function HowItWorks() {
  const { ref } = useMotionEffect((g, node) => {
    const line = node.querySelector('[data-rail]');
    if (!line) return;
    g.set(line, { strokeDasharray: 100, strokeDashoffset: 100 });
    g.to(line, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: node,
        start: 'top 72%',
        end: 'bottom 62%',
        scrub: 0.6,
      },
    });
  }, []);

  return (
    <section id="how" className="relative scroll-mt-24 border-y border-line bg-surface-1/40 py-20 backdrop-blur-[2px] md:py-28">
      <Container size="xl">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* sticky intro */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal y={12} duration={0.7}>
              <span className="kicker">03 — the ritual</span>
            </Reveal>
            <SplitHeadline
              as="h2"
              text="Four moves, start to published."
              accent="start"
              className="mt-5 font-display text-section font-semibold tracking-[-0.03em] text-fg"
            />
            <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-muted text-pretty">
              The whole thing takes about as long as a good cup of coffee. Scroll and the
              rail draws itself alongside.
            </p>
            <Link
              href="/features"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent"
            >
              <span className="link-line">See the full feature list</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1" />
            </Link>
          </div>

          {/* steps + drawn rail */}
          <ol ref={ref} className="relative pl-1">
            <svg
              aria-hidden
              viewBox="0 0 1 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute left-[1.34rem] top-3 h-[calc(100%-1.5rem)] w-[2px] sm:left-[1.59rem]"
            >
              <line
                data-rail
                x1="0.5"
                y1="0"
                x2="0.5"
                y2="100"
                stroke="var(--accent)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {STEPS.map((step, i) => (
              <Step key={step.title} {...step} index={i} />
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

function Step({ Icon, title, body, meta, index }) {
  const [ref, inView] = useInView({ threshold: 0.65 });

  return (
    <li
      ref={ref}
      className="group relative flex gap-6 pb-12 pl-11 last:pb-0 sm:pl-14"
    >
      {/* marker */}
      <span
        aria-hidden
        className={`absolute left-0 top-1 grid h-11 w-11 place-items-center rounded-full border transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] sm:h-12 sm:w-12 ${
          inView
            ? 'border-accent bg-accent text-white shadow-[0_0_0_6px_color-mix(in_oklab,var(--accent)_16%,transparent)]'
            : 'border-line bg-surface-1 text-faint'
        }`}
      >
        <Icon
          className={`h-[1.1rem] w-[1.1rem] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${
            inView ? 'scale-100 rotate-0' : 'scale-90 -rotate-6'
          }`}
          strokeWidth={1.9}
        />
      </span>

      <div
        className={`transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-60'
        }`}
      >
        <div className="flex flex-wrap items-baseline gap-x-3">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-faint">
            step {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-mono text-[0.62rem] text-accent/80">{meta}</span>
        </div>
        <h3 className="mt-1.5 font-display text-[1.35rem] font-semibold tracking-tight text-fg">
          {title}
        </h3>
        <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-muted text-pretty">
          {body}
        </p>
      </div>
    </li>
  );
}
