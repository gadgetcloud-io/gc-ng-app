/**
 * Navigation Configuration
 *
 * Defines sidebar navigation items for each user role
 */

import { UserRole } from '../../core/models/user.model';

export interface NavItem {
  label: string;
  icon: string; // SVG path data
  route: string;
  permission?: { resource: string; action: string };
  badge?: string; // Optional badge text
}

export interface RoleNavigation {
  role: UserRole;
  brandName: string;
  brandSubtitle: string;
  logoIcon: string; // SVG path data
  navItems: NavItem[];
}

// SVG icon paths
const ICONS = {
  dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  devices: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  repairs: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  tickets: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
  auditLogs: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  permissions: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  inventory: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  analytics: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  knowledgeBase: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  warranty: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
};

/**
 * Navigation configuration for all roles
 */
export const ROLE_NAVIGATION: RoleNavigation[] = [
  // Customer Navigation
  {
    role: UserRole.CUSTOMER,
    brandName: 'GadgetCloud',
    brandSubtitle: 'My Devices',
    logoIcon: ICONS.devices,
    navItems: [
      {
        label: 'Dashboard',
        icon: ICONS.dashboard,
        route: '/customer/dashboard'
      },
      {
        label: 'My Devices',
        icon: ICONS.devices,
        route: '/customer/devices'
      },
      {
        label: 'Repairs',
        icon: ICONS.repairs,
        route: '/customer/repairs'
      },
      {
        label: 'Warranty',
        icon: ICONS.warranty,
        route: '/customer/warranty'
      }
    ]
  },

  // Partner Navigation
  {
    role: UserRole.PARTNER,
    brandName: 'GadgetCloud',
    brandSubtitle: 'Partner Portal',
    logoIcon: ICONS.repairs,
    navItems: [
      {
        label: 'Dashboard',
        icon: ICONS.dashboard,
        route: '/partner/dashboard'
      },
      {
        label: 'Repair Queue',
        icon: ICONS.repairs,
        route: '/partner/repairs'
      },
      {
        label: 'Inventory',
        icon: ICONS.inventory,
        route: '/partner/inventory'
      },
      {
        label: 'Analytics',
        icon: ICONS.analytics,
        route: '/partner/analytics'
      }
    ]
  },

  // Support Navigation
  {
    role: UserRole.SUPPORT,
    brandName: 'GadgetCloud',
    brandSubtitle: 'Support Command',
    logoIcon: ICONS.tickets,
    navItems: [
      {
        label: 'Dashboard',
        icon: ICONS.dashboard,
        route: '/support/dashboard'
      },
      {
        label: 'Tickets',
        icon: ICONS.tickets,
        route: '/support/tickets'
      },
      {
        label: 'Knowledge Base',
        icon: ICONS.knowledgeBase,
        route: '/support/knowledge-base'
      },
      {
        label: 'Audit Logs',
        icon: ICONS.auditLogs,
        route: '/admin/audit-logs',
        permission: { resource: 'audit_logs', action: 'view' }
      }
    ]
  },

  // Admin Navigation
  {
    role: UserRole.ADMIN,
    brandName: 'GadgetCloud',
    brandSubtitle: 'Admin Panel',
    logoIcon: ICONS.lock,
    navItems: [
      {
        label: 'Dashboard',
        icon: ICONS.dashboard,
        route: '/admin/dashboard'
      },
      {
        label: 'User Management',
        icon: ICONS.users,
        route: '/admin/users',
        permission: { resource: 'users', action: 'view' }
      },
      {
        label: 'Audit Logs',
        icon: ICONS.auditLogs,
        route: '/admin/audit-logs',
        permission: { resource: 'audit_logs', action: 'view' }
      },
      {
        label: 'Permissions',
        icon: ICONS.permissions,
        route: '/admin/permissions',
        permission: { resource: 'permissions', action: 'manage' }
      }
    ]
  }
];

/**
 * Get navigation configuration for a specific role
 */
export function getNavigationForRole(role: UserRole): RoleNavigation | undefined {
  return ROLE_NAVIGATION.find(nav => nav.role === role);
}
