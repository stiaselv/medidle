import React, { useState } from 'react';
import {
  Box,
  Text,
  Grid,
  VStack,
  Heading,
  Icon,
  useBreakpointValue,
  Flex,
  Button,
  keyframes,
  Progress,
  Tooltip,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { GiAnvil, GiHammerNails } from 'react-icons/gi';
import { useGameStore, calculateLevel, getNextLevelExperience } from '../../store/gameStore';
import type { SkillAction } from '../../types/game';
import { motion, useReducedMotion } from 'framer-motion';
import { ProgressBar } from './ProgressBar';
import { ItemIcon } from '../ui/ItemIcon';
import { getItemById } from '../../data/items';
import forgeBg from '../../assets/BG/forge.webp';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const shine = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const ActionButton = ({ 
  action, 
  onClick, 
  isDisabled,
  isActive = false,
}: { 
  action: SkillAction; 
  onClick: () => void;
  isDisabled: boolean;
  isActive?: boolean;
}) => {
  const { character, canPerformAction, stopAction } = useGameStore();
  const shouldReduceMotion = useReducedMotion();
  const currentAction = useGameStore(state => state.currentAction);
  
  const allRequirementsMet = canPerformAction(action);
  
  const handleClick = () => {
    if (isActive) {
      stopAction();
    } else if (allRequirementsMet) {
      onClick();
    }
  };

  const buttonDisabled = !allRequirementsMet && !isActive;

  return (
    <Button
      width="100%"
      height="auto"
      py={6}
      onClick={handleClick}
      isDisabled={buttonDisabled}
      bg={isActive ? 'rgba(255,255,255,0.18)' : 'rgba(40,40,40,0.92)'}
      boxShadow={isActive ? '0 0 0 3px #fbbf24, 0 4px 24px 0 rgba(0,0,0,0.25)' : '0 2px 12px 0 rgba(0,0,0,0.18)'}
      borderWidth={2}
      borderColor={isActive ? '#fbbf24' : 'rgba(255,255,255,0.12)'}
      transition="box-shadow 0.2s, background 0.2s, border-color 0.2s"
      position="relative"
      overflow="hidden"
      _hover={{
        bg: isActive ? 'rgba(255,255,255,0.22)' : 'rgba(60,60,60,0.98)',
        boxShadow: isActive
          ? '0 0 0 4px #fbbf24, 0 8px 32px 0 rgba(0,0,0,0.28)'
          : '0 4px 24px 0 rgba(0,0,0,0.28)',
        borderColor: isActive ? '#fbbf24' : 'rgba(255,255,255,0.22)'
      }}
      _active={{
        bg: 'rgba(255,255,255,0.24)',
      }}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60%',
        bgGradient: 'linear(to-b, whiteAlpha.100, transparent)',
        pointerEvents: 'none'
      }}
    >
      <VStack spacing={2} align="center" width="100%">
        {action.itemReward && action.itemReward.id ? (
          <Box
            sx={{
              animation: isActive && !shouldReduceMotion ? `${bounce} 1s infinite` : 'none',
              filter: isActive ? 'drop-shadow(0 0 8px currentColor)' : 'none',
            }}
          >
            <ItemIcon
              item={action.itemReward}
              size={48}
              showQuantity={false}
              disableHover={true}
            />
          </Box>
        ) : (
          <Icon
            as={GiHammerNails}
            boxSize={8} 
            color={!allRequirementsMet ? "red.300" : isActive ? "blue.300" : "green.300"}
            sx={{
              animation: isActive && !shouldReduceMotion ? `${bounce} 1s infinite` : 'none',
              filter: isActive ? 'drop-shadow(0 0 8px currentColor)' : 'none',
            }}
          />
        )}
        
        <Heading
          size="sm" 
          color="white"
          textShadow="0 2px 4px rgba(0,0,0,0.4)"
        >
          {action.name}
        </Heading>
        
        <Text 
          fontSize="sm" 
          color={!allRequirementsMet ? "red.300" : isActive ? "blue.300" : "green.300"}
          fontWeight="medium"
          sx={isActive ? {
            background: 'linear-gradient(90deg, #63B3ED, #4299E1, #63B3ED)',
            backgroundSize: '400% auto',
            animation: `${shine} 3s linear infinite`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          } : {}}
        >
          Level {action.levelRequired} {action.skill}
        </Text>
        
        {/* Required Items */}
        {action.requirements?.filter(req => req.type === 'item').length > 0 && (
          <VStack spacing={2} w="100%">
            <Text fontSize="sm" color="gray.300" fontWeight="semibold">Required Items:</Text>
            {action.requirements?.filter(req => req.type === 'item').map((req, index) => {
              const itemData = getItemById(req.itemId || '');
              const bankItem = character?.bank.find(item => item.id === req.itemId);
              const bankQuantity = bankItem?.quantity || 0;
              const hasEnough = bankQuantity >= (req.quantity || 0);
              
              return (
                <VStack key={index} spacing={1} w="100%" align="center">
                  <HStack spacing={2}>
                    <Text fontSize="sm" color="gray.400">Need:</Text>
                    <ItemIcon item={req.itemId || ''} size={20} />
                    <Text fontSize="sm" color="gray.300">{req.quantity}x</Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Text fontSize="sm" color="gray.400">Have:</Text>
                    <ItemIcon item={req.itemId || ''} size={20} />
                    <Text fontSize="sm" color={hasEnough ? "green.300" : "red.300"}>{bankQuantity}x</Text>
                  </HStack>
                </VStack>
              );
            })}
          </VStack>
        )}
        
        <HStack spacing={2} mt={1}>
          <Text 
            fontSize="xs" 
            color="gray.300"
            fontWeight="medium"
            px={2}
            py={1}
            bg="whiteAlpha.100"
            borderRadius="md"
          >
            +{action.experience}xp
          </Text>
          <Text 
            fontSize="xs" 
            color="gray.300"
            fontWeight="medium"
            px={2}
            py={1}
            bg="whiteAlpha.100"
            borderRadius="md"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Icon as={GiHammerNails} boxSize={3} />
            {(action.baseTime / 1000).toFixed(1)}s
          </Text>
        </HStack>
        
        {!allRequirementsMet && (
          <Text 
            fontSize="xs" 
            color="red.300"
            fontWeight="bold"
            mt={1}
            role="alert"
          >
            Missing requirements
          </Text>
        )}

        {isActive && (
          <Text 
            fontSize="xs" 
            color={isActive ? "red.300" : "blue.300"}
            fontWeight="bold"
            mt={1}
            sx={{
              animation: `${shine} 3s linear infinite`,
              background: 'linear-gradient(90deg, #FF6B6B, #FF8787, #FF6B6B)',
              backgroundSize: '400% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            role="status"
          >
            {isActive ? "Click to stop" : "In progress..."}
          </Text>
        )}

        {/* Progress Bar */}
        {isActive && (
          <ProgressBar
            progress={currentAction && currentAction.id === action.id ? (useGameStore.getState().actionProgress) : 0}
            isActive={isActive}
            aria-label={`Action progress for ${action.name}`}
          />
        )}
      </VStack>
    </Button>
  );
};

// Add a type for smithing category actions with subActions
interface SmithingCategoryAction extends SkillAction {
  type: 'smithing_category';
  subActions: SkillAction[];
}

const ActionSection = ({ 
  title, 
  actions, 
  onActionClick, 
  canPerformAction,
  currentAction,
}: { 
  title: string;
  actions: SkillAction[];
  onActionClick: (action: SkillAction) => void;
  canPerformAction: (action: SkillAction) => boolean;
  currentAction: SkillAction | null;
}) => {
  const { character } = useGameStore();
  const skillType = actions[0]?.skill || '';
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Calculate experience progress for the skill
  const currentSkillExp = character?.skills[skillType]?.experience || 0;
  const currentLevel = calculateLevel(currentSkillExp);
  const nextLevelExp = getNextLevelExperience(currentLevel);
  const prevLevelExp = getNextLevelExperience(currentLevel - 1);
  const expProgress = ((currentSkillExp - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100;

  // Group actions by metal type
  const actionsByMetal = actions.reduce((acc, action) => {
    const metalType = action.type === 'smithing' ? action.name.split(' ')[0].toLowerCase() : 'other';
    if (!acc[metalType]) {
      acc[metalType] = [];
    }
    acc[metalType].push(action);
    return acc;
  }, {} as Record<string, SkillAction[]>);

  // Accent and card style
  const accent = 'gray';
  const cardGradient = 'linear(to-br, rgba(24,24,24,0.85) 0%, rgba(40,40,40,0.82) 100%)';
  const borderColor = 'rgba(120,120,120,0.32)';

  return (
    <Box
      bgGradient={cardGradient}
      borderRadius="2xl"
      borderWidth={2}
      borderColor={borderColor}
      boxShadow="xl"
      p={{ base: 3, md: 4 }}
      transition="box-shadow 0.2s, background 0.2s"
      backdropFilter="blur(8px)"
      maxW="900px"
      mx="auto"
      w="100%"
      opacity={0.92}
    >
      <VStack spacing={4} align="stretch" width="100%">
        <HStack spacing={4} align="center" bg="whiteAlpha.100" p={3} borderRadius="lg">
          <Flex width="100%" justify="center" align="center" gap={4}>
            <Heading size="md" color="white" display="flex" alignItems="center" gap={2}>
              <img
                src={`/assets/ItemThumbnail/skillicons/${skillType}.png`}
                alt={`${skillType} icon`}
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
              {title}
            </Heading>
            <Box maxW="600px" minW="500px">
              <Tooltip
                label={
                  <VStack align="start" spacing={1} p={2}>
                    <Text fontWeight="bold" color="white" mb={1}>Experience Progress</Text>
                    <Text>Current XP: {currentSkillExp.toLocaleString()}</Text>
                    <Text>Next Level: {nextLevelExp.toLocaleString()}</Text>
                    <Text>Remaining: {(nextLevelExp - currentSkillExp).toLocaleString()}</Text>
                  </VStack>
                }
                placement="top"
                hasArrow
                bg="gray.800"
                borderRadius="md"
              >
                <Box width="100%" position="relative" _hover={{ transform: 'scale(1.02)' }} transition="all 0.2s">
                  <Progress
                    value={expProgress}
                    size="sm"
                    colorScheme={accent}
                    borderRadius="full"
                    background="whiteAlpha.200"
                    hasStripe
                    isAnimated
                    sx={{
                      '& > div:first-of-type': {
                        transitionProperty: 'width',
                        transitionDuration: '0.3s',
                      }
                    }}
                  />
                  <Text 
                    fontSize="xs" 
                    color="gray.300" 
                    mt={1} 
                    textAlign="center"
                    fontWeight="medium"
                    textShadow="0 1px 2px rgba(0,0,0,0.3)"
                  >
                    Level {currentLevel} • {expProgress.toFixed(1)}% to {currentLevel + 1}
                  </Text>
                </Box>
              </Tooltip>
            </Box>
          </Flex>
        </HStack>
        <Tabs variant="soft-rounded" colorScheme="gray" width="100%">
          <TabList 
            overflowX="auto" 
            overflowY="hidden" 
            py={2}
            display="flex"
            justifyContent="center"
            sx={{
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'whiteAlpha.100',
                borderRadius: 'full',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'gray.500',
                borderRadius: 'full',
              },
            }}
          >
            {Object.keys(actionsByMetal).map((metal) => (
              <Tab
                key={metal}
                _selected={{ 
                  bg: 'gray.700', 
                  color: 'white',
                  boxShadow: '0 0 10px rgba(100, 116, 139, 0.5)'
                }}
                _hover={{
                  bg: 'whiteAlpha.200'
                }}
                whiteSpace="nowrap"
                minW="auto"
                px={6}
                py={2}
                fontWeight="semibold"
                textTransform="capitalize"
              >
                {metal}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {Object.entries(actionsByMetal).map(([metal, metalActions]) => (
              <TabPanel key={metal} p={4}>
                <Grid
                  templateColumns={{
                    base: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                    xl: 'repeat(5, 1fr)'
                  }}
                  gap={4}
                  maxH="calc(100vh - 500px)"
                  overflowY="auto"
                  sx={{
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'whiteAlpha.100',
                      borderRadius: 'full',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'gray.500',
                      borderRadius: 'full',
                    },
                  }}
                >
                  {metalActions.map((action) => (
                    <ActionButton
                      key={action.id}
                      action={action}
                      onClick={() => onActionClick(action)}
                      isDisabled={!canPerformAction(action)}
                      isActive={currentAction?.id === action.id}
                    />
                  ))}
                </Grid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export const ForgeLocation = () => {
  const { currentLocation, startAction, currentAction, canPerformAction: storeCanPerformAction } = useGameStore();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!currentLocation) return null;

  const handleActionStart = (action: SkillAction) => {
    startAction(action);
  };

  // Filter and type smithing actions as SkillAction[]
  const smithingActions = currentLocation.actions
    .filter((action): action is SkillAction | SmithingCategoryAction =>
      action.type === 'smithing' || (action.type === 'smithing_category' && 'subActions' in action)
    )
    .flatMap(action =>
      action.type === 'smithing_category' && 'subActions' in action && Array.isArray(action.subActions)
        ? action.subActions
        : [action as SkillAction]
    );

  // Helper to safely cast currentAction to SkillAction | null
  const getSkillCurrentAction = (type: string): SkillAction | null => {
    if (currentAction && (currentAction.type === type)) {
      return currentAction as SkillAction;
    }
    return null;
  };

  return (
    <Box
      position="relative"
      width="100%"
      height="100%"
      overflow="auto"
      sx={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'gray.500',
          borderRadius: '24px',
        },
      }}
    >
      {/* Forge background image */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${forgeBg})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        zIndex={0}
        _after={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'rgba(0,0,0,0.45)',
          zIndex: 1
        }}
      />
      {/* Content */}
      <Flex
        position="relative"
        direction="column"
        height="100%"
        zIndex={2}
        p={{ base: 4, md: 8 }}
        w="100%"
      >
        <VStack 
          spacing={8} 
          align="stretch"
          w="100%"
          maxW="100%"
        >
          {/* Location Header */}
          <Box
            bg="blackAlpha.700"
            p={6}
            borderRadius="xl"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.200"
            boxShadow="dark-lg"
            maxW="600px"
            mx="auto"
            textAlign="center"
          >
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="white"
              textShadow="0 2px 4px rgba(0,0,0,0.4)"
              mb={3}
            >
              {currentLocation.name}
            </Text>
            <Text
              fontSize="md"
              color="gray.300"
              maxW="500px"
              mx="auto"
              lineHeight="1.6"
            >
              {currentLocation.description}
            </Text>
          </Box>
          {/* Actions Grid */}
          <Grid
            templateColumns="1fr"
            gap={{ base: 6, md: 12 }}
            w="100%"
            maxW="1200px"
            mx="auto"
          >
            {/* Smithing Section */}
            <Box w="100%">
              <ActionSection
                title="Smithing"
                actions={smithingActions}
                onActionClick={handleActionStart}
                canPerformAction={storeCanPerformAction}
                currentAction={getSkillCurrentAction('smithing')}
              />
            </Box>
          </Grid>
        </VStack>
      </Flex>
    </Box>
  );
}; 