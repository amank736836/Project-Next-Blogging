import axios from "axios";

class PostService {
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            const response = await axios.post("/api/posts", {
                title,
                slug,
                content,
                featuredImage,
                status,
                userId,
            });
            return response.data;
        } catch (error) {
            console.error("PostService :: createPost :: error", error);
            throw error;
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            const response = await axios.put(`/api/posts/${slug}`, {
                title,
                content,
                featuredImage,
                status,
            });
            return response.data;
        } catch (error) {
            console.error("PostService :: updatePost :: error", error);
            throw error;
        }
    }

    async deletePost(slug) {
        try {
            const response = await axios.delete(`/api/posts/${slug}`);
            return response.data;
        } catch (error) {
            console.error("PostService :: deletePost :: error", error);
            throw error;
        }
    }

    async getPost(slug) {
        try {
            const response = await axios.get(`/api/posts/${slug}`);
            return response.data;
        } catch (error) {
            console.error("PostService :: getPost :: error", error);
            throw error;
        }
    }

    async getPosts(status = "active") {
        try {
            const response = await axios.get(`/api/posts?status=${status}`);
            return response.data;
        } catch (error) {
            console.error("PostService :: getPosts :: error", error);
            throw error;
        }
    }

    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await axios.post("/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data; // { fileId, url }
        } catch (error) {
            console.error("PostService :: uploadFile :: error", error);
            throw error;
        }
    }

    // Next.js components can use use the URL directly from MongoDB/Cloudinary
    getFilePreview(fileUrl) {
        return fileUrl;
    }
}

const postService = new PostService();
export default postService;
