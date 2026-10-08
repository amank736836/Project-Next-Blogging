// This file is superseded by src/middleware.js
// Next.js requires the middleware file to be named "middleware.js" at the
// project root or inside src/. This file is kept for reference only.
// See src/middleware.js for the active Clerk middleware.

import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
