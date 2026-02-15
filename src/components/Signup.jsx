'use client';
import { SignUp } from "@clerk/nextjs";

function Signup() {
    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
            <SignUp
                routing="hash"
                signInUrl="/login"
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-sm normal-case',
                    },
                }}
            />
        </div>
    );
}

export default Signup;
