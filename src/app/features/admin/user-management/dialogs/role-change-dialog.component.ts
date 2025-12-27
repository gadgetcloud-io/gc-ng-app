/**
 * Role Change Dialog Component
 *
 * Dialog for changing a user's role with reason
 */

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdminService } from '../../../../core/services/admin.service';
import { UserManagement } from '../../../../core/models/admin.model';
import { UserRole } from '../../../../core/models/user.model';

export interface RoleChangeDialogData {
  user: UserManagement;
}

@Component({
  selector: 'app-role-change-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Change User Role</h2>

    <mat-dialog-content>
      <div class="dialog-content">
        <div class="user-info">
          <p><strong>User:</strong> {{ user.firstName }} {{ user.lastName }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Current Role:</strong> <span class="current-role">{{ user.role }}</span></p>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>New Role</mat-label>
          <mat-radio-group [(ngModel)]="newRole" class="role-radio-group">
            <mat-radio-button *ngFor="let role of availableRoles" [value]="role">
              {{ role }}
            </mat-radio-button>
          </mat-radio-group>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Reason for Change (min 10 characters)</mat-label>
          <textarea matInput
                    [(ngModel)]="reason"
                    rows="3"
                    placeholder="Explain why this role change is being made..."
                    required
                    minlength="10"></textarea>
          <mat-hint align="end">{{ reason.length }}/100</mat-hint>
        </mat-form-field>

        <div class="warning-message" *ngIf="newRole && newRole !== user.role">
          <mat-icon>warning</mat-icon>
          <p>Changing the user's role will affect their permissions and access to the system.</p>
        </div>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()" [disabled]="loading">Cancel</button>
      <button mat-raised-button
              color="primary"
              (click)="confirm()"
              [disabled]="!isValid() || loading">
        <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
        <span *ngIf="!loading">Change Role</span>
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

      .current-role {
        display: inline-block;
        padding: 4px 12px;
        background-color: #667eea;
        color: white;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .role-radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 8px;
    }

    .warning-message {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      background-color: #fff3e0;
      border-left: 4px solid #f57c00;
      border-radius: 4px;
      margin-top: 16px;

      mat-icon {
        color: #f57c00;
        margin-top: 2px;
      }

      p {
        margin: 0;
        color: #e65100;
        font-size: 14px;
      }
    }

    .error-message {
      padding: 12px;
      background-color: #ffebee;
      border-left: 4px solid #c62828;
      border-radius: 4px;
      margin-top: 16px;
      color: #c62828;
    }

    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
  `]
})
export class RoleChangeDialogComponent {
  user: UserManagement;
  newRole: UserRole;
  reason = '';
  loading = false;
  error = '';

  availableRoles = Object.values(UserRole);

  constructor(
    public dialogRef: MatDialogRef<RoleChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoleChangeDialogData,
    private adminService: AdminService
  ) {
    this.user = data.user;
    this.newRole = data.user.role;
  }

  isValid(): boolean {
    return this.newRole !== this.user.role && this.reason.trim().length >= 10;
  }

  confirm(): void {
    if (!this.isValid()) return;

    this.loading = true;
    this.error = '';

    this.adminService.changeUserRole(this.user.id, {
      newRole: this.newRole,
      reason: this.reason.trim()
    }).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.detail || 'Failed to change user role';
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
