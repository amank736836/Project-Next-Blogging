'use client';
import React from 'react';
import { ArrowRight, BookOpenText, Feather, PlayCircle } from 'lucide-react';
import Container from '@/components/container/Container';
import Button from '@/components/Button';
import Reveal from '@/components/motion/Reveal';
import SplitHeadline from '@/components/motion/SplitHeadline';
import { Magnetic, Parallax, Tilt, CountUp } from '@/components/motion/Effects';
import BrandMark from '@/components/BrandMark';

const STATS = [
  { value: 12, suffix: 'k+', label: 'frames archived' },
  { value: 480, suffix: '', label: 'writers at home' },
  { value: 99.98, suffix: '%', label: 'uptime, decimals', decimals: 2 },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-8 md:pb-28 md:pt-14">
      <Container size="xl">
        <div className="grid items-center gap-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          {/* ---------------------------------------------------------- copy */}
          <div className="relative z-10">
            <Reveal y={14} duration={0.7}>
              <span className="kicker">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-accent" />
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent" />
                </span>
                A home for prose · est. 2026
              </span>
            </Reveal>

            <SplitHeadline
              text="Where every snapshot finds its sentence."
              accent="sentence."
              className="mt-6 font-display text-hero font-semibold tracking-[-0.035em] text-fg"
              delay={0.15}
            />

            <Reveal delay={0.45} y={18} duration={0.8} scroll={false}>
              <p className="mt-7 max-w-xl text-[1.05rem] leading-relaxed text-muted text-pretty md:text-lg">
                Frame &amp; Phrase keeps the picture and the paragraph together. Shoot the
                moment, write it while it is still warm, and let a quiet archive do what a
                feed never will — remember.
              </p>
            </Reveal>

            <Reveal delay={0.55} y={18} duration={0.8} scroll={false}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Magnetic strength={0.22}>
                  <Button href="/signup" size="lg" variant="primary" iconRight={<ArrowRight className="h-4 w-4" />}>
                    Start writing
                  </Button>
                </Magnetic>
                <Button href="/all-posts" size="lg" variant="ghost" iconLeft={<BookOpenText className="h-4 w-4" />}>
                  Read the stories
                </Button>
                <a
                  href="#how"
                  className="group ml-1 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors duration-300 hover:text-accent"
                >
                  <PlayCircle className="h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110" />
                  <span className="link-line">2-minute tour</span>
                </a>
              </div>
            </Reveal>

            {/* stats */}
            <Reveal delay={0.7} stagger={0.1} className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-7">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-semibold tracking-tight text-fg">
                    <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </div>
                  <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                    {s.label}
                  </div>
                </div>
              ))}
            </Reveal>
          </div>

          {/* ------------------------------------------------------- collage */}
          <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
            {/* dashed frame motif — the "Frame" half of the name */}
            <div
              aria-hidden
              className="absolute -inset-4 rounded-[2.75rem] border border-dashed border-line md:-inset-8"
            />
            <div
              aria-hidden
              className="absolute -inset-4 rounded-[2.75rem] opacity-60 md:-inset-8"
              style={{
                background:
                  'radial-gradient(60% 60% at 70% 20%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 70%)',
              }}
            />

            <Parallax speed={9}>
              <Tilt depth={6} className="relative z-10 group">
                <article className="card ring-grad overflow-hidden">
                  {/* faux featured image: pure CSS so nothing has to load */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden">
                    <div
                      className="absolute inset-0 scale-105 transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.12]"
                      style={{
                        background:
                          'linear-gradient(155deg, #0b1728 0%, #12405c 42%, #22c6ea 100%)',
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-45 mix-blend-screen"
                      style={{
                        background:
                          'radial-gradient(40% 55% at 78% 18%, rgba(255,255,255,.75), transparent 60%)',
                      }}
                    />
                    {/* horizon + ridge lines drawn on mount */}
                    <svg
                      viewBox="0 0 400 240"
                      className="absolute inset-0 h-full w-full"
                      preserveAspectRatio="none"
                      aria-hidden
                    >
                      <path
                        d="M0 176 C 70 150, 128 190, 196 168 S 330 142, 400 168 L400 240 L0 240 Z"
                        fill="rgba(6,14,26,.55)"
                      />
                      <path
                        d="M0 176 C 70 150, 128 190, 196 168 S 330 142, 400 168"
                        stroke="rgba(162,235,255,.55)"
                        strokeWidth="1"
                        fill="none"
                      />
                      <circle cx="312" cy="58" r="17" stroke="rgba(255,255,255,.75)" strokeWidth="1.2" fill="none" />
                    </svg>
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-ink-950/45 px-3 py-1.5 backdrop-blur">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-300" />
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-brand-100">
                        field note
                      </span>
                    </div>
                  </div>

                  <div className="p-5 text-left">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                        Lake Como · 06:41
                      </span>
                      <span className="text-[0.7rem] font-medium text-muted">4 min</span>
                    </div>
                    <h3 className="mt-2.5 font-display text-[1.35rem] font-semibold leading-snug tracking-tight text-fg">
                      The morning the fog lifted, I finally wrote it down
                    </h3>
                    <div className="mt-4 flex items-center gap-2.5">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/14 text-accent">
                        <Feather className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-medium text-muted">Aman</span>
                      <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-accent">
                        Read
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </article>
              </Tilt>
            </Parallax>

            {/* floating draft card */}
            <Parallax speed={-16} className="absolute -left-4 top-[58%] z-20 hidden sm:block lg:-left-10">
              <div className="glass w-[15.5rem] rounded-2xl p-4 shadow-lift animate-float">
                <div className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faint">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
                  drafting
                </div>
                <p className="mt-2.5 font-display text-[0.95rem] leading-snug text-fg">
                  <span className="typewriter" style={{ '--chars': '26' }}>
                    The lake held the light like a
                  </span>
                  <span className="animate-caret text-accent">|</span>
                </p>
              </div>
            </Parallax>

            {/* floating brand chip */}
            <Parallax speed={14} className="absolute -right-2 -top-6 z-20 hidden sm:block lg:-right-6">
              <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lift animate-float-slow">
                <BrandMark className="h-8 w-8" play="auto" strokeWidth={2.8} />
                <div className="leading-tight">
                  <div className="font-display text-sm font-semibold text-fg">Frame &amp; Phrase</div>
                  <div className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-faint">
                    autosaved · 2s ago
                  </div>
                </div>
              </div>
            </Parallax>
          </div>
        </div>

        {/* scroll cue */}
        <div className="mt-16 hidden justify-center lg:flex">
          <a
            href="#how"
            className="group flex flex-col items-center gap-2.5 text-faint transition-colors duration-300 hover:text-accent"
            aria-label="Scroll to the tour"
          >
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em]">scroll</span>
            <span className="rail relative block h-12 w-px overflow-hidden bg-line" />
          </a>
        </div>
      </Container>
    </section>
  );
}
