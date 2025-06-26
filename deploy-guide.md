# 🚀 MedIdle Game Deployment Guide

Complete step-by-step guide to deploy your idle RPG game to production using free hosting services.

## 📋 **Prerequisites**

✅ **Both builds working locally:**
- ✅ Frontend builds successfully (`npm run build`)
- ✅ Backend builds successfully (`cd server && npm run build`)
- ✅ TypeScript compilation issues resolved

## 🎯 **Deployment Strategy**

- **Frontend**: Vercel (React/Vite app)
- **Backend**: Railway (Node.js/Express API)  
- **Database**: MongoDB Atlas (Free cluster)
- **Cost**: $0/month initially 🆓

---

## 📊 **Part 1: Database Setup (MongoDB Atlas)**

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Click **"Try Free"** and create account
3. Choose **"Build a database"** → **"M0 FREE"**
4. Select **AWS** and nearest region to your users
5. Create cluster (takes 2-3 minutes)

### 1.2 Configure Database Access
1. **Database Access** → **"Add New Database User"**
   - Username: `medidle-user` 
   - Password: Generate secure password (save it!)
   - Database User Privileges: **"Read and write to any database"**

2. **Network Access** → **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is needed for Railway to connect

### 1.3 Get Connection String
1. Go to **"Connect"** → **"Drivers"**
2. Copy the connection string format:
   ```
   mongodb+srv://medidle-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace `<password>` with your actual password
4. **Save this connection string securely!**

---

## 🚂 **Part 2: Backend Deployment (Railway)**

### 2.1 Create Railway Account
1. Go to [Railway](https://railway.app/)
2. Sign up with GitHub account
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Connect your MedIdle repository

### 2.2 Configure Railway Environment Variables
⚠️ **CRITICAL**: Set these environment variables in Railway dashboard:

**Required Environment Variables:**
```bash
# Database
MONGODB_URI=mongodb+srv://medidle-user:<your-password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# Frontend URL (will be updated after Vercel deployment)
FRONTEND_URL=https://your-app-name.vercel.app

# Node Environment  
NODE_ENV=production

# Port (Railway sets this automatically, but you can override)
PORT=5000
```

**To set environment variables in Railway:**
1. Go to your project dashboard
2. Click **"Variables"** tab
3. Add each variable above (one by one)
4. **Important**: Replace the MongoDB URI with your actual connection string!

### 2.3 Deploy Backend
1. Railway will automatically detect and deploy from your repository
2. If deployment fails, check the logs for specific errors
3. The build process should now work with our TypeScript fixes
4. Note your Railway app URL: `https://your-app-name.railway.app`

### 2.4 Test Backend Deployment
Visit your Railway URL to test:
- `https://your-app-name.railway.app/` → Should show "MedIdle server is running!"
- `https://your-app-name.railway.app/api/db-status` → Should show MongoDB connection status

---

## ⚡ **Part 3: Frontend Deployment (Vercel)**

### 3.1 Update Frontend Configuration
**Update the API URL in your code:**

Edit `src/config/api.ts`:
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://your-backend-app.railway.app');
```

**Replace `your-backend-app.railway.app` with your actual Railway URL!**

### 3.2 Create Vercel Account
1. Go to [Vercel](https://vercel.com/)
2. Sign up with GitHub account
3. Click **"New Project"**
4. Import your MedIdle repository

### 3.3 Configure Vercel Build Settings
Vercel should auto-detect your Vite project, but verify:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.4 Set Environment Variables (Optional)
For production customization, you can set:
```bash
VITE_API_URL=https://your-backend-app.railway.app
```

### 3.5 Deploy Frontend
1. Click **"Deploy"** 
2. Wait for build to complete (2-3 minutes)
3. Note your Vercel URL: `https://your-app-name.vercel.app`

---

## 🔄 **Part 4: Final Configuration**

### 4.1 Update Backend CORS
Update the Railway environment variable:
```bash
FRONTEND_URL=https://your-app-name.vercel.app
```

Replace with your actual Vercel URL from step 3.5.

### 4.2 Test Full Stack
1. Visit your Vercel app: `https://your-app-name.vercel.app`
2. Try registering a new account
3. Create a character 
4. Test basic gameplay features
5. Check browser console for any errors

---

## 🎮 **Your Game is Live!**

🎉 **Congratulations!** Your MedIdle game is now live at:
- **Game URL**: `https://your-app-name.vercel.app`
- **API URL**: `https://your-app-name.railway.app`

## 📈 **Monitoring & Scaling**

### Free Tier Limits:
- **Vercel**: 100GB bandwidth/month, unlimited sites
- **Railway**: 500 execution hours/month, 1GB RAM
- **MongoDB Atlas**: 512MB storage, shared cluster

### When You Need More:
- **Vercel Pro**: $20/month per user
- **Railway Pro**: $20/month for more resources  
- **MongoDB**: Dedicated clusters start at $9/month

## 🔧 **Troubleshooting**

### Backend Issues:
1. **Build fails**: Check TypeScript errors in Railway logs
2. **503 Service Unavailable**: Check environment variables are set correctly
3. **Database connection**: Verify MongoDB URI is correct
4. **CORS errors**: Ensure FRONTEND_URL matches your Vercel domain

### Frontend Issues:
1. **API calls fail**: Check API_BASE_URL points to Railway
2. **Build fails**: Run `npm run build` locally first
3. **404 on refresh**: Vercel config should handle this automatically

### Environment Variables:
```bash
# Railway (Backend)
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production

# Vercel (Frontend) - Optional
VITE_API_URL=https://your-railway-app.railway.app
```

## 🚀 **Next Steps**

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Analytics**: Add Google Analytics or similar
3. **SSL**: Both platforms provide HTTPS automatically
4. **Monitoring**: Set up uptime monitoring for your API
5. **Backups**: Configure MongoDB backups in Atlas

---

**Need help?** Check the logs in each platform's dashboard for specific error messages. 