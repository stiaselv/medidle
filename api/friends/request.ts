import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fromCharacterId, toCharacterName } = req.body;

    if (!fromCharacterId || !toCharacterName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // For now, return a mock success response
    // In a real implementation, this would:
    // 1. Find the target character by name
    // 2. Create a friend request record
    // 3. Update both characters' data

    const mockUpdatedCharacter = {
      // Mock character data - in reality this would come from database
      friendRequests: [
        {
          id: `req_${Date.now()}`,
          fromCharacterId: fromCharacterId,
          fromCharacterName: 'YourCharacter',
          toCharacterId: 'target_id',
          toCharacterName: toCharacterName,
          sentAt: new Date(),
          status: 'pending'
        }
      ]
    };

    res.status(200).json(mockUpdatedCharacter);
  } catch (error) {
    console.error('Friend request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 