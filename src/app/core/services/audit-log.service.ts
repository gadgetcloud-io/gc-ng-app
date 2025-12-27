/**
 * Audit Log Service
 *
 * Service for querying and managing audit logs.
 * Provides methods to view audit history and statistics.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AuditLog,
  AuditEventType,
  AuditStatistics
} from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private readonly API_URL = `${environment.apiUrl}/admin/audit-logs`;

  constructor(private http: HttpClient) {}

  /**
   * Query audit logs with filtering and pagination
   */
  getAuditLogs(options: {
    limit?: number;
    offset?: number;
    eventType?: AuditEventType;
    actorId?: string;
    targetId?: string;
  } = {}): Observable<AuditLog[]> {
    let params = new HttpParams();

    if (options.limit) params = params.set('limit', options.limit.toString());
    if (options.offset) params = params.set('offset', options.offset.toString());
    if (options.eventType) params = params.set('event_type', options.eventType);
    if (options.actorId) params = params.set('actor_id', options.actorId);
    if (options.targetId) params = params.set('target_id', options.targetId);

    return this.http.get<AuditLog[]>(this.API_URL, { params });
  }

  /**
   * Get all audit logs related to a specific user
   */
  getUserAuditHistory(
    userId: string,
    options: {
      limit?: number;
      includeAsActor?: boolean;
      includeAsTarget?: boolean;
    } = {}
  ): Observable<AuditLog[]> {
    let params = new HttpParams();

    if (options.limit) params = params.set('limit', options.limit.toString());
    if (options.includeAsActor !== undefined) {
      params = params.set('include_as_actor', options.includeAsActor.toString());
    }
    if (options.includeAsTarget !== undefined) {
      params = params.set('include_as_target', options.includeAsTarget.toString());
    }

    return this.http.get<AuditLog[]>(`${this.API_URL}/user/${userId}`, { params });
  }

  /**
   * Get the most recent audit logs (for admin dashboard)
   */
  getRecentAuditLogs(limit: number = 20): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.API_URL}/recent`, {
      params: new HttpParams().set('limit', limit.toString())
    });
  }

  /**
   * Get audit log statistics
   */
  getAuditStatistics(): Observable<AuditStatistics> {
    return this.http.get<AuditStatistics>(`${this.API_URL}/statistics`);
  }

  /**
   * Get audit logs by event type
   */
  getAuditLogsByEventType(
    eventType: AuditEventType,
    limit: number = 50
  ): Observable<AuditLog[]> {
    return this.getAuditLogs({ eventType, limit });
  }

  /**
   * Get audit logs for a specific actor (user who performed actions)
   */
  getAuditLogsByActor(actorId: string, limit: number = 50): Observable<AuditLog[]> {
    return this.getAuditLogs({ actorId, limit });
  }

  /**
   * Get audit logs for a specific target (user who was affected)
   */
  getAuditLogsByTarget(targetId: string, limit: number = 50): Observable<AuditLog[]> {
    return this.getAuditLogs({ targetId, limit });
  }

  /**
   * Get role change audit logs
   */
  getRoleChangeLogs(limit: number = 50): Observable<AuditLog[]> {
    return this.getAuditLogsByEventType(AuditEventType.USER_ROLE_CHANGED, limit);
  }

  /**
   * Get permission denied logs
   */
  getPermissionDeniedLogs(limit: number = 50): Observable<AuditLog[]> {
    return this.getAuditLogsByEventType(AuditEventType.PERMISSION_DENIED, limit);
  }

  /**
   * Get login failure logs
   */
  getLoginFailureLogs(limit: number = 50): Observable<AuditLog[]> {
    return this.getAuditLogsByEventType(AuditEventType.LOGIN_FAILED, limit);
  }
}
