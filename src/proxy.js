import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Next.js 16 uses the `proxy` convention in place of `middleware`.
// When Clerk is not configured, let public pages continue to render; protected
// route handlers remain responsible for rejecting unauthenticated requests.
const hasClerkSecret = Boolean(process.env.CLERK_SECRET_KEY);

export const proxy = hasClerkSecret
    ? clerkMiddleware(async (_auth, _request) => {
          // Clerk initializes auth state for requests matched by this proxy.
      })
    : async () => NextResponse.next();

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
