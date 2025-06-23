// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // await the check/redirect, but DO NOT return its result
    await auth.protect();  
  }
  // no return ⇒ NextResponse.next() is used
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
