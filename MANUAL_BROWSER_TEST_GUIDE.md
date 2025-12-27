# Admin Panel - Manual Browser Testing Guide

**Environment**: Staging
**URL**: https://gadgetcloud-stg.web.app
**Date**: 2025-12-27

---

## Pre-Test Verification ✅

API endpoints verified and working:
- ✅ Admin Login (POST /api/auth/login)
- ✅ User Statistics (GET /api/admin/users/statistics)
- ✅ List Users (GET /api/admin/users) - **FIXED!**
- ✅ Filter Users by Role
- ✅ Search Users
- ✅ Audit Log Statistics
- ✅ List Audit Logs

**Database Status**:
- Total Users: 5 (1 customer, 2 partners, 1 support, 1 admin)
- All users active
- Recent signups: 2 (last 7 days)
- Audit logs: 8 entries

---

## Test 1: Login Flow

### Steps:
1. Open https://gadgetcloud-stg.web.app in your browser
2. You should see the login page
3. Enter credentials:
   - **Email**: `admin@gadgetcloud.io`
   - **Password**: `Admin123!`
4. Click "Sign In" button

### Expected Results:
- ✅ Loading spinner appears on button
- ✅ Button shows "Signing in..." with spinning icon
- ✅ Redirect to `/admin/dashboard` (admin dashboard)
- ✅ No console errors

### What to Check:
- Does the spinner animation work?
- Any error messages in red?
- Check browser console (F12) for JavaScript errors
- Check Network tab for 401/403/500 errors

---

## Test 2: Admin Dashboard

### What You Should See:

**Header**:
- "Admin Dashboard" title
- Welcome message with admin name
- Logout button (top right)

**Metrics Cards** (4 cards at top):
1. **Total Users**: Should show `5`
2. **Active Users**: Should show `5`
3. **Total Customers**: Should show `1`
4. **Total Partners**: Should show `2`

**User Breakdown Section**:
- Pie chart or table showing:
  - Customers: 1
  - Partners: 2
  - Support: 1
  - Admin: 1

**Quick Actions Section**:
- "Manage Users" button → `/admin/user-management`
- "View Audit Logs" button → `/admin/audit-logs`

### What to Test:
- [ ] All metrics load correctly (no loading spinners stuck)
- [ ] Numbers match expected values
- [ ] Quick action buttons are clickable
- [ ] No "undefined" or "null" displayed
- [ ] Responsive design works (try resizing window)

---

## Test 3: User Management Page

### Navigation:
Click "Manage Users" button OR navigate to `/admin/user-management`

### What You Should See:

**Page Header**:
- "User Management" title
- Total user count (5 users)

**Filter Controls**:
- Search box (placeholder: "Search by email or name")
- Role dropdown (All, Customer, Partner, Support, Admin)
- Status dropdown (All, Active, Inactive, Suspended)
- "Clear Filters" button

**User Table**:
- Columns: Email, Name, Role, Status, Actions
- 5 rows of user data
- Pagination controls (if > 50 users)

**Expected Users in Table**:
1. admin@gadgetcloud.io - Admin User - admin - active
2. support@gadgetcloud.io - Test Support - support - active
3. partner@gadgetcloud.io - Test Partner - partner - active
4. customer@gadgetcloud.io - Test Customer - customer - active
5. testcustomer@example.com - Test Customer - partner - active

### Tests to Perform:

#### Test 3.1: Search Functionality
1. Type "admin" in search box
2. **Expected**: Table shows only admin@gadgetcloud.io
3. Clear search
4. Type "partner"
5. **Expected**: Table shows 2 partner users

#### Test 3.2: Filter by Role
1. Select "partner" from Role dropdown
2. **Expected**: Table shows 2 users (both partners)
3. Select "admin" from Role dropdown
4. **Expected**: Table shows 1 user (admin)
5. Select "All" to reset

#### Test 3.3: Filter by Status
1. Select "Active" from Status dropdown
2. **Expected**: Table shows 5 users (all active)
3. Try "Inactive"
4. **Expected**: Empty state message or 0 users

#### Test 3.4: Combined Filters
1. Set Role = "partner" AND Search = "test"
2. **Expected**: Shows partner users matching "test"
3. Click "Clear Filters"
4. **Expected**: All filters reset, shows all 5 users

---

## Test 4: User Actions

### Test 4.1: View User Details
1. Click on any user row in the table
2. **Expected**: Detail modal/page opens
3. **Should show**:
   - User email, name, role, status
   - Created date
   - Last updated date
   - Audit history (recent changes)

**Note**: This may fail (500 error found in API test). Document if it fails.

### Test 4.2: Change User Role (Critical Feature!)
1. Find "customer@gadgetcloud.io" in user table
2. Click "Change Role" button
3. **Expected**: Modal dialog opens
4. **Should contain**:
   - Radio buttons for: Customer, Partner, Support, Admin
   - Reason textarea (required)
   - Warning message about session invalidation
   - "Cancel" and "Confirm" buttons

5. Select "partner" role
6. Enter reason: "Testing role change functionality for admin panel"
7. Click "Confirm"

**Expected Result**:
- ✅ Success notification appears
- ✅ Table updates showing customer@gadgetcloud.io as "partner"
- ✅ Page doesn't crash

**Then verify**:
8. Navigate to Audit Logs page
9. **Expected**: See audit entry for role change
10. **Should show**:
    - Event type: "user.role_changed"
    - Actor: admin@gadgetcloud.io
    - Target: customer@gadgetcloud.io
    - Changes: customer → partner
    - Reason: "Testing role change..."

### Test 4.3: Deactivate User
1. Find "testcustomer@example.com" in table
2. Click "Deactivate" button
3. **Expected**: Confirmation dialog
4. Enter reason: "Testing user deactivation"
5. Click "Confirm"

**Expected Result**:
- ✅ Success notification
- ✅ User status changes to "Inactive"
- ✅ User row appears grayed out or has "Inactive" badge

### Test 4.4: Reactivate User
1. Filter by Status = "Inactive"
2. Find the deactivated user
3. Click "Reactivate" button
4. **Expected**: User status returns to "Active"

---

## Test 5: Audit Logs Page

### Navigation:
From dashboard, click "View Audit Logs" OR navigate to `/admin/audit-logs`

### What You Should See:

**Page Header**:
- "Audit Logs" title
- Total log count (8+ entries)

**Filter Controls**:
- Event Type dropdown (All, user.role_changed, user.created, etc.)
- Date range picker (Start date, End date)
- "Clear Filters" button

**Audit Log Timeline**:
- Chronological list of audit entries
- Each entry shows:
  - Timestamp (relative time: "2 hours ago")
  - Event type icon
  - Actor (who performed action)
  - Action description
  - Target (who was affected)
  - Color-coded event types

### Tests to Perform:

#### Test 5.1: View Recent Logs
1. Page loads showing most recent logs first
2. **Expected**: See 8+ log entries
3. **Should include**:
   - User creation events
   - Login events (possibly)
   - Role change event (from Test 4.2)
   - Deactivation/reactivation events

#### Test 5.2: Filter by Event Type
1. Select "user.role_changed" from Event Type dropdown
2. **Expected**: Shows only role change events
3. **Should see**: The role change from Test 4.2

#### Test 5.3: View Log Details
1. Click on any audit log entry
2. **Expected**: Detail dialog/modal opens
3. **Should show**:
   - Full timestamp
   - Actor details (email, role)
   - Target details (email, role)
   - Changes (before → after) with diff highlighting
   - Reason (if provided)
   - Metadata (IP address, user agent, etc.)

#### Test 5.4: Date Range Filter
1. Set Start Date = Today - 7 days
2. Set End Date = Today
3. **Expected**: Shows logs from last 7 days
4. Clear filters
5. **Expected**: Shows all logs again

---

## Test 6: Security & Permissions

### Test 6.1: Try to Change Own Role
1. In User Management, find admin@gadgetcloud.io (yourself)
2. Try to click "Change Role"
3. **Expected**: Button is disabled OR action is blocked
4. If modal opens and you submit:
5. **Expected**: Error message "Cannot change your own role"

### Test 6.2: Try to Deactivate Admin
1. Try to deactivate admin@gadgetcloud.io (yourself)
2. **Expected**: Button disabled OR error message
3. **Should say**: "Cannot deactivate your own account" or similar

### Test 6.3: Logout and Re-login
1. Click Logout button
2. **Expected**: Redirect to login page
3. Login again as admin
4. **Expected**: Dashboard loads normally

---

## Test 7: Error Handling

### Test 7.1: Invalid Action
1. In browser console, try to call an API with expired token
2. **Expected**: Redirect to login page with error message

### Test 7.2: Network Error Simulation
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Try to load user list
4. **Expected**: Error message shown (not blank page)
5. Set back to "Online"
6. **Expected**: Retry or refresh works

---

## Test 8: Responsive Design

### Test 8.1: Mobile View
1. Press F12 to open DevTools
2. Click device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. **Expected**:
   - Navigation menu collapses to hamburger
   - Tables become scrollable
   - Cards stack vertically
   - Buttons remain clickable

### Test 8.2: Tablet View
1. Select "iPad" or "iPad Pro"
2. **Expected**:
   - Layout adapts to medium screen
   - 2-column card layout
   - Tables remain functional

---

## Test 9: Performance

### Test 9.1: Page Load Time
1. Open Network tab (F12)
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check "Load" time in bottom-left
4. **Expected**: < 3 seconds for dashboard load

### Test 9.2: Table Rendering
1. Navigate to User Management
2. Check time to render table
3. **Expected**: < 1 second for 5 users

---

## Test 10: Cross-Browser Testing

Test the same scenarios in:
- ✅ Chrome (primary)
- ✅ Firefox
- ✅ Safari (macOS)
- ✅ Edge

**Known Issues**:
- Document any browser-specific bugs
- Check console for polyfill warnings

---

## Known Issues from API Testing

1. **Get User Details Endpoint** (`GET /api/admin/users/{id}`)
   - Status: ❌ Returns 500 error
   - Impact: User detail modal may fail to load
   - Workaround: Table view still works
   - Fix needed: Check backend logs

---

## Checklist Summary

Use this checklist during testing:

### Login & Navigation
- [ ] Login page loads without errors
- [ ] Admin login works with correct credentials
- [ ] Loading spinner shows during login
- [ ] Redirect to dashboard after login
- [ ] Navigation between pages works

### Dashboard
- [ ] User statistics display correctly (5 users)
- [ ] Metrics cards show proper values
- [ ] Quick actions buttons work
- [ ] No loading states stuck

### User Management
- [ ] User table loads with 5 users
- [ ] Search functionality works
- [ ] Role filter works
- [ ] Status filter works
- [ ] Clear filters resets all
- [ ] Pagination (if applicable)

### User Actions
- [ ] View user details (may fail - document)
- [ ] Change role modal opens
- [ ] Role change executes successfully
- [ ] Audit log created for role change
- [ ] Deactivate user works
- [ ] Reactivate user works
- [ ] Cannot change own role (security check)
- [ ] Cannot deactivate self (security check)

### Audit Logs
- [ ] Audit log page loads
- [ ] Shows 8+ log entries
- [ ] Filter by event type works
- [ ] Log detail modal opens
- [ ] Date range filter works
- [ ] Diff highlighting shows changes

### Responsive & Performance
- [ ] Mobile view works (iPhone)
- [ ] Tablet view works (iPad)
- [ ] Desktop view works
- [ ] Page load < 3 seconds
- [ ] No console errors

---

## Reporting Issues

If you find bugs, document:
1. **What you did** (steps to reproduce)
2. **What you expected** (expected result)
3. **What happened** (actual result)
4. **Browser** (Chrome 120, Firefox 121, etc.)
5. **Screenshot** (if applicable)
6. **Console errors** (F12 → Console tab)
7. **Network errors** (F12 → Network tab, filter failed requests)

---

## Success Criteria

Admin panel is considered **ready for production** if:
- ✅ All login and navigation works
- ✅ Dashboard shows correct statistics
- ✅ User list loads and displays all users
- ✅ Search and filters work correctly
- ✅ Role change workflow completes successfully
- ✅ Audit logs are created and viewable
- ✅ Security checks prevent self-modification
- ✅ No critical console errors
- ✅ Responsive design works on mobile/tablet
- ✅ Performance is acceptable (< 3s page loads)

---

## Next Steps After Testing

1. **Document all findings** in a test results file
2. **Fix critical bugs** identified during testing
3. **Create GitHub issues** for non-critical bugs
4. **Update documentation** with any discovered limitations
5. **Plan production deployment** if all tests pass

---

**Test URL**: https://gadgetcloud-stg.web.app
**Admin Login**: admin@gadgetcloud.io / Admin123!
**Backend API**: https://gc-py-backend-198991430816.asia-south1.run.app/api
**Test Date**: 2025-12-27

**Happy Testing!** 🧪
