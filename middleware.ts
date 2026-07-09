import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for route protection
 * 
 * TODO: Replace mock authentication with real auth verification
 * This should check JWT tokens, sessions, or cookies from your auth provider
 */

function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/company/dashboard")
  );
}

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

function isCompanyRoute(pathname: string): boolean {
  return pathname.startsWith("/company/dashboard");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  if (isProtectedRoute(pathname)) {
    // TODO: Replace with real authentication verification
    // This would typically verify:
    // - JWT token in cookies or Authorization header
    // - Active session in database or session store
    // - Token expiration and validity

    // Mock authentication check (always returns false for now - no user authenticated)
    // In production, this should verify the actual session/token
    const userIsAuthenticated = false; // TODO: Replace with real auth check
    const userRole: string | null = null; // TODO: Replace with real role from token/session

    // If admin route and user is not admin
    if (isAdminRoute(pathname)) {
      if (!userIsAuthenticated || userRole !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // If company route and user is not company
    if (isCompanyRoute(pathname)) {
      if (!userIsAuthenticated || userRole !== "company") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // If route is protected but not authenticated
    if (!userIsAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.woff|.*\\.woff2).*)",
  ],
};
