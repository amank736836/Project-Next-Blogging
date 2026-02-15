'use client';
import React, { useState, useEffect } from 'react'
import { Container, PostCard, AuthLayout } from '@/components'
import postService from '@/services/config'
import Loader from '@/components/loaders/Loader';

function AllPostsPage() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        postService.getPosts([]).then((posts) => {
            if (posts) {
                setPosts(posts)
            }
        }).finally(() => setLoading(false))
    }, [])

    return (
        <div className='w-full py-8'>
            <AuthLayout authentication>
                <Container>
                    {loading ? (
                        <div className="flex justify-center items-center py-20"><Loader /></div>
                    ) : (
                        <>
                            {posts.length === 0 ? (
                                <div className="p-2 w-full text-center">
                                    <h1 className="text-2xl font-bold hover:text-gray-500 dark:text-white">
                                        No posts found. Be the first to write one!
                                    </h1>
                                </div>
                            ) : (
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                                    {posts.map((post) => (
                                        <PostCard key={post.slug} {...post} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </Container>
            </AuthLayout>
        </div>
    )
}

export default AllPostsPage;
