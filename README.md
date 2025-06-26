# 🎮 MedIdle - A Modern Idle RPG Game

An engaging idle RPG inspired by classic games, built with modern web technologies. Features character progression, multiple skills, combat, farming, and more!

## 🚀 **Now Ready for Production Deployment!**

Your game is fully prepared for hosting and can be deployed for **free** to share with friends and players worldwide.

📖 **[View Deployment Guide](./deploy-guide.md)** | 📋 **[Deployment Checklist](./deployment-checklist.md)**

## ✨ Features

- **🎯 Multi-Skill System**: Woodcutting, Mining, Fishing, Farming, Combat, and more
- **⚔️ Dynamic Combat**: Fight monsters with various difficulties and loot systems
- **🏦 Bank & Inventory**: Comprehensive item management with selling/buying
- **🎨 Beautiful UI**: Chakra UI components with smooth animations
- **📱 Responsive Design**: Works great on desktop and mobile
- **💾 Real-time Saves**: Character progress automatically saved to database
- **🔐 User Authentication**: Secure account system with multiple characters

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Chakra UI** for beautiful, accessible components
- **Zustand** for state management
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing

## 🏗️ Project Structure

```
medidle/
├── src/                    # Frontend React application
│   ├── components/         # UI components
│   ├── store/             # Zustand state management
│   ├── data/              # Game data and configurations
│   ├── combat/            # Combat system logic
│   └── types/             # TypeScript type definitions
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Authentication middleware
│   │   └── types/         # Server type definitions
├── public/                # Static assets (images, icons)
└── deployment files       # Ready for production deployment
```

## 🚀 Deployment Status

✅ **Production Ready** - All deployment configurations completed:

- [x] Environment-aware API configuration
- [x] Production build optimization
- [x] CORS configuration for hosting
- [x] TypeScript compilation fixed
- [x] Deployment configurations added (Vercel + Railway)

## 💰 Hosting Costs

**Free to start!** The recommended hosting setup costs **$0/month** initially:

- **Frontend**: Vercel (free tier)
- **Backend**: Railway (free tier with $5 monthly credit)
- **Database**: MongoDB Atlas (free tier)

## 🎮 Game Features

### Skills & Activities
- **🪓 Woodcutting**: Chop different types of trees for logs
- **⛏️ Mining**: Extract ores from quarries
- **🎣 Fishing**: Catch fish from various water sources
- **🌾 Farming**: Plant, grow, and harvest crops over time
- **🔥 Cooking**: Turn raw ingredients into healing food
- **🔨 Smithing**: Smelt ores into bars and craft equipment
- **🏹 Fletching**: Create arrows and ranged equipment
- **✂️ Crafting**: Create useful items and tools

### Combat System
- **Multiple Monster Types**: From easy chickens to nightmare dragons
- **Equipment System**: Weapons, armor, and tools with stats
- **Attack Styles**: Different combat strategies (accurate, aggressive, defensive)
- **Loot System**: Monsters drop valuable items and resources
- **Hitpoints**: Health system with food healing

### Character Progression
- **25+ Skills**: Each with levels 1-99 and experience tracking
- **Equipment Slots**: Head, body, legs, weapons, and more
- **Bank Storage**: Store hundreds of different items
- **Statistics Tracking**: Detailed progress monitoring

## 🎯 Getting Started (Development)

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install

# Start development servers
npm run dev          # Frontend (localhost:5173)
cd server && npm run dev  # Backend (localhost:5000)
```

## 🌍 Ready to Go Live?

Your MedIdle game is ready for the world! Follow the deployment guide to get it hosted and share it with friends.

**[🚀 Start Deployment Process](./deployment-checklist.md)**

---

Built with ❤️ using modern web technologies. Ready for production deployment!
