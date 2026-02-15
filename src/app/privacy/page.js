'use client';
import React from 'react';
import { Container } from '@/components';

export default function PrivacyPage() {
    return (
        <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
            <Container>
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
                    <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">
                        <p className="text-sm italic mb-8">Last Updated: February 15, 2026</p>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
                            <p>
                                We collect information you provide directly, such as when you create an account, post a blog, or contact us. This includes your name, email address, and any content you upload.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
                            <p>
                                We use your information to provide, maintain, and improve our services, communicate with you, and personalize your experience. We do not sell your personal data.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Security</h2>
                            <p>
                                We implement industry-standard security measures, including encryption and secure authentication via Clerk, to protect your data from unauthorized access.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Third-Party Services</h2>
                            <p>
                                We use third-party services like MongoDB for data storage, Cloudinary for image hosting, and Clerk for authentication. Each service has its own privacy policy.
                            </p>
                        </section>
                    </div>
                </div>
            </Container>
        </div>
    );
}
