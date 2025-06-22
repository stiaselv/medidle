import { Box, Button, Flex, Grid, Progress, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip, VStack, useDisclosure } from '@chakra-ui/react';
import type { TooltipProps } from '@chakra-ui/react';
import { useGameStore } from '../../store/gameStore';
import { useUIStore } from '../../store/uiStore';
import { mockLocations } from '../../data/mockData';
import type { Location, SkillName, Skills, Skill } from '../../types/game';
import { BankPanel } from '../bank/BankPanel';
import { EquipmentPanel } from '../equipment/EquipmentPanel';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useDragControls } from 'framer-motion';

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
  const { isFooterExpanded, toggleFooter } = useUIStore();
  const [tabIndex, setTabIndex] = useState(0);
  const controls = useDragControls();
  const navigate = useNavigate();

  const character = useGameStore(state => state.character);
  const currentLocation = useGameStore(state => state.currentLocation);
  const setLocation = useGameStore(state => state.setLocation);
  const setView = useGameStore(state => state.setView);

  if (!character) return null;

  const combatLocationIds = [
    'farm',
    'lumbridge_swamp',
    'ardougne_marketplace',
    'ice_dungeon',
    'goblin_village'
  ];

  const mainLocations = mockLocations.filter(loc => 
    !combatLocationIds.includes(loc.id) &&
    !['easy_cave', 'medium_cave', 'hard_cave', 'nightmare_cave'].includes(loc.id)
  );

  const combatAreas = mockLocations.filter(l => l.availableSkills && l.availableSkills.includes('attack'));

  const skillNames: (keyof Skills)[] = [
    'attack', 'strength', 'defence', 'ranged', 'prayer', 'magic', 'runecrafting', 'construction', 'hitpoints', 'agility',
    'herblore', 'thieving', 'crafting', 'fletching', 'slayer', 'hunter', 'mining', 'smithing', 'fishing', 'cooking',
    'firemaking', 'woodcutting', 'farming'
  ];

  const skills: Record<keyof Skills, Skill | undefined> = Object.fromEntries(
    skillNames.map(skillName => [
      skillName,
      useGameStore(state => state.character?.skills[skillName])
    ])
  ) as Record<keyof Skills, Skill | undefined>;

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    console.log('Footer: Pointer Down Event Triggered!');
    controls.start(event);
  }

  const handleClick = () => {
    console.log('Footer: Click Event Triggered!');
    if (!isFooterExpanded) {
      toggleFooter();
    }
  };

  return (
    <Box
      as="footer"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="docked"
    >
      <Flex justify="center" align="center" position="relative">
        <motion.div
          initial={false}
          animate={{ rotate: isFooterExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: '-24px',
            zIndex: 10
          }}
        >
          <Button
            onClick={toggleFooter}
            colorScheme="blue"
            borderRadius="full"
            size="lg"
            boxShadow="lg"
          >
            ↑
          </Button>
        </motion.div>
      </Flex>

      <Box
        height={isFooterExpanded ? "500px" : "60px"}
        bg="gray.900"
        color="white"
        transition="height 0.3s ease-in-out"
        borderTop="1px"
        borderColor="gray.700"
        overflow="hidden"
      >
        <motion.div
          drag="y"
          dragControls={controls}
          dragListener={false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
          onDragEnd={(_, info) => {
            if (info.offset.y < -50) {
              if (!isFooterExpanded) toggleFooter();
            } else if (info.offset.y > 50) {
              if (isFooterExpanded) toggleFooter();
            }
          }}
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Box
            onPointerDown={startDrag}
            cursor={isFooterExpanded ? "ns-resize" : "pointer"}
            w="100%"
            h="60px"
            minH="60px"
            bg="gray.700"
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
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
                <Text fontWeight="bold">{character.name}</Text>
              </Flex>
              <Flex justify="center" align="center">
                <Text>Combat Level: {character.combatLevel}</Text>
              </Flex>
              <Flex justify="center" align="center" gap={2}>
                <Text>HP:</Text>
                <Progress value={(character.hitpoints / character.maxHitpoints) * 100} w="100px" size="sm" colorScheme="red" />
                <Text>{character.hitpoints}/{character.maxHitpoints}</Text>
              </Flex>
              <Flex justify="center" align="center" gap={2}>
                <Text>Prayer:</Text>
                <Progress value={(character.prayer / character.maxPrayer) * 100} w="100px" size="sm" colorScheme="blue" />
                <Text>{character.prayer}/{character.maxPrayer}</Text>
              </Flex>
            </Grid>
          </Box>

          {isFooterExpanded && (
            <Box flex="1" overflow="hidden">
              <Tabs variant="enclosed" h="100%" display="flex" flexDirection="column" index={tabIndex} onChange={setTabIndex}>
                <TabList display="flex" justifyContent="center" borderBottom="1px" borderColor="gray.600">
                  <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Locations</Tab>
                  <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Equipment</Tab>
                  <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Skills</Tab>
                  <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Bank</Tab>
                </TabList>
                <TabPanels flex="1" overflow="auto">
                  <TabPanel display="flex" flexDirection="column" alignItems="center">
                    <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} w="100%" maxW="1200px">
                      {mainLocations.map(location => (
                        <LocationCard
                          key={location.id}
                          location={location}
                          isActive={currentLocation?.id === location.id}
                          onClick={() => {
                            setLocation(location);
                            setView('location');
                          }}
                        />
                      ))}
                      <Button
                        variant="outline"
                        colorScheme="red"
                        height="auto"
                        p={4}
                        onClick={() => setView('combat_selection')}
                        _hover={{ transform: 'scale(1.02)' }}
                        transition="all 0.2s"
                        w="100%"
                      >
                        <Text fontWeight="bold">Combat</Text>
                        <Text fontSize="sm" color="gray.400" mt={2} textAlign="center" w="100%">
                          View Combat Areas
                        </Text>
                      </Button>
                    </Grid>
                  </TabPanel>
                  <TabPanel display="flex" justifyContent="center">
                    <Box maxW="1200px" w="100%" display="flex" justifyContent="center">
                      <EquipmentPanel />
                    </Box>
                  </TabPanel>
                  <TabPanel display="flex" flexDirection="column" alignItems="center">
                    <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4} w="100%" maxW="1200px">
                      {Object.entries(skills).map(([skillName, skill]) => {
                        if (!skill) return null;
                        const currentLevelExp = skill.level === 1 ? 0 : Math.floor((skill.level - 1) * (skill.level - 1) * 83);
                        const nextLevelExp = Math.floor(skill.level * skill.level * 83);
                        const expToNextLevel = nextLevelExp - currentLevelExp;
                        const expIntoLevel = skill.experience - currentLevelExp;
                        const progressPercentage = expToNextLevel > 0 ? Math.min((expIntoLevel / expToNextLevel) * 100, 100) : 0;
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
                            <VStack spacing={1} p={2} bg="gray.700" borderRadius="md">
                              <Text fontWeight="bold">{skillName.charAt(0).toUpperCase() + skillName.slice(1)}: {skill.level}</Text>
                              <Progress value={progressPercentage} size="xs" colorScheme="green" w="100%" />
                            </VStack>
                          </SkillTooltip>
                        );
                      })}
                    </Grid>
                  </TabPanel>
                  <TabPanel display="flex" justifyContent="center">
                    <BankPanel />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          )}
        </motion.div>
      </Box>
    </Box>
  );
}; 