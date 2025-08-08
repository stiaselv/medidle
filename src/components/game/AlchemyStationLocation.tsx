import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Grid,
  useBreakpointValue,
  Progress,
  Icon,
  Tooltip,
  Badge,
  Flex,
  Image,
  useColorModeValue,
  Divider,
  SimpleGrid
} from '@chakra-ui/react';
import { FaFlask, FaMagic, FaLeaf, FaGem } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import type { SkillAction } from '../../types/game';
import { getItemById } from '../../data/items';
import { RequirementStatus } from '../ui/RequirementStatus';
import { ProgressBar } from './ProgressBar';
import { ItemIcon } from '../ui/ItemIcon';

const MotionBox = motion(Box);

interface ActionCardProps {
  action: SkillAction;
  onClick: () => void;
  isActive: boolean;
  canPerform: boolean;
  currentAction: SkillAction | null;
}

const ActionCard: React.FC<ActionCardProps> = ({ 
  action, 
  onClick, 
  isActive, 
  canPerform, 
  currentAction 
}) => {
  const { character } = useGameStore();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const currentSkillExp = character?.skills[action.skill]?.experience || 0;
  const currentLevel = Math.floor(currentSkillExp / 100) + 1;
  const nextLevelExp = currentLevel * 100;
  const prevLevelExp = (currentLevel - 1) * 100;
  const expProgress = ((currentSkillExp - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100;

  const getActionIcon = () => {
    if (action.name.toLowerCase().includes('super')) return FaGem;
    if (action.name.toLowerCase().includes('potion')) return FaFlask;
    return FaMagic;
  };

  const getActionColor = () => {
    if (action.name.toLowerCase().includes('super')) return 'purple';
    if (action.name.toLowerCase().includes('attack')) return 'red';
    if (action.name.toLowerCase().includes('strength')) return 'orange';
    if (action.name.toLowerCase().includes('defence')) return 'blue';
    if (action.name.toLowerCase().includes('ranging')) return 'green';
    if (action.name.toLowerCase().includes('magic')) return 'cyan';
    if (action.name.toLowerCase().includes('prayer')) return 'yellow';
    return 'gray';
  };

  const actionColor = getActionColor();
  const cardGradient = `linear(to-br, ${actionColor}.900 0%, gray.900 100%)`;
  const borderColor = `${actionColor}.600`;

  return (
    <MotionBox
      bgGradient={cardGradient}
      p={4}
      borderRadius="xl"
      borderWidth={2}
      borderColor={isActive ? borderColor : 'rgba(255,255,255,0.1)'}
      boxShadow={isActive ? `0 0 20px ${actionColor}.500` : '0 4px 12px rgba(0,0,0,0.3)'}
      cursor={canPerform ? 'pointer' : 'not-allowed'}
      opacity={canPerform ? 1 : 0.6}
      transitionDuration="0.3s"
      transitionProperty="all"
      _hover={canPerform ? {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${actionColor}.400`,
        borderColor: borderColor
      } : {}}
      onClick={canPerform ? onClick : undefined}
      position="relative"
      overflow="hidden"
    >
      {/* Background glow effect */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={`radial-gradient(circle at 50% 50%, ${actionColor}.400 0%, transparent 70%)`}
        opacity={isActive ? 0.3 : 0}
        transition="opacity 0.3s ease"
      />

      <VStack spacing={3} position="relative" zIndex={1}>
        {/* Header */}
        <HStack spacing={3} w="100%" justify="space-between">
          <HStack spacing={2}>
            <Icon as={getActionIcon()} color={`${actionColor}.300`} boxSize={5} />
            <Text fontSize="lg" fontWeight="bold" color="white">
              {action.name}
            </Text>
          </HStack>
          <Badge colorScheme={actionColor} variant="solid">
            Lvl {action.levelRequired}
          </Badge>
        </HStack>

        {/* Progress bar for active action */}
        {isActive && currentAction && (
          <Box w="100%">
            <ProgressBar 
              progress={currentAction ? 50 : 0} // You'll need to get actual progress from store
              isActive={isActive}
            />
            <Text fontSize="sm" color="gray.300" textAlign="center" mt={1}>
              Brewing {action.name}...
            </Text>
          </Box>
        )}

        {/* Requirements */}
        <VStack spacing={2} w="100%" align="start">
          <Text fontSize="sm" color="gray.300" fontWeight="semibold">
            Requirements:
          </Text>
          {action.requirements?.map((req, index) => {
            const isMet = req.type === 'level' 
              ? (character?.skills[req.skill || 'herblore']?.level || 0) >= (req.level || 0)
              : req.type === 'item'
              ? (character?.bank.find(item => item.id === req.itemId)?.quantity || 0) >= (req.quantity || 0)
              : true; // Default to true for equipment requirements for now
            return (
              <RequirementStatus
                key={index}
                requirement={req}
                isMet={isMet}
              />
            );
          })}
        </VStack>

        {/* Rewards */}
        <HStack spacing={2} w="100%" justify="space-between">
          <HStack spacing={2}>
            <Icon as={FaFlask} color="green.300" boxSize={4} />
            <Text fontSize="sm" color="green.300">
              {action.itemReward.quantity}x {action.itemReward.name}
            </Text>
          </HStack>
          <Text fontSize="sm" color="blue.300" fontWeight="semibold">
            +{action.experience} XP
          </Text>
        </HStack>

        {/* Skill progress */}
        <Box w="100%">
          <HStack justify="space-between" mb={1}>
            <Text fontSize="xs" color="gray.400">
              {action.skill.charAt(0).toUpperCase() + action.skill.slice(1)} Lvl {currentLevel}
            </Text>
            <Text fontSize="xs" color="gray.400">
              {currentSkillExp}/{nextLevelExp} XP
            </Text>
          </HStack>
          <Progress
            value={expProgress}
            size="sm"
            colorScheme={actionColor}
            borderRadius="full"
            bg="rgba(0,0,0,0.3)"
          />
        </Box>
      </VStack>
    </MotionBox>
  );
};

const HerbloreActionButton: React.FC<{
  action: SkillAction;
  onClick: () => void;
  isDisabled: boolean;
  isActive?: boolean;
  canPerform: boolean;
  currentAction: SkillAction | null;
}> = ({ action, onClick, isDisabled, isActive = false, canPerform, currentAction }) => {
  const icon = FaFlask;
  const { character } = useGameStore();

  // Check requirements
  const allRequirementsMet = canPerform;
  const requirementsMet = (action.requirements ?? []).map(req => ({
    requirement: req,
    isMet: req.type === 'level'
      ? (character?.skills[req.skill || 'herblore']?.level || 0) >= (req.level || 0)
      : req.type === 'item'
      ? (character?.bank.find(item => item.id === req.itemId)?.quantity || 0) >= (req.quantity || 0)
      : true
  }));

  const handleClick = () => {
    if (isActive) {
      // stopAction(); // If you want to allow stopping
    } else if (allRequirementsMet) {
      onClick();
    }
  };

  return (
    <Tooltip
      label={
        <VStack align="start" spacing={1} p={2}>
          {requirementsMet.map(({ requirement, isMet }, index) => (
            <RequirementStatus key={index} requirement={requirement} isMet={isMet} />
          ))}
        </VStack>
      }
      placement="top"
      hasArrow
      isDisabled={isActive}
    >
      <Box
        position="relative"
        width="100%"
        transition="all 0.2s"
        transform={isActive ? 'scale(1.02)' : 'scale(1)'}
      >
        <Button
          variant="outline"
          colorScheme={!allRequirementsMet ? "red" : isActive ? "blue" : "green"}
          height="auto"
          p={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
          onClick={handleClick}
          isDisabled={!allRequirementsMet && !isActive}
          _hover={{
            bg: !allRequirementsMet ? 'blackAlpha.400' : isActive ? 'red.900' : 'whiteAlpha.100',
          }}
          w="100%"
        >
          <Icon as={icon} boxSize={8} color={!allRequirementsMet ? "red.300" : isActive ? "blue.300" : "green.300"} mb={2} />
          <Text fontWeight="bold" color="white" fontSize="lg">{action.name}</Text>
          
          {/* Required Items */}
          <VStack spacing={2} w="100%">
            <Text fontSize="sm" color="gray.300" fontWeight="semibold">Required Items:</Text>
            {action.requirements?.filter(req => req.type === 'item').map((req, index) => {
              const itemData = getItemById(req.itemId || '');
              const bankItem = character?.bank.find(item => item.id === req.itemId);
              const bankQuantity = bankItem?.quantity || 0;
              const hasEnough = bankQuantity >= (req.quantity || 0);
              
              return (
                <HStack key={index} spacing={2} w="100%" justify="space-between">
                  <HStack spacing={2}>
                    <Text fontSize="sm" color="gray.400">Need:</Text>
                    <ItemIcon item={req.itemId || ''} size={24} />
                    <Text fontSize="sm" color="gray.300">{req.quantity}x {itemData?.name || req.itemId}</Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Text fontSize="sm" color="gray.400">Have:</Text>
                    <ItemIcon item={req.itemId || ''} size={24} />
                    <Text fontSize="sm" color={hasEnough ? "green.300" : "red.300"}>{bankQuantity}x</Text>
                  </HStack>
                </HStack>
              );
            })}
          </VStack>
          
          <HStack spacing={2}>
            <Icon as={FaFlask} color="green.300" boxSize={4} />
            <Text fontSize="sm" color="green.300">
              {action.itemReward.quantity}x {action.itemReward.name}
            </Text>
            <Text fontSize="sm" color="blue.300" fontWeight="semibold">
              +{action.experience} XP
            </Text>
          </HStack>
          {isActive && currentAction && (
            <Box w="100%">
              <ProgressBar progress={50} isActive={isActive} />
              <Text fontSize="sm" color="gray.300" textAlign="center" mt={1}>
                Brewing {action.name}...
              </Text>
            </Box>
          )}
        </Button>
      </Box>
    </Tooltip>
  );
};

export const AlchemyStationLocation: React.FC = () => {
  const { currentLocation, character, startAction, currentAction, canPerformAction } = useGameStore();
  if (!currentLocation || !character) return null;

  const herbloreActions = currentLocation.actions.filter(
    (action): action is SkillAction => action.type === 'herblore'
  );

  const handleActionStart = (action: SkillAction) => {
    startAction(action);
  };

  // Calculate herblore level and progress
  const herbloreSkill = character.skills.herblore || { level: 1, experience: 0 };
  const currentLevel = herbloreSkill.level;
  const currentExp = herbloreSkill.experience;
  const nextLevelExp = (currentLevel + 1) * 100; // Assuming 100 XP per level
  const prevLevelExp = currentLevel * 100;
  const expProgress = Math.max(0, Math.min(100, ((currentExp - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100));

  return (
    <Box
      w="100%"
      minH="100vh"
      bgImage="url('/assets/BG/alchemy_station.webp?v=2')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      p={{ base: 2, md: 8 }}
      position="relative"
      overflow="hidden"
    >
      <Box position="relative" zIndex={1}>
        <VStack spacing={6} mb={8}>
          <HStack spacing={4}>
            <Icon as={FaFlask} color="purple.300" boxSize={8} />
            <Text fontSize="4xl" fontWeight="bold" color="white" textAlign="center">
              Alchemy Station
            </Text>
            <Icon as={FaMagic} color="purple.300" boxSize={8} />
          </HStack>
          <Text fontSize="lg" color="gray.300" textAlign="center" maxW="600px">
            A mystical laboratory where you can brew powerful potions using herbs and secondary ingredients.
          </Text>
        </VStack>
        
        <Flex justify="center" align="center" w="100%">
          <Box maxW="420px" w="100%" bg="rgba(0,0,0,0.7)" borderRadius="2xl" p={4} boxShadow="xl">
            {/* Herblore Level and Progress */}
            <VStack spacing={3} mb={4} p={3} bg="rgba(255,255,255,0.1)" borderRadius="lg">
              <HStack spacing={3} w="100%" justify="space-between">
                <HStack spacing={2}>
                  <img
                    src="/assets/ItemThumbnail/skillicons/herblore.png"
                    alt="Herblore icon"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      filter: 'brightness(1.1)'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/assets/items/placeholder.png';
                    }}
                  />
                  <Text fontWeight="bold" color="white" fontSize="lg">
                    Herblore Level {currentLevel}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.400">{currentExp.toLocaleString()} XP</Text>
              </HStack>
              <Box w="100%">
                <Progress
                  value={expProgress}
                  size="sm"
                  colorScheme="purple"
                  borderRadius="full"
                  background="whiteAlpha.200"
                  hasStripe
                  isAnimated
                />
                <Text fontSize="xs" color="gray.300" mt={1} textAlign="center">
                  {expProgress.toFixed(1)}% to Level {currentLevel + 1}
                </Text>
              </Box>
            </VStack>
            
            {/* Scrollable Action List */}
            <VStack spacing={4} align="stretch" width="100%" maxH="500px" overflowY="auto" sx={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'purple.600',
                borderRadius: '24px',
              },
            }}>
              {herbloreActions.map((action) => (
                <HerbloreActionButton
                  key={action.id}
                  action={action}
                  onClick={() => handleActionStart(action)}
                  isDisabled={!canPerformAction(action)}
                  isActive={currentAction?.id === action.id}
                  canPerform={canPerformAction(action)}
                  currentAction={currentAction?.id === action.id ? (currentAction as SkillAction) : null}
                />
              ))}
            </VStack>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}; 