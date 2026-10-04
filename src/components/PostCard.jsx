'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { Pencil, ArrowUpRight, EyeOff } from 'lucide-react';
import { Tilt } from '@/components/motion/Effects';

/** ~220 wpm — an honest, dependency-free estimate. */
function readingTime(content) {
  const words = String(content || '')
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PostCard({
  slug,
  title,
  featuredImage,
  userId,
  content,
  status = 'active',
  createdAt,
  tilt = true,
}) {
  const { user } = useUser();
  const isAuthor = user && userId && user.id === userId;
  const minutes = readingTime(content);
  const date = formatDate(createdAt);

  const card = (
    <article className="card ring-grad group relative flex h-full flex-col">
      <Link
        href={`/post/${slug}`}
        className="absolute inset-0 z-30 rounded-[1.25rem]"
        aria-label={`Read: ${title}`}
      />

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-3">
        <Image
          src={featuredImage}
          alt={title}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 34vw, 92vw"
          className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.07]"
          loading="lazy"
        />
        {/* duotone veil lifts on hover to reveal the real colours */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:opacity-0"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in oklab, var(--color-ink-900) 30%, transparent) 0%, color-mix(in oklab, var(--color-ink-900) 72%, transparent) 100%)',
          }}
        />

        {status === 'inactive' && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink-950/60 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-brand-100 backdrop-blur">
            <EyeOff className="h-3 w-3" /> draft
          </span>
        )}

        <span className="peek pointer-events-none absolute bottom-3 right-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-accent text-[color:var(--accent-contrast)] shadow-lift">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
          <span>{date ?? 'undated'}</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-accent/60" />
          <span>{minutes} min read</span>
        </div>

        <h2 className="mt-2.5 font-display text-[1.15rem] font-semibold leading-snug tracking-tight text-fg transition-colors duration-500 group-hover:text-accent">
          {title}
        </h2>

        {isAuthor && (
          <div className="peek relative z-40 mt-4 flex gap-2">
            <Link
              href={`/edit-post/${slug}`}
              className="btn btn-ghost flex-1 !py-2 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
          </div>
        )}
      </div>
    </article>
  );

  return tilt ? <Tilt depth={4.5} className="h-full">{card}</Tilt> : card;
}
