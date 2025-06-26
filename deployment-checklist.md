# 🚀 Deployment Checklist

## ✅ Pre-Deployment Tasks (COMPLETED)

- [x] **Updated API configuration** - Created `src/config/api.ts` for environment-aware API calls
- [x] **Fixed frontend API calls** - All `http://localhost:5000` replaced with configurable URLs
- [x] **Added production builds** - Both frontend and backend build successfully
- [x] **Updated server CORS** - Configured for production frontend URL
- [x] **Fixed TypeScript errors** - Server types updated to match frontend
- [x] **Added deployment configs** - `vercel.json` and `railway.json` created

## 🚀 Deployment Steps

### 1. **Push Code to GitHub** 
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. **MongoDB Atlas Setup**
- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster (free tier)
- [ ] Create database user
- [ ] Whitelist all IP addresses (0.0.0.0/0)
- [ ] Copy connection string

### 3. **Deploy Backend (Railway)**
- [ ] Go to [Railway.app](https://railway.app)
- [ ] Sign up and connect GitHub
- [ ] Create new project from your GitHub repo
- [ ] Set environment variables:
  - `MONGODB_URI=your-mongodb-connection-string`
  - `JWT_SECRET=super-secret-random-string`
  - `NODE_ENV=production`
  - `FRONTEND_URL=https://your-app.vercel.app` (update after step 4)
- [ ] Copy your Railway app URL (e.g., `https://your-app.railway.app`)

### 4. **Deploy Frontend (Vercel)**
- [ ] Go to [Vercel.com](https://vercel.com)
- [ ] Sign up and connect GitHub
- [ ] Import your GitHub repository
- [ ] Set environment variable:
  - `VITE_API_URL=https://your-app.railway.app` (from step 3)
- [ ] Deploy!
- [ ] Copy your Vercel app URL

### 5. **Update Configuration**
- [ ] Update `FRONTEND_URL` in Railway environment variables with your Vercel URL
- [ ] Update `src/config/api.ts` with your Railway URL as default production URL
- [ ] Commit and push changes (triggers auto-redeploy)

### 6. **Test Production**
- [ ] Visit your Vercel app URL
- [ ] Create a new account
- [ ] Create a character
- [ ] Test basic gameplay (fishing, mining, combat)
- [ ] Check character saves properly
- [ ] Test on mobile/different devices

## 🔧 If Something Goes Wrong

### **CORS Errors**
- Check that `FRONTEND_URL` in Railway exactly matches your Vercel URL
- Make sure both URLs use `https://` (not `http://`)

### **Database Connection Issues**
- Verify MongoDB connection string in Railway
- Check that IP address whitelist includes 0.0.0.0/0

### **Build Failures**
- Check build logs in Railway/Vercel dashboard
- Ensure all environment variables are set correctly

### **API Not Working**
- Test your Railway backend URL directly: `https://your-app.railway.app/api/db-status`
- Check Railway logs for server errors

## 💰 Current Setup Cost: $0/month

Your game will be **completely free** to run initially with:
- MongoDB Atlas: Free tier (512MB)
- Railway: Free tier ($5 credit monthly)
- Vercel: Free tier (100GB bandwidth)

## 🌍 After Deployment

Your game will be live at:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-app-name.railway.app`

Share the frontend URL with friends to let them play your game!

## 🔄 Future Updates

After initial deployment, any code changes you push to GitHub will automatically redeploy both frontend and backend. No manual steps needed! 