'use client';
import React from 'react';
import Container from '@/components/container/Container';
import Reveal from '@/components/motion/Reveal';
import SplitHeadline from '@/components/motion/SplitHeadline';

/**
 * Section masthead used by every interior page so the type, spacing and
 * reveal timing stay identical across the app.
 */
export default function PageHeader({
  kicker,
  title,
  accent = '',
  body,
  actions,
  size = 'lg',
  align = 'left',
  className = '',
  meta,
}) {
  const titleSize =
    size === 'sm'
      ? 'text-[clamp(1.6rem,1.1rem+1.6vw,2.15rem)]'
      : 'font-display text-hero-sm';

  return (
    <header
      className={`relative ${
        align === 'center' ? 'text-center' : ''
      } ${className}`}
    >
      <Container size={size === 'sm' ? 'lg' : 'xl'}>
        <div
          className={`flex flex-col gap-8 py-12 md:py-16 ${
            align === 'center' ? 'items-center' : 'lg:flex-row lg:items-end lg:justify-between'
          }`}
        >
          <div className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
            {kicker && (
              <Reveal y={12} duration={0.6}>
                <span className="kicker">{kicker}</span>
              </Reveal>
            )}

            <SplitHeadline
              as="h1"
              text={title}
              accent={accent}
              className={`mt-4 font-display font-semibold tracking-[-0.03em] text-fg ${titleSize}`}
              delay={0.08}
            />

            {body && (
              <Reveal delay={0.2} y={14} duration={0.7}>
                <p
                  className={`mt-5 text-[1rem] leading-relaxed text-muted text-pretty md:text-[1.06rem] ${
                    align === 'center' ? 'mx-auto' : ''
                  }`}
                >
                  {body}
                </p>
              </Reveal>
            )}

            {meta && (
              <Reveal delay={0.28} y={12} duration={0.6}>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">{meta}</div>
              </Reveal>
            )}
          </div>

          {actions && (
            <Reveal delay={0.24} y={16} duration={0.7} className="flex flex-wrap items-center gap-3">
              {actions}
            </Reveal>
          )}
        </div>
      </Container>
    </header>
  );
}
