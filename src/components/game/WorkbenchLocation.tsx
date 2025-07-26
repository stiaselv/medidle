import React, { useState, useMemo } from 'react';
import { Box, VStack, Text, Button, Grid, Tabs, TabList, TabPanels, TabPanel, Tab, Progress, Flex, Card, CardBody, CardHeader, Divider, Heading, Icon, HStack, Tooltip, keyframes } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { GiWoodAxe, GiHammerNails } from 'react-icons/gi';
import { useGameStore, calculateLevel, getNextLevelExperience } from '../../store/gameStore';
import type { SkillAction, Requirement } from '../../types/game';
import { ProgressBar } from './ProgressBar';
import { RequirementStatus } from '../ui/RequirementStatus';
import { ItemIcon } from '../ui/ItemIcon';
import { getItemById } from '../../data/items';
import workbenchBg from '../../assets/BG/workbench.webp';

const FLETCHING_TABS = ['Arrows', 'Bows', 'Javelins', 'Bolts'];
const CRAFTING_TABS = ['Armor', 'Jewelry', 'Staves', 'Gems'];

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const shine = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

function getFletchingTab(action: SkillAction): string {
  const name = action.name.toLowerCase();
  if (name.includes('arrow')) return 'Arrows';
  if (name.includes('bow')) return 'Bows';
  if (name.includes('javelin')) return 'Javelins';
  if (name.includes('bolt')) return 'Bolts';
  return 'Other';
}

function getCraftingTab(action: SkillAction): string {
  const name = action.name.toLowerCase();
  if (name.includes('leather') || name.includes('dragonhide') || name.includes('armor')) return 'Armor';
  if (name.includes('ring') || name.includes('amulet') || name.includes('jewel')) return 'Jewelry';
  if (name.includes('staff') || name.includes('battlestaff')) return 'Staves';
  if (name.includes('sapphire') || name.includes('emerald') || name.includes('ruby') || name.includes('diamond') || name.includes('dragonstone') || name.includes('onyx') || name.includes('zenyte') || name.includes('uncut')) return 'Gems';
  return 'Other';
}

const getActionIcon = (type: string) => {
  switch (type) {
    case 'fletching':
      return GiWoodAxe;
    case 'crafting':
      return GiHammerNails;
    default:
      return GiWoodAxe;
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
              `0 0 0 rgba(${colorScheme === 'orange' ? '237, 137, 54' : '66, 153, 225'}, 0)`,
              `0 0 20px rgba(${colorScheme === 'orange' ? '237, 137, 54' : '66, 153, 225'}, 0.6)`,
              `0 0 0 rgba(${colorScheme === 'orange' ? '237, 137, 54' : '66, 153, 225'}, 0)`,
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
                  background: `linear-gradient(90deg, ${colorScheme === 'orange' ? '#ED8936, #F6AD55, #ED8936' : '#63B3ED, #4299E1, #63B3ED'})`,
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
                    const requiredQuantity = req.quantity || 0;
                    const hasEnough = bankQuantity >= requiredQuantity;
                    
                    return (
                      <HStack key={index} spacing={2} w="100%" justify="space-between">
                        <HStack spacing={2}>
                          <Text fontSize="xs" color="gray.400">Need:</Text>
                          <ItemIcon itemId={req.itemId || ''} size="sm" />
                          <Text fontSize="xs" color="gray.300">{requiredQuantity}x</Text>
                        </HStack>
                        <HStack spacing={2}>
                          <Text fontSize="xs" color="gray.400">Have:</Text>
                          <ItemIcon itemId={req.itemId || ''} size="sm" />
                          <Text fontSize="xs" color={hasEnough ? "green.300" : "red.300"}>
                            {bankQuantity}x
                          </Text>
                        </HStack>
                      </HStack>
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

function SkillProgressBar({ skillName }: { skillName: 'fletching' | 'crafting' }) {
  const character = useGameStore(state => state.character);
  const skill = character?.skills[skillName];
  if (!skill) return null;
  const currentLevel = skill.level;
  const currentExp = skill.experience;
  const nextLevelExp = getNextLevelExperience(currentLevel);
  const prevLevelExp = getNextLevelExperience(currentLevel - 1);
  const expProgress = ((currentExp - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100;
  
  const skillIconPath = `/assets/ItemThumbnail/skillicons/${skillName}.png`;
  
  return (
    <Box mb={1}>
      <Flex justify="space-between" align="center" mb={0.5}>
        <Flex align="center" gap={2}>
          <img
            src={skillIconPath}
            alt={`${skillName} icon`}
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
          <Text fontWeight="bold" fontSize="md">{skillName.charAt(0).toUpperCase() + skillName.slice(1)} Lv {currentLevel}</Text>
        </Flex>
        <Text fontSize="xs" color="gray.400">{currentExp.toLocaleString()} XP</Text>
      </Flex>
      <Progress value={expProgress} size="xs" colorScheme={skillName === 'fletching' ? 'orange' : 'blue'} borderRadius="md" />
      <Text fontSize="xs" color="gray.400" textAlign="right">{expProgress.toFixed(1)}% to next</Text>
    </Box>
  );
}

const cardGradientFletching = 'linear(to-br, orange.900 0%, gray.900 100%)';
const cardGradientCrafting = 'linear(to-br, blue.900 0%, gray.900 100%)';

export const WorkbenchLocation = () => {
  const { currentLocation, startAction, currentAction, canPerformAction } = useGameStore();
  const [fletchingTab, setFletchingTab] = useState(0);
  const [craftingTab, setCraftingTab] = useState(0);

  if (!currentLocation) return null;

  // Split actions by type (future-proof for crafting)
  const fletchingActions = currentLocation.actions.filter(
    (action): action is SkillAction => action.type === 'fletching'
  );
  const craftingActions = currentLocation.actions.filter(
    (action): action is SkillAction => action.type === 'crafting'
  );

  // Group fletching actions by tab
  const fletchingByTab = useMemo(() => {
    const grouped: Record<string, SkillAction[]> = {};
    for (const tab of FLETCHING_TABS) grouped[tab] = [];
    for (const action of fletchingActions) {
      const tab = getFletchingTab(action);
      if (FLETCHING_TABS.includes(tab)) grouped[tab].push(action);
    }
    return grouped;
  }, [fletchingActions]);

  // Group crafting actions by tab (future)
  const craftingByTab = useMemo(() => {
    const grouped: Record<string, SkillAction[]> = {};
    for (const tab of CRAFTING_TABS) grouped[tab] = [];
    for (const action of craftingActions) {
      const tab = getCraftingTab(action);
      if (CRAFTING_TABS.includes(tab)) grouped[tab].push(action);
    }
    return grouped;
  }, [craftingActions]);

  return (
    <Box position="relative" width="100%" minH="100vh" p={0}>
      {/* Workbench background image */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${workbenchBg})`}
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
          bg: 'rgba(0,0,0,0.55)',
          zIndex: 1
        }}
      />
      {/* Content */}
      <Box position="relative" zIndex={2} p={4}>
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Text fontSize="2xl" fontWeight="bold">{currentLocation.name}</Text>
            <Text fontSize="sm" color="gray.500">{currentLocation.description}</Text>
          </Box>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={4} align="flex-start" justify="center">
            {/* Fletching Section as Card */}
            <Card
              flex={1}
              minW={0}
              maxW="420px"
              mx="auto"
              boxShadow="lg"
              borderWidth={1}
              borderColor="orange.700"
              bgGradient={cardGradientFletching}
              borderRadius="2xl"
              overflow="hidden"
            >
              <CardHeader p={3} pb={1} borderBottomWidth={1} borderColor="orange.800">
                <SkillProgressBar skillName="fletching" />
              </CardHeader>
              <CardBody p={3}>
                <Tabs
                  variant="soft-rounded"
                  colorScheme="orange"
                  index={fletchingTab}
                  onChange={setFletchingTab}
                  isFitted
                  size="sm"
                >
                  <TabList overflowX="auto" py={1} mb={2}>
                    {FLETCHING_TABS.map((tab) => (
                      <Tab
                        key={tab}
                        _selected={{ bg: 'orange.500', color: 'white' }}
                        fontWeight="semibold"
                        fontSize="sm"
                        whiteSpace="nowrap"
                        minW="80px"
                        px={2}
                        py={1}
                      >
                        {tab}
                      </Tab>
                    ))}
                  </TabList>
                  <TabPanels>
                    {FLETCHING_TABS.map((tab) => (
                      <TabPanel key={tab} p={0}>
                        <Grid
                          templateColumns={{ base: '1fr' }}
                          gap={3}
                          maxH="60vh"
                          overflowY="auto"
                          sx={{
                            '&::-webkit-scrollbar': {
                              width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: '#ED8936',
                              borderRadius: 'full',
                            },
                          }}
                        >
                          {fletchingByTab[tab].length === 0 ? (
                            <Text color="gray.400" p={2} fontSize="sm">No actions available.</Text>
                          ) : (
                            fletchingByTab[tab].map((action: SkillAction) => (
                              <ActionButton
                                key={action.id}
                                action={action}
                                onClick={() => startAction(action)}
                                isDisabled={!canPerformAction(action)}
                                isActive={currentAction?.id === action.id}
                                colorScheme="orange"
                              />
                            ))
                          )}
                        </Grid>
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
            {/* Divider for large screens */}
            <Divider orientation="vertical" display={{ base: 'none', lg: 'block' }} h="auto" mx={2} borderColor="gray.700" />
            {/* Crafting Section as Card */}
            <Card
              flex={1}
              minW={0}
              maxW="420px"
              mx="auto"
              boxShadow="lg"
              borderWidth={1}
              borderColor="blue.700"
              bgGradient={cardGradientCrafting}
              borderRadius="2xl"
              overflow="hidden"
            >
              <CardHeader p={3} pb={1} borderBottomWidth={1} borderColor="blue.800">
                <SkillProgressBar skillName="crafting" />
              </CardHeader>
              <CardBody p={3}>
                <Tabs
                  variant="soft-rounded"
                  colorScheme="blue"
                  index={craftingTab}
                  onChange={setCraftingTab}
                  isFitted
                  size="sm"
                >
                  <TabList overflowX="auto" py={1} mb={2}>
                    {CRAFTING_TABS.map((tab) => (
                      <Tab
                        key={tab}
                        _selected={{ bg: 'blue.500', color: 'white' }}
                        fontWeight="semibold"
                        fontSize="sm"
                        whiteSpace="nowrap"
                        minW="80px"
                        px={2}
                        py={1}
                      >
                        {tab}
                      </Tab>
                    ))}
                  </TabList>
                  <TabPanels>
                    {CRAFTING_TABS.map((tab) => (
                      <TabPanel key={tab} p={0}>
                        <Grid
                          templateColumns={{ base: '1fr' }}
                          gap={3}
                          maxH="60vh"
                          overflowY="auto"
                          sx={{
                            '&::-webkit-scrollbar': {
                              width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: '#4299E1',
                              borderRadius: 'full',
                            },
                          }}
                        >
                          {craftingByTab[tab].length === 0 ? (
                            <Text color="gray.400" p={2} fontSize="sm">No actions available.</Text>
                          ) : (
                            craftingByTab[tab].map((action: SkillAction) => (
                              <ActionButton
                                key={action.id}
                                action={action}
                                onClick={() => startAction(action)}
                                isDisabled={!canPerformAction(action)}
                                isActive={currentAction?.id === action.id}
                                colorScheme="blue"
                              />
                            ))
                          )}
                        </Grid>
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};