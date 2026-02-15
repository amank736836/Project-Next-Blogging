'use client';
import React, { useState } from 'react';
import { Container } from '@/components';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
            <Container>
                <div className="max-w-xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Contact Us</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Have a question or feedback? We'd love to hear from you.
                        </p>
                    </div>

                    {submitted ? (
                        <div className="p-8 bg-blue-50 dark:bg-gray-800 rounded-3xl text-center">
                            <h3 className="text-2xl font-bold text-blue-600 dark:text-cyan-400 mb-2">Message Sent!</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Thank you for reaching out. Our team will get back to you shortly.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-6 text-sm font-medium text-blue-600 dark:text-cyan-400 hover:underline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                <textarea
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="How can we help?"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 dark:bg-cyan-400 text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </Container>
        </div>
    );
}
