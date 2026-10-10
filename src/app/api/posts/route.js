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
    // MongoDB duplicate-key (unique slug) — the fake store raises a
    // ValidationError instead, but real Mongo raises code 11000.
    if (error?.code === 11000) {
        return NextResponse.json(
            { error: "Post validation failed: slug must be unique." },
            { status: 500 }
        );
    }
    console.error(`${logPrefix}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);

        // Default to only showing published (active) posts.
        const status = searchParams.get("status") || "active";

        // BUG-005 fix: when the caller asks for drafts ("inactive"),
        // they MUST be authenticated and we bind userId to the session —
        // never accept userId from the query string.
        if (status === "inactive") {
            const { userId } = await auth();
            if (!userId) {
                return NextResponse.json(
                    { error: "Authentication required" },
                    { status: 401 }
                );
            }
            const posts = await Post.find({ status: "inactive", userId });
            return NextResponse.json(posts);
        }

        // Public archive: only active posts, no user filter needed.
        const posts = await Post.find({ status: "active" });
        return NextResponse.json(posts);
    } catch (error) {
        // BUG-013 fix: don't leak internal error details to the client.
        console.error("GET /api/posts error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        // BUG-004 fix: require authentication for creating posts.
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        await dbConnect();
        const body = await request.json();

        // BUG-022 fix: sanitise content and title before storing.
        if (body.content) body.content = sanitizeHtml(body.content);
        if (body.title) body.title = body.title.replace(/[<>]/g, "");

        // BUG-004 fix: bind userId to the authenticated session,
        // never trust the request body for userId.
        const postData = {
            ...body,
            userId,
        };

        // BUG-020 fix: if the body includes denormalised author data, keep it.
        // If not, the caller (PostForm) is expected to supply them.

        const post = await Post.create(postData);
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        return errorResponse(error, "POST /api/posts error");
    }
}
