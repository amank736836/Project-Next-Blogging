'use client';
import { SignIn } from "@clerk/nextjs";

function Login() {
    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
            <SignIn
                routing="hash"
                signUpUrl="/signup"
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
                    },
                }}
            />
        </div>
    );
}

export default Login;
