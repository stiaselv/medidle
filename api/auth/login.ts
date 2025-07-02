import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Collection } from 'mongodb';
import clientPromise from '../lib/db';
import { User } from '../lib/types';

// Helper to get the users collection
async function getUsersCollection(): Promise<Collection<User>> {
  const client = await clientPromise;
  return client.db().collection<User>('users');
}

// Input validation
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = loginSchema.parse(req.body);

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

    // Set cookie
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

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid input.', errors: error.errors });
    } else {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
} 