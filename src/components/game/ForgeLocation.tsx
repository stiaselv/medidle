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
  const { canPerformAction, stopAction } = useGameStore();
  const shouldReduceMotion = useReducedMotion();
  
  const allRequirementsMet = canPerformAction(action);
  
  const handleClick = () => {
    if (isActive) {
      stopAction();
    } else if (allRequirementsMet) {
      onClick();
    }
  };

  const handleActionComplete = () => {
    // This will be handled by the game store
  };

  const buttonDisabled = !allRequirementsMet && !isActive;

  return (
    <Button
      width="100%"
      height="auto"
      py={6}
      onClick={handleClick}
      isDisabled={buttonDisabled}
      bg={isActive ? "whiteAlpha.300" : "whiteAlpha.100"}
      _hover={{
        bg: isActive ? "whiteAlpha.400" : "whiteAlpha.200",
      }}
      _active={{
        bg: "whiteAlpha.400",
      }}
      borderWidth={1}
      borderColor={isActive ? "whiteAlpha.400" : "transparent"}
      transition="all 0.2s"
      position="relative"
      overflow="hidden"
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
        <Icon
          as={GiHammerNails}
          boxSize={8} 
          color={!allRequirementsMet ? "red.300" : isActive ? "blue.300" : "green.300"}
          sx={{
            animation: isActive && !shouldReduceMotion ? `${bounce} 1s infinite` : 'none',
            filter: isActive ? 'drop-shadow(0 0 8px currentColor)' : 'none',
          }}
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
            duration={action.baseTime}
            isActive={isActive}
            onComplete={handleActionComplete}
            aria-label={`Action progress for ${action.name}`}
          />
        )}
      </VStack>
    </Button>
  );
};

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

  return (
    <VStack spacing={4} align="stretch" width="100%">
      <HStack spacing={4} align="center" bg="whiteAlpha.100" p={3} borderRadius="lg">
        <Flex width="100%" justify="center" align="center" gap={4}>
          <Heading size="md" color="white" display="flex" alignItems="center" gap={2}>
            <Icon as={GiAnvil} />
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
                  colorScheme="green"
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

      <Tabs variant="soft-rounded" colorScheme="blue" width="100%">
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
              background: 'blue.500',
              borderRadius: 'full',
            },
          }}
        >
          {Object.keys(actionsByMetal).map((metal) => (
            <Tab
              key={metal}
              _selected={{ 
                bg: 'blue.500', 
                color: 'white',
                boxShadow: '0 0 10px rgba(66, 153, 225, 0.5)'
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
                    background: 'blue.500',
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
  );
};

export const ForgeLocation = () => {
  const { currentLocation, startAction, currentAction, canPerformAction: storeCanPerformAction } = useGameStore();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!currentLocation) return null;

  const handleActionStart = (action: SkillAction) => {
    startAction(action);
  };

  const smithingActions = currentLocation.actions.filter(
    action => action.type === 'smithing' || (action.type === 'smithing_category' && action.subActions)
  ).flatMap(action => action.type === 'smithing_category' ? action.subActions || [] : [action]);

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
      {/* Background with forge theme */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="linear-gradient(135deg, #2a1f1d 0%, #3d2b28 100%)"
        zIndex={-1}
      />

      <Flex
        direction="column"
        minH="100%"
        p={{ base: 4, md: 8 }}
        position="relative"
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
                currentAction={currentAction}
              />
            </Box>
          </Grid>
        </VStack>
      </Flex>
    </Box>
  );
}; 