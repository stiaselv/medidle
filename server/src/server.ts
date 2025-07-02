import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();

// Enhanced port debugging
console.log('🚀 Server starting...');
console.log('🔍 Environment variables:');
console.log('  - PORT:', process.env.PORT);
console.log('  - RAILWAY_PUBLIC_PORT:', process.env.RAILWAY_PUBLIC_PORT);
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  - MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');

// Validate critical environment variables
const missingVars = [];
if (!process.env.JWT_SECRET) missingVars.push('JWT_SECRET');
if (!process.env.MONGODB_URI) missingVars.push('MONGODB_URI');

if (missingVars.length > 0) {
  console.error('❌ Critical environment variables missing:', missingVars);
  console.error('🚨 Server cannot start without these variables!');
  console.error('Please set them in your Railway environment variables.');
  process.exit(1);
}

const port = parseInt(process.env.PORT || process.env.RAILWAY_PUBLIC_PORT || '3000', 10);

console.log('📍 Final port to use:', port);

// CORS configuration
const corsOptions = {
  origin: [
    'https://medidle.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
};

console.log('🌐 CORS configured for origins:', corsOptions.origin);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('  Origin:', req.get('Origin'));
  console.log('  User-Agent:', req.get('User-Agent'));
  next();
});

// Health check (before loading heavy dependencies)
app.get('/', (req, res) => {
  console.log('🏥 Health check hit');
  res.json({ 
    status: 'ok', 
    message: 'Medidle server running',
    port: port,
    env: {
      PORT: process.env.PORT,
      RAILWAY_PUBLIC_PORT: process.env.RAILWAY_PUBLIC_PORT,
      NODE_ENV: process.env.NODE_ENV,
      JWT_SECRET: process.env.JWT_SECRET ? 'configured' : 'missing',
      MONGODB_URI: process.env.MONGODB_URI ? 'configured' : 'missing'
    },
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/auth/register',
      '/api/auth/login', 
      '/api/auth/logout',
      '/api/characters'
    ]
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  console.log('🧪 Test endpoint hit');
  res.json({ message: 'Test successful', timestamp: new Date().toISOString() });
});

// Load routes only after basic endpoints are set up
console.log('📚 Loading API routes...');

try {
  // Import routes dynamically to catch import errors
  const authRoutes = require('./routes/auth').default;
  const charactersRoutes = require('./routes/characters').default;
  
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/characters', charactersRoutes);
  
  console.log('✅ API routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading API routes:', error);
  console.error('🚨 Server will continue without API routes for debugging');
  
  // Add a debug route to show the error
  app.get('/api-error', (req, res) => {
    res.status(500).json({
      message: 'API routes failed to load',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  });
}

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      'GET /',
      'GET /test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/logout',
      'GET /api/characters',
      'POST /api/characters',
      'PUT /api/characters/:id'
    ]
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server with better error handling
console.log(`🚀 Attempting to start server on port ${port}...`);

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server successfully started on port ${port}`);
  console.log(`🏥 Health check available at: http://0.0.0.0:${port}/`);
  console.log(`🔗 API endpoints:`);
  console.log(`   - POST http://0.0.0.0:${port}/api/auth/register`);
  console.log(`   - POST http://0.0.0.0:${port}/api/auth/login`);
  console.log(`   - POST http://0.0.0.0:${port}/api/auth/logout`);
  console.log(`   - GET  http://0.0.0.0:${port}/api/characters`);
  console.log(`   - POST http://0.0.0.0:${port}/api/characters`);
  console.log(`   - PUT  http://0.0.0.0:${port}/api/characters/:id`);
}).on('error', (err: any) => {
  console.error('❌ Server failed to start:', err);
  console.error('🔍 Error details:', {
    code: err.code,
    errno: err.errno,
    syscall: err.syscall,
    address: err.address,
    port: err.port
  });
  process.exit(1);
});

console.log('✅ Server setup complete');