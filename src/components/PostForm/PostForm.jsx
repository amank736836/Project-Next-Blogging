'use client';
import React, { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ImagePlus, Loader2, Save, Sparkles, Trash2, X, Link2 } from "lucide-react";
import { Button, Input, Select, RTE } from "@/components/index";
import postService from "@/services/config";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/loaders/Loader";
import { useMotionEffect } from "@/lib/motion";

const MAX_MB = 8;

function words(html) {
  return String(html || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
}

function PostForm({ post }) {
    const { user } = useUser();
    const { register, handleSubmit, setValue, control, getValues, formState: { errors } } =
        useForm({
            // Validate as the writer types so format problems (e.g. the slug
            // pattern) surface immediately instead of only on submit.
            mode: "onChange",
            defaultValues: {
                title: post?.title || "",
                slug: post?.slug || "",
                content: post?.content || "",
                status: post?.status || "active",
            },
        });

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
    const router = useRouter();

    const title = useWatch({ control, name: "title" });
    const content = useWatch({ control, name: "content" });
    const count = words(content);

    const { ref: formRef } = useMotionEffect((g, node) => {
        g.from(g.utils.toArray("[data-rise]", node), {
            y: 18,
            opacity: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: "expo.out",
        });
    }, []);

    const inputEl = () => document.getElementById("featured-input");

    const previewFile = (file) => {
        if (!file) {
            setImagePreview(null);
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const onPick = (e) => {
        previewFile(e.target.files?.[0]);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer?.files?.[0];
        if (!file) return;
        previewFile(file);
        // FileList from a drop is not assignable to an <input>, so we keep the
        // file itself in form state and read it back on submit.
        setValue("image", [file], { shouldValidate: true, shouldDirty: true });
        try {
            const el = inputEl();
            if (el) el.files = e.dataTransfer.files;
        } catch {
            /* some browsers freeze input.files — the form value still drives submit */
        }
    };

    const clearImage = () => {
        setImagePreview(null);
        setValue("image", null, { shouldValidate: true });
        const el = inputEl();
        if (el) el.value = "";
    };

    const submit = async (data) => {
        setLoading(true);
        try {
            const file = data.image?.[0];

            if (post) {
                const uploaded = file ? await postService.uploadFile(file) : null;
                const dbPost = await postService.updatePost(post.slug, {
                    ...data,
                    image: undefined,
                    featuredImage: uploaded ? uploaded.url : post.featuredImage,
                });
                if (dbPost) router.push(`/post/${dbPost.slug}`);
            } else {
                const uploaded = await postService.uploadFile(file);
                if (uploaded) {
                    const dbPost = await postService.createPost({
                        ...data,
                        image: undefined,
                        featuredImage: uploaded.url,
                        userId: user.id,
                        // BUG-020 fix: denormalise author display data onto the post
                        // so the article reader can show the correct byline.
                        authorName: user.fullName || user.username || '',
                        authorImageUrl: user.imageUrl || '',
                    });
                    if (dbPost) router.push(`/post/${dbPost.slug}`);
                }
            }
        } catch (error) {
            console.error("PostForm :: submit :: error", error);
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

    // Keep the slug in step with the title until the writer takes it over.
    useEffect(() => {
        if (slugTouched) return;
        setValue("slug", slugTransform(title), { shouldValidate: true });
    }, [title, slugTouched, slugTransform, setValue]);

    useEffect(() => {
        if (!confirmDelete) return;
        const t = setTimeout(() => setConfirmDelete(false), 4500);
        return () => clearTimeout(t);
    }, [confirmDelete]);

    const deletePost = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        setDeleting(true);
        try {
            const status = await postService.deletePost(post.slug);
            if (status) router.push("/");
        } catch (error) {
            console.error("PostForm :: deletePost :: error", error);
            setDeleting(false);
            setConfirmDelete(false);
        }
    };

    // Registered once so the drop zone can share the element ref with RHF.
    const imageField = register("image", {
        required: !post ? "A frame makes it a post" : false,
        validate: {
            size: (file) =>
                !file?.[0] || file[0].size <= MAX_MB * 1024 * 1024 || `Keep it under ${MAX_MB}MB`,
        },
        onChange: onPick,
    });

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit(submit)}
            className="grid items-start gap-6 lg:grid-cols-[1.55fr_0.95fr] lg:gap-8"
        >
            {/* ------------------------------------------------------- writing */}
            <div className="space-y-5">
                <div data-rise className="card p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <span className="kicker">{post ? 'editing' : 'new post'}</span>
                        {title ? (
                            <span className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
                                <Sparkles className="h-3 w-3 text-accent" />
                                {title.length} chars
                            </span>
                        ) : null}
                    </div>

                    <Input
                        label="Title"
                        placeholder="The morning the fog lifted"
                        className="!border-0 !bg-transparent !px-0 !py-2 font-display !text-[1.75rem] font-semibold !shadow-none focus:!bg-transparent md:!text-[2rem]"
                        {...register("title", { required: "A title keeps the frame square" })}
                        error={errors.title?.message}
                    />

                    <div className="mt-4 border-t border-line pt-4">
                        {slugTouched ? (
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <Input
                                    label="Slug"
                                    placeholder="the-morning-the-fog-lifted"
                                    className="font-mono !text-[0.85rem]"
                                    {...register("slug", {
                                        required: "A slug keeps the URL honest",
                                        pattern: {
                                            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                            message: "Lowercase words, separated by dashes",
                                        },
                                    })}
                                    error={errors.slug?.message}
                                    hint="/post/ + this — permanent once published"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSlugTouched(false);
                                        setValue("slug", slugTransform(title), { shouldValidate: true });
                                    }}
                                    className="btn btn-ghost mb-1 shrink-0 !py-2 text-[0.68rem] font-mono uppercase tracking-[0.14em]"
                                >
                                    auto
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex min-w-0 items-center gap-2 font-mono text-[0.72rem] text-faint sm:text-[0.78rem]">
                                    <Link2 className="h-3.5 w-3.5 shrink-0" />
                                    <span className="hidden sm:inline">framephrase.app/</span>
                                    <span className="truncate text-accent">
                                        {getValues("slug") || "your-slug"}
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSlugTouched(true)}
                                    className="ml-auto w-fit shrink-0 rounded-full border border-line px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:border-accent/50 hover:text-accent"
                                >
                                    edit slug
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div data-rise className="card overflow-hidden">
                    <div className="flex items-center justify-between border-b border-line px-5 py-3">
                        <span className="kicker">the prose</span>
                        <span className="font-mono text-[0.62rem] text-faint">
                            {count.toLocaleString()} words · ~{Math.max(1, Math.round(count / 220))} min read
                        </span>
                    </div>
                    <div className="p-2 sm:p-3">
                        <RTE
                            label=""
                            name="content"
                            control={control}
                            defaultValue={getValues("content")}
                        />
                        {errors.content?.message && (
                            <p className="mt-2 px-3 text-xs font-medium text-[#e5484d]">{errors.content.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ------------------------------------------------------ sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-24">
                <div data-rise className="card p-5">
                    <span className="kicker">the frame</span>

                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                        className={`group relative mt-4 overflow-hidden rounded-2xl border border-dashed transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                            dragging
                                ? "border-accent bg-accent/10 scale-[1.01]"
                                : "border-line bg-surface-2/60 hover:border-accent/50"
                        }`}
                    >
                        {imagePreview || post?.featuredImage ? (
                            <div className="relative aspect-[4/3] w-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imagePreview || post.featuredImage}
                                    alt="Featured image preview"
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    aria-label="Remove image"
                                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ink-950/60 text-white backdrop-blur transition-transform duration-300 hover:scale-105"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <span className="peek absolute inset-x-2 bottom-2 rounded-xl bg-ink-950/55 py-1.5 text-center font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white backdrop-blur">
                                    drop to replace
                                </span>
                            </div>
                        ) : (
                            <label
                                htmlFor="featured-input"
                                className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-3 px-4 text-center"
                            >
                                <span className={`grid h-12 w-12 place-items-center rounded-full border border-line bg-surface-1 text-accent transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${dragging ? "scale-110" : "group-hover:scale-105"}`}>
                                    <ImagePlus className="h-5 w-5" />
                                </span>
                                <span className="text-sm font-semibold text-fg">
                                    {dragging ? "let it go" : "Drop a photo, or browse"}
                                </span>
                                <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
                                    png · jpg · gif — up to {MAX_MB}mb
                                </span>
                            </label>
                        )}

                        <Input
                            id="featured-input"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/gif"
                            className="sr-only"
                            {...imageField}
                        />
                    </div>

                    {errors.image?.message && (
                        <p className="mt-2 text-xs font-medium text-[#e5484d]">{errors.image.message}</p>
                    )}
                </div>

                <div data-rise className="card space-y-4 p-5">
                    <Select
                        options={["active", "inactive"]}
                        label="Status"
                        {...register("status", { required: true })}
                    />
                    <p className="text-xs leading-relaxed text-faint">
                        <span className="font-semibold text-muted">active</span> joins the public
                        archive; <span className="font-semibold text-muted">inactive</span> stays in
                        your shelf, private and unfinished.
                    </p>
                </div>

                <div data-rise className="space-y-2.5">
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading}
                        iconLeft={loading ? undefined : <Save className="h-4 w-4" />}
                    >
                        {loading ? (
                            <>
                                <Loader size={15} />
                                {post ? "Saving…" : "Publishing…"}
                            </>
                        ) : post ? (
                            "Save changes"
                        ) : (
                            "Publish story"
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        Keep as draft, leave for now
                    </Button>

                    {post && (
                        <button
                            type="button"
                            onClick={deletePost}
                            disabled={deleting}
                            className={`flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                                confirmDelete
                                    ? "border-transparent bg-[#e5484d] text-white"
                                    : "border-line text-[#e5484d] hover:border-[#e5484d]/50"
                            }`}
                        >
                            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                            {confirmDelete ? "tap again to delete" : "delete post"}
                        </button>
                    )}
                </div>
            </aside>
        </form>
    );
}

export default PostForm;
