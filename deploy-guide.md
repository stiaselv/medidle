# 🚀 MedIdle Game Deployment Guide

This guide will help you deploy your MedIdle game to production using Vercel (frontend) and Railway (backend).

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **MongoDB Atlas Account** - For the production database
3. **Vercel Account** - For frontend hosting
4. **Railway Account** - For backend hosting

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and new cluster
3. Create a database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) for production
5. Get your connection string (it looks like `mongodb+srv://username:password@cluster.mongodb.net/medidle`)

## 🚂 Step 2: Deploy Backend to Railway

1. Go to [Railway](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select your repository
4. Railway will auto-detect your Node.js app in the `server` folder

### Environment Variables for Railway:
Set these in Railway's environment variables section:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medidle?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
```

### Railway Build Configuration:
- **Build Command**: `cd server && npm install && npm run build`
- **Start Command**: `cd server && npm start`
- **Port**: Railway automatically sets the PORT environment variable

## 🔗 Step 3: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com) and sign up
2. Click "New Project" → Import your GitHub repository
3. Vercel will auto-detect it's a Vite React app

### Environment Variables for Vercel:
Set these in Vercel's environment variables section:

```
VITE_API_URL=https://your-backend-app.railway.app
```

### Vercel Build Configuration:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🔄 Step 4: Update Configuration

1. **Update the backend URL in your API config**:
   - In Railway, copy your app's URL (e.g., `https://your-backend-app.railway.app`)
   - Update `src/config/api.ts` with this URL as the default production URL

2. **Update CORS settings**:
   - In Railway's environment variables, set `FRONTEND_URL` to your Vercel app URL
   - This ensures your frontend can communicate with the backend

## 🧪 Step 5: Test Your Deployment

1. Visit your Vercel frontend URL
2. Try creating an account and character
3. Test game functionality
4. Check Railway logs if there are any issues

## 🚀 Deployment Commands

After initial setup, future deployments are automatic:

- **Frontend**: Push to your main branch → Vercel automatically deploys
- **Backend**: Push to your main branch → Railway automatically deploys

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly
2. **Database Connection**: Verify your MongoDB connection string in Railway
3. **Build Failures**: Check the build logs in Railway/Vercel for specific errors
4. **Environment Variables**: Ensure all required env vars are set in both services

### Useful Commands for Local Testing:

```bash
# Test production build locally
npm run build
npm run preview

# Test backend with production env
cd server
npm run build
npm start
```

## 💰 Pricing

- **MongoDB Atlas**: Free tier (512MB storage)
- **Vercel**: Free tier (100GB bandwidth/month)
- **Railway**: Free tier ($5 credit/month, good for hobby projects)

Total cost to start: **$0/month** 🎉

## 🔄 Alternative Deployment Options

If you prefer different services:

1. **Netlify + Render**: Similar to Vercel + Railway
2. **All-in-one Vercel**: Deploy both frontend and backend on Vercel
3. **AWS/Google Cloud**: More advanced but requires more setup

## 📞 Need Help?

- Check Railway logs for backend issues
- Check Vercel logs for frontend issues
- Ensure environment variables are correctly set
- Test API endpoints directly in browser/Postman

Your game should now be live and accessible worldwide! 🌍 