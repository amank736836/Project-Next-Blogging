'use client';
import React from 'react';
import Container from '@/components/container/Container';
import SplitHeadline from '@/components/motion/SplitHeadline';
import Reveal from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Effects';
import BrandMark from '@/components/BrandMark';

export default function Manifesto() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <Parallax speed={8} className="pointer-events-none absolute inset-0 -z-10" as="div">
        <div
          className="aurora-blob"
          style={{
            width: '34vw',
            height: '34vw',
            left: '8vw',
            top: '-6vw',
            background: 'var(--aurora-1)',
            opacity: 0.5,
          }}
        />
      </Parallax>

      <Container size="md">
        <div className="relative rounded-[2rem] border border-line bg-surface-1/70 px-7 py-12 backdrop-blur-xl shadow-soft sm:px-12 md:py-16">
          <span className="rule-draw absolute inset-x-10 top-0" aria-hidden />

          <Reveal y={10} duration={0.7}>
            <span className="kicker">04 — why we built it</span>
          </Reveal>

          <SplitHeadline
            as="blockquote"
            text="A photograph keeps a moment. A sentence keeps why it mattered."
            mode="words"
            className="mt-6 font-display text-hero-sm font-medium leading-[1.12] tracking-[-0.03em] text-fg"
          />

          <div className="mt-9 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-7">
            <div className="flex items-center gap-3">
              <BrandMark className="h-9 w-9" play="view" strokeWidth={2.6} />
              <div className="leading-tight">
                <div className="font-display text-[0.98rem] font-semibold text-fg">
                  The Frame &amp; Phrase manifesto
                </div>
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faint">
                  written in the margins, 2026
                </div>
              </div>
            </div>
            <p className="max-w-xs text-[0.9rem] leading-relaxed text-muted">
              No algorithm, no infinite feed, no metrics dashboard judging you at 11pm.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
