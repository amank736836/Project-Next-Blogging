'use client';
import React, { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Loader from "@/components/loaders/Loader";

/**
 * Gate for writer-only routes. State is derived from Clerk rather than copied
 * into local state, so there is exactly one render per auth change. The
 * waiting view is branded instead of a bare spinner.
 */
export default function Protected({ children, authentication = true }) {
    const router = useRouter();
    const { isSignedIn, isLoaded } = useAuth();

    // True while this visitor should not be looking at the page at all.
    const blocked = !isLoaded || (authentication ? !isSignedIn : Boolean(isSignedIn));

    useEffect(() => {
        if (!isLoaded) return;
        if (authentication && !isSignedIn) router.push("/login");
        else if (!authentication && isSignedIn) router.push("/");
    }, [isSignedIn, isLoaded, router, authentication]);

    if (blocked) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5">
                <span className="relative grid h-16 w-16 place-items-center">
                    <span
                        aria-hidden
                        className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-line"
                    />
                    <Loader size={30} className="text-accent" label="Checking your session" />
                </span>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-faint">
                    opening your shelf
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
