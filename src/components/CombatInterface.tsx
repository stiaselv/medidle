import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Progress,
  Select,
  Tooltip,
  IconButton,
  Switch,
  FormControl,
  FormLabel,
  Badge
} from '@chakra-ui/react';
import { useGameStore } from '../store/gameStore';
import { calculateDamage } from '../combat/combatCalculations';
import { getCombatStyle } from '../combat/combatTriangle';
import { MONSTERS } from '../data/locations/combat';
import { ITEMS } from '../data/items';
import type { Monster, Character } from '../types/game';

interface CombatInterfaceProps {
  monsterId: string;
}

type AttackStyle = 'accurate' | 'aggressive' | 'defensive' | 'rapid' | 'longrange' | 'balanced';

export const CombatInterface: React.FC<CombatInterfaceProps> = ({ monsterId }) => {
  const { 
    character, 
    updateCharacter, 
    toggleAutoEating, 
    setAutoEatingFood, 
    checkAutoEating 
  } = useGameStore();

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
  
  // Redirect to login if no character
  if (!character) {
    return <div>Please log in to start combat.</div>;
  }

  const [monster, setMonster] = useState<Monster>({ ...MONSTERS[monsterId] });
  const [playerHitpoints, setPlayerHitpoints] = useState(character.hitpoints);
  const [monsterHitpoints, setMonsterHitpoints] = useState(monster.hitpoints);
  const [specialEnergy, setSpecialEnergy] = useState(character.specialEnergy);
  const [isSpecialAttackEnabled, setIsSpecialAttackEnabled] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [attackStyle, setAttackStyle] = useState<AttackStyle>('accurate');

  // Get available attack styles based on combat style
  const getAvailableAttackStyles = (): AttackStyle[] => {
    const combatStyle = getCombatStyle(character);
    switch (combatStyle) {
      case 'melee':
        return ['accurate', 'aggressive', 'defensive'];
      case 'ranged':
        return ['accurate', 'rapid', 'longrange'];
      case 'magic':
        return ['accurate', 'balanced', 'defensive'];
      default:
        return ['accurate'];
    }
  };

  // Reset combat when monster changes
  useEffect(() => {
    setMonster({ ...MONSTERS[monsterId] });
    setMonsterHitpoints(MONSTERS[monsterId].hitpoints);
    setPlayerHitpoints(character.hitpoints);
    setCombatLog([]);
    setIsPlayerTurn(true);
  }, [monsterId, character.hitpoints]);

  // Handle player attack
  const handlePlayerAttack = (useSpecial: boolean = false) => {
    if (!isPlayerTurn) return;

    // Calculate damage using enhanced combat system
    const damage = calculateDamage(
      character,
      attackStyle,
      monster,
      useSpecial,
      useSpecial ? 1.25 : 1.0, // Special attack bonus
      useSpecial ? 1.2 : 1.0 // Special attack accuracy
    );

    // Apply damage to monster
    const newMonsterHp = Math.max(0, monsterHitpoints - damage);
    setMonsterHitpoints(newMonsterHp);

    // Update combat log with attack style info
    setCombatLog(prev => [
      ...prev,
      `You hit the ${monster.name} for ${damage} damage using ${attackStyle} style!`
    ]);

    // Handle special attack energy
    if (useSpecial) {
      setSpecialEnergy(prev => Math.max(0, prev - 25));
      setIsSpecialAttackEnabled(false);
    }

    // Check if monster is defeated
    if (newMonsterHp === 0) {
      handleMonsterDeath();
    } else {
      // Switch to monster's turn
      setIsPlayerTurn(false);
    }
  };

  // Handle monster attack
  useEffect(() => {
    if (isPlayerTurn || monsterHitpoints === 0) return;

    const monsterAttackTimer = setTimeout(() => {
      // Calculate monster's damage using enhanced combat system
      const damage = calculateDamage(
        monster,
        'aggressive', // Monsters always use aggressive style
        character,
        false, // Not a special attack
        1.0,   // No special damage bonus
        1.0    // No special accuracy bonus
      );

      // Apply damage to player
      const newPlayerHp = Math.max(0, playerHitpoints - damage);
      setPlayerHitpoints(newPlayerHp);

      // Update combat log
      setCombatLog(prev => [
        ...prev,
        `The ${monster.name} hits you for ${damage} damage!`
      ]);

      // Check if player is defeated
      if (newPlayerHp === 0) {
        handlePlayerDeath();
      } else {
        // Check auto-eating after taking damage
        checkAutoEating();
        
        // Switch back to player's turn
        setIsPlayerTurn(true);
      }
    }, 1500); // 1.5 second delay for monster's attack

    return () => clearTimeout(monsterAttackTimer);
  }, [isPlayerTurn, monster, character, playerHitpoints, monsterHitpoints]);

  // Handle monster death
  const handleMonsterDeath = () => {
    setCombatLog(prev => [...prev, `You have defeated the ${monster.name}!`]);
    
    // Roll for drops
    monster.drops?.forEach(drop => {
      if (Math.random() <= drop.chance) {
        // Add item to player's bank
        updateCharacter({
          ...character,
          bank: [
            ...character.bank,
            { id: drop.itemId, name: drop.itemId, quantity: drop.quantity }
          ]
        });
        setCombatLog(prev => [
          ...prev,
          `You received ${drop.quantity}x ${drop.itemId}!`
        ]);
      }
    });

    // Reset monster after a delay
    setTimeout(() => {
      setMonster({ ...MONSTERS[monsterId] });
      setMonsterHitpoints(MONSTERS[monsterId].hitpoints);
      setCombatLog([]);
      setIsPlayerTurn(true);
    }, 3000);
  };

  // Handle player death
  const handlePlayerDeath = () => {
    setCombatLog(prev => [...prev, 'You have been defeated!']);
    
    // Update character state
    updateCharacter({
      ...character,
      hitpoints: character.maxHitpoints,
      lastAction: {
        type: 'death',
        location: 'lumbridge',
      }
    });

    // Reset combat after a delay
    setTimeout(() => {
      setPlayerHitpoints(character.maxHitpoints);
      setMonster({ ...MONSTERS[monsterId] });
      setMonsterHitpoints(MONSTERS[monsterId].hitpoints);
      setCombatLog([]);
      setIsPlayerTurn(true);
    }, 3000);
  };

  return (
    <Box className="p-3 bg-gray-800 rounded-lg">
      {/* Combat status */}
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between" spacing={4}>
          <Box flex={1}>
            <Text fontSize="md" fontWeight="bold" color="white" mb={1}>Player</Text>
            <Progress
              value={(playerHitpoints / character.maxHitpoints) * 100}
              colorScheme="red"
              size="sm"
              borderRadius="md"
            />
            <Text fontSize="xs" color="white" mt={1}>{playerHitpoints}/{character.maxHitpoints} HP</Text>
          </Box>
          <Box flex={1}>
            <Text fontSize="md" fontWeight="bold" color="white" mb={1}>{monster.name}</Text>
            <Progress
              value={(monsterHitpoints / monster.maxHitpoints) * 100}
              colorScheme="red"
              size="sm"
              borderRadius="md"
            />
            <Text fontSize="xs" color="white" mt={1}>{monsterHitpoints}/{monster.maxHitpoints} HP</Text>
          </Box>
        </HStack>

        {/* Special attack bar */}
        <Box>
          <Progress
            value={specialEnergy}
            colorScheme="yellow"
            size="xs"
            borderRadius="md"
          />
          <Text fontSize="xs" color="white" mt={1}>Special Attack: {specialEnergy}%</Text>
        </Box>

        {/* Auto-eating controls */}
        <Box 
          bg={character?.autoEating.tier > 0 ? "gray.700" : "gray.800"} 
          p={3} 
          borderRadius="md"
          border={character?.autoEating.tier > 0 && character?.autoEating.enabled ? "1px solid" : "none"}
          borderColor={character?.autoEating.tier > 0 && character?.autoEating.enabled ? "green.400" : "transparent"}
        >
          <HStack justify="space-between" mb={2}>
            <HStack spacing={2}>
              <Text fontSize="sm" fontWeight="bold" color="white">Auto-Eating</Text>
              {character?.autoEating.tier > 0 && character?.autoEating.enabled && (
                <Text fontSize="xs" color="green.300">●</Text>
              )}
            </HStack>
            {character?.autoEating.tier > 0 ? (
              <Badge colorScheme="green" size="sm">Tier {character.autoEating.tier}</Badge>
            ) : (
              <Badge colorScheme="red" size="sm">Locked</Badge>
            )}
          </HStack>
          
          <VStack spacing={2} align="stretch">
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="auto-eat-toggle" mb="0" fontSize="xs" color="white">
                Enable Auto-Eating
              </FormLabel>
              <Switch
                id="auto-eat-toggle"
                size="sm"
                isChecked={character?.autoEating.enabled || false}
                onChange={toggleAutoEating}
                isDisabled={character?.autoEating.tier === 0}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel fontSize="xs" color="white" mb={1}>Food Selection</FormLabel>
              <Select
                size="xs"
                bg="gray.600"
                color="white"
                borderColor="gray.500"
                value={character?.autoEating.selectedFood || ''}
                onChange={(e) => setAutoEatingFood(e.target.value || null)}
                isDisabled={character?.autoEating.tier === 0}
              >
                <option value="">Select food...</option>
                {character?.bankTabs
                  ?.find(tab => tab.id === 'main')
                  ?.items.filter(item => ITEMS[item.id]?.type === 'consumable' && ITEMS[item.id]?.healing)
                  .map(item => (
                    <option key={item.id} value={item.id}>
                      {ITEMS[item.id]?.name} ({item.quantity}) - Heals {ITEMS[item.id]?.healing} HP
                    </option>
                  ))}
              </Select>
            </FormControl>
            
            <Box>
              <Text fontSize="xs" color="white" mb={1}>Auto-Eating Triggers:</Text>
              {character?.autoEating.tier > 0 ? (
                <VStack spacing={1} align="stretch">
                  {(() => {
                    const info = getAutoEatingInfo();
                    return info ? (
                      <>
                        <HStack justify="space-between">
                          <Text fontSize="xs" color="gray.300">Trigger at:</Text>
                          <Text fontSize="xs" color="yellow.300">
                            {info.triggerPercent}% HP ({info.triggerHp}/{character.maxHitpoints})
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="xs" color="gray.300">Heal to:</Text>
                          <Text fontSize="xs" color="green.300">
                            {info.targetPercent}% HP ({info.targetHp}/{character.maxHitpoints})
                          </Text>
                        </HStack>
                      </>
                    ) : null;
                  })()}
                  {character?.autoEating.selectedFood && (
                    <HStack justify="space-between">
                      <Text fontSize="xs" color="gray.300">Food healing:</Text>
                      <Text fontSize="xs" color="blue.300">
                        {ITEMS[character.autoEating.selectedFood]?.healing || 0} HP per food
                      </Text>
                    </HStack>
                  )}
                  <HStack justify="space-between">
                    <Text fontSize="xs" color="gray.300">Status:</Text>
                    <Text fontSize="xs" color={character.autoEating.enabled ? "green.300" : "red.300"}>
                      {character.autoEating.enabled ? "Active" : "Disabled"}
                    </Text>
                  </HStack>
                  {(() => {
                    const info = getAutoEatingInfo();
                    if (!info || !character.autoEating.enabled) return null;
                    
                    const currentHpPercent = (playerHitpoints / character.maxHitpoints) * 100;
                    const willTrigger = currentHpPercent <= info.triggerPercent;
                    
                    return (
                      <HStack justify="space-between">
                        <Text fontSize="xs" color="gray.300">Will trigger:</Text>
                        <Text fontSize="xs" color={willTrigger ? "yellow.300" : "gray.400"}>
                          {willTrigger ? "⚡ Yes" : "No"} (Current: {Math.floor(currentHpPercent)}%)
                        </Text>
                      </HStack>
                    );
                  })()}
                </VStack>
              ) : (
                <VStack spacing={1} align="stretch">
                  <Text fontSize="xs" color="gray.500">🔒 Tier 1: Eat at 25% HP → 50% HP (1M gold)</Text>
                  <Text fontSize="xs" color="gray.500">🔒 Tier 2: Eat at 30% HP → 55% HP (5M gold)</Text>
                  <Text fontSize="xs" color="gray.500">🔒 Tier 3: Eat at 40% HP → 70% HP (10M gold)</Text>
                  <Text fontSize="xs" color="orange.300" textAlign="center" mt={1}>
                    Purchase upgrades in General Store → Upgrades
                  </Text>
                </VStack>
              )}
            </Box>
          </VStack>
        </Box>

        {/* Attack style and controls combined */}
        <HStack spacing={2}>
          <Select
            value={attackStyle}
            onChange={(e) => setAttackStyle(e.target.value as AttackStyle)}
            size="sm"
            bg="gray.700"
            color="white"
            borderColor="gray.600"
            flex={1}
          >
            {getAvailableAttackStyles().map(style => (
              <option key={style} value={style}>
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </option>
            ))}
          </Select>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => handlePlayerAttack(false)}
            isDisabled={!isPlayerTurn}
          >
            Attack
          </Button>
          <Button
            size="sm"
            colorScheme="yellow"
            onClick={() => handlePlayerAttack(true)}
            isDisabled={!isPlayerTurn || specialEnergy < 25 || !isSpecialAttackEnabled}
          >
            Special
          </Button>
          <IconButton
            size="sm"
            aria-label={isSpecialAttackEnabled ? 'Disable Special' : 'Enable Special'}
            colorScheme="purple"
            icon={<Text fontSize="xs">{isSpecialAttackEnabled ? 'ON' : 'OFF'}</Text>}
            onClick={() => setIsSpecialAttackEnabled(!isSpecialAttackEnabled)}
            isDisabled={specialEnergy < 25}
          />
        </HStack>

        {/* Combat log */}
        <Box
          bg="gray.900"
          p={2}
          borderRadius="md"
          maxHeight="120px"
          overflowY="auto"
        >
          {combatLog.length === 0 ? (
            <Text fontSize="xs" color="gray.400">Combat will begin when you attack...</Text>
          ) : (
            combatLog.map((log, index) => (
              <Text key={index} fontSize="xs" color="white" mb={1}>
                {log}
              </Text>
            ))
          )}
        </Box>
      </VStack>
    </Box>
  );
}; 