import { Box, Flex, useBreakpointValue, Button, Menu, MenuButton, MenuList, MenuItem, Avatar, Text, VStack, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { GameScreen } from '../game/GameScreen';
import { Footer } from './Footer';
import { useGameStore } from '../../store/gameStore';
import { useUIStore } from '../../store/uiStore';
import { Outlet, useNavigate } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useEffect, useState, useCallback } from 'react';
import { FaUserFriends, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';
import { MenuDivider } from '@chakra-ui/react';
import { CombatLocation } from '../game/CombatLocation';
import { mockLocations } from '../../data/mockData';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Tabs, TabList, TabPanels, Tab, TabPanel, Stat, StatLabel, StatNumber, StatGroup, Divider } from '@chakra-ui/react';
import { FaChartBar } from 'react-icons/fa';
import { getItemById } from '../../data/items';
import { mockMonsters } from '../../data/mockData';

const MotionBox = motion(Box);

export const GameLayout = () => {
  const { character, signOut, stopAction, setLocation, currentLocation, locations } = useGameStore();
  const { isFooterExpanded, toggleFooter } = useUIStore();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();

  // Combat area/monster selector state
  const [selectedCombatArea, setSelectedCombatArea] = useState<string | null>(null);
  const [selectedMonster, setSelectedMonster] = useState<null | import('../../types/game').Monster>(null);
  const [isCombatSelectionActive, setCombatSelectionActive] = useState(false);

  // List of custom combat area IDs
  const combatAreas = [
    'farm',
    'lumbridge_swamp',
    'ardougne_marketplace',
    'ice_dungeon',
    'goblin_village'
  ];
  const combatLocations = mockLocations.filter((l: import('../../types/game').Location) => combatAreas.includes(l.id));

  const handleCombatClick = useCallback(() => {
    console.log('handleCombatClick called');
    setCombatSelectionActive(true);
    setSelectedCombatArea(null);
    setSelectedMonster(null);
    console.log('isCombatSelectionActive set to true');
  }, []);

  const renderCombatAreaSelector = () => (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">Select a Combat Area</Text>
      <VStack spacing={8} align="center" justify="center">
        {/* World Section */}
        <Box w="100%" maxW="600px" mx="auto">
          <Text fontSize="xl" fontWeight="semibold" mb={2} textAlign="center">World</Text>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={24} justifyItems="center">
            {combatLocations.filter(l => l.group === 'World').map((location: import('../../types/game').Location) => (
              <Box
                key={location.id}
                as="button"
                onClick={() => {
                  setSelectedCombatArea(location.id);
                  setLocation(location);
                  const firstCombatAction = location.actions?.find((action: any) => action.type === 'combat' && 'monster' in action) as import('../../types/game').CombatAction | undefined;
                  if (firstCombatAction && firstCombatAction.monster) {
                    setSelectedMonster(firstCombatAction.monster);
                  } else {
                    setSelectedMonster(null);
                  }
                }}
                w="170px"
                h="180px"
                bg="whiteAlpha.100"
                borderWidth="2px"
                borderColor="red.400"
                borderRadius="xl"
                boxShadow="lg"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start"
                p={4}
                transition="all 0.2s"
                _hover={{
                  boxShadow: 'xl',
                  borderColor: 'red.500',
                  transform: 'translateY(-4px) scale(1.04)',
                  bg: 'red.50',
                }}
                cursor="pointer"
                textAlign="center"
              >
                <Box boxSize="48px" mb={2}>
                  <img src="/assets/locations/placeholder.png" alt="Location" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                </Box>
                <Text fontWeight="bold" fontSize="md" color="red.700" mb={1}>{location.name}</Text>
                <Text fontSize="sm" color="gray.600" noOfLines={3}>{location.description}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
        {/* Dungeons Section */}
        <Box w="100%" maxW="600px" mx="auto">
          <Text fontSize="xl" fontWeight="semibold" mb={2} textAlign="center">Dungeons</Text>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={24} justifyItems="center">
            {combatLocations.filter(l => l.group === 'Dungeons').map((location: import('../../types/game').Location) => (
              <Box
                key={location.id}
                as="button"
                onClick={() => {
                  setSelectedCombatArea(location.id);
                  setLocation(location);
                  const firstCombatAction = location.actions?.find((action: any) => action.type === 'combat' && 'monster' in action) as import('../../types/game').CombatAction | undefined;
                  if (firstCombatAction && firstCombatAction.monster) {
                    setSelectedMonster(firstCombatAction.monster);
                  } else {
                    setSelectedMonster(null);
                  }
                }}
                w="170px"
                h="180px"
                bg="whiteAlpha.100"
                borderWidth="2px"
                borderColor="purple.400"
                borderRadius="xl"
                boxShadow="lg"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start"
                p={4}
                transition="all 0.2s"
                _hover={{
                  boxShadow: 'xl',
                  borderColor: 'purple.500',
                  transform: 'translateY(-4px) scale(1.04)',
                  bg: 'purple.50',
                }}
                cursor="pointer"
                textAlign="center"
              >
                <Box boxSize="48px" mb={2}>
                  <img src="/assets/locations/placeholder.png" alt="Location" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                </Box>
                <Text fontWeight="bold" fontSize="md" color="purple.700" mb={1}>{location.name}</Text>
                <Text fontSize="sm" color="gray.600" noOfLines={3}>{location.description}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
        {/* Raids Section */}
        <Box w="100%" maxW="600px" mx="auto">
          <Text fontSize="xl" fontWeight="semibold" mb={2} textAlign="center">Raids</Text>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={24} justifyItems="center">
            {combatLocations.filter(l => l.group === 'Raids').map((location: import('../../types/game').Location) => (
              <Box
                key={location.id}
                as="button"
                onClick={() => {
                  setSelectedCombatArea(location.id);
                  setLocation(location);
                  const firstCombatAction = location.actions?.find((action: any) => action.type === 'combat' && 'monster' in action) as import('../../types/game').CombatAction | undefined;
                  if (firstCombatAction && firstCombatAction.monster) {
                    setSelectedMonster(firstCombatAction.monster);
                  } else {
                    setSelectedMonster(null);
                  }
                }}
                w="170px"
                h="180px"
                bg="whiteAlpha.100"
                borderWidth="2px"
                borderColor="orange.400"
                borderRadius="xl"
                boxShadow="lg"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start"
                p={4}
                transition="all 0.2s"
                _hover={{
                  boxShadow: 'xl',
                  borderColor: 'orange.500',
                  transform: 'translateY(-4px) scale(1.04)',
                  bg: 'orange.50',
                }}
                cursor="pointer"
                textAlign="center"
              >
                <Box boxSize="48px" mb={2}>
                  <img src="/assets/locations/placeholder.png" alt="Location" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                </Box>
                <Text fontWeight="bold" fontSize="md" color="orange.700" mb={1}>{location.name}</Text>
                <Text fontSize="sm" color="gray.600" noOfLines={3}>{location.description}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );

  const renderMonsterSelector = (location: import('../../types/game').Location) => (
    <Box p={6}>
      <Button mb={4} colorScheme="gray" onClick={() => {
        setSelectedCombatArea(null);
        setSelectedMonster(null);
      }}>Back to Area List</Button>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Select a Monster</Text>
      <VStack spacing={4} align="stretch">
        {location.actions
          .filter((action: any) => action.type === 'combat' && 'monster' in action)
          .map((action: any) => (
            <Button
              key={action.id}
              variant="outline"
              colorScheme="red"
              onClick={() => setSelectedMonster(action.monster)}
              w="100%"
              justifyContent="flex-start"
            >
              <Box mr={3} as="span" display="inline-block" minW="32px">
                {/* Optionally add an icon or image here */}
              </Box>
              <Text fontWeight="bold">{action.monster.name}</Text>
              <Text fontSize="sm" color="gray.500" ml={2}>Level {action.monster.level}</Text>
            </Button>
          ))}
      </VStack>
    </Box>
  );

  // Find the selected combat location
  const selectedCombatLocation = selectedCombatArea
    ? combatLocations.find((l: import('../../types/game').Location) => l.id === selectedCombatArea)
    : undefined;

  const handleSignOut = () => {
    signOut();
    navigate('/select');
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // ESC key to stop current action
      if (event.key === 'Escape') {
        stopAction();
      }
      // Space bar to toggle footer
      if (event.key === ' ' && !event.repeat && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        event.preventDefault();
        toggleFooter();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stopAction, toggleFooter]);

  useEffect(() => {
    // If the current location is not a combat area, clear combat state
    if (!currentLocation?.id || !combatAreas.includes(currentLocation.id)) {
      setSelectedMonster(null);
      setSelectedCombatArea(null);
      setCombatSelectionActive(false);
    }
  }, [currentLocation]);

  const statsDisclosure = useDisclosure();

  // Helper: Aggregate statistics from locations
  const gatheringSkills = ['woodcutting', 'fishing', 'mining', 'farming'];
  const processingSkills = ['smithing', 'fletching', 'crafting', 'herblore', 'prayer', 'runecrafting', 'cooking'];
  // Aggregate resources gathered
  const resourcesGathered: Record<string, number> = {};
  const actionsCompleted: Record<string, number> = {};
  const monstersDefeated: Record<string, number> = {};
  Object.values(locations).forEach(loc => {
    if (loc.progress) {
      Object.entries(loc.progress.resourcesGathered || {}).forEach(([itemId, count]) => {
        resourcesGathered[itemId] = (resourcesGathered[itemId] || 0) + count;
      });
      Object.entries(loc.progress.actionsCompleted || {}).forEach(([actionId, count]) => {
        actionsCompleted[actionId] = (actionsCompleted[actionId] || 0) + count;
      });
      Object.entries(loc.progress.monstersDefeated || {}).forEach(([monsterId, count]) => {
        monstersDefeated[monsterId] = (monstersDefeated[monsterId] || 0) + count;
      });
    }
  });
  // For actions, just show actionId for now (could be improved)

  return (
    <Flex direction="column" h="100vh" w="100vw" overflow="hidden" role="application" aria-label="Game interface">
      {/* Header with Account Menu */}
      <Flex
        as="header"
        w="100%"
        h="60px"
        bg="gray.800"
        borderBottom="1px"
        borderColor="gray.700"
        px={4}
        align="center"
        justify="space-between"
        role="banner"
      >
        {/* Empty flex for spacing */}
        <Box flex="1" />
        {/* Centered Title */}
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="white"
          textAlign="center"
          flex="1"
        >
          Medidle
        </Text>

        {/* Account Menu + Statistics Button */}
        <Flex flex="1" justify="flex-end" align="center">
          <Button
            leftIcon={<FaChartBar />}
            colorScheme="purple"
            variant="ghost"
            size="sm"
            onClick={statsDisclosure.onOpen}
            aria-label="Show statistics"
            mr={2}
          >
            Statistics
          </Button>
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              colorScheme="blue"
              leftIcon={<Avatar size="sm" name={character?.name} />}
              rightIcon={<ChevronDownIcon />}
              aria-label="Account menu"
              _hover={{ bg: 'whiteAlpha.200' }}
              _active={{ bg: 'whiteAlpha.300' }}
            >
              {character?.name}
            </MenuButton>
            <MenuList>
              <MenuItem 
                onClick={() => navigate('/select')} 
                aria-label="Switch character"
                icon={<Icon as={FaUserFriends} />}
              >
                Switch Character
              </MenuItem>
              <MenuItem 
                onClick={() => {}} 
                aria-label="Account settings"
                icon={<Icon as={FaCog} />}
              >
                Account Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem 
                onClick={handleSignOut} 
                aria-label="Sign out"
                icon={<Icon as={FaSignOutAlt} />}
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Main Game Area */}
      <Box flex="1" overflow="auto" role="main">
        {/* Render combat area/monster selector or combat card if active, else Outlet */}
        {selectedMonster && selectedCombatLocation && currentLocation?.id && combatAreas.includes(currentLocation.id)
          ? <CombatLocation location={selectedCombatLocation} monsterOverride={selectedMonster} onBack={() => {
              setSelectedMonster(null);
              setSelectedCombatArea(null);
              setCombatSelectionActive(true);
            }} />
          : isCombatSelectionActive
            ? renderCombatAreaSelector()
            : <Outlet />
        }
        {/* Statistics Modal */}
        <Modal isOpen={statsDisclosure.isOpen} onClose={statsDisclosure.onClose} size="3xl" isCentered>
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent bg="gray.800" color="white">
            <ModalHeader>Character Statistics</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Tabs colorScheme="purple" variant="enclosed" isFitted>
                <TabList>
                  <Tab>General</Tab>
                  <Tab>Gathering</Tab>
                  <Tab>Processing</Tab>
                  <Tab>Combat</Tab>
                </TabList>
                <TabPanels>
                  {/* General Tab */}
                  <TabPanel>
                    <VStack align="start" spacing={3}>
                      <Box>
                        <Text fontWeight="bold">Character Created:</Text>
                        <Text>{character?.lastLogin ? new Date(character.lastLogin).toLocaleDateString() : 'Unknown'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Last Login:</Text>
                        <Text>{character?.lastLogin ? new Date(character.lastLogin).toLocaleString() : 'Unknown'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Total Active Time:</Text>
                        <Text>{character?.stats?.totalActiveTime ? `${Math.floor(character.stats.totalActiveTime / 1000 / 60)} minutes` : 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Total Offline Time:</Text>
                        <Text>{character?.stats?.totalOfflineTime ? `${Math.floor(character.stats.totalOfflineTime / 1000 / 60)} minutes` : 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Total Coins Gathered:</Text>
                        <Text>{Object.values(locations).reduce((sum, loc) => {
                          if (loc.progress && loc.progress.resourcesGathered && loc.progress.resourcesGathered['coins']) {
                            return sum + loc.progress.resourcesGathered['coins'];
                          }
                          return sum;
                        }, 0)}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Total Coins Spent:</Text>
                        <Text>N/A</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Highest Skill Level:</Text>
                        <Text>{character?.skills ? Math.max(...Object.values(character.skills).map(s => s.level)) : 1}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Combat Level:</Text>
                        <Text>{character?.combatLevel ?? 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Total Slayer Points Earned:</Text>
                        <Text>{character?.slayerPoints ?? 0}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Total Slayer Points Spent:</Text>
                        <Text>N/A</Text>
                      </Box>
                      {/* Favourite Activity */}
                      <Box>
                        <Text fontWeight="bold">Favourite Activity:</Text>
                        <Text>{(() => {
                          // Find the highest among resources gathered, actions completed, monsters defeated
                          const resourceMax = Object.entries(resourcesGathered).reduce((max, [id, count]) => count > max.count ? { name: getItemById(id)?.name || id, count } : max, { name: '', count: 0 });
                          const actionMax = Object.entries(actionsCompleted).reduce((max, [id, count]) => count > max.count ? { name: (mockLocations.flatMap(loc => loc.actions || []).find(a => a.id === id)?.name || id), count } : max, { name: '', count: 0 });
                          const monsterMax = Object.entries(monstersDefeated).reduce((max, [id, count]) => count > max.count ? { name: (mockMonsters.find(m => m.id === id)?.name || id), count } : max, { name: '', count: 0 });
                          const all = [
                            { label: 'Resource Gathered', ...resourceMax },
                            { label: 'Action Performed', ...actionMax },
                            { label: 'Monster Slayed', ...monsterMax },
                          ];
                          const fav = all.reduce((max, curr) => curr.count > max.count ? curr : max, { label: '', name: '', count: 0 });
                          return fav.count > 0 ? `${fav.label}: ${fav.name} (${fav.count})` : 'N/A';
                        })()}</Text>
                      </Box>
                    </VStack>
                  </TabPanel>
                  {/* Gathering Tab */}
                  <TabPanel>
                    <StatGroup>
                      <Stat>
                        <StatLabel>Total Resources Gathered</StatLabel>
                        <StatNumber>{[
                          // Woodcutting
                          'logs', 'oak_logs', 'willow_logs', 'maple_logs', 'teak_logs', 'mahogany_logs', 'yew_logs', 'magic_logs', 'redwood_logs',
                          // Fishing
                          'raw_shrimp', 'raw_anchovy', 'raw_trout', 'raw_herring', 'raw_pike', 'raw_salmon', 'raw_tuna', 'raw_lobster', 'raw_bass', 'raw_swordfish', 'raw_monkfish', 'raw_shark', 'raw_anglerfish', 'raw_dark_crab',
                          // Mining
                          'copper_ore', 'tin_ore', 'iron_ore', 'silver_ore', 'gold_ore', 'mithril_ore', 'adamantite_ore', 'runite_ore', 'amethyst', 'coal', 'pure_essence',
                          // Farming (add farming resource IDs here when available)
                        ].reduce((sum, itemId) => sum + (resourcesGathered[itemId] || 0), 0)}</StatNumber>
                      </Stat>
                    </StatGroup>
                    <Divider my={4} />
                    <Box color="gray.400">
                      {/* Woodcutting Section */}
                      <Text fontSize="lg" fontWeight="bold" mt={2} mb={1} color="green.200">Woodcutting</Text>
                      <VStack align="start" spacing={1} mb={2}>
                        {[
                          'logs', 'oak_logs', 'willow_logs', 'maple_logs', 'teak_logs', 'mahogany_logs', 'yew_logs', 'magic_logs', 'redwood_logs'
                        ].map(itemId => {
                          const item = getItemById(itemId);
                          const count = resourcesGathered[itemId] || 0;
                          return (
                            <Text key={itemId}>{item ? item.name : itemId}: {count}</Text>
                          );
                        })}
                      </VStack>
                      {/* Fishing Section */}
                      <Text fontSize="lg" fontWeight="bold" mt={4} mb={1} color="blue.200">Fishing</Text>
                      <VStack align="start" spacing={1} mb={2}>
                        {[
                          'raw_shrimp', 'raw_anchovy', 'raw_trout', 'raw_herring', 'raw_pike', 'raw_salmon', 'raw_tuna', 'raw_lobster', 'raw_bass', 'raw_swordfish', 'raw_monkfish', 'raw_shark', 'raw_anglerfish', 'raw_dark_crab'
                        ].map(itemId => {
                          const item = getItemById(itemId);
                          const count = resourcesGathered[itemId] || 0;
                          return (
                            <Text key={itemId}>{item ? item.name : itemId}: {count}</Text>
                          );
                        })}
                      </VStack>
                      {/* Mining Section */}
                      <Text fontSize="lg" fontWeight="bold" mt={4} mb={1} color="yellow.200">Mining</Text>
                      <VStack align="start" spacing={1} mb={2}>
                        {[
                          'copper_ore', 'tin_ore', 'iron_ore', 'silver_ore', 'gold_ore', 'mithril_ore', 'adamantite_ore', 'runite_ore', 'amethyst', 'coal', 'pure_essence'
                        ].map(itemId => {
                          const item = getItemById(itemId);
                          const count = resourcesGathered[itemId] || 0;
                          return (
                            <Text key={itemId}>{item ? item.name : itemId}: {count}</Text>
                          );
                        })}
                      </VStack>
                      {/* Farming Section */}
                      <Text fontSize="lg" fontWeight="bold" mt={4} mb={1} color="lime.200">Farming</Text>
                      <VStack align="start" spacing={1} mb={2}>
                        <Text color="gray.500">No farming resources tracked yet.</Text>
                      </VStack>
                    </Box>
                  </TabPanel>
                  {/* Processing Tab */}
                  <TabPanel>
                    <StatGroup>
                      <Stat>
                        <StatLabel>Total Items Processed</StatLabel>
                        <StatNumber>{Object.entries(actionsCompleted).reduce((acc, [actionId, count]) => {
                          // Use mockLocations to get all actions
                          const action = mockLocations.flatMap(loc => loc.actions || []).find(a => a && a.id === actionId);
                          if (action && [
                            'cooking', 'smithing', 'firemaking', 'herblore', 'crafting', 'fletching', 'prayer'
                          ].includes(action.skill)) {
                            return acc + count;
                          }
                          return acc;
                        }, 0)}</StatNumber>
                      </Stat>
                    </StatGroup>
                    <Divider my={4} />
                    <Box color="gray.400">
                      {/* For each processing skill, show processed items and their counts */}
                      {[
                        { skill: 'cooking', label: 'Cooking', color: 'orange.200' },
                        { skill: 'smithing', label: 'Smithing', color: 'yellow.300' },
                        { skill: 'firemaking', label: 'Firemaking', color: 'red.200' },
                        { skill: 'herblore', label: 'Herblore', color: 'green.300' },
                        { skill: 'crafting', label: 'Crafting', color: 'purple.200' },
                        { skill: 'fletching', label: 'Fletching', color: 'teal.200' },
                        { skill: 'prayer', label: 'Prayer', color: 'blue.200' },
                      ].map(({ skill, label, color }) => {
                        // Use mockLocations to get all actions for this skill
                        const actionsForSkill = mockLocations.flatMap(loc => loc.actions || []).filter(a => a && a.skill === skill);
                        // Map itemReward.id to count
                        const itemCounts: Record<string, number> = {};
                        actionsForSkill.forEach(a => {
                          if (a.itemReward && a.itemReward.id && actionsCompleted[a.id]) {
                            itemCounts[a.itemReward.id] = (itemCounts[a.itemReward.id] || 0) + actionsCompleted[a.id];
                          }
                        });
                        return (
                          <Box key={skill} mb={2}>
                            <Text fontSize="lg" fontWeight="bold" mt={4} mb={1} color={color}>{label}</Text>
                            <VStack align="start" spacing={1}>
                              {Object.keys(itemCounts).length > 0 ? (
                                Object.entries(itemCounts).map(([itemId, count]) => {
                                  const item = getItemById(itemId);
                                  return (
                                    <Text key={itemId}>{item ? item.name : itemId}: {count}</Text>
                                  );
                                })
                              ) : (
                                <Text color="gray.500">No items processed yet.</Text>
                              )}
                            </VStack>
                          </Box>
                        );
                      })}
                    </Box>
                  </TabPanel>
                  {/* Combat Tab */}
                  <TabPanel>
                    <VStack align="start" spacing={3}>
                      <Box>
                        <Text fontWeight="bold">Total Deaths:</Text>
                        <Text>{character?.stats?.deaths ?? 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Food Eaten:</Text>
                        <Text>{character?.stats?.foodEaten ?? 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Hitpoints Gained:</Text>
                        <Text>{character?.stats?.hitpointsGained ?? 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Total Damage Done:</Text>
                        <Text>{character?.stats?.damageDone ?? 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Total Damage Taken:</Text>
                        <Text>{character?.stats?.damageTaken ?? 'N/A'}</Text>
                      </Box>
                      <Divider my={4} />
                      <Box>
                        <Text fontWeight="bold" mb={1}>Monsters Defeated:</Text>
                        {Object.keys(monstersDefeated).length === 0 ? (
                          <Text>No monsters slayed yet.</Text>
                        ) : (
                          <VStack align="start" spacing={1}>
                            {Object.entries(monstersDefeated).map(([monsterId, count]) => {
                              const monster = mockMonsters.find((m: any) => m.id === monsterId);
                              return (
                                <Text key={monsterId}>{monster ? monster.name : monsterId}: {count}</Text>
                              );
                            })}
                          </VStack>
                        )}
                      </Box>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>

      {/* Footer */}
      <Box
        position="relative"
        h={isFooterExpanded ? "600px" : "60px"}
        minH={isFooterExpanded ? "600px" : "60px"}
        transition="height 0.3s ease-in-out"
        role="complementary"
        aria-label="Game information panel"
      >
        <IconButton
          aria-label={isFooterExpanded ? "Collapse footer" : "Expand footer"}
          icon={isFooterExpanded ? <ChevronDownIcon boxSize={5} /> : <ChevronUpIcon boxSize={5} />}
          position="absolute"
          top="-24px"
          left="50%"
          transform="translate(-50%, 0)"
          zIndex={2}
          onClick={toggleFooter}
          w="48px"
          h="48px"
          minW="48px"
          minH="48px"
          p="0"
          colorScheme="blue"
          borderRadius="50%"
          boxShadow="0 0 10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(66, 153, 225, 0.3)"
          bg="blue.500"
          border="2px solid"
          borderColor="blue.200"
          sx={{
            '&:hover': {
              bg: 'var(--chakra-colors-blue-400)',
              boxShadow: '0 0 15px rgba(0, 0, 0, 0.4), 0 0 30px rgba(66, 153, 225, 0.4)',
              transform: 'translate(-50%, 0) scale(1.1)',
            },
            '&:active': {
              bg: 'var(--chakra-colors-blue-600)',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(66, 153, 225, 0.2)',
              transform: 'translate(-50%, 0) scale(0.95)',
            }
          }}
          transition="all 0.2s"
        />
        <Footer onCombatClick={handleCombatClick} />
      </Box>
    </Flex>
  );
}; 