import React from 'react';
import { 
  Box, 
  Flex, 
  VStack, 
  HStack, 
  Text, 
  Grid, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  useBreakpointValue,
  Button,
  Heading,
  Badge,
  Image,
  Tooltip,
  Progress,
  Card,
  CardBody,
  SimpleGrid,
  Icon,
  Divider
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaSeedling, FaLeaf, FaTree, FaClock, FaCoins } from 'react-icons/fa';
import { useGameStore, calculateLevel, getNextLevelExperience } from '../../store/gameStore';
import { getExperienceForLevel } from '../../utils/experience';
import type { SkillAction } from '../../types/game';
import { getItemById } from '../../data/items';
import { RequirementStatus } from '../ui/RequirementStatus';

// Animation keyframes for active action
const pulse = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

export const FarmingLocation = () => {
  const { 
    currentLocation, 
    character, 
    startAction, 
    stopAction, 
    currentAction, 
    canPerformAction,
    isActionInProgress
  } = useGameStore();
  
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!currentLocation || !character) return null;

  const handleActionStart = (action: SkillAction) => {
    if (currentAction?.id === action.id) {
      stopAction();
    } else {
      startAction(action);
    }
  };

  // Filter farming actions by category
  const allotmentActions = currentLocation.actions.filter(
    (action): action is SkillAction => 
      action.type === 'farming' && 'category' in action && action.category === 'allotment'
  );

  const herbActions = currentLocation.actions.filter(
    (action): action is SkillAction => 
      action.type === 'farming' && 'category' in action && action.category === 'herbs'
  );

  const treeActions = currentLocation.actions.filter(
    (action): action is SkillAction => 
      action.type === 'farming' && 'category' in action && action.category === 'trees'
  );

  // Get farming skill progress
  const farmingSkill = character.skills.farming;
  const currentLevel = calculateLevel(farmingSkill.experience);
  const nextLevelExp = getNextLevelExperience(currentLevel);
  const prevLevelExp = getExperienceForLevel(currentLevel);
  const expProgress = ((farmingSkill.experience - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100;

  // Enhanced Action Card Component
  const FarmingActionCard = ({ action }: { action: SkillAction }) => {
    const isActive = currentAction?.id === action.id;
    const canPerform = canPerformAction(action);
    const item = getItemById(action.itemReward.id);
    
    // Get category icon
    const getCategoryIcon = () => {
      if ('category' in action) {
        switch (action.category) {
          case 'allotment': return FaSeedling;
          case 'herbs': return FaLeaf;
          case 'trees': return FaTree;
          default: return FaSeedling;
        }
      }
      return FaSeedling;
    };

    // Get harvest time info
    const getHarvestTime = () => {
      if ('harvestTime' in action && action.harvestTime) {
        return `${action.harvestTime / 60000}min harvest`;
      }
      return `${action.baseTime / 1000}s base time`;
    };

    return (
      <motion.div
        style={{ width: '100%' }}
        whileHover={canPerform ? { y: -2 } : undefined}
        whileTap={canPerform ? { scale: 0.98 } : undefined}
        animate={isActive ? {
          boxShadow: [
            '0 0 0 rgba(72, 187, 120, 0)',
            '0 0 20px rgba(72, 187, 120, 0.6)',
            '0 0 0 rgba(72, 187, 120, 0)',
          ]
        } : undefined}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Card
          bg={isActive ? 'green.800' : 'blackAlpha.700'}
          borderWidth={isActive ? 2 : 1}
          borderColor={isActive ? 'green.400' : canPerform ? 'green.600' : 'red.500'}
          cursor={canPerform ? 'pointer' : 'not-allowed'}
          transition="all 0.2s"
          _hover={canPerform ? {
            borderColor: isActive ? 'green.300' : 'green.400',
            bg: isActive ? 'green.700' : 'blackAlpha.600'
          } : undefined}
          opacity={canPerform ? 1 : 0.7}
          height="100%"
          onClick={() => canPerform && handleActionStart(action)}
        >
          <CardBody p={4}>
            <VStack spacing={3} align="stretch" height="100%">
              {/* Header with icon and title */}
              <HStack spacing={3} align="center">
                <Icon 
                  as={getCategoryIcon()} 
                  boxSize={6} 
                  color={isActive ? 'green.200' : canPerform ? 'green.400' : 'red.400'}
                />
                <VStack align="start" spacing={0} flex={1}>
                  <Heading 
                    size="sm" 
                    color="white"
                    lineHeight="1.2"
                  >
                    {action.name}
                  </Heading>
                  <Text fontSize="xs" color="gray.400">
                    Level {action.levelRequired} Farming
                  </Text>
                </VStack>
                {isActive && (
                  <Badge colorScheme="green" variant="solid">
                    Active
                  </Badge>
                )}
              </HStack>

              {/* Item reward with image */}
              {item && (
                <HStack spacing={3} bg="whiteAlpha.100" p={2} borderRadius="md">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    boxSize="32px"
                    fallbackSrc="/assets/items/placeholder.png"
                  />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" fontWeight="medium" color="white">
                      {item.name}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      x{action.itemReward.quantity || 1}
                    </Text>
                  </VStack>
                </HStack>
              )}

              {/* Stats row */}
              <HStack spacing={2} justify="space-between">
                <Tooltip label="Experience gained">
                  <Badge colorScheme="blue" variant="outline" fontSize="xs">
                    +{action.experience} XP
                  </Badge>
                </Tooltip>
                <Tooltip label={getHarvestTime()}>
                  <Badge colorScheme="purple" variant="outline" fontSize="xs">
                    <Icon as={FaClock} boxSize={2} mr={1} />
                    {getHarvestTime()}
                  </Badge>
                </Tooltip>
              </HStack>

              {/* Requirements tooltip */}
              {action.requirements && action.requirements.length > 0 && (
                <Tooltip
                  label={
                    <VStack align="start" spacing={1} p={2}>
                      <Text fontWeight="bold" mb={1}>Requirements:</Text>
                      {action.requirements.map((req, index) => (
                        <RequirementStatus 
                          key={index} 
                          requirement={req} 
                          isMet={canPerform} 
                        />
                      ))}
                    </VStack>
                  }
                  placement="top"
                  hasArrow
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    color="gray.400"
                    fontSize="xs"
                    _hover={{ color: 'white' }}
                  >
                    View Requirements
                  </Button>
                </Tooltip>
              )}
            </VStack>
          </CardBody>
        </Card>
      </motion.div>
    );
  };

  // Category Section Component
  const CategorySection = ({ 
    title, 
    icon, 
    actions, 
    description 
  }: { 
    title: string;
    icon: React.ElementType;
    actions: SkillAction[];
    description: string;
  }) => (
    <VStack spacing={4} align="stretch">
      {/* Section Header */}
      <Box
        bg="blackAlpha.600"
        p={4}
        borderRadius="lg"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <HStack spacing={3} mb={2}>
          <Icon as={icon} boxSize={6} color="green.400" />
          <Heading size="md" color="white">
            {title}
          </Heading>
          <Badge colorScheme="green" variant="outline">
            {actions.length} actions
          </Badge>
        </HStack>
        <Text fontSize="sm" color="gray.300">
          {description}
        </Text>
      </Box>

      {/* Actions Grid */}
      <SimpleGrid 
        columns={{ base: 1, md: 2, lg: 3, xl: 4 }} 
        spacing={4}
        minChildWidth="280px"
      >
        {actions.map((action) => (
          <FarmingActionCard key={action.id} action={action} />
        ))}
      </SimpleGrid>
    </VStack>
  );

  return (
    <Box
      w="100%"
      minH="100vh"
      bgImage="url(/assets/BG/fields.webp?v=2)"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      position="relative"
    >
      {/* Background overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.400"
        zIndex={1}
      />

      {/* Add pulse animation styles */}
      <style>
        {pulse}
      </style>

      <Flex
        position="relative"
        direction="column"
        minH="100vh"
        p={{ base: 4, md: 6 }}
        zIndex={2}
      >
        <VStack spacing={6} align="stretch" w="100%" maxW="1400px" mx="auto">
          {/* Header Section */}
          <Box
            bg="blackAlpha.800"
            p={6}
            borderRadius="xl"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            boxShadow="xl"
          >
            <VStack spacing={4} align="center" textAlign="center">
              <HStack spacing={4} align="center">
                <img
                  src="/assets/ItemThumbnail/skillicons/farming.png"
                  alt="Farming skill icon"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    filter: 'brightness(1.1)'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/items/placeholder.png';
                  }}
                />
                <VStack spacing={1} align="start">
                  <Heading size="xl" color="white">
                    {currentLocation.name}
                  </Heading>
                  <Text fontSize="md" color="gray.300">
                    Level {currentLevel} Farming
                  </Text>
                </VStack>
              </HStack>
              
              <Text
                fontSize="md"
                color="gray.300"
                maxW="600px"
                lineHeight="1.6"
              >
                {currentLocation.description}
              </Text>

              {/* Skill Progress Bar */}
              <Box w="100%" maxW="500px">
                <Tooltip
                  label={
                    <VStack align="start" spacing={1} p={3}>
                      <Text fontWeight="bold">Farming Progress</Text>
                      <Text>Current XP: {farmingSkill.experience.toLocaleString()}</Text>
                      <Text>Next Level: {nextLevelExp.toLocaleString()}</Text>
                      <Text>Remaining: {(nextLevelExp - farmingSkill.experience).toLocaleString()}</Text>
                    </VStack>
                  }
                  placement="top"
                  hasArrow
                >
                  <Box>
                    <Progress
                      value={expProgress}
                      size="lg"
                      colorScheme="green"
                      borderRadius="full"
                      bg="whiteAlpha.200"
                      hasStripe
                      isAnimated
                    />
                    <Text 
                      fontSize="sm" 
                      color="gray.300" 
                      mt={2} 
                      textAlign="center"
                      fontWeight="medium"
                    >
                      {expProgress.toFixed(1)}% to Level {currentLevel + 1}
                    </Text>
                  </Box>
                </Tooltip>
              </Box>
            </VStack>
          </Box>

          {/* Main Content - Tabbed Interface */}
          <Box
            bg="blackAlpha.800"
            borderRadius="xl"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            boxShadow="xl"
            overflow="hidden"
          >
            <Tabs variant="enclosed" colorScheme="green">
              <TabList bg="blackAlpha.300" borderBottomColor="whiteAlpha.200">
                <Tab 
                  color="gray.300" 
                  _selected={{ bg: "green.600", color: "white", borderBottomColor: "green.600" }}
                  _hover={{ color: "white", bg: "whiteAlpha.100" }}
                  fontWeight="medium"
                >
                  <Icon as={FaSeedling} mr={2} />
                  Allotment ({allotmentActions.length})
                </Tab>
                <Tab 
                  color="gray.300" 
                  _selected={{ bg: "green.600", color: "white", borderBottomColor: "green.600" }}
                  _hover={{ color: "white", bg: "whiteAlpha.100" }}
                  fontWeight="medium"
                >
                  <Icon as={FaLeaf} mr={2} />
                  Herbs ({herbActions.length})
                </Tab>
                <Tab 
                  color="gray.300" 
                  _selected={{ bg: "green.600", color: "white", borderBottomColor: "green.600" }}
                  _hover={{ color: "white", bg: "whiteAlpha.100" }}
                  fontWeight="medium"
                >
                  <Icon as={FaTree} mr={2} />
                  Trees ({treeActions.length})
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={6}>
                  <CategorySection
                    title="Allotment Farming"
                    icon={FaSeedling}
                    actions={allotmentActions}
                    description="Grow vegetables and other crops in allotment patches. These grow relatively quickly and provide good farming experience."
                  />
                </TabPanel>

                <TabPanel p={6}>
                  <CategorySection
                    title="Herb Farming"
                    icon={FaLeaf}
                    actions={herbActions}
                    description="Cultivate herbs for herblore and other uses. Herbs take longer to grow but provide valuable materials."
                  />
                </TabPanel>

                <TabPanel p={6}>
                  <CategorySection
                    title="Tree Farming"
                    icon={FaTree}
                    actions={treeActions}
                    description="Plant and grow trees for woodcutting materials. Trees take the longest time to grow but give the most experience."
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
}; 