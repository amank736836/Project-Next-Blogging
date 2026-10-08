import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import cloudinary from "@/lib/cloudinary";

// BUG-008 fix: server-side validation constants (mirror the client-side PostForm).
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_MIME_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
]);

export async function POST(request) {
    try {
        // BUG-008 fix: require authentication.
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // BUG-016 fix: check Content-Type before calling formData().
        const contentType = request.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json(
                { error: "Content-Type must be multipart/form-data" },
                { status: 415 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // BUG-008 fix: validate MIME type server-side.
        if (!ALLOWED_MIME_TYPES.has(file.type)) {
            return NextResponse.json(
                { error: `Unsupported file type: ${file.type}. Allowed: image/png, image/jpeg, image/gif, image/webp` },
                { status: 415 }
            );
        }

        // BUG-008 fix: validate file size server-side.
        if (file.size > MAX_UPLOAD_BYTES) {
            return NextResponse.json(
                { error: `File too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum is 8MB.` },
                { status: 413 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "blog_posts" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({
            fileId: result.public_id,
            url: result.secure_url,
        });
    } catch (error) {
        // BUG-013 fix: don't leak internal error details.
        console.error("POST /api/upload error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
