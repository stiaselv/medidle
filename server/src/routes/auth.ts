import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import clientPromise from '../db';
import { Collection, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

// Define the User type for our application
interface User {
  _id?: any; // Allow ObjectId
  username: string;
  passwordHash: string;
}

// Helper to get the users collection from the database
async function getUsersCollection(): Promise<Collection<User>> {
  const client = await clientPromise;
  return client.db().collection<User>('users');
}

// Input validation schemas
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

// Create a new router instance
const router = express.Router();

// --- Routes ---

// POST /api/auth/register
router.post('/register', (req: Request, res: Response) => {
  (async () => {
    try {
      const { username, password } = registerSchema.parse(req.body);

      const usersCollection = await getUsersCollection();
      const existingUser = await usersCollection.findOne({ username });

      if (existingUser) {
        return res.status(409).json({ message: 'Username already taken.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const result = await usersCollection.insertOne({ username, passwordHash });

      if (!result.insertedId) {
        return res.status(500).json({ message: 'Failed to create user.' });
      }

      res.status(201).json({ message: 'User created successfully.' });

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input.', errors: error.errors });
      } else {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
      }
    }
  })();
});

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  (async () => {
    try {
      const { username, password } = z.object({
        username: z.string(),
        password: z.string(),
      }).parse(req.body);

      const usersCollection = await getUsersCollection();
      const user = await usersCollection.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      // Create JWT
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Changed from 'strict' to 'lax'
        maxAge: 3600000, // 1 hour
      });

      res.status(200).json({
        message: 'Login successful.',
        user: {
          id: user._id,
          username: user.username,
        },
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input.', errors: error.errors });
      } else {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
      }
    }
  })();
});

// GET /api/auth/me
router.get('/me', (req: Request, res: Response) => {
  (async () => {
    try {
      console.log('🔍 /api/auth/me endpoint hit');
      console.log('🍪 All cookies:', req.cookies);
      console.log('🔑 Token cookie:', req.cookies.token);
      
      const token = req.cookies.token;

      if (!token) {
        console.log('❌ No token found in cookies');
        return res.status(401).json({ message: 'Authentication token missing.' });
      }

      console.log('✅ Token found, verifying...');
      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      console.log('✅ JWT verified, decoded:', decoded);
      
      const usersCollection = await getUsersCollection();
      const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

      if (!user) {
        console.log('❌ User not found in database');
        return res.status(404).json({ message: 'User not found.' });
      }

      console.log('✅ User found:', user.username);
      // Return user info without sensitive data
      res.status(200).json({
        user: {
          id: user._id,
          username: user.username,
        },
      });

    } catch (error) {
      console.error('💥 Auth middleware error:', error);
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }
  })();
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful.' });
});

export default router;