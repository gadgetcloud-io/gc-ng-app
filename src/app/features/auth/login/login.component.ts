import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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
  errorMessage = '';
  loading = false;
  showSignup = false;
  signupName = '';
  signupFirstName = '';
  signupLastName = '';
  signupMobile = '';

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

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          this.loading = false;
          // Navigate based on user role
          this.authService.navigateByRole(response.user.role);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.detail || 'Login failed. Please check your credentials.';
          console.error('Login error:', error);
        }
      });
  }

  signup(): void {
    if (!this.email || !this.password || !this.signupName) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return;
    }

    // Validate mobile if provided
    if (this.signupMobile && !this.isValidIndianMobile(this.signupMobile)) {
      this.errorMessage = 'Please enter a valid Indian mobile number (10 digits starting with 6, 7, 8, or 9)';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.signup({
      email: this.email,
      password: this.password,
      name: this.signupName,
      firstName: this.signupFirstName,
      lastName: this.signupLastName,
      mobile: this.signupMobile
    }).subscribe({
      next: (response) => {
        this.loading = false;
        // Navigate to customer dashboard (default role)
        this.authService.navigateByRole(response.user.role);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.detail || 'Signup failed. Please try again.';
        console.error('Signup error:', error);
      }
    });
  }

  private isValidIndianMobile(mobile: string): boolean {
    // Remove spaces, dashes, parentheses, plus signs
    const cleaned = mobile.replace(/[\s\-\(\)\+]/g, '');

    // Check if it starts with 91 and has 12 digits total
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      const number = cleaned.substring(2);
      return /^[6-9]\d{9}$/.test(number);
    }

    // Check if it's 10 digits starting with 6-9
    return /^[6-9]\d{9}$/.test(cleaned);
  }

  toggleSignup(): void {
    this.showSignup = !this.showSignup;
    this.errorMessage = '';
  }
}
