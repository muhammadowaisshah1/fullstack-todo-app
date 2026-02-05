# 🚀 MANUAL BACKEND DEPLOYMENT GUIDE (Render.com)

## ⚡ Quick Deploy - 10 Minutes

Since the automated deployment encountered authentication issues, follow these steps to deploy manually via the Render dashboard.

---

## 📋 Prerequisites

- GitHub account with your backend code pushed
- Render.com account (free tier available)
- Backend repository: `https://github.com/muhammadowaisshah1/todo_app_backend_code`

---

## 🔧 Step-by-Step Deployment

### Step 1: Access Render Dashboard

1. Go to https://dashboard.render.com
2. Sign in with your GitHub account
3. Click **"New +"** button in the top right
4. Select **"Web Service"**

---

### Step 2: Connect Repository

1. **Connect GitHub Repository**
   - If first time: Click "Connect GitHub" and authorize Render
   - Search for: `todo_app_backend_code`
   - Click **"Connect"**

2. **Repository Settings**
   - Repository: `muhammadowaisshah1/todo_app_backend_code`
   - Branch: `main`

---

### Step 3: Configure Service

Fill in the following settings:

**Basic Settings:**
```
Name: todo-api-backend
Region: Oregon (US West) or closest to your users
Branch: main
Root Directory: (leave empty or use "backend" if repo has multiple folders)
Runtime: Python 3
```

**Build & Deploy:**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Plan:**
```
Instance Type: Free
```

---

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add each of these variables:

```bash
# Database Configuration
DATABASE_URL=postgresql+psycopg://neondb_owner:npg_JIVLmKzCs30W@ep-bold-surf-ah3dx6q5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Authentication Secret
BETTER_AUTH_SECRET=UU0V8CQWto33dvA8n5QXLFaiG/pZqHfmM1rEqMUU76Q=

# CORS Origins (UPDATED with Vercel URLs)
CORS_ORIGINS=http://localhost:3000,https://frontend-psi-ten-81.vercel.app,https://frontend-muhammad-owais-shahs-projects.vercel.app,https://frontend-muhammadowaisshah1-muhammad-owais-shahs-projects.vercel.app

# Application Configuration
DEBUG=false
JWT_ALGORITHM=HS256
JWT_EXPIRY_DAYS=7
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
APP_NAME=Todo API
APP_VERSION=1.0.0
```

**⚠️ IMPORTANT**: Copy each variable exactly as shown above.

---

### Step 5: Configure Health Check

Scroll down to **"Health Check Path"**:
```
/health
```

This tells Render to check if your backend is running by hitting the `/health` endpoint.

---

### Step 6: Deploy

1. Review all settings
2. Click **"Create Web Service"**
3. Wait for deployment (5-10 minutes)
4. Watch the build logs for any errors

---

## ✅ Verify Deployment

### Check Build Logs

Watch the logs in real-time:
- Look for: `Application startup complete`
- Look for: `Uvicorn running on http://0.0.0.0:8000`

### Test Health Endpoint

Once deployed, you'll get a URL like:
```
https://todo-api-backend-xxxx.onrender.com
```

Test it:
```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{"status": "healthy"}
```

### Test API Root

```bash
curl https://your-backend-url.onrender.com/
```

Expected response:
```json
{
  "status": "healthy",
  "app_name": "Todo API",
  "version": "1.0.0",
  "timestamp": "2024-02-05T..."
}
```

---

## 🔄 Update Frontend with Backend URL

After backend is deployed, update your frontend environment variable:

1. Go to Vercel Dashboard
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```
5. Redeploy frontend (or it will auto-deploy on next push)

---

## 🧪 Test Full Application

1. **Visit Frontend**: https://frontend-psi-ten-81.vercel.app
2. **Sign Up**: Create a new account
3. **Create Task**: Add a new todo item
4. **Complete Task**: Mark a task as done
5. **Edit Task**: Update task details
6. **Delete Task**: Remove a task

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Could not find requirements.txt"**
- Solution: Set Root Directory to `backend` if your repo has multiple folders

**Error: "Module not found"**
- Solution: Check requirements.txt has all dependencies
- Verify Python version is 3.11+

### Database Connection Fails

**Error: "Could not connect to database"**
- Solution: Verify DATABASE_URL is correct
- Ensure `?sslmode=require` is at the end
- Check Neon database is active

### CORS Errors

**Error: "CORS policy blocked"**
- Solution: Verify CORS_ORIGINS includes all Vercel URLs
- Redeploy backend after updating CORS
- Check browser console for exact origin being blocked

### Health Check Fails

**Error: "Health check failed"**
- Solution: Verify `/health` endpoint exists
- Check logs for startup errors
- Ensure port 8000 is being used

---

## 📊 Monitor Your Backend

### View Logs
- Render Dashboard → Your Service → Logs
- Real-time log streaming
- Filter by error level

### Check Metrics
- Dashboard → Metrics tab
- CPU usage
- Memory usage
- Request count

### Set Up Alerts
- Dashboard → Settings → Notifications
- Email alerts for failures
- Slack integration available

---

## 🔒 Security Checklist

- [x] BETTER_AUTH_SECRET is 32+ characters
- [x] DATABASE_URL uses SSL (`?sslmode=require`)
- [x] DEBUG is set to `false`
- [x] CORS_ORIGINS only includes your frontend URLs
- [x] No secrets in git repository

---

## 🎉 Success Indicators

Your backend is successfully deployed when:
- ✅ Build completes without errors
- ✅ Health check returns 200 OK
- ✅ Database connection works
- ✅ Frontend can authenticate users
- ✅ CRUD operations work from frontend

---

## 📞 Need Help?

**Common Issues:**
- Build errors: Check Python version and requirements.txt
- Database errors: Verify connection string format
- CORS errors: Update CORS_ORIGINS and redeploy
- Port errors: Ensure using $PORT environment variable

**Render Documentation:**
- https://render.com/docs/web-services
- https://render.com/docs/deploy-fastapi

---

## 🔄 Continuous Deployment

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will detect the push and redeploy automatically.

---

## ✅ Deployment Complete!

Once deployed, your backend URL will be:
```
https://todo-api-backend-xxxx.onrender.com
```

Update this URL in your frontend's `NEXT_PUBLIC_API_URL` environment variable.
