# GadgetCloud Staging Test Credentials

**Environment**: Staging
**URL**: https://gadgetcloud-stg.web.app
**Created**: 2025-12-27

---

## Test User Accounts

### 🔵 Customer User
- **Email**: `customer@gadgetcloud.io`
- **Password**: `Customer123!`
- **Role**: `customer`
- **Status**: `active`
- **Expected Dashboard**: Customer dashboard with items/devices
- **Permissions**: View own items, create repair requests

---

### 🟠 Partner User (Repair Partner)
- **Email**: `partner@gadgetcloud.io`
- **Password**: `Partner123!`
- **Role**: `partner`
- **Status**: `active`
- **Expected Dashboard**: Dark industrial workshop theme
- **Permissions**:
  - View assigned repair requests
  - Manage inventory
  - Update repair status
  - View repair history

---

### 🟢 Support User (Customer Support)
- **Email**: `support@gadgetcloud.io`
- **Password**: `Support123!`
- **Role**: `support`
- **Status**: `active`
- **Expected Dashboard**: Bright friendly help desk theme
- **Permissions**:
  - View support tickets
  - Create/update tickets
  - View customer information
  - Access knowledge base
  - View audit logs (read-only)

---

### 🔴 Admin User (System Administrator)
- **Email**: `admin@gadgetcloud.io`
- **Password**: `Admin123!`
- **Role**: `admin`
- **Status**: `active`
- **Expected Dashboard**: Admin dashboard with user statistics
- **Permissions**:
  - Full user management
  - Change user roles
  - Activate/deactivate users
  - View/manage all audit logs
  - System configuration
  - Full access to all resources

---

## Testing Scenarios

### Scenario 1: Login Flow Testing

**Test Each Role**:
1. Go to https://gadgetcloud-stg.web.app
2. Login with each user above
3. Verify correct dashboard loads
4. Verify navigation menu shows appropriate options
5. Logout and repeat with next role

**Expected Results**:
- ✅ Customer → Customer dashboard
- ✅ Partner → Partner dashboard (dark theme, repair queue)
- ✅ Support → Support dashboard (bright theme, ticket queue)
- ✅ Admin → Admin dashboard (user stats, quick actions)

---

### Scenario 2: Permission Testing

**Admin Features** (login as admin):
1. Navigate to `/admin/users`
2. View user list (should show 4+ users)
3. Change customer user role to partner
4. Verify audit log entry created
5. Navigate to `/admin/audit-logs`
6. Verify role change appears in logs

**Non-Admin Access** (login as customer):
1. Try to navigate to `/admin/users`
2. Should be redirected or blocked
3. Try to navigate to `/admin/audit-logs`
4. Should be redirected or blocked

**Support Access** (login as support):
1. Navigate to `/admin/audit-logs`
2. Should be able to view logs (read-only)
3. Try to navigate to `/admin/users`
4. Should be blocked (no user management permission)

---

### Scenario 3: Error Handling

**Invalid Credentials**:
1. Login with `test@example.com` / `wrongpassword`
2. **Expected**: Red error message appears
3. **Expected**: Shows "Invalid credentials" or similar

**Empty Fields**:
1. Click "Sign In" without entering email/password
2. **Expected**: Error message "Please enter email and password"

**Loading State**:
1. Enter valid credentials
2. Click "Sign In"
3. **Expected**: Animated spinner appears
4. **Expected**: Button is disabled
5. **Expected**: Shows "Signing in..." with spinning icon

---

### Scenario 4: Role-Specific Dashboard Features

**Partner Dashboard** (login as partner@gadgetcloud.io):
- ✅ Dark charcoal background with blue/orange accents
- ✅ Hexagonal icon badges
- ✅ Metrics: Total Repairs (87), Pending (12), Completed (64), Revenue ($15,240)
- ✅ Repair Queue with 5 items
- ✅ Inventory Status with stock levels
- ✅ Quick Actions buttons
- ⚠️ Note: Uses mock data (real API integration pending)

**Support Dashboard** (login as support@gadgetcloud.io):
- ✅ Light/bright background with soft blues and greens
- ✅ Waving emoji (👋) in header
- ✅ Metrics: Open (8), Pending (15), Resolved (23), Avg Response (2.5h)
- ✅ Ticket Queue with 6 tickets
- ✅ Priority badges (urgent=red, high=orange)
- ✅ Recent Activity feed
- ✅ Quick Actions buttons
- ⚠️ Note: Uses mock data (real API integration pending)

**Admin Dashboard** (login as admin@gadgetcloud.io):
- ✅ User statistics (total, active, by role)
- ✅ Audit log statistics
- ✅ Quick action cards
- ✅ Navigation to User Management
- ✅ Navigation to Audit Logs
- ✅ Real data from Firestore

---

### Scenario 5: User Management (Admin Only)

**Prerequisites**: Login as admin@gadgetcloud.io

**Test User List**:
1. Navigate to "User Management" from dashboard
2. Verify table shows all users
3. Test search: type "customer" → should filter
4. Test role filter: select "partner" → should filter
5. Test status filter: select "active" → should filter
6. Click "Clear Filters" → should reset

**Test Role Change**:
1. Find customer user in list
2. Click "Change Role" button
3. Select new role (e.g., "support")
4. Enter reason: "Testing role change functionality"
5. Click "Confirm"
6. **Expected**: Success notification
7. **Expected**: Table updates showing new role
8. Navigate to Audit Logs
9. **Expected**: See role change entry

**Test User Deactivation**:
1. Find a test user in list
2. Click "Deactivate" button
3. Enter reason: "Testing deactivation"
4. Click "Confirm"
5. **Expected**: User status changes to "Inactive"
6. Logout
7. Try to login as that user
8. **Expected**: Login fails

**Test User Reactivation**:
1. Login as admin again
2. Find the deactivated user
3. Click "Reactivate" button
4. **Expected**: User status changes to "Active"
5. Logout
6. Login as that user again
7. **Expected**: Login succeeds

---

### Scenario 6: Audit Logs (Admin/Support)

**Prerequisites**: Login as admin or support

**Test Audit Log Viewer**:
1. Navigate to "Audit Logs" from dashboard
2. Verify timeline displays with color-coded dots
3. Test event type filter: select "user.role_changed"
4. Verify only role change events show
5. Test date range: select start/end dates
6. Verify logs filter by date
7. Click on a log entry
8. **Expected**: Detail dialog opens
9. Verify shows: timestamp, actor, target, changes, reason
10. Check diff highlighting (old=red, new=green)

---

## Security Testing

### Test 1: Self Role Change Prevention
1. Login as admin
2. Go to User Management
3. Try to change your own role
4. **Expected**: Should be blocked or fail

### Test 2: Admin Deactivation Prevention
1. Login as admin
2. Create or identify another admin user
3. Try to deactivate that admin
4. **Expected**: Should be blocked by backend

### Test 3: Deactivated User Login
1. Deactivate a test user (as admin)
2. Logout
3. Try to login as that user
4. **Expected**: Login fails with appropriate message

### Test 4: Permission Boundaries
1. Login as customer
2. Try to access admin URLs directly:
   - `/admin/users`
   - `/admin/audit-logs`
3. **Expected**: Redirected to unauthorized page or dashboard

---

## Common Issues & Troubleshooting

### Issue: Login Errors Not Showing
**Solution**: Check browser console for network errors. Verify backend is running and CORS is configured.

### Issue: Firestore Index Missing
**Symptom**: Error when loading user list or audit logs
**Solution**:
1. Error message will include index creation link
2. Click the link to create the index
3. Wait 10-15 minutes for index to build
4. Retry the operation

### Issue: 403 Forbidden on API Calls
**Solution**:
1. Check if logged in (token in localStorage)
2. Verify token is valid (check expiration)
3. Re-login if token expired

### Issue: Dashboard Not Loading
**Solution**:
1. Check browser console for errors
2. Verify Firestore collections exist
3. Check permissions are seeded correctly

---

## Password Format

All test user passwords follow the pattern: `{Role}123!`

Examples:
- Customer: `Customer123!`
- Partner: `Partner123!`
- Support: `Support123!`
- Admin: `Admin123!`

**Password Requirements**:
- Minimum 8 characters
- Contains uppercase letter
- Contains lowercase letter
- Contains number
- Contains special character

---

## Next Steps After Testing

1. **Document Bugs**: Create issues in GitHub for any bugs found
2. **Performance Testing**: Measure load times and optimize
3. **Cross-Browser Testing**: Test on Chrome, Firefox, Safari, Edge
4. **Mobile Testing**: Test on iOS and Android devices
5. **Accessibility Testing**: Run axe DevTools and fix issues
6. **Production Deployment**: Follow DEPLOYMENT_GUIDE.md after staging validation

---

## Important Notes

⚠️ **Mock Data Warning**: Partner and Support dashboards currently use mock data. Real API integration pending.

✅ **Real Authentication**: Login, signup, and admin features use real Firestore data and authentication.

🔒 **Security**: All passwords are hashed with bcrypt. Audit logs track all admin actions.

📝 **Audit Trail**: Every user role change and status change is logged to `gc-audit-logs` collection.

---

**Staging URL**: https://gadgetcloud-stg.web.app
**Backend API**: https://gc-py-backend-198991430816.asia-south1.run.app/api
**API Docs**: https://gc-py-backend-198991430816.asia-south1.run.app/api/docs

---

**Created**: 2025-12-27
**Environment**: Staging (gadgetcloud-stg)
**Purpose**: Testing and validation before production deployment
