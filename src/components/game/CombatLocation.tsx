import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  Progress,
  Image,
  Grid,
  GridItem,
  List,
  ListItem,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { useGameStore } from '../../store/gameStore';
import type { GameState, ItemReward, SkillAction, CombatAction, CombatSelectionAction, Monster, Location, Character } from '../../types/game';
import { EquipmentPanel } from '../equipment/EquipmentPanel';
import { getItemById } from '../../data/items';
import { calculateMaxHit, calculateAccuracy } from '../../combat/combatCalculations';
import { getCombatStyle } from '../../combat/combatTriangle';
import React from 'react';
import { FaBullseye, FaFistRaised, FaShieldAlt, FaFire, FaHeart } from 'react-icons/fa';

interface CombatLocationProps {
  location: Location;
  monsterOverride?: Monster | null;
  onBack?: () => void;
}

export const CombatLocation: React.FC<CombatLocationProps> = ({ location, monsterOverride, onBack }) => {
  if (!monsterOverride) return null;
  const { 
    character, 
    currentLocation,
    startAction,
    stopAction,
    currentAction,
    actionProgress,
    isActionInProgress,
    useConsumable,
    lastCombatRound,
    resetLastCombatRound
  } = useGameStore() as GameState & { useConsumable: (itemId: string, quantity?: number) => void, lastCombatRound: any, resetLastCombatRound: () => void };

  // State for selected monster (before combat starts)
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(monsterOverride || null);
  // State for selected attack style
  const [attackStyle, setAttackStyle] = useState<'accurate' | 'aggressive' | 'defensive'>('accurate');
  // State for selected prayer
  const [activePrayer, setActivePrayer] = useState<string | null>(null);
  // Combat log state
  const [combatLog, setCombatLog] = useState<string[]>([]);
  // Animation state
  const [playerFlash, setPlayerFlash] = useState(false);
  const [monsterFlash, setMonsterFlash] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  // Add auto-fight state
  const [autoFight, setAutoFight] = useState(false);

  // Scroll to latest log entry
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [combatLog]);

  // Listen for combat round updates from the store
  useEffect(() => {
    if (!character || !currentLocation) return;
    if (lastCombatRound) {
      handleCombatRound(
        lastCombatRound.playerDamage,
        lastCombatRound.monsterDamage,
        lastCombatRound.result,
        lastCombatRound.loot
      );
      // Auto-fight logic
      if (lastCombatRound.result === 'victory' && autoFight) {
        setTimeout(() => {
          // Start next fight if player is alive
          if (character.hitpoints > 0 && selectedMonster) {
            const action = (currentLocation.actions as (SkillAction | CombatAction | CombatSelectionAction)[]).find(
              (a) => a.type === 'combat' && (a as CombatAction).monster.id === selectedMonster.id
            ) as CombatAction;
            if (action) {
              handleStartCombat(action);
            }
          }
        }, 1200); // Short delay for reward popup
      }
      // Stop auto-fight if player is defeated
      if (lastCombatRound.result === 'defeat' && autoFight) {
        setAutoFight(false);
      }
      // Reset lastCombatRound in the store
      resetLastCombatRound();
    }
  }, [lastCombatRound, autoFight, character, selectedMonster, currentLocation]);

  // If monsterOverride changes, update selectedMonster
  useEffect(() => {
    if (monsterOverride) setSelectedMonster(monsterOverride);
  }, [monsterOverride]);

  if (!character || !currentLocation) return null;

  // Filter consumable items (food) from bank
  const consumableItems = character.bank.filter(item => {
    const itemDetails = getItemById(item.id);
    return itemDetails?.type === 'consumable' && itemDetails.healing;
  });

  // Get combat stats for display
  const getCombatStats = (entity: typeof character | Monster) => {
    if ('skills' in entity) {
      // This is a character
      return {
        attack: entity.skills.attack.level,
        strength: entity.skills.strength.level,
        defence: entity.skills.defence.level,
        hitpoints: entity.hitpoints,
        maxHitpoints: entity.maxHitpoints,
      };
    } else {
      // This is a monster
      const stats = entity.stats || {
        attackSlash: 1,
        strengthMelee: 1,
        defenceSlash: 1
      };
      
      return {
        attack: stats.attackSlash,
        strength: stats.strengthMelee,
        defence: stats.defenceSlash,
        hitpoints: entity.hitpoints || 0,
        maxHitpoints: entity.maxHitpoints || 0,
      };
    }
  };

  // Calculate max hit for display
  const getMaxHit = (entity: typeof character | Monster, isPlayer: boolean) => {
    if (!entity) return 0;
    
    if (isPlayer && character) {
      // For player, use current attack style
      return calculateMaxHit(character, attackStyle, selectedMonster || {} as Monster, false);
    } else {
      // For monster, assume aggressive style (most common for monsters)
      return calculateMaxHit(entity as Monster, 'aggressive', character || {} as Character, false);
    }
  };

  // Calculate accuracy for display
  const getAccuracy = (entity: typeof character | Monster, isPlayer: boolean) => {
    if (!entity || !character || !selectedMonster) return 0;
    
    if (isPlayer) {
      // Player attacking monster
      return calculateAccuracy(character, attackStyle, selectedMonster, false);
    } else {
      // Monster attacking player
      return calculateAccuracy(entity as Monster, 'aggressive', character, false);
    }
  };

  const handleMonsterSelect = (monster: Monster) => {
    setSelectedMonster(monster);
  };

  const handleStartCombat = (action: CombatAction) => {
    const actionWithStyle = {
      ...action,
      attackStyle: attackStyle,
      activePrayer: activePrayer,
    };
    startAction(actionWithStyle);
  };

  const handleConsumableUse = (item: ItemReward) => {
    // Use the consumable (heal or boost)
    useConsumable(item.id, 1);
    const itemDetails = getItemById(item.id);
    if (itemDetails?.healing) {
      setCombatLog(log => [...log, `You eat ${item.name} and heal ${itemDetails.healing} HP.`]);
    } else if (itemDetails && itemDetails.boost !== undefined) {
      setCombatLog(log => [...log, `You drink ${item.name} and feel a boost to your ${(itemDetails.boost && itemDetails.boost.stat) || ''}!`]);
    }
  };

  // Example: Call this function after each attack round
  const handleCombatRound = (playerDamage: number, monsterDamage: number, result: 'continue' | 'victory' | 'defeat', loot?: string[]) => {
    // Use the monster's name from the current action if in combat, else from selectedMonster
    const monsterName = (currentAction && (currentAction as CombatAction).monster?.name) || selectedMonster?.name || 'monster';
    setCombatLog(log => [...log, `You hit the ${monsterName} for ${playerDamage} damage!`] );
    if (playerDamage > 0) {
      setMonsterFlash(true);
      setTimeout(() => setMonsterFlash(false), 300);
      // Determine skill based on attack style
      let skill: string = 'attack';
      const style = (currentAction as any)?.attackStyle || attackStyle || 'accurate';
      if (style === 'aggressive') skill = 'strength';
      else if (style === 'defensive') skill = 'defence';
      else skill = 'attack';
      // If player is using ranged or magic, try to infer from weapon
      if (character?.equipment?.weapon) {
        const weaponId = character.equipment.weapon.id;
        if (weaponId.includes('bow') || weaponId.includes('crossbow') || weaponId.includes('dart') || weaponId.includes('knife')) {
          skill = 'ranged';
        } else if (weaponId.includes('staff') || weaponId.includes('wand')) {
          skill = 'magic';
        }
      }
      const xpGained = playerDamage * 4;
      const hitpointsXp = Math.round(playerDamage * 1.33);
      setCombatLog(log => [...log, `You gain ${xpGained} XP in ${skill.charAt(0).toUpperCase() + skill.slice(1)} and ${hitpointsXp} XP in Hitpoints!`]);
    }
    setCombatLog(log => [...log, `The ${monsterName} hits you for ${monsterDamage} damage!`] );
    if (monsterDamage > 0) {
      setPlayerFlash(true);
      setTimeout(() => setPlayerFlash(false), 300);
    }
    if (result === 'victory') {
      setCombatLog(log => [...log, `You defeated the ${monsterName}!`]);
      if (loot && loot.length > 0) {
        loot.forEach(item => setCombatLog(log => [...log, `You received: ${item}`]));
      }
    } else if (result === 'defeat') {
      setCombatLog(log => [...log, 'You were defeated!']);
    }
  };

  // Get possible drops for the current monster
  const monsterForDrops = (currentAction && currentAction.type === 'combat') ? (currentAction as CombatAction).monster : selectedMonster;
  const possibleDrops = monsterForDrops?.drops || [];

  const renderCombatantCard = (entity: typeof character | Monster, isPlayer: boolean) => {
    if (!entity) return null;
    const stats = getCombatStats(entity);
    const level = isPlayer ? character.combatLevel : (entity as Monster).level || 1;
    const name = isPlayer ? character.name : (entity as Monster).name || 'Unknown';
    const flash = isPlayer ? playerFlash : monsterFlash;
    const maxHit = getMaxHit(entity, isPlayer);
    const hpPercentage = (stats.hitpoints / stats.maxHitpoints) * 100;
    
    return (
      <Card 
        variant="outline" 
        bg={flash ? 'red.200' : 'gray.50'}
        borderColor={isPlayer ? 'blue.300' : 'red.300'}
        borderWidth={2}
        transition="all 0.3s"
        _dark={{
          bg: flash ? 'red.800' : 'gray.800',
          borderColor: isPlayer ? 'blue.400' : 'red.400'
        }}
      >
        <CardHeader pb={2}>
          <HStack justify="space-between" align="center">
            <VStack spacing={0} align="start">
              <Text fontWeight="bold" fontSize="lg" color={isPlayer ? 'blue.600' : 'red.600'} _dark={{ color: isPlayer ? 'blue.300' : 'red.300' }}>
                {name}
              </Text>
              <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                Combat Level {level}
              </Text>
            </VStack>
            {!isPlayer && (
              <Image 
                src={(entity as Monster).thumbnail || `/assets/monsters/${(entity as Monster).id}.png`}
                fallbackSrc="/assets/monsters/placeholder.png"
                boxSize="60px"
                objectFit="contain"
                alt={`${name} icon`}
              />
            )}
          </HStack>
        </CardHeader>
        
        <CardBody pt={0}>
          <VStack spacing={4} align="stretch">
            {/* HP Bar with visual indicator */}
            <Box>
              <HStack justify="space-between" mb={1}>
                <HStack>
                  <FaHeart color={hpPercentage > 50 ? '#38a169' : hpPercentage > 25 ? '#d69e2e' : '#e53e3e'} />
                  <Text fontSize="sm" fontWeight="semibold">Hitpoints</Text>
                </HStack>
                <Text fontSize="sm" fontWeight="bold">
                  {stats.hitpoints}/{stats.maxHitpoints}
                </Text>
              </HStack>
              <Progress 
                value={hpPercentage} 
                colorScheme={hpPercentage > 50 ? 'green' : hpPercentage > 25 ? 'yellow' : 'red'}
                size="lg"
                borderRadius="md"
              />
            </Box>

            {/* Combat Stats Display */}
            <VStack spacing={2}>
              {/* Max Hit Display */}
              <Box 
                bg={isPlayer ? 'blue.50' : 'red.50'} 
                p={3} 
                borderRadius="md" 
                border="1px solid"
                borderColor={isPlayer ? 'blue.200' : 'red.200'}
                w="100%"
                _dark={{
                  bg: isPlayer ? 'blue.900' : 'red.900',
                  borderColor: isPlayer ? 'blue.600' : 'red.600'
                }}
              >
                <HStack justify="space-between" align="center">
                  <HStack>
                    <FaFire color={isPlayer ? '#3182ce' : '#e53e3e'} />
                    <Text fontSize="sm" fontWeight="semibold">Max Hit</Text>
                  </HStack>
                  <Text 
                    fontSize="xl" 
                    fontWeight="bold" 
                    color={isPlayer ? 'blue.600' : 'red.600'}
                    _dark={{ color: isPlayer ? 'blue.300' : 'red.300' }}
                  >
                    {maxHit}
                  </Text>
                </HStack>
                {isPlayer && (
                  <Text fontSize="xs" color="gray.600" _dark={{ color: 'gray.400' }} mt={1}>
                    Using {attackStyle} style
                  </Text>
                )}
              </Box>

              {/* Accuracy Display */}
              {(character && selectedMonster) && (
                <Box 
                  bg={isPlayer ? 'green.50' : 'orange.50'} 
                  p={2} 
                  borderRadius="md" 
                  border="1px solid"
                  borderColor={isPlayer ? 'green.200' : 'orange.200'}
                  w="100%"
                  _dark={{
                    bg: isPlayer ? 'green.900' : 'orange.900',
                    borderColor: isPlayer ? 'green.600' : 'orange.600'
                  }}
                >
                  <HStack justify="space-between" align="center">
                    <HStack>
                      <FaBullseye color={isPlayer ? '#38a169' : '#d69e2e'} size="14px" />
                      <Text fontSize="xs" fontWeight="semibold">Accuracy</Text>
                    </HStack>
                    <Text 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color={isPlayer ? 'green.600' : 'orange.600'}
                      _dark={{ color: isPlayer ? 'green.300' : 'orange.300' }}
                    >
                      {Math.round(getAccuracy(entity, isPlayer) * 100)}%
                    </Text>
                  </HStack>
                </Box>
              )}
            </VStack>

            {/* Combat Stats Grid */}
            <SimpleGrid columns={3} spacing={2}>
              <Stat size="sm" textAlign="center">
                <StatLabel fontSize="xs">Attack</StatLabel>
                <StatNumber fontSize="lg">{stats.attack}</StatNumber>
              </Stat>
              <Stat size="sm" textAlign="center">
                <StatLabel fontSize="xs">Strength</StatLabel>
                <StatNumber fontSize="lg">{stats.strength}</StatNumber>
              </Stat>
              <Stat size="sm" textAlign="center">
                <StatLabel fontSize="xs">Defence</StatLabel>
                <StatNumber fontSize="lg">{stats.defence}</StatNumber>
              </Stat>
            </SimpleGrid>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  const renderMonsterListItem = (action: CombatAction) => {
    const { monster } = action;
    const isSelected = selectedMonster?.id === monster.id;
    const isCurrentTarget = currentAction?.id === action.id;

    return (
      <ListItem 
        key={monster.id}
        onClick={() => handleMonsterSelect(monster)}
        cursor="pointer"
        bg={isSelected ? 'whiteAlpha.200' : 'transparent'}
        _hover={{ bg: 'whiteAlpha.100' }}
        p={2}
        borderRadius="md"
      >
        <HStack spacing={3}>
          <Image 
            src={monster.thumbnail || `/assets/monsters/${monster.id}.png`}
            fallbackSrc="/assets/monsters/placeholder.png"
            boxSize="48px"
            objectFit="contain"
            alt={`${monster.name} icon`}
          />
          <VStack align="start" spacing={0}>
            <Text>{monster.name}</Text>
            <Text fontSize="sm" color="gray.500">Level {monster.level}</Text>
          </VStack>
        </HStack>
      </ListItem>
    );
  };

  const renderCombatLog = () => (
    <Box bg="gray.800" borderRadius="md" p={2} mt={4} maxH="120px" overflowY="auto">
      {combatLog.map((entry, idx) => (
        <Text key={idx} fontSize="sm" color="gray.200">{entry}</Text>
      ))}
      <div ref={logEndRef} />
    </Box>
  );

  const renderCombatCard = () => {
    if (!selectedMonster) {
      return (
        <Card>
          <CardBody>
            <Text textAlign="center">Select a monster from the list to begin combat</Text>
          </CardBody>
        </Card>
      );
    }

    const action = (currentLocation.actions as (SkillAction | CombatAction | CombatSelectionAction)[]).find(
      (a) => a.type === 'combat' && (a as CombatAction).monster.id === selectedMonster.id
    ) as CombatAction;

    const isInCombat = currentAction?.id === action?.id;
    const monsterForDisplay = isInCombat ? (currentAction as CombatAction).monster : selectedMonster;
    const monsterName = monsterForDisplay?.name || 'monster';

    return (
      <Card minH="680px">
        <CardBody>
          {onBack && (
            <Button mb={4} colorScheme="gray" onClick={onBack} size="sm">Back to Monster List</Button>
          )}
          <HStack align="start" spacing={6} w="100%">
            <Box flex="1" minW={0}>
              <VStack spacing={4} align="stretch">
                {/* Combat Cards Display */}
                <Grid templateColumns="1fr auto 1fr" gap={6} alignItems="start">
                  {/* Player Card */}
                  <Box>
                    {renderCombatantCard(character, true)}
                  </Box>

                  {/* VS Text */}
                  <VStack spacing={2} alignSelf="center" pt={8}>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.500">VS</Text>
                    {isInCombat ? (
                      <Text fontSize="sm" color="green.500" fontWeight="semibold" textAlign="center">
                        🗡️ Fighting!
                      </Text>
                    ) : (
                      <Text fontSize="sm" color="gray.400" textAlign="center">
                        Ready to Fight
                      </Text>
                    )}
                  </VStack>

                  {/* Monster Card */}
                  <Box>
                    {renderCombatantCard(monsterForDisplay, false)}
                  </Box>
                </Grid>

                {/* Combat Action Progress */}
                {isInCombat && (
                  <Card variant="outline" bg="gray.50" _dark={{ bg: 'gray.800' }}>
                    <CardBody>
                      <VStack spacing={3}>
                        <Text fontSize="lg" fontWeight="semibold" textAlign="center">
                          ⚔️ Combat in Progress
                        </Text>
                        <Grid templateColumns="1fr auto 1fr" gap={4} alignItems="center" w="100%">
                          {/* Player Action Progress */}
                          <VStack>
                            <Text fontSize="sm" fontWeight="medium" color="blue.600" _dark={{ color: 'blue.300' }}>
                              {character.name}'s Turn
                            </Text>
                            <Box w="180px">
                              <Progress 
                                value={actionProgress} 
                                colorScheme="blue" 
                                size="lg"
                                borderRadius="md"
                              />
                              <Text fontSize="xs" textAlign="center" mt={1} color="gray.600" _dark={{ color: 'gray.400' }}>
                                Attack: {Math.min(100, Math.floor(actionProgress))}%
                              </Text>
                            </Box>
                          </VStack>

                          {/* Combat Icon */}
                          <Box textAlign="center">
                            <Text fontSize="2xl">⚔️</Text>
                          </Box>

                          {/* Monster Action Progress */}
                          <VStack>
                            <Text fontSize="sm" fontWeight="medium" color="red.600" _dark={{ color: 'red.300' }}>
                              {monsterForDisplay.name}'s Turn
                            </Text>
                            <Box w="180px">
                              <Progress 
                                value={actionProgress} 
                                colorScheme="red" 
                                size="lg"
                                borderRadius="md"
                              />
                              <Text fontSize="xs" textAlign="center" mt={1} color="gray.600" _dark={{ color: 'gray.400' }}>
                                Attack: {Math.min(100, Math.floor(actionProgress))}%
                              </Text>
                            </Box>
                          </VStack>
                        </Grid>
                      </VStack>
                    </CardBody>
                  </Card>
                )}

                <Divider />

                {/* Combat Controls Grid */}
                <Grid templateColumns="1fr 1.2fr 1fr" gap={4} alignItems="start" minH="340px">
                  {/* Prayer Section (left) */}
                  <Card variant="outline" minH="320px">
                    <CardHeader pb={2}>
                      <Heading size="sm">Prayer</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                      <VStack spacing={2}>
                        <SimpleGrid columns={2} spacing={2}>
                          {['Strength', 'Attack', 'Defence', 'Protection'].map(prayer => (
                            <Button
                              key={prayer}
                              size="sm"
                              variant={activePrayer === prayer ? 'solid' : 'outline'}
                              colorScheme={activePrayer === prayer ? 'purple' : 'gray'}
                              onClick={() => setActivePrayer(prayer === activePrayer ? null : prayer)}
                            >
                              {prayer}
                            </Button>
                          ))}
                        </SimpleGrid>
                        <Box w="100%">
                          <Progress 
                            value={character.prayer} 
                            max={character.maxPrayer}
                            colorScheme="purple" 
                          />
                        </Box>
                        {/* Auto-fight toggle */}
                        <Button
                          mt={4}
                          colorScheme={autoFight ? 'green' : 'gray'}
                          variant={autoFight ? 'solid' : 'outline'}
                          onClick={() => setAutoFight(v => !v)}
                          size="sm"
                        >
                          {autoFight ? 'Auto-fight: ON' : 'Auto-fight: OFF'}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Combat Styles + Consumables (center) */}
                  <Card variant="outline" minH="320px">
                    <CardHeader pb={2}>
                      <Heading size="sm">Combat Style & Consumables</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                      <VStack spacing={3} align="stretch">
                        {/* Active Combat Style Display */}
                        <HStack justify="center" mb={1}>
                          {attackStyle === 'accurate' && <><FaBullseye color="#3182ce" /><Text fontWeight="bold" color="blue.300">Accurate</Text></>}
                          {attackStyle === 'aggressive' && <><FaFistRaised color="#e53e3e" /><Text fontWeight="bold" color="red.300">Aggressive</Text></>}
                          {attackStyle === 'defensive' && <><FaShieldAlt color="#38a169" /><Text fontWeight="bold" color="green.300">Defensive</Text></>}
                        </HStack>
                        {/* Combat Styles */}
                        <HStack justify="center" spacing={2}>
                          <Tooltip label="Accurate" hasArrow><Button
                            size="sm"
                            variant="ghost"
                            colorScheme={attackStyle === 'accurate' ? 'blue' : 'gray'}
                            onClick={() => setAttackStyle('accurate')}
                            isDisabled={isInCombat}
                            leftIcon={<FaBullseye />}
                            minW="90px"
                          >
                            Accurate
                          </Button></Tooltip>
                          <Tooltip label="Aggressive" hasArrow><Button
                            size="sm"
                            variant="ghost"
                            colorScheme={attackStyle === 'aggressive' ? 'red' : 'gray'}
                            onClick={() => setAttackStyle('aggressive')}
                            isDisabled={isInCombat}
                            leftIcon={<FaFistRaised />}
                            minW="90px"
                          >
                            Aggressive
                          </Button></Tooltip>
                          <Tooltip label="Defensive" hasArrow><Button
                            size="sm"
                            variant="ghost"
                            colorScheme={attackStyle === 'defensive' ? 'green' : 'gray'}
                            onClick={() => setAttackStyle('defensive')}
                            isDisabled={isInCombat}
                            leftIcon={<FaShieldAlt />}
                            minW="90px"
                          >
                            Defensive
                          </Button></Tooltip>
                        </HStack>
                        <Button
                          colorScheme={isInCombat ? 'red' : 'blue'}
                          size="sm"
                          width="full"
                          onClick={() => {
                            if (isInCombat) {
                              stopAction();
                            } else {
                              handleStartCombat(action);
                            }
                          }}
                        >
                          {isInCombat ? 'Stop Fighting' : `Fight ${selectedMonster.name}`}
                        </Button>
                        {/* Consumables */}
                        <Box>
                          <Heading size="xs" mb={2}>Consumables</Heading>
                          <SimpleGrid columns={4} spacing={2}>
                            {consumableItems.map(item => {
                              const itemDetails = getItemById(item.id);
                              return (
                                <Tooltip 
                                  key={item.id} 
                                  label={`Heals ${itemDetails?.healing || 0} HP`}
                                >
                                  <Box>
                                    <IconButton
                                      aria-label={`Use ${item.name}`}
                                      icon={
                                        <Image 
                                          src={itemDetails?.icon || `/assets/items/${item.id}.png`}
                                          fallbackSrc="/assets/items/placeholder.png"
                                          boxSize="28px"
                                          objectFit="contain"
                                        />
                                      }
                                      onClick={() => handleConsumableUse(item)}
                                      variant="outline"
                                      size="sm"
                                    />
                                    <Text fontSize="xs" textAlign="center" mt={1}>
                                      {item.quantity}
                                    </Text>
                                  </Box>
                                </Tooltip>
                              );
                            })}
                          </SimpleGrid>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Equipment Section (right) */}
                  <Card variant="outline" minH="340px">
                    <CardHeader pb={2}>
                      <Heading size="sm">Equipment</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Box minH="300px">
                        <EquipmentPanel />
                      </Box>
                    </CardBody>
                  </Card>
                </Grid>
              </VStack>
            </Box>
            <Box w="320px" maxW="40%" minH="300px">
              <Tabs variant="enclosed" mt={4}>
                <TabList>
                  <Tab>Combat Log</Tab>
                  <Tab>Possible Drops</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    {renderCombatLog()}
                  </TabPanel>
                  <TabPanel>
                    <SimpleGrid columns={[2, 3, 4]} spacing={4}>
                      {possibleDrops.length === 0 ? (
                        <Text>No drops</Text>
                      ) : (
                        possibleDrops.map((drop) => {
                          const item = getItemById(drop.itemId);
                          return item ? (
                            <Box key={item.id} textAlign="center">
                              <Image src={item.icon} alt={item.name} boxSize="40px" mx="auto" />
                              <Text fontSize="sm">{item.name}</Text>
                              <Text fontSize="xs" color="gray.500">x{drop.quantity} ({drop.chance}%)</Text>
                            </Box>
                          ) : null;
                        })
                      )}
                    </SimpleGrid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </HStack>
        </CardBody>
      </Card>
    );
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6} textAlign="center">{currentLocation.name}</Heading>

      <Grid templateColumns="300px 1fr" gap={6}>
        {/* Monster List */}
        <GridItem>
          <Card>
            <CardHeader>
              <Heading size="md">Monsters</Heading>
            </CardHeader>
            <CardBody>
              <List spacing={2}>
                {currentLocation.actions
                  .filter(action => action.type === 'combat')
                  .map(action => renderMonsterListItem(action as CombatAction))}
              </List>
            </CardBody>
          </Card>
        </GridItem>

        {/* Combat Area */}
        <GridItem>
          {renderCombatCard()}
        </GridItem>
      </Grid>
    </Box>
  );
}; 