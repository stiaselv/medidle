import { keyframes } from '@chakra-ui/react';
import { Box, Button, Flex, Grid, Heading, Text, VStack, useBreakpointValue, Icon, Tooltip, Progress, HStack } from '@chakra-ui/react';
import { GiCampfire, GiCampCookingPot } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { useGameStore, calculateLevel, getNextLevelExperience } from '../../store/gameStore';
import type { SkillAction } from '../../types/game';
import { ProgressBar } from './ProgressBar';
import { RequirementStatus } from '../ui/RequirementStatus';
import campBg from '../../assets/BG/camp.webp';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const shine = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

const campfireAnimation = keyframes`
  0% { transform: translate(-50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%) scale(1.1); opacity: 0.8; }
  100% { transform: translate(-50%) scale(1); opacity: 1; }
`;

const getActionIcon = (type: string) => {
  switch (type) {
    case 'cooking':
      return GiCampCookingPot;
    case 'firemaking':
      return GiCampfire;
    default:
      return GiCampCookingPot;
  }
};

const ActionButton = ({ 
  action, 
  onClick, 
  isDisabled,
  isActive = false 
}: { 
  action: SkillAction; 
  onClick: () => void;
  isDisabled: boolean;
  isActive?: boolean;
}) => {
  const icon = getActionIcon(action.type);
  const { completeAction, stopAction, canPerformAction } = useGameStore();
  const currentAction = useGameStore(state => state.currentAction);
  
  const allRequirementsMet = canPerformAction(action);
  
  const requirementsMet = (action.requirements ?? []).map(req => ({
    requirement: req,
    isMet: allRequirementsMet
  }));
  
  const handleClick = () => {
    if (isActive) {
      stopAction();
    } else if (allRequirementsMet) {
      onClick();
    }
  };

  const handleActionComplete = () => {
    completeAction();
  };

  const buttonDisabled = !allRequirementsMet && !isActive;

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
          </Button>
        </motion.div>
      </Box>
    </Tooltip>
  );
};

const ActionSection = ({ 
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
  const accent = skillType === 'firemaking' ? 'orange' : skillType === 'cooking' ? 'yellow' : 'gray';
  const cardGradient =
    accent === 'orange'
      ? 'linear(to-br, orange.900 0%, gray.900 100%)'
      : accent === 'yellow'
      ? 'linear(to-br, yellow.700 0%, gray.900 100%)'
      : 'linear(to-br, gray.800 0%, gray.900 100%)';
  const borderColor = accent === 'orange' ? 'orange.700' : accent === 'yellow' ? 'yellow.600' : 'gray.600';

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
                  colorScheme={accent === 'orange' ? 'orange' : accent === 'yellow' ? 'yellow' : 'gray'}
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
              background: accent === 'orange' ? 'orange.600' : accent === 'yellow' ? 'yellow.600' : 'gray.500',
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

const CampLocation = () => {
  const { currentLocation, startAction, currentAction, canPerformAction: storeCanPerformAction } = useGameStore();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!currentLocation) return null;

  const handleActionStart = (action: SkillAction) => {
    startAction(action);
  };

  // Filter and type actions as SkillAction[]
  const cookingActions = currentLocation.actions.filter(
    (action): action is SkillAction => action.type === 'cooking'
  );

  const firemakingActions = currentLocation.actions.filter(
    (action): action is SkillAction => action.type === 'firemaking'
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
      {/* Camp background image */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${campBg})`}
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
      <Flex
        direction="column"
        minH="100vh"
        p={{ base: 4, md: 8 }}
        position="relative"
        zIndex={2}
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
            {/* Cooking Section */}
            <Box maxW="400px" mx="auto" w="100%">
              <ActionSection
                title="Cooking"
                actions={cookingActions}
                onActionClick={handleActionStart}
                canPerformAction={storeCanPerformAction}
                currentAction={getSkillCurrentAction('cooking')}
              />
            </Box>
            {/* Firemaking Section */}
            <Box maxW="400px" mx="auto" w="100%">
              <ActionSection
                title="Firemaking"
                actions={firemakingActions}
                onActionClick={handleActionStart}
                canPerformAction={storeCanPerformAction}
                currentAction={getSkillCurrentAction('firemaking')}
              />
            </Box>
          </Grid>
        </VStack>
      </Flex>
    </Box>
  );
};

export default CampLocation; 