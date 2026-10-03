'use client';
import React from 'react';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import Container from '@/components/container/Container';
import PageHeader from '@/components/ui/PageHeader';
import Reveal from '@/components/motion/Reveal';
import Button from '@/components/Button';
import { DrawSvg, Spotlight } from '@/components/motion/Effects';
import { gsap, useMotionEffect } from '@/lib/motion';

const PLANS = [
  {
    name: 'Free',
    monthly: 0,
    yearly: 0,
    blurb: 'Enough to find your voice.',
    cta: { label: 'Start writing', href: '/signup', variant: 'ghost' },
    features: ['Unlimited public posts', 'Cloudinary image delivery', 'Private draft shelf', 'Clerk sign-in'],
  },
  {
    name: 'Pro',
    monthly: 12,
    yearly: 9,
    popular: true,
    blurb: 'For a habit you intend to keep.',
    cta: { label: 'Go Pro', href: '/signup', variant: 'primary' },
    features: [
      'Everything in Free',
      'Custom slugs & redirects',
      'Reading-time + word metrics',
      'Priority image transforms',
      'Newsletter dispatch hooks',
    ],
  },
  {
    name: 'Studio',
    monthly: 49,
    yearly: 39,
    blurb: 'A whole masthead on one shelf.',
    cta: { label: 'Talk to us', href: '/contact', variant: 'ghost' },
    features: ['Everything in Pro', 'Up to 10 writers', 'Shared editorial queue', 'Custom theme tokens', 'Annual invoice & SSO'],
  },
];

const FAQ = [
  {
    q: 'What actually happens if I stop paying?',
    a: 'Nothing is held hostage. Your posts stay published at the same URLs and your drafts stay in the shelf — you just lose the Pro niceties like custom redirects and metrics.',
  },
  {
    q: 'Can I bring images from elsewhere?',
    a: 'Yes. Paste any public URL into the editor and it is pulled through Cloudinary on save, so a broken hotlink never becomes a broken story.',
  },
  {
    q: 'Is there an API?',
    a: 'There is a small internal one (/api/posts) that the app itself uses. We expose it as-is — no rate-limit tiers to learn, no keys to rotate yet.',
  },
  {
    q: 'Do you sell my data?',
    a: 'No. Analytics are privacy-friendly, and the only third parties involved are the ones you opted into by using them: Clerk, Cloudinary and MongoDB.',
  },
];

/** Ttween the number when the billing period flips. */
function Price({ value }) {
  const node = React.useRef(null);
  const prev = React.useRef(value);

  React.useEffect(() => {
    const el = node.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = prev.current;
    prev.current = value;
    if (reduce || from === value) {
      el.textContent = `$${value}`;
      return;
    }
    const proxy = { v: from };
    const tween = gsap.to(proxy, {
      v: value,
      duration: 0.7,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = `$${Math.round(proxy.v)}`;
      },
    });
    return () => tween.kill();
  }, [value]);

  return (
    <span
      ref={node}
      className="font-display tabular-nums text-[2.6rem] font-semibold leading-none tracking-[-0.03em] text-fg"
    >
      ${value}
    </span>
  );
}

export default function PricingPage() {
  const [yearly, setYearly] = React.useState(false);
  const { ref } = useMotionEffect((g, node) => {
    g.from(g.utils.toArray('[data-plan]', node), {
      y: 34,
      opacity: 0,
      rotateX: -6,
      duration: 1,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: { trigger: node, start: 'top 80%', once: true },
    });
  }, []);

  return (
    <div className="relative pb-24">
      <PageHeader
        align="center"
        kicker="pricing"
        title="Pay for the shelf, not the runway."
        accent="not the runway."
        body="One number a month, cancel by simply not paying. Free is a real plan, not a trial with a countdown."
        meta={
          <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-1/70 p-1 backdrop-blur">
            {[
              { id: false, label: 'Monthly' },
              { id: true, label: 'Yearly · save 25%' },
            ].map((opt) => (
              <button
                key={String(opt.id)}
                type="button"
                onClick={() => setYearly(opt.id)}
                aria-pressed={yearly === opt.id}
                className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-300 ${
                  yearly === opt.id ? 'text-[color:var(--accent-contrast)]' : 'text-muted hover:text-fg'
                }`}
              >
                {yearly === opt.id && (
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
                  />
                )}
                {opt.label}
              </button>
            ))}
          </div>
        }
      />

      <Container size="xl">
        <div ref={ref} className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((plan, i) => (
            <div key={plan.name} data-plan className="h-full [transform-style:preserve-3d]">
              <Spotlight
                as="article"
                className={`relative flex h-full flex-col rounded-[1.75rem] border p-7 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                  plan.popular
                    ? 'ring-grad border-accent/45 bg-surface-1 shadow-lift lg:-translate-y-3'
                    : 'border-line bg-surface-1/70 hover:-translate-y-1 hover:border-accent/35'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[color:var(--accent-contrast)] shadow-glow">
                    most chosen
                  </span>
                )}

                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-[1.3rem] font-semibold tracking-tight text-fg">
                    {plan.name}
                  </h2>
                  {plan.popular && <Sparkles className="h-4 w-4 text-accent" aria-hidden />}
                </div>
                <p className="mt-1.5 text-[0.88rem] text-muted">{plan.blurb}</p>

                <div className="mt-7 flex items-end gap-2">
                  <Price value={yearly ? plan.yearly : plan.monthly} />
                  <span className="pb-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-faint">
                    / month{yearly && plan.monthly > 0 ? ', billed yearly' : ''}
                  </span>
                </div>

                <ul className="mt-7 space-y-3 border-t border-line pt-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[0.92rem] leading-snug text-muted">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent/16">
                        <Check className="h-2.5 w-2.5 text-accent" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-2">
                  <Button
                    href={plan.cta.href}
                    variant={plan.cta.variant}
                    size="md"
                    className="w-full"
                  >
                    {plan.cta.label}
                  </Button>
                </div>
              </Spotlight>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------ FAQ */}
        <div className="mx-auto mt-24 max-w-3xl">
          <div className="flex items-center gap-4">
            <DrawSvg
              viewBox="0 0 40 12"
              play="auto"
              duration={0.9}
              strokeWidth="1.6"
              className="h-3 w-10 text-accent"
              aria-hidden
            >
              <path d="M1 6h38" stroke="currentColor" />
            </DrawSvg>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
              Questions, answered plainly
            </h2>
          </div>

          <div className="mt-6 divide-y divide-line overflow-hidden rounded-[1.5rem] border border-line bg-surface-1/60">
            {FAQ.map((item) => (
              <Accordion key={item.q} {...item} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

function Accordion({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-6 px-5 py-4 text-left transition-colors duration-300 hover:bg-accent/6 sm:px-6"
      >
        <span className="font-display text-[1.05rem] font-medium tracking-tight text-fg">{q}</span>
        <ChevronDown
          aria-hidden
          className={`h-4 w-4 shrink-0 text-faint transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:text-accent ${
            open ? 'rotate-180 text-accent' : ''
          }`}
        />
      </button>
      {/* grid-rows animation: no measuring, no layout jank */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-[0.94rem] leading-relaxed text-muted text-pretty sm:px-6">{a}</p>
        </div>
      </div>
    </div>
  );
}
