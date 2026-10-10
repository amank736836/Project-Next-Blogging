import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import sanitizeHtml from "@/lib/sanitize";

/**
 * Map a thrown error to a client-facing JSON error response.
 *
 * BUG-013 fix: never echo driver internals (hosts, ports, stacks) to the
 * caller. Application-level validation errors are safe to surface — they are
 * expressed in the app's own words and only name fields the client already
 * sends. Anything unexpected is logged server-side and answered generically.
 */
function errorResponse(error, logPrefix) {
    const name = error?.name;
    if (name === "ValidationError" || name === "HarnessValidationError") {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (error?.code === 11000) {
        return NextResponse.json(
            { error: "Post validation failed: slug must be unique." },
            { status: 500 }
        );
    }
    console.error(`${logPrefix}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
        return errorResponse(error, "PUT /api/posts/[slug] error");
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
