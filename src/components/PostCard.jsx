'use client';
import React from 'react'
import postService from '@/services/config'
import Link from 'next/link'
import Image from 'next/image'

function PostCard({ slug, title, featuredImage }) {
    return (
        <Link href={`/post/${slug}`}>
            <div className='w-full bg-gray-100 rounded-xl p-4 dark:bg-gray-800 dark:text-white'>
                <div className='w-full justify-center mb-4'>
                    <Image
                        src={featuredImage}
                        alt={title}
                        width={400}
                        height={225}
                        className='rounded-xl object-cover w-full h-auto'
                    />
                </div>
                <h2 className='text-xl font-bold'>{title}</h2>
            </div>
        </Link>
    )
}

export default PostCard;
