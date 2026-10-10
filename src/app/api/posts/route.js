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
    // Strip <script> tags entirely
    let clean = html.replace(/<script[\s\S]*?<\/script>/gi, "");
    // Strip on* event handler attributes
    clean = clean.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
    clean = clean.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, "");
    // Strip javascript: URLs
    clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
    clean = clean.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""');
    // Strip <iframe>, <object>, <embed>, <form> tags
    clean = clean.replace(/<(iframe|object|embed|form)[\s\S]*?<\/\1>/gi, "");
    clean = clean.replace(/<(iframe|object|embed|form)\s*[^>]*\/?>/gi, "");
    return clean;
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
        // BUG-013 fix: don't leak internal error details to the client.
        console.error("POST /api/posts error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
