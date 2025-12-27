# GadgetCloud Testing Guide - Phase 7

## Overview
This guide covers end-to-end testing of the GadgetCloud multi-role management system before production deployment.

## Test Environment Setup

### Prerequisites
- Backend running: `http://localhost:8000`
- Frontend running: `http://localhost:4200`
- Test users created in Firestore
- Permissions seeded

### Test User Accounts

| Role | Email | Purpose |
|------|-------|---------|
| Admin | admin@gadgetcloud.io | Full admin access |
| Partner | testcustomer@example.com | Repair partner (role changed to partner) |
| Support | (create new) | Support team member |
| Customer | (existing) | Regular customer |

---

## Test Suite 1: Role-Specific Dashboards

### Test 1.1: Admin Dashboard
**URL**: `http://localhost:4200/admin/dashboard`

**Steps:**
1. Login as admin@gadgetcloud.io
2. Verify dashboard displays:
   - ✅ Total Users: 2
   - ✅ Active Users: 2
   - ✅ Recent Signups: 2
   - ✅ Total Audit Logs: 8+
3. Click "Manage Users" → should navigate to `/admin/users`
4. Click "View Logs" → should navigate to `/admin/audit-logs`

**Expected**: All metrics load, quick actions work, no errors

---

### Test 1.2: Partner Dashboard
**URL**: `http://localhost:4200/partner/dashboard`

**Steps:**
1. Logout if logged in
2. Login as testcustomer@example.com (partner role)
3. Verify dashboard displays:
   - ✅ Dark industrial theme
   - ✅ Metrics: Total Repairs (87), Pending (12), Completed (64), Revenue ($15,240)
   - ✅ Repair Queue with 5 items
   - ✅ Inventory Status with stock gauges
   - ✅ Quick Actions buttons
4. Hover over repair items → should highlight
5. Check inventory "Screen Protectors" → should show low stock warning

**Expected**: Dark theme loads, all mock data displays correctly, animations work

---

### Test 1.3: Support Dashboard
**URL**: `http://localhost:4200/support/dashboard`

**Steps:**
1. Logout and login as support user (or create one)
2. Verify dashboard displays:
   - ✅ Light, bright theme (opposite of partner)
   - ✅ Waving emoji animation (👋)
   - ✅ Metrics: Open (8), Pending (15), Resolved (23), Avg Time (2.5h)
   - ✅ Ticket Queue with 6 tickets
   - ✅ Priority badges (urgent=red, high=orange)
   - ✅ Recent Activity feed
4. Hover over ticket cards → should highlight and slide
5. Verify urgent tickets have red priority badges

**Expected**: Light theme loads, friendly vibe, all data displays, animations smooth

---

### Test 1.4: Customer Dashboard
**URL**: `http://localhost:4200/customer/dashboard`

**Steps:**
1. Login as regular customer
2. Verify items display (existing functionality)

**Expected**: Customer dashboard loads without errors

---

## Test Suite 2: Admin User Management

### Test 2.1: View Users
**URL**: `http://localhost:4200/admin/users`

**Steps:**
1. Login as admin
2. Navigate to User Management
3. Verify table shows all users
4. Try search: type "test" → should filter
5. Try role filter: select "partner" → should filter
6. Try status filter: select "active" → should filter
7. Click "Clear Filters" → should reset

**Expected**: All filters work, table updates correctly

---

### Test 2.2: Change User Role
**Steps:**
1. In User Management, click "Change Role" on a user
2. Select new role (e.g., customer → support)
3. Enter reason: "Testing role change functionality"
4. Click "Confirm"
5. Verify success message
6. Check audit logs for entry

**Expected**:
- Role changes successfully
- Audit log created with reason
- User table updates

---

### Test 2.3: Deactivate User
**Steps:**
1. In User Management, click "Deactivate" on an active user
2. Enter reason: "Testing deactivation"
3. Confirm
4. Verify user status changes to "Inactive"
5. Try logging in as that user → should fail

**Expected**: User deactivated, cannot login

---

### Test 2.4: Reactivate User
**Steps:**
1. Click "Reactivate" on inactive user
2. Confirm
3. Verify status changes to "Active"
4. User should be able to login again

**Expected**: User reactivated successfully

---

## Test Suite 3: Audit Logs

### Test 3.1: View Audit Logs
**URL**: `http://localhost:4200/admin/audit-logs`

**Steps:**
1. Login as admin
2. Navigate to Audit Logs
3. Verify timeline displays with:
   - ✅ Color-coded event dots
   - ✅ Event type badges
   - ✅ Actor and target information
   - ✅ Change summaries
4. Scroll through logs → check for performance

**Expected**: All logs display, smooth scrolling, no lag

---

### Test 3.2: Audit Log Detail Dialog
**Steps:**
1. Click on any audit log entry
2. Verify detail dialog shows:
   - ✅ Event header with color coding
   - ✅ Full timestamp (date, time, ISO)
   - ✅ Actor section (ID, email)
   - ✅ Target section (if applicable)
   - ✅ Changes with diff highlighting (red/green)
   - ✅ Reason (if provided)
   - ✅ Event ID
3. Click "Close" → dialog closes

**Expected**: All details display correctly, diff highlighting works

---

### Test 3.3: Filter Audit Logs
**Steps:**
1. Try event type filter: select "user.role_changed"
2. Verify only role change events show
3. Try date range: select start/end dates
4. Verify logs filter by date
5. Try user search: type email
6. Click "Clear Filters"

**Expected**: All filters work correctly

---

## Test Suite 4: Permission Enforcement

### Test 4.1: Non-Admin Access to Admin Panel
**Steps:**
1. Logout and login as customer
2. Try to navigate to `http://localhost:4200/admin/dashboard`

**Expected**:
- Redirected to `/unauthorized` or login
- Cannot access admin features
- Console shows permission denied

---

### Test 4.2: Support Access to Audit Logs
**Steps:**
1. Login as support user
2. Navigate to `/admin/audit-logs`

**Expected**:
- Support CAN view audit logs (per permissions)
- Can see own actions
- Cannot modify settings

---

### Test 4.3: Customer Access to Admin Features
**Steps:**
1. Login as customer
2. Try accessing:
   - `/admin/users` → should block
   - `/admin/audit-logs` → should block

**Expected**: All blocked with 403 or redirect

---

## Test Suite 5: Security Tests

### Test 5.1: Admin Cannot Change Own Role
**Steps:**
1. Login as admin
2. Go to User Management
3. Try to change own role

**Expected**:
- Backend should block (500 error or validation)
- Or UI should disable button for own user

---

### Test 5.2: Admin Cannot Deactivate Another Admin
**Steps:**
1. Create second admin user
2. Try to deactivate the second admin

**Expected**: Backend blocks this action

---

### Test 5.3: Deactivated User Cannot Login
**Steps:**
1. Deactivate a user
2. Logout
3. Try logging in as that user

**Expected**: Login fails with appropriate message

---

## Test Suite 6: Cross-Browser Testing

### Browsers to Test
- ✅ Chrome/Chromium (primary)
- ✅ Firefox
- ✅ Safari (Mac)
- ✅ Edge

### Test Each Browser
1. Login flow
2. Dashboard display
3. Admin features
4. Audit logs
5. Responsive design (resize window)

---

## Test Suite 7: Mobile Responsive

### Test Devices
- iPhone (iOS Safari)
- Android (Chrome)
- iPad (tablet view)

### Verify
- All dashboards render correctly
- Tables are scrollable/responsive
- Buttons are touchable
- No horizontal scroll
- Modals fit screen

---

## Test Suite 8: Performance

### Metrics to Check
- Dashboard load time: < 2 seconds
- User list load (100 users): < 1 second
- Audit log load (10,000 entries): < 2 seconds
- Permission check: < 50ms
- No memory leaks (check DevTools)

### Tools
- Chrome DevTools → Network tab
- Chrome DevTools → Performance tab
- Lighthouse audit score: > 90

---

## Test Suite 9: Error Handling

### Test Error Scenarios
1. Backend offline → show friendly error
2. Invalid credentials → clear error message
3. Network timeout → retry mechanism
4. Invalid data → validation messages
5. 403 Forbidden → redirect to unauthorized
6. 404 Not Found → show not found page

---

## Test Suite 10: End-to-End User Flow

### Complete Scenario
1. Admin logs in
2. Views dashboard statistics
3. Navigates to User Management
4. Changes a user's role from customer → partner
5. Verifies audit log entry created
6. Logs out
7. Logs in as the changed user (now partner)
8. Sees partner dashboard (dark industrial theme)
9. Verifies repair queue displays
10. Logs out
11. Admin logs back in
12. Views audit logs
13. Finds the role change entry
14. Opens detail dialog
15. Verifies all information is correct

**Expected**: Entire flow works smoothly, no errors, data consistent

---

## Automated Testing (Future)

### Unit Tests
```bash
# Run Angular unit tests
ng test

# Run backend unit tests
pytest
```

### E2E Tests
```bash
# Run Playwright tests
npx playwright test
```

---

## Sign-Off Checklist

Before proceeding to deployment:

- [ ] All Test Suite 1 tests pass (Dashboards)
- [ ] All Test Suite 2 tests pass (User Management)
- [ ] All Test Suite 3 tests pass (Audit Logs)
- [ ] All Test Suite 4 tests pass (Permissions)
- [ ] All Test Suite 5 tests pass (Security)
- [ ] All Test Suite 6 tests pass (Cross-browser)
- [ ] All Test Suite 7 tests pass (Mobile)
- [ ] All Test Suite 8 tests pass (Performance)
- [ ] All Test Suite 9 tests pass (Errors)
- [ ] All Test Suite 10 tests pass (E2E)
- [ ] No console errors in production build
- [ ] No TypeScript errors
- [ ] All dependencies up to date
- [ ] Environment variables configured
- [ ] Backend API endpoints tested
- [ ] Firestore indexes created
- [ ] Permissions seeded correctly

---

## Known Issues

Document any known issues here before deployment:

1. **ExpressionChangedAfterItHasBeenCheckedError** in development mode (acceptable, doesn't affect production)
2. **Mock data** - Replace with real API calls before production
3. **Partner/Support dashboard actions** - Need real implementation (currently console.log)

---

## Next Steps

Once all tests pass:
1. Review DEPLOYMENT_GUIDE.md
2. Deploy to staging environment
3. Run smoke tests on staging
4. Deploy to production
5. Monitor for errors
