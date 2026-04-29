# 🚀 QUICK START GUIDE

Follow these simple steps to get the AI Interview Practice Tool running on your computer.

## ⚡ Quick Setup (5 Minutes)

### 1. Prerequisites Check
Before starting, make sure you have:
- ✅ Node.js installed (v18+) - Check with: `node --version`
- ✅ Google Chrome browser (for voice features)

### 2. Get Your OpenRouter API Key
1. Go to: https://openrouter.ai/
2. Click "Create API Key"
3. Copy the key (starts with "sk-or...")

### 3. Setup Backend
```bash
# Navigate to backend
cd backend

# Install packages (this takes 1-2 minutes)
npm install

# Edit .env file
# Replace "sk-or-your_actual_key_here" with your actual OpenRouter API key
```

### 4. Setup Frontend
```bash
# Open NEW terminal
# Navigate to frontend
cd frontend

# Install packages (this takes 1-2 minutes)
npm install
```

### 5. Start Everything

**For MongoDB Atlas (Cloud - Recommended for Beginners):**
1. Create free account at: https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Wait for: `✅ MongoDB Connected` and `🚀 Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Wait for: `➜  Local:   http://localhost:5173/`

### 6. Open the App
Open Chrome and go to: **http://localhost:5173/**

---

## 🎯 First Time Usage

1. Click **"Sign Up"**
2. Fill in your details
3. Click **"Login"**
4. Click **"Start Interview"**
5. **Allow microphone** when asked
6. Click **microphone button** and speak!

---

## ⚠️ Common First-Time Issues

### "Cannot find module" error
**Fix**: Run `npm install` in both backend and frontend folders

### MongoDB connection error
**Fix**: Use MongoDB Atlas (cloud) instead of local MongoDB
1. Sign up at mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `.env` file

### Microphone not working
**Fix**: 
- Use Google Chrome
- Click the 🔒 icon in address bar
- Allow microphone permissions

### Port 5000 already in use
**Fix**: In `backend/.env`, change `PORT=5000` to `PORT=5001`
Then update frontend code to use port 5001

---

## 📞 Need Help?

1. Make sure Node.js is installed: `node --version`
2. Check all terminals for error messages
3. Verify `.env` file has correct API key
4. Use Google Chrome browser
5. Check README.md for detailed troubleshooting

---

**You're all set! Happy interviewing! 🎤**
