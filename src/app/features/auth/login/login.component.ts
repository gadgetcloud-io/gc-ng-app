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
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.signup({
      email: this.email,
      password: this.password,
      name: this.signupName
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

  toggleSignup(): void {
    this.showSignup = !this.showSignup;
    this.errorMessage = '';
  }
}
