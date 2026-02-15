'use client';
import React, { useEffect, useState } from 'react'
import postService from "@/services/config";
import { Container, PostCard } from '@/components'
import Loader from '@/components/loaders/Loader';

import { useAuth } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn } = useAuth();
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    postService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts)
      }
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className='w-full py-20 text-center flex justify-center items-center'>
        <Loader />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-20 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500 dark:text-white">
                {isSignedIn
                  ? "No posts found. Be the first to write one!"
                  : "Login to read posts or be the first to write one!"}
              </h1>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className='w-full py-8 px-4'>
      <Container>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {posts.map((post) => (
            <div key={post.slug} className='p-2'>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
