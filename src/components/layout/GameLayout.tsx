import { Box, Flex, useBreakpointValue, Button, Menu, MenuButton, MenuList, MenuItem, Avatar, Text, VStack, SimpleGrid, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Tabs, TabList, TabPanels, Tab, TabPanel, Stat, StatLabel, StatNumber, StatGroup, Divider, Icon, MenuDivider } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { FaCog, FaSignOutAlt, FaUserFriends, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { useUIStore } from '../../store/uiStore';
import { Footer } from './Footer';
import { getItemsByCategory } from '../../data/items';

export const GameLayout = ({ children }: { children: React.ReactNode }) => {
  const { character, signOut, stopAction } = useGameStore();
  const { isFooterExpanded, toggleFooter } = useUIStore();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const locations = useGameStore(state => state.locations);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const handleSwitchCharacter = () => {
    signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        stopAction();
      }
      if (event.key.toLowerCase() === 'f') {
        toggleFooter();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stopAction, isFooterExpanded, toggleFooter]);

  // Helper to aggregate per-resource stats
  const aggregateResourceStats = (resourceIds: string[]) => {
    let total: Record<string, number> = {};
    Object.values(locations).forEach(loc => {
      if (loc && loc.progress && loc.progress.resourcesGathered) {
        for (const id of resourceIds) {
          if (loc.progress.resourcesGathered[id]) {
            total[id] = (total[id] || 0) + loc.progress.resourcesGathered[id];
          }
        }
      }
    });
    return total;
  };

  // Define resource groups by skill
  const woodcuttingLogs = getItemsByCategory('Resources').filter(item => item.name.toLowerCase().includes('log'));
  const miningOres = getItemsByCategory('Resources').filter(item => item.name.toLowerCase().includes('ore'));
  const fishingFish = getItemsByCategory('Resources').filter(item => item.name.toLowerCase().includes('raw') || item.name.toLowerCase().includes('fish'));
  const firemakingLogs = woodcuttingLogs; // Same logs as woodcutting
  const smithingBars = getItemsByCategory('Resources').filter(item => item.name.toLowerCase().includes('bar'));
  const cookingRaw = fishingFish; // For simplicity, use fish for cooking too

  // Aggregate stats
  const logsStats = aggregateResourceStats(woodcuttingLogs.map(i => i.id));
  const oresStats = aggregateResourceStats(miningOres.map(i => i.id));
  const fishStats = aggregateResourceStats(fishingFish.map(i => i.id));
  const barsStats = aggregateResourceStats(smithingBars.map(i => i.id));
  // ... add more as needed

  if (!character) {
    return <Box>Loading character...</Box>;
  }

  return (
    <Box 
      bg="gray.800" 
      color="white" 
      minH="100vh" 
      display="flex" 
      flexDirection="column"
      width="100vw"
    >
      <Flex as="main" flex="1" overflow="hidden" pt={16} p={8} pb={isFooterExpanded ? (isMobile ? "200px" : "150px") : "60px"}>
        {children}
      </Flex>

      <Box
        as="header"
        position="fixed"
        top="0"
        left="0"
        right="0"
        bg="rgba(26, 32, 44, 0.9)"
        backdropFilter="blur(10px)"
        zIndex="sticky"
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom="1px"
        borderColor="gray.700"
      >
        <Flex align="center">
          <Button onClick={onOpen} leftIcon={<Icon as={FaChartBar} />} colorScheme="blue" size="sm" mr={4}>
            Stats
          </Button>
        </Flex>
        
        <Menu>
          <MenuButton as={Button} variant="ghost" _hover={{ bg: 'gray.600' }} p={2}>
            <Flex align="center">
              <Avatar size="sm" name={character.name} mr={2} />
              <VStack align="flex-start" spacing={0}>
                <Text fontSize="md" fontWeight="bold">{character.name}</Text>
                <Text fontSize="xs" color="gray.400">Level: {character.combatLevel}</Text>
              </VStack>
            </Flex>
          </MenuButton>
          <MenuList bg="gray.700" borderColor="gray.600">
            <MenuItem icon={<Icon as={FaUserFriends} />} onClick={handleSwitchCharacter} bg="gray.700" _hover={{ bg: 'gray.600' }}>
              Switch Character
            </MenuItem>
            <MenuItem icon={<Icon as={FaCog} />} bg="gray.700" _hover={{ bg: 'gray.600' }}>
              Settings
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<Icon as={FaSignOutAlt} />} onClick={handleSignOut} bg="gray.700" _hover={{ bg: 'gray.600' }}>
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Footer onCombatClick={() => { /* Placeholder */ }} />

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Character Statistics</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList>
                <Tab>General</Tab>
                <Tab>Gathering</Tab>
                <Tab>Processing</Tab>
                <Tab>Combat</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <StatGroup>
                    <Stat>
                      <StatLabel>Total Active Time</StatLabel>
                      <StatNumber>{(character.stats.totalActiveTime / 3600000).toFixed(2)} hrs</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Total Offline Time</StatLabel>
                      <StatNumber>{(character.stats.totalOfflineTime / 3600000).toFixed(2)} hrs</StatNumber>
                    </Stat>
                  </StatGroup>
                  <Divider my={4} />
                  <StatGroup>
                    <Stat>
                      <StatLabel>Coins Earned</StatLabel>
                      <StatNumber>{character.stats.coinsEarned.toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Coins Spent</StatLabel>
                      <StatNumber>{character.stats.coinsSpent.toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <Divider my={4} />
                  <StatGroup>
                    <Stat>
                      <StatLabel>Slayer Points Earned</StatLabel>
                      <StatNumber>{character.stats.slayerPointsEarned.toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Slayer Points Spent</StatLabel>
                      <StatNumber>{character.stats.slayerPointsSpent.toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                </TabPanel>
                <TabPanel>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Woodcutting</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {woodcuttingLogs.map(log => (
                        <Text key={log.id}>{log.name}: {logsStats[log.id] || 0}</Text>
                      ))}
                    </VStack>
                  </Box>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Mining</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {miningOres.map(ore => (
                        <Text key={ore.id}>{ore.name}: {oresStats[ore.id] || 0}</Text>
                      ))}
                    </VStack>
                  </Box>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Fishing</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {fishingFish.map(fish => (
                        <Text key={fish.id}>{fish.name}: {fishStats[fish.id] || 0}</Text>
                      ))}
                    </VStack>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Smithing</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {smithingBars.map(bar => (
                        <Text key={bar.id}>{bar.name}: {barsStats[bar.id] || 0}</Text>
                      ))}
                    </VStack>
                  </Box>
                  {/* Add similar sections for Cooking, Firemaking, etc. as needed */}
                </TabPanel>
                <TabPanel>
                  <StatGroup>
                    <Stat>
                      <StatLabel>Damage Done</StatLabel>
                      <StatNumber>{character.stats.damageDone.toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Damage Taken</StatLabel>
                      <StatNumber>{character.stats.damageTaken.toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <Divider my={4} />
                  <StatGroup>
                    <Stat>
                      <StatLabel>Deaths</StatLabel>
                      <StatNumber>{character.stats.deaths}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Food Eaten</StatLabel>
                      <StatNumber>{character.stats.foodEaten.toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <Divider my={4} />
                  <StatGroup>
                    <Stat>
                      <StatLabel>HP Gained</StatLabel>
                      <StatNumber>{character.stats.hitpointsGained.toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Slayer Points Earned</StatLabel>
                      <StatNumber>{character.stats.slayerPointsEarned.toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}; 