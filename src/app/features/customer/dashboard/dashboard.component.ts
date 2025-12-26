import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { Item } from '../../../core/models/item.model';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FilterPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  items: Item[] = [];
  loading = false;

  constructor(
    public authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.apiService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'active': '#48bb78',
      'in_repair': '#ed8936',
      'warranty_expired': '#f56565',
      'sold': '#718096'
    };
    return colors[status] || '#718096';
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'phone': '📱',
      'laptop': '💻',
      'tablet': '📱',
      'watch': '⌚',
      'camera': '📷',
      'other': '🔧'
    };
    return icons[category] || '🔧';
  }
}
