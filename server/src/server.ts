import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import clientPromise from './db';
import characterRoutes from './routes/characters';
import authRoutes from './routes/auth';

const app = express();
const port = parseInt(process.env.PORT || '5000', 10);

// Production and development origins
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175',
  'https://medidle.vercel.app',
  'https://medidle-git-main-stiaselv.vercel.app',
  'https://medidle-stiaselv.vercel.app',
  // Add environment variable override
  process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

console.log('🌐 Allowed CORS origins:', allowedOrigins);

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    console.log('🔍 CORS check for origin:', origin);
    
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      return callback(null, true);
    } else {
      console.log('❌ Origin blocked:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint for Railway
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'MedIdle server is running!',
    timestamp: new Date().toISOString()
  });
});

// A test route to check DB connection
app.get('/api/db-status', async (req: Request, res: Response) => {
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });
    res.status(200).json({ status: 'success', message: 'Successfully connected to MongoDB!' });
  } catch (e) {
    console.error('Database connection error:', e);
    res.status(500).json({ status: 'error', message: 'Failed to connect to MongoDB', error: String(e) });
  }
});

// Use the character routes
app.use('/api/characters', characterRoutes);
app.use('/api/auth', authRoutes);

// Start server immediately (don't wait for DB)
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set'}`);
  console.log(`🗄️  MONGODB_URI: ${process.env.MONGODB_URI ? 'set' : 'not set'}`);
  console.log(`🌐 CORS origins configured:`, allowedOrigins);
});

// Test database connection (but don't block server startup)
clientPromise
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
    console.error('Server will continue running, but database operations will fail');
  });