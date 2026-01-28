# Quick Start Guide - Backend Deployment to Render

## Prerequisites
- Render account: https://dashboard.render.com/
- Backend code ready in: D:\hackathoons\Hackthon_Full-Stack_App\backend

## 5-Minute Deployment Steps

### Step 1: Access Render Dashboard
1. Open browser and go to: **https://dashboard.render.com/**
2. Sign in with: syedowaisshahshah@gmail.com

### Step 2: Create Web Service
1. Click the **"New +"** button (top right)
2. Select **"Web Service"**
3. Choose **"Build and deploy from a Git repository"** OR **"Deploy from GitHub"**

### Step 3: Connect Repository (Option A - Recommended)
If you have a GitHub repository:
1. Click "Connect account" to link GitHub
2. Select repository: `hackathon-todo-app`
3. Click "Connect"

**OR**

### Step 3: Manual Git Deploy (Option B)
If no GitHub repository yet:
1. Select "Public Git repository"
2. Enter: `https://github.com/YOUR_USERNAME/hackathon-todo-app.git`
3. Or use "Deploy without Git" option

### Step 4: Configure Service

**Basic Settings:**
```
Name: todo-api-backend
Region: Oregon (US West)
Branch: 001-fullstack-todo-app (or main)
Root Directory: backend
Runtime: Python 3
```

**Build Settings:**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Instance Type:**
```
Plan: Free
```

### Step 5: Add Environment Variables

Click **"Advanced"** then **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_JIVLmKzCs30W@ep-bold-surf-ah3dx6q5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `BETTER_AUTH_SECRET` | `iQqaa/xGZmT9Gb0Jh4KEvMJVXghH82rxBk6tqPOsqgQ=` |
| `CORS_ORIGINS` | `https://frontend-psi-ten-81.vercel.app,http://localhost:3000` |
| `DEBUG` | `false` |
| `JWT_ALGORITHM` | `HS256` |
| `JWT_EXPIRY_DAYS` | `7` |

### Step 6: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Monitor build logs in real-time
4. Once deployed, copy your backend URL (e.g., `https://todo-api-backend.onrender.com`)

### Step 7: Verify Deployment

Open terminal and test:
```bash
# Test health endpoint
curl https://YOUR-BACKEND-URL.onrender.com/health

# Expected response:
# {"status":"healthy"}

# Test root endpoint
curl https://YOUR-BACKEND-URL.onrender.com/

# Expected response:
# {"status":"healthy","app_name":"Todo API","version":"1.0.0","timestamp":"..."}
```

### Step 8: Update Frontend

```bash
cd "D:\hackathoons\Hackthon_Full-Stack_App\frontend"

# Add backend URL to Vercel
vercel env add NEXT_PUBLIC_API_URL production --token K30Q70GGtJ3e7ognBDeTNE76
# When prompted, enter: https://YOUR-BACKEND-URL.onrender.com

# Redeploy frontend
vercel --prod --yes --token K30Q70GGtJ3e7ognBDeTNE76
```

### Step 9: Test Complete Application

1. Visit: **https://frontend-psi-ten-81.vercel.app**
2. Click **"Sign Up"**
3. Create account: test@example.com / password123
4. Create a new todo task
5. Test: Create, Read, Update, Delete operations
6. Verify categories, priorities, and due dates work

## Troubleshooting

### Build fails on Render
- Check build logs for specific error
- Verify `requirements.txt` is in backend directory
- Ensure Python version is compatible (3.9+)

### Health check fails
- Verify `Start Command` is correct: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Check that `main.py` exists in backend directory
- Review application logs for errors

### Database connection error
- Verify `DATABASE_URL` is copied correctly (no extra spaces)
- Ensure Neon database is active
- Check SSL mode is set to `require`

### CORS errors in browser
- Update `CORS_ORIGINS` to include frontend URL
- Ensure no trailing slashes in URLs
- Redeploy backend after updating

## Alternative: Deploy Without GitHub

If you don't have a GitHub repository:

1. **Create GitHub Repository First:**
   ```bash
   # Go to https://github.com/new
   # Create repository: hackathon-todo-app
   # Then push code:
   cd "D:\hackathoons\Hackthon_Full-Stack_App"
   git remote set-url origin https://github.com/YOUR_USERNAME/hackathon-todo-app.git
   git push -u origin 001-fullstack-todo-app
   ```

2. **Then follow Steps 1-9 above**

## Success Checklist

- [ ] Render service created
- [ ] Environment variables added
- [ ] Build completed successfully
- [ ] Health check returns 200 OK
- [ ] Backend URL copied
- [ ] Frontend environment updated
- [ ] Frontend redeployed
- [ ] Full application tested
- [ ] User registration works
- [ ] Task CRUD operations work

## Support

- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com/
- **Project Docs**: See DEPLOYMENT_SUMMARY.md

---

**Estimated Time**: 10-15 minutes total
**Difficulty**: Easy (mostly point-and-click)
