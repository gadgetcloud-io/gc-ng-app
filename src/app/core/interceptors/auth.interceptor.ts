/**
 * Auth HTTP Interceptor
 *
 * Automatically adds the Authorization header with the JWT token
 * to all outgoing HTTP requests (except login/signup).
 */

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('[AuthInterceptor] Intercepting request:', req.url);

  // Skip adding auth header for login and signup requests
  if (req.url.includes('/auth/login') || req.url.includes('/auth/signup')) {
    console.log('[AuthInterceptor] Skipping auth header for auth endpoint');
    return next(req);
  }

  // Get the auth token from localStorage
  const token = localStorage.getItem('access_token');
  console.log('[AuthInterceptor] Token found:', !!token);

  // If token exists, clone the request and add the Authorization header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('[AuthInterceptor] Added Authorization header');
    return next(authReq);
  }

  // If no token, proceed with the original request
  console.log('[AuthInterceptor] No token, proceeding without auth');
  return next(req);
};
