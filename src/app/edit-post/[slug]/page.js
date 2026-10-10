'use client';
import React, { useEffect, useState } from 'react'
import { Container, PostForm, AuthLayout } from '@/components'
import PageHeader from '@/components/ui/PageHeader'
import postService from '@/services/config'
import { useRouter } from 'next/navigation'
import Loader from '@/components/loaders/Loader';
import { ArticleSkeleton } from '@/components/loaders/Skeleton';

export default function EditPostPage({ params: paramsPromise }) {
    const params = React.use(paramsPromise);
    const [post, setPosts] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const slug = params.slug

    useEffect(() => {
        if (!slug) {
            router.push('/')
            return;
        }
        let alive = true;
        postService.getPost(slug)
            .then((post) => {
                if (alive && post) setPosts(post)
            })
            .catch((err) => {
                console.error("Failed to fetch post for editing:", err)
                if (alive) router.push("/")
            })
            .finally(() => alive && setLoading(false))
        return () => { alive = false }
    }, [slug, router])

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center py-24">
                <div className="w-full max-w-3xl px-6"><ArticleSkeleton /></div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
                <Loader size={32} className="text-accent" />
                <p className="text-muted">Nothing to edit at that address.</p>
            </div>
        )
    }

    return (
        <div className='pb-20'>
            <AuthLayout authentication>
                <PageHeader
                    size="sm"
                    kicker="editing"
                    title={`Rewriting “${post.title}”`}
                    body="Change the frame, change the prose, publish again. The URL stays put."
                />
                <Container size="xl">
                    <PostForm post={post} />
                </Container>
            </AuthLayout>
        </div>
    )
}
