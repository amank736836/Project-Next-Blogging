import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// BUG-015 fix: if CLERK_SECRET_KEY is missing, skip the Clerk middleware
// entirely so public pages still work. Auth-dependent API routes will still
// fail with a clear 401 because auth() returns no userId.
const hasClerkSecret = !!process.env.CLERK_SECRET_KEY;

const clerkHandler = hasClerkSecret
    ? clerkMiddleware(async (auth, request) => {
          // Populate auth state for every request the matcher covers.
          // Individual route handlers call auth() to make access-control decisions.
      })
    : async (_auth, request) => {
          // No Clerk secret: pass through. API handlers will see userId=null
          // and return 401 on their own; public pages render normally.
          return NextResponse.next();
      };

export default clerkHandler;

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
