# 🚀 Production Deployment Guide

This guide will help you deploy your full-stack Todo application to production.

## 📋 Prerequisites

- GitHub account
- Vercel account (for frontend)
- Render.com account (for backend)
- Neon.tech account (for PostgreSQL database) OR existing PostgreSQL database

---

## 🗄️ Step 1: Database Setup (Neon.tech)

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up for a free account

2. **Create Database**
   - Click "Create Project"
   - Choose a region close to your users
   - Note down the connection string

3. **Get Connection String**
   - Format: `postgresql+psycopg://username:password@host:5432/database?sslmode=require`
   - Save this for later

---

## 🔧 Step 2: Backend Deployment (Render.com)

### 2.1 Prepare Backend

1. **Update CORS Origins**
   - You'll update this after deploying frontend
   - For now, keep the placeholder in `backend/render.yaml`

2. **Generate JWT Secret**
   ```bash
   # Generate a secure secret key
   openssl rand -base64 32
   ```
   - Save this secret key

### 2.2 Deploy to Render

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Create Render Service**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - **Name**: `todo-app-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":

   ```
   DATABASE_URL = postgresql+psycopg://your-neon-connection-string
   BETTER_AUTH_SECRET = your-generated-secret-from-step-2.1
   CORS_ORIGINS = http://localhost:3000
   DEBUG = false
   JWT_ALGORITHM = HS256
   JWT_EXPIRY_DAYS = 7
   SERVER_HOST = 0.0.0.0
   SERVER_PORT = 8000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-app.onrender.com`

6. **Test Backend**
   - Visit: `https://your-app.onrender.com/health`
   - Should return: `{"status": "healthy"}`

---

## 🎨 Step 3: Frontend Deployment (Vercel)

### 3.1 Update Frontend Environment

1. **Update `.env.production`**
   ```bash
   cd frontend
   ```

   Edit `frontend/.env.production`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-app.onrender.com
   ```
   Replace `your-app.onrender.com` with your actual Render backend URL

2. **Commit Changes**
   ```bash
   git add .env.production
   git commit -m "Update production backend URL"
   git push origin main
   ```

### 3.2 Deploy to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL = https://your-app.onrender.com
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Note your frontend URL: `https://your-app.vercel.app`

---

## 🔄 Step 4: Update CORS Configuration

Now that you have your frontend URL, update the backend CORS settings:

1. **Go to Render Dashboard**
   - Select your backend service
   - Go to "Environment"

2. **Update CORS_ORIGINS**
   ```
   CORS_ORIGINS = https://your-app.vercel.app,https://your-app-*.vercel.app
   ```
   - Replace with your actual Vercel URL
   - The `*` wildcard allows preview deployments

3. **Redeploy Backend**
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for redeployment

---

## ✅ Step 5: Testing

### 5.1 Test Authentication
1. Visit your frontend URL
2. Click "Sign Up"
3. Create a new account
4. Verify you're redirected to dashboard

### 5.2 Test Task Operations
1. Create a new task
2. Mark task as complete
3. Edit a task
4. Delete a task

### 5.3 Test API Directly
```bash
# Health check
curl https://your-app.onrender.com/health

# Register user
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend health check fails
- **Solution**: Check Render logs for errors
- Verify DATABASE_URL is correct
- Ensure all environment variables are set

**Problem**: CORS errors in browser console
- **Solution**: Update CORS_ORIGINS in Render
- Include both production and preview URLs
- Redeploy backend after changes

**Problem**: Database connection errors
- **Solution**: Verify Neon database is active
- Check connection string format
- Ensure `?sslmode=require` is in connection string

### Frontend Issues

**Problem**: "Failed to fetch" errors
- **Solution**: Check NEXT_PUBLIC_API_URL in Vercel
- Verify backend is running
- Check browser console for CORS errors

**Problem**: Authentication not working
- **Solution**: Clear browser localStorage
- Check JWT_EXPIRY_DAYS setting
- Verify BETTER_AUTH_SECRET is set correctly

---

## 📊 Monitoring

### Backend Monitoring (Render)
- View logs: Render Dashboard → Your Service → Logs
- Check metrics: Dashboard → Metrics tab
- Set up alerts: Dashboard → Settings → Notifications

### Frontend Monitoring (Vercel)
- View deployments: Vercel Dashboard → Deployments
- Check analytics: Dashboard → Analytics
- Monitor errors: Dashboard → Logs

---

## 🔒 Security Checklist

- [ ] BETTER_AUTH_SECRET is at least 32 characters
- [ ] DATABASE_URL contains `?sslmode=require`
- [ ] DEBUG is set to `false` in production
- [ ] CORS_ORIGINS only includes your frontend URLs
- [ ] No sensitive data in git repository
- [ ] .env files are in .gitignore

---

## 🚀 Continuous Deployment

Both Vercel and Render support automatic deployments:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Automatic Deployment**
   - Vercel: Deploys automatically on push
   - Render: Deploys automatically on push (if enabled)

---

## 📝 Environment Variables Summary

### Backend (Render.com)
```env
DATABASE_URL=postgresql+psycopg://...
BETTER_AUTH_SECRET=your-secret-key
CORS_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app
DEBUG=false
JWT_ALGORITHM=HS256
JWT_EXPIRY_DAYS=7
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-app.onrender.com
```

---

## 🎉 Success!

Your full-stack Todo application is now live in production!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.onrender.com
- **Database**: Neon PostgreSQL

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render and Vercel logs
3. Verify all environment variables are set correctly
4. Ensure database connection is working

---

## 🔄 Next Steps

Consider adding:
- Custom domain names
- Email verification
- Password reset functionality
- Rate limiting
- Monitoring and alerting
- Backup strategy for database
