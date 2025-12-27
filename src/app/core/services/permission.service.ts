/**
 * Permission Service
 *
 * Manages role-based permissions for the application.
 * Loads permissions from the backend and provides methods
 * to check if the current user has specific permissions.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { RolePermissions } from '../models/admin.model';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private readonly API_URL = `${environment.apiUrl}/admin`;

  // Permissions cache
  private permissionsSubject = new BehaviorSubject<RolePermissions | null>(null);
  public permissions$ = this.permissionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Load permissions for a specific role from the backend
   */
  loadPermissions(role: UserRole): Observable<RolePermissions> {
    return this.http.get<RolePermissions>(`${this.API_URL}/permissions/${role}`).pipe(
      tap(permissions => {
        this.permissionsSubject.next(permissions);
      })
    );
  }

  /**
   * Set permissions directly (used after login)
   */
  setPermissions(permissions: RolePermissions): void {
    this.permissionsSubject.next(permissions);
  }

  /**
   * Get current permissions
   */
  getPermissions(): RolePermissions | null {
    return this.permissionsSubject.value;
  }

  /**
   * Clear permissions (on logout)
   */
  clearPermissions(): void {
    this.permissionsSubject.next(null);
  }

  /**
   * Check if the current user has permission to perform an action on a resource
   *
   * @param resource Resource name (e.g., 'users', 'items', 'audit_logs')
   * @param action Action name (e.g., 'view', 'create', 'edit', 'delete')
   * @returns True if user has permission, false otherwise
   */
  hasPermission(resource: string, action: string): boolean {
    const permissions = this.getPermissions();
    if (!permissions) return false;

    const resourcePerms = permissions.resources[resource];
    if (!resourcePerms) return false;

    // Check if action is allowed or if wildcard '*' is present
    return resourcePerms.actions.includes(action) || resourcePerms.actions.includes('*');
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(checks: Array<{ resource: string; action: string }>): boolean {
    return checks.some(check => this.hasPermission(check.resource, check.action));
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(checks: Array<{ resource: string; action: string }>): boolean {
    return checks.every(check => this.hasPermission(check.resource, check.action));
  }

  // ============================================================================
  // Convenience Methods for Common Permission Checks
  // ============================================================================

  /**
   * Can view users list
   */
  canViewUsers(): boolean {
    return this.hasPermission('users', 'view');
  }

  /**
   * Can create new users
   */
  canCreateUsers(): boolean {
    return this.hasPermission('users', 'create');
  }

  /**
   * Can edit user details
   */
  canEditUsers(): boolean {
    return this.hasPermission('users', 'edit');
  }

  /**
   * Can delete users
   */
  canDeleteUsers(): boolean {
    return this.hasPermission('users', 'delete');
  }

  /**
   * Can change user roles
   */
  canChangeRoles(): boolean {
    return this.hasPermission('users', 'change_role');
  }

  /**
   * Can deactivate users
   */
  canDeactivateUsers(): boolean {
    return this.hasPermission('users', 'deactivate');
  }

  /**
   * Can view audit logs
   */
  canViewAuditLogs(): boolean {
    return this.hasPermission('audit_logs', 'view');
  }

  /**
   * Can export audit logs
   */
  canExportAuditLogs(): boolean {
    return this.hasPermission('audit_logs', 'export');
  }

  /**
   * Can view permissions
   */
  canViewPermissions(): boolean {
    return this.hasPermission('permissions', 'view');
  }

  /**
   * Can edit permissions
   */
  canEditPermissions(): boolean {
    return this.hasPermission('permissions', 'edit');
  }

  /**
   * Should show admin panel
   * Returns true if user has any admin permissions
   */
  showAdminPanel(): boolean {
    return this.canViewUsers() || this.canViewAuditLogs();
  }

  /**
   * Get current user's role from permissions
   */
  getCurrentRole(): UserRole | null {
    const permissions = this.getPermissions();
    return permissions?.role || null;
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return this.getCurrentRole() === UserRole.ADMIN;
  }

  /**
   * Check if current user is support
   */
  isSupport(): boolean {
    return this.getCurrentRole() === UserRole.SUPPORT;
  }

  /**
   * Check if current user is partner
   */
  isPartner(): boolean {
    return this.getCurrentRole() === UserRole.PARTNER;
  }

  /**
   * Check if current user is customer
   */
  isCustomer(): boolean {
    return this.getCurrentRole() === UserRole.CUSTOMER;
  }
}
