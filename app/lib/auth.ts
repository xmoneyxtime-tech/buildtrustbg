/**
 * Auth Helper Functions
 * 
 * TODO: Replace with real authentication system (NextAuth.js, Clerk, Supabase, etc.)
 * 
 * This is a temporary placeholder to support route protection and role-based access.
 * In production, connect this to your actual authentication provider.
 */

export type UserRole = "admin" | "company" | "user" | null;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

/**
 * Get current user from session/cookies
 * 
 * TODO: Replace with real session/token verification
 * This should check cookies, JWT tokens, or session storage
 * 
 * @returns Current user or null if not authenticated
 */
export function getCurrentUser(): User | null {
  // TODO: Implement real authentication
  // For now, return null (user not authenticated)
  // In production, this should verify session/JWT and return the authenticated user
  
  // Mock implementation for testing:
  // Uncomment one of the below to test different roles during development
  
  // return { id: "admin-1", email: "admin@example.com", role: "admin", name: "Admin User" };
  // return { id: "company-1", email: "company@example.com", role: "company", name: "Company User" };
  // return { id: "user-1", email: "user@example.com", role: "user", name: "Regular User" };
  
  return null;
}

/**
 * Check if user is authenticated
 * 
 * @returns true if user is logged in
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/**
 * Check if user has admin role
 * 
 * @returns true if user is authenticated and has admin role
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "admin";
}

/**
 * Check if user has company role
 * 
 * @returns true if user is authenticated and has company role
 */
export function isCompany(): boolean {
  const user = getCurrentUser();
  return user?.role === "company";
}

/**
 * Check if user is authenticated with any role
 * 
 * @returns true if user is logged in
 */
export function isUser(): boolean {
  return isAuthenticated();
}

/**
 * Check if path requires authentication
 * 
 * @param pathname - The path to check
 * @returns true if the path requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  // Admin routes
  if (pathname.startsWith("/admin")) {
    return true;
  }
  
  // Company dashboard routes
  if (pathname.startsWith("/company/dashboard")) {
    return true;
  }
  
  return false;
}

/**
 * Check if path is admin-only
 * 
 * @param pathname - The path to check
 * @returns true if path requires admin role
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

/**
 * Check if path is company-only
 * 
 * @param pathname - The path to check
 * @returns true if path requires company role
 */
export function isCompanyRoute(pathname: string): boolean {
  return pathname.startsWith("/company/dashboard");
}

/**
 * Check if user can access a route
 * 
 * @param pathname - The path to check
 * @param user - The user to check access for
 * @returns true if user can access the route
 */
export function canAccessRoute(pathname: string, user: User | null): boolean {
  // If route is not protected, everyone can access
  if (!isProtectedRoute(pathname)) {
    return true;
  }
  
  // If route is protected but user is not authenticated, deny
  if (!user) {
    return false;
  }
  
  // Admin routes - only admins
  if (isAdminRoute(pathname)) {
    return user.role === "admin";
  }
  
  // Company routes - only companies
  if (isCompanyRoute(pathname)) {
    return user.role === "company";
  }
  
  // Default deny for unknown protected routes
  return false;
}
