import axios from "axios";

class PostService {
    async createPost({ title, slug, content, featuredImage, status, userId, authorName, authorImageUrl }) {
        try {
            const response = await axios.post("/api/posts", {
                title,
                slug,
                content,
                featuredImage,
                status,
                // BUG-020 fix: pass denormalised author data to the API.
                // The server will override userId with the session user.
                authorName,
                authorImageUrl,
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

    async getPosts(status = "active", userId = null) {
        try {
            let url = `/api/posts?status=${status}`;
            if (userId) {
                url += `&userId=${userId}`;
            }
            const response = await axios.get(url);
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

    // Next.js components can use the URL directly from MongoDB/Cloudinary
    getFilePreview(fileUrl) {
        return fileUrl;
    }
}

const postService = new PostService();
export default postService;
