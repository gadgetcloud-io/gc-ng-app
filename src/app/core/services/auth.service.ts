import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, UserRole, LoginRequest, SignupRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load user from localStorage on init
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  get userRole(): UserRole | null {
    return this.currentUserValue?.role || null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.access_token) {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  signup(signupData: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signup`, signupData)
      .pipe(
        tap(response => {
          if (response.access_token) {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    const token = localStorage.getItem('access_token');

    // Call backend logout endpoint for audit logging
    if (token) {
      this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
        error: (err) => console.error('Logout error:', err)
      });
    }

    // Clear local storage and navigate
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  navigateByRole(role: UserRole): void {
    const routes: Record<UserRole, string> = {
      [UserRole.CUSTOMER]: '/customer/dashboard',
      [UserRole.PARTNER]: '/partner/dashboard',
      [UserRole.SUPPORT]: '/support/dashboard',
      [UserRole.ADMIN]: '/admin/dashboard'
    };
    this.router.navigate([routes[role]]);
  }

  hasRole(roles: UserRole[]): boolean {
    return !!this.userRole && roles.includes(this.userRole);
  }

  getCurrentUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`);
  }

  updateProfile(updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/auth/me`, updates)
      .pipe(
        tap(updatedUser => {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        })
      );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/change-password`, {
      old_password: oldPassword,
      new_password: newPassword
    });
  }
}
