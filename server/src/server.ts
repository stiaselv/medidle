import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// Enhanced port debugging
console.log('🚀 Minimal server starting for Railway debugging...');
console.log('🔍 Environment variables:');
console.log('  - PORT:', process.env.PORT);
console.log('  - RAILWAY_PUBLIC_PORT:', process.env.RAILWAY_PUBLIC_PORT);
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  - MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('  - FRONTEND_URL:', process.env.FRONTEND_URL);

const port = parseInt(process.env.PORT || process.env.RAILWAY_PUBLIC_PORT || '3000', 10);

console.log('📍 Final port to use:', port);

// Basic CORS (very permissive for testing)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Health check - this MUST work for Railway
app.get('/', (req, res) => {
  console.log('🏥 Health check hit from:', req.get('User-Agent'));
  
  const response = { 
    status: 'ok', 
    message: 'Medidle server health check passed',
    port: port,
    timestamp: new Date().toISOString(),
    env: {
      PORT: process.env.PORT,
      RAILWAY_PUBLIC_PORT: process.env.RAILWAY_PUBLIC_PORT,
      NODE_ENV: process.env.NODE_ENV,
      JWT_SECRET: process.env.JWT_SECRET ? 'configured' : 'missing',
      MONGODB_URI: process.env.MONGODB_URI ? 'configured' : 'missing',
      FRONTEND_URL: process.env.FRONTEND_URL
    }
  };
  
  console.log('✅ Health check response sent:', response);
  res.json(response);
});

// Simple test endpoint
app.get('/test', (req, res) => {
  console.log('🧪 Test endpoint hit');
  res.json({ 
    message: 'Server is working!', 
    timestamp: new Date().toISOString(),
    port: port
  });
});

// Database connection test (without crashing server)
app.get('/db-test', (req, res) => {
  (async () => {
    console.log('🗄️ Database test requested');
    
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({
        status: 'error',
        message: 'MONGODB_URI not configured'
      });
    }

    try {
      // Import MongoDB only when needed
      const { MongoClient } = require('mongodb');
      console.log('📦 MongoDB driver imported');
      
      const client = new MongoClient(process.env.MONGODB_URI);
      console.log('🔗 Attempting MongoDB connection...');
      
      await client.connect();
      console.log('✅ MongoDB connected successfully');
      
      // Test database operation
      const db = client.db();
      const result = await db.admin().ping();
      console.log('🏓 MongoDB ping result:', result);
      
      await client.close();
      console.log('🔌 MongoDB connection closed');
      
      res.json({
        status: 'ok',
        message: 'Database connection successful',
        mongodb_uri_provided: true,
        connection_test: 'passed'
      });
      
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      res.status(500).json({
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        mongodb_uri_provided: !!process.env.MONGODB_URI
      });
    }
  })();
});

// Load API routes only if everything else works
app.get('/load-api', (req, res) => {
  try {
    console.log('📚 Loading API routes...');
    
    const authRoutes = require('./routes/auth').default;
    const charactersRoutes = require('./routes/characters').default;
    
    app.use('/api/auth', authRoutes);
    app.use('/api/characters', charactersRoutes);
    
    console.log('✅ API routes loaded successfully');
    res.json({ message: 'API routes loaded successfully' });
    
  } catch (error) {
    console.error('❌ Error loading API routes:', error);
    res.status(500).json({
      message: 'Failed to load API routes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

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
      'GET /db-test',
      'GET /load-api'
    ]
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message 
  });
});

// Start server
console.log(`🚀 Starting server on port ${port}...`);

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ SERVER STARTED SUCCESSFULLY ON PORT ${port}`);
  console.log(`🏥 Health check: http://0.0.0.0:${port}/`);
  console.log(`🧪 Test endpoint: http://0.0.0.0:${port}/test`);
  console.log(`🗄️ DB test: http://0.0.0.0:${port}/db-test`);
  console.log(`📚 Load API: http://0.0.0.0:${port}/load-api`);
  console.log('='.repeat(50));
});

server.on('error', (err: any) => {
  console.error('❌ SERVER FAILED TO START:', err);
  console.error('Error details:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

console.log('✅ Server setup complete - waiting for Railway health check...');
console.log('✅ Server setup complete');