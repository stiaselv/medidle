import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    console.log('1. Starting auth test...');

    // Test 1: Environment variables
    if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
      return res.status(500).json({ 
        error: 'Missing environment variables',
        hasJWT: !!process.env.JWT_SECRET,
        hasMongo: !!process.env.MONGODB_URI 
      });
    }
    console.log('2. Environment variables OK');

    // Test 2: Import dependencies
    try {
      console.log('3. Testing bcrypt import...');
      const bcrypt = await import('bcryptjs');
      console.log('4. bcrypt imported successfully');

      console.log('5. Testing jwt import...');
      const jwt = await import('jsonwebtoken');
      console.log('6. jwt imported successfully');

      console.log('7. Testing zod import...');
      const { z } = await import('zod');
      console.log('8. zod imported successfully');

      console.log('9. Testing mongodb import...');
      const { MongoClient } = await import('mongodb');
      console.log('10. mongodb imported successfully');

      // Test 3: Import our custom modules
      console.log('11. Testing db import...');
      const clientPromise = await import('./_lib/db');
      console.log('12. db imported successfully');

      console.log('13. Testing types import...');
      const types = await import('./_lib/types');
      console.log('14. types imported successfully');

      // Test 4: MongoDB connection
      console.log('15. Testing MongoDB connection...');
      const client = await clientPromise.default;
      console.log('16. MongoDB client obtained');

      const db = client.db();
      console.log('17. Database obtained');

      const usersCollection = db.collection('users');
      console.log('18. Users collection obtained');

      // Test basic query
      const userCount = await usersCollection.countDocuments();
      console.log('19. User count query successful:', userCount);

      res.status(200).json({
        success: true,
        message: 'All auth dependencies working!',
        userCount,
        timestamp: new Date().toISOString()
      });

    } catch (importError) {
      console.error('Import/connection error:', importError);
      return res.status(500).json({
        error: 'Import or connection failed',
        details: importError instanceof Error ? importError.message : 'Unknown error',
        stack: importError instanceof Error ? importError.stack : undefined
      });
    }

  } catch (error) {
    console.error('Top-level error:', error);
    res.status(500).json({
      error: 'Top-level failure',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
} 