'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, CalendarDays, Check, Clock3, Info, Link2, PenLine, Trash2,
} from 'lucide-react';
import Container from '@/components/container/Container';
import PostCard from '@/components/PostCard';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Loader from '@/components/loaders/Loader';
import { GridSkeleton, ArticleSkeleton } from '@/components/loaders/Skeleton';
import EmptyShelf from '@/components/ui/EmptyShelf';
import ScrollProgress from '@/components/ui/ScrollProgress';
import PageHeader from '@/components/ui/PageHeader';
import BrandMark from '@/components/BrandMark';
import Reveal from '@/components/motion/Reveal';
import SplitHeadline from '@/components/motion/SplitHeadline';
import { CountUp, Magnetic, Marquee, Parallax, Tilt } from '@/components/motion/Effects';
import { DEMO_POSTS, withAuthor } from '@/components/demo/fixtures';

const Section = ({ index, title, note, children }) => (
  <section className="border-t border-line py-14">
    <Container size="xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kicker">{index}</span>
          <h2 className="mt-3 font-display text-[1.7rem] font-semibold tracking-[-0.03em] text-fg">
            {title}
          </h2>
        </div>
        <p className="max-w-md text-[0.92rem] leading-relaxed text-muted text-pretty">{note}</p>
      </div>
      {children}
    </Container>
  </section>
);

export default function DemoPreview() {
  const hero = withAuthor(DEMO_POSTS[0]);

  return (
    <div className="pb-24">
      <PageHeader
        kicker="design preview"
        title="Every surface, with fixtures attached."
        accent="fixtures"
        body="This route renders the archive, the article page and the interface kit from local sample data — no database, no Cloudinary, no account required. It exists so the design system can be reviewed end to end."
        meta={
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
              <Info className="h-3.5 w-3.5 text-accent" />
              not indexed · dev-facing
            </span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
              toggle the theme in the header to compare both
            </span>
          </>
        }
        actions={
          <>
            <Magnetic strength={0.2}>
              <Button href="/" size="md" variant="primary" iconRight={<ArrowRight className="h-4 w-4" />}>
                Back to the site
              </Button>
            </Magnetic>
            <Button href="/add-post" size="md" variant="ghost" iconLeft={<PenLine className="h-4 w-4" />}>
              The real editor
            </Button>
          </>
        }
      />

      {/* ----------------------------------------------------------- grid */}
      <Section
        index="01 — archive grid"
        title="Post cards"
        note="Tilt on hover, duotone veil that lifts, reading time on every card, and controls that stay hidden until you reach for them."
      >
        <Reveal stagger={0.07} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {DEMO_POSTS.map((post) => (
            <PostCard key={post.slug} {...withAuthor(post)} />
          ))}
        </Reveal>
      </Section>

      {/* -------------------------------------------------------- article */}
      <Section
        index="02 — article"
        title="The reading experience"
        note="A sticky progress rail, a hero that drifts on scroll, display serif headings, and a drop cap on the opening paragraph."
      >
        <article id="demo-article" className="relative">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faint">reading</span>
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-surface-3">
              <ScrollProgress targetId="demo-article" variant="inline" />
            </div>
            <span className="font-mono text-[0.65rem] tabular-nums text-muted">4 min</span>
          </div>

          <header className="mx-auto max-w-3xl text-left">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
              <Link href="/" className="link-line text-accent">Frame &amp; Phrase</Link>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> September 28, 2026
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" /> 4 min · 812 words
              </span>
            </div>

            <SplitHeadline
              as="h3"
              text={hero.title}
              className="mt-5 font-display text-hero-sm font-semibold leading-[1.06] tracking-[-0.035em] text-fg"
              stagger={0.03}
            />

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/14 font-display text-sm font-semibold text-accent">
                A
              </span>
              <span className="text-sm font-medium text-muted">Aman</span>
              <span aria-hidden className="mx-1 hidden h-4 w-px bg-line sm:block" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted">
                <Link2 className="h-3.5 w-3.5" /> Copy link
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-[#e5484d]">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </span>
            </div>
          </header>

          <figure className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-[1.75rem] border border-line shadow-lift">
            <div className="group relative aspect-[16/9] w-full overflow-hidden bg-surface-3">
              <Parallax speed={7}>
                <Image
                  src={hero.featuredImage}
                  alt={hero.title}
                  width={1200}
                  height={675}
                  className="h-full w-full scale-[1.08] object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.13]"
                  sizes="(min-width: 1152px) 896px, 92vw"
                />
              </Parallax>
            </div>
          </figure>

          <div className="prose-fp lead mx-auto mt-12 max-w-2xl">{renderHtml(hero.content)}</div>
        </article>
      </Section>

      {/* ------------------------------------------------------------ kit */}
      <Section
        index="03 — interface kit"
        title="Controls, states and loaders"
        note="Buttons in every variant, fields with validation, the ink loader, skeleton screens and the empty state — all on tokens, so they follow the theme automatically."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-6">
            <span className="kicker mb-5">buttons</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm" iconRight={<ArrowRight className="h-3.5 w-3.5" />}>Primary</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="subtle" size="sm" iconLeft={<Check className="h-3.5 w-3.5" />}>Subtle</Button>
              <Button variant="danger" size="sm">Danger</Button>
              <Button variant="primary" size="sm" loading>Loading</Button>
              <Button variant="outline" size="sm" disabled>Disabled</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>

            <span className="kicker mb-5 mt-9">loaders</span>
            <div className="flex flex-wrap items-center gap-7 text-accent">
              <Loader size={20} />
              <Loader size={28} />
              <Loader size={36} />
              <BrandMark className="h-10 w-10" play="auto" />
            </div>

            <span className="kicker mb-4 mt-9">numeric</span>
            <div className="flex flex-wrap items-baseline gap-8">
              {[
                { v: 12, s: 'k+' },
                { v: 480, s: '' },
                { v: 99.98, s: '%', d: 2 },
              ].map((n) => (
                <span key={n.s + n.v} className="font-display text-3xl font-semibold text-fg">
                  <CountUp value={n.v} suffix={n.s} decimals={n.d ?? 0} />
                </span>
              ))}
            </div>
          </div>

          <div className="card space-y-5 p-6">
            <span className="kicker">fields</span>
            <Input label="Title" placeholder="The morning the fog lifted" />
            <Input label="Email" type="email" defaultValue="not-an-email" error="That address will not reach you" />
            <Input label="With icon" placeholder="Find a story" icon={<PenLine className="h-4 w-4" />} />
            <Select label="Status" options={['active', 'inactive']} />

            <span className="kicker pt-2">skeletons</span>
            <div className="grid grid-cols-2 gap-4">
              <GridSkeleton count={1} />
              <div className="flex items-center justify-center rounded-2xl border border-line p-4">
                <Loader size={26} className="text-accent" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Tilt depth={5}>
              <EmptyShelf
                title="Nothing on the shelf yet"
                body="This is the empty state shown when a filtered view has no results — a self-drawing frame rather than a dead end."
                action={<Button size="md" variant="primary">Write the first post</Button>}
              />
            </Tilt>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <span className="kicker">ticker</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
                pauses on hover
              </span>
            </div>
            <div className="rounded-2xl border border-line bg-surface-1/60 py-4">
              <Marquee duration={28}>
                {['snapshots', 'sentences', 'field notes', 'margins', 'blue hour', 'first drafts'].map((w) => (
                  <span key={w} className="px-4 font-display text-xl italic text-fg/70">
                    {w} <span className="not-italic text-accent/50">✳</span>
                  </span>
                ))}
              </Marquee>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <span className="kicker">article skeleton</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
                shown while a post loads
              </span>
            </div>
            <div className="rounded-3xl border border-line p-6">
              <ArticleSkeleton />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

/** Minimal HTML → React for the fixture bodies (no dangerouslySetInnerHTML). */
function renderHtml(html) {
  const nodes = [];
  const pattern = /<(h2|h3|p|blockquote|li)>([\s\S]*?)<\/\1>/g;
  let match;
  let listBuffer = [];

  const flushList = (key) => {
    if (!listBuffer.length) return;
    nodes.push(
      <ul key={`ul-${key}`}>
        {listBuffer.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  while ((match = pattern.exec(html))) {
    const [, tag, inner] = match;
    const text = inner.replace(/\s+/g, ' ').trim();
    if (tag === 'li') {
      listBuffer.push(text);
      continue;
    }
    flushList(nodes.length);
    if (tag === 'blockquote') nodes.push(<blockquote key={nodes.length}>{text}</blockquote>);
    else if (tag === 'h2' || tag === 'h3') {
      const Tag = tag;
      nodes.push(<Tag key={nodes.length}>{text}</Tag>);
    } else nodes.push(<p key={nodes.length}>{text}</p>);
  }
  flushList(nodes.length);

  return nodes;
}
