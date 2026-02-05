# ⚡ Quick Deployment Checklist

Use this checklist for rapid deployment. For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## 🎯 Pre-Deployment

- [ ] Code is committed to GitHub
- [ ] All bugs from PRODUCTION_BUGS_REPORT.md are fixed ✅
- [ ] Backend runs on port 8000 ✅
- [ ] Frontend .env.production exists ✅

---

## 🗄️ Database (5 minutes)

- [ ] Create Neon.tech account
- [ ] Create new project
- [ ] Copy connection string
- [ ] Format: `postgresql+psycopg://user:pass@host:5432/db?sslmode=require`

---

## 🔧 Backend - Render.com (10 minutes)

### Setup
- [ ] Create Render account
- [ ] New Web Service → Connect GitHub repo
- [ ] Root Directory: `backend`
- [ ] Build: `pip install -r requirements.txt`
- [ ] Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Environment Variables
```bash
DATABASE_URL=<your-neon-connection-string>
BETTER_AUTH_SECRET=<generate-with: openssl rand -base64 32>
CORS_ORIGINS=http://localhost:3000
DEBUG=false
JWT_ALGORITHM=HS256
JWT_EXPIRY_DAYS=7
```

- [ ] Add all environment variables
- [ ] Deploy
- [ ] Test: `https://your-backend.onrender.com/health`
- [ ] Copy backend URL

---

## 🎨 Frontend - Vercel (5 minutes)

### Update Config
- [ ] Edit `frontend/.env.production`
- [ ] Set: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
- [ ] Commit and push

### Deploy
- [ ] Create Vercel account
- [ ] New Project → Import GitHub repo
- [ ] Root Directory: `frontend`
- [ ] Add env var: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
- [ ] Deploy
- [ ] Copy frontend URL

---

## 🔄 Update CORS (2 minutes)

- [ ] Go to Render → Your Service → Environment
- [ ] Update `CORS_ORIGINS` to: `https://your-app.vercel.app,https://your-app-*.vercel.app`
- [ ] Manual Deploy → Deploy latest commit

---

## ✅ Test (5 minutes)

- [ ] Visit frontend URL
- [ ] Sign up new account
- [ ] Create a task
- [ ] Mark task complete
- [ ] Edit task
- [ ] Delete task
- [ ] Logout and login

---

## 🎉 Done!

**Frontend**: https://your-app.vercel.app
**Backend**: https://your-backend.onrender.com
**Database**: Neon PostgreSQL

---

## 🐛 Quick Fixes

**CORS Error?**
→ Update CORS_ORIGINS in Render, redeploy

**Can't connect to backend?**
→ Check NEXT_PUBLIC_API_URL in Vercel

**Database error?**
→ Verify DATABASE_URL has `?sslmode=require`

**Auth not working?**
→ Check BETTER_AUTH_SECRET is set (32+ chars)

---

## 📞 Need Help?

See detailed guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
