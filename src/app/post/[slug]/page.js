'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import parse from 'html-react-parser';
import Image from 'next/image';
import {
    ArrowLeft, ArrowUp, CalendarDays, Check, Clock3, Link2, Pencil, Trash2,
} from 'lucide-react';
import postService from '@/services/config';
import { Container, Button } from '@/components';
import Loader from '@/components/loaders/Loader';
import { ArticleSkeleton } from '@/components/loaders/Skeleton';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Reveal from '@/components/motion/Reveal';
import SplitHeadline from '@/components/motion/SplitHeadline';
import { DrawSvg, Magnetic, Parallax } from '@/components/motion/Effects';
import { usePrefersReducedMotion } from '@/lib/motion';

export default function PostPage({ params: paramsPromise }) {
    const params = React.use(paramsPromise);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [copied, setCopied] = useState(false);
    const router = useRouter();
    const slug = params.slug;
    const reduced = usePrefersReducedMotion();

    const { user } = useUser();
    const isAuthor = post && user ? post.userId === user.id : false;

    useEffect(() => {
        if (!slug) {
            router.push('/');
            return;
        }
        let alive = true;
        postService
            .getPost(slug)
            .then((data) => {
                if (!alive) return;
                if (data) setPost(data);
                else router.push('/');
            })
            .catch((err) => {
                console.error('Failed to fetch post:', err);
                if (alive) router.push('/');
            })
            .finally(() => alive && setLoading(false));
        return () => { alive = false; };
    }, [slug, router]);

    // Arm-then-confirm keeps a destructive action off a single stray click.
    useEffect(() => {
        if (!confirming) return;
        const t = setTimeout(() => setConfirming(false), 4500);
        return () => clearTimeout(t);
    }, [confirming]);

    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 2200);
        return () => clearTimeout(t);
    }, [copied]);

    const deletePost = async () => {
        if (!confirming) {
            setConfirming(true);
            return;
        }
        setDeleting(true);
        try {
            const status = await postService.deletePost(post.slug);
            if (status) router.push('/');
        } finally {
            setDeleting(false);
            setConfirming(false);
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
        } catch {
            /* clipboard blocked — nothing to undo */
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center py-20">
                <div className="w-full max-w-3xl px-6">
                    <ArticleSkeleton />
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
                <Loader className="text-accent" size={34} />
                <p className="text-muted">That frame is not on the shelf.</p>
                <Button href="/" size="md" variant="ghost" iconLeft={<ArrowLeft className="h-4 w-4" />}>
                    Back to the archive
                </Button>
            </div>
        );
    }

    const words = String(post.content || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 220));
    const date = post.createdAt ? new Date(post.createdAt) : null;

    return (
        <article id="article-body" className="relative pb-16 pt-6">
            {/* reading rail */}
            <div className="sticky top-16 z-30 border-y border-line bg-surface-1/70 backdrop-blur-xl md:top-[4.25rem]">
                <Container size="lg">
                    <div className="flex items-center gap-4 py-2">
                        <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faint sm:block">
                            reading
                        </span>
                        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-surface-3">
                            <ScrollProgress targetId="article-body" variant="inline" />
                        </div>
                        <span className="font-mono text-[0.65rem] tabular-nums text-muted">{minutes} min</span>
                    </div>
                </Container>
            </div>

            <Container size="md" className="mt-10">
                {/* ------------------------------------------------ masthead */}
                <header className="text-left">
                    <Reveal y={12} duration={0.6}>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                            <Link href="/" className="link-line text-accent">
                                Frame &amp; Phrase
                            </Link>
                            {date && !Number.isNaN(date.getTime()) && (
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5">
                                <Clock3 className="h-3.5 w-3.5" />
                                {minutes} min · {words.toLocaleString()} words
                            </span>
                        </div>
                    </Reveal>

                    <SplitHeadline
                        as="h1"
                        text={post.title}
                        className="mt-5 font-display text-hero-sm font-semibold leading-[1.06] tracking-[-0.035em] text-fg"
                        stagger={0.028}
                    />

                    <Reveal delay={0.25} y={14} duration={0.7}>
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/14 font-display text-sm font-semibold text-accent">
                                {(user?.fullName || user?.username || 'F').trim().charAt(0).toUpperCase()}
                            </span>
                            <span className="text-sm font-medium text-muted">
                                {user?.fullName || user?.username || 'A writer at Frame & Phrase'}
                            </span>

                            <span aria-hidden className="mx-1 hidden h-4 w-px bg-line sm:block" />

                            <button
                                type="button"
                                onClick={copyLink}
                                className="group inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted transition-all duration-300 hover:border-accent/50 hover:text-accent"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3.5 w-3.5 text-accent" /> Link copied
                                    </>
                                ) : (
                                    <>
                                        <Link2 className="h-3.5 w-3.5" /> Copy link
                                    </>
                                )}
                            </button>
                        </div>
                    </Reveal>
                </header>

                {/* --------------------------------------------- hero image */}
                <Reveal y={26} blur className="mt-10">
                    <figure className="group relative overflow-hidden rounded-[1.75rem] border border-line shadow-lift">
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-3">
                            <Parallax speed={7}>
                                <Image
                                    src={post.featuredImage}
                                    alt={post.title}
                                    width={1200}
                                    height={675}
                                    priority
                                    loading="eager"
                                    className="h-full w-full scale-[1.08] object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.13]"
                                    sizes="(min-width: 1152px) 1008px, 92vw"
                                />
                            </Parallax>
                        </div>

                        {isAuthor && (
                            <figcaption className="absolute right-4 top-4 z-20 flex flex-wrap items-center gap-2">
                                <Magnetic strength={0.18}>
                                    <Link
                                        href={`/edit-post/${post.slug}`}
                                        className="btn btn-ghost glass !py-2 text-xs"
                                    >
                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                    </Link>
                                </Magnetic>
                                <button
                                    type="button"
                                    onClick={deletePost}
                                    disabled={deleting}
                                    className={`btn !py-2 text-xs transition-colors duration-300 ${
                                        confirming
                                            ? 'btn-danger'
                                            : 'btn-ghost glass text-[#e5484d]'
                                    }`}
                                >
                                    {deleting ? (
                                        <Loader size={14} />
                                    ) : (
                                        <Trash2 className="h-3.5 w-3.5" />
                                    )}
                                    {confirming ? 'Tap again to delete' : 'Delete'}
                                </button>
                            </figcaption>
                        )}
                    </figure>
                </Reveal>

                {/* -------------------------------------------------- body */}
                <div className="prose-fp lead mx-auto mt-12 max-w-2xl">
                    {parse(post.content)}
                </div>

                {/* ------------------------------------------------- outro */}
                <div className="mt-14 flex flex-col items-center gap-6 border-t border-line pt-10 text-center">
                    <DrawSvg
                        viewBox="0 0 120 12"
                        play="auto"
                        duration={1.1}
                        strokeWidth="1.4"
                        className="h-3 w-32 text-accent/70"
                        aria-hidden
                    >
                        <path d="M2 6h34M44 6h3M53 6h3M62 6h56" stroke="currentColor" />
                    </DrawSvg>

                    <p className="max-w-md font-display text-lg italic text-muted">
                        Thanks for reading. Every frame here was written by someone who
                        noticed something.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button href="/" size="md" variant="ghost" iconLeft={<ArrowLeft className="h-4 w-4" />}>
                            All stories
                        </Button>
                        {isAuthor && (
                            <Button href={`/edit-post/${post.slug}`} size="md" variant="primary" iconLeft={<Pencil className="h-4 w-4" />}>
                                Edit this post
                            </Button>
                        )}
                    </div>
                </div>
            </Container>

            {/* back to top */}
            {!reduced && <BackToTop />}
        </article>
    );
}

function BackToTop() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 900);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className={`fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-line bg-surface-1/80 text-fg shadow-lift backdrop-blur transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:border-accent/50 hover:text-accent ${
                show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
            }`}
        >
            <ArrowUp className="h-4 w-4" />
        </button>
    );
}
