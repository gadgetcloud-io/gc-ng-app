/**
 * Admin Service
 *
 * Service for administrative user management operations.
 * Provides methods to list, view, and manage users.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  UserManagement,
  UserListResponse,
  UserStatistics,
  ChangeRoleRequest,
  DeactivateUserRequest,
  ReactivateUserRequest,
  UserStatus
} from '../models/admin.model';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  /**
   * List all users with filtering, pagination, and search
   */
  listUsers(options: {
    limit?: number;
    offset?: number;
    role?: UserRole;
    status?: UserStatus;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Observable<UserListResponse> {
    let params = new HttpParams();

    if (options.limit) params = params.set('limit', options.limit.toString());
    if (options.offset) params = params.set('offset', options.offset.toString());
    if (options.role) params = params.set('role', options.role);
    if (options.status) params = params.set('status', options.status);
    if (options.search) params = params.set('search', options.search);
    if (options.sortBy) params = params.set('sort_by', options.sortBy);
    if (options.sortOrder) params = params.set('sort_order', options.sortOrder);

    return this.http.get<UserListResponse>(this.API_URL, { params });
  }

  /**
   * Get detailed user information by ID
   */
  getUser(userId: string): Observable<UserManagement> {
    return this.http.get<UserManagement>(`${this.API_URL}/${userId}`);
  }

  /**
   * Get user statistics for admin dashboard
   */
  getUserStatistics(): Observable<UserStatistics> {
    return this.http.get<UserStatistics>(`${this.API_URL}/statistics`);
  }

  /**
   * Change a user's role
   */
  changeUserRole(userId: string, request: ChangeRoleRequest): Observable<UserManagement> {
    return this.http.put<UserManagement>(`${this.API_URL}/${userId}/role`, request);
  }

  /**
   * Deactivate a user account
   */
  deactivateUser(userId: string, request: DeactivateUserRequest = {}): Observable<UserManagement> {
    return this.http.put<UserManagement>(`${this.API_URL}/${userId}/deactivate`, request);
  }

  /**
   * Reactivate a user account
   */
  reactivateUser(userId: string, request: ReactivateUserRequest = {}): Observable<UserManagement> {
    return this.http.put<UserManagement>(`${this.API_URL}/${userId}/reactivate`, request);
  }

  /**
   * Search users by email or name
   */
  searchUsers(searchTerm: string, limit: number = 20): Observable<UserListResponse> {
    return this.listUsers({ search: searchTerm, limit });
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: UserRole, limit: number = 50): Observable<UserListResponse> {
    return this.listUsers({ role, limit });
  }

  /**
   * Get users by status
   */
  getUsersByStatus(status: UserStatus, limit: number = 50): Observable<UserListResponse> {
    return this.listUsers({ status, limit });
  }

  /**
   * Get active users
   */
  getActiveUsers(limit: number = 50): Observable<UserListResponse> {
    return this.getUsersByStatus(UserStatus.ACTIVE, limit);
  }

  /**
   * Get inactive users
   */
  getInactiveUsers(limit: number = 50): Observable<UserListResponse> {
    return this.getUsersByStatus(UserStatus.INACTIVE, limit);
  }
}
