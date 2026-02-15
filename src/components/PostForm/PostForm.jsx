'use client';
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "@/components/index";
import postService from "@/services/config";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/loaders/Loader";

function PostForm({ post }) {
    const { user } = useUser();
    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } =
        useForm({
            defaultValues: {
                title: post?.title || "",
                slug: post?.slug || "",
                content: post?.content || "",
                status: post?.status || "active",
            },
        });

    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const router = useRouter();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const submit = async (data) => {
        setLoading(true);
        try {
            if (post) {
                const file = data.image[0] ? await postService.uploadFile(data.image[0]) : null;

                const dbPost = await postService.updatePost(post.slug, {
                    ...data,
                    featuredImage: file ? file.url : post.featuredImage,
                });
                if (dbPost) {
                    router.push(`/post/${dbPost.slug}`);
                }
            } else {
                const file = await postService.uploadFile(data.image[0]);

                if (file) {
                    const dbPost = await postService.createPost({
                        ...data,
                        featuredImage: file.url,
                        userId: user.id,
                    });
                    if (dbPost) {
                        router.push(`/post/${dbPost.slug}`);
                    }
                }
            }
        } catch (error) {
            console.error("PostForm :: submit :: error", error);
        } finally {
            setLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "")
                .replace(/\s/g, "-");
        }
        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [watch, slugTransform, setValue]);

    const deletePost = async () => {
        setLoading(true);
        try {
            const status = await postService.deletePost(post.slug);
            if (status) {
                router.push("/");
            }
        } catch (error) {
            console.error("PostForm :: deletePost :: error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap p-4">
            <div className="w-full md:w-2/3 px-2">
                <Input
                    label="Title:"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: "Title is required" })}
                    error={errors.title?.message}
                />
                <Input
                    label="Slug:"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: "Slug is required" })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), {
                            shouldValidate: true,
                        });
                    }}
                    error={errors.slug?.message}
                />
                <RTE
                    label="Content:"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                />
            </div>
            <div className="w-full md:w-1/3 px-2 mt-4 md:mt-0">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    {...register("image", {
                        required: !post ? "Image is required" : false,
                        onChange: (e) => handleImageChange(e)
                    })}
                    error={errors.image?.message}
                />
                {(imagePreview || post?.featuredImage) && (
                    <div className="w-full mb-4">
                        <p className="text-sm mb-2 dark:text-gray-300">Image Preview:</p>
                        <img
                            src={imagePreview || post.featuredImage}
                            alt={post?.title || "Preview"}
                            className="rounded-lg max-h-48 object-cover mx-auto shadow-md border dark:border-gray-700"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button
                    type="submit"
                    className="w-full flex justify-center items-center mb-4"
                    disabled={loading}
                >
                    {loading ? <Loader /> : post ? "Update" : "Submit"}
                </Button>

                {post && (
                    <Button
                        type="button"
                        onClick={deletePost}
                        className="w-full flex justify-center items-center bg-red-600 hover:bg-red-700"
                        disabled={loading}
                    >
                        Delete Post
                    </Button>
                )}
            </div>
        </form>
    );
}

export default PostForm;
