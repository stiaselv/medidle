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
import { useState, useEffect, useRef } from 'react';
import { mockLocations } from '../../data/mockData';
import { WorkbenchLocation } from './WorkbenchLocation';
import { TempleLocation } from './TempleLocation';
import AgilityThievingLocation from './AgilityThievingLocation';
import { FieldsLocation } from '../farming/FieldsLocation';
import { BankLocation } from './BankLocation';
import { AlchemyStationLocation } from './AlchemyStationLocation';
import { COMBAT_LOCATIONS } from '../../data/locations/combat';
import { SLAYER_CAVE_LOCATIONS } from '../../data/locations/slayerCaves';

const MotionBox = motion(Box);

export const GameScreen = () => {
  const { currentLocation, setLocation, activeView, setView, character } = useGameStore();
  const [selectedMonster, setSelectedMonster] = useState<null | import('../../types/game').Monster>(null);

  // List of new combat sub-location IDs
  const combatSubAreas = ['farm', 'lumbridge_swamp_cave', 'ice_dungeon'];
  const combatSubLocations = Object.values(COMBAT_LOCATIONS).filter((l: import('../../types/game').Location) => combatSubAreas.includes(l.id));

  // List of slayer cave sub-location IDs
  const slayerSubAreas = ['easy_cave', 'medium_cave', 'hard_cave', 'nightmare_cave'];
  const slayerSubLocations = Object.values(SLAYER_CAVE_LOCATIONS).filter((l: import('../../types/game').Location) => slayerSubAreas.includes(l.id));

  // Add cave IDs to a list for easy checking
  const caveIds = ['easy_cave', 'medium_cave', 'hard_cave', 'nightmare_cave'];

  // Track if we've auto-selected a monster for the current cave
  const autoSelectedRef = useRef<{ locationId: string | null }>({ locationId: null });

  // Reset auto-select ref when location changes
  useEffect(() => {
    if (!currentLocation || autoSelectedRef.current.locationId !== currentLocation.id) {
      autoSelectedRef.current.locationId = null;
    }
    // If we switched away from combat or slayer selection, clear selected monster
    if (activeView !== 'location' && currentLocation && !combatSubAreas.includes(currentLocation.id) && !slayerSubAreas.includes(currentLocation.id)) {
      setSelectedMonster(null);
    }
  }, [currentLocation, activeView]);

  // Auto-select first monster in cave only once per cave entry
  useEffect(() => {
    if (
      currentLocation &&
      caveIds.includes(currentLocation.id) &&
      selectedMonster === null &&
      currentLocation.actions &&
      currentLocation.actions.length > 0 &&
      autoSelectedRef.current.locationId !== currentLocation.id
    ) {
      // Find the first action with a monster property
      const firstCombatAction = currentLocation.actions.find((a: any) => a && typeof a === 'object' && 'monster' in a && a.monster);
      if (firstCombatAction && typeof firstCombatAction === 'object' && 'monster' in firstCombatAction) {
        setSelectedMonster((firstCombatAction as import('../../types/game').CombatAction).monster);
        autoSelectedRef.current.locationId = currentLocation.id;
      }
    }
  }, [currentLocation, selectedMonster]);

  // Set bank as default location when character is present but no location is set
  useEffect(() => {
    if (character && !currentLocation) {
      const bankLocation = mockLocations.find(loc => loc.id === 'bank');
      if (bankLocation) {
        setLocation(bankLocation);
      }
    }
  }, [character, currentLocation, setLocation]);

  const renderCombatAreaSelector = () => (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Select a Combat Area</Text>
      <VStack spacing={4} align="stretch">
        {combatSubLocations.map((location: import('../../types/game').Location) => (
          <Button
            key={location.id}
            variant="outline"
            colorScheme="red"
            onClick={() => {
              setLocation(location);
              setView('location');
            }}
            w="100%"
            justifyContent="flex-start"
          >
            <Box mr={3} as="span" display="inline-block" minW="32px">
              <img
                src={location.icon as string}
                alt={location.name + ' icon'}
                style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: 4 }}
                onError={e => { (e.target as HTMLImageElement).src = '/assets/locations/placeholder.png'; }}
              />
            </Box>
            <Text fontWeight="bold">{location.name}</Text>
            <Text fontSize="sm" color="gray.500" ml={2}>{location.description}</Text>
          </Button>
        ))}
      </VStack>
    </Box>
  );

  const renderSlayerAreaSelector = () => (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Select Difficulty</Text>
      <VStack spacing={4} align="stretch">
        {slayerSubLocations.map((location: import('../../types/game').Location) => (
          <Button
            key={location.id}
            variant="outline"
            colorScheme="purple"
            onClick={() => {
              setLocation(location);
              setView('location');
            }}
            w="100%"
            justifyContent="flex-start"
          >
            <Box mr={3} as="span" display="inline-block" minW="32px">
              <img
                src={location.icon as string}
                alt={location.name + ' icon'}
                style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: 4 }}
                onError={e => { (e.target as HTMLImageElement).src = '/assets/locations/placeholder.png'; }}
              />
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
        // Determine if this is a combat or slayer area and go back appropriately
        if (combatSubAreas.includes(location.id)) {
          setView('combat_selection');
        } else if (slayerSubAreas.includes(location.id)) {
          // Go back to slayer cave hub
          const slayerHub = mockLocations.find(loc => loc.id === 'slayer_cave');
          if (slayerHub) {
            setLocation(slayerHub);
          }
        }
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
                <img
                  src={action.monster.thumbnail || `/assets/monsters/${action.monster.id}.png`}
                  alt={action.monster.name + ' icon'}
                  style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: 4 }}
                  onError={e => { (e.target as HTMLImageElement).src = '/assets/monsters/placeholder.png'; }}
                />
              </Box>
              <Text fontWeight="bold">{action.monster.name}</Text>
              <Text fontSize="sm" color="gray.500" ml={2}>Level {action.monster.level}</Text>
            </Button>
          ))}
      </VStack>
    </Box>
  );

  const renderLocation = () => {
    // If combat selection view is active, show the area selector
    if (activeView === 'combat_selection') {
      return renderCombatAreaSelector();
    }

    // If a combat sub-area is selected but no monster is selected, show monster selector
    if (currentLocation && combatSubAreas.includes(currentLocation.id) && !selectedMonster) {
      return renderMonsterSelector(currentLocation);
    }

    // If a monster is selected in a combat sub-area, show the combat screen
    if (currentLocation && combatSubAreas.includes(currentLocation.id) && selectedMonster) {
      return <CombatLocation location={currentLocation} monsterOverride={selectedMonster} onBack={() => setSelectedMonster(null)} />;
    }

    // If a slayer sub-area is selected but no monster is selected, show monster selector
    if (currentLocation && slayerSubAreas.includes(currentLocation.id) && !selectedMonster) {
      return renderMonsterSelector(currentLocation);
    }

    // If a monster is selected in a slayer sub-area, show the combat screen
    if (currentLocation && slayerSubAreas.includes(currentLocation.id) && selectedMonster) {
      return <CombatLocation location={currentLocation} monsterOverride={selectedMonster} onBack={() => setSelectedMonster(null)} />;
    }

    // --- CAVE FLOW ---
    // If in a cave and no monster is selected, show monster selector (only if no monsters or auto-select failed)
    if (currentLocation && caveIds.includes(currentLocation.id) && !selectedMonster) {
      return renderMonsterSelector(currentLocation);
    }
    // If in a cave and a monster is selected, render CombatLocation
    if (currentLocation && caveIds.includes(currentLocation.id) && selectedMonster) {
      return <CombatLocation location={currentLocation} monsterOverride={selectedMonster} onBack={() => setSelectedMonster(null)} />;
    }

    // ... existing switch/case for other locations ...
    switch (currentLocation?.id) {
      case 'combat':
        // Show combat area selector when the main combat hub is selected
        return renderCombatAreaSelector();
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
      case 'workbench':
        return <WorkbenchLocation />;
      case 'temple':
        return <TempleLocation />;
      case 'rooftop_thieving':
        return <AgilityThievingLocation />;
      case 'fields':
        return <FieldsLocation />;
      case 'alchemy_station':
        return <AlchemyStationLocation />;
      case 'bank':
        return <BankLocation />;
      default:
        return <BankLocation />;
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