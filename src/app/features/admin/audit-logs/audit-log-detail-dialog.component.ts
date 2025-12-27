/**
 * Audit Log Detail Dialog Component
 *
 * Modal dialog displaying complete audit log entry
 * with structured "case file" aesthetic
 */

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { AuditLog, AuditEventType } from '../../../core/models/admin.model';

@Component({
  selector: 'app-audit-log-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="dialog-container">
      <!-- Header -->
      <div class="dialog-header" [attr.data-severity]="getEventSeverity(log.eventType)">
        <div class="header-content">
          <div class="event-icon">
            <mat-icon>{{ getEventIcon(log.eventType) }}</mat-icon>
          </div>
          <div class="header-text">
            <mat-chip class="event-badge" [attr.data-severity]="getEventSeverity(log.eventType)">
              {{ getEventTypeDisplay(log.eventType) }}
            </mat-chip>
            <h2>Audit Log Details</h2>
          </div>
        </div>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="dialog-content">
        <!-- Timestamp Section -->
        <div class="info-section">
          <div class="section-header">
            <mat-icon>schedule</mat-icon>
            <h3>Timestamp</h3>
          </div>
          <div class="timestamp-display">
            <div class="timestamp-row">
              <span class="label">Date:</span>
              <span class="value">{{ formatTimestamp(log.timestamp).date }}</span>
            </div>
            <div class="timestamp-row">
              <span class="label">Time:</span>
              <span class="value">{{ formatTimestamp(log.timestamp).time }}</span>
            </div>
            <div class="timestamp-row">
              <span class="label">ISO:</span>
              <span class="value mono">{{ log.timestamp }}</span>
            </div>
          </div>
        </div>

        <!-- Actor Section -->
        <div class="info-section">
          <div class="section-header">
            <mat-icon>person</mat-icon>
            <h3>Actor</h3>
            <span class="section-subtitle">Who performed this action</span>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">ID:</span>
              <span class="value mono">{{ log.actorId }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">{{ log.actorEmail }}</span>
            </div>
          </div>
        </div>

        <!-- Target Section -->
        <div class="info-section" *ngIf="log.targetId && log.targetEmail">
          <div class="section-header">
            <mat-icon>verified_user</mat-icon>
            <h3>Target</h3>
            <span class="section-subtitle">Who was affected</span>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">ID:</span>
              <span class="value mono">{{ log.targetId }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">{{ log.targetEmail }}</span>
            </div>
          </div>
        </div>

        <!-- Changes Section -->
        <div class="info-section" *ngIf="log.changes && hasChanges()">
          <div class="section-header">
            <mat-icon>compare_arrows</mat-icon>
            <h3>Changes</h3>
            <span class="section-subtitle">What was modified</span>
          </div>
          <div class="changes-container">
            <div *ngFor="let change of getChangesArray()" class="change-item">
              <div class="change-field">{{ change.field }}</div>
              <div class="change-values">
                <div class="change-old">
                  <span class="change-label">Before:</span>
                  <span class="change-value">{{ change.old }}</span>
                </div>
                <mat-icon class="change-arrow">arrow_forward</mat-icon>
                <div class="change-new">
                  <span class="change-label">After:</span>
                  <span class="change-value">{{ change.new }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reason Section -->
        <div class="info-section" *ngIf="log.reason">
          <div class="section-header">
            <mat-icon>description</mat-icon>
            <h3>Reason</h3>
          </div>
          <div class="reason-box">
            {{ log.reason }}
          </div>
        </div>

        <!-- Metadata Section -->
        <div class="info-section" *ngIf="log.metadata && hasMetadata()">
          <div class="section-header">
            <mat-icon>code</mat-icon>
            <h3>Metadata</h3>
            <span class="section-subtitle">Additional context</span>
          </div>
          <pre class="metadata-json">{{ formatMetadata(log.metadata) }}</pre>
        </div>

        <!-- Event ID Section -->
        <div class="info-section">
          <div class="section-header">
            <mat-icon>fingerprint</mat-icon>
            <h3>Event ID</h3>
          </div>
          <div class="event-id">{{ log.id }}</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="dialog-footer">
        <button mat-raised-button color="primary" (click)="close()">
          Close
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./audit-log-detail-dialog.component.scss']
})
export class AuditLogDetailDialogComponent {
  log: AuditLog;

  constructor(
    public dialogRef: MatDialogRef<AuditLogDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { log: AuditLog }
  ) {
    this.log = data.log;
  }

  close(): void {
    this.dialogRef.close();
  }

  getEventTypeDisplay(eventType: AuditEventType): string {
    return eventType.replace(/_/g, ' ').replace(/\./g, ' › ').toUpperCase();
  }

  getEventIcon(eventType: AuditEventType): string {
    if (eventType.includes('role_changed')) return 'swap_horiz';
    if (eventType.includes('deactivated')) return 'block';
    if (eventType.includes('reactivated')) return 'check_circle';
    if (eventType.includes('login.success')) return 'login';
    if (eventType.includes('login.failed')) return 'error';
    if (eventType.includes('permission.denied')) return 'shield';
    if (eventType.includes('created')) return 'add_circle';
    if (eventType.includes('updated')) return 'edit';
    if (eventType.includes('deleted')) return 'delete';
    return 'history';
  }

  getEventSeverity(eventType: AuditEventType): 'success' | 'warning' | 'error' | 'info' {
    if (eventType.includes('failed') || eventType.includes('denied') || eventType.includes('deleted')) {
      return 'error';
    }
    if (eventType.includes('deactivated')) {
      return 'warning';
    }
    if (eventType.includes('success') || eventType.includes('reactivated') || eventType.includes('created')) {
      return 'success';
    }
    return 'info';
  }

  formatTimestamp(timestamp: string): { date: string; time: string } {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      })
    };
  }

  hasChanges(): boolean {
    return this.log.changes && Object.keys(this.log.changes).length > 0;
  }

  getChangesArray(): Array<{ field: string; old: any; new: any }> {
    if (!this.log.changes) return [];
    return Object.entries(this.log.changes).map(([field, value]) => ({
      field: field.replace(/([A-Z])/g, ' $1').trim(),
      old: (value as any).old || 'N/A',
      new: (value as any).new || 'N/A'
    }));
  }

  hasMetadata(): boolean {
    return this.log.metadata && Object.keys(this.log.metadata).length > 0;
  }

  formatMetadata(metadata: Record<string, any>): string {
    return JSON.stringify(metadata, null, 2);
  }
}
