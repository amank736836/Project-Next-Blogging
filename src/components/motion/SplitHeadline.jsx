'use client';
import React from 'react';
import { splitWords, useMotionEffect } from '@/lib/motion';

/**
 * Expressive type reveal: every word is clipped in its own mask and rises in
 * with a slight blur, so headlines feel set rather than faded.
 *
 * `accent` (a substring of `text`) is painted with the animated brand
 * gradient — the one moment of colour in an otherwise inky headline.
 */
export default function SplitHeadline({
  text,
  accent = '',
  as: Tag = 'h1',
  className = '',
  wordClassName = '',
  mode = 'words',
  delay = 0,
  stagger = 0.05,
  yPercent = 112,
  once = true,
  ...props
}) {
  const words = splitWords(text);
  const accentWords = accent ? new Set(splitWords(accent).map((w) => w.word)) : new Set();

  const { ref } = useMotionEffect(
    (g, node) => {
      const targets = g.utils.toArray(mode === 'chars' ? '[data-char]' : '[data-word]', node);
      g.from(targets, {
        yPercent,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 1.05,
        delay,
        ease: 'expo.out',
        stagger,
        scrollTrigger: { trigger: node, start: 'top 88%', once },
      });
    },
    [text, mode, delay, stagger, yPercent, once]
  );

  return (
    <Tag ref={ref} className={className} {...props}>
      {words.map(({ word }, i) => (
        <span
          key={`${word}-${i}`}
          data-word
          className={`inline-block overflow-hidden pb-[0.12em] align-bottom ${wordClassName}`}
        >
          <span
            className={`inline-block will-change-transform ${
              accentWords.has(word) ? 'text-gradient' : ''
            }`}
          >
            {mode === 'chars'
              ? word.split('').map((c, j) => (
                  <span key={`${c}-${j}`} data-char className="inline-block">
                    {c}
                  </span>
                ))
              : word}
          </span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}
