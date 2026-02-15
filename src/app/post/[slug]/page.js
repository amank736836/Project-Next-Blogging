'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import postService from "@/services/config";
import { Button, Container } from "@/components";
import parse from "html-react-parser";
import Image from "next/image";
import Loader from "@/components/loaders/Loader";

export default function PostPage({ params: paramsPromise }) {
    const params = React.use(paramsPromise);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const slug = params.slug;

    const { user } = useUser();
    const isAuthor = post && user ? post.userId === user.id : false;

    useEffect(() => {
        if (slug) {
            postService.getPost(slug)
                .then((post) => {
                    if (post) setPost(post);
                    else router.push("/");
                })
                .catch((err) => {
                    console.error("Failed to fetch post:", err);
                    router.push("/");
                })
                .finally(() => setLoading(false));
        } else router.push("/");
    }, [slug, router]);

    const deletePost = () => {
        postService.deletePost(post.slug).then((status) => {
            if (status) {
                router.push("/");
            }
        });
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader /></div>

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2 bg-white dark:bg-gray-800">
                    <Image
                        src={post.featuredImage}
                        alt={post.title}
                        width={800}
                        height={450}
                        className="rounded-xl object-cover"
                        priority
                        loading="eager"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link href={`/edit-post/${post.slug}`}>
                                <Button className="mr-3 bg-green-500">Edit</Button>
                            </Link>
                            <Button onClick={deletePost} className="bg-red-500">
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6 dark:text-white">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css dark:text-gray-300">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}
