'use client';
import React from 'react';
import { Container } from '@/components';

export default function FeaturesPage() {
    return (
        <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
            <Container>
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                        Powerful Features for Modern Blogging
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
                        Everything you need to create, manage, and scale your content with ease.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-blue-600 dark:text-cyan-400 mb-3">Rich Text Editor</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Create beautiful posts with our integrated TinyMCE editor. Support for formatting, images, and more.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-blue-600 dark:text-cyan-400 mb-3">Image Management</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Seamlessly upload and optimize your images using Cloudinary integration for lightning-fast delivery.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-blue-600 dark:text-cyan-400 mb-3">Secure Auth</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Powered by Clerk, ensuring your account and data are protected with industry-standard security.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-blue-600 dark:text-cyan-400 mb-3">Responsive Design</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Your blog looks stunning on any device, from smartphones to large desktop screens.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
