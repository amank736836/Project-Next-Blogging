'use client';
import React from 'react';
import Hero from './landing/Hero';
import FeatureGrid from './landing/FeatureGrid';
import HowItWorks from './landing/HowItWorks';
import Manifesto from './landing/Manifesto';
import CtaBand from './landing/CtaBand';
import { Marquee } from '@/components/motion/Effects';
import { PenLine, Quote, Camera, Layers, MoonStar, Sun } from 'lucide-react';

const WORDS = [
  { t: 'snapshots', Icon: Camera },
  { t: 'first drafts', Icon: PenLine },
  { t: 'field notes', Icon: Layers },
  { t: 'pull quotes', Icon: Quote },
  { t: 'blue hour', Icon: MoonStar },
  { t: 'morning pages', Icon: Sun },
];

/** 01 — an infinite ticker of the things that live here. */
function Band() {
  const track = (
    <>
      {WORDS.map(({ t, Icon }, i) => (
        <span key={`${t}-${i}`} className="flex shrink-0 items-center gap-4 px-2">
          <Icon className="h-4 w-4 text-accent/70" strokeWidth={1.7} />
          <span className="font-display text-xl italic tracking-tight text-fg/70 md:text-2xl">
            {t}
          </span>
          <span aria-hidden className="text-accent/50">✳</span>
        </span>
      ))}
    </>
  );

  return (
    <section className="relative overflow-hidden border-y border-line bg-surface-1/60 py-5 backdrop-blur-sm">
      <span className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-faint lg:block">
        01 — what lives here
      </span>
      <Marquee duration={30} className="lg:pl-40">
        {track}
      </Marquee>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="relative">
      <Hero />
      <Band />
      <FeatureGrid />
      <HowItWorks />
      <Manifesto />
      <CtaBand />
    </div>
  );
}
