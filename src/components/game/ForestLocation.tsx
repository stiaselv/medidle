import { keyframes } from '@chakra-ui/react';
import { Box, Button, Flex, Grid, Heading, Text, VStack, useBreakpointValue, Icon, Tooltip, Progress, HStack } from '@chakra-ui/react';
import { GiWoodAxe, GiFishingPole } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { useGameStore, calculateLevel, getNextLevelExperience } from '../../store/gameStore';
import type { SkillAction, Requirement } from '../../types/game';
import { ProgressBar } from './ProgressBar';
import { RequirementStatus } from '../ui/RequirementStatus';
import forestBg from '../../assets/BG/forest.webp';
import { getItemById } from '../../data/items';
import React from 'react';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const shine = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

const getActionIcon = (type: string) => {
  switch (type) {
    case 'woodcutting':
      return GiWoodAxe;
    case 'fishing':
      return GiFishingPole;
    default:
      return GiWoodAxe;
  }
};

const ActionButton: React.FC<{
  action: SkillAction;
  onClick: () => void;
  isDisabled: boolean;
  isActive?: boolean;
}> = ({
  action,
  onClick,
  isDisabled,
  isActive = false
}) => {
  const icon = getActionIcon(action.type);
  const { character, completeAction, stopAction, canPerformAction, currentAction: storeCurrentAction, isActionInProgress } = useGameStore();
  
  const allRequirementsMet = canPerformAction(action);
  
  const requirementsMet = (action.requirements ?? []).map(req => ({
    requirement: req,
    isMet: allRequirementsMet
  }));
  
  const handleClick = () => {
    console.log('Action button clicked:', {
      isActive,
      allRequirementsMet,
      isDisabled,
      action: action.name
    });
    
    if (isActive) {
      console.log('Stopping action:', action.name);
      stopAction();
    } else if (allRequirementsMet) {
      console.log('Starting action:', action.name);
      onClick();
    } else {
      console.log('Cannot start action - requirements not met:', action.name);
    }
  };

  // Button should be disabled if requirements are not met AND it's not currently active
  const buttonDisabled = !allRequirementsMet && !isActive;

  // Type guard for possibleLoot
  function hasPossibleLoot(a: any): a is SkillAction & { possibleLoot: { id: string; chance: number }[] } {
    return Array.isArray(a.possibleLoot);
  }

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
        <motion.div
          style={{
            width: '100%',
            position: 'relative',
          }}
          whileHover={!isActive && allRequirementsMet ? { scale: 1.02 } : undefined}
          whileTap={!isActive && allRequirementsMet ? { scale: 0.98 } : undefined}
          animate={isActive ? {
            boxShadow: [
              '0 0 0 rgba(66, 153, 225, 0)',
              '0 0 20px rgba(66, 153, 225, 0.6)',
              '0 0 0 rgba(66, 153, 225, 0)',
            ]
          } : undefined}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
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
            isDisabled={buttonDisabled}
            _hover={{ 
              bg: !allRequirementsMet ? 'blackAlpha.400' : isActive ? 'red.900' : 'whiteAlpha.100',
            }}
            transition="all 0.2s"
            bg={!allRequirementsMet ? 'blackAlpha.300' : isActive ? 'blue.800' : 'blackAlpha.400'}
            borderColor={!allRequirementsMet ? 'red.500' : isActive ? 'blue.400' : 'green.500'}
            borderWidth={isActive ? '2px' : '1px'}
            _disabled={{
              opacity: 0.7,
              cursor: 'not-allowed',
              _hover: { bg: 'blackAlpha.300' }
            }}
            position="relative"
            overflow="hidden"
            boxShadow={isActive ? 'lg' : 'md'}
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '60%',
              bgGradient: 'linear(to-b, whiteAlpha.100, transparent)',
              pointerEvents: 'none',
            }}
            width="100%"
            role="button"
            aria-label={`${action.name} - Level ${action.levelRequired} ${action.skill} required`}
            aria-pressed={isActive}
            aria-disabled={buttonDisabled}
          >
            <Icon
              as={icon} 
              boxSize={8} 
              color={!allRequirementsMet ? "red.300" : isActive ? "blue.300" : "green.300"}
              mb={2}
              sx={{
                animation: isActive ? `${bounce} 1s infinite` : 'none',
                filter: isActive ? 'drop-shadow(0 0 8px currentColor)' : 'none',
              }}
              aria-hidden="true"
            />
            
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
                <Icon as={icon} boxSize={3} />
                {(action.baseTime / 1000).toFixed(1)}s
              </Text>
            </HStack>
            
            {/* Possible Loot Display */}
            {hasPossibleLoot(action) && action.possibleLoot.length > 0 ? (
              <Box mt={3} w="100%">
                <Text fontSize="xs" color="gray.400" fontWeight="bold" mb={1}>Possible Loot:</Text>
                <HStack spacing={2} flexWrap="wrap">
                  {action.possibleLoot.map(loot => {
                    const item = getItemById(loot.id);
                    return (
                      <HStack key={loot.id} spacing={1} align="center">
                        {item && (
                          <img
                            src={item.icon}
                            alt={item.name}
                            style={{ width: 20, height: 20, objectFit: 'contain', borderRadius: 3 }}
                            onError={e => { (e.target as HTMLImageElement).src = '/assets/items/placeholder.png'; }}
                          />
                        )}
                        <Text fontSize="xs" color="gray.300">{item ? item.name : loot.id} ({loot.chance}%)</Text>
                      </HStack>
                    );
                  })}
                </HStack>
              </Box>
            ) : null}
            
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
                progress={storeCurrentAction && storeCurrentAction.id === action.id ? (useGameStore.getState().actionProgress) : 0}
                isActive={isActive}
                aria-label={`Action progress for ${action.name}`}
              />
            )}
          </Button>
        </motion.div>
      </Box>
    </Tooltip>
  );
};

export const ActionSection = ({ 
  title, 
  actions, 
  onActionClick, 
  canPerformAction,
  currentAction
}: { 
  title: string;
  actions: SkillAction[];
  onActionClick: (action: SkillAction) => void;
  canPerformAction: (action: SkillAction) => boolean;
  currentAction: SkillAction | null;
}) => {
  const { character } = useGameStore();
  const skillType = actions[0]?.skill || '';
  
  // Calculate experience progress for the skill
  const currentSkillExp = character?.skills[skillType]?.experience || 0;
  const currentLevel = calculateLevel(currentSkillExp);
  const nextLevelExp = getNextLevelExperience(currentLevel);
  const prevLevelExp = getNextLevelExperience(currentLevel - 1);
  const expProgress = ((currentSkillExp - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100;

  // Choose accent color and gradient based on skill type
  const accent = skillType === 'woodcutting' ? 'green' : skillType === 'fishing' ? 'blue' : 'gray';
  const cardGradient =
    accent === 'green'
      ? 'linear(to-br, green.900 0%, gray.900 100%)'
      : accent === 'blue'
      ? 'linear(to-br, blue.900 0%, gray.900 100%)'
      : 'linear(to-br, gray.800 0%, gray.900 100%)';
  const borderColor = accent === 'green' ? 'green.600' : accent === 'blue' ? 'blue.600' : 'gray.600';

  return (
    <Box
      bgGradient={cardGradient}
      borderRadius="2xl"
      borderWidth={2}
      borderColor={borderColor}
      boxShadow="xl"
      p={{ base: 3, md: 4 }}
      transition="box-shadow 0.2s, background 0.2s"
      backdropFilter="blur(6px)"
      maxW="420px"
      mx="auto"
      w="100%"
    >
      <VStack spacing={4} align="stretch" width="100%">
        <HStack spacing={4} align="center" bg="whiteAlpha.100" p={3} borderRadius="lg">
          <Heading size="md" color="white" display="flex" alignItems="center" gap={2}>
            <Icon as={getActionIcon(actions[0]?.type || '')} />
            {title}
          </Heading>
          <Box flex={1} maxW="300px">
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
        </HStack>
        <Grid
          templateColumns="1fr"
          maxH="600px"
          overflowY="auto"
          gap={2}
          sx={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: accent === 'green' ? 'green.600' : accent === 'blue' ? 'blue.600' : 'gray.500',
              borderRadius: '24px',
            },
          }}
        >
          {actions.map((action) => (
            <ActionButton
              key={action.id}
              action={action}
              onClick={() => onActionClick(action)}
              isDisabled={!canPerformAction(action)}
              isActive={currentAction?.id === action.id}
            />
          ))}
        </Grid>
      </VStack>
    </Box>
  );
};

export const ForestLocation = () => {
  const { currentLocation, character, startAction, currentAction, canPerformAction: storeCanPerformAction } = useGameStore();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!currentLocation || !character) return null;

  const woodcuttingActions = currentLocation.actions
    ? (currentLocation.actions.filter(action => action.type === 'woodcutting') as SkillAction[])
    : [];

  const fishingActions = currentLocation.actions
    ? (currentLocation.actions.filter(action => action.type === 'fishing') as SkillAction[])
    : [];

  const handleActionStart = (action: SkillAction) => {
    console.log('Starting action in ForestLocation:', action.name);
    startAction(action);
  };

  // (Declarations moved below with guards)

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
      {/* Forest background image */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${forestBg})`}
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
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={{ base: 6, md: 12 }}
            w="100%"
            maxW="1200px"
            mx="auto"
          >
            {/* Woodcutting Section */}
            {woodcuttingActions.length > 0 && (
              <Box maxW="400px" mx="auto" w="100%">
                <ActionSection
                  title="Woodcutting"
                  actions={woodcuttingActions}
                  onActionClick={handleActionStart}
                  canPerformAction={storeCanPerformAction}
                  currentAction={getSkillCurrentAction('woodcutting')}
                />
              </Box>
            )}

            {/* Fishing Section */}
            {fishingActions.length > 0 && (
              <Box maxW="400px" mx="auto" w="100%">
                <ActionSection
                  title="Fishing"
                  actions={fishingActions}
                  onActionClick={handleActionStart}
                  canPerformAction={storeCanPerformAction}
                  currentAction={getSkillCurrentAction('fishing')}
                />
              </Box>
            )}
          </Grid>
        </VStack>
      </Flex>
    </Box>
  );
}; 