'use client';
import React from 'react';
import Container from '@/components/container/Container';
import PageHeader from '@/components/ui/PageHeader';
import Reveal from '@/components/motion/Reveal';

/**
 * Long-document layout: a sticky index on the left that tracks the section you
 * are actually reading, and calm typographic measure on the right.
 */
export default function LegalLayout({ title, kicker, updated, intro, sections, aside }) {
  const [active, setActive] = React.useState(sections[0]?.id);

  React.useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: [0, 1] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [sections]);

  return (
    <div className="relative pb-24">
      <PageHeader
        kicker={kicker}
        title={title}
        body={intro}
        meta={
          updated && (
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              last updated {updated}
            </span>
          )
        }
      />

      <Container size="xl">
        <div className="grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
          {/* index */}
          <nav aria-label="Sections" className="hidden lg:block">
            <div className="sticky top-28">
              <span className="kicker mb-4">on this page</span>
              <ol className="space-y-1 border-l border-line">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`-ml-px block border-l-2 py-1.5 pl-4 text-[0.88rem] leading-snug transition-all duration-400 ease-[cubic-bezier(.16,1,.3,1)] ${
                        active === s.id
                          ? 'border-accent font-semibold text-fg'
                          : 'border-transparent text-muted hover:border-line hover:text-fg'
                      }`}
                    >
                      <span className="mr-2 font-mono text-[0.62rem] text-faint">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          {/* body */}
          <div className="max-w-2xl">
            {sections.map((s, i) => (
              <Reveal key={s.id} y={22} delay={Math.min(i * 0.02, 0.1)}>
                <section id={s.id} className="scroll-mt-32 border-b border-line py-8 first:pt-0 last:border-b-0">
                  <h2 className="font-display text-[1.45rem] font-semibold tracking-[-0.02em] text-fg">
                    <span className="mr-2.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {s.paragraphs.map((p, j) => (
                      <p key={j} className="text-[0.98rem] leading-[1.85] text-muted text-pretty">
                        {p}
                      </p>
                    ))}
                  </div>
                  {s.list && (
                    <ul className="mt-5 space-y-2">
                      {s.list.map((item) => (
                        <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed text-muted">
                          <span
                            aria-hidden
                            className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent/80"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </Reveal>
            ))}

            {aside && (
              <div className="mt-10 rounded-2xl border border-line bg-surface-1/70 p-6">
                {aside}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
