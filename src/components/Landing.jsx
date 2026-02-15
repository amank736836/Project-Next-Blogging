'use client';
import React from 'react';
import { Container } from '@/components';
import Link from 'next/link';

export default function Landing() {
    return (
        <div className="w-full py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
            <Container>
                <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
                        Welcome to <span className="text-blue-600 dark:text-cyan-400">Frame & Phrase!</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mb-12 italic">
                        - Where prose finds its tranquil home. Every snapshot has a story, and we're here to tell it.
                    </p>
                    <Link 
                        href="/login"
                        className="px-10 py-4 bg-blue-600 dark:bg-cyan-400 text-white dark:text-gray-900 font-bold rounded-full text-lg shadow-xl hover:scale-105 transition-transform"
                    >
                        Get Started
                    </Link>
                </div>
            </Container>
        </div>
    );
}
