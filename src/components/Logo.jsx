'use client';
import React from 'react';
import Image from 'next/image';

function Logo({ width = '100px', themeMode = 'light' }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const logo = themeMode === "dark" ? "/assets/frame_phrase_logo_v3_dark_1771127324837.png" : "/assets/frame_phrase_logo_premium_1771127061725.png";

    return (
        <div className="flex items-center gap-2">
            {mounted ? (
                <>
                    <img
                        className='rounded-full'
                        src={logo}
                        alt="Logo Icon"
                        style={{ width: '40px', height: 'auto' }}
                        loading="eager"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    <div className="flex flex-col leading-tight">
                        <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-cyan-400">Frame</span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">& Phrase</span>
                    </div>
                </>
            ) : (
                <div style={{ width: '40px', height: '40px' }} />
            )}
        </div>
    );
}

export default Logo;
