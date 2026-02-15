'use client';
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Loader from "@/components/loaders/Loader";

export default function Protected({ children, authentication = true }) {
    const router = useRouter();
    const [loader, setLoader] = useState(true);
    const { isSignedIn, isLoaded } = useAuth();

    useEffect(() => {
        if (!isLoaded) return;

        if (authentication && !isSignedIn) {
            router.push("/login");
        } else if (!authentication && isSignedIn) {
            router.push("/");
        }
        setLoader(false);
    }, [isSignedIn, isLoaded, router, authentication]);

    return loader ? <div className="flex h-screen items-center justify-center"><Loader /></div> : <>{children}</>;
}
