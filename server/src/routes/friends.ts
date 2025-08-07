import { Router } from 'express';

const router = Router();

// Mock data storage (in a real app, this would be in a database)
let mockFriendRequests = [
  {
    id: '1',
    fromCharacterId: '2',
    fromCharacterName: 'SkillMaster',
    toCharacterId: '1',
    toCharacterName: 'PlayerOne',
    status: 'pending',
    sentAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    fromCharacterId: '3',
    fromCharacterName: 'CombatPro',
    toCharacterId: '1',
    toCharacterName: 'PlayerOne',
    status: 'pending',
    sentAt: new Date('2024-01-16T14:20:00Z')
  }
];

let mockFriends = [
  {
    id: '1',
    characterId: '4',
    characterName: 'Gatherer',
    friendSince: new Date('2024-01-10T08:00:00Z'),
    isOnline: true,
    lastSeen: new Date()
  },
  {
    id: '2', 
    characterId: '5',
    characterName: 'Balanced',
    friendSince: new Date('2024-01-12T16:45:00Z'),
    isOnline: false,
    lastSeen: new Date('2024-01-16T20:30:00Z')
  }
];

let mockMessages = [
  {
    id: '1',
    fromCharacterId: '4',
    fromCharacterName: 'Gatherer',
    toCharacterId: '1',
    toCharacterName: 'PlayerOne',
    message: 'Hey! Want to go fishing together?',
    sentAt: new Date('2024-01-16T09:15:00Z'),
    isRead: false
  },
  {
    id: '2',
    fromCharacterId: '1',
    fromCharacterName: 'PlayerOne',
    toCharacterId: '4',
    toCharacterName: 'Gatherer',
    message: 'Sure! Let me finish this mining session first.',
    sentAt: new Date('2024-01-16T09:18:00Z'),
    isRead: true
  },
  {
    id: '3',
    fromCharacterId: '5',
    fromCharacterName: 'Balanced',
    toCharacterId: '1',
    toCharacterName: 'PlayerOne',
    message: 'Congrats on reaching level 99 in combat!',
    sentAt: new Date('2024-01-15T18:30:00Z'),
    isRead: true
  }
];

// GET /api/friends/requests - Get friend requests for current user
router.get('/requests', async (req, res) => {
  try {
    // In a real app, get current user from auth token
    const currentCharacterId = '1'; // Mock current user
    
    const requests = mockFriendRequests.filter(
      request => request.toCharacterId === currentCharacterId && request.status === 'pending'
    );
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/friends/messages/:friendId - Get messages with a specific friend
router.get('/messages/:friendId', async (req, res) => {
  try {
    const { friendId } = req.params;
    const currentCharacterId = '1'; // Mock current user
    
    const messages = mockMessages.filter(
      message => 
        (message.fromCharacterId === currentCharacterId && message.toCharacterId === friendId) ||
        (message.fromCharacterId === friendId && message.toCharacterId === currentCharacterId)
    ).sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/friends/request - Send a friend request
router.post('/request', async (req, res) => {
  try {
    const { characterName } = req.body;
    const currentCharacterId = '1'; // Mock current user
    const currentCharacterName = 'PlayerOne'; // Mock current user name
    
    if (!characterName) {
      return res.status(400).json({ message: 'Character name is required' });
    }
    
    // Mock finding the target character (in real app, query database)
    const targetCharacter = { id: '6', name: characterName }; // Mock target
    
    if (!targetCharacter) {
      return res.status(404).json({ message: 'Character not found' });
    }
    
    // Check if already friends or request exists
    const existingRequest = mockFriendRequests.find(
      request => 
        (request.fromCharacterId === currentCharacterId && request.toCharacterId === targetCharacter.id) ||
        (request.fromCharacterId === targetCharacter.id && request.toCharacterId === currentCharacterId)
    );
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }
    
    const existingFriend = mockFriends.find(
      friend => friend.characterId === targetCharacter.id
    );
    
    if (existingFriend) {
      return res.status(400).json({ message: 'Already friends with this character' });
    }
    
    // Create new friend request
    const newRequest = {
      id: (mockFriendRequests.length + 1).toString(),
      fromCharacterId: currentCharacterId,
      fromCharacterName: currentCharacterName,
      toCharacterId: targetCharacter.id,
      toCharacterName: targetCharacter.name,
      status: 'pending',
      sentAt: new Date()
    };
    
    mockFriendRequests.push(newRequest);
    
    res.status(201).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/friends/accept/:requestId - Accept a friend request
router.post('/accept/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentCharacterId = '1'; // Mock current user
    
    const requestIndex = mockFriendRequests.findIndex(
      request => request.id === requestId && request.toCharacterId === currentCharacterId
    );
    
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    const request = mockFriendRequests[requestIndex];
    
    // Add to friends list
    const newFriend = {
      id: (mockFriends.length + 1).toString(),
      characterId: request.fromCharacterId,
      characterName: request.fromCharacterName,
      friendSince: new Date(),
      isOnline: Math.random() > 0.5, // Random online status
      lastSeen: new Date()
    };
    
    mockFriends.push(newFriend);
    
    // Remove from friend requests
    mockFriendRequests.splice(requestIndex, 1);
    
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/friends/decline/:requestId - Decline a friend request
router.post('/decline/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentCharacterId = '1'; // Mock current user
    
    const requestIndex = mockFriendRequests.findIndex(
      request => request.id === requestId && request.toCharacterId === currentCharacterId
    );
    
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    // Remove from friend requests
    mockFriendRequests.splice(requestIndex, 1);
    
    res.json({ message: 'Friend request declined' });
  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/friends/remove/:friendId - Remove a friend
router.delete('/remove/:friendId', async (req, res) => {
  try {
    const { friendId } = req.params;
    
    const friendIndex = mockFriends.findIndex(
      friend => friend.characterId === friendId
    );
    
    if (friendIndex === -1) {
      return res.status(404).json({ message: 'Friend not found' });
    }
    
    // Remove from friends list
    mockFriends.splice(friendIndex, 1);
    
    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/friends/message - Send a message to a friend
router.post('/message', async (req, res) => {
  try {
    const { friendId, message } = req.body;
    const currentCharacterId = '1'; // Mock current user
    const currentCharacterName = 'PlayerOne'; // Mock current user name
    
    if (!friendId || !message) {
      return res.status(400).json({ message: 'Friend ID and message are required' });
    }
    
    // Check if they are friends
    const friend = mockFriends.find(f => f.characterId === friendId);
    if (!friend) {
      return res.status(400).json({ message: 'Not friends with this character' });
    }
    
    // Create new message
    const newMessage = {
      id: (mockMessages.length + 1).toString(),
      fromCharacterId: currentCharacterId,
      fromCharacterName: currentCharacterName,
      toCharacterId: friendId,
      toCharacterName: friend.characterName,
      message,
      sentAt: new Date(),
      isRead: false
    };
    
    mockMessages.push(newMessage);
    
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/friends - Get friends list
router.get('/', async (req, res) => {
  try {
    // Add unread message counts to friends
    const friendsWithMessages = mockFriends.map(friend => {
      const unreadCount = mockMessages.filter(
        msg => msg.fromCharacterId === friend.characterId && !msg.isRead
      ).length;
      
      return {
        ...friend,
        unreadMessages: unreadCount
      };
    });
    
    res.json(friendsWithMessages);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 