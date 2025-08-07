import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Mock successful message sending
    const mockMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      senderName: 'YourCharacter',
      receiverId,
      content: content.trim(),
      sentAt: new Date(),
      read: false
    };

    res.status(200).json(mockMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 