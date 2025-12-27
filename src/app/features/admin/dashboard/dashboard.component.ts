/**
 * Admin Dashboard Component
 *
 * Main dashboard for admin panel with statistics and recent activity
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdminService } from '../../../core/services/admin.service';
import { AuditLogService } from '../../../core/services/audit-log.service';
import { UserStatistics, AuditStatistics } from '../../../core/models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = true;
  userStats: UserStatistics | null = null;
  auditStats: AuditStatistics | null = null;
  private loadingRequests = 0;
  private completedRequests = 0;

  constructor(
    private adminService: AdminService,
    private auditLogService: AuditLogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    console.log('[Dashboard] Starting to load stats...');
    this.loading = true;
    this.loadingRequests = 2; // Track total number of requests
    this.completedRequests = 0;

    // Load user statistics
    this.adminService.getUserStatistics().subscribe({
      next: (stats) => {
        console.log('[Dashboard] User stats received:', stats);
        this.userStats = stats;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('[Dashboard] Error loading user stats:', err);
        this.checkLoadingComplete();
      }
    });

    // Load audit statistics
    this.auditLogService.getAuditStatistics().subscribe({
      next: (stats) => {
        console.log('[Dashboard] Audit stats received:', stats);
        this.auditStats = stats;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('[Dashboard] Error loading audit stats:', err);
        this.checkLoadingComplete();
      }
    });
  }

  private checkLoadingComplete(): void {
    this.completedRequests++;
    console.log(`[Dashboard] Completed requests: ${this.completedRequests}/${this.loadingRequests}`);
    if (this.completedRequests >= this.loadingRequests) {
      console.log('[Dashboard] All requests complete, setting loading = false');
      this.loading = false;
      console.log('[Dashboard] Triggering change detection');
      this.cdr.detectChanges();
    }
  }
}
