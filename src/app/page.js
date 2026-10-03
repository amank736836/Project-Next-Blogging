'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { PenLine, Search, SlidersHorizontal, X } from 'lucide-react';
import postService from '@/services/config';
import { Container, PostCard, Landing, Button } from '@/components';
import { GridSkeleton } from '@/components/loaders/Skeleton';
import Reveal from '@/components/motion/Reveal';
import SplitHeadline from '@/components/motion/SplitHeadline';
import EmptyShelf from '@/components/ui/EmptyShelf';

const FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'active', label: 'Published' },
  { id: 'inactive', label: 'Drafts' },
];

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let alive = true;
    postService
      .getPosts()
      .then((data) => {
        if (alive && Array.isArray(data)) setPosts(data);
      })
      .catch(() => alive && setPosts([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [isLoaded, isSignedIn]);

  const counts = useMemo(
    () => ({
      all: posts.length,
      active: posts.filter((p) => p.status === 'active').length,
      inactive: posts.filter((p) => p.status === 'inactive').length,
    }),
    [posts]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts
      .filter((p) => (filter === 'all' ? true : p.status === filter))
      .filter((p) => (q ? `${p.title} ${p.slug}`.toLowerCase().includes(q) : true))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [posts, query, filter]);

  // Guests — and every first paint, before Clerk resolves — get the landing
  // page. It is the fastest thing we can server-render, so hero LCP is HTML.
  if (!isSignedIn) return <Landing />;

  return (
    <div className="w-full py-10 md:py-14">
      <Container size="xl">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal y={12} duration={0.7}>
              <span className="kicker">the archive</span>
            </Reveal>
            <SplitHeadline
              as="h1"
              text="Everyone’s frames, in one place."
              accent="one place."
              className="mt-4 font-display text-hero-sm font-semibold tracking-[-0.03em] text-fg"
            />
          </div>

          <Reveal y={16} duration={0.7} className="flex w-full items-center gap-2 lg:w-auto">
            <Button href="/add-post" size="md" variant="primary" iconLeft={<PenLine className="h-4 w-4" />}>
              New post
            </Button>
            <div className="relative w-full sm:w-64">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search titles"
                aria-label="Search posts by title"
                className="field pl-9 pr-9"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-faint transition-colors duration-300 hover:text-fg"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </Reveal>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2 border-y border-line py-3">
          <SlidersHorizontal className="h-3.5 w-3.5 text-faint" aria-hidden />
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] ${
                filter === f.id
                  ? 'border-accent bg-accent text-[color:var(--accent-contrast)]'
                  : 'border-line text-muted hover:border-accent/45 hover:text-fg'
              }`}
            >
              {f.label}
              <span className="ml-1.5 font-mono text-[0.62rem] opacity-70">{counts[f.id]}</span>
            </button>
          ))}
          <span className="ml-auto font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint">
            {loading ? 'syncing' : `${visible.length} shown`}
          </span>
        </div>

        <div className="mt-8">
          {loading ? (
            <GridSkeleton count={8} />
          ) : visible.length === 0 ? (
            <EmptyShelf
              title={posts.length === 0 ? 'Nothing on the shelf yet' : 'No frames match that'}
              body={
                posts.length === 0
                  ? 'Be the first to drop a photo and write the thing around it.'
                  : 'Try a shorter word, or clear the filter to see the whole archive.'
              }
              action={
                posts.length === 0 ? (
                  <Button href="/add-post" size="md" variant="primary">
                    Write the first post
                  </Button>
                ) : (
                  <Button
                    size="md"
                    variant="ghost"
                    onClick={() => {
                      setQuery('');
                      setFilter('all');
                    }}
                  >
                    Reset filters
                  </Button>
                )
              }
            />
          ) : (
            <Reveal
              stagger={0.07}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {visible.map((post) => (
                <PostCard key={post.slug} {...post} />
              ))}
            </Reveal>
          )}
        </div>
      </Container>
    </div>
  );
}
