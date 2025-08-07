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
  Switch,
  FormControl,
  FormLabel,
  Select,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { useGameStore } from '../../store/gameStore';
import type { GameState, ItemReward, SkillAction, CombatAction, CombatSelectionAction, Monster, Location, Character } from '../../types/game';
import { EquipmentPanel } from '../equipment/EquipmentPanel';
import { getItemById, ITEMS } from '../../data/items';
import { calculateMaxHit, calculateAccuracy } from '../../combat/combatCalculations';
import { getCombatStyle } from '../../combat/combatTriangle';
import React from 'react';
import { FaBullseye, FaFistRaised, FaShieldAlt, FaFire, FaHeart, FaInfoCircle } from 'react-icons/fa';

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
    resetLastCombatRound,
    toggleAutoEating,
    setAutoEatingFood,
    checkAutoEating
  } = useGameStore() as GameState & { useConsumable: (itemId: string, quantity?: number) => void, lastCombatRound: any, resetLastCombatRound: () => void };

  // State for separate attack progress tracking
  const [playerAttackProgress, setPlayerAttackProgress] = React.useState(0);
  const [monsterAttackProgress, setMonsterAttackProgress] = React.useState(0);
  const [attackTimers, setAttackTimers] = React.useState<{
    player: NodeJS.Timeout | null;
    monster: NodeJS.Timeout | null;
  }>({ player: null, monster: null });
  
  // State for current attack names
  const [currentPlayerAttack, setCurrentPlayerAttack] = React.useState<string>('');
  const [currentMonsterAttack, setCurrentMonsterAttack] = React.useState<string>('');
  
  // Monster info modal
  const { isOpen: isMonsterInfoOpen, onOpen: onMonsterInfoOpen, onClose: onMonsterInfoClose } = useDisclosure();

  // Helper function to get auto-eating trigger info
  const getAutoEatingInfo = () => {
    if (!character) return null;
    const tier = character.autoEating.tier;
    const maxHp = character.maxHitpoints;
    
    const thresholds = {
      1: { triggerAt: 25, eatTo: 50 },
      2: { triggerAt: 30, eatTo: 55 },
      3: { triggerAt: 40, eatTo: 70 }
    };
    
    const threshold = thresholds[tier as keyof typeof thresholds];
    if (!threshold) return null;
    
    return {
      triggerHp: Math.floor((threshold.triggerAt / 100) * maxHp),
      targetHp: Math.floor((threshold.eatTo / 100) * maxHp),
      triggerPercent: threshold.triggerAt,
      targetPercent: threshold.eatTo
    };
  };

  // Helper function to get weapon attack speed in seconds
  const getDisplayWeaponSpeed = (weaponId: string | undefined): number => {
    if (!weaponId) return 2.5; // Default unarmed speed

    // Try to get speed from item definition
    const weaponItem = getItemById(weaponId);
    if (weaponItem?.speed) {
      return weaponItem.speed;
    }
    
    // Fallback to weapon type mapping
    const weaponSpeeds: Record<string, number> = {
      dagger: 2.0, scimitar: 2.4, sword: 2.5, mace: 2.6,
      longsword: 3.0, axe: 3.0, battleaxe: 3.5, warhammer: 3.8,
      two_handed_sword: 4.2
    };
    
    const weaponType = weaponId.split('_').slice(1).join('_');
    return weaponSpeeds[weaponType] || 2.5;
  };

  // Helper function to get monster attack speed in seconds
  const getDisplayMonsterSpeed = (monster: Monster): number => {
    if (monster.attackSpeed) return monster.attackSpeed;
    
    // Default speeds based on level
    if (monster.level <= 10) return 2.2;
    if (monster.level <= 30) return 2.8;
    if (monster.level <= 60) return 3.2;
    return 3.8;
  };

  // Helper function to get attack name for player
  const getPlayerAttackName = (): string => {
    const weaponId = character?.equipment?.weapon?.id;
    if (!weaponId) return 'Punch';
    
    // Get weapon name and create attack name
    const weaponItem = getItemById(weaponId);
    if (weaponItem?.name) {
      const weaponName = weaponItem.name.split(' ').pop(); // Get last word (e.g., "Sword" from "Bronze Sword")
      return `${weaponName} Strike`;
    }
    
    return 'Attack';
  };

  // Helper function to get attack name for monster
  const getMonsterAttackName = (monster: Monster): string => {
    const monsterName = monster.name.toLowerCase();
    
    // Special attacks for specific monsters
    if (monsterName.includes('dragon')) {
      return Math.random() > 0.7 ? 'Dragonbreath' : 'Claw Strike';
    }
    
    if (monsterName.includes('wizard') || monsterName.includes('mage')) {
      return 'Magic Blast';
    }
    
    if (monsterName.includes('archer') || monsterName.includes('ranger')) {
      return 'Arrow Shot';
    }
    
    if (monsterName.includes('chicken')) {
      return 'Peck';
    }
    
    if (monsterName.includes('cow')) {
      return 'Horn Charge';
    }
    
    if (monsterName.includes('farmer')) {
      return 'Pitchfork Jab';
    }
    
    if (monsterName.includes('goblin')) {
      return 'Crude Strike';
    }
    
    // Default attacks based on monster type
    return 'Attack';
  };

  // State for selected monster (before combat starts)
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(monsterOverride || null);
  // State for selected attack style
  const [attackStyle, setAttackStyle] = useState<'accurate' | 'aggressive' | 'defensive'>('accurate');
  
  // Update combat action when attack style changes during active combat
  const updateCombatStyle = (newStyle: 'accurate' | 'aggressive' | 'defensive') => {
    setAttackStyle(newStyle);
    
    // If combat is active, update the current action's attack style
    if (isActionInProgress && currentAction?.type === 'combat') {
      const updatedAction = {
        ...currentAction as CombatAction,
        attackStyle: newStyle
      };
      // Note: This updates the action in progress without restarting the timing
      // The game store will use the updated attack style in the next combat round
    }
  };
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

  // Current monster for display (used in both combat card and modal)
  const monsterForDisplay = React.useMemo(() => {
    if (currentAction?.type === 'combat' && selectedMonster && currentAction.id.includes(selectedMonster.id)) {
      return (currentAction as CombatAction).monster;
    }
    return selectedMonster;
  }, [currentAction, selectedMonster]);

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
      
      // Check auto-eating after taking damage
      setTimeout(() => {
        checkAutoEating();
      }, 400); // Slight delay to allow combat to process
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
            <Text fontWeight="bold" fontSize="lg" color={isPlayer ? 'blue.600' : 'red.600'} _dark={{ color: isPlayer ? 'blue.300' : 'red.300' }}>
              {name}
            </Text>
            {!isPlayer ? (
              <HStack spacing={2}>
                <IconButton
                  aria-label="Monster Info"
                  icon={<FaInfoCircle />}
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  onClick={onMonsterInfoOpen}
                />
                <Image 
                  src={(entity as Monster).thumbnail || `/assets/monsters/${(entity as Monster).id}.png`}
                  fallbackSrc="/assets/monsters/placeholder.png"
                  boxSize="60px"
                  objectFit="contain"
                  alt={`${name} icon`}
                />
              </HStack>
            ) : null}
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
            <HStack spacing={2} w="100%">
              {/* Max Hit & Accuracy Combined */}
              <Box 
                bg={isPlayer ? 'blue.50' : 'red.50'} 
                p={2} 
                borderRadius="md" 
                border="1px solid"
                borderColor={isPlayer ? 'blue.200' : 'red.200'}
                flex="1"
                _dark={{
                  bg: isPlayer ? 'blue.900' : 'red.900',
                  borderColor: isPlayer ? 'blue.600' : 'red.600'
                }}
              >
                <VStack spacing={1}>
                  <HStack justify="space-between" w="100%">
                    <HStack spacing={1}>
                      <FaFire color={isPlayer ? '#3182ce' : '#e53e3e'} size="12px" />
                      <Text fontSize="xs" fontWeight="semibold">Max Hit</Text>
                    </HStack>
                    <Text 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color={isPlayer ? 'blue.600' : 'red.600'}
                      _dark={{ color: isPlayer ? 'blue.300' : 'red.300' }}
                    >
                      {maxHit}
                    </Text>
                  </HStack>
                  
                  {(character && selectedMonster) && (
                    <HStack justify="space-between" w="100%">
                      <HStack spacing={1}>
                        <FaBullseye color={isPlayer ? '#38a169' : '#d69e2e'} size="10px" />
                        <Text fontSize="xs" fontWeight="semibold">Accuracy</Text>
                      </HStack>
                      <Text 
                        fontSize="xs" 
                        fontWeight="bold" 
                        color={isPlayer ? 'green.600' : 'orange.600'}
                        _dark={{ color: isPlayer ? 'green.300' : 'orange.300' }}
                      >
                        {Math.round(getAccuracy(entity, isPlayer) * 100)}%
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
              
              {/* Attack Speed Display */}
              <Box 
                bg={isPlayer ? 'purple.50' : 'yellow.50'} 
                p={2} 
                borderRadius="md" 
                border="1px solid"
                borderColor={isPlayer ? 'purple.200' : 'yellow.200'}
                minW="80px"
                _dark={{
                  bg: isPlayer ? 'purple.900' : 'yellow.900',
                  borderColor: isPlayer ? 'purple.600' : 'yellow.600'
                }}
              >
                <VStack spacing={0}>
                  <HStack spacing={1}>
                    <Text fontSize="xs" fontWeight="semibold">Speed</Text>
                  </HStack>
                  <Text 
                    fontSize="xs" 
                    fontWeight="bold" 
                    color={isPlayer ? 'purple.600' : 'yellow.600'}
                    _dark={{ color: isPlayer ? 'purple.300' : 'yellow.300' }}
                  >
                    {isPlayer ? 
                      getDisplayWeaponSpeed(character?.equipment?.weapon?.id).toFixed(1) :
                      getDisplayMonsterSpeed(entity as Monster).toFixed(1)
                    }s
                  </Text>
                </VStack>
              </Box>
            </HStack>


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

    // Effect to manage separate attack timers during combat
    React.useEffect(() => {
      if (isInCombat && currentAction?.type === 'combat') {
        const combatAction = currentAction as CombatAction;
        const playerSpeed = getDisplayWeaponSpeed(character?.equipment?.weapon?.id) * 1000; // Convert to ms
        const monsterSpeed = getDisplayMonsterSpeed(combatAction.monster) * 1000; // Convert to ms

        // Clear any existing timers
        if (attackTimers.player) clearInterval(attackTimers.player);
        if (attackTimers.monster) clearInterval(attackTimers.monster);

        // Set initial attack names
        setCurrentPlayerAttack(getPlayerAttackName());
        setCurrentMonsterAttack(getMonsterAttackName(combatAction.monster));

        // Start player attack timer
        const playerTimer = setInterval(() => {
          setPlayerAttackProgress(prev => {
            if (prev >= 100) {
              // Reset and set new attack name
              setCurrentPlayerAttack(getPlayerAttackName());
              return 0; // Reset to 0 when attack completes
            }
            // Calculate increment: 100% / (total time in ms / update interval)
            const increment = (100 * 100) / playerSpeed; // 100ms updates over playerSpeed ms total
            return Math.min(100, prev + increment);
          });
        }, 100);

        // Start monster attack timer
        const monsterTimer = setInterval(() => {
          setMonsterAttackProgress(prev => {
            if (prev >= 100) {
              // Reset and set new attack name (random for special attacks)
              setCurrentMonsterAttack(getMonsterAttackName(combatAction.monster));
              return 0; // Reset to 0 when attack completes
            }
            // Calculate increment: 100% / (total time in ms / update interval)
            const increment = (100 * 100) / monsterSpeed; // 100ms updates over monsterSpeed ms total
            return Math.min(100, prev + increment);
          });
        }, 100);

        setAttackTimers({ player: playerTimer, monster: monsterTimer });

        return () => {
          clearInterval(playerTimer);
          clearInterval(monsterTimer);
        };
      } else {
        // Clear timers when not in combat
        if (attackTimers.player) clearInterval(attackTimers.player);
        if (attackTimers.monster) clearInterval(attackTimers.monster);
        setAttackTimers({ player: null, monster: null });
        setPlayerAttackProgress(0);
        setMonsterAttackProgress(0);
        setCurrentPlayerAttack('');
        setCurrentMonsterAttack('');
      }
    }, [isInCombat, currentAction?.id, character?.equipment?.weapon?.id]);

    // Cleanup timers on unmount
    React.useEffect(() => {
      return () => {
        if (attackTimers.player) clearInterval(attackTimers.player);
        if (attackTimers.monster) clearInterval(attackTimers.monster);
      };
    }, []);

    return (
      <Card minH="520px">
        <CardBody py={3}>
          {onBack && (
            <Button mb={2} colorScheme="gray" onClick={onBack} size="sm">Back to Monster List</Button>
          )}
          <HStack align="start" spacing={4} w="100%">
            <Box flex="1" minW={0}>
              <VStack spacing={2} align="stretch">
                {/* Combat Cards Display */}
                <Grid templateColumns="1fr auto 1fr" gap={4} alignItems="start">
                  {/* Player Card */}
                  <Box>
                    {renderCombatantCard(character, true)}
                  </Box>

                  {/* VS Text */}
                  <VStack spacing={1} alignSelf="center" pt={4}>
                    <Text fontSize="xl" fontWeight="bold" color="gray.500">VS</Text>
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
                  <Box bg="gray.100" _dark={{ bg: 'gray.700', borderColor: 'gray.600' }} p={3} borderRadius="md" border="1px solid" borderColor="gray.200">
                    <Text fontSize="xs" fontWeight="medium" textAlign="center" mb={2}>⚔️ Combat Progress</Text>
                    <HStack spacing={6} w="100%" justify="center">
                      {/* Player Attack Progress (Left) */}
                      <VStack spacing={1} w="140px">
                        <Text fontSize="xs" color="blue.600" _dark={{ color: 'blue.300' }} fontWeight="semibold">
                          {character?.name?.slice(0, 10) || 'Player'}
                        </Text>
                        <Text fontSize="xs" color="blue.500" _dark={{ color: 'blue.400' }} fontWeight="medium">
                          {currentPlayerAttack}
                        </Text>
                        <Progress 
                          value={playerAttackProgress} 
                          colorScheme="blue" 
                          size="md"
                          borderRadius="md"
                          w="100%"
                        />
                        <Text fontSize="xs" color="gray.600" _dark={{ color: 'gray.400' }}>
                          {Math.floor(playerAttackProgress)}%
                        </Text>
                      </VStack>
                      
                      {/* VS Separator */}
                      <VStack spacing={0}>
                        <Text fontSize="lg">⚔️</Text>
                        <Text fontSize="xs" color="gray.500">VS</Text>
                      </VStack>
                      
                      {/* Monster Attack Progress (Right) */}
                      <VStack spacing={1} w="140px">
                        <Text fontSize="xs" color="red.600" _dark={{ color: 'red.300' }} fontWeight="semibold">
                          {monsterForDisplay?.name?.slice(0, 10) || 'Monster'}
                        </Text>
                        <Text fontSize="xs" color="red.500" _dark={{ color: 'red.400' }} fontWeight="medium">
                          {currentMonsterAttack}
                        </Text>
                        <Progress 
                          value={monsterAttackProgress} 
                          colorScheme="red" 
                          size="md"
                          borderRadius="md"
                          w="100%"
                        />
                        <Text fontSize="xs" color="gray.600" _dark={{ color: 'gray.400' }}>
                          {Math.floor(monsterAttackProgress)}%
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                )}

                <Divider />

                {/* Combat Controls Grid */}
                <Grid templateColumns="1fr 1.2fr 1fr" gap={3} alignItems="start" minH="280px">
                  {/* Prayer Section (left) */}
                  <Card variant="outline" minH="260px">
                    <CardHeader py={1} pb={1}>
                      <Heading size="xs">Prayer</Heading>
                    </CardHeader>
                    <CardBody py={1}>
                      <VStack spacing={1}>
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
                  <Card variant="outline" minH="260px">
                    <CardHeader py={1} pb={1}>
                      <Heading size="xs">Combat Style & Consumables</Heading>
                    </CardHeader>
                    <CardBody py={1}>
                      <VStack spacing={1} align="stretch">
                        {/* Active Combat Style Display */}
                        <HStack justify="center" mb={1}>
                          {attackStyle === 'accurate' && <><FaBullseye color="#3182ce" /><Text fontWeight="bold" color="blue.300">Accurate</Text></>}
                          {attackStyle === 'aggressive' && <><FaFistRaised color="#e53e3e" /><Text fontWeight="bold" color="red.300">Aggressive</Text></>}
                          {attackStyle === 'defensive' && <><FaShieldAlt color="#38a169" /><Text fontWeight="bold" color="green.300">Defensive</Text></>}
                        </HStack>
                        {/* Combat Styles */}
                        <HStack justify="center" spacing={2}>
                          <Tooltip label="Accurate - Balanced attack and defence" hasArrow><Button
                            size="sm"
                            variant="ghost"
                            colorScheme={attackStyle === 'accurate' ? 'blue' : 'gray'}
                            onClick={() => updateCombatStyle('accurate')}
                            leftIcon={<FaBullseye />}
                            minW="90px"
                          >
                            Accurate
                          </Button></Tooltip>
                          <Tooltip label="Aggressive - Higher damage, trains Strength" hasArrow><Button
                            size="sm"
                            variant="ghost"
                            colorScheme={attackStyle === 'aggressive' ? 'red' : 'gray'}
                            onClick={() => updateCombatStyle('aggressive')}
                            leftIcon={<FaFistRaised />}
                            minW="90px"
                          >
                            Aggressive
                          </Button></Tooltip>
                          <Tooltip label="Defensive - Better defence, trains Defence" hasArrow><Button
                            size="sm"
                            variant="ghost"
                            colorScheme={attackStyle === 'defensive' ? 'green' : 'gray'}
                            onClick={() => updateCombatStyle('defensive')}
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
                        
                        {/* Auto-eating controls */}
                        <Box 
                          bg={character?.autoEating.tier > 0 ? "gray.700" : "gray.800"} 
                          p={1} 
                          borderRadius="sm"
                          border={character?.autoEating.tier > 0 && character?.autoEating.enabled ? "1px solid" : "none"}
                          borderColor={character?.autoEating.tier > 0 && character?.autoEating.enabled ? "green.400" : "transparent"}
                        >
                          <HStack justify="space-between" mb={1}>
                            <HStack spacing={1}>
                              <Text fontSize="xs" fontWeight="semibold" color="white">Auto-Eat</Text>
                              {character?.autoEating.tier > 0 && character?.autoEating.enabled && (
                                <Text fontSize="xs" color="green.300">●</Text>
                              )}
                            </HStack>
                            {character?.autoEating.tier > 0 ? (
                              <Badge colorScheme="green" size="xs">T{character.autoEating.tier}</Badge>
                            ) : (
                              <Badge colorScheme="red" size="xs">🔒</Badge>
                            )}
                          </HStack>
                          
                          <VStack spacing={1} align="stretch">
                            <HStack justify="space-between">
                              <Text fontSize="xs" color="white">Enable</Text>
                              <Switch
                                size="sm"
                                isChecked={character?.autoEating.enabled || false}
                                onChange={toggleAutoEating}
                                isDisabled={character?.autoEating.tier === 0}
                              />
                            </HStack>
                            
                            {character?.autoEating.tier > 0 && (
                              <>
                                <Select
                                  size="xs"
                                  bg="gray.600"
                                  color="white"
                                  borderColor="gray.500"
                                  value={character?.autoEating.selectedFood || ''}
                                  onChange={(e) => setAutoEatingFood(e.target.value || null)}
                                  placeholder="Select food..."
                                  fontSize="xs"
                                >
                                  {character?.bankTabs
                                    ?.find(tab => tab.id === 'main')
                                    ?.items.filter(item => ITEMS[item.id]?.type === 'consumable' && ITEMS[item.id]?.healing)
                                    .map(item => (
                                      <option key={item.id} value={item.id}>
                                        {ITEMS[item.id]?.name} ({item.quantity})
                                      </option>
                                    ))}
                                </Select>
                                
                                <Text fontSize="xs" color="gray.300">
                                  {(() => {
                                    const info = getAutoEatingInfo();
                                    if (!info) return '';
                                    return `Trigger: ${info.triggerHp} HP (${info.triggerPercent}%) → ${info.targetHp} HP (${info.targetPercent}%)`;
                                  })()}
                                </Text>
                              </>
                            )}
                          </VStack>
                        </Box>
                        
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
                  <Card variant="outline" minH="260px">
                    <CardHeader py={1} pb={1}>
                      <Heading size="xs">Equipment</Heading>
                    </CardHeader>
                    <CardBody py={1}>
                      <Box minH="240px">
                        <EquipmentPanel />
                      </Box>
                    </CardBody>
                  </Card>
                </Grid>
              </VStack>
            </Box>
            <Box w="320px" maxW="40%" minH="260px">
              <Tabs variant="enclosed" mt={2}>
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
    <Box position="relative" width="100%" height="100vh" overflow="hidden">
      {/* Combat Location background image */}
      {location.background && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgImage={`url(${location.background})`}
          bgSize="cover"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgAttachment="fixed"
          zIndex={0}
          _after={{
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: 'rgba(0,0,0,0.55)',
            zIndex: 1
          }}
        />
      )}

      {/* Content */}
      <Box position="relative" zIndex={2} p={6} height="100vh" overflowY="auto">
        <Heading size="lg" mb={6} textAlign="center" color="white">{currentLocation.name}</Heading>

        <Grid templateColumns="300px 1fr" gap={6}>
          {/* Monster List */}
          <GridItem>
            <Card bg="blackAlpha.800" borderColor="gray.600">
              <CardHeader>
                <Heading size="md" color="white">Monsters</Heading>
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

      {/* Monster Info Modal */}
      <Modal isOpen={isMonsterInfoOpen} onClose={onMonsterInfoClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack spacing={3}>
            {monsterForDisplay && (
              <>
                <Image 
                  src={monsterForDisplay.thumbnail || `/assets/monsters/${monsterForDisplay.id}.png`}
                  fallbackSrc="/assets/monsters/placeholder.png"
                  boxSize="40px"
                  objectFit="contain"
                  alt={`${monsterForDisplay.name} icon`}
                />
                <Text>{monsterForDisplay.name} Info</Text>
              </>
            )}
            {!monsterForDisplay && (
              <Text>Monster Info</Text>
            )}
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {monsterForDisplay ? (
            <VStack spacing={4} align="stretch">
              {/* Basic Info */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={2}>Basic Information</Text>
                <SimpleGrid columns={2} spacing={4}>
                  <Stat>
                    <StatLabel>Combat Level</StatLabel>
                    <StatNumber>{monsterForDisplay.level}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Hitpoints</StatLabel>
                    <StatNumber>{monsterForDisplay.maxHitpoints || 100}</StatNumber>
                  </Stat>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Offensive Stats */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={3} color="red.600" _dark={{ color: 'red.300' }}>
                  ⚔️ Offensive Stats
                </Text>
                <SimpleGrid columns={3} spacing={3} mb={4}>
                  <Box textAlign="center" p={3} bg="red.50" _dark={{ bg: 'red.900' }} borderRadius="md" border="1px solid" borderColor="red.200" _dark={{ borderColor: 'red.600' }}>
                    <Text fontSize="xs" color="red.600" _dark={{ color: 'red.300' }} fontWeight="semibold">STAB</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.attackStab || 0}</Text>
                  </Box>
                  <Box textAlign="center" p={3} bg="red.50" _dark={{ bg: 'red.900' }} borderRadius="md" border="1px solid" borderColor="red.200" _dark={{ borderColor: 'red.600' }}>
                    <Text fontSize="xs" color="red.600" _dark={{ color: 'red.300' }} fontWeight="semibold">SLASH</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.attackSlash || 0}</Text>
                  </Box>
                  <Box textAlign="center" p={3} bg="red.50" _dark={{ bg: 'red.900' }} borderRadius="md" border="1px solid" borderColor="red.200" _dark={{ borderColor: 'red.600' }}>
                    <Text fontSize="xs" color="red.600" _dark={{ color: 'red.300' }} fontWeight="semibold">CRUSH</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.attackCrush || 0}</Text>
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} spacing={3}>
                  <Box textAlign="center" p={3} bg="purple.50" _dark={{ bg: 'purple.900' }} borderRadius="md" border="1px solid" borderColor="purple.200" _dark={{ borderColor: 'purple.600' }}>
                    <Text fontSize="xs" color="purple.600" _dark={{ color: 'purple.300' }} fontWeight="semibold">MAGIC</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.attackMagic || 0}</Text>
                  </Box>
                  <Box textAlign="center" p={3} bg="green.50" _dark={{ bg: 'green.900' }} borderRadius="md" border="1px solid" borderColor="green.200" _dark={{ borderColor: 'green.600' }}>
                    <Text fontSize="xs" color="green.600" _dark={{ color: 'green.300' }} fontWeight="semibold">RANGED</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.attackRanged || 0}</Text>
                  </Box>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Defensive Stats */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={3} color="blue.600" _dark={{ color: 'blue.300' }}>
                  🛡️ Defensive Stats
                </Text>
                <SimpleGrid columns={3} spacing={3} mb={4}>
                  <Box textAlign="center" p={3} bg="blue.50" _dark={{ bg: 'blue.900' }} borderRadius="md" border="1px solid" borderColor="blue.200" _dark={{ borderColor: 'blue.600' }}>
                    <Text fontSize="xs" color="blue.600" _dark={{ color: 'blue.300' }} fontWeight="semibold">STAB</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.defenceStab || 0}</Text>
                  </Box>
                  <Box textAlign="center" p={3} bg="blue.50" _dark={{ bg: 'blue.900' }} borderRadius="md" border="1px solid" borderColor="blue.200" _dark={{ borderColor: 'blue.600' }}>
                    <Text fontSize="xs" color="blue.600" _dark={{ color: 'blue.300' }} fontWeight="semibold">SLASH</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.defenceSlash || 0}</Text>
                  </Box>
                  <Box textAlign="center" p={3} bg="blue.50" _dark={{ bg: 'blue.900' }} borderRadius="md" border="1px solid" borderColor="blue.200" _dark={{ borderColor: 'blue.600' }}>
                    <Text fontSize="xs" color="blue.600" _dark={{ color: 'blue.300' }} fontWeight="semibold">CRUSH</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.defenceCrush || 0}</Text>
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} spacing={3}>
                  <Box textAlign="center" p={3} bg="purple.50" _dark={{ bg: 'purple.900' }} borderRadius="md" border="1px solid" borderColor="purple.200" _dark={{ borderColor: 'purple.600' }}>
                    <Text fontSize="xs" color="purple.600" _dark={{ color: 'purple.300' }} fontWeight="semibold">MAGIC</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.defenceMagic || 0}</Text>
                  </Box>
                  <Box textAlign="center" p={3} bg="green.50" _dark={{ bg: 'green.900' }} borderRadius="md" border="1px solid" borderColor="green.200" _dark={{ borderColor: 'green.600' }}>
                    <Text fontSize="xs" color="green.600" _dark={{ color: 'green.300' }} fontWeight="semibold">RANGED</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.defenceRanged || 0}</Text>
                  </Box>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Strength Bonuses */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={3} color="orange.600" _dark={{ color: 'orange.300' }}>
                  💪 Strength Bonuses
                </Text>
                <SimpleGrid columns={3} spacing={3}>
                  <Box textAlign="center" p={3} bg="orange.50" _dark={{ bg: 'orange.900' }} borderRadius="md" border="1px solid" borderColor="orange.200" _dark={{ borderColor: 'orange.600' }}>
                    <Text fontSize="xs" color="orange.600" _dark={{ color: 'orange.300' }} fontWeight="semibold">MELEE</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.strengthMelee || 0}</Text>
                  </Box>
                  <Box textAlign="center" p={3} bg="green.50" _dark={{ bg: 'green.900' }} borderRadius="md" border="1px solid" borderColor="green.200" _dark={{ borderColor: 'green.600' }}>
                    <Text fontSize="xs" color="green.600" _dark={{ color: 'green.300' }} fontWeight="semibold">RANGED</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.strengthRanged || 0}</Text>
                  </Box>
                  <Box textAlign="center" p={3} bg="purple.50" _dark={{ bg: 'purple.900' }} borderRadius="md" border="1px solid" borderColor="purple.200" _dark={{ borderColor: 'purple.600' }}>
                    <Text fontSize="xs" color="purple.600" _dark={{ color: 'purple.300' }} fontWeight="semibold">MAGIC</Text>
                    <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.strengthMagic || 0}</Text>
                  </Box>
                </SimpleGrid>
                {(monsterForDisplay.stats?.prayerBonus || 0) !== 0 && (
                  <Box mt={3}>
                    <Box textAlign="center" p={3} bg="yellow.50" _dark={{ bg: 'yellow.900' }} borderRadius="md" border="1px solid" borderColor="yellow.200" _dark={{ borderColor: 'yellow.600' }} maxW="200px" mx="auto">
                      <Text fontSize="xs" color="yellow.600" _dark={{ color: 'yellow.300' }} fontWeight="semibold">PRAYER</Text>
                      <Text fontSize="lg" fontWeight="bold">{monsterForDisplay.stats?.prayerBonus || 0}</Text>
                    </Box>
                  </Box>
                )}
              </Box>

              <Divider />

              {/* Combat Performance */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={3}>Combat Performance</Text>
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <HStack mb={2}>
                      <FaFire color="#e53e3e" />
                      <Text fontWeight="semibold">Max Hit</Text>
                    </HStack>
                    <Text fontSize="2xl" fontWeight="bold" color="red.600" _dark={{ color: 'red.300' }}>
                      {getMaxHit(monsterForDisplay, false)}
                    </Text>
                  </Box>
                  <Box>
                    <HStack mb={2}>
                      <FaBullseye color="#d69e2e" />
                      <Text fontWeight="semibold">Accuracy vs You</Text>
                    </HStack>
                    <Text fontSize="2xl" fontWeight="bold" color="orange.600" _dark={{ color: 'orange.300' }}>
                      {character && Math.round(getAccuracy(monsterForDisplay, false) * 100)}%
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Attack Info */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={3}>Attack Information</Text>
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontWeight="semibold" mb={1}>Attack Speed</Text>
                    <Text fontSize="lg" color="purple.600" _dark={{ color: 'purple.300' }}>
                      {getDisplayMonsterSpeed(monsterForDisplay).toFixed(1)} seconds
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" mb={1}>Special Attacks</Text>
                    <VStack align="start" spacing={1}>
                      {monsterForDisplay.name.toLowerCase().includes('dragon') ? (
                        <>
                          <Text fontSize="sm">• Claw Strike (70%)</Text>
                          <Text fontSize="sm" color="red.500">• Dragonbreath (30%)</Text>
                        </>
                      ) : monsterForDisplay.name.toLowerCase().includes('wizard') ? (
                        <Text fontSize="sm">• Magic Blast</Text>
                      ) : monsterForDisplay.name.toLowerCase().includes('archer') ? (
                        <Text fontSize="sm">• Arrow Shot</Text>
                      ) : (
                        <Text fontSize="sm" color="gray.500">• Standard attacks only</Text>
                      )}
                    </VStack>
                  </Box>
                </SimpleGrid>
              </Box>
            </VStack>
          ) : (
            <Box textAlign="center" py={8}>
              <Text fontSize="lg" color="gray.500">
                No monster selected
              </Text>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onMonsterInfoClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </Box>
  );
}; 