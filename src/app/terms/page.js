'use client';
import React from 'react';
import { Container } from '@/components';

export default function TermsPage() {
    return (
        <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
            <Container>
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Terms & Conditions</h1>
                    <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using Frame & Phrase, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our platform.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. User Accounts</h2>
                            <p>
                                You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. We use Clerk for secure authentication.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Content Ownership</h2>
                            <p>
                                You retain all rights to the content you post on Frame & Phrase. By posting, you grant us a non-exclusive license to display and distribute your content within the platform.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Prohibited Conduct</h2>
                            <p>
                                Users are prohibited from posting illegal, offensive, or harmful content, or attempting to interfere with the platform's security and functionality.
                            </p>
                        </section>
                    </div>
                </div>
            </Container>
        </div>
    );
}
