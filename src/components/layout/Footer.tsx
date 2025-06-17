import { Box, Button, Flex, Grid, Image, Progress, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip, VStack } from '@chakra-ui/react';
import type { TooltipProps } from '@chakra-ui/react';
import { useGameStore } from '../../store/gameStore';
import { useUIStore } from '../../store/uiStore';
import { mockLocations } from '../../data/mockData';
import type { Location, SkillName, Skills, Skill } from '../../types/game';
import { BankPanel } from '../bank/BankPanel';
import { EquipmentPanel } from '../equipment/EquipmentPanel';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SkillTooltip = ({ children, ...props }: TooltipProps) => (
  <Tooltip hasArrow placement="top" {...props}>
    {children}
  </Tooltip>
);

const LocationCard = ({ location, isActive, onClick }: { location: Location; isActive: boolean; onClick: () => void }) => (
  <Button
    variant="outline"
    colorScheme={isActive ? "blue" : "gray"}
    height="auto"
    p={4}
    display="flex"
    flexDirection="column"
    alignItems="center"
    gap={2}
    onClick={onClick}
    _hover={{ transform: 'scale(1.02)' }}
    transition="all 0.2s"
    w="100%"
  >
    <Text fontWeight="bold">{location.name}</Text>
    <Text 
      fontSize="sm" 
      color="gray.400" 
      noOfLines={2}
      textAlign="center"
      w="100%"
      whiteSpace="normal"
      wordBreak="break-word"
    >
      {location.description}
    </Text>
    <Flex gap={2} mt={2} flexWrap="wrap" justify="center">
      {(location.availableSkills ?? []).map((skill) => (
        <Text key={skill} fontSize="xs" color="gray.500">
          {skill}
        </Text>
      ))}
    </Flex>
  </Button>
);

export const Footer = ({ onCombatClick }: { onCombatClick?: () => void }) => {
  const { isFooterExpanded } = useUIStore();
  const [tabIndex, setTabIndex] = useState(0);

  const character = useGameStore(state => state.character);
  const currentLocation = useGameStore(state => state.currentLocation);
  const setLocation = useGameStore(state => state.setLocation);
  const setCharacter = useGameStore(state => state.setCharacter);

  if (!character) return null;

  // Granular selectors for top bar skills
  const attack = useGameStore(state => state.character?.skills.attack);
  const strength = useGameStore(state => state.character?.skills.strength);

  // List of custom combat locations
  const combatAreas = [
    'farm',
    'lumbridge_swamp',
    'ardougne_marketplace',
    'ice_dungeon',
    'goblin_village'
  ];
  const combatLocations = mockLocations.filter(l => combatAreas.includes(l.id));

  // Instead of using the whole character object for skills, use granular selectors for each skill
  const skillNames: (keyof Skills)[] = [
    'attack', 'strength', 'defence', 'ranged', 'prayer', 'magic', 'runecrafting', 'construction', 'hitpoints', 'agility',
    'herblore', 'thieving', 'crafting', 'fletching', 'slayer', 'hunter', 'mining', 'smithing', 'fishing', 'cooking',
    'firemaking', 'woodcutting', 'farming', 'none'
  ];

  const skills: Record<keyof Skills, Skill | undefined> = Object.fromEntries(
    skillNames.map(skillName => [
      skillName,
      useGameStore(state => state.character?.skills[skillName])
    ])
  ) as Record<keyof Skills, Skill | undefined>;

  return (
    <Flex 
      h="100%" 
      direction="column" 
      role="region" 
      aria-label="Game information"
      justify={isFooterExpanded ? "flex-start" : "center"}
      p={4}
    >
      {/* Basic info bar (always visible) */}
      <Flex
        w="100%"
        h={isFooterExpanded ? '60px' : '100%'}
        minH="60px"
        bg="gray.700"
        borderRadius="md"
        p={2}
        align="center"
        justify="center"
        position={isFooterExpanded ? 'absolute' : 'relative'}
        top={0}
        left={0}
        right={0}
        role="status"
        aria-label="Character status"
      >
        <Grid
          templateColumns="repeat(4, 1fr)"
          gap={4}
          w="100%"
          maxW="1200px"
          px={4}
          h="100%"
          alignItems="center"
        >
          <Flex justify="center" align="center">
            <Text fontWeight="bold" aria-label="Character name">{character.name}</Text>
          </Flex>
          
          <Flex justify="center" align="center">
            <Text aria-label="Combat level">Combat Level: {character.combatLevel}</Text>
          </Flex>
          
          <Flex justify="center" align="center" gap={2}>
            <Text>HP:</Text>
            <Progress
              value={(character.hitpoints / character.maxHitpoints) * 100}
              w="100px"
              size="sm"
              colorScheme="red"
              aria-label={`Hitpoints: ${character.hitpoints} out of ${character.maxHitpoints}`}
            />
            <Text aria-hidden="true">{character.hitpoints}/{character.maxHitpoints}</Text>
          </Flex>
          
          <Flex justify="center" align="center" gap={2}>
            <Text>Prayer:</Text>
            <Progress
              value={(character.prayer / character.maxPrayer) * 100}
              w="100px"
              size="sm"
              colorScheme="blue"
              aria-label={`Prayer points: ${character.prayer} out of ${character.maxPrayer}`}
            />
            <Text aria-hidden="true">{character.prayer}/{character.maxPrayer}</Text>
          </Flex>
        </Grid>
      </Flex>

      {/* Expanded content */}
      {isFooterExpanded && (
        <Box mt="70px" w="100%" h="calc(100% - 70px)" maxH="530px" overflow="hidden">
          <Tabs
            variant="enclosed"
            h="100%"
            display="flex"
            flexDirection="column"
            index={tabIndex}
            onChange={setTabIndex}
          >
            <TabList display="flex" justifyContent="center" borderBottom="1px" borderColor="gray.600" role="tablist">
              <Tab _selected={{ color: 'white', bg: 'blue.500' }} role="tab" aria-label="Locations tab">Locations</Tab>
              <Tab _selected={{ color: 'white', bg: 'blue.500' }} role="tab" aria-label="Equipment tab">Equipment</Tab>
              <Tab _selected={{ color: 'white', bg: 'blue.500' }} role="tab" aria-label="Skills tab">Skills</Tab>
              <Tab _selected={{ color: 'white', bg: 'blue.500' }} role="tab" aria-label="Bank tab">Bank</Tab>
            </TabList>

            <TabPanels h="calc(100% - 40px)" overflow="auto" flex="1">
              {/* Locations Panel */}
              <TabPanel display="flex" flexDirection="column" alignItems="center" role="tabpanel" aria-label="Locations">
                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} w="100%" maxW="1200px">
                  {mockLocations
                    .filter((location: Location) =>
                      // Exclude only the four sub-caves from the grid
                      !combatAreas.includes(location.id) &&
                      !['easy_cave', 'medium_cave', 'hard_cave', 'nightmare_cave'].includes(location.id)
                    )
                    .map((location: Location) => (
                      <LocationCard
                        key={location.id}
                        location={location}
                        isActive={currentLocation?.id === location.id}
                        onClick={() => setLocation(location)}
                      />
                    ))}
                  {/* Add Combat LocationCard */}
                  <Button
                    variant="outline"
                    colorScheme="red"
                    height="auto"
                    p={4}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                    onClick={() => {
                      setTabIndex(0); // Ensure Locations tab is selected
                      onCombatClick && onCombatClick();
                    }}
                    _hover={{ transform: 'scale(1.02)' }}
                    transition="all 0.2s"
                    w="100%"
                  >
                    <Text fontWeight="bold">Combat</Text>
                    <Text fontSize="sm" color="gray.400" textAlign="center" w="100%">Fight monsters, explore dungeons, and challenge raids!</Text>
                  </Button>
                </Grid>
              </TabPanel>

              {/* Equipment Panel */}
              <TabPanel display="flex" justifyContent="center" role="tabpanel" aria-label="Equipment">
                <Box maxW="1200px" w="100%" display="flex" justifyContent="center">
                  <EquipmentPanel />
                </Box>
              </TabPanel>

              {/* Skills Panel */}
              <TabPanel display="flex" flexDirection="column" alignItems="center" role="tabpanel" aria-label="Skills">
                <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4} w="100%" maxW="1200px">
                  {Object.entries(skills).map(([skillName, skill]) => {
                    if (!skill) return null;
                    // Calculate current level XP thresholds
                    const currentLevelExp = skill.level === 1 ? 0 : Math.floor((skill.level - 1) * (skill.level - 1) * 83);
                    const nextLevelExp = Math.floor(skill.level * skill.level * 83);
                    const expToNextLevel = nextLevelExp - currentLevelExp;
                    const expIntoLevel = skill.experience - currentLevelExp;
                    const progressPercentage = Math.min((expIntoLevel / expToNextLevel) * 100, 100);

                    return (
                      <SkillTooltip
                        key={skillName}
                        label={
                          <VStack spacing={1} p={1}>
                            <Text>Current XP: {skill.experience.toLocaleString()}</Text>
                            <Text>Next Level: {nextLevelExp.toLocaleString()}</Text>
                            <Text>Remaining: {Math.max(0, nextLevelExp - skill.experience).toLocaleString()}</Text>
                          </VStack>
                        }
                      >
                        <Box
                          bg="gray.600"
                          borderRadius="md"
                          p={3}
                          _hover={{ bg: 'gray.500' }}
                          transition="all 0.2s"
                          role="region"
                          aria-label={`${skillName} skill information`}
                        >
                          <Flex justify="space-between" mb={2}>
                            <Text>{skillName}</Text>
                            <Text fontWeight="bold" aria-label={`Level ${skill.level}`}>{skill.level}</Text>
                          </Flex>
                          <Flex direction="column">
                            <Progress
                              value={progressPercentage}
                              size="sm"
                              colorScheme="green"
                              mb={1}
                              aria-label={`${skillName} progress: ${progressPercentage.toFixed(1)}%`}
                            />
                            <Text fontSize="xs" color="gray.400" textAlign="right" aria-hidden="true">
                              {progressPercentage.toFixed(1)}%
                            </Text>
                          </Flex>
                        </Box>
                      </SkillTooltip>
                    );
                  })}
                </Grid>
              </TabPanel>

              {/* Bank Panel */}
              <TabPanel display="flex" justifyContent="center" role="tabpanel" aria-label="Bank">
                <Box maxW="1200px" w="100%">
                  <BankPanel />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </Flex>
  );
}; 