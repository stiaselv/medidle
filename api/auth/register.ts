import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Collection } from 'mongodb';
import clientPromise from '../../src/lib/api/db';
import { User } from '../../src/lib/api/types';

// Helper to get the users collection
async function getUsersCollection(): Promise<Collection<User>> {
  const client = await clientPromise;
  return client.db().collection<User>('users');
}

// Input validation
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
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
} 