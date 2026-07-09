/**
 * Auth Helper Functions
 * 
 * TODO: Replace with real authentication system (NextAuth.js, Clerk, Supabase, etc.)
 * 
 * This is a temporary placeholder to support route protection and role-based access.
 * In production, connect this to your actual authentication provider.
 */

import { 
  UserRole,
  ROLE_COMPANY,
  ROLE_ADMIN,
  ROLE_SUPER_ADMIN,
} from "@/app/lib/constants/roles";

export type { UserRole } from "@/app/lib/constants/roles";
export {
  ROLE_COMPANY,
  ROLE_ADMIN,
  ROLE_SUPER_ADMIN,
  ADMIN_ROLES,
} from "@/app/lib/constants/roles";

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
  
  // return { id: "admin-1", email: "admin@example.com", role: ROLE_ADMIN, name: "Admin User" };
  // return { id: "super-admin-1", email: "super@example.com", role: ROLE_SUPER_ADMIN, name: "Super Admin User" };
  // return { id: "company-1", email: "company@example.com", role: ROLE_COMPANY, name: "Company User" };
  
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
  return user?.role === ROLE_ADMIN;
}

/**
 * Check if user has company role
 * 
 * @returns true if user is authenticated and has company role
 */
export function isCompany(): boolean {
  const user = getCurrentUser();
  return user?.role === ROLE_COMPANY;
}

/**
 * Check if user has super_admin role
 * 
 * @returns true if user is authenticated and has super_admin role
 */
export function isSuperAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === ROLE_SUPER_ADMIN;
}

/**
 * Check if user has admin-level privileges (admin or super_admin)
 * 
 * @returns true if user is authenticated and has admin-level role
 */
export function isAdminLevel(): boolean {
  const user = getCurrentUser();
  if (!user || !user.role) return false;
  return user.role === ROLE_ADMIN || user.role === ROLE_SUPER_ADMIN;
}

/**
 * Generic role checker
 * 
 * @param requiredRole - The role to check for
 * @returns true if user has the required role
 */
export function hasRole(requiredRole: Exclude<UserRole, null>): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (requiredRole === ROLE_ADMIN || requiredRole === ROLE_SUPER_ADMIN) {
    // For admin-level roles, check if user has admin-level privileges
    return user.role === ROLE_ADMIN || user.role === ROLE_SUPER_ADMIN;
  }
  
  return user.role === requiredRole;
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
  
  // Admin routes - admin and super_admin can access
  if (isAdminRoute(pathname)) {
    return user.role === ROLE_ADMIN || user.role === ROLE_SUPER_ADMIN;
  }
  
  // Company routes - only companies
  if (isCompanyRoute(pathname)) {
    return user.role === ROLE_COMPANY;
  }
  
  // Default deny for unknown protected routes
  return false;
}
