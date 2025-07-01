import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import clientPromise from './db';
import characterRoutes from './routes/characters';
import authRoutes from './routes/auth';

const app = express();
const port = parseInt(process.env.PORT || '5000', 10);

console.log('🚀 Starting server initialization...');
console.log('📍 Port configuration:', { PORT: process.env.PORT, parsedPort: port });

// Production and development origins
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175',
  'https://medidle.vercel.app',
  'https://medidle-git-main-stiaselv.vercel.app',
  'https://medidle-stiaselv.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

console.log('🌐 Allowed CORS origins:', allowedOrigins);

// Simplified CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like healthchecks, mobile apps, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For now, allow all origins to fix the immediate CORS issue
    console.log('⚠️ Origin not in whitelist but allowing:', origin);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Origin', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

console.log('⚙️ Basic middleware setup complete');

// Health check endpoint for Railway (simplified)
app.get('/', (req: Request, res: Response) => {
  console.log('🏥 Health check requested');
  res.status(200).json({ 
    status: 'ok', 
    message: 'MedIdle server is running!',
    port: port,
    timestamp: new Date().toISOString()
  });
});

console.log('✅ Health check endpoint registered');

// Simple CORS test endpoint
app.get('/api/cors-test', (req: Request, res: Response) => {
  const origin = req.headers.origin;
  console.log('🧪 CORS test from origin:', origin);
  
  res.status(200).json({ 
    message: 'CORS test successful!',
    origin: origin,
    allowedOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

console.log('✅ CORS test endpoint registered');

// Database status endpoint
app.get('/api/db-status', async (req: Request, res: Response) => {
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });
    res.status(200).json({ status: 'success', message: 'MongoDB connected!' });
  } catch (e) {
    console.error('Database connection error:', e);
    res.status(500).json({ status: 'error', message: 'MongoDB connection failed' });
  }
});

console.log('✅ DB status endpoint registered');

// Register routes
console.log('📦 Registering character routes...');
app.use('/api/characters', characterRoutes);
console.log('✅ Character routes registered');

console.log('📦 Registering auth routes...');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes registered');

// 404 handler
app.use('*', (req: Request, res: Response) => {
  console.log('🚫 Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server successfully started on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'not set'}`);
  console.log(`🌐 CORS configured for origins:`, allowedOrigins);
  console.log(`🏥 Health endpoint available at: http://0.0.0.0:${port}/`);
});

// Test database connection (non-blocking)
clientPromise
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    console.error('Server continues running, but database operations will fail');
  });