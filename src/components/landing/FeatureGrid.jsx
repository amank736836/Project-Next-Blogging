'use client';
import React from 'react';
import {
  ImageUp,
  Library,
  LockKeyhole,
  Quote,
  SlidersHorizontal,
  Smartphone,
  ArrowUpRight,
} from 'lucide-react';
import Container from '@/components/container/Container';
import Reveal from '@/components/motion/Reveal';
import SplitHeadline from '@/components/motion/SplitHeadline';
import { Spotlight } from '@/components/motion/Effects';

const FEATURES = [
  {
    Icon: ImageUp,
    title: 'Drop a frame, get a story',
    body: 'Images upload straight to Cloudinary with optimised delivery, so a photo and its paragraph always land together.',
    tag: 'cloudinary',
  },
  {
    Icon: SlidersHorizontal,
    title: 'An editor that stays out of the way',
    body: 'TinyMCE with the handful of controls a writer actually uses — headings, quotes, media, links. Nothing more.',
    tag: 'tinymce',
  },
  {
    Icon: Library,
    title: 'A private shelf, then the world',
    body: 'Flip a draft to inactive and it disappears from the feed but stays in your library, exactly where you left it.',
    tag: 'drafts',
  },
  {
    Icon: LockKeyhole,
    title: 'Keys of your own',
    body: 'Clerk handles sign-in, two-factor and sessions, so your archive is yours and only yours.',
    tag: 'clerk',
  },
  {
    Icon: Smartphone,
    title: 'Reads well at arm’s length',
    body: 'Type scales with the viewport and articles keep a 68-character measure, on a phone or a 32-inch display.',
    tag: 'responsive',
  },
  {
    Icon: Quote,
    title: 'Built for the long paragraph',
    body: 'Serif display type, inked dividers and a drop cap when a piece deserves one. Quietly typographic, never fussy.',
    tag: 'typography',
  },
];

export default function FeatureGrid() {
  return (
    <section className="relative py-20 md:py-28">
      <Container size="xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal y={12} duration={0.7}>
              <span className="kicker">02 — the toolkit</span>
            </Reveal>
            <SplitHeadline
              as="h2"
              text="Everything a writer needs, nothing a writer fights."
              accent="needs,"
              className="mt-5 font-display text-section font-semibold tracking-[-0.03em] text-fg"
            />
          </div>
          <Reveal y={16} className="max-w-sm">
            <p className="text-[0.98rem] leading-relaxed text-muted text-pretty">
              Six decisions we made so you can stop thinking about plumbing and start
              thinking about the sentence.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, body, tag }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.08} y={30}>
              <Spotlight
                as="article"
                className="card ring-grad group relative flex h-full flex-col p-6"
              >
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-accent/10 text-accent transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-0.5 group-hover:rotate-[-6deg] group-hover:border-accent/40">
                    <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />
                  </span>
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                    {tag}
                  </span>
                </div>

                <h3 className="relative z-10 mt-5 font-display text-[1.2rem] font-semibold leading-snug tracking-tight text-fg">
                  {title}
                </h3>
                <p className="relative z-10 mt-2.5 text-[0.93rem] leading-relaxed text-muted text-pretty">
                  {body}
                </p>

                <span className="relative z-10 mt-5 flex items-center gap-1.5 text-[0.8rem] font-semibold text-accent opacity-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0 group-hover:opacity-100 -translate-y-1">
                  Learn more
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
