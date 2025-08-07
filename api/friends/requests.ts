import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Mock friend requests data
    const mockFriendRequests = [
      {
        id: `req_${Date.now()}`,
        fromCharacterId: 'sender_id',
        fromCharacterName: 'TestFriend',
        toCharacterId: 'current_user_id',
        toCharacterName: 'YourCharacter',
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        status: 'pending'
      }
    ];

    res.status(200).json(mockFriendRequests);
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 