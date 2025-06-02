import { keyframes } from '@chakra-ui/react';
import { Box, Button, Flex, Grid, Heading, Text, VStack, useBreakpointValue, Icon, Tooltip } from '@chakra-ui/react';
import { GiMiningHelmet, GiAnvil } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import type { SkillAction, Requirement } from '../../types/game';
import { ProgressBar } from './ProgressBar';
import { RequirementStatus } from '../ui/RequirementStatus';

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
    case 'mining':
      return GiMiningHelmet;
    case 'smithing':
      return GiAnvil;
    default:
      return GiMiningHelmet;
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
  const { character, completeAction, stopAction, canPerformAction } = useGameStore();
  
  const allRequirementsMet = canPerformAction(action);
  
  const requirementsMet = (action.requirements ?? []).map(req => ({
    requirement: req,
    isMet: allRequirementsMet
  }));
  
  const handleActionComplete = () => {
    completeAction();
  };

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
            <Text 
              fontSize="xs" 
              color="gray.300"
              fontWeight="medium"
            >
              +{action.experience}xp • {(action.baseTime / 1000).toFixed(1)}s
            </Text>
            
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
  currentAction,
  icon
}: { 
  title: string;
  actions: SkillAction[];
  onActionClick: (action: SkillAction) => void;
  canPerformAction: (action: SkillAction) => boolean;
  currentAction: SkillAction | null;
  icon: any;
}) => (
  <Box
    bg="blackAlpha.600"
    p={6}
    borderRadius="2xl"
    backdropFilter="blur(12px)"
    border="1px solid"
    borderColor="whiteAlpha.200"
    boxShadow="dark-lg"
    position="relative"
    overflow="hidden"
    height="450px"
    display="flex"
    flexDirection="column"
    _before={{
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '60%',
      bgGradient: 'linear(to-b, whiteAlpha.100, transparent)',
      borderRadius: '2xl',
      pointerEvents: 'none'
    }}
  >
    <Heading 
      size="md" 
      color="white" 
      mb={4} 
      textShadow="0 2px 4px rgba(0,0,0,0.4)"
      position="relative"
      display="flex"
      alignItems="center"
      gap={2}
      _after={{
        content: '""',
        position: 'absolute',
        bottom: '-8px',
        left: 0,
        width: '40px',
        height: '2px',
        bg: 'whiteAlpha.300',
        borderRadius: 'full'
      }}
    >
      <Icon as={icon} />
      {title}
    </Heading>
    
    <Box
      overflowY="auto"
      flex={1}
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
      <VStack spacing={4} align="stretch">
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
  </Box>
);

export const QuarryLocation = () => {
  const { currentLocation, character, startAction, currentAction, canPerformAction: storeCanPerformAction } = useGameStore();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!currentLocation || !character) return null;

  const handleActionStart = (action: SkillAction) => {
    startAction(action);
  };

  const miningActions = currentLocation.actions.filter(
    action => action.type === 'mining'
  );

  const smithingActions = currentLocation.actions.filter(
    action => action.type === 'smithing'
  );

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
      {/* Background with quarry theme */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(to-b, gray.800, gray.700)"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: "rgba(0,0,0,0.2)",
          opacity: 0.8,
          zIndex: 1
        }}
        _after={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: "linear(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)",
          backdropFilter: "blur(1px)",
          zIndex: 2
        }}
        zIndex={0}
      >
        {/* Rock formations in the background */}
        <Box
          position="absolute"
          top="5%"
          left="10%"
          width="25%"
          height="40%"
          bg="gray.600"
          borderRadius="10%"
          filter="blur(8px)"
          opacity={0.7}
          transform="skewY(-15deg)"
        />
        <Box
          position="absolute"
          top="15%"
          right="15%"
          width="30%"
          height="45%"
          bg="gray.700"
          borderRadius="10%"
          filter="blur(10px)"
          opacity={0.6}
          transform="skewY(15deg)"
        />
        {/* Forge glow */}
        <Box
          position="absolute"
          bottom="15%"
          right="20%"
          width="30%"
          height="25%"
          bgGradient="radial-gradient(circle at 50% 50%, orange.500 0%, orange.700 40%, transparent 70%)"
          borderRadius="full"
          filter="blur(20px)"
          opacity={0.3}
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgGradient: "linear(180deg, rgba(255,165,0,0.2) 0%, transparent 100%)",
            borderRadius: "full"
          }}
        />
      </Box>

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
            gap={{ base: 4, md: 6 }}
            w="100%"
            maxW="1400px"
            mx="auto"
          >
            {/* Mining Section */}
            <ActionSection
              title="Mining"
              actions={miningActions}
              onActionClick={handleActionStart}
              canPerformAction={storeCanPerformAction}
              currentAction={currentAction}
              icon={GiMiningHelmet}
            />

            {/* Smithing Section */}
            <ActionSection
              title="Smithing"
              actions={smithingActions}
              onActionClick={handleActionStart}
              canPerformAction={storeCanPerformAction}
              currentAction={currentAction}
              icon={GiAnvil}
            />
          </Grid>
        </VStack>
      </Flex>
    </Box>
  );
}; 