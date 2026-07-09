/**
 * Centralized Role Definitions
 * 
 * All role types should reference these constants.
 * No string literals for roles should exist in the codebase.
 */

export const ROLE_COMPANY = "company" as const;
export const ROLE_ADMIN = "admin" as const;
export const ROLE_SUPER_ADMIN = "super_admin" as const;

/**
 * Union type of all valid roles
 * Use this for type-safe role checking throughout the application
 */
export type UserRole = 
  | typeof ROLE_COMPANY
  | typeof ROLE_ADMIN
  | typeof ROLE_SUPER_ADMIN
  | null;

/**
 * All valid roles (excluding null)
 * Useful for role validation and iteration
 */
export const ALL_ROLES = [ROLE_COMPANY, ROLE_ADMIN, ROLE_SUPER_ADMIN] as const;

/**
 * Admin-level roles (admin and super_admin)
 * Useful for checking if user has any admin privileges
 */
export const ADMIN_ROLES = [ROLE_ADMIN, ROLE_SUPER_ADMIN] as const;

/**
 * Type-safe role validation
 * 
 * @param value - Value to validate as a role
 * @returns true if value is a valid role
 */
export function isValidRole(value: unknown): value is Exclude<UserRole, null> {
  return value === ROLE_COMPANY || value === ROLE_ADMIN || value === ROLE_SUPER_ADMIN;
}
