import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, UserRole, LoginRequest, AuthResponse } from '../models/user.model';

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

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Mock login for MVP (since backend auth is not fully implemented)
  mockLogin(email: string, role: UserRole = UserRole.CUSTOMER): void {
    const mockUser: User = {
      id: 'mock-user-' + Date.now(),
      email,
      name: email.split('@')[0],
      role
    };

    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('access_token', mockToken);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);

    // Navigate based on role
    this.navigateByRole(role);
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
}
