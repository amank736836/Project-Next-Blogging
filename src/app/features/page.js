'use client';
import React from 'react';
import Link from 'next/link';
import { Check, Minus, Zap } from 'lucide-react';
import Container from '@/components/container/Container';
import PageHeader from '@/components/ui/PageHeader';
import FeatureGrid from '@/components/landing/FeatureGrid';
import CtaBand from '@/components/landing/CtaBand';
import Reveal from '@/components/motion/Reveal';
import SplitHeadline from '@/components/motion/SplitHeadline';
import { CountUp } from '@/components/motion/Effects';

const STACK = [
  ['Next.js 16', 'app router + server actions ready'],
  ['Tailwind v4', 'design tokens, not utility soup'],
  ['Clerk', 'sessions, 2FA, user management'],
  ['Cloudinary', 'uploads, transforms, CDN'],
  ['MongoDB Atlas', 'one collection, no joins'],
  ['TinyMCE cloud', 'rich text without a bundle hit'],
];

const SPEC = [
  { row: 'Time to first post', ours: 'under 4 minutes', them: 'a theme, then a weekend' },
  { row: 'Images', ours: 'auto-optimised CDN', them: 'manual resize, hope for the best' },
  { row: 'Drafts', ours: 'private shelf, unlimited', them: 'publish or lose it' },
  { row: 'URLs', ours: 'hand-tuned slugs, permanent', them: '/post/1294-b-final' },
  { row: 'Analytics', ours: 'privacy-friendly, no cookie banner', them: 'a consent wall' },
];

export default function FeaturesPage() {
  return (
    <div className="relative">
      <PageHeader
        kicker="01 — features"
        title="Small surface area. Everything a writer asks for."
        accent="asks for."
        body="No plugins, no page builders, no 400-item settings menu. Here is the whole list, plus what runs underneath."
        actions={
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-accent"
          >
            <Zap className="h-4 w-4 transition-transform duration-500 group-hover:scale-110" />
            <span className="link-line">Jump to pricing</span>
          </Link>
        }
        meta={
          <>
            {[
              { v: 6, s: '', l: 'moving parts' },
              { v: 0, s: '', l: 'plugins to install' },
              { v: 98, s: 'ms', l: 'median TTFB' },
            ].map((s) => (
              <span key={s.l} className="inline-flex items-baseline gap-1.5">
                <span className="font-display text-xl font-semibold text-fg">
                  <CountUp value={s.v} suffix={s.s} />
                </span>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
                  {s.l}
                </span>
              </span>
            ))}
          </>
        }
      />

      <FeatureGrid />

      {/* ------------------------------------------- what it is built on */}
      <section className="border-y border-line bg-surface-1/50 py-16 backdrop-blur-sm md:py-20">
        <Container size="xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal y={12} duration={0.7}>
                <span className="kicker">02 — the stack</span>
              </Reveal>
              <SplitHeadline
                as="h2"
                text="Boring technology, on purpose."
                className="mt-4 font-display text-section font-semibold tracking-[-0.03em] text-fg"
              />
              <p className="mt-5 max-w-sm text-[0.97rem] leading-relaxed text-muted text-pretty">
                Every dependency earns its place. If it stops serving the writing, it gets
                deleted — that is why this list is six items long.
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {STACK.map(([name, note], i) => (
                <Reveal key={name} delay={(i % 2) * 0.06} y={20}>
                  <li className="group flex h-full items-start gap-3 rounded-2xl border border-line bg-surface-1/70 p-4 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:border-accent/40">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/14 text-accent">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </span>
                    <span>
                      <span className="block font-display text-[1.05rem] font-semibold tracking-tight text-fg">
                        {name}
                      </span>
                      <span className="mt-1 block text-[0.9rem] leading-relaxed text-muted">{note}</span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------- comparison */}
      <section className="py-20 md:py-24">
        <Container size="lg">
          <Reveal y={12} duration={0.7}>
            <span className="kicker">03 — compared with “just another CMS”</span>
          </Reveal>
          <SplitHeadline
            as="h2"
            text="The trade-off is always the same."
            accent="always"
            className="mt-4 max-w-2xl font-display text-section font-semibold tracking-[-0.03em] text-fg"
          />

          <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-line bg-surface-1/70">
            <div className="hidden grid-cols-[1.2fr_1fr_1fr] gap-4 border-b border-line px-6 py-3 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint sm:grid">
              <span>&nbsp;</span>
              <span className="text-accent">Frame &amp; Phrase</span>
              <span>the usual way</span>
            </div>
            {SPEC.map((row, i) => (
              <Reveal key={row.row} delay={i * 0.04} y={16}>
                <div className="grid gap-1.5 border-b border-line px-6 py-5 last:border-b-0 sm:grid-cols-[1.2fr_1fr_1fr] sm:gap-4">
                  <span className="font-display text-[1.02rem] font-semibold tracking-tight text-fg">
                    {row.row}
                  </span>
                  <span className="flex items-start gap-2 text-[0.92rem] text-muted">
                    <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {row.ours}
                  </span>
                  <span className="flex items-start gap-2 text-[0.92rem] text-faint">
                    <Minus aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                    {row.them}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </div>
  );
}
