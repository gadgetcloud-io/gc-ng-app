/**
 * HasPermission Directive
 *
 * Structural directive that conditionally displays elements based on user permissions.
 *
 * Usage:
 *   <button *hasPermission="{ resource: 'users', action: 'edit' }">
 *     Edit User
 *   </button>
 *
 *   <div *hasPermission="{ resource: 'audit_logs', action: 'view' }">
 *     Audit logs content
 *   </div>
 *
 *   <!-- Multiple permissions (any) -->
 *   <button *hasPermission="{ any: [
 *     { resource: 'users', action: 'edit' },
 *     { resource: 'users', action: 'delete' }
 *   ] }">
 *     Manage User
 *   </button>
 *
 *   <!-- Multiple permissions (all) -->
 *   <button *hasPermission="{ all: [
 *     { resource: 'users', action: 'view' },
 *     { resource: 'audit_logs', action: 'view' }
 *   ] }">
 *     Admin Dashboard
 *   </button>
 */

import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PermissionService } from '../../core/services/permission.service';

interface PermissionCheck {
  resource: string;
  action: string;
}

interface PermissionInput {
  resource?: string;
  action?: string;
  any?: PermissionCheck[];
  all?: PermissionCheck[];
}

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private hasView = false;

  @Input() hasPermission!: PermissionInput;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    // Subscribe to permission changes
    this.permissionService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });

    // Initial check
    this.updateView();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    const hasPermission = this.checkPermission();

    if (hasPermission && !this.hasView) {
      // Show the element
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      // Hide the element
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  private checkPermission(): boolean {
    if (!this.hasPermission) {
      return false;
    }

    // Single permission check
    if (this.hasPermission.resource && this.hasPermission.action) {
      return this.permissionService.hasPermission(
        this.hasPermission.resource,
        this.hasPermission.action
      );
    }

    // Multiple permissions (any)
    if (this.hasPermission.any && this.hasPermission.any.length > 0) {
      return this.permissionService.hasAnyPermission(this.hasPermission.any);
    }

    // Multiple permissions (all)
    if (this.hasPermission.all && this.hasPermission.all.length > 0) {
      return this.permissionService.hasAllPermissions(this.hasPermission.all);
    }

    return false;
  }
}
