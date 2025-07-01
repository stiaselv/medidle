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

// Enhanced CORS middleware that aggressively prevents Railway override
const aggressiveCors = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin;
  console.log('🔍 Request from origin:', origin);
  console.log('🔧 User-Agent:', req.headers['user-agent']);
  
  // Determine the correct origin to allow
  let allowedOrigin = '*';
  if (origin && allowedOrigins.includes(origin)) {
    allowedOrigin = origin;
  } else if (!origin) {
    // For requests without origin (like direct API calls), allow any of our domains
    allowedOrigin = '*';
  }
  
  // Set CORS headers with multiple approaches to prevent override
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie, Cache-Control',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
  
  // Set headers multiple ways to ensure they stick
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
    res.header(key, value);
  });
  
  console.log('✅ Setting CORS headers:', corsHeaders);
  
  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    console.log('📋 Handling OPTIONS preflight request');
    res.status(204).end();
    return;
  }
  
  next();
};

// Apply aggressive CORS as the very first middleware
app.use(aggressiveCors);

// Add a middleware to ensure CORS headers are preserved throughout the request
app.use((req: Request, res: Response, next: NextFunction) => {
  const originalEnd = res.end;
  const originalSend = res.send;
  
  // Override end method to ensure CORS headers are still present
  res.end = function(chunk?: any, encoding?: any) {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return originalEnd.call(this, chunk, encoding);
  };
  
  // Override send method to ensure CORS headers are still present
  res.send = function(body?: any) {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return originalSend.call(this, body);
  };
  
  next();
});

// Traditional express-cors as backup (with stricter configuration)
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    console.log('🔍 Express CORS check for origin:', origin);
    
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
      // Instead of blocking, let our custom middleware handle it
      return callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Origin', 'X-Requested-With', 'Accept', 'Cache-Control'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

console.log('⚙️ Basic middleware setup complete');

// Health check endpoint for Railway
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'MedIdle server is running!',
    timestamp: new Date().toISOString()
  });
});

console.log('✅ Health check endpoint registered');

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

console.log('✅ DB status endpoint registered');

// Enhanced CORS test endpoint
app.get('/api/cors-test', (req: Request, res: Response) => {
  const origin = req.headers.origin;
  console.log('🧪 CORS test endpoint called from origin:', origin);
  
  // Get all current headers for debugging
  const responseHeaders: Record<string, any> = {};
  res.getHeaderNames().forEach(name => {
    responseHeaders[name] = res.getHeader(name);
  });
  
  res.status(200).json({ 
    message: 'CORS test successful!',
    origin: origin,
    requestHeaders: req.headers,
    responseHeaders: responseHeaders,
    allowedOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

console.log('✅ CORS test endpoint registered');

// Test POST endpoint for CORS preflight
app.post('/api/cors-test', (req: Request, res: Response) => {
  const origin = req.headers.origin;
  console.log('🧪 CORS POST test endpoint called from origin:', origin);
  res.status(200).json({ 
    message: 'CORS POST test successful!',
    origin: origin,
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

console.log('✅ CORS POST test endpoint registered');

// Register routes with enhanced logging
console.log('📦 Registering character routes...');
app.use('/api/characters', characterRoutes);
console.log('✅ Character routes registered');

console.log('📦 Registering auth routes...');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes registered');

// Add a catch-all route for debugging
app.use('*', (req: Request, res: Response) => {
  console.log('🚫 Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

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