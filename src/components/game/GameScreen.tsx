import { Box, Flex, Text, VStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { ForestLocation } from './ForestLocation';
import { QuarryLocation } from './QuarryLocation';
import CampLocation from './CampLocation';
import GeneralStoreLocation from './GeneralStoreLocation';
import { ForgeLocation } from './ForgeLocation';
import { SlayerCaveLocation } from './SlayerCaveLocation';
import { CombatLocation } from './CombatLocation';
import { useState } from 'react';
import { mockLocations } from '../../data/mockData';

const MotionBox = motion(Box);

export const GameScreen = () => {
  const { currentLocation, setLocation } = useGameStore();
  const [selectedCombatArea, setSelectedCombatArea] = useState<string | null>(null);
  const [selectedMonster, setSelectedMonster] = useState<null | import('../../types/game').Monster>(null);

  // List of custom combat area IDs
  const combatAreas = [
    'farm',
    'lumbridge_swamp',
    'ardougne_marketplace',
    'ice_dungeon',
    'goblin_village'
  ];
  const combatLocations = mockLocations.filter((l: import('../../types/game').Location) => combatAreas.includes(l.id));

  const handleCombatClick = () => {
    console.log('Combat card clicked');
    setSelectedCombatArea(null); // Show area selector
    setSelectedMonster(null);
    // Do not call setLocation here
  };

  const renderCombatAreaSelector = () => (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Select a Combat Area</Text>
      <VStack spacing={4} align="stretch">
        {combatLocations.map((location: import('../../types/game').Location) => (
          <Button
            key={location.id}
            variant="outline"
            colorScheme="red"
            onClick={() => {
              setSelectedCombatArea(location.id);
              setLocation(location);
            }}
            w="100%"
            justifyContent="flex-start"
          >
            <Box mr={3} as="span" display="inline-block" minW="32px">
              {/* Optionally add an icon or image here */}
            </Box>
            <Text fontWeight="bold">{location.name}</Text>
            <Text fontSize="sm" color="gray.500" ml={2}>{location.description}</Text>
          </Button>
        ))}
      </VStack>
    </Box>
  );

  const renderMonsterSelector = (location: import('../../types/game').Location) => (
    <Box p={6}>
      <Button mb={4} colorScheme="gray" onClick={() => {
        setSelectedCombatArea(null);
        setSelectedMonster(null);
        // Do not call setLocation here
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

  const renderLocation = () => {
    // If the combat area selector is active
    if (selectedCombatArea === null && currentLocation === undefined) {
      return renderCombatAreaSelector();
    }
    // If a combat area is selected but no monster is selected
    if (selectedCombatArea && currentLocation && combatAreas.includes(currentLocation.id) && !selectedMonster) {
      return renderMonsterSelector(currentLocation);
    }
    // If a monster is selected in a combat area
    if (selectedCombatArea && currentLocation && combatAreas.includes(currentLocation.id) && selectedMonster) {
      return <CombatLocation location={currentLocation} monsterOverride={selectedMonster} onBack={() => setSelectedMonster(null)} />;
    }
    // ... existing switch/case for other locations ...
    switch (currentLocation?.id) {
      case 'forest':
        return <ForestLocation />;
      case 'quarry':
        return <QuarryLocation />;
      case 'camp':
        return <CampLocation />;
      case 'general_store':
        return <GeneralStoreLocation />;
      case 'forge':
        return <ForgeLocation />;
      case 'slayer_cave':
        return <SlayerCaveLocation />;
      case 'easy_cave':
      case 'medium_cave':
      case 'hard_cave':
      case 'nightmare_cave':
        return <CombatLocation location={currentLocation} />;
      default:
        return <ForestLocation />;
    }
  };

  return (
    <Flex
      position="relative"
      width="100%"
      height="100%"
      direction="column"
      overflow="hidden"
    >
      {/* Location Content */}
      <Box flex={1}>
        {renderLocation()}
      </Box>
    </Flex>
  );
}; 