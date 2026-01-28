# START HERE - Complete Deployment Guide

## Current Status

| Component | Status | URL |
|-----------|--------|-----|
| **Frontend** | ✅ DEPLOYED | https://frontend-psi-ten-81.vercel.app |
| **Database** | ✅ CONNECTED | Neon PostgreSQL (active) |
| **Backend** | ⏳ PENDING | Needs deployment to Render |

---

## What You Need to Do Now

### STEP 1: Deploy Backend to Render (15 minutes)

#### 1.1 Access Render Dashboard
- Open: **https://dashboard.render.com/**
- Sign in with: **syedowaisshahshah@gmail.com**

#### 1.2 Create New Web Service
1. Click **"New +"** button (top right corner)
2. Select **"Web Service"**

#### 1.3 Choose Deployment Method

**Option A: If you have GitHub repository**
- Click "Connect account" to link GitHub
- Select your repository
- Click "Connect"

**Option B: If no GitHub repository (Recommended for now)**
- Select "Deploy without Git" or "Public Git repository"
- You can deploy manually by uploading files

**Option C: Create GitHub repo first**
```bash
# 1. Go to https://github.com/new
# 2. Create repository: hackathon-todo-app
# 3. Then run:
cd "D:\hackathoons\Hackthon_Full-Stack_App"
git remote set-url origin https://github.com/YOUR_USERNAME/hackathon-todo-app.git
git push -u origin 001-fullstack-todo-app
# 4. Then connect via Render dashboard
```

#### 1.4 Configure Service Settings

**Basic Configuration:**
```
Name: todo-api-backend
Region: Oregon (US West)
Branch: 001-fullstack-todo-app
Root Directory: backend
Runtime: Python 3
```

**Build & Start Commands:**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Instance:**
```
Plan: Free
```

**Health Check:**
```
Health Check Path: /health
```

#### 1.5 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Copy and paste these exactly:

```
DATABASE_URL
postgresql://neondb_owner:npg_JIVLmKzCs30W@ep-bold-surf-ah3dx6q5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

BETTER_AUTH_SECRET
iQqaa/xGZmT9Gb0Jh4KEvMJVXghH82rxBk6tqPOsqgQ=

CORS_ORIGINS
https://frontend-psi-ten-81.vercel.app,http://localhost:3000

DEBUG
false

JWT_ALGORITHM
HS256

JWT_EXPIRY_DAYS
7
```

#### 1.6 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes (watch the build logs)
3. Once deployed, you'll see: **"Your service is live at https://todo-api-backend.onrender.com"**
4. **COPY THIS URL** - you'll need it for Step 2

#### 1.7 Verify Backend is Working
```bash
# Test health endpoint
curl https://YOUR-BACKEND-URL.onrender.com/health

# Should return: {"status":"healthy"}
```

---

### STEP 2: Update Frontend with Backend URL (3 minutes)

#### 2.1 Add Backend URL to Vercel

Open terminal and run:

```bash
cd "D:\hackathoons\Hackthon_Full-Stack_App\frontend"

# Add environment variable
vercel env add NEXT_PUBLIC_API_URL production --token K30Q70GGtJ3e7ognBDeTNE76
```

When prompted, enter your backend URL:
```
https://YOUR-BACKEND-URL.onrender.com
```

#### 2.2 Redeploy Frontend

```bash
vercel --prod --yes --token K30Q70GGtJ3e7ognBDeTNE76
```

Wait 1-2 minutes for deployment to complete.

---

### STEP 3: Test Your Application (5 minutes)

#### 3.1 Open Frontend
Visit: **https://frontend-psi-ten-81.vercel.app**

#### 3.2 Test User Registration
1. Click **"Sign Up"** tab
2. Enter:
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Sign Up"**
4. You should be redirected to the dashboard

#### 3.3 Test Task Creation
1. Click **"Add Task"** button
2. Enter:
   - Title: `Test Task`
   - Description: `Testing CRUD operations`
   - Category: `work`
   - Priority: `high`
   - Due Date: Select tomorrow's date
3. Click **"Create Task"**
4. Task should appear in the list

#### 3.4 Test Task Operations
- ✅ **Mark Complete**: Click checkbox to toggle completion
- ✏️ **Edit Task**: Click edit icon, modify, save
- 🗑️ **Delete Task**: Click delete icon, confirm
- 🔍 **Search**: Use search bar to filter tasks
- 🎨 **Theme**: Toggle dark/light mode

#### 3.5 Test Authentication
1. Click **"Logout"**
2. Try to access dashboard directly: should redirect to login
3. Login again with same credentials
4. Your tasks should still be there

---

## Troubleshooting

### Backend Build Fails on Render
**Problem**: Build fails with dependency errors

**Solution**:
1. Check build logs for specific error
2. Verify `requirements.txt` is in backend directory
3. Ensure all dependencies are compatible
4. Try adding `--no-cache-dir` to build command:
   ```
   pip install --no-cache-dir -r requirements.txt
   ```

### Backend Health Check Fails
**Problem**: Service shows "Unhealthy"

**Solution**:
1. Check application logs in Render dashboard
2. Verify start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Ensure `main.py` exists in backend directory
4. Check that health endpoint `/health` is accessible

### Frontend Can't Connect to Backend
**Problem**: CORS errors or "Network Error" in browser console

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is set in Vercel:
   ```bash
   vercel env ls production --token K30Q70GGtJ3e7ognBDeTNE76
   ```
2. Check backend CORS_ORIGINS includes frontend URL
3. Ensure backend URL has no trailing slash
4. Redeploy both frontend and backend

### Database Connection Error
**Problem**: Backend logs show "could not connect to database"

**Solution**:
1. Verify DATABASE_URL is copied exactly (no extra spaces)
2. Check Neon database is active: https://console.neon.tech/
3. Ensure SSL mode is `require` in connection string
4. Test connection from Render shell:
   ```bash
   python -c "import psycopg; psycopg.connect('$DATABASE_URL')"
   ```

### Authentication Not Working
**Problem**: Can't login or register

**Solution**:
1. Check browser console for errors
2. Verify BETTER_AUTH_SECRET is set in backend
3. Clear browser localStorage:
   ```javascript
   localStorage.clear()
   ```
4. Try registering with a new email

---

## Quick Reference

### Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | https://frontend-psi-ten-81.vercel.app | Live application |
| Backend | https://YOUR-BACKEND-URL.onrender.com | API server |
| Backend Docs | https://YOUR-BACKEND-URL.onrender.com/docs | API documentation |
| Vercel Dashboard | https://vercel.com/muhammad-owais-shahs-projects/frontend | Frontend monitoring |
| Render Dashboard | https://dashboard.render.com/ | Backend monitoring |
| Neon Console | https://console.neon.tech/ | Database monitoring |

### Environment Variables Summary

**Frontend (Vercel):**
- `NEXT_PUBLIC_API_URL` = Your backend URL

**Backend (Render):**
- `DATABASE_URL` = Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` = JWT secret key
- `CORS_ORIGINS` = Allowed frontend origins
- `DEBUG` = false (production)
- `JWT_ALGORITHM` = HS256
- `JWT_EXPIRY_DAYS` = 7

### Useful Commands

**View Frontend Logs:**
```bash
vercel logs https://frontend-psi-ten-81.vercel.app --token K30Q70GGtJ3e7ognBDeTNE76
```

**Test Backend Health:**
```bash
curl https://YOUR-BACKEND-URL.onrender.com/health
```

**Test Database Connection:**
```bash
cd backend
python -c "import psycopg; conn = psycopg.connect('YOUR_DATABASE_URL'); print('SUCCESS'); conn.close()"
```

---

## Completion Checklist

Use this checklist to track your progress:

- [ ] **Step 1.1**: Accessed Render dashboard
- [ ] **Step 1.2**: Created new web service
- [ ] **Step 1.3**: Connected repository or chose deployment method
- [ ] **Step 1.4**: Configured service settings
- [ ] **Step 1.5**: Added all 6 environment variables
- [ ] **Step 1.6**: Clicked "Create Web Service" and deployment started
- [ ] **Step 1.7**: Backend deployed successfully and health check passes
- [ ] **Step 2.1**: Added NEXT_PUBLIC_API_URL to Vercel
- [ ] **Step 2.2**: Redeployed frontend
- [ ] **Step 3.1**: Opened frontend URL
- [ ] **Step 3.2**: Successfully registered new user
- [ ] **Step 3.3**: Successfully created task
- [ ] **Step 3.4**: Tested all CRUD operations
- [ ] **Step 3.5**: Tested authentication flow

---

## Success Criteria

Your deployment is complete when:

✅ Frontend loads without errors
✅ User registration works
✅ User login works
✅ Tasks can be created
✅ Tasks can be edited
✅ Tasks can be deleted
✅ Tasks can be marked complete
✅ Search and filters work
✅ Theme toggle works
✅ Logout and re-login preserves data

---

## Next Steps (Optional)

After successful deployment, consider:

1. **Custom Domain**: Configure custom domain in Vercel
2. **Monitoring**: Set up error tracking (Sentry, LogRocket)
3. **Analytics**: Add Vercel Analytics or Google Analytics
4. **Performance**: Enable Vercel Edge Functions
5. **Backup**: Set up automated database backups in Neon
6. **CI/CD**: Configure GitHub Actions for automated deployments

---

## Support

If you encounter issues:

1. **Check Documentation**:
   - `DEPLOYMENT_SUMMARY.md` - Complete reference
   - `DEPLOYMENT.md` - Detailed guide
   - `QUICK_START_BACKEND.md` - Backend-specific guide

2. **Check Logs**:
   - Vercel: Dashboard → Logs
   - Render: Dashboard → Logs
   - Browser: Developer Console (F12)

3. **Verify Configuration**:
   - Environment variables are set correctly
   - URLs have no typos or trailing slashes
   - Services are running (not sleeping)

4. **Test Components Individually**:
   - Backend health: `curl https://YOUR-BACKEND-URL.onrender.com/health`
   - Database: Check Neon console
   - Frontend: Check browser console for errors

---

**Deployment Guide Created**: 2026-01-28
**Estimated Total Time**: 20-30 minutes
**Difficulty**: Beginner-friendly

**Good luck with your deployment! 🚀**
