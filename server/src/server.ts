import express from 'express';

const app = express();

// Absolutely minimal logging
console.log('='.repeat(50));
console.log('🚀 ULTRA MINIMAL SERVER STARTING');
console.log('='.repeat(50));

// Get port with extensive logging
console.log('🔍 Port detection:');
console.log('  process.env.PORT:', process.env.PORT);
console.log('  process.env.RAILWAY_PUBLIC_PORT:', process.env.RAILWAY_PUBLIC_PORT);

const port = parseInt(process.env.PORT || process.env.RAILWAY_PUBLIC_PORT || '3000', 10);
console.log(`📍 Using port: ${port}`);

// Ultra simple middleware
app.use(express.json());

// Health check - absolute minimal
app.get('/', (req, res) => {
  console.log('🏥 HEALTH CHECK HIT!');
  const response = {
    status: 'ok',
    message: 'Ultra minimal server working',
    port: port,
    timestamp: new Date().toISOString(),
    env: {
      PORT: process.env.PORT || 'not set',
      RAILWAY_PUBLIC_PORT: process.env.RAILWAY_PUBLIC_PORT || 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    }
  };
  console.log('✅ Sending health check response');
  res.json(response);
});

// Test endpoint
app.get('/test', (req, res) => {
  console.log('🧪 Test endpoint hit');
  res.json({ 
    message: 'Test successful!',
    timestamp: new Date().toISOString()
  });
});

// Show environment variables (for debugging)
app.get('/env', (req, res) => {
  console.log('🔍 Environment check requested');
  res.json({
    PORT: process.env.PORT,
    RAILWAY_PUBLIC_PORT: process.env.RAILWAY_PUBLIC_PORT,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    FRONTEND_URL: process.env.FRONTEND_URL
  });
});

// Catch all
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: 'Route not found',
    available: ['GET /', 'GET /test', 'GET /env']
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('❌ ERROR:', err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// Start server with maximum error handling
console.log(`🚀 ATTEMPTING TO START SERVER ON PORT ${port}`);
console.log(`🔗 Will listen on 0.0.0.0:${port}`);

try {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log('='.repeat(50));
    console.log(`✅ ✅ ✅ SERVER STARTED SUCCESSFULLY! ✅ ✅ ✅`);
    console.log(`🏥 Health check: http://0.0.0.0:${port}/`);
    console.log(`🧪 Test: http://0.0.0.0:${port}/test`);
    console.log(`🔍 Env: http://0.0.0.0:${port}/env`);
    console.log('='.repeat(50));
    console.log('🎉 SERVER IS READY FOR RAILWAY HEALTH CHECK!');
    console.log('='.repeat(50));
  });

  server.on('error', (err: any) => {
    console.error('='.repeat(50));
    console.error('❌ ❌ ❌ SERVER ERROR! ❌ ❌ ❌');
    console.error('Error:', err);
    console.error('Code:', err.code);
    console.error('Port:', err.port);
    console.error('='.repeat(50));
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received - shutting down gracefully');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });

} catch (error) {
  console.error('='.repeat(50));
  console.error('❌ ❌ ❌ FAILED TO START SERVER! ❌ ❌ ❌');
  console.error('Error:', error);
  console.error('='.repeat(50));
  process.exit(1);
}

console.log('✅ Server setup complete - waiting for Railway...');