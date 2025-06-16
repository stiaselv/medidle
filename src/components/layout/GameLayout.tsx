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

const MotionBox = motion(Box);

export const GameLayout = () => {
  const { character, signOut, stopAction, setLocation, currentLocation } = useGameStore();
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

        {/* Account Menu */}
        <Flex flex="1" justify="flex-end">
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