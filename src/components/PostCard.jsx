'use client';
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'

function PostCard({ slug, title, featuredImage, userId }) {
    const { user } = useUser();
    const isAuthor = user && userId && user.id === userId;

    return (
        <div className='w-full bg-gray-100 rounded-xl p-4 dark:bg-gray-800 dark:text-white relative group'>
            <Link href={`/post/${slug}`}>
                <div className='w-full justify-center mb-4 cursor-pointer'>
                    <Image
                        src={featuredImage}
                        alt={title}
                        width={400}
                        height={225}
                        className='rounded-xl object-cover w-full h-auto'
                    />
                </div>
                <h2 className='text-xl font-bold mb-4'>{title}</h2>
            </Link>

            {isAuthor && (
                <div className='mt-auto flex gap-2'>
                    <Link href={`/edit-post/${slug}`} className="w-full">
                        <button className='w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors'>
                            Edit Post
                        </button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default PostCard;
