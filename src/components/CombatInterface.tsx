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
  IconButton
} from '@chakra-ui/react';
import { useGameStore } from '../store/gameStore';
import { calculateDamage } from '../combat/combatCalculations';
import { getCombatStyle } from '../combat/combatTriangle';
import { MONSTERS } from '../data/locations/combat';
import type { Monster, Character } from '../types/game';

interface CombatInterfaceProps {
  monsterId: string;
}

type AttackStyle = 'accurate' | 'aggressive' | 'defensive' | 'rapid' | 'longrange' | 'balanced';

export const CombatInterface: React.FC<CombatInterfaceProps> = ({ monsterId }) => {
  const { character, updateCharacter } = useGameStore();
  
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
    <Box className="p-4 bg-gray-800 rounded-lg">
      {/* Combat status */}
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Box flex={1}>
            <Text className="text-lg font-bold text-white">Player</Text>
            <Progress
              value={(playerHitpoints / character.maxHitpoints) * 100}
              colorScheme="red"
              size="md"
            />
            <Text className="text-white">{playerHitpoints}/{character.maxHitpoints} HP</Text>
          </Box>
          <Box flex={1}>
            <Text className="text-lg font-bold text-white">{monster.name}</Text>
            <Progress
              value={(monsterHitpoints / monster.maxHitpoints) * 100}
              colorScheme="red"
              size="md"
            />
            <Text className="text-white">{monsterHitpoints}/{monster.maxHitpoints} HP</Text>
          </Box>
        </HStack>

        {/* Special attack bar */}
        <Box>
          <Progress
            value={specialEnergy}
            colorScheme="yellow"
            size="sm"
          />
          <Text className="text-white">Special Attack: {specialEnergy}%</Text>
        </Box>

        {/* Attack style selector */}
        <Select
          value={attackStyle}
          onChange={(e) => setAttackStyle(e.target.value as AttackStyle)}
          className="bg-gray-700 text-white"
        >
          {getAvailableAttackStyles().map(style => (
            <option key={style} value={style}>
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </option>
          ))}
        </Select>

        {/* Combat controls */}
        <HStack spacing={4}>
          <Button
            colorScheme="blue"
            onClick={() => handlePlayerAttack(false)}
            isDisabled={!isPlayerTurn}
          >
            Attack
          </Button>
          <Button
            colorScheme="yellow"
            onClick={() => handlePlayerAttack(true)}
            isDisabled={!isPlayerTurn || specialEnergy < 25 || !isSpecialAttackEnabled}
          >
            Special Attack
          </Button>
          <Button
            colorScheme="purple"
            onClick={() => setIsSpecialAttackEnabled(!isSpecialAttackEnabled)}
            isDisabled={specialEnergy < 25}
          >
            {isSpecialAttackEnabled ? 'Disable Special' : 'Enable Special'}
          </Button>
        </HStack>

        {/* Combat log */}
        <Box
          className="bg-gray-900 p-4 rounded"
          maxHeight="200px"
          overflowY="auto"
        >
          {combatLog.map((log, index) => (
            <Text key={index} className="text-white">
              {log}
            </Text>
          ))}
        </Box>
      </VStack>
    </Box>
  );
}; 