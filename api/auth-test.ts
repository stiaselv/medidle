import type { VercelRequest, VercelResponse } from '@vercel/node';

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

  // Simulate authentication check
  const cookies = req.headers.cookie || '';
  const hasToken = cookies.includes('token=');
  
  if (hasToken) {
    // Simulate authenticated user
    res.status(200).json({
      user: {
        id: 'test-user-id',
        username: 'testuser'
      }
    });
  } else {
    // Not authenticated
    res.status(401).json({ message: 'Not authenticated' });
  }
} 