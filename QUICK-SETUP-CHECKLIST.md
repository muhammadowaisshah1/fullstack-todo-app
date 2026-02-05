# ✅ Quick Setup Checklist for Team Members

## 📋 Pre-Setup (5 minutes)

- [ ] **Python 3.14+ installed**
  ```bash
  python --version
  ```
  Expected: `Python 3.14.x` or higher

- [ ] **Node.js 18.18+ installed**
  ```bash
  node --version
  ```
  Expected: `v18.18.x` or higher

- [ ] **Git installed**
  ```bash
  git --version
  ```

---

## 📥 Clone Project (2 minutes)

- [ ] **Clone repository**
  ```bash
  git clone <repository-url>
  cd Hackthon_Full-Stack_App
  ```

- [ ] **Verify project structure**
  ```bash
  dir
  ```
  Should see: `backend/`, `frontend/`, `start-app.bat`

---

## 🔐 Environment Setup (5 minutes)

### **Step 1: Root Directory**

- [ ] **Copy template to .env**
  ```bash
  copy .env.template .env
  ```

- [ ] **Edit .env file**
  - Open `.env` in notepad/VS Code
  - Replace `YOUR_DATABASE_URL_HERE` with actual value
  - Replace `YOUR_AUTH_SECRET_HERE` with actual value
  - Replace `YOUR_NEON_API_KEY_HERE` with actual value

### **Step 2: Backend Directory**

- [ ] **Copy template to .env**
  ```bash
  copy backend\.env.template backend\.env
  ```

- [ ] **Edit backend/.env file**
  - Open `backend/.env` in notepad/VS Code
  - Replace `YOUR_DATABASE_URL_HERE` with actual value
  - Replace `YOUR_AUTH_SECRET_HERE` with actual value
  - Keep other values as-is

### **Step 3: Frontend Directory**

- [ ] **Copy template to .env.local**
  ```bash
  copy frontend\.env.local.template frontend\.env.local
  ```

- [ ] **Verify frontend/.env.local**
  - Should have: `NEXT_PUBLIC_API_URL=http://localhost:8001`
  - No changes needed

---

## 📦 Install Dependencies (10 minutes)

### **Backend:**

- [ ] **Install Python packages**
  ```bash
  cd backend
  pip install -r requirements.txt
  cd ..
  ```

- [ ] **Verify installation**
  ```bash
  python -c "import fastapi; print('FastAPI installed')"
  ```

### **Frontend:**

- [ ] **Install Node packages**
  ```bash
  cd frontend
  npm install
  cd ..
  ```

- [ ] **Verify installation**
  ```bash
  cd frontend
  npm list next
  cd ..
  ```

---

## 🚀 Run Application (2 minutes)

### **Option 1: One-Click (Recommended)**

- [ ] **Double-click `start-app.bat`**
- [ ] **Wait for both servers to start**
  - Backend: `Uvicorn running on http://0.0.0.0:8001`
  - Frontend: `Local: http://localhost:3000`

### **Option 2: Manual**

- [ ] **Terminal 1 - Backend**
  ```bash
  cd backend
  python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
  ```

- [ ] **Terminal 2 - Frontend**
  ```bash
  cd frontend
  npm run dev
  ```

---

## ✅ Verification (3 minutes)

### **Backend Health Check:**

- [ ] **Open browser: http://localhost:8001/health**
  - Should see: `{"status": "healthy", "database": "connected"}`

- [ ] **Open API docs: http://localhost:8001/docs**
  - Should see Swagger UI with API endpoints

### **Frontend Check:**

- [ ] **Open browser: http://localhost:3000**
  - Should see landing page with "Welcome to Todo App"
  - Should see Login/Register buttons

### **Full Flow Test:**

- [ ] **Register new account**
  - Click "Get Started" or "Register"
  - Enter email, name, password
  - Should redirect to dashboard

- [ ] **Create a task**
  - Click "Add Task" button
  - Enter task title
  - Click "Create"
  - Task should appear in list

- [ ] **Complete a task**
  - Click checkbox on task
  - Task should show as completed

---

## 🐛 Troubleshooting

### **If Backend Fails:**

- [ ] Check `.env` files exist in:
  - `Hackthon_Full-Stack_App/.env`
  - `Hackthon_Full-Stack_App/backend/.env`

- [ ] Verify DATABASE_URL is correct

- [ ] Check port 8001 is not in use:
  ```bash
  netstat -ano | findstr :8001
  ```

### **If Frontend Fails:**

- [ ] Check `frontend/.env.local` exists

- [ ] Verify it has: `NEXT_PUBLIC_API_URL=http://localhost:8001`

- [ ] Check port 3000 is not in use:
  ```bash
  netstat -ano | findstr :3000
  ```

### **If Database Connection Fails:**

- [ ] Check internet connection

- [ ] Verify DATABASE_URL in both:
  - Root `.env`
  - `backend/.env`

- [ ] Ask project owner if database is accessible

---

## 📊 Success Criteria

### **You're done when:**

✅ Backend running on http://localhost:8001
✅ Frontend running on http://localhost:3000
✅ Can register new account
✅ Can login
✅ Can create tasks
✅ Can complete tasks
✅ Can delete tasks
✅ No errors in terminal

---

## ⏱️ Total Time: ~25 minutes

- Pre-setup: 5 min
- Clone: 2 min
- Environment: 5 min
- Dependencies: 10 min
- Run & Verify: 3 min

---

## 📞 Need Help?

**If stuck, share with project owner:**

1. ✅ Screenshot of error
2. ✅ Terminal output (copy-paste)
3. ✅ Which step failed
4. ✅ Your OS version
5. ✅ Python version: `python --version`
6. ✅ Node version: `node --version`

---

## 🎉 Congratulations!

**Agar sab checkboxes ✅ hain toh aap ready hain!**

Start coding and building awesome features! 🚀

---

**Pro Tips:**

💡 Use `stop-app.bat` to stop both servers
💡 Backend API docs: http://localhost:8001/docs
💡 Check `SETUP-GUIDE-FOR-TEAM.md` for detailed instructions
💡 Keep terminals open to see logs
💡 Use VS Code for better development experience
