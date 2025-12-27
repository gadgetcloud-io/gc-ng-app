/**
 * Permission Management Component
 *
 * Allows admins to view and manage role-based permissions
 * Displays permissions in a card-based layout with toggle switches
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PermissionService } from '../../../core/services/permission.service';
import { UserRole } from '../../../core/models/user.model';

interface ResourcePermission {
  resource: string;
  displayName: string;
  actions: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}

interface RolePermissions {
  role: UserRole;
  displayName: string;
  description: string;
  color: string;
  permissions: ResourcePermission[];
}

@Component({
  selector: 'app-permission-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permission-management.component.html',
  styleUrls: ['./permission-management.component.scss']
})
export class PermissionManagementComponent implements OnInit {
  loading = false;
  selectedRole: UserRole = UserRole.CUSTOMER;
  hasChanges = false;

  roles: RolePermissions[] = [
    {
      role: UserRole.CUSTOMER,
      displayName: 'Customer',
      description: 'End users who manage their own devices and repairs',
      color: '#3b82f6',
      permissions: []
    },
    {
      role: UserRole.PARTNER,
      displayName: 'Partner',
      description: 'Repair service providers who handle repair requests',
      color: '#8b5cf6',
      permissions: []
    },
    {
      role: UserRole.SUPPORT,
      displayName: 'Support',
      description: 'Customer support team members',
      color: '#10b981',
      permissions: []
    },
    {
      role: UserRole.ADMIN,
      displayName: 'Administrator',
      description: 'Full system access with user management capabilities',
      color: '#f59e0b',
      permissions: []
    }
  ];

  resources = [
    { name: 'users', displayName: 'Users', icon: 'people' },
    { name: 'devices', displayName: 'Devices', icon: 'devices' },
    { name: 'repairs', displayName: 'Repairs', icon: 'build' },
    { name: 'audit_logs', displayName: 'Audit Logs', icon: 'history' },
    { name: 'settings', displayName: 'Settings', icon: 'settings' }
  ];

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.loading = true;

    // Initialize permissions for each role
    this.roles.forEach(role => {
      role.permissions = this.resources.map(resource => ({
        resource: resource.name,
        displayName: resource.displayName,
        actions: this.getDefaultPermissions(role.role, resource.name)
      }));
    });

    this.loading = false;
  }

  getDefaultPermissions(role: UserRole, resource: string): { view: boolean; create: boolean; update: boolean; delete: boolean } {
    // Define default permissions based on role and resource
    const defaults: Record<string, any> = {
      [UserRole.ADMIN]: {
        users: { view: true, create: true, update: true, delete: true },
        devices: { view: true, create: true, update: true, delete: true },
        repairs: { view: true, create: true, update: true, delete: true },
        audit_logs: { view: true, create: false, update: false, delete: false },
        settings: { view: true, create: true, update: true, delete: true }
      },
      [UserRole.SUPPORT]: {
        users: { view: true, create: false, update: false, delete: false },
        devices: { view: true, create: false, update: true, delete: false },
        repairs: { view: true, create: true, update: true, delete: false },
        audit_logs: { view: true, create: false, update: false, delete: false },
        settings: { view: true, create: false, update: false, delete: false }
      },
      [UserRole.PARTNER]: {
        users: { view: false, create: false, update: false, delete: false },
        devices: { view: true, create: false, update: true, delete: false },
        repairs: { view: true, create: false, update: true, delete: false },
        audit_logs: { view: false, create: false, update: false, delete: false },
        settings: { view: true, create: false, update: false, delete: false }
      },
      [UserRole.CUSTOMER]: {
        users: { view: false, create: false, update: false, delete: false },
        devices: { view: true, create: true, update: true, delete: true },
        repairs: { view: true, create: true, update: false, delete: false },
        audit_logs: { view: false, create: false, update: false, delete: false },
        settings: { view: true, create: false, update: true, delete: false }
      }
    };

    return defaults[role]?.[resource] || { view: false, create: false, update: false, delete: false };
  }

  get selectedRoleData(): RolePermissions | undefined {
    return this.roles.find(r => r.role === this.selectedRole);
  }

  selectRole(role: UserRole): void {
    if (this.hasChanges) {
      if (!confirm('You have unsaved changes. Do you want to discard them?')) {
        return;
      }
    }
    this.selectedRole = role;
    this.hasChanges = false;
  }

  onPermissionChange(): void {
    this.hasChanges = true;
  }

  savePermissions(): void {
    this.loading = true;

    // In a real app, save to backend
    setTimeout(() => {
      console.log('Saving permissions for role:', this.selectedRole);
      console.log('Permissions:', this.selectedRoleData?.permissions);

      this.loading = false;
      this.hasChanges = false;

      // Show success message
      alert('Permissions saved successfully!');
    }, 1000);
  }

  resetPermissions(): void {
    if (confirm('Are you sure you want to reset permissions to defaults?')) {
      this.loadPermissions();
      this.hasChanges = false;
    }
  }

  getActionIcon(action: string): string {
    const icons: Record<string, string> = {
      view: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      create: 'M12 4v16m8-8H4',
      update: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      delete: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
    };
    return icons[action] || '';
  }
}
