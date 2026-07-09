/**
 * useAuth Hook
 * 
 * Client-side hook for accessing authentication state
 * 
 * TODO: Replace with real authentication hook from your auth provider
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  getCurrentUser, 
  isAdmin, 
  isCompany, 
  isSuperAdmin,
  isAdminLevel,
  hasRole,
  type UserRole,
} from "@/app/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real authentication check
    const loadUser = async () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    loadUser();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    isAdmin: isAdmin(),
    isSuperAdmin: isSuperAdmin(),
    isAdminLevel: isAdminLevel(),
    isCompany: isCompany(),
    hasRole: (role: Exclude<UserRole, null>) => hasRole(role),
  };
}

/**
 * Hook to protect admin routes
 * 
 * Allows both admin and super_admin roles
 * 
 * Usage:
 * export default function AdminPage() {
 *   const { isAdminLevel, isLoading } = useProtectAdmin();
 *   if (isLoading) return <div>Loading...</div>;
 *   return <div>Admin content</div>;
 * }
 */
export function useProtectAdmin() {
  const { isAdminLevel, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdminLevel) {
      router.push("/access-denied");
    }
  }, [isLoading, isAdminLevel, router]);

  return { isAdminLevel, isLoading };
}

/**
 * Hook to protect super_admin only routes
 * 
 * Only allows super_admin role
 * 
 * Usage:
 * export default function SuperAdminPage() {
 *   const { isSuperAdmin, isLoading } = useProtectSuperAdmin();
 *   if (isLoading) return <div>Loading...</div>;
 *   return <div>Super Admin content</div>;
 * }
 */
export function useProtectSuperAdmin() {
  const { isSuperAdmin: userIsSuperAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !userIsSuperAdmin) {
      router.push("/access-denied");
    }
  }, [isLoading, userIsSuperAdmin, router]);

  return { isSuperAdmin: userIsSuperAdmin, isLoading };
}

/**
 * Hook to protect company routes
 * 
 * Usage:
 * export default function CompanyPage() {
 *   const { isCompany, isLoading } = useProtectCompany();
 *   if (isLoading) return <div>Loading...</div>;
 *   return <div>Company content</div>;
 * }
 */
export function useProtectCompany() {
  const { isCompany: userIsCompany, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !userIsCompany) {
      router.push("/access-denied");
    }
  }, [isLoading, userIsCompany, router]);

  return { isCompany: userIsCompany, isLoading };
}

/**
 * Hook to require authentication
 * 
 * Usage:
 * export default function ProtectedPage() {
 *   const { isAuthenticated, isLoading } = useRequireAuth();
 *   if (isLoading) return <div>Loading...</div>;
 *   return <div>Protected content</div>;
 * }
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return { isAuthenticated, isLoading };
}
