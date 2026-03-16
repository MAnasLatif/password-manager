import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { auth } from "./lib/auth";

/**
 * Auth routes — redirect to / if already authenticated
 */
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"];

/**
 * Protected route prefixes — redirect to /login if not authenticated
 */
const PROTECTED_PREFIXES = ["/", "/settings", "/collections", "/teams", "/shared"];

/**
 * Next.js 16 proxy function (replaces middleware from Next.js 15)
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Authenticated users visiting auth pages → redirect to app
  if (session && AUTH_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Unauthenticated users visiting protected routes → redirect to login
  if (!session && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Check if a pathname is a protected route
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/settings/:path*",
    "/collections/:path*",
    "/teams/:path*",
    "/shared/:path*",
  ],
};
