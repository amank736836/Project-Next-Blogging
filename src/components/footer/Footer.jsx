'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowUp, Github, Twitter, Rss, Send, Check } from 'lucide-react';
import Container from '../container/Container';
import Logo from '../Logo';
import Button from '../Button';
import Reveal from '../motion/Reveal';
import { Magnetic } from '../motion/Effects';
import { useMotionEffect } from '@/lib/motion';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'All stories', href: '/all-posts' },
      { name: 'Write a post', href: '/add-post' },
    ],
  },
  {
    title: 'Account',
    links: [
      { name: 'Log in', href: '/login' },
      { name: 'Create account', href: '/signup' },
      { name: 'Contact us', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms & conditions', href: '/terms' },
      { name: 'Privacy policy', href: '/privacy' },
    ],
  },
];

const SOCIALS = [
  { Icon: Github, label: 'Source on GitHub', href: 'https://github.com/amank736836/next-blog_Project' },
  {
    Icon: Twitter,
    label: 'Share on X',
    href: 'https://x.com/intent/post?text=Frame%20%26%20Phrase%20%E2%80%94%20where%20prose%20finds%20its%20home',
  },
  { Icon: Rss, label: 'Straight to the contact page', href: '/contact' },
];

export default function Footer() {
  const { ref: wordRef } = useMotionEffect((g, node) => {
    g.from(node.querySelectorAll('[data-w]'), {
      yPercent: 42,
      opacity: 0,
      rotate: 4,
      duration: 1,
      stagger: 0.045,
      ease: 'expo.out',
      scrollTrigger: { trigger: node, start: 'top 92%', once: true },
    });
  }, []);

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rule-draw"
        style={{ opacity: 0.9 }}
      />

      <Container size="xl" className="relative pt-16 pb-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          {/* brand + newsletter */}
          <Reveal>
            <Logo size="lg" />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-muted text-pretty">
              A quiet home for writers who think in pictures. Frame the moment, phrase
              it well, and let the archive do the rest.
            </p>

            <Subscribe />

            <div className="mt-7 flex items-center gap-2">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer noopener"
                  aria-label={label}
                  title={label}
                  className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                >
                  <Icon className="h-4 w-4 transition-transform duration-500 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </Reveal>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col, i) => (
              <Reveal key={col.title} stagger={0.08} delay={0.05 * i}>
                <h3 className="kicker mb-4 !text-[0.62rem]">{col.title}</h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="link-line w-fit text-[0.92rem] font-medium text-fg/85 transition-colors duration-300 hover:text-accent"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        {/* oversized wordmark */}
        <div ref={wordRef} className="relative mt-16 select-none" aria-hidden>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <span className="font-display text-wordmark font-semibold leading-[0.8] tracking-[-0.05em] text-fg/8 transition-colors duration-700 hover:text-accent/14">
              {'Frame & Phrase'.split('').map((ch, i) => (
                <span key={i} data-w className="inline-block will-change-transform">
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint">
            © {new Date().getFullYear()} Frame &amp; Phrase · crafted by amank736836
          </p>

          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth',
                })
              }
              className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted transition-colors duration-300 hover:border-accent/50 hover:text-accent"
            >
              <ArrowUp className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
              Back to top
            </button>
          </Magnetic>
        </div>
      </Container>
    </footer>
  );
}

/* Local-only demo subscribe with a drawn check mark on success. */
function Subscribe() {
  const [state, setState] = React.useState('idle'); // idle | sent

  React.useEffect(() => {
    if (state !== 'sent') return;
    const t = setTimeout(() => setState('idle'), 4200);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setState('sent');
        e.currentTarget.reset();
      }}
      className="mt-7 max-w-sm"
    >
      <label htmlFor="footer-subscribe" className="field-label">
        The fortnightly dispatch
      </label>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Send
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint transition-colors duration-300"
          />
          <input
            id="footer-subscribe"
            type="email"
            required
            placeholder="you@example.com"
            className="field pl-9"
          />
        </div>
        <Button type="submit" size="sm" variant={state === 'sent' ? 'subtle' : 'primary'}>
          {state === 'sent' ? (
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" /> Sent
            </span>
          ) : (
            'Join'
          )}
        </Button>
      </div>
      <p
        className={`mt-2 text-xs text-faint transition-all duration-500 ${
          state === 'sent' ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-70'
        }`}
      >
        {state === 'sent'
          ? 'You are on the list — welcome aboard.'
          : 'One email every other Thursday. No noise, ever.'}
      </p>
    </form>
  );
}
