/**
 * Admin Data Models
 *
 * Type definitions for admin-related features including
 * user management, audit logs, and permissions.
 */

import { User, UserRole } from './user.model';

// ============================================================================
// User Management Models
// ============================================================================

/**
 * Extended user data for admin user management
 */
export interface UserManagement extends User {
  status: UserStatus;
  previousRole?: UserRole;
  roleChangedAt?: string;
  roleChangedBy?: string;
  statusChangedAt?: string;
  statusChangedBy?: string;
  auditHistory?: AuditLog[];
}

/**
 * User status enum
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

/**
 * Request to change user role
 */
export interface ChangeRoleRequest {
  newRole: UserRole;
  reason: string;
}

/**
 * Request to deactivate user
 */
export interface DeactivateUserRequest {
  reason?: string;
}

/**
 * Request to reactivate user
 */
export interface ReactivateUserRequest {
  reason?: string;
}

/**
 * User list response with pagination
 */
export interface UserListResponse {
  users: UserManagement[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/**
 * User statistics for admin dashboard
 */
export interface UserStatistics {
  total: number;
  byRole: {
    customer: number;
    partner: number;
    support: number;
    admin: number;
  };
  byStatus: {
    active: number;
    inactive: number;
    suspended: number;
  };
  recentSignups: number;
}

// ============================================================================
// Audit Log Models
// ============================================================================

/**
 * Audit log entry
 */
export interface AuditLog {
  id: string;
  eventType: AuditEventType;
  actorId: string;
  actorEmail: string;
  targetId?: string;
  targetEmail?: string;
  changes?: AuditChanges;
  reason?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

/**
 * Audit event types
 */
export enum AuditEventType {
  USER_ROLE_CHANGED = 'user.role_changed',
  USER_DEACTIVATED = 'user.deactivated',
  USER_REACTIVATED = 'user.reactivated',
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  PASSWORD_CHANGED = 'user.password_changed',
  LOGIN_SUCCESS = 'auth.login_success',
  LOGIN_FAILED = 'auth.login_failed',
  PERMISSION_DENIED = 'auth.permission_denied'
}

/**
 * Changes tracked in audit log
 */
export interface AuditChanges {
  [field: string]: {
    old: any;
    new: any;
  };
}

/**
 * Audit log statistics
 */
export interface AuditStatistics {
  roleChanges: number;
  deactivations: number;
  reactivations: number;
  permissionDenials: number;
  total: number;
}

// ============================================================================
// Permission Models
// ============================================================================

/**
 * Permission definition
 */
export interface Permission {
  resource: string;
  actions: string[];
  scope?: string;
}

/**
 * Role permissions
 */
export interface RolePermissions {
  role: UserRole;
  description: string;
  resources: {
    [resource: string]: Permission;
  };
}

/**
 * Permission check result
 */
export interface PermissionCheck {
  granted: boolean;
  reason?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get display text for user status
 */
export function getUserStatusDisplay(status: UserStatus): string {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'Active';
    case UserStatus.INACTIVE:
      return 'Inactive';
    case UserStatus.SUSPENDED:
      return 'Suspended';
    default:
      return 'Unknown';
  }
}

/**
 * Get CSS class for user status badge
 */
export function getUserStatusClass(status: UserStatus): string {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'status-active';
    case UserStatus.INACTIVE:
      return 'status-inactive';
    case UserStatus.SUSPENDED:
      return 'status-suspended';
    default:
      return 'status-unknown';
  }
}

/**
 * Get display text for audit event type
 */
export function getAuditEventDisplay(eventType: AuditEventType): string {
  const displayMap: Record<AuditEventType, string> = {
    [AuditEventType.USER_ROLE_CHANGED]: 'Role Changed',
    [AuditEventType.USER_DEACTIVATED]: 'User Deactivated',
    [AuditEventType.USER_REACTIVATED]: 'User Reactivated',
    [AuditEventType.USER_CREATED]: 'User Created',
    [AuditEventType.USER_UPDATED]: 'User Updated',
    [AuditEventType.USER_DELETED]: 'User Deleted',
    [AuditEventType.PASSWORD_CHANGED]: 'Password Changed',
    [AuditEventType.LOGIN_SUCCESS]: 'Login Success',
    [AuditEventType.LOGIN_FAILED]: 'Login Failed',
    [AuditEventType.PERMISSION_DENIED]: 'Permission Denied'
  };

  return displayMap[eventType] || eventType;
}

/**
 * Format audit changes for display
 */
export function formatAuditChanges(changes: AuditChanges | undefined): string {
  if (!changes) return '';

  return Object.entries(changes)
    .map(([field, value]) => `${field}: ${value.old} → ${value.new}`)
    .join(', ');
}
