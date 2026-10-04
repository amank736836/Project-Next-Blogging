'use client';
import React from 'react';
import Container from '@/components/container/Container';
import Button from '@/components/Button';
import Reveal from '@/components/motion/Reveal';
import { DrawSvg } from '@/components/motion/Effects';

export default function ErrorBoundary({ error, reset }) {
  React.useEffect(() => {
    console.error('Frame & Phrase :: unhandled error', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center py-20">
      <Container size="md">
        <Reveal y={18} className="card relative overflow-hidden p-8 text-center sm:p-12">
          <span aria-hidden className="rule-draw absolute inset-x-8 top-0" />

          <DrawSvg
            viewBox="0 0 64 64"
            play="auto"
            duration={1}
            strokeWidth="2.2"
            strokeLinecap="round"
            className="mx-auto h-14 w-14 text-[#e5484d]"
            aria-hidden
          >
            <circle cx="32" cy="32" r="27" stroke="currentColor" opacity="0.4" />
            <path d="M22 22l20 20M42 22L22 42" stroke="currentColor" />
          </DrawSvg>

          <h1 className="mt-6 font-display text-3xl font-semibold tracking-[-0.03em] text-fg">
            The ink jammed.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[0.98rem] leading-relaxed text-muted text-pretty">
            Something went sideways while loading this view. Trying again usually fixes it;
            if it does not, the details below help us find it.
          </p>

          {error?.message && (
            <pre className="mx-auto mt-6 max-w-lg overflow-x-auto rounded-xl border border-line bg-ink-950/80 p-3 text-left font-mono text-[0.7rem] leading-relaxed text-brand-100">
              {String(error.message).slice(0, 320)}
            </pre>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={reset} size="md" variant="primary">
              Try again
            </Button>
            <Button href="/" size="md" variant="ghost">
              Back to the archive
            </Button>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
