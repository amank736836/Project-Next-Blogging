import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";

// GET a single post by slug
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { slug } = await params;
        const post = await Post.findOne({ slug });
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// UPDATE a post by slug
export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { slug } = await params;
        const body = await request.json();
        const post = await Post.findOneAndUpdate({ slug }, body, { new: true });
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE a post by slug
export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { slug } = await params;
        const post = await Post.findOneAndDelete({ slug });
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
