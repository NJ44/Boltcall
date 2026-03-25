import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTeamStore } from '../stores/teamStore';
import { DEFAULT_ROLE_PERMISSIONS, ALL_PERMISSIONS, type PredefinedRole } from '../types/team';

/**
 * Hook to check if the current user has a specific permission.
 *
 * Usage:
 *   const { can, canAny, canAll, role } = usePermission();
 *   if (can('settings.members')) { ... }
 *   if (canAny(['leads.view', 'leads.manage'])) { ... }
 */
export function usePermission() {
  const { user } = useAuth();
  const { members, roles, rolePermissions } = useTeamStore();

  const currentMember = useMemo(() => {
    if (!user) return null;
    return members.find((m) => m.user_id === user.id || m.email === user.email);
  }, [user, members]);

  const currentRole = currentMember?.role || 'viewer';

  const permissionKeys = useMemo(() => {
    // Check if this is a predefined role with default permissions
    const predefined = DEFAULT_ROLE_PERMISSIONS[currentRole as PredefinedRole];
    if (predefined) {
      return new Set(
        predefined
          .map((pid) => ALL_PERMISSIONS.find((p) => p.id === pid)?.key)
          .filter(Boolean) as string[]
      );
    }

    // Custom role — lookup from store
    const role = roles.find((r) => r.slug === currentRole);
    if (role && rolePermissions[role.id]) {
      return new Set(
        rolePermissions[role.id]
          .map((pid) => ALL_PERMISSIONS.find((p) => p.id === pid)?.key)
          .filter(Boolean) as string[]
      );
    }

    return new Set<string>();
  }, [currentRole, roles, rolePermissions]);

  const can = (permissionKey: string): boolean => {
    // Owner always has all permissions
    if (currentRole === 'owner') return true;
    return permissionKeys.has(permissionKey);
  };

  const canAny = (keys: string[]): boolean => keys.some((k) => can(k));
  const canAll = (keys: string[]): boolean => keys.every((k) => can(k));

  const isOwner = currentRole === 'owner';
  const isAdmin = currentRole === 'admin' || isOwner;

  return {
    can,
    canAny,
    canAll,
    role: currentRole,
    isOwner,
    isAdmin,
    currentMember,
  };
}

/**
 * Lightweight guard component — renders children only if user has the permission.
 */
export function PermissionGate({
  permission,
  children,
  fallback = null,
}: {
  permission: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { can, canAny } = usePermission();
  const allowed = Array.isArray(permission) ? canAny(permission) : can(permission);
  return allowed ? <>{children}</> : <>{fallback}</>;
}
