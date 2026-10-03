'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Library } from 'lucide-react';
import Container from '@/components/container/Container';
import Button from '@/components/Button';
import BrandMark from '@/components/BrandMark';
import Reveal from '@/components/motion/Reveal';
import SplitHeadline from '@/components/motion/SplitHeadline';
import { DrawSvg } from '@/components/motion/Effects';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center overflow-hidden">
      <Container size="md">
        <div className="relative text-center">
          {/* oversized ghost number */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-[58%] font-display text-[clamp(8rem,26vw,20rem)] font-semibold leading-none tracking-[-0.06em] text-fg/[0.05]"
          >
            404
          </span>

          <Reveal y={14} duration={0.7}>
            <BrandMark className="mx-auto h-16 w-16" play="auto" strokeWidth={2.2} />
          </Reveal>

          <SplitHeadline
            as="h1"
            text="This frame is still developing."
            accent="still developing."
            className="mt-7 font-display text-hero-sm font-semibold tracking-[-0.035em] text-fg"
          />

          <Reveal delay={0.2} y={14} duration={0.7}>
            <p className="mx-auto mt-5 max-w-md text-[1rem] leading-relaxed text-muted text-pretty">
              The page you asked for is not on the shelf. It may have been renamed, unpublished,
              or never written at all.
            </p>
          </Reveal>

          <Reveal delay={0.3} y={16} duration={0.7}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button href="/" size="lg" variant="primary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
                Back to the start
              </Button>
              <Button href="/all-posts" size="lg" variant="ghost" iconLeft={<Library className="h-4 w-4" />}>
                Browse stories
              </Button>
            </div>
          </Reveal>

          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint transition-colors duration-300 hover:text-accent"
          >
            <Compass className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-45" />
            report a broken link
          </Link>

          <DrawSvg
            viewBox="0 0 200 8"
            play="auto"
            duration={1.1}
            strokeWidth="1.4"
            className="mx-auto mt-10 h-2 w-48 text-accent/60"
            aria-hidden
          >
            <path d="M2 4h74M84 4h6M98 4h100" stroke="currentColor" />
          </DrawSvg>
        </div>
      </Container>
    </div>
  );
}
