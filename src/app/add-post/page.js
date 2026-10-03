import { Container, PostForm, AuthLayout } from "@/components";
import PageHeader from "@/components/ui/PageHeader";

export default function AddPostPage() {
    return (
        <div className='pb-20'>
            <AuthLayout authentication>
                <PageHeader
                    size="sm"
                    kicker="compose"
                    title="Frame it, then phrase it."
                    accent="phrase it."
                    body="One photo, one piece of writing. Autosave is not watching — write it in one go."
                />
                <Container size="xl">
                    <PostForm />
                </Container>
            </AuthLayout>
        </div>
    )
}
