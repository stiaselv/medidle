import { Box, Flex, useBreakpointValue, Button, Menu, MenuButton, MenuList, MenuItem, Avatar, Text, VStack, SimpleGrid, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Tabs, TabList, TabPanels, Tab, TabPanel, Stat, StatLabel, StatNumber, StatGroup, Divider, Icon, MenuDivider, Badge } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { FaCog, FaSignOutAlt, FaUserFriends, FaChartBar, FaTrophy, FaScroll, FaMedal } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { useUIStore } from '../../store/uiStore';
import { Footer } from './Footer';
import { getItemsByCategory } from '../../data/items';
import debounce from 'lodash.debounce';
import type { Character } from '../../types/game';
import { SettingsModal } from '../settings/SettingsModal';
import { useTheme } from '../../contexts/ThemeContext';
import { useOfflineTracking } from '../../hooks/useOfflineTracking';
import { OfflineTestHelper } from '../testing/OfflineTestHelper';
import { FriendsModal } from '../friends/FriendsModal';
import { HighscoresModal } from '../highscores/HighscoresModal';
import { QuestModal } from '../quests/QuestModal';
import { AchievementsModal } from '../achievements/AchievementsModal';

export const GameLayout = ({ children }: { children: React.ReactNode }) => {
  const { character, logout, stopAction, saveCharacter } = useGameStore();
  const { isFooterExpanded, toggleFooter } = useUIStore();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const { isOpen: isFriendsOpen, onOpen: onFriendsOpen, onClose: onFriendsClose } = useDisclosure();
  const { isOpen: isHighscoresOpen, onOpen: onHighscoresOpen, onClose: onHighscoresClose } = useDisclosure();
  const { isOpen: isQuestsOpen, onOpen: onQuestsOpen, onClose: onQuestsClose } = useDisclosure();
  const { isOpen: isAchievementsOpen, onOpen: onAchievementsOpen, onClose: onAchievementsClose } = useDisclosure();
  const navigate = useNavigate();
  const locations = useGameStore(state => state.locations);
  const { theme } = useTheme();

  // Track offline status for offline progression
  useOfflineTracking();


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

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const handleSwitchCharacter = () => {
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
            onClick={onHighscoresOpen}
            leftIcon={<Icon as={FaTrophy} />}
            colorScheme="yellow"
            size="sm"
            mr={2}
          >
            Highscores
          </Button>
          <Button
            onClick={onQuestsOpen}
            leftIcon={<Icon as={FaScroll} />}
            colorScheme="orange"
            size="sm"
            mr={2}
            position="relative"
          >
            Quests
            {character && character.activeQuests && character.activeQuests.length > 0 && (
              <Badge
                position="absolute"
                top="-5px"
                right="-5px"
                colorScheme="blue"
                borderRadius="full"
                fontSize="xs"
              >
                {character.activeQuests.length}
              </Badge>
            )}
          </Button>
          <Button
            onClick={onAchievementsOpen}
            leftIcon={<Icon as={FaMedal} />}
            colorScheme="purple"
            size="sm"
            mr={2}
            position="relative"
          >
            Achievements
            {character && character.achievements && character.achievements.filter(a => a.isCompleted).length > 0 && (
              <Badge
                position="absolute"
                top="-5px"
                right="-5px"
                colorScheme="yellow"
                borderRadius="full"
                fontSize="xs"
              >
                {character.achievements.filter(a => a.isCompleted).length}
              </Badge>
            )}
          </Button>
          <Button
            onClick={onFriendsOpen}
            leftIcon={<Icon as={FaUserFriends} />}
            colorScheme="purple"
            size="sm"
            mr={2}
            position="relative"
          >
            Friends
            {character && character.friends && character.friends.length > 0 && (
              <Badge
                position="absolute"
                top="-5px"
                right="-5px"
                colorScheme="green"
                borderRadius="full"
                fontSize="xs"
              >
                {character.friends.length}
              </Badge>
            )}
            {character && character.friendRequests && character.friendRequests.filter(req => req.toCharacterId === character.id && req.status === 'pending').length > 0 && (
              <Badge
                position="absolute"
                top="-5px"
                left="-5px"
                colorScheme="red"
                borderRadius="full"
                fontSize="xs"
              >
                {character.friendRequests.filter(req => req.toCharacterId === character.id && req.status === 'pending').length}
              </Badge>
            )}
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
              Log out
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
                      <StatLabel>Combat Level</StatLabel>
                      <StatNumber>{getSafeStat('combatLevel')}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Favourite Action</StatLabel>
                      <StatNumber>{character?.stats?.favouriteAction || 'None'}</StatNumber>
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
                  <Divider my={4} />
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Top 5 Skills</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {character?.stats?.topSkills?.map((skill, index) => (
                        <Text key={skill.skill}>
                          {index + 1}. {skill.skill.charAt(0).toUpperCase() + skill.skill.slice(1)}: Level {skill.level}
                        </Text>
                      )) || <Text>No skills tracked yet</Text>}
                    </VStack>
                  </Box>
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
                  <StatGroup mb={4}>
                    <Stat>
                      <StatLabel>Items Pickpocketed</StatLabel>
                      <StatNumber>{getSafeStat('itemsPickpocketed').toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Agility Laps</StatLabel>
                      <StatNumber>{Object.values(character?.stats?.agilityLaps || {}).reduce((sum, count) => sum + count, 0).toLocaleString()}</StatNumber>
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
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Farming</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      <Text>Patches Planted: {Object.keys(character?.stats?.farmingPatchesPlanted || {}).length}</Text>
                      <Text>Crops Planted: {Object.values(character?.stats?.farmingCropsPlanted || {}).reduce((sum, count) => sum + count, 0)}</Text>
                      <Text>Crops Harvested: {Object.values(character?.stats?.farmingHarvests || {}).reduce((sum, count) => sum + count, 0)}</Text>
                    </VStack>
                  </Box>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Thieving</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {Object.entries(character?.stats?.thievingActions || {}).map(([actionId, count]) => (
                        <Text key={actionId}>{actionId}: {count}</Text>
                      ))}
                    </VStack>
                  </Box>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Agility</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {Object.entries(character?.stats?.agilityLaps || {}).map(([courseId, laps]) => (
                        <Text key={courseId}>{courseId}: {laps} laps</Text>
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
                      <Text>Total Smithing Actions: {Object.values(character?.stats?.smithingActions || {}).reduce((sum, count) => sum + count, 0)}</Text>
                    </VStack>
                  </Box>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Cooking</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {Object.entries(character?.stats?.cookingActions || {}).map(([foodId, count]) => (
                        <Text key={foodId}>{foodId}: {count}</Text>
                      ))}
                    </VStack>
                  </Box>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Firemaking</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {Object.entries(character?.stats?.firemakingLogs || {}).map(([logId, count]) => (
                        <Text key={logId}>{logId}: {count}</Text>
                      ))}
                    </VStack>
                  </Box>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Fletching</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      <Text>Arrows:</Text>
                      {Object.entries(character?.stats?.fletchingArrows || {}).map(([arrowId, count]) => (
                        <Text key={arrowId} ml={4}>{arrowId}: {count}</Text>
                      ))}
                      <Text>Bows (Unstrung):</Text>
                      {Object.entries(character?.stats?.fletchingBows || {}).map(([bowId, count]) => (
                        <Text key={bowId} ml={4}>{bowId}: {count}</Text>
                      ))}
                      <Text>Bows (Strung):</Text>
                      {Object.entries(character?.stats?.fletchingBowsStrung || {}).map(([bowId, count]) => (
                        <Text key={bowId} ml={4}>{bowId}: {count}</Text>
                      ))}
                      <Text>Javelins:</Text>
                      {Object.entries(character?.stats?.fletchingJavelins || {}).map(([javelinId, count]) => (
                        <Text key={javelinId} ml={4}>{javelinId}: {count}</Text>
                      ))}
                    </VStack>
                  </Box>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Crafting</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      <Text>Armor:</Text>
                      {Object.entries(character?.stats?.craftingArmor || {}).map(([armorId, count]) => (
                        <Text key={armorId} ml={4}>{armorId}: {count}</Text>
                      ))}
                      <Text>Jewelry:</Text>
                      {Object.entries(character?.stats?.craftingJewelry || {}).map(([jewelryId, count]) => (
                        <Text key={jewelryId} ml={4}>{jewelryId}: {count}</Text>
                      ))}
                      <Text>Staves:</Text>
                      {Object.entries(character?.stats?.craftingStaves || {}).map(([staffId, count]) => (
                        <Text key={staffId} ml={4}>{staffId}: {count}</Text>
                      ))}
                      <Text>Gems:</Text>
                      {Object.entries(character?.stats?.craftingGems || {}).map(([gemId, count]) => (
                        <Text key={gemId} ml={4}>{gemId}: {count}</Text>
                      ))}
                    </VStack>
                  </Box>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Herblore</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {Object.entries(character?.stats?.herblorePotions || {}).map(([potionId, count]) => (
                        <Text key={potionId}>{potionId}: {count}</Text>
                      ))}
                    </VStack>
                  </Box>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Prayer</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {Object.entries(character?.stats?.prayerBones || {}).map(([boneId, count]) => (
                        <Text key={boneId}>{boneId}: {count}</Text>
                      ))}
                    </VStack>
                  </Box>
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Runecrafting</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {Object.entries(character?.stats?.runecraftingRunes || {}).map(([runeId, count]) => (
                        <Text key={runeId}>{runeId}: {count}</Text>
                      ))}
                    </VStack>
                  </Box>
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
                  <Divider my={4} />
                  <StatGroup>
                    <Stat>
                      <StatLabel>Monsters Killed</StatLabel>
                      <StatNumber>{getSafeStat('monstersKilled').toLocaleString()}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Slayer Tasks Completed</StatLabel>
                      <StatNumber>{getSafeStat('slayerTasksCompleted').toLocaleString()}</StatNumber>
                    </Stat>
                  </StatGroup>
                  <Divider my={4} />
                  <Box mb={4}>
                    <Text fontWeight="bold" fontSize="lg">Monsters Killed</Text>
                    <VStack align="start" spacing={1} ml={4}>
                      {Object.entries(character?.stats?.monstersKilledByType || {}).map(([monsterId, count]) => (
                        <Text key={monsterId}>{monsterId}: {count}</Text>
                      ))}
                    </VStack>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={onSettingsClose} />
      <FriendsModal isOpen={isFriendsOpen} onClose={onFriendsClose} />
              <HighscoresModal isOpen={isHighscoresOpen} onClose={onHighscoresClose} />
        <QuestModal isOpen={isQuestsOpen} onClose={onQuestsClose} />
        <AchievementsModal isOpen={isAchievementsOpen} onClose={onAchievementsClose} />

      {/* Offline Testing Helper (Development Only) */}
      {import.meta.env.DEV && <OfflineTestHelper />}
    </Box>
  );
}; 