'use client';
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Container from '@/components/container/Container';
import Button from '@/components/Button';
import Reveal from '@/components/motion/Reveal';
import SplitHeadline from '@/components/motion/SplitHeadline';
import { Magnetic } from '@/components/motion/Effects';

export default function CtaBand() {
  return (
    <section className="relative pb-24 pt-4 md:pb-32">
      <Container size="lg">
        <Reveal y={34} blur>
          <div className="ring-grad relative isolate overflow-hidden rounded-[2.25rem] border border-line px-6 py-14 text-center shadow-lift sm:px-14 md:py-20">
            {/* layered backdrop */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                background:
                  'linear-gradient(150deg, color-mix(in oklab, var(--accent) 16%, transparent), transparent 45%), linear-gradient(330deg, color-mix(in oklab, #7c5cff 16%, transparent), transparent 50%), var(--surface-1)',
              }}
            />
            <div aria-hidden className="absolute inset-0 -z-10 ambient-grid opacity-40" />
            <span
              aria-hidden
              className="absolute -bottom-24 left-1/2 -z-10 h-48 w-48 -translate-x-1/2 rounded-full opacity-50 blur-2xl"
              style={{ background: 'var(--accent)' }}
            />

            <span className="kicker justify-center">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              free while you find your voice
            </span>

            <SplitHeadline
              as="h2"
              text="Your first story is one paragraph away."
              accent="one paragraph"
              className="mx-auto mt-6 max-w-3xl font-display text-hero-sm font-semibold tracking-[-0.035em] text-fg"
            />

            <Reveal delay={0.2} y={14} duration={0.7} scroll={false}>
              <p className="mx-auto mt-6 max-w-xl text-[1.02rem] leading-relaxed text-muted text-pretty">
                Create an account, paste a photo, write the thing you have been meaning to
                write. It takes four minutes and costs nothing.
              </p>
            </Reveal>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Magnetic strength={0.2}>
                <Button href="/signup" size="lg" variant="primary" iconRight={<ArrowRight className="h-4 w-4" />}>
                  Create your shelf
                </Button>
              </Magnetic>
              <Button href="/pricing" size="lg" variant="ghost">
                Compare plans
              </Button>
            </div>

            <p className="mt-7 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
              no card · cancel by simply not writing
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
