import React from 'react';
import { Box, Heading, VStack, useBreakpointValue, Progress, Text, Button, Icon, HStack, Tooltip, keyframes } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { GiPrayer, GiStarSwirl } from 'react-icons/gi';
import { useGameStore, calculateLevel, getNextLevelExperience } from '../../store/gameStore';
import { getExperienceForLevel } from '../../utils/experience';
import type { SkillAction } from '../../types/game';
import { ProgressBar } from './ProgressBar';
import { RequirementStatus } from '../ui/RequirementStatus';
import templeBg from '../../assets/BG/temple.webp';
import { useTheme } from '../../contexts/ThemeContext';

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
    case 'prayer':
      return GiPrayer;
    case 'runecrafting':
      return GiStarSwirl;
    default:
      return GiPrayer;
  }
};

const ActionButton: React.FC<{
  action: SkillAction;
  onClick: () => void;
  isDisabled: boolean;
  isActive?: boolean;
  colorScheme: string;
}> = ({
  action,
  onClick,
  isDisabled,
  isActive = false,
  colorScheme
}) => {
  const icon = getActionIcon(action.type);
  const { character, stopAction, canPerformAction, currentAction: storeCurrentAction } = useGameStore();
  
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
              `0 0 0 rgba(${colorScheme === 'blue' ? '66, 153, 225' : colorScheme === 'purple' ? '128, 90, 213' : '113, 128, 150'}, 0)`,
              `0 0 20px rgba(${colorScheme === 'blue' ? '66, 153, 225' : colorScheme === 'purple' ? '128, 90, 213' : '113, 128, 150'}, 0.6)`,
              `0 0 0 rgba(${colorScheme === 'blue' ? '66, 153, 225' : colorScheme === 'purple' ? '128, 90, 213' : '113, 128, 150'}, 0)`,
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
            colorScheme={!allRequirementsMet ? "red" : isActive ? colorScheme : "green"}
            height="auto"
            p={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            onClick={handleClick}
            isDisabled={buttonDisabled}
            _hover={{ 
              bg: !allRequirementsMet ? 'blackAlpha.400' : isActive ? `${colorScheme}.900` : 'whiteAlpha.100',
            }}
            transition="all 0.2s"
            bg={!allRequirementsMet ? 'blackAlpha.300' : isActive ? `${colorScheme}.800` : 'blackAlpha.400'}
            borderColor={!allRequirementsMet ? 'red.500' : isActive ? `${colorScheme}.400` : 'green.500'}
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
          >
            <VStack spacing={2} align="center" width="100%">
              <Icon
                as={icon} 
                boxSize={6} 
                color={!allRequirementsMet ? "red.300" : isActive ? `${colorScheme}.300` : "green.300"}
                sx={{
                  animation: isActive ? `${bounce} 1s infinite` : 'none',
                  filter: isActive ? 'drop-shadow(0 0 8px currentColor)' : 'none',
                }}
              />
              
              <Heading
                size="sm" 
                color="white"
                textShadow="0 2px 4px rgba(0,0,0,0.4)"
                textAlign="center"
              >
                {action.name}
              </Heading>
              
              <Text 
                fontSize="sm" 
                color={!allRequirementsMet ? "red.300" : isActive ? `${colorScheme}.300` : "green.300"}
                fontWeight="medium"
                sx={isActive ? {
                  background: `linear-gradient(90deg, ${
                    colorScheme === 'blue' ? '#63B3ED, #4299E1, #63B3ED' : 
                    colorScheme === 'purple' ? '#B794F6, #805AD5, #B794F6' : 
                    '#A0AEC0, #718096, #A0AEC0'
                  })`,
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
                >
                  Missing requirements
                </Text>
              )}

              {isActive && (
                <Text 
                  fontSize="xs" 
                  color="red.300"
                  fontWeight="bold"
                  mt={1}
                  sx={{
                    animation: `${shine} 3s linear infinite`,
                    background: 'linear-gradient(90deg, #FF6B6B, #FF8787, #FF6B6B)',
                    backgroundSize: '400% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Click to stop
                </Text>
              )}

              {/* Progress Bar */}
              {isActive && (
                <ProgressBar
                  progress={storeCurrentAction && storeCurrentAction.id === action.id ? (useGameStore.getState().actionProgress) : 0}
                  isActive={isActive}
                />
              )}
            </VStack>
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
  const { theme } = useTheme();
  const skillType = actions[0]?.skill || '';

  // Calculate experience progress for the skill
  const currentSkillExp = character?.skills[skillType]?.experience || 0;
  const currentLevel = calculateLevel(currentSkillExp);
  const nextLevelExp = getNextLevelExperience(currentLevel);
  const prevLevelExp = getExperienceForLevel(currentLevel);
  const expProgress = ((currentSkillExp - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100;

  // Accent and card style
  const accent = skillType === 'prayer' ? 'blue' : skillType === 'runecrafting' ? 'purple' : 'gray';
  const cardGradient =
    accent === 'blue'
      ? 'linear(to-br, blue.900 0%, gray.900 100%)'
      : accent === 'purple'
      ? 'linear(to-br, purple.900 0%, gray.900 100%)'
      : 'linear(to-br, gray.800 0%, gray.900 100%)';
  const borderColor = accent === 'blue' ? 'blue.700' : accent === 'purple' ? 'purple.700' : 'gray.600';

  return (
    <Box
      bg={cardGradient}
      borderRadius="2xl"
      boxShadow="lg"
      p={6}
      borderWidth="2px"
      borderColor={borderColor}
      w="100%"
      maxW="500px"
      mx="auto"
      maxHeight="70vh"
      overflowY="auto"
      display="flex"
      flexDirection="column"
      minWidth="280px"
      className={theme === 'medieval' ? 'medieval-action-container' : ''}
    >
      <VStack spacing={4} align="stretch">
        <Heading size="md" color={accent === 'blue' ? 'blue.200' : accent === 'purple' ? 'purple.200' : 'gray.200'} textAlign="center">{title}</Heading>
        
        {/* Skill Progress */}
        <Box width="100%" position="relative">
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
            <Box>
                             <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                 <Box display="flex" alignItems="center" gap={2}>
                  <img
                    src={`/assets/ItemThumbnail/skillicons/${skillType}.png`}
                    alt={`${skillType} icon`}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      filter: 'brightness(1.1)'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/assets/items/placeholder.png';
                    }}
                  />
                  <Text fontWeight="bold" fontSize="md" color="white">
                    {skillType.charAt(0).toUpperCase() + skillType.slice(1)} Lv {currentLevel}
                  </Text>
                </Box>
                <Text fontSize="xs" color="gray.400">{currentSkillExp.toLocaleString()} XP</Text>
              </Box>
              <Progress 
                value={expProgress} 
                size="sm" 
                colorScheme={accent} 
                borderRadius="full" 
                background="whiteAlpha.200" 
                hasStripe 
                isAnimated 
                sx={{ '& > div:first-of-type': { transitionProperty: 'width', transitionDuration: '0.3s' } }} 
              />
              <Text fontSize="xs" color="gray.300" mt={1} textAlign="right" fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                {expProgress.toFixed(1)}% to Level {currentLevel + 1}
              </Text>
            </Box>
          </Tooltip>
        </Box>

        {/* Actions */}
        <VStack spacing={3} align="stretch" className={theme === 'medieval' ? 'action-grid' : ''}>
          {actions.map((action) => (
            <ActionButton
              key={action.id}
              action={action}
              onClick={() => onActionClick(action)}
              isDisabled={!canPerformAction(action)}
              isActive={currentAction?.id === action.id}
              colorScheme={accent}
            />
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export const TempleLocation = () => {
  const { currentLocation, startAction, currentAction, canPerformAction } = useGameStore();

  if (!currentLocation) return null;

  // Filter actions by type
  const prayerActions = currentLocation.actions.filter(
    (action): action is SkillAction => action.type === 'prayer'
  );
  const runecraftingActions = currentLocation.actions.filter(
    (action): action is SkillAction => action.type === 'runecrafting'
  );

  const handleActionStart = (action: SkillAction) => {
    startAction(action);
  };

  const getSkillCurrentAction = (type: string): SkillAction | null => {
    if (currentAction && currentAction.type === type) {
      return currentAction as SkillAction;
    }
    return null;
  };

  return (
    <Box
      w="100%"
      minH="100vh"
      bgImage={`url(${templeBg})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      p={{ base: 2, md: 8 }}
      position="relative"
    >
      <VStack spacing={8} align="stretch" maxW="1200px" mx="auto" bg="rgba(24,24,24,0.85)" borderRadius="2xl" p={{ base: 2, md: 8 }}>
        <Heading size="lg" color="blue.200" textAlign="center">Temple</Heading>
        <Box
          display="flex"
          flexDirection="row"
          gap={{ base: 4, md: 8 }}
          justifyContent="center"
          alignItems="stretch"
          width="100%"
          overflowX="auto"
          pb={2}
        >
          <ActionSection
            title="Prayer"
            actions={prayerActions}
            onActionClick={handleActionStart}
            canPerformAction={canPerformAction}
            currentAction={getSkillCurrentAction('prayer')}
          />
          <ActionSection
            title="Runecrafting"
            actions={runecraftingActions}
            onActionClick={handleActionStart}
            canPerformAction={canPerformAction}
            currentAction={getSkillCurrentAction('runecrafting')}
          />
        </Box>
      </VStack>
    </Box>
  );
}; 