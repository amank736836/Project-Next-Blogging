import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Next.js 16 uses the `proxy` convention in place of `middleware`.
// When Clerk is not configured, let public pages continue to render; protected
// route handlers remain responsible for rejecting unauthenticated requests.
const hasClerkSecret = Boolean(process.env.CLERK_SECRET_KEY);

function withFramingHeaders(response) {
    // X-Frame-Options: DENY blocks ALL framing, including the portfolio
    // Live Preview (amank.co.in embedding blog.amank.co.in). Remove it and
    // rely on CSP frame-ancestors from next.config.mjs.
    response.headers.delete("X-Frame-Options");
    return response;
}

export const proxy = hasClerkSecret
    ? clerkMiddleware(async (_auth, _request) => {
          // Clerk initializes auth state for requests matched by this proxy.
          return withFramingHeaders(NextResponse.next());
      })
    : async () => withFramingHeaders(NextResponse.next());

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
