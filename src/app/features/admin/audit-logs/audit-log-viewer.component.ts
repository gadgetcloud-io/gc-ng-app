/**
 * Audit Log Viewer Component
 *
 * Timeline-inspired interface for viewing and filtering audit logs
 * with editorial data visualization aesthetic
 */

import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AuditLogService } from '../../../core/services/audit-log.service';
import { AuditLog, AuditEventType } from '../../../core/models/admin.model';
import { AuditLogDetailDialogComponent } from './audit-log-detail-dialog.component';

@Component({
  selector: 'app-audit-log-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  templateUrl: './audit-log-viewer.component.html',
  styleUrls: ['./audit-log-viewer.component.scss']
})
export class AuditLogViewerComponent implements OnInit {
  logs: AuditLog[] = [];
  loading = false;
  totalLogs = 0;

  // Math object for template
  Math = Math;

  // Filters
  selectedEventType: AuditEventType | '' = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  userSearch = '';

  // Event types for dropdown
  eventTypes = Object.values(AuditEventType);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private auditLogService: AuditLogService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;

    const options: any = {
      limit: this.paginator?.pageSize || 50,
      offset: this.paginator?.pageIndex ? this.paginator.pageIndex * this.paginator.pageSize : 0
    };

    if (this.selectedEventType) {
      options.eventType = this.selectedEventType;
    }

    if (this.startDate) {
      options.startDate = this.startDate.toISOString();
    }

    if (this.endDate) {
      options.endDate = this.endDate.toISOString();
    }

    if (this.userSearch) {
      options.userSearch = this.userSearch;
    }

    this.auditLogService.getAuditLogs(options).subscribe({
      next: (logs) => {
        this.logs = logs;
        this.totalLogs = logs.length; // In a real app, this would come from the API response
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFilterChange(): void {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadLogs();
  }

  clearFilters(): void {
    this.selectedEventType = '';
    this.startDate = null;
    this.endDate = null;
    this.userSearch = '';
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadLogs();
  }

  onPageChange(): void {
    this.loadLogs();
  }

  onStartDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.startDate = target.value ? new Date(target.value) : null;
    this.onFilterChange();
  }

  onEndDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.endDate = target.value ? new Date(target.value) : null;
    this.onFilterChange();
  }

  openLogDetail(log: AuditLog): void {
    this.dialog.open(AuditLogDetailDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { log },
      panelClass: 'audit-log-detail-dialog'
    });
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
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  }

  getActionSummary(log: AuditLog): string {
    if (log.changes) {
      const changes = Object.entries(log.changes)
        .map(([key, value]) => `${key}: ${(value as any).old} → ${(value as any).new}`)
        .join(', ');
      return changes || 'No details';
    }
    return log.reason || 'No details';
  }
}
