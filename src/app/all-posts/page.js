'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { PenLine, Eye, EyeOff, Feather } from 'lucide-react';
import { Container, PostCard, AuthLayout, Button } from '@/components';
import postService from '@/services/config';
import { GridSkeleton } from '@/components/loaders/Skeleton';
import PageHeader from '@/components/ui/PageHeader';
import Reveal from '@/components/motion/Reveal';
import EmptyShelf from '@/components/ui/EmptyShelf';
import { useUser } from '@clerk/nextjs';

function Stat({ Icon, value, label }) {
    return (
        <span className="inline-flex items-center gap-2 text-[0.8rem] text-muted">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/12 text-accent">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
            </span>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em]">
                <span className="text-fg font-semibold">{value}</span> {label}
            </span>
        </span>
    );
}

function AllPostsPage() {
    const { user } = useUser();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('all');

    // Every state update happens in a callback, never synchronously in the
    // effect body, so the render pipeline stays cascade-free.
    useEffect(() => {
        if (!user) return undefined;
        let alive = true;
        postService
            .getPosts('active', user.id)
            .then((data) => {
                if (alive && Array.isArray(data)) setPosts(data);
            })
            .catch(() => {
                if (alive) setPosts([]);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => { alive = false; };
    }, [user]);

    const counts = useMemo(() => {
        const active = posts.filter((p) => p.status !== 'inactive').length;
        return { all: posts.length, active, inactive: posts.length - active };
    }, [posts]);

    const visible = useMemo(
        () =>
            posts
                .filter((p) => (tab === 'all' ? true : tab === 'active' ? p.status !== 'inactive' : p.status === 'inactive'))
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
        [posts, tab]
    );

    return (
        <div className='w-full pb-16'>
            <AuthLayout authentication>
                <PageHeader
                    kicker="my shelf"
                    title="Everything you have framed."
                    accent="framed."
                    body="Private drafts and published pieces side by side. Nothing is ever published by accident."
                    actions={
                        <Button href="/add-post" size="md" variant="primary" iconLeft={<PenLine className="h-4 w-4" />}>
                            New post
                        </Button>
                    }
                    meta={
                        <>
                            <Stat Icon={Feather} value={counts.all} label="total" />
                            <Stat Icon={Eye} value={counts.active} label="published" />
                            <Stat Icon={EyeOff} value={counts.inactive} label="drafts" />
                        </>
                    }
                />

                <Container size="xl">
                    <div className="mb-8 flex flex-wrap items-center gap-2">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'active', label: 'Published' },
                            { id: 'inactive', label: 'Drafts' },
                        ].map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setTab(t.id)}
                                aria-pressed={tab === t.id}
                                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] ${
                                    tab === t.id
                                        ? 'border-accent bg-accent text-[color:var(--accent-contrast)]'
                                        : 'border-line text-muted hover:border-accent/45 hover:text-fg'
                                }`}
                            >
                                {t.label}
                                <span className="ml-1.5 font-mono text-[0.62rem] opacity-70">{counts[t.id]}</span>
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <GridSkeleton count={4} />
                    ) : visible.length === 0 ? (
                        <EmptyShelf
                            title={
                                posts.length === 0
                                    ? 'Your shelf is empty'
                                    : tab === 'inactive'
                                        ? 'No drafts parked here'
                                        : 'Nothing published yet'
                            }
                            body={
                                posts.length === 0
                                    ? 'Drop a photo, write the four sentences that explain it, and this frame fills itself in.'
                                    : 'Switch tabs, or start something new — the archive is patient.'
                            }
                            action={
                                <Button href="/add-post" size="md" variant="primary">
                                    Write something
                                </Button>
                            }
                        />
                    ) : (
                        <Reveal stagger={0.08} className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {visible.map((post) => (
                                <PostCard key={post.slug} {...post} />
                            ))}
                        </Reveal>
                    )}
                </Container>
            </AuthLayout>
        </div>
    );
}

export default AllPostsPage;
