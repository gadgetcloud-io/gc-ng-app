/**
 * Main Layout Component
 *
 * Unified layout combining sidebar, topbar, and footer
 * Used across all role dashboards
 */

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    TopbarComponent,
    FooterComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  sidebarOpen = false;
  isMobile = false;
  pageTitle = '';

  private routerSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.subscribeToRouteChanges();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 968;

    // Auto-close sidebar on mobile, auto-open on desktop
    if (wasMobile !== this.isMobile) {
      this.sidebarOpen = !this.isMobile;
    }
  }

  subscribeToRouteChanges(): void {
    // Update page title based on route
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });

    // Set initial page title
    this.updatePageTitle();
  }

  updatePageTitle(): void {
    const url = this.router.url;

    // Extract page title from URL
    if (url.includes('/dashboard')) {
      this.pageTitle = 'Dashboard';
    } else if (url.includes('/users')) {
      this.pageTitle = 'User Management';
    } else if (url.includes('/audit-logs')) {
      this.pageTitle = 'Audit Logs';
    } else if (url.includes('/permissions')) {
      this.pageTitle = 'Permissions';
    } else if (url.includes('/devices')) {
      this.pageTitle = 'My Devices';
    } else if (url.includes('/repairs')) {
      this.pageTitle = 'Repairs';
    } else if (url.includes('/warranty')) {
      this.pageTitle = 'Warranty';
    } else if (url.includes('/inventory')) {
      this.pageTitle = 'Inventory';
    } else if (url.includes('/analytics')) {
      this.pageTitle = 'Analytics';
    } else if (url.includes('/tickets')) {
      this.pageTitle = 'Support Tickets';
    } else if (url.includes('/knowledge-base')) {
      this.pageTitle = 'Knowledge Base';
    } else {
      this.pageTitle = '';
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
