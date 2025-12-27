/**
 * User Deactivate Dialog Component
 *
 * Dialog for deactivating or reactivating a user account
 */

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdminService } from '../../../../core/services/admin.service';
import { UserManagement } from '../../../../core/models/admin.model';

export interface UserDeactivateDialogData {
  user: UserManagement;
  action: 'deactivate' | 'reactivate';
}

@Component({
  selector: 'app-user-deactivate-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ getTitle() }}</h2>

    <mat-dialog-content>
      <div class="dialog-content">
        <div class="user-info">
          <p><strong>User:</strong> {{ user.firstName }} {{ user.lastName }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
        </div>

        <div [class]="getWarningClass()">
          <mat-icon>{{ getWarningIcon() }}</mat-icon>
          <div>
            <p><strong>{{ getWarningTitle() }}</strong></p>
            <p>{{ getWarningMessage() }}</p>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Reason (optional)</mat-label>
          <textarea matInput
                    [(ngModel)]="reason"
                    rows="3"
                    [placeholder]="getReasonPlaceholder()"></textarea>
        </mat-form-field>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()" [disabled]="loading">Cancel</button>
      <button mat-raised-button
              [color]="action === 'deactivate' ? 'warn' : 'primary'"
              (click)="confirm()"
              [disabled]="loading">
        <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
        <span *ngIf="!loading">{{ getConfirmButtonText() }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
      min-width: 400px;
      padding: 8px 0;
    }

    .user-info {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;

      p {
        margin: 8px 0;

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .warning-deactivate, .warning-reactivate {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;

      mat-icon {
        margin-top: 2px;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      p {
        margin: 0 0 8px 0;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .warning-deactivate {
      background-color: #ffebee;
      border-left: 4px solid #c62828;

      mat-icon {
        color: #c62828;
      }

      strong {
        color: #c62828;
      }

      p {
        color: #b71c1c;
      }
    }

    .warning-reactivate {
      background-color: #e8f5e9;
      border-left: 4px solid #2e7d32;

      mat-icon {
        color: #2e7d32;
      }

      strong {
        color: #2e7d32;
      }

      p {
        color: #1b5e20;
      }
    }

    .error-message {
      padding: 12px;
      background-color: #ffebee;
      border-left: 4px solid #c62828;
      border-radius: 4px;
      color: #c62828;
    }

    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
  `]
})
export class UserDeactivateDialogComponent {
  user: UserManagement;
  action: 'deactivate' | 'reactivate';
  reason = '';
  loading = false;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<UserDeactivateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDeactivateDialogData,
    private adminService: AdminService
  ) {
    this.user = data.user;
    this.action = data.action;
  }

  getTitle(): string {
    return this.action === 'deactivate' ? 'Deactivate User' : 'Reactivate User';
  }

  getWarningClass(): string {
    return this.action === 'deactivate' ? 'warning-deactivate' : 'warning-reactivate';
  }

  getWarningIcon(): string {
    return this.action === 'deactivate' ? 'block' : 'check_circle';
  }

  getWarningTitle(): string {
    return this.action === 'deactivate' ? 'Warning: User will be deactivated' : 'Reactivate this user account';
  }

  getWarningMessage(): string {
    if (this.action === 'deactivate') {
      return 'This user will no longer be able to log in or access the system. Their data will be preserved.';
    } else {
      return 'This user will regain access to the system with their previous role and permissions.';
    }
  }

  getReasonPlaceholder(): string {
    if (this.action === 'deactivate') {
      return 'Why is this user being deactivated?';
    } else {
      return 'Why is this user being reactivated?';
    }
  }

  getConfirmButtonText(): string {
    return this.action === 'deactivate' ? 'Deactivate User' : 'Reactivate User';
  }

  confirm(): void {
    this.loading = true;
    this.error = '';

    const request = this.reason.trim() ? { reason: this.reason.trim() } : {};
    const serviceCall = this.action === 'deactivate'
      ? this.adminService.deactivateUser(this.user.id, request)
      : this.adminService.reactivateUser(this.user.id, request);

    serviceCall.subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.detail || `Failed to ${this.action} user`;
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
