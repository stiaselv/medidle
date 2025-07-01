import express from 'express';

const app = express();

// Enhanced port debugging
console.log('🚀 Minimal server starting...');
console.log('🔍 Environment variables:');
console.log('  - PORT:', process.env.PORT);
console.log('  - RAILWAY_PUBLIC_PORT:', process.env.RAILWAY_PUBLIC_PORT);
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - All env vars:', Object.keys(process.env).filter(k => k.includes('PORT')));

const port = parseInt(process.env.PORT || process.env.RAILWAY_PUBLIC_PORT || '3000', 10);

console.log('📍 Final port to use:', port);

// Simple health check
app.get('/', (req, res) => {
  console.log('🏥 Health check hit');
  res.json({ 
    status: 'ok', 
    message: 'Minimal server running',
    port: port,
    env: {
      PORT: process.env.PORT,
      RAILWAY_PUBLIC_PORT: process.env.RAILWAY_PUBLIC_PORT,
      NODE_ENV: process.env.NODE_ENV
    },
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoint
app.get('/test', (req, res) => {
  console.log('🧪 Test endpoint hit');
  res.json({ message: 'Test successful', timestamp: new Date().toISOString() });
});

// Start server with better error handling
console.log(`🚀 Attempting to start server on port ${port}...`);

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server successfully started on port ${port}`);
  console.log(`🏥 Health check available at: http://0.0.0.0:${port}/`);
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