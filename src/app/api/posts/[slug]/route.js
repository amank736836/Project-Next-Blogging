import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";

/**
 * Sanitise HTML to strip scripts and event handlers.
 * BUG-022 fix: prevent stored XSS from rendered post content.
 */
function sanitizeHtml(html) {
    if (!html || typeof html !== "string") return html;
    let clean = html.replace(/<script[\s\S]*?<\/script>/gi, "");
    clean = clean.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
    clean = clean.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, "");
    clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
    clean = clean.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""');
    clean = clean.replace(/<(iframe|object|embed|form)[\s\S]*?<\/\1>/gi, "");
    clean = clean.replace(/<(iframe|object|embed|form)\s*[^>]*\/?>/gi, "");
    return clean;
}

// GET a single post by slug
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { slug } = await params;

        // Check if the caller is authenticated.
        const { userId } = await auth();

        if (userId) {
            // Authenticated caller: allow viewing own drafts.
            const post = await Post.findOne({ slug });
            if (!post) {
                return NextResponse.json(
                    { error: "Post not found" },
                    { status: 404 }
                );
            }
            // BUG-006 fix: if the post is a draft, only the owner can see it.
            if (post.status === "inactive" && post.userId !== userId) {
                return NextResponse.json(
                    { error: "Post not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json(post);
        }

        // BUG-006 fix: anonymous callers can only see published (active) posts.
        const post = await Post.findOne({ slug, status: "active" });
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(post);
    } catch (error) {
        console.error("GET /api/posts/[slug] error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// UPDATE a post by slug
export async function PUT(request, { params }) {
    try {
        // BUG-004 fix: require authentication for updating posts.
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { slug } = await params;

        // BUG-004 fix: only allow updating posts owned by the caller.
        const existing = await Post.findOne({ slug, userId });
        if (!existing) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        const body = await request.json();

        // BUG-007 fix: allow-list only safe fields; never allow userId override.
        const ALLOWED_FIELDS = ["title", "slug", "content", "featuredImage", "status", "authorName", "authorImageUrl"];
        const update = {};
        for (const field of ALLOWED_FIELDS) {
            if (body[field] !== undefined) {
                update[field] = body[field];
            }
        }

        // BUG-022 fix: sanitise content before storing.
        if (update.content) update.content = sanitizeHtml(update.content);
        if (update.title) update.title = update.title.replace(/[<>]/g, "");

        // BUG-007 fix: runValidators: true enforces the schema enum on status.
        const updated = await Post.findOneAndUpdate(
            { slug, userId },
            update,
            { new: true, runValidators: true }
        );
        return NextResponse.json(updated);
    } catch (error) {
        console.error("PUT /api/posts/[slug] error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE a post by slug
export async function DELETE(request, { params }) {
    try {
        // BUG-004 fix: require authentication for deleting posts.
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { slug } = await params;

        // BUG-004 fix: only allow deleting posts owned by the caller.
        const post = await Post.findOneAndDelete({ slug, userId });
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("DELETE /api/posts/[slug] error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
