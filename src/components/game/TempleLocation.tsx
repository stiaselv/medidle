import React from 'react';
import { Box, Heading, VStack, useBreakpointValue, Progress, Text } from '@chakra-ui/react';
import { useGameStore, calculateLevel, getNextLevelExperience } from '../../store/gameStore';
import type { SkillAction } from '../../types/game';
import { ActionButton } from '../ui/ActionButton';
import templeBg from '../../assets/BG/temple.webp';

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
    >
      <Heading size="md" color={accent === 'blue' ? 'blue.200' : accent === 'purple' ? 'purple.200' : 'gray.200'} mb={4} textAlign="center">{title}</Heading>
      <Box width="100%" position="relative" mb={4}>
        <Progress value={expProgress} size="sm" colorScheme={accent} borderRadius="full" background="whiteAlpha.200" hasStripe isAnimated sx={{ '& > div:first-of-type': { transitionProperty: 'width', transitionDuration: '0.3s' } }} />
        <Text fontSize="xs" color="gray.300" mt={1} textAlign="center" fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">
          Level {currentLevel} • {expProgress.toFixed(1)}% to {currentLevel + 1}
        </Text>
      </Box>
      <VStack spacing={3} align="stretch">
        {actions.map((action) => (
          <ActionButton
            key={action.id}
            action={action}
            onClick={() => onActionClick(action)}
            isDisabled={!canPerformAction(action)}
            isActive={currentAction?.id === action.id}
          />
        ))}
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