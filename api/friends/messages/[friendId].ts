import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { friendId } = req.query;

    if (!friendId) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }

    // Mock messages data
    const mockMessages = [
      {
        id: `msg_1`,
        senderId: friendId,
        senderName: 'FriendName',
        receiverId: 'current_user_id',
        content: 'Hey! How are you doing?',
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true
      },
      {
        id: `msg_2`,
        senderId: 'current_user_id',
        senderName: 'YourCharacter',
        receiverId: friendId,
        content: 'Good! Just been fishing all day.',
        sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        read: true
      },
      {
        id: `msg_3`,
        senderId: friendId,
        senderName: 'FriendName',
        receiverId: 'current_user_id',
        content: 'Nice! What level are you now?',
        sentAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false
      }
    ];

    res.status(200).json(mockMessages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 