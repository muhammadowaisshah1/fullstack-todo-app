# 🚀 Setup Guide for Team Members

## ⚠️ IMPORTANT: Yeh guide un team members ke liye hai jo project clone kar rahe hain

---

## 📋 Prerequisites (Pehle yeh install karein)

### 1. **Python 3.14+**
- Download: https://www.python.org/downloads/
- Installation ke waqt "Add Python to PATH" checkbox ✅ zaroor check karein

### 2. **Node.js 18.18+**
- Download: https://nodejs.org/
- LTS version install karein

### 3. **Git**
- Download: https://git-scm.com/downloads

---

## 📥 Step 1: Project Clone Karein

```bash
git clone <repository-url>
cd Hackthon_Full-Stack_App
```

---

## 🔐 Step 2: Environment Variables Setup (CRITICAL)

### **Aapko 3 files banani hongi:**

### **File 1: Root Directory mein `.env` file**

**Location:** `Hackthon_Full-Stack_App/.env`

```bash
# ========================================
# DATABASE CONFIGURATION
# ========================================
NEON_API_KEY=<ASK_PROJECT_OWNER>
DATABASE_URL=<ASK_PROJECT_OWNER>

# ========================================
# AUTHENTICATION
# ========================================
BETTER_AUTH_SECRET=<ASK_PROJECT_OWNER>

# ========================================
# DEPLOYMENT CREDENTIALS (Optional - sirf deploy karne ke liye)
# ========================================
VERCEL_TOKEN=<ASK_PROJECT_OWNER>
GITHUB_TOKEN=<ASK_PROJECT_OWNER>
RENDER_API_KEY=<ASK_PROJECT_OWNER>

# ========================================
# OPENAI (Phase 3 - Optional)
# ========================================
# OPENAI_API_KEY=sk-proj-...
```

---

### **File 2: Backend Directory mein `.env` file**

**Location:** `Hackthon_Full-Stack_App/backend/.env`

```bash
# Database Configuration
DATABASE_URL=<ASK_PROJECT_OWNER>

# Better Auth Configuration
BETTER_AUTH_SECRET=<ASK_PROJECT_OWNER>

# JWT Configuration
JWT_ALGORITHM=HS256
JWT_EXPIRY_DAYS=7

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Server Configuration
SERVER_HOST=0.0.0.0
SERVER_PORT=8001
```

---

### **File 3: Frontend Directory mein `.env.local` file**

**Location:** `Hackthon_Full-Stack_App/frontend/.env.local`

```bash
# Backend API URL (CRITICAL: Backend runs on port 8001)
NEXT_PUBLIC_API_URL=http://localhost:8001
```

---

## 📧 Step 3: Project Owner Se Yeh Credentials Mangein

**Project owner ko yeh message bhejein:**

```
Hi! Maine project clone kar liya hai. Mujhe in credentials ki zaroorat hai:

1. DATABASE_URL (Neon PostgreSQL connection string)
2. BETTER_AUTH_SECRET (Authentication secret key)
3. NEON_API_KEY (Optional - agar database create karna ho)

Deployment ke liye (optional):
4. VERCEL_TOKEN
5. GITHUB_TOKEN
6. RENDER_API_KEY

Please share these values so I can run the app locally.
```

---

## 📦 Step 4: Dependencies Install Karein

### **Backend Dependencies:**

```bash
cd backend
pip install -r requirements.txt
cd ..
```

**Agar error aaye toh:**
```bash
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
```

---

### **Frontend Dependencies:**

```bash
cd frontend
npm install
cd ..
```

**Agar error aaye toh:**
```bash
cd frontend
npm cache clean --force
npm install
cd ..
```

---

## 🚀 Step 5: Application Run Karein

### **Option 1: One-Click Start (Recommended)**

Simply double-click: `start-app.bat`

---

### **Option 2: Manual Start**

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🌐 Step 6: Browser Mein Open Karein

```
Frontend: http://localhost:3000
Backend API Docs: http://localhost:8001/docs
Backend Health: http://localhost:8001/health
```

---

## ✅ Verification Steps

### **1. Backend Check:**
```bash
curl http://localhost:8001/health
```

**Expected Response:**
```json
{"status": "healthy", "database": "connected"}
```

---

### **2. Frontend Check:**

Browser mein `http://localhost:3000` open karein aur:
- Login/Register form dikhna chahiye
- Koi error nahi hona chahiye

---

## 🐛 Common Issues & Solutions

### **Issue 1: Port Already in Use**

**Error:** `Address already in use: 8001` ya `3000`

**Solution:**
```bash
# Stop script run karein
stop-app.bat

# Ya manually kill karein
netstat -ano | findstr :8001
taskkill /F /PID <PID_NUMBER>
```

---

### **Issue 2: Database Connection Error**

**Error:** `Could not connect to database`

**Solution:**
1. Check internet connection
2. Verify `DATABASE_URL` in `backend/.env`
3. Project owner se confirm karein ke database accessible hai

---

### **Issue 3: Module Not Found (Python)**

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

---

### **Issue 4: Module Not Found (Node.js)**

**Error:** `Cannot find module 'next'`

**Solution:**
```bash
cd frontend
npm install
```

---

### **Issue 5: CORS Error**

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
1. Backend `.env` mein check karein:
   ```bash
   CORS_ORIGINS=http://localhost:3000
   ```
2. Backend restart karein

---

### **Issue 6: Environment Variables Not Loading**

**Error:** `KeyError: 'DATABASE_URL'`

**Solution:**
1. Check ke `.env` files sahi location mein hain:
   - `Hackthon_Full-Stack_App/.env`
   - `Hackthon_Full-Stack_App/backend/.env`
   - `Hackthon_Full-Stack_App/frontend/.env.local`
2. File names exactly match karte hain (no extra spaces)
3. Values mein quotes nahi hone chahiye

---

## 📁 File Structure Verification

**Yeh files honi chahiye:**

```
Hackthon_Full-Stack_App/
├── .env                          ✅ (Create this)
├── backend/
│   ├── .env                      ✅ (Create this)
│   ├── requirements.txt          ✅ (Already exists)
│   └── main.py                   ✅ (Already exists)
├── frontend/
│   ├── .env.local                ✅ (Create this)
│   ├── package.json              ✅ (Already exists)
│   └── app/                      ✅ (Already exists)
├── start-app.bat                 ✅ (Already exists)
└── stop-app.bat                  ✅ (Already exists)
```

---

## 🔒 Security Notes

### **IMPORTANT:**

1. **.env files ko KABHI GitHub pe push mat karein**
2. Credentials ko publicly share mat karein
3. `.gitignore` mein `.env` files already added hain
4. Apne credentials project owner se privately mangein

---

## 🎯 Quick Checklist

- [ ] Python 3.14+ installed
- [ ] Node.js 18.18+ installed
- [ ] Project cloned
- [ ] `.env` file created in root directory
- [ ] `backend/.env` file created
- [ ] `frontend/.env.local` file created
- [ ] Credentials received from project owner
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend running on port 8001
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8001/docs

---

## 📞 Need Help?

**Agar koi issue aaye toh:**

1. Error message screenshot lein
2. Terminal output copy karein
3. Project owner ko bhejein with:
   - Error message
   - Which step failed
   - Your OS (Windows/Mac/Linux)
   - Python version: `python --version`
   - Node version: `node --version`

---

## 🎉 Success!

Agar sab kuch sahi se setup ho gaya toh:

1. Frontend: http://localhost:3000 pe app dikhai degi
2. Backend: http://localhost:8001/docs pe API documentation milegi
3. Aap register/login kar sakte hain
4. Tasks create kar sakte hain

**Happy Coding! 🚀**
