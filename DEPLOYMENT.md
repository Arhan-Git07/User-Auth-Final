# 🚀 Deployment Guide - Easiest Way

## Option 1: Render.com (Recommended - Easiest)

### Backend Deployment (Render.com)

1. **Create Account**: Go to https://render.com and sign up (free)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Settings**:
   - **Name**: `user-auth-profiles-backend` (or any name)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: Leave empty (or set to root)

4. **Environment Variables** (Optional but recommended):
   - Click "Environment" tab
   - Add: `SECRET_KEY` = `your-super-secret-key-change-this`

5. **Deploy**: Click "Create Web Service"
   - Wait 5-10 minutes for first deployment
   - Copy your backend URL (e.g., `https://user-auth-profiles-backend.onrender.com`)

### Frontend Deployment (Netlify - Easiest)

1. **Create Account**: Go to https://netlify.com and sign up (free)

2. **Deploy**:
   - Drag and drop your `frontend` folder to Netlify dashboard
   - OR: Click "Add new site" → "Deploy manually" → Upload `frontend` folder
   - Wait for deployment (1-2 minutes)
   - Copy your frontend URL (e.g., `https://amazing-app-123.netlify.app`)

3. **Update API URL**:
   - After deployment, go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`
   - OR manually edit `app.js` and change `const API = "http://localhost:8000"` to your backend URL
   - Redeploy

## Option 2: Railway.app (Even Easier - All in One)

### Deploy Everything to Railway

1. **Create Account**: Go to https://railway.app and sign up (free $5 credit)

2. **Deploy Backend**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Python
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Deploy!

3. **Deploy Frontend**:
   - Add another service → "Static Site"
   - Set **Root Directory**: `frontend`
   - Deploy!

4. **Get URLs**: Railway gives you URLs for both services

5. **Update Frontend API**:
   - Edit `frontend/app.js`: Change `const API = "http://localhost:8000"` to your Railway backend URL
   - Redeploy frontend

## Option 3: PythonAnywhere (Simplest for Beginners)

1. **Sign up**: https://www.pythonanywhere.com (free tier)

2. **Upload Files**:
   - Go to Files tab
   - Upload your entire project

3. **Setup Backend**:
   - Go to Web tab → Add new web app
   - Choose "Manual configuration" → Python 3.10
   - Edit WSGI file: Point to your `main.py`
   - Reload!

4. **Setup Frontend**:
   - Upload frontend files to `/static/` folder
   - Access via your PythonAnywhere URL

## 📝 Important Steps After Deployment

1. **Update Frontend API URL**:
   - Edit `frontend/app.js`
   - Change line 1: `const API = "YOUR_BACKEND_URL_HERE";`
   - Example: `const API = "https://user-auth-profiles-backend.onrender.com";`

2. **Enable CORS** (Already done in your code ✅)

3. **Database**: Your SQLite database will persist on the server - all user data will be saved!

4. **Test**:
   - Register a new user on frontend
   - Check backend logs to see the registration
   - All data is stored in `backend/users.db` on the server

## 🔍 Viewing User Data

After deployment, you can:
- Check backend logs in Render/Railway dashboard
- Use Swagger docs: `https://your-backend-url.onrender.com/docs`
- Login and see users via frontend

## 💡 Recommended: Render.com + Netlify

**Why**: 
- ✅ Free forever
- ✅ Easy setup
- ✅ Automatic deployments from GitHub
- ✅ Good performance
- ✅ Easy to update

**Steps Summary**:
1. Push code to GitHub
2. Deploy backend on Render (5 min)
3. Deploy frontend on Netlify (2 min)
4. Update frontend API URL
5. Done! 🎉

