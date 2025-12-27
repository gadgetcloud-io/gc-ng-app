/**
 * Reusable Sidebar Component
 *
 * Holographic sidebar with role-based navigation
 * Used across all role dashboards (customer, partner, support, admin)
 */

import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { PermissionService } from '../../../core/services/permission.service';
import { getUserDisplayName, UserRole } from '../../../core/models/user.model';
import { NavItem, RoleNavigation, getNavigationForRole } from '../../config/navigation.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Input() isMobile = false;
  @Output() toggle = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  navigation: RoleNavigation | undefined;
  filteredNavItems: NavItem[] = [];

  constructor(
    public authService: AuthService,
    public permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.loadNavigation();
  }

  loadNavigation(): void {
    const user = this.authService.currentUserValue;
    if (user?.role) {
      this.navigation = getNavigationForRole(user.role);
      this.filterNavItems();
    }
  }

  filterNavItems(): void {
    if (!this.navigation) {
      this.filteredNavItems = [];
      return;
    }

    const user = this.authService.currentUserValue;

    // For admin users, show all nav items (admins have full access)
    // For support and other roles, filter based on permissions
    if (user?.role === UserRole.ADMIN) {
      this.filteredNavItems = this.navigation.navItems;
    } else if (user?.role === UserRole.SUPPORT) {
      // Support users can see audit logs but filter others by permission
      this.filteredNavItems = this.navigation.navItems.filter(item => {
        // Always show items without permission requirements
        if (!item.permission) return true;

        // Support can always see audit logs
        if (item.permission.resource === 'audit_logs') return true;

        // Check other permissions
        return this.permissionService.hasPermission(
          item.permission.resource,
          item.permission.action
        );
      });
    } else {
      // For customer, partner roles: filter based on permissions
      this.filteredNavItems = this.navigation.navItems.filter(item => {
        if (!item.permission) return true;
        return this.permissionService.hasPermission(
          item.permission.resource,
          item.permission.action
        );
      });
    }
  }

  get userDisplayName(): string {
    return getUserDisplayName(this.authService.currentUserValue);
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile) {
      this.close.emit();
    }
  }

  onToggle(): void {
    this.toggle.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}
