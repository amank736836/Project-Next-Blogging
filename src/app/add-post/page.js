import { Container, PostForm, AuthLayout } from "@/components";

export default function AddPostPage() {
    return (
        <div className='py-8'>
            <AuthLayout authentication>
                <Container>
                    <PostForm />
                </Container>
            </AuthLayout>
        </div>
    )
}
