import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check role-based access
  const allowedRoles = route.data['roles'] as UserRole[];
  if (allowedRoles && allowedRoles.length > 0) {
    if (!authService.hasRole(allowedRoles)) {
      router.navigate(['/unauthorized']);
      return false;
    }
  }

  return true;
};
