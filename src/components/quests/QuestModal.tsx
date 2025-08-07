import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Box,
  Badge,
  Image,
  Progress,
  Divider,
  Icon,
  Flex,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaPlay, FaCheck, FaCrown, FaCoins, FaStar } from 'react-icons/fa';
import { useGameStore } from '../../store/gameStore';
import { getAllQuests } from '../../data/quests';
import { getItemById } from '../../data/items';
import type { Quest, QuestRequirement, QuestReward } from '../../types/game';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuestRequirementDisplay = ({ 
  requirement, 
  questId, 
  questProgress 
}: { 
  requirement: QuestRequirement; 
  questId: string; 
  questProgress: Record<string, number>; 
}) => {
  const { character } = useGameStore();
  const currentProgress = questProgress[requirement.id] || 0;
  
  let displayProgress = currentProgress;
  let hasRequiredAmount = false;
  
  if (requirement.type === 'item' && requirement.itemId) {
    // For item requirements, check bank quantity
    const bankItem = character?.bank.find(item => item.id === requirement.itemId);
    displayProgress = bankItem?.quantity || 0;
    hasRequiredAmount = displayProgress >= requirement.quantity;
    
    const item = getItemById(requirement.itemId);
    return (
      <HStack spacing={2} p={1} bg="gray.700" borderRadius="sm">
        <Image
          src={item?.icon || '/assets/items/placeholder.png'}
          alt={requirement.itemName}
          boxSize="24px"
          fallbackSrc="/assets/items/placeholder.png"
        />
        <VStack align="start" spacing={0} flex={1}>
          <Text fontSize="xs" fontWeight="medium" color="white">
            {requirement.itemName}
          </Text>
          <HStack>
            <Text 
              fontSize="xs" 
              color={hasRequiredAmount ? "green.300" : "red.300"}
            >
              {displayProgress} / {requirement.quantity}
            </Text>
            {hasRequiredAmount && <Icon as={FaCheck} color="green.300" boxSize={3} />}
          </HStack>
        </VStack>
      </HStack>
    );
  } else if (requirement.type === 'kill') {
    hasRequiredAmount = displayProgress >= requirement.quantity;
    const progressPercent = (displayProgress / requirement.quantity) * 100;
    
    return (
      <VStack align="start" spacing={1} p={1} bg="gray.700" borderRadius="sm">
        <HStack justify="space-between" w="100%">
          <Text fontSize="xs" fontWeight="medium" color="white">
            Slay {requirement.monsterName}
          </Text>
          <HStack>
            <Text fontSize="xs" color={hasRequiredAmount ? "green.300" : "yellow.300"}>
              {displayProgress} / {requirement.quantity}
            </Text>
            {hasRequiredAmount && <Icon as={FaCheck} color="green.300" boxSize={3} />}
          </HStack>
        </HStack>
        <Progress
          value={progressPercent}
          size="xs"
          colorScheme={hasRequiredAmount ? "green" : "yellow"}
          w="100%"
        />
      </VStack>
    );
  }
  
  return null;
};

const QuestRewardDisplay = ({ reward }: { reward: QuestReward }) => {
  if (reward.type === 'gold') {
    return (
      <HStack spacing={1} p={1} bg="yellow.600" borderRadius="sm">
        <Icon as={FaCoins} color="yellow.200" boxSize={3} />
        <Text fontSize="xs" color="white" fontWeight="medium">
          {reward.quantity.toLocaleString()} GP
        </Text>
      </HStack>
    );
  } else if (reward.type === 'experience' && reward.skillName) {
    return (
      <HStack spacing={1} p={1} bg="blue.600" borderRadius="sm">
        <Icon as={FaStar} color="blue.200" boxSize={3} />
        <VStack align="start" spacing={0}>
          <Text fontSize="xs" color="white" fontWeight="medium">
            {reward.quantity.toLocaleString()} XP
          </Text>
          <Text fontSize="xs" color="blue.200" textTransform="capitalize">
            {reward.skillName}
          </Text>
        </VStack>
      </HStack>
    );
  } else if (reward.type === 'item' && reward.itemId) {
    const item = getItemById(reward.itemId);
    return (
      <HStack spacing={1} p={1} bg="purple.600" borderRadius="sm">
        <Image
          src={item?.icon || '/assets/items/placeholder.png'}
          alt={reward.itemName}
          boxSize="16px"
          fallbackSrc="/assets/items/placeholder.png"
        />
        <VStack align="start" spacing={0}>
          <Text fontSize="xs" color="white" fontWeight="medium">
            {reward.itemName}
          </Text>
          <Text fontSize="xs" color="purple.200">
            x{reward.quantity}
          </Text>
        </VStack>
      </HStack>
    );
  }
  
  return null;
};

const QuestCard = ({ quest }: { quest: Quest }) => {
  const { character, startQuest, checkQuestRequirements, completeQuest } = useGameStore();
  const toast = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isActive = character?.activeQuests?.some(q => q.id === quest.id) || false;
  const questProgress = character?.questProgress?.[quest.id];
  const isCompleted = questProgress?.isCompleted || false;
  const canComplete = isActive && character && checkQuestRequirements(quest.id);

  const handleCompleteQuest = () => {
    if (!character || !canComplete) return;
    
    try {
      completeQuest(quest.id);
      toast({
        title: 'Quest Completed!',
        description: `You have completed "${quest.title}" and received your rewards!`,
        status: 'success',
        duration: 4000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete quest',
        status: 'error',
        duration: 3000,
      });
    }
  };
  
  const handleStartQuest = () => {
    if (!character) return;
    
    try {
      startQuest(quest.id);
      toast({
        title: 'Quest Started!',
        description: `You have started "${quest.title}"`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start quest',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return <Badge colorScheme="green" variant="solid">Completed</Badge>;
    }
    if (isActive) {
      return <Badge colorScheme="blue" variant="solid">Active</Badge>;
    }
    return <Badge colorScheme="gray" variant="outline">Available</Badge>;
  };

  if (!isExpanded) {
    // Collapsed view - minimal information
    return (
      <Box
        border="2px"
        borderColor={isActive ? "blue.500" : isCompleted ? "green.500" : "gray.600"}
        borderRadius="md"
        p={2}
        bg="gray.800"
        _hover={{ 
          borderColor: isActive ? "blue.400" : isCompleted ? "green.400" : "gray.500", 
          cursor: "pointer",
          transform: "translateY(-1px)",
          shadow: "md"
        }}
        transition="all 0.2s"
        onClick={() => setIsExpanded(true)}
      >
        <VStack align="start" spacing={1}>
          {/* Quest Header */}
          <HStack justify="space-between" w="100%">
            <HStack>
              <Text fontSize="sm" fontWeight="bold" color="white">
                {quest.title}
              </Text>
              {getStatusBadge()}
            </HStack>
            <HStack>
              {canComplete && (
                <Icon as={FaCrown} color="yellow.400" boxSize={4} />
              )}
              <Text fontSize="xs" color="gray.500">▼</Text>
            </HStack>
          </HStack>

          {/* Quick Rewards Preview */}
          <HStack spacing={1} wrap="wrap">
            {quest.rewards.slice(0, 2).map((reward) => (
              <Box key={reward.id} fontSize="xs" color="gray.300">
                {reward.type === 'gold' && `${reward.quantity.toLocaleString()} GP`}
                {reward.type === 'experience' && `${reward.quantity.toLocaleString()} ${reward.skillName} XP`}
                {reward.type === 'item' && `${reward.quantity}x ${reward.itemName}`}
              </Box>
            ))}
            {quest.rewards.length > 2 && (
              <Text fontSize="xs" color="gray.500">+{quest.rewards.length - 2} more</Text>
            )}
          </HStack>

          {/* Progress indicator for active quests */}
          {isActive && (
            <Text fontSize="xs" color="blue.300">
              {quest.requirements.filter(req => {
                const progress = questProgress?.requirements?.[req.id] || 0;
                return progress >= req.quantity;
              }).length} / {quest.requirements.length} completed
            </Text>
          )}
        </VStack>
      </Box>
    );
  }

  // Expanded view - full details
  return (
    <Box
      border="2px"
      borderColor={isActive ? "blue.500" : isCompleted ? "green.500" : "gray.600"}
      borderRadius="md"
      p={3}
      bg="gray.800"
      _hover={{ borderColor: isActive ? "blue.400" : isCompleted ? "green.400" : "gray.500" }}
      transition="all 0.2s"
      position="relative"
    >
      {/* Collapse Button */}
      <Button
        position="absolute"
        top={2}
        right={2}
        size="xs"
        variant="ghost"
        onClick={() => setIsExpanded(false)}
        color="gray.400"
        _hover={{ color: "white" }}
      >
        ✕
      </Button>

      <VStack align="start" spacing={2}>
        {/* Quest Header */}
        <HStack justify="space-between" w="100%" pr={8}>
          <HStack>
            <Text fontSize="md" fontWeight="bold" color="white">
              {quest.title}
            </Text>
            {getStatusBadge()}
          </HStack>
          {canComplete && (
            <Icon as={FaCrown} color="yellow.400" boxSize={5} />
          )}
        </HStack>

        {/* Quest Description */}
        <Text fontSize="xs" color="gray.400" lineHeight="short">
          {quest.description}
        </Text>

        {/* Requirements - Compact */}
        <VStack align="start" spacing={1} w="100%">
          <Text fontSize="sm" fontWeight="semibold" color="white">
            Requirements:
          </Text>
          <VStack spacing={1} w="100%">
            {quest.requirements.map((req) => (
              <QuestRequirementDisplay
                key={req.id}
                requirement={req}
                questId={quest.id}
                questProgress={questProgress?.requirements || {}}
              />
            ))}
          </VStack>
        </VStack>

        {/* Rewards - Compact */}
        <VStack align="start" spacing={1} w="100%">
          <Text fontSize="sm" fontWeight="semibold" color="white">
            Rewards:
          </Text>
          <SimpleGrid columns={2} spacing={1} w="100%">
            {quest.rewards.map((reward) => (
              <QuestRewardDisplay key={reward.id} reward={reward} />
            ))}
          </SimpleGrid>
        </VStack>

        {/* Action Button */}
        {!isActive && !isCompleted && (
          <Button
            onClick={handleStartQuest}
            colorScheme="blue"
            leftIcon={<Icon as={FaPlay} />}
            w="100%"
            size="sm"
          >
            Start Quest
          </Button>
        )}

        {canComplete && (
          <Button
            onClick={handleCompleteQuest}
            colorScheme="green"
            leftIcon={<Icon as={FaCrown} />}
            w="100%"
            size="sm"
          >
            Complete Quest
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export const QuestModal = ({ isOpen, onClose }: QuestModalProps) => {
  const allQuests = getAllQuests();
  const { character } = useGameStore();

  // Early return if no character to prevent errors
  if (!character) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white" maxH="90vh">
          <ModalHeader borderBottom="1px" borderColor="gray.700">
            <HStack>
              <Icon as={FaCrown} color="yellow.400" />
              <Text>Quest Journal</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <Text textAlign="center" color="gray.400" py={8}>
              No character selected. Please select a character first.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const activeQuests = allQuests.filter(quest => 
    character?.activeQuests?.some(aq => aq.id === quest.id) || false
  );
  
  const availableQuests = allQuests.filter(quest => 
    !(character?.activeQuests?.some(aq => aq.id === quest.id) || false) &&
    !(character?.questProgress?.[quest.id]?.isCompleted || false)
  );
  
  const completedQuests = allQuests.filter(quest => 
    character?.questProgress?.[quest.id]?.isCompleted || false
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg="gray.900" color="white" maxH="90vh">
        <ModalHeader borderBottom="1px" borderColor="gray.700">
          <HStack>
            <Icon as={FaCrown} color="yellow.400" />
            <Text>Quest Journal</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6}>
          <VStack spacing={6} align="stretch">
            {/* Active Quests */}
            {activeQuests.length > 0 && (
              <VStack align="start" spacing={4}>
                <Text fontSize="xl" fontWeight="bold" color="blue.300">
                  Active Quests ({activeQuests.length})
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3} w="100%">
                  {activeQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </SimpleGrid>
              </VStack>
            )}

            {/* Available Quests */}
            {availableQuests.length > 0 && (
              <VStack align="start" spacing={4}>
                <Text fontSize="xl" fontWeight="bold" color="yellow.300">
                  Available Quests ({availableQuests.length})
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3} w="100%">
                  {availableQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </SimpleGrid>
              </VStack>
            )}

            {/* Completed Quests */}
            {completedQuests.length > 0 && (
              <VStack align="start" spacing={4}>
                <Text fontSize="xl" fontWeight="bold" color="green.300">
                  Completed Quests ({completedQuests.length})
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3} w="100%">
                  {completedQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </SimpleGrid>
              </VStack>
            )}

            {/* No Quests Message */}
            {allQuests.length === 0 && (
              <Text textAlign="center" color="gray.400" py={8}>
                No quests available at this time.
              </Text>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 