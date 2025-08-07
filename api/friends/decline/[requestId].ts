import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { requestId } = req.query;

    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required' });
    }

    // Mock successful decline
    const mockUpdatedCharacter = {
      friendRequests: [] // Remove the declined request
    };

    res.status(200).json(mockUpdatedCharacter);
  } catch (error) {
    console.error('Decline friend request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 