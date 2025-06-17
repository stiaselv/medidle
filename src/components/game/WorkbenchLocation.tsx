import React, { useState, useMemo } from 'react';
import { Box, VStack, Text, Button, Grid, Tabs, TabList, TabPanels, TabPanel, Tab, Progress, Flex, Card, CardBody, CardHeader, Divider } from '@chakra-ui/react';
import { useGameStore, calculateLevel, getNextLevelExperience } from '../../store/gameStore';
import type { SkillAction, Requirement } from '../../types/game';
import workbenchBg from '../../assets/BG/workbench.webp';

const FLETCHING_TABS = ['Arrows', 'Bows', 'Javelins', 'Bolts'];
const CRAFTING_TABS = ['Staves', 'Armor', 'Jewelry', 'Tan'];

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
  if (name.includes('staff')) return 'Staves';
  if (name.includes('armor')) return 'Armor';
  if (name.includes('jewel')) return 'Jewelry';
  if (name.includes('tan')) return 'Tan';
  return 'Other';
}

function SkillProgressBar({ skillName }: { skillName: 'fletching' | 'crafting' }) {
  const character = useGameStore(state => state.character);
  const skill = character?.skills[skillName];
  if (!skill) return null;
  const currentLevel = skill.level;
  const currentExp = skill.experience;
  const nextLevelExp = getNextLevelExperience(currentLevel);
  const prevLevelExp = getNextLevelExperience(currentLevel - 1);
  const expProgress = ((currentExp - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100;
  return (
    <Box mb={1}>
      <Flex justify="space-between" align="center" mb={0.5}>
        <Text fontWeight="bold" fontSize="md">{skillName.charAt(0).toUpperCase() + skillName.slice(1)} Lv {currentLevel}</Text>
        <Text fontSize="xs" color="gray.400">{currentExp.toLocaleString()} XP</Text>
      </Flex>
      <Progress value={expProgress} size="xs" colorScheme={skillName === 'fletching' ? 'orange' : 'blue'} borderRadius="md" />
      <Text fontSize="xs" color="gray.400" textAlign="right">{expProgress.toFixed(1)}% to next</Text>
    </Box>
  );
}

const cardGradientFletching = 'linear(to-br, orange.900 0%, gray.900 100%)';
const cardGradientCrafting = 'linear(to-br, blue.900 0%, gray.900 100%)';
const actionBgFletching = 'linear(to-r, orange.800 0%, gray.800 100%)';
const actionBgCrafting = 'linear(to-r, blue.800 0%, gray.800 100%)';

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
                              <Box
                                key={action.id}
                                p={2}
                                pl={3}
                                borderLeftWidth={4}
                                borderLeftColor="orange.400"
                                borderWidth={1}
                                borderColor="orange.700"
                                borderRadius="lg"
                                bgGradient={actionBgFletching}
                                fontSize="sm"
                                transition="box-shadow 0.15s, background 0.15s"
                                _hover={{ boxShadow: '0 0 0 2px #ED8936', bg: 'orange.900' }}
                                display="flex"
                                flexDirection="column"
                                gap={1}
                              >
                                <Text fontWeight="bold" fontSize="md" mb={0.5}>{action.name}</Text>
                                <Text fontSize="xs" color="gray.400">
                                  Level {action.levelRequired} | XP: {action.experience}
                                </Text>
                                {action.requirements && action.requirements.length > 0 && (
                                  <Box>
                                    <Text fontSize="xs" color="gray.300">Requirements:</Text>
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                                      {action.requirements.map((req: Requirement, i: number) => (
                                        <li key={i} style={{ fontSize: '0.85em', color: '#bbb' }}>
                                          {req.type === 'item' && req.itemId ? `${req.quantity || 1} x ${req.itemId}` : null}
                                          {req.type === 'level' && req.skill ? `${req.skill} lvl ${req.level}` : null}
                                        </li>
                                      ))}
                                    </ul>
                                  </Box>
                                )}
                                <Button
                                  colorScheme="orange"
                                  size="xs"
                                  isDisabled={!canPerformAction(action)}
                                  isLoading={currentAction?.id === action.id}
                                  onClick={() => startAction(action)}
                                  w="100%"
                                  fontSize="sm"
                                  py={1}
                                  mt={1}
                                  borderRadius="md"
                                >
                                  Start
                                </Button>
                              </Box>
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
                              <Box
                                key={action.id}
                                p={2}
                                pl={3}
                                borderLeftWidth={4}
                                borderLeftColor="blue.400"
                                borderWidth={1}
                                borderColor="blue.700"
                                borderRadius="lg"
                                bgGradient={actionBgCrafting}
                                fontSize="sm"
                                transition="box-shadow 0.15s, background 0.15s"
                                _hover={{ boxShadow: '0 0 0 2px #4299E1', bg: 'blue.900' }}
                                display="flex"
                                flexDirection="column"
                                gap={1}
                              >
                                <Text fontWeight="bold" fontSize="md" mb={0.5}>{action.name}</Text>
                                <Text fontSize="xs" color="gray.400">
                                  Level {action.levelRequired} | XP: {action.experience}
                                </Text>
                                {action.requirements && action.requirements.length > 0 && (
                                  <Box>
                                    <Text fontSize="xs" color="gray.300">Requirements:</Text>
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                                      {action.requirements.map((req: Requirement, i: number) => (
                                        <li key={i} style={{ fontSize: '0.85em', color: '#bbb' }}>
                                          {req.type === 'item' && req.itemId ? `${req.quantity || 1} x ${req.itemId}` : null}
                                          {req.type === 'level' && req.skill ? `${req.skill} lvl ${req.level}` : null}
                                        </li>
                                      ))}
                                    </ul>
                                  </Box>
                                )}
                                <Button
                                  colorScheme="blue"
                                  size="xs"
                                  isDisabled={!canPerformAction(action)}
                                  isLoading={currentAction?.id === action.id}
                                  onClick={() => startAction(action)}
                                  w="100%"
                                  fontSize="sm"
                                  py={1}
                                  mt={1}
                                  borderRadius="md"
                                >
                                  Start
                                </Button>
                              </Box>
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