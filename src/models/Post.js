import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
        featuredImage: {
            type: String, // Cloudinary URL
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        // BUG-020 fix: corrected comment — this is a Clerk user ID, not Firebase.
        userId: {
            type: String, // Clerk user ID
            required: true,
            index: true, // BUG-020 fix: index for efficient per-user queries
        },
        // BUG-020 fix: denormalise author display data so the UI can show a
        // byline without a separate user lookup. These fields are written at
        // create time and may go stale if the Clerk profile changes.
        authorName: {
            type: String,
            default: "",
        },
        authorImageUrl: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
