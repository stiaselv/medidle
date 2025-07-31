import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Collection, MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Inline database connection
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri);
const clientPromise = client.connect();

// Inline types
export interface User {
  _id?: any;
  username: string;
  passwordHash: string;
}

// Helper to get the users collection
async function getUsersCollection(): Promise<Collection<User>> {
  const client = await clientPromise;
  return client.db().collection<User>('users');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse cookies
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing.' });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return user info without sensitive data
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
      },
    });

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid authentication token.' });
  }
} 