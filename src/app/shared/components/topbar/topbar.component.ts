/**
 * Reusable Topbar Component
 *
 * Top navigation bar with hamburger menu, notifications, and user menu
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { getUserDisplayName } from '../../../core/models/user.model';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  @Input() isMobile = false;
  @Input() sidebarOpen = false;
  @Input() pageTitle = '';
  @Output() toggleSidebar = new EventEmitter<void>();

  showUserMenu = false;
  showNotifications = false;

  constructor(public authService: AuthService) {}

  get userDisplayName(): string {
    return getUserDisplayName(this.authService.currentUserValue);
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  closeMenus(): void {
    this.showUserMenu = false;
    this.showNotifications = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
