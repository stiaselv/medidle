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
    <Flex gap={1} mt={2} flexWrap="wrap" justify="center">
      {(location.availableSkills ?? []).map((skill) => (
        <img
          key={skill}
          src={`/assets/ItemThumbnail/skillicons/${skill}.png`}
          alt={`${skill} icon`}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            filter: 'brightness(1.1)',
            opacity: 0.8
          }}
          onError={(e) => {
            e.currentTarget.src = '/assets/items/placeholder.png';
          }}
        />
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

  // Ensure 'rooftop_thieving' is included in mainLocations
  if (!mainLocations.some(loc => loc.id === 'rooftop_thieving')) {
    const rooftopLoc = mockLocations.find(loc => loc.id === 'rooftop_thieving');
    if (rooftopLoc) mainLocations.push(rooftopLoc);
  }

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
                <Text>{character.prayer ?? 0}/{character.maxPrayer ?? 0}</Text>
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
                  <TabPanel display="flex" flexDirection="column" alignItems="center" p={6}>
                    <Grid templateColumns="repeat(auto-fit, minmax(140px, 1fr))" gap={3} w="100%" maxW="1200px">
                      {Object.entries(skills).map(([skillName, skill]) => {
                        if (!skill) return null;
                        const currentLevelExp = skill.level === 1 ? 0 : Math.floor((skill.level - 1) * (skill.level - 1) * 83);
                        const nextLevelExp = Math.floor(skill.level * skill.level * 83);
                        const expToNextLevel = nextLevelExp - currentLevelExp;
                        const expIntoLevel = skill.experience - currentLevelExp;
                        const progressPercentage = expToNextLevel > 0 ? Math.min((expIntoLevel / expToNextLevel) * 100, 100) : 0;
                        
                        // Get skill color scheme
                        const getSkillColor = (skill: string) => {
                          const colorMap: Record<string, string> = {
                            attack: 'red', strength: 'orange', defence: 'blue', ranged: 'green',
                            prayer: 'purple', magic: 'cyan', runecrafting: 'yellow', construction: 'orange',
                            hitpoints: 'red', agility: 'blue', herblore: 'green', thieving: 'purple',
                            crafting: 'orange', fletching: 'yellow', slayer: 'red', hunter: 'green',
                            mining: 'gray', smithing: 'orange', fishing: 'blue', cooking: 'red',
                            firemaking: 'orange', woodcutting: 'green', farming: 'green'
                          };
                          return colorMap[skill] || 'gray';
                        };
                        
                        const skillColor = getSkillColor(skillName);
                        const skillIconPath = `/assets/ItemThumbnail/skillicons/${skillName}.png`;
                        
                        return (
                          <SkillTooltip
                            key={skillName}
                            label={
                              <VStack spacing={1} p={2}>
                                <Text fontWeight="bold" color="white">{skillName.charAt(0).toUpperCase() + skillName.slice(1)}</Text>
                                <Text>Level: {skill.level}</Text>
                                <Text>Current XP: {skill.experience.toLocaleString()}</Text>
                                <Text>Next Level: {nextLevelExp.toLocaleString()}</Text>
                                <Text>Remaining: {Math.max(0, nextLevelExp - skill.experience).toLocaleString()}</Text>
                                <Text fontSize="sm" color="gray.300">
                                  Progress: {progressPercentage.toFixed(1)}%
                                </Text>
                              </VStack>
                            }
                          >
                            <Box
                              position="relative"
                              p={3}
                              bg="gray.800"
                              borderRadius="lg"
                              borderWidth="2px"
                              borderColor={`${skillColor}.500`}
                              _hover={{
                                bg: "gray.700",
                                borderColor: `${skillColor}.400`,
                                transform: "translateY(-2px)",
                                boxShadow: `0 4px 12px rgba(0,0,0,0.3), 0 0 20px var(--chakra-colors-${skillColor}-500)`
                              }}
                              transition="all 0.2s ease-in-out"
                              cursor="pointer"
                              minH="120px"
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                            >
                              {/* Skill Icon */}
                              <Box
                                position="relative"
                                mb={2}
                                borderRadius="full"
                                p={1}
                                bg={`${skillColor}.600`}
                                boxShadow={`0 0 10px var(--chakra-colors-${skillColor}-500)`}
                              >
                                <img
                                  src={skillIconPath}
                                  alt={`${skillName} icon`}
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    filter: 'brightness(1.1)'
                                  }}
                                  onError={(e) => {
                                    // Fallback to placeholder if icon doesn't exist
                                    e.currentTarget.src = '/assets/items/placeholder.png';
                                  }}
                                />
                              </Box>
                              
                              {/* Skill Name and Level */}
                              <VStack spacing={0.5} align="center">
                                <Text
                                  fontWeight="bold"
                                  fontSize="sm"
                                  color="white"
                                  textAlign="center"
                                  lineHeight="1.2"
                                >
                                  {skillName.charAt(0).toUpperCase() + skillName.slice(1)}
                                </Text>
                                <Text
                                  fontSize="lg"
                                  fontWeight="bold"
                                  color={`${skillColor}.300`}
                                  textShadow={`0 0 8px var(--chakra-colors-${skillColor}-500)`}
                                >
                                  {skill.level}
                                </Text>
                              </VStack>
                              
                              {/* Progress Bar */}
                              <Box w="100%" mt={2} px={1}>
                                <Progress
                                  value={progressPercentage}
                                  size="xs"
                                  colorScheme={skillColor}
                                  borderRadius="full"
                                  bg="gray.600"
                                  hasStripe={progressPercentage > 0}
                                  isAnimated={progressPercentage > 0}
                                />
                              </Box>
                              
                              {/* Level Badge for 99s */}
                              {skill.level === 99 && (
                                <Box
                                  position="absolute"
                                  top="-6px"
                                  right="-6px"
                                  bg="yellow.400"
                                  color="black"
                                  borderRadius="full"
                                  w="20px"
                                  h="20px"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  fontSize="xs"
                                  fontWeight="bold"
                                  boxShadow="0 0 8px var(--chakra-colors-yellow-400)"
                                >
                                  ★
                                </Box>
                              )}
                            </Box>
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