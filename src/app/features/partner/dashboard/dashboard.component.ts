/**
 * Partner Dashboard Component
 *
 * Industrial workshop aesthetic for repair partners
 * Manages repair requests, inventory, and performance metrics
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { getUserDisplayName } from '../../../core/models/user.model';

// Partner-specific data models
export interface PartnerMetrics {
  totalRepairs: number;
  pendingRepairs: number;
  completedRepairs: number;
  revenue: number;
  trends: {
    repairs: number; // percentage change
    revenue: number;
  };
}

export interface RepairRequest {
  id: string;
  device: string;
  deviceType: 'phone' | 'laptop' | 'tablet' | 'watch' | 'other';
  customer: string;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'high' | 'medium' | 'low';
  assignedDate: string;
  estimatedCompletion?: string;
  issue: string;
}

export interface InventoryItem {
  name: string;
  stock: number;
  minStock: number;
  unit: string;
}

@Component({
  selector: 'app-partner-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  metrics: PartnerMetrics = {
    totalRepairs: 0,
    pendingRepairs: 0,
    completedRepairs: 0,
    revenue: 0,
    trends: { repairs: 0, revenue: 0 }
  };

  repairQueue: RepairRequest[] = [];
  inventory: InventoryItem[] = [];
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
      totalRepairs: 87,
      pendingRepairs: 12,
      completedRepairs: 64,
      revenue: 15240,
      trends: {
        repairs: 12.5,
        revenue: 8.3
      }
    };

    this.repairQueue = [
      {
        id: 'REP-001',
        device: 'iPhone 14 Pro',
        deviceType: 'phone',
        customer: 'John Smith',
        status: 'pending',
        priority: 'high',
        assignedDate: '2025-12-26T10:00:00Z',
        issue: 'Screen replacement needed'
      },
      {
        id: 'REP-002',
        device: 'MacBook Pro 16"',
        deviceType: 'laptop',
        customer: 'Sarah Johnson',
        status: 'in_progress',
        priority: 'medium',
        assignedDate: '2025-12-25T14:30:00Z',
        estimatedCompletion: '2025-12-27T16:00:00Z',
        issue: 'Battery replacement'
      },
      {
        id: 'REP-003',
        device: 'iPad Air',
        deviceType: 'tablet',
        customer: 'Mike Davis',
        status: 'in_progress',
        priority: 'low',
        assignedDate: '2025-12-24T09:15:00Z',
        issue: 'Software update and diagnostics'
      },
      {
        id: 'REP-004',
        device: 'Apple Watch Series 8',
        deviceType: 'watch',
        customer: 'Emily Brown',
        status: 'pending',
        priority: 'high',
        assignedDate: '2025-12-26T11:45:00Z',
        issue: 'Water damage assessment'
      },
      {
        id: 'REP-005',
        device: 'iPhone 13',
        deviceType: 'phone',
        customer: 'David Wilson',
        status: 'on_hold',
        priority: 'medium',
        assignedDate: '2025-12-23T16:20:00Z',
        issue: 'Awaiting parts delivery'
      }
    ];

    this.inventory = [
      { name: 'iPhone Screens', stock: 24, minStock: 10, unit: 'units' },
      { name: 'MacBook Batteries', stock: 8, minStock: 5, unit: 'units' },
      { name: 'USB-C Cables', stock: 45, minStock: 20, unit: 'units' },
      { name: 'Screen Protectors', stock: 3, minStock: 15, unit: 'packs' },
      { name: 'Repair Tools', stock: 12, minStock: 8, unit: 'sets' }
    ];
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': '#fbbf24',
      'in_progress': '#3b82f6',
      'completed': '#10b981',
      'on_hold': '#6b7280'
    };
    return colors[status] || '#6b7280';
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      'high': '#ef4444',
      'medium': '#fbbf24',
      'low': '#6b7280'
    };
    return colors[priority] || '#6b7280';
  }

  getDeviceIcon(deviceType: string): string {
    const icons: Record<string, string> = {
      'phone': '📱',
      'laptop': '💻',
      'tablet': '📱',
      'watch': '⌚',
      'other': '🔧'
    };
    return icons[deviceType] || '🔧';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getStockLevel(item: InventoryItem): 'low' | 'medium' | 'high' {
    const percentage = (item.stock / item.minStock) * 100;
    if (percentage < 50) return 'low';
    if (percentage < 100) return 'medium';
    return 'high';
  }

  getStockPercentage(item: InventoryItem): number {
    return Math.min((item.stock / (item.minStock * 2)) * 100, 100);
  }

  logout(): void {
    this.authService.logout();
  }

  // Mock action handlers
  newRepairRequest(): void {
    console.log('New Repair Request clicked');
  }

  updateInventory(): void {
    console.log('Update Inventory clicked');
  }

  viewAllRepairs(): void {
    console.log('View All Repairs clicked');
  }

  generateReport(): void {
    console.log('Generate Report clicked');
  }

  viewRepairDetails(repair: RepairRequest): void {
    console.log('View repair details:', repair);
  }
}
