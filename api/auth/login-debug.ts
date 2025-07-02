import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    console.log('1. Function started');

    // Check environment variables first
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ 
        error: 'JWT_SECRET not configured',
        debug: 'Environment variable missing'
      });
    }

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        error: 'MONGODB_URI not configured',
        debug: 'Environment variable missing'
      });
    }

    console.log('2. Environment variables checked');

    // Check method
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    console.log('3. Method checked');

    // Check body
    if (!req.body) {
      return res.status(400).json({ 
        error: 'No request body',
        debug: 'Request body is missing'
      });
    }

    console.log('4. Body checked');

    try {
      // Try importing dependencies one by one
      console.log('5. Importing bcrypt...');
      const bcrypt = await import('bcryptjs');
      
      console.log('6. Importing jwt...');
      const jwt = await import('jsonwebtoken');
      
      console.log('7. Importing zod...');
      const { z } = await import('zod');
      
      console.log('8. Importing mongodb...');
      const { MongoClient } = await import('mongodb');
      
      console.log('9. All imports successful');

      // Try basic validation
      const loginSchema = z.object({
        username: z.string(),
        password: z.string(),
      });

      const { username, password } = loginSchema.parse(req.body);
      console.log('10. Validation successful');

      // Try MongoDB connection
      console.log('11. Attempting MongoDB connection...');
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      console.log('12. MongoDB connected successfully');

      const usersCollection = client.db().collection('users');
      console.log('13. Got users collection');

      // Try to find user
      const user = await usersCollection.findOne({ username });
      console.log('14. User query completed');

      if (!user) {
        await client.close();
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      console.log('15. User found');

      // Try password comparison
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      console.log('16. Password comparison completed');

      if (!isPasswordValid) {
        await client.close();
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      console.log('17. Password valid');

      // Try JWT creation
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      console.log('18. JWT created');

      await client.close();
      console.log('19. Database connection closed');

      // Set cookie and respond
      res.setHeader('Set-Cookie', [
        `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
      ]);

      res.status(200).json({
        message: 'Login successful.',
        user: {
          id: user._id,
          username: user.username,
        },
      });

      console.log('20. Response sent successfully');

    } catch (importError) {
      console.error('Import/Logic error:', importError);
      return res.status(500).json({ 
        error: 'Import or logic error',
        debug: importError instanceof Error ? importError.message : 'Unknown import error',
        stack: importError instanceof Error ? importError.stack : undefined
      });
    }

  } catch (error) {
    console.error('Top-level error:', error);
    res.status(500).json({ 
      error: 'Top-level server error',
      debug: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
} 