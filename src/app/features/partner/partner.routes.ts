import { Routes } from '@angular/router';

export const partnerRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('../customer/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
