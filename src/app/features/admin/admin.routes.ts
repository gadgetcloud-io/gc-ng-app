import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { UserRole } from '../../core/models/user.model';
import { MainLayoutComponent } from '../../shared/components/main-layout/main-layout.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user-management/user-list/user-list.component';
import { AuditLogViewerComponent } from './audit-logs/audit-log-viewer.component';
import { PermissionManagementComponent } from './permissions/permission-management.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    data: {
      roles: [UserRole.ADMIN, UserRole.SUPPORT]
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'users',
        component: UserListComponent,
        data: {
          permission: { resource: 'users', action: 'view' }
        }
      },
      {
        path: 'audit-logs',
        component: AuditLogViewerComponent,
        data: {
          permission: { resource: 'audit_logs', action: 'view' }
        }
      },
      {
        path: 'permissions',
        component: PermissionManagementComponent,
        data: {
          permission: { resource: 'permissions', action: 'manage' }
        }
      }
    ]
  }
];
