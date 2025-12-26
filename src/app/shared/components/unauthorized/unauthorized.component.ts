import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <h1>🚫 Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <button (click)="goBack()">Go Back</button>
        <button (click)="logout()">Logout</button>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f7fafc;
    }

    .unauthorized-card {
      background: white;
      padding: 48px;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 400px;

      h1 {
        font-size: 32px;
        color: #1a202c;
        margin: 0 0 16px 0;
      }

      p {
        color: #718096;
        margin: 0 0 32px 0;
      }

      button {
        margin: 0 8px;
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;

        &:first-of-type {
          background: #667eea;
          color: white;

          &:hover {
            background: #5568d3;
          }
        }

        &:last-of-type {
          background: #f7fafc;
          color: #2d3748;

          &:hover {
            background: #edf2f7;
          }
        }
      }
    }
  `]
})
export class UnauthorizedComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goBack(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout();
  }
}
