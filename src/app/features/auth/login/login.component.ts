import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  selectedRole: UserRole = UserRole.CUSTOMER;
  UserRole = UserRole;
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Using mock login for MVP
    // In production, this would call authService.login() with real credentials
    setTimeout(() => {
      this.authService.mockLogin(this.email, this.selectedRole);
      this.loading = false;
    }, 500);
  }

  getRoleDisplayName(role: UserRole): string {
    const names: Record<UserRole, string> = {
      [UserRole.CUSTOMER]: 'Customer Portal',
      [UserRole.PARTNER]: 'Partner Portal',
      [UserRole.SUPPORT]: 'Support Portal',
      [UserRole.ADMIN]: 'Admin Portal'
    };
    return names[role];
  }
}
