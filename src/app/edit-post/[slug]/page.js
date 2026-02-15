'use client';
import React, { useEffect, useState } from 'react'
import { Container, PostForm, AuthLayout } from '@/components'
import postService from '@/services/config'
import { useRouter } from 'next/navigation'
import Loader from '@/components/loaders/Loader';

export default function EditPostPage({ params: paramsPromise }) {
    const params = React.use(paramsPromise);
    const [post, setPosts] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const slug = params.slug

    useEffect(() => {
        if (slug) {
            postService.getPost(slug)
                .then((post) => {
                    if (post) {
                        setPosts(post)
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch post for editing:", err);
                    router.push("/");
                })
                .finally(() => setLoading(false))
        } else {
            router.push('/')
        }
    }, [slug, router])

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader /></div>

    return post ? (
        <div className='py-8'>
            <AuthLayout authentication>
                <Container>
                    <PostForm post={post} />
                </Container>
            </AuthLayout>
        </div>
    ) : null
}
