module.exports = (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const debugInfo = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'undefined',
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      allEnvVars: Object.keys(process.env).filter(key => 
        key.includes('MONGO') || 
        key.includes('JWT') || 
        key.includes('DATABASE') ||
        key.includes('NODE_ENV')
      ),
    };

    res.status(200).json({
      success: true,
      debug: debugInfo,
      message: 'CommonJS version working!'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Debug endpoint failed',
      message: error.message || 'Unknown error'
    });
  }
}; 