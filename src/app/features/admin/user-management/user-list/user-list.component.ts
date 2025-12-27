/**
 * User List Component
 *
 * Displays all users in a Material table with search, filters, and pagination
 */

import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AdminService } from '../../../../core/services/admin.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { UserManagement, UserStatus, getUserStatusClass, getUserStatusDisplay } from '../../../../core/models/admin.model';
import { UserRole } from '../../../../core/models/user.model';
import { RoleChangeDialogComponent } from '../dialogs/role-change-dialog.component';
import { UserDeactivateDialogComponent } from '../dialogs/user-deactivate-dialog.component';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['email', 'name', 'role', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<UserManagement>();
  loading = false;
  totalUsers = 0;

  // Math object for template
  Math = Math;

  // Filters
  searchTerm = '';
  selectedRole: UserRole | '' = '';
  selectedStatus: UserStatus | '' = '';

  // Search debounce
  private searchSubject = new Subject<string>();

  // Enums for template
  userRoles = Object.values(UserRole);
  userStatuses = Object.values(UserStatus);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    public permissionService: PermissionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    // Setup search debounce
    this.searchSubject.pipe(debounceTime(300)).subscribe(searchValue => {
      this.searchTerm = searchValue;
      this.loadUsers();
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.loading = true;

    const options: any = {
      limit: this.paginator?.pageSize || 50,
      offset: this.paginator?.pageIndex ? this.paginator.pageIndex * this.paginator.pageSize : 0
    };

    if (this.searchTerm) options.search = this.searchTerm;
    if (this.selectedRole) options.role = this.selectedRole;
    if (this.selectedStatus) options.status = this.selectedStatus;

    this.adminService.listUsers(options).subscribe({
      next: (response) => {
        this.dataSource.data = response.users;
        this.totalUsers = response.total;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(searchValue: string): void {
    this.searchSubject.next(searchValue);
  }

  onFilterChange(): void {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadUsers();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadUsers();
  }

  getUserName(user: UserManagement): string {
    return `${user.firstName} ${user.lastName}`;
  }

  getStatusDisplay(status: UserStatus): string {
    return getUserStatusDisplay(status);
  }

  getStatusClass(status: UserStatus): string {
    return getUserStatusClass(status);
  }

  openRoleChangeDialog(user: UserManagement): void {
    const dialogRef = this.dialog.open(RoleChangeDialogComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
        this.snackBar.open('User role changed successfully', 'Close', { duration: 3000 });
      }
    });
  }

  openDeactivateDialog(user: UserManagement): void {
    const dialogRef = this.dialog.open(UserDeactivateDialogComponent, {
      width: '500px',
      data: { user, action: user.status === UserStatus.ACTIVE ? 'deactivate' : 'reactivate' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
        const action = user.status === UserStatus.ACTIVE ? 'deactivated' : 'reactivated';
        this.snackBar.open(`User ${action} successfully`, 'Close', { duration: 3000 });
      }
    });
  }

  onPageChange(): void {
    this.loadUsers();
  }
}
