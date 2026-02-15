'use client';
import React from 'react';
import { Container } from '@/components';

export default function PricingPage() {
    return (
        <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
            <Container>
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
                        Choose the plan that's right for your content journey.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Free Plan */}
                        <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-3xl flex flex-col items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
                            <div className="text-4xl font-extrabold text-blue-600 dark:text-cyan-400 mb-4">$0 <span className="text-sm font-normal text-gray-500">/mo</span></div>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 mb-8 space-y-2">
                                <li>Unlimited Public Posts</li>
                                <li>Standard Support</li>
                                <li>1GB Image Storage</li>
                            </ul>
                            <button className="mt-auto px-6 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full font-bold hover:opacity-90 transition-opacity">Get Started</button>
                        </div>

                        {/* Pro Plan */}
                        <div className="p-8 border-2 border-blue-600 dark:border-cyan-400 rounded-3xl flex flex-col items-center relative transform scale-105 shadow-xl">
                            <div className="absolute top-0 transform -translate-y-1/2 bg-blue-600 dark:bg-cyan-400 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
                            <div className="text-4xl font-extrabold text-blue-600 dark:text-cyan-400 mb-4">$12 <span className="text-sm font-normal text-gray-500">/mo</span></div>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 mb-8 space-y-2">
                                <li>Custom Domain Support</li>
                                <li>Priority Support</li>
                                <li>10GB Image Storage</li>
                                <li>Advanced Analytics</li>
                            </ul>
                            <button className="mt-auto px-6 py-2 bg-blue-600 text-white dark:bg-cyan-400 dark:text-gray-900 rounded-full font-bold hover:opacity-90 transition-opacity">Go Pro</button>
                        </div>

                        {/* Business Plan */}
                        <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-3xl flex flex-col items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Business</h3>
                            <div className="text-4xl font-extrabold text-blue-600 dark:text-cyan-400 mb-4">$49 <span className="text-sm font-normal text-gray-500">/mo</span></div>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 mb-8 space-y-2">
                                <li>Everything in Pro</li>
                                <li>24/7 Phone Support</li>
                                <li>Unlimited Storage</li>
                                <li>Multiple Authors</li>
                            </ul>
                            <button className="mt-auto px-6 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full font-bold hover:opacity-90 transition-opacity">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
