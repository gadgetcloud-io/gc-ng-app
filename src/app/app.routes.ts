import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { UserRole } from './core/models/user.model';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  // Common authenticated routes (accessible to all roles)
  {
    path: 'profile',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/profile/profile.component')
          .then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'settings',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/settings/settings.component')
          .then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: 'help',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/help/help.component')
          .then(m => m.HelpComponent)
      }
    ]
  },
  // Role-specific routes
  {
    path: 'customer',
    canActivate: [authGuard],
    data: { roles: [UserRole.CUSTOMER] },
    loadChildren: () => import('./features/customer/customer.routes')
      .then(m => m.customerRoutes)
  },
  {
    path: 'partner',
    canActivate: [authGuard],
    data: { roles: [UserRole.PARTNER] },
    loadChildren: () => import('./features/partner/partner.routes')
      .then(m => m.partnerRoutes)
  },
  {
    path: 'support',
    canActivate: [authGuard],
    data: { roles: [UserRole.SUPPORT] },
    loadChildren: () => import('./features/support/support.routes')
      .then(m => m.supportRoutes)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: [UserRole.ADMIN] },
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.adminRoutes)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component')
      .then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
