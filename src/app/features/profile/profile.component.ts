/**
 * My Profile Component
 *
 * User profile page with editable information
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { getUserDisplayName, User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  editMode = false;
  loading = false;

  // Edit form data
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: ''
  };

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    if (this.user) {
      this.formData = {
        firstName: this.user.firstName || '',
        lastName: this.user.lastName || '',
        email: this.user.email || '',
        mobile: this.user.mobile || ''
      };
    }
  }

  get userDisplayName(): string {
    return getUserDisplayName(this.user);
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;

    // Reset form data if canceling
    if (!this.editMode && this.user) {
      this.formData = {
        firstName: this.user.firstName || '',
        lastName: this.user.lastName || '',
        email: this.user.email || '',
        mobile: this.user.mobile || ''
      };
    }
  }

  saveProfile(): void {
    this.loading = true;

    // TODO: Call API to update profile
    setTimeout(() => {
      console.log('Saving profile:', this.formData);
      this.loading = false;
      this.editMode = false;

      // Update local user data (in real app, this would come from API response)
      if (this.user) {
        this.user.firstName = this.formData.firstName;
        this.user.lastName = this.formData.lastName;
        this.user.mobile = this.formData.mobile;
      }
    }, 1000);
  }

  getInitials(): string {
    if (!this.user?.firstName) return '?';
    const firstInitial = this.user.firstName.charAt(0).toUpperCase();
    const lastInitial = this.user.lastName ? this.user.lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  }

  getRoleBadgeColor(): string {
    const colors: Record<string, string> = {
      'admin': 'linear-gradient(135deg, #ef4444, #dc2626)',
      'support': 'linear-gradient(135deg, #3b82f6, #2563eb)',
      'partner': 'linear-gradient(135deg, #f59e0b, #d97706)',
      'customer': 'linear-gradient(135deg, #10b981, #059669)'
    };
    return colors[this.user?.role || 'customer'] || colors['customer'];
  }
}
