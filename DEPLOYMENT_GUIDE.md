# GadgetCloud Deployment Guide - Phase 7

## Overview
This guide covers deploying the GadgetCloud multi-role management system to staging and production environments.

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved (`ng build --configuration production`)
- [ ] All tests passing (see TESTING_GUIDE.md)
- [ ] No console errors in production build
- [ ] Code reviewed and approved
- [ ] Git commits pushed to main branch
- [ ] Version tagged (e.g., `v1.0.0`)

### Configuration
- [ ] Environment variables configured
- [ ] API endpoints correct for each environment
- [ ] Firebase project IDs correct
- [ ] GCP project IDs correct
- [ ] Secrets stored in Secret Manager

### Database
- [ ] Firestore collections created
- [ ] Composite indexes created
- [ ] Permissions seeded
- [ ] Test data cleaned up

---

## Environment Setup

### Staging Environment
- **GCP Project**: `gadgetcloud-stg`
- **Firebase Project**: `gadgetcloud-stg`
- **Frontend URL**: `https://gadgetcloud-app-stg.web.app`
- **Backend URL**: `https://api-stg.gadgetcloud.io`

### Production Environment
- **GCP Project**: `gadgetcloud-prd`
- **Firebase Project**: `gadgetcloud-prd`
- **Frontend URL**: `https://my.gadgetcloud.io`
- **Backend URL**: `https://rest.gadgetcloud.io`

---

## Part 1: Database Setup

### Step 1: Create Firestore Collections

#### Staging
```bash
# Set project
gcloud config set project gadgetcloud-stg

# Collections are created automatically on first write
# But we can verify they exist
gcloud firestore databases list
```

#### Production
```bash
gcloud config set project gadgetcloud-prd
gcloud firestore databases list
```

### Step 2: Create Composite Indexes

**Required Indexes:**

1. **gc-audit-logs**
   - eventType (ASC) + timestamp (DESC)
   - actorId (ASC) + timestamp (DESC)
   - targetId (ASC) + timestamp (DESC)

2. **gc-users**
   - role (ASC) + status (ASC) + createdAt (DESC)
   - status (ASC) + createdAt (DESC)

**Create via Firebase Console:**
1. Go to Firestore → Indexes
2. Click "Create Index"
3. Add composite fields as listed above
4. Wait 10-15 minutes for indexes to build

**Or via firestore.indexes.json:**
```json
{
  "indexes": [
    {
      "collectionGroup": "gc-audit-logs",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "eventType", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```

Deploy:
```bash
firebase deploy --only firestore:indexes
```

### Step 3: Seed Permissions

#### Staging
```bash
cd gc-py-backend
export GOOGLE_APPLICATION_CREDENTIALS="path/to/staging-key.json"
python3 scripts/seed_permissions.py
```

#### Production
```bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/production-key.json"
python3 scripts/seed_permissions.py
```

**Verify:**
```bash
python3 scripts/check_firestore.py --collection gc-permissions
```

Expected output:
```
✓ customer     - 3 resources configured
✓ partner      - 5 resources configured
✓ support      - 6 resources configured
✓ admin        - 10 resources configured
```

---

## Part 2: Backend Deployment

### Step 1: Update Environment Configuration

**staging (`gc-py-backend/.env.staging`):**
```bash
ENVIRONMENT=staging
GCP_PROJECT=gadgetcloud-stg
FIRESTORE_DATABASE=(default)
JWT_SECRET_NAME=jwt-secret-key
CORS_ORIGINS=https://gadgetcloud-app-stg.web.app
```

**production (`gc-py-backend/.env.production`):**
```bash
ENVIRONMENT=production
GCP_PROJECT=gadgetcloud-prd
FIRESTORE_DATABASE=(default)
JWT_SECRET_NAME=jwt-secret-key-prd
CORS_ORIGINS=https://my.gadgetcloud.io,https://partner.gadgetcloud.io,https://support.gadgetcloud.io,https://admin.gadgetcloud.io
```

### Step 2: Build and Test Locally

```bash
cd gc-py-backend

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest

# Run linter
ruff check .
mypy .

# Test locally
uvicorn app.main:app --reload
```

### Step 3: Deploy to Cloud Run (Staging)

```bash
# Set project
gcloud config set project gadgetcloud-stg

# Build and deploy
gcloud run deploy gc-py-backend \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --timeout 300 \
  --set-env-vars ENVIRONMENT=staging,GCP_PROJECT=gadgetcloud-stg \
  --service-account gc-py-backend-sa@gadgetcloud-stg.iam.gserviceaccount.com

# Get URL
gcloud run services describe gc-py-backend --region asia-south1 --format 'value(status.url)'
```

### Step 4: Deploy to Cloud Run (Production)

```bash
gcloud config set project gadgetcloud-prd

gcloud run deploy gc-py-backend \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 50 \
  --memory 1Gi \
  --timeout 300 \
  --set-env-vars ENVIRONMENT=production,GCP_PROJECT=gadgetcloud-prd \
  --service-account gc-py-backend-sa@gadgetcloud-prd.iam.gserviceaccount.com
```

### Step 5: Verify Backend

```bash
# Check health
curl https://YOUR-BACKEND-URL/health

# Check API docs
open https://YOUR-BACKEND-URL/api/docs

# Test authentication
curl -X POST https://YOUR-BACKEND-URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gadgetcloud.io","password":"your-password"}'
```

---

## Part 3: Frontend Deployment

### Step 1: Update Environment Configuration

**staging (`src/environments/environment.staging.ts`):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://YOUR-STAGING-BACKEND-URL/api',
  firebaseConfig: {
    projectId: 'gadgetcloud-stg',
    // ... other config
  }
};
```

**production (`src/environments/environment.prod.ts`):**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://rest.gadgetcloud.io/api',
  firebaseConfig: {
    projectId: 'gadgetcloud-prd',
    // ... other config
  }
};
```

### Step 2: Build for Production

```bash
cd gc-ng-app

# Install dependencies
npm install

# Build for staging
ng build --configuration=staging

# Build for production
ng build --configuration=production
```

**Verify build:**
- Check `dist/` folder created
- No build errors
- Bundle size reasonable (< 5MB)

### Step 3: Deploy to Firebase Hosting (Staging)

```bash
# Set Firebase project
firebase use gadgetcloud-stg

# Deploy
firebase deploy --only hosting:gadgetcloud-app-stg

# Get URL
firebase hosting:channel:open live --site gadgetcloud-app-stg
```

### Step 4: Deploy to Firebase Hosting (Production)

```bash
# Set Firebase project
firebase use gadgetcloud-prd

# Deploy to production
firebase deploy --only hosting:gadgetcloud-app-prd

# Verify deployment
open https://my.gadgetcloud.io
```

---

## Part 4: Post-Deployment Verification

### Smoke Tests (Staging)

1. **Frontend loads**
   ```bash
   curl -I https://gadgetcloud-app-stg.web.app
   # Expect: 200 OK
   ```

2. **Backend health check**
   ```bash
   curl https://YOUR-STAGING-BACKEND/health
   # Expect: {"status":"healthy"}
   ```

3. **Login flow**
   - Open staging URL
   - Login as admin
   - Verify dashboard loads

4. **Key features**
   - View users
   - Change a user role
   - Check audit logs
   - Switch between dashboards

### Smoke Tests (Production)

Same as staging, but on production URLs.

### Monitor for Errors

**Cloud Logging (Backend):**
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=gc-py-backend" \
  --limit 50 \
  --format json \
  --project gadgetcloud-prd
```

**Browser Console (Frontend):**
- Open DevTools
- Check Console tab for errors
- Check Network tab for failed requests

---

## Part 5: Rollback Procedure

### If Deployment Fails

**Backend Rollback:**
```bash
# List revisions
gcloud run revisions list --service gc-py-backend --region asia-south1

# Rollback to previous revision
gcloud run services update-traffic gc-py-backend \
  --to-revisions PREVIOUS-REVISION=100 \
  --region asia-south1
```

**Frontend Rollback:**
```bash
# Firebase Hosting keeps previous versions
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

**Database Rollback:**
- Use PITR (Point-in-Time Recovery) if enabled
- Restore from backup

---

## Part 6: Production Deployment Checklist

### Pre-Deployment (T-1 day)
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Staging tested and approved
- [ ] Firestore indexes created (allow 24h for building)
- [ ] Permissions seeded in production
- [ ] Backup current production database
- [ ] Notify users of maintenance window

### Deployment Day
- [ ] Set maintenance mode (optional)
- [ ] Deploy backend to Cloud Run
- [ ] Verify backend health
- [ ] Deploy frontend to Firebase Hosting
- [ ] Verify frontend loads
- [ ] Run smoke tests
- [ ] Check logs for errors
- [ ] Verify all dashboards work
- [ ] Test login/logout flow
- [ ] Test admin features
- [ ] Check audit logs creation
- [ ] Verify permissions enforcement
- [ ] Remove maintenance mode
- [ ] Monitor for 1 hour

### Post-Deployment (T+1 day)
- [ ] Review Cloud Logging for errors
- [ ] Check performance metrics
- [ ] Verify no user complaints
- [ ] Document any issues
- [ ] Update changelog

---

## Part 7: Monitoring Setup

### Cloud Monitoring Dashboards

**Create dashboard for:**
- Cloud Run request count
- Cloud Run latency (P50, P95, P99)
- Error rate
- Memory usage
- CPU utilization

### Alerts

**Create alerts for:**
- Error rate > 1%
- P95 latency > 2 seconds
- 5xx errors
- Memory usage > 80%
- CPU usage > 80%

**Alert Channels:**
- Email
- Slack (optional)
- PagerDuty (optional)

---

## Part 8: Maintenance

### Regular Tasks

**Daily:**
- Check Cloud Logging for errors
- Monitor performance metrics

**Weekly:**
- Review user feedback
- Check security advisories
- Update dependencies (if needed)

**Monthly:**
- Review audit logs
- Database cleanup (if needed)
- Performance optimization

---

## Part 9: Scaling Considerations

### Current Limits
- Cloud Run: 1-50 instances (production)
- Firestore: ~10k ops/second per collection
- Firebase Hosting: Unlimited requests

### When to Scale
- Cloud Run instances reaching max
- Firestore hitting quotas
- Response times increasing

### Scaling Strategy
1. Increase Cloud Run max instances
2. Add Firestore composite indexes
3. Enable caching (Redis/Memorystore)
4. Add CDN caching
5. Optimize queries

---

## Cost Estimates

### Staging (low traffic)
- Cloud Run: ~$10-20/month
- Firestore: ~$5-10/month
- Firebase Hosting: Free tier
- **Total: ~$20-40/month**

### Production (medium traffic)
- Cloud Run: ~$100-200/month
- Firestore: ~$50-100/month
- Firebase Hosting: Free tier
- Cloud Logging: ~$20-30/month
- **Total: ~$180-330/month**

---

## Support Contacts

**GCP Support:** https://console.cloud.google.com/support
**Firebase Support:** https://firebase.google.com/support
**Documentation:** See README.md, architecture.md

---

## Deployment Log Template

```markdown
## Deployment: v1.0.0 - 2025-12-27

**Deployed By:** [Your Name]
**Environment:** Production
**Time:** 14:00 UTC

### Changes
- Implemented multi-role management system
- Added partner dashboard
- Added support dashboard
- Added admin user management
- Added audit log viewer

### Database Changes
- Created gc-permissions collection
- Created gc-audit-logs collection
- Added composite indexes

### Verification
- [x] Backend health check passed
- [x] Frontend loads correctly
- [x] Login flow works
- [x] All dashboards functional
- [x] Permissions enforced
- [x] Audit logs created

### Issues
- None

### Rollback Plan
- Revert to Cloud Run revision: gc-py-backend.123
- Revert Firebase Hosting to previous deployment
```

---

## Next Steps After Deployment

1. **Monitor metrics** for 24-48 hours
2. **Gather user feedback** from early adopters
3. **Create user documentation** for each role
4. **Plan Phase 8**: Future enhancements (if needed)
5. **Celebrate!** 🎉

---

**Deployment is complete when:**
- All systems green in monitoring
- No critical errors in logs
- Users can access all features
- Performance meets SLAs
- Security tests pass
