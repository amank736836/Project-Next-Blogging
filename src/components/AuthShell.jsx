'use client';
import React from 'react';
import Link from 'next/link';
import { Feather, Image as ImageIcon, Library, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';
import Reveal from '@/components/motion/Reveal';
import { Marquee } from '@/components/motion/Effects';
import { usePrefersReducedMotion } from '@/lib/motion';

const QUOTES = [
  {
    text: 'I write the way I develop film — slowly, and only after the light is gone.',
    who: 'Mara K., 214 posts',
  },
  { text: 'One photo, one paragraph. It is the only habit that ever stuck.', who: 'Dev R., 89 posts' },
  { text: 'The archive remembers better than I do, so I stopped trying.', who: 'Ines B., 401 posts' },
];

const POINTS = [
  { Icon: ImageIcon, label: 'Drag a photo, write the rest' },
  { Icon: Feather, label: 'An editor with nothing to click' },
  { Icon: Library, label: 'Drafts parked, never lost' },
  { Icon: ShieldCheck, label: 'Clerk keeps the keys' },
];

/**
 * Split-screen auth chrome shared by sign-in and sign-up: a brand panel with
 * rotating pull-quotes on the left, the Clerk widget on the right.
 */
export default function AuthShell({ mode = 'signin', children }) {
  const [index, setIndex] = React.useState(0);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), 6000);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden">
      <div className="grid min-h-full lg:grid-cols-[1.02fr_0.98fr]">
        {/* ---------------------------------------------------- brand panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-line bg-surface-1/60 px-10 py-12 backdrop-blur-sm lg:flex">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-80"
            style={{
              background:
                'radial-gradient(80% 60% at 10% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 60%), radial-gradient(70% 60% at 90% 90%, color-mix(in oklab, #7c5cff 18%, transparent), transparent 65%)',
            }}
          />
          <div aria-hidden className="absolute inset-0 -z-10 ambient-grid opacity-50" />

          <Reveal y={14} duration={0.8}>
            <Link href="/" className="inline-block">
              <Logo size="lg" />
            </Link>
            <p className="mt-8 max-w-md font-display text-[1.6rem] font-medium leading-[1.25] tracking-[-0.02em] text-fg">
              {mode === 'signin'
                ? 'Welcome back. The draft you left is exactly where you left it.'
                : 'A quiet place to keep pictures and the words that explain them.'}
            </p>
          </Reveal>

          {/* rotating pull-quote */}
          <div className="relative mt-12 min-h-[8.5rem]">
            {QUOTES.map((q, i) => (
              <blockquote
                key={q.who}
                aria-hidden={i !== index}
                className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${
                  i === index
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-3 opacity-0'
                }`}
              >
                <p className="max-w-md text-[1.02rem] italic leading-relaxed text-muted">
                  “{q.text}”
                </p>
                <footer className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                  {q.who}
                </footer>
              </blockquote>
            ))}
          </div>

          <div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {POINTS.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-[0.86rem] text-muted">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/12 text-accent">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-line pt-6">
              <Marquee duration={26} className="opacity-70">
                {['snapshots', 'sentences', 'margins', 'blue hour', 'first drafts', 'captions'].map(
                  (w) => (
                    <span key={w} className="px-3 font-display text-sm italic tracking-tight text-fg/60">
                      {w} <span className="not-italic text-accent/50">✳</span>
                    </span>
                  )
                )}
              </Marquee>
            </div>
          </div>
        </aside>

        {/* ------------------------------------------------------ form side */}
        <div className="relative flex items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-[26rem]">
            <div className="mb-7 flex items-center justify-between lg:justify-center">
              <span className="kicker lg:hidden">
                {mode === 'signin' ? 'log in' : 'create account'}
              </span>
              <Link
                href={mode === 'signin' ? '/signup' : '/login'}
                className="ml-auto text-xs font-semibold text-muted transition-colors duration-300 hover:text-accent lg:ml-0"
              >
                {mode === 'signin' ? 'Need an account? Join →' : 'Already writing? Log in →'}
              </Link>
            </div>

            <Reveal y={22} blur duration={0.9}>{children}</Reveal>

            <p className="mt-7 text-center text-xs leading-relaxed text-faint">
              By continuing you agree to our{' '}
              <Link href="/terms" className="link-line text-muted hover:text-accent">
                terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="link-line text-muted hover:text-accent">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
