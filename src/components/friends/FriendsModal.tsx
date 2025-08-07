import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Avatar,
  Badge,
  Box,
  IconButton,
  useToast,
  Divider,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  Flex,
  Textarea,
} from '@chakra-ui/react';
import { FaTrash, FaEnvelope, FaPlus, FaCheck, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { Friend, FriendRequest, Message } from '../../types/game';
import { calculateTotalLevel } from '../../utils/experience';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatProps {
  friend: Friend;
  onBack: () => void;
}

const Chat = ({ friend, onBack }: ChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { character, sendMessage, getMessages, markMessageAsRead } = useGameStore();
  const toast = useToast();

  useEffect(() => {
    loadMessages();
  }, [friend.id]);

  const loadMessages = async () => {
    try {
      const friendMessages = await getMessages(friend.id);
      setMessages(friendMessages);
      // Mark unread messages as read
      friendMessages.forEach(msg => {
        if (!msg.read && msg.receiverId === character?.id) {
          markMessageAsRead(msg.id);
        }
      });
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      await sendMessage(friend.id, message.trim());
      setMessage('');
      loadMessages(); // Reload messages to show the new one
      toast({
        title: 'Message sent',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to send message',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <VStack spacing={4} h="400px">
      <HStack w="100%" justify="space-between">
        <Button size="sm" onClick={onBack}>← Back</Button>
        <HStack>
          <Avatar size="sm" name={friend.characterName} />
          <VStack spacing={0} align="start">
            <Text fontWeight="bold">{friend.characterName}</Text>
            <Badge colorScheme={friend.isOnline ? 'green' : 'gray'} size="sm">
              {friend.isOnline ? 'Online' : 'Offline'}
            </Badge>
          </VStack>
        </HStack>
      </HStack>

      <Box
        flex={1}
        w="100%"
        bg="gray.700"
        borderRadius="md"
        p={4}
        overflowY="auto"
        maxH="250px"
      >
        <VStack spacing={2} align="stretch">
          {messages.length === 0 ? (
            <Text color="gray.400" textAlign="center">No messages yet</Text>
          ) : (
            messages.map((msg) => (
              <Box
                key={msg.id}
                p={2}
                bg={msg.senderId === character?.id ? 'blue.600' : 'gray.600'}
                borderRadius="md"
                alignSelf={msg.senderId === character?.id ? 'flex-end' : 'flex-start'}
                maxW="80%"
              >
                <Text fontSize="sm">{msg.content}</Text>
                <Text fontSize="xs" color="gray.300" mt={1}>
                  {new Date(msg.sentAt).toLocaleString()}
                </Text>
              </Box>
            ))
          )}
        </VStack>
      </Box>

      <HStack w="100%">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          resize="none"
          maxH="60px"
          size="sm"
        />
        <IconButton
          aria-label="Send message"
          icon={<FaPaperPlane />}
          colorScheme="blue"
          onClick={handleSendMessage}
          isDisabled={!message.trim()}
        />
      </HStack>
    </VStack>
  );
};

export const FriendsModal = ({ isOpen, onClose }: FriendsModalProps) => {
  const {
    character,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    getFriendRequests
  } = useGameStore();
  
  const [newFriendName, setNewFriendName] = useState('');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      loadFriendRequests();
    }
  }, [isOpen]);

  const loadFriendRequests = async () => {
    try {
      const requests = await getFriendRequests();
      setFriendRequests(requests);
    } catch (error) {
      console.error('Failed to load friend requests:', error);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!newFriendName.trim()) return;

    setLoading(true);
    try {
      await sendFriendRequest(newFriendName.trim());
      setNewFriendName('');
      toast({
        title: 'Friend request sent!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to send friend request',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      loadFriendRequests();
      toast({
        title: 'Friend request accepted!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to accept friend request',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
      loadFriendRequests();
      toast({
        title: 'Friend request declined',
        status: 'info',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to decline friend request',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await removeFriend(friendId);
      toast({
        title: 'Friend removed',
        status: 'info',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to remove friend',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Safety check - don't render if no character
  if (!character) {
    return null;
  }

  const friends = character.friends || [];
  const messages = character.messages || [];
  const pendingRequests = friendRequests.filter(req => req.toCharacterId === character.id && req.status === 'pending');
  const unreadMessagesCount = messages.filter(msg => !msg.read && msg.receiverId === character.id).length || 0;

  if (selectedFriend) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Chat with {selectedFriend.characterName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Chat friend={selectedFriend} onBack={() => setSelectedFriend(null)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>Friends ({friends.length})</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs>
            <TabList>
              <Tab>Friends List</Tab>
              <Tab>
                Friend Requests
                {pendingRequests.length > 0 && (
                  <Badge ml={2} colorScheme="red" borderRadius="full">
                    {pendingRequests.length}
                  </Badge>
                )}
              </Tab>
              <Tab>Add Friend</Tab>
            </TabList>

            <TabPanels>
              {/* Friends List */}
              <TabPanel>
                <VStack spacing={3} align="stretch">
                  {friends.length === 0 ? (
                    <Alert status="info">
                      <AlertIcon />
                      You haven't added any friends yet. Use the "Add Friend" tab to find friends!
                    </Alert>
                  ) : (
                    friends.map((friend) => {
                      const unreadCount = messages.filter(
                        msg => !msg.read && msg.senderId === friend.characterId && msg.receiverId === character.id
                      ).length || 0;

                      return (
                        <Box key={friend.id} p={3} bg="gray.700" borderRadius="md">
                          <Flex justify="space-between" align="center">
                            <HStack>
                              <Avatar size="sm" name={friend.characterName} />
                              <VStack spacing={0} align="start">
                                <Text fontWeight="bold">{friend.characterName}</Text>
                                <HStack spacing={2}>
                                  <Badge colorScheme={friend.isOnline ? 'green' : 'gray'} size="sm">
                                    {friend.isOnline ? 'Online' : 'Offline'}
                                  </Badge>
                                  <Text fontSize="xs" color="gray.400">
                                    Total Level: {friend.totalLevel}
                                  </Text>
                                  <Text fontSize="xs" color="gray.400">
                                    Combat: {friend.combatLevel}
                                  </Text>
                                </HStack>
                              </VStack>
                            </HStack>
                            <HStack>
                              <IconButton
                                aria-label="Send message"
                                icon={<FaEnvelope />}
                                size="sm"
                                colorScheme="blue"
                                onClick={() => setSelectedFriend(friend)}
                                position="relative"
                              >
                                {unreadCount > 0 && (
                                  <Badge
                                    position="absolute"
                                    top="-5px"
                                    right="-5px"
                                    colorScheme="red"
                                    borderRadius="full"
                                    fontSize="xs"
                                  >
                                    {unreadCount}
                                  </Badge>
                                )}
                              </IconButton>
                              <IconButton
                                aria-label="Remove friend"
                                icon={<FaTrash />}
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleRemoveFriend(friend.id)}
                              />
                            </HStack>
                          </Flex>
                        </Box>
                      );
                    })
                  )}
                </VStack>
              </TabPanel>

              {/* Friend Requests */}
              <TabPanel>
                <VStack spacing={3} align="stretch">
                  {pendingRequests.length === 0 ? (
                    <Alert status="info">
                      <AlertIcon />
                      No pending friend requests
                    </Alert>
                  ) : (
                    pendingRequests.map((request) => (
                      <Box key={request.id} p={3} bg="gray.700" borderRadius="md">
                        <Flex justify="space-between" align="center">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold">{request.fromCharacterName}</Text>
                            <Text fontSize="sm" color="gray.400">
                              Sent {new Date(request.sentAt).toLocaleDateString()}
                            </Text>
                          </VStack>
                          <HStack>
                            <IconButton
                              aria-label="Accept request"
                              icon={<FaCheck />}
                              size="sm"
                              colorScheme="green"
                              onClick={() => handleAcceptRequest(request.id)}
                            />
                            <IconButton
                              aria-label="Decline request"
                              icon={<FaTimes />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => handleDeclineRequest(request.id)}
                            />
                          </HStack>
                        </Flex>
                      </Box>
                    ))
                  )}
                </VStack>
              </TabPanel>

              {/* Add Friend */}
              <TabPanel>
                <VStack spacing={4}>
                  <Text>Enter the character name you want to add as a friend:</Text>
                  <InputGroup>
                    <Input
                      value={newFriendName}
                      onChange={(e) => setNewFriendName(e.target.value)}
                      placeholder="Character name"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendFriendRequest()}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Add friend"
                        icon={<FaPlus />}
                        size="sm"
                        colorScheme="green"
                        onClick={handleSendFriendRequest}
                        isLoading={loading}
                        isDisabled={!newFriendName.trim()}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <Text fontSize="sm" color="gray.400">
                    The character will receive a friend request that they can accept or decline.
                  </Text>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 