import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { friendId } = req.query;

    if (!friendId) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }

    // Mock successful removal
    const mockUpdatedCharacter = {
      friends: [] // Remove the friend from the list
    };

    res.status(200).json(mockUpdatedCharacter);
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 