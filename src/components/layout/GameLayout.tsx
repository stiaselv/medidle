import { Box, Flex, useBreakpointValue, Button, Menu, MenuButton, MenuList, MenuItem, Avatar, Text, VStack, SimpleGrid, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Tabs, TabList, TabPanels, Tab, TabPanel, Stat, StatLabel, StatNumber, StatGroup, Divider, Icon, MenuDivider } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { FaCog, FaSignOutAlt, FaUserFriends, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { useUIStore } from '../../store/uiStore';
import { Footer } from './Footer';
import { getItemsByCategory } from '../../data/items';
import debounce from 'lodash.debounce';
import type { Character } from '../../types/game';
import { SettingsModal } from '../settings/SettingsModal';
import { useTheme } from '../../contexts/ThemeContext';

export const GameLayout = ({ children }: { children: React.ReactNode }) => {
  const { character, signOut, stopAction, saveCharacter } = useGameStore();
  const { isFooterExpanded, toggleFooter } = useUIStore();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const navigate = useNavigate();
  const locations = useGameStore(state => state.locations);
  const { theme } = useTheme();


  // Debounced auto-save logic
  const prevCharacterRef = useRef<Character | null>(null);
  const debouncedSave = useRef(
    debounce((char: Character) => {
      console.log('Auto-saving character:', char);
      saveCharacter(char);
    }, 500)
  );

  useEffect(() => {
    if (!character) return;
    if (prevCharacterRef.current !== character) {
      console.log('Character changed, scheduling save:', character);
      debouncedSave.current(character);
      prevCharacterRef.current = character;
    }
  }, [character]);

  // Cleanup: flush any pending saves on unmount
  useEffect(() => {
    return () => {
      debouncedSave.current.flush?.();
    };
  }, []);

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

  // Helper to safely get stat values with fallback to 0
  const getSafeStat = (statName: keyof Character['stats']): number => {
    return character?.stats?.[statName] as number || 0;
  };

  // Helper to get resource stats from character's resourcesGathered
  const getResourceStats = (resourceIds: string[]) => {
    const stats: Record<string, number> = {};
    if (character?.stats?.resourcesGathered) {
      for (const id of resourceIds) {
        const count = character.stats.resourcesGathered[id];
        if (count && typeof count === 'number') {
          stats[id] = count;
        }
      }
    }
    return stats;
  };

  // Define resource groups by skill
  const woodcuttingLogs = getItemsByCategory('Resources').filter(item => item.name.toLowerCase().includes('log'));
  const miningOres = getItemsByCategory('Resources').filter(item => item.name.toLowerCase().includes('ore'));
  const fishingFish = getItemsByCategory('Resources').filter(item => item.name.toLowerCase().includes('raw') || item.name.toLowerCase().includes('fish'));
  const firemakingLogs = woodcuttingLogs; // Same logs as woodcutting
  const smithingBars = getItemsByCategory('Resources').filter(item => item.name.toLowerCase().includes('bar'));
  const cookingRaw = fishingFish; // For simplicity, use fish for cooking too

  // Get stats from character
  const logsStats = getResourceStats(woodcuttingLogs.map(i => i.id));
  const oresStats = getResourceStats(miningOres.map(i => i.id));
  const fishStats = getResourceStats(fishingFish.map(i => i.id));
  const barsStats = getResourceStats(smithingBars.map(i => i.id));
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
        className={theme === 'medieval' ? 'medieval-wood' : ''}
      >
        <Flex align="center">
          <Button onClick={onOpen} leftIcon={<Icon as={FaChartBar} />} colorScheme="blue" size="sm" mr={4}>
            Stats
          </Button>
          <Button
            colorScheme="green"
            size="sm"
            onClick={() => character && saveCharacter(character)}
            ml={2}
            isDisabled={!character}
          >
            Force Save to Cloud
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
            <MenuItem icon={<Icon as={FaCog} />} onClick={onSettingsOpen} bg="gray.700" _hover={{ bg: 'gray.600' }}>
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
                      <StatNumber>{(getSafeStat('totalActiveTime') / 3600000).toFixed(2)} hrs</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Total Offline Time</StatLabel>
                      <StatNumber>{(getSafeStat('totalOfflineTime') / 3600000).toFixed(2)} hrs</StatNumber>
                    </Stat>
                  </StatGroup>
                  <Divider my={4} />
                  <StatGroup>
                    <Stat>
                      <StatLabel>Coins Earned</StatLabel>
                      <StatNumber>{getSafeStat('coinsEarned').toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Coins Spent</StatLabel>
                      <StatNumber>{getSafeStat('coinsSpent').toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <Divider my={4} />
                  <StatGroup>
                    <Stat>
                      <StatLabel>Slayer Points Earned</StatLabel>
                      <StatNumber>{getSafeStat('slayerPointsEarned').toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Slayer Points Spent</StatLabel>
                      <StatNumber>{getSafeStat('slayerPointsSpent').toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                </TabPanel>
                <TabPanel>
                  <StatGroup mb={4}>
                    <Stat>
                      <StatLabel>Logs Chopped</StatLabel>
                      <StatNumber>{getSafeStat('logsChopped').toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Ores Mined</StatLabel>
                      <StatNumber>{getSafeStat('oresMined').toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <StatGroup mb={4}>
                    <Stat>
                      <StatLabel>Fish Caught</StatLabel>
                      <StatNumber>{getSafeStat('fishCaught').toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Crops Harvested</StatLabel>
                      <StatNumber>{getSafeStat('cropsHarvested').toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <Divider my={4} />
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
                  <StatGroup mb={4}>
                    <Stat>
                      <StatLabel>Items Crafted</StatLabel>
                      <StatNumber>{getSafeStat('itemsCrafted').toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Arrows Fletched</StatLabel>
                      <StatNumber>{getSafeStat('arrowsFletched').toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <StatGroup mb={4}>
                    <Stat>
                      <StatLabel>Bars Smelted</StatLabel>
                      <StatNumber>{getSafeStat('barsSmelted').toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Food Cooked</StatLabel>
                      <StatNumber>{getSafeStat('foodCooked').toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <StatGroup mb={4}>
                    <Stat>
                      <StatLabel>Logs Burned</StatLabel>
                      <StatNumber>{getSafeStat('logsBurned').toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Bones Buried</StatLabel>
                      <StatNumber>{getSafeStat('bonesBuried').toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <StatGroup mb={4}>
                    <Stat>
                      <StatLabel>Runes Crafted</StatLabel>
                      <StatNumber>{getSafeStat('runesCrafted').toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <Divider my={4} />
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
                      <StatNumber>{getSafeStat('damageDone').toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Damage Taken</StatLabel>
                      <StatNumber>{getSafeStat('damageTaken').toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <Divider my={4} />
                  <StatGroup>
                    <Stat>
                      <StatLabel>Deaths</StatLabel>
                      <StatNumber>{getSafeStat('deaths')}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Food Eaten</StatLabel>
                      <StatNumber>{getSafeStat('foodEaten').toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <Divider my={4} />
                  <StatGroup>
                    <Stat>
                      <StatLabel>HP Gained</StatLabel>
                      <StatNumber>{getSafeStat('hitpointsGained').toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Slayer Points Earned</StatLabel>
                      <StatNumber>{getSafeStat('slayerPointsEarned').toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={onSettingsClose} />
    </Box>
  );
}; 