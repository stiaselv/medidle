import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    console.log('Debug endpoint called');

    const debugInfo = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'undefined',
      platform: process.platform,
      vercelRegion: process.env.VERCEL_REGION || 'undefined',
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      mongoUriStart: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'undefined',
      allEnvVars: Object.keys(process.env).filter(key => 
        key.includes('MONGO') || 
        key.includes('JWT') || 
        key.includes('DATABASE') ||
        key.includes('NODE_ENV')
      ),
    };

    console.log('Debug info prepared:', debugInfo);

    res.status(200).json({
      success: true,
      debug: debugInfo
    });

    console.log('Debug response sent');

  } catch (error) {
    console.error('Debug endpoint error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
} 