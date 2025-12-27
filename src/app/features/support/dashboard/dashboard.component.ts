/**
 * Support Dashboard Component
 *
 * Bright, friendly interface for customer support team
 * Manages tickets, queries, and team performance
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { getUserDisplayName } from '../../../core/models/user.model';

// Support-specific data models
export interface SupportMetrics {
  openTickets: number;
  pendingTickets: number;
  resolvedToday: number;
  avgResponseTime: string;
}

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'urgent' | 'high' | 'normal' | 'low';

export interface SupportTicket {
  id: string;
  customer: string;
  customerEmail: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  lastUpdate: string;
  assignedTo?: string;
  category: string;
}

export interface RecentActivity {
  id: string;
  type: 'query' | 'update' | 'alert';
  message: string;
  timestamp: string;
  user?: string;
}

@Component({
  selector: 'app-support-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  metrics: SupportMetrics = {
    openTickets: 0,
    pendingTickets: 0,
    resolvedToday: 0,
    avgResponseTime: '0h'
  };

  ticketQueue: SupportTicket[] = [];
  recentActivity: RecentActivity[] = [];
  loading = false;

  constructor(public authService: AuthService) {}

  get userDisplayName(): string {
    return getUserDisplayName(this.authService.currentUserValue);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Mock data - will be replaced with real API calls
    this.metrics = {
      openTickets: 8,
      pendingTickets: 15,
      resolvedToday: 23,
      avgResponseTime: '2.5h'
    };

    this.ticketQueue = [
      {
        id: 'TKT-1234',
        customer: 'Alice Johnson',
        customerEmail: 'alice@example.com',
        subject: 'Unable to access my account after password reset',
        status: 'open',
        priority: 'urgent',
        createdAt: '2025-12-27T09:15:00Z',
        lastUpdate: '2025-12-27T09:15:00Z',
        category: 'Account Access'
      },
      {
        id: 'TKT-1235',
        customer: 'Bob Martinez',
        customerEmail: 'bob.m@example.com',
        subject: 'Question about warranty coverage for water damage',
        status: 'pending',
        priority: 'high',
        createdAt: '2025-12-26T14:30:00Z',
        lastUpdate: '2025-12-27T08:20:00Z',
        assignedTo: 'Support Team',
        category: 'Warranty'
      },
      {
        id: 'TKT-1236',
        customer: 'Carol White',
        customerEmail: 'carol.white@example.com',
        subject: 'How do I track my repair status?',
        status: 'open',
        priority: 'normal',
        createdAt: '2025-12-27T10:00:00Z',
        lastUpdate: '2025-12-27T10:00:00Z',
        category: 'Repair Tracking'
      },
      {
        id: 'TKT-1237',
        customer: 'David Chen',
        customerEmail: 'd.chen@example.com',
        subject: 'Billing inquiry - charged twice for same repair',
        status: 'open',
        priority: 'high',
        createdAt: '2025-12-27T09:45:00Z',
        lastUpdate: '2025-12-27T09:45:00Z',
        category: 'Billing'
      },
      {
        id: 'TKT-1238',
        customer: 'Emma Davis',
        customerEmail: 'emma.d@example.com',
        subject: 'Need to reschedule device drop-off appointment',
        status: 'pending',
        priority: 'normal',
        createdAt: '2025-12-26T16:20:00Z',
        lastUpdate: '2025-12-27T07:30:00Z',
        assignedTo: 'You',
        category: 'Scheduling'
      },
      {
        id: 'TKT-1239',
        customer: 'Frank Wilson',
        customerEmail: 'frank.w@example.com',
        subject: 'Device not returned after 2 weeks - urgent!',
        status: 'open',
        priority: 'urgent',
        createdAt: '2025-12-27T08:00:00Z',
        lastUpdate: '2025-12-27T08:00:00Z',
        category: 'Returns'
      }
    ];

    this.recentActivity = [
      {
        id: '1',
        type: 'query',
        message: 'New chat message from customer #TKT-1240',
        timestamp: '2025-12-27T10:25:00Z',
        user: 'Sarah K.'
      },
      {
        id: '2',
        type: 'update',
        message: 'Ticket #TKT-1220 marked as resolved',
        timestamp: '2025-12-27T10:15:00Z',
        user: 'You'
      },
      {
        id: '3',
        type: 'alert',
        message: 'SLA deadline approaching for #TKT-1234',
        timestamp: '2025-12-27T10:00:00Z'
      },
      {
        id: '4',
        type: 'update',
        message: 'Team member John joined the support queue',
        timestamp: '2025-12-27T09:45:00Z',
        user: 'John M.'
      }
    ];
  }

  getStatusColor(status: TicketStatus): string {
    const colors: Record<TicketStatus, string> = {
      'open': '#f87171',
      'pending': '#fbbf24',
      'resolved': '#34d399',
      'closed': '#94a3b8'
    };
    return colors[status];
  }

  getPriorityColor(priority: TicketPriority): string {
    const colors: Record<TicketPriority, string> = {
      'urgent': '#ef4444',
      'high': '#f97316',
      'normal': '#60a5fa',
      'low': '#94a3b8'
    };
    return colors[priority];
  }

  getTicketAge(createdAt: string): string {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  formatActivityTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      'query': '💬',
      'update': '✓',
      'alert': '⚡'
    };
    return icons[type] || '📌';
  }

  logout(): void {
    this.authService.logout();
  }

  // Mock action handlers
  newTicket(): void {
    console.log('New Ticket clicked');
  }

  knowledgeBase(): void {
    console.log('Knowledge Base clicked');
  }

  escalateTicket(): void {
    console.log('Escalate Ticket clicked');
  }

  teamChat(): void {
    console.log('Team Chat clicked');
  }

  viewTicketDetails(ticket: SupportTicket): void {
    console.log('View ticket details:', ticket);
  }
}
