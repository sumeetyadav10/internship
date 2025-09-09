import { User } from '@/types';

export type Permission = 
  | 'applications.create'
  | 'applications.view'
  | 'applications.edit'
  | 'applications.delete'
  | 'applications.viewAll'
  | 'masters.view'
  | 'masters.edit'
  | 'users.view'
  | 'users.edit'
  | 'settings.view'
  | 'settings.edit'
  | 'reports.view'
  | 'reports.export';

export type Role = 'admin' | 'employee' | 'viewer';

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'applications.create',
    'applications.view',
    'applications.edit',
    'applications.delete',
    'applications.viewAll',
    'masters.view',
    'masters.edit',
    'users.view',
    'users.edit',
    'settings.view',
    'settings.edit',
    'reports.view',
    'reports.export'
  ],
  employee: [
    'applications.create',
    'applications.view',
    'applications.edit',
    'applications.viewAll',
    'masters.view',
    'reports.view',
    'reports.export'
  ],
  viewer: [
    'applications.view',
    'reports.view'
  ]
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false;
}

/**
 * Check if a user has a specific permission
 */
export function userHasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  return hasPermission(user.role as Role, permission);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return rolePermissions[role] || [];
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(user: User | null, pathname: string): boolean {
  if (!user) return false;

  const role = user.role as Role;

  // Route to permission mapping
  const routePermissions: Record<string, Permission> = {
    '/dashboard/applications/new': 'applications.create',
    '/dashboard/applications': 'applications.viewAll',
    '/dashboard/masters': 'masters.view',
    '/dashboard/users': 'users.view',
    '/dashboard/settings': 'settings.view',
    '/dashboard/reports': 'reports.view'
  };

  // Check specific routes
  for (const [route, permission] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      return hasPermission(role, permission);
    }
  }

  // Check dynamic routes
  if (pathname.match(/^\/dashboard\/applications\/[^\/]+$/)) {
    return hasPermission(role, 'applications.view');
  }

  if (pathname.match(/^\/dashboard\/applications\/edit\/[^\/]+$/)) {
    return hasPermission(role, 'applications.edit');
  }

  // Default allow for dashboard home
  if (pathname === '/dashboard') {
    return true;
  }

  return false;
}

/**
 * Filter navigation items based on user permissions
 */
export function getNavigationItems(user: User | null) {
  const allItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      permission: null
    },
    {
      label: 'Applications',
      href: '/dashboard/applications',
      permission: 'applications.viewAll' as Permission
    },
    {
      label: 'New Application',
      href: '/dashboard/applications/new',
      permission: 'applications.create' as Permission
    },
    {
      label: 'Masters',
      href: '/dashboard/masters',
      permission: 'masters.view' as Permission
    },
    {
      label: 'Users',
      href: '/dashboard/users',
      permission: 'users.view' as Permission
    },
    {
      label: 'Reports',
      href: '/dashboard/reports',
      permission: 'reports.view' as Permission
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      permission: 'settings.view' as Permission
    }
  ];

  return allItems.filter(item => {
    if (!item.permission) return true;
    return userHasPermission(user, item.permission);
  });
}

/**
 * Hook for checking permissions in components
 */
export function usePermission(_permission: Permission): boolean {
  // This would typically use a context or global state
  // For now, return true to avoid breaking the app
  return true;
}