import type { Character, Monster, CombatStats } from '../types/game';
import { getCombatStyle, type CombatStyle } from './combatTriangle';
import { getCombatTriangleMultipliers, getEffectiveCombatLevels } from './enhancedCombatTriangle';

// Calculate max hit based on strength level and equipment bonuses
export const calculateMaxHit = (
  attacker: Character | Monster,
  attackStyle: 'accurate' | 'aggressive' | 'defensive' | 'rapid' | 'longrange' | 'balanced',
  defender: Character | Monster,
  isSpecialAttack: boolean = false,
  specialAttackBonus: number = 1.0
): number => {
  // Get combat styles and triangle multipliers
  const attackerStyle = getCombatStyle(attacker);
  const defenderStyle = getCombatStyle(defender);
  const triangleMultipliers = getCombatTriangleMultipliers(attackerStyle, defenderStyle);

  // Get effective levels with style bonuses
  const effectiveLevels = getEffectiveCombatLevels(attacker, attackStyle);
  
  // Get strength bonus from equipment
  const strengthBonus = 'equipment' in attacker 
    ? Object.values(attacker.equipment).reduce((total, item) => {
        return total + (item?.stats?.strengthMelee || 0);
      }, 0)
    : attacker.stats.strengthMelee;

  // Calculate base max hit with effective strength
  const baseMaxHit = Math.floor((effectiveLevels.effectiveStrength + 8) * (strengthBonus + 64) / 640);

  // Apply combat triangle damage multiplier and special attack bonus
  return Math.floor(
    baseMaxHit * 
    triangleMultipliers.damage * 
    (isSpecialAttack ? specialAttackBonus : 1.0)
  );
};

// Calculate accuracy based on attack level and equipment bonuses
export const calculateAccuracy = (
  attacker: Character | Monster,
  attackStyle: 'accurate' | 'aggressive' | 'defensive' | 'rapid' | 'longrange' | 'balanced',
  defender: Character | Monster,
  isSpecialAttack: boolean = false,
  specialAccuracyBonus: number = 1.0
): number => {
  // Get combat styles and triangle multipliers
  const attackerStyle = getCombatStyle(attacker);
  const defenderStyle = getCombatStyle(defender);
  const triangleMultipliers = getCombatTriangleMultipliers(attackerStyle, defenderStyle);

  // Get effective levels with style bonuses
  const attackerLevels = getEffectiveCombatLevels(attacker, attackStyle);
  const defenderLevels = getEffectiveCombatLevels(defender, 'defensive'); // Assume defensive for defenders

  // Get attack and defence bonuses
  const attackBonus = getAttackBonus(attacker, attackerStyle);
  const defenceBonus = getDefenceBonus(defender, attackerStyle);

  // Calculate attack roll with enhanced accuracy
  const attackRoll = Math.floor(
    (attackerLevels.effectiveAttack + 8) * 
    (attackBonus + 64) * 
    triangleMultipliers.accuracy * 
    (isSpecialAttack ? specialAccuracyBonus : 1.0)
  );

  // Calculate defence roll with enhanced defence
  const defenceRoll = Math.floor(
    (defenderLevels.effectiveDefence + 8) * 
    (defenceBonus + 64) * 
    triangleMultipliers.defence
  );

  // Calculate hit chance
  let hitChance: number;
  if (attackRoll > defenceRoll) {
    hitChance = 1 - (defenceRoll + 2) / (2 * (attackRoll + 1));
  } else {
    hitChance = attackRoll / (2 * (defenceRoll + 1));
  }
  // Clamp hit chance to a minimum of 0.15 and maximum of 0.95
  hitChance = Math.max(0.15, Math.min(0.95, hitChance));
  return hitChance;
};

// Calculate damage for an attack
export const calculateDamage = (
  attacker: Character | Monster,
  attackStyle: 'accurate' | 'aggressive' | 'defensive' | 'rapid' | 'longrange' | 'balanced',
  defender: Character | Monster,
  isSpecialAttack: boolean = false,
  specialDamageBonus: number = 1.0,
  specialAccuracyBonus: number = 1.0
): number => {
  // Calculate max hit with enhanced combat triangle
  const maxHit = calculateMaxHit(
    attacker,
    attackStyle,
    defender,
    isSpecialAttack,
    specialDamageBonus
  );

  // Calculate accuracy with enhanced combat triangle
  const accuracy = calculateAccuracy(
    attacker,
    attackStyle,
    defender,
    isSpecialAttack,
    specialAccuracyBonus
  );

  // Roll for hit
  if (Math.random() > accuracy) {
    return 0; // Miss
  }

  // Roll for damage
  return Math.floor(Math.random() * (maxHit + 1));
};

// Helper function to get attack bonus based on combat style
const getAttackBonus = (entity: Character | Monster, style: CombatStyle): number => {
  if ('equipment' in entity) {
    // For characters, get bonus from equipment
    return Object.values(entity.equipment).reduce((total, item) => {
      if (!item?.stats) return total;
      switch (style) {
        case 'melee':
          return total + Math.max(
            item.stats.attackStab,
            item.stats.attackSlash,
            item.stats.attackCrush
          );
        case 'ranged':
          return total + item.stats.attackRanged;
        case 'magic':
          return total + item.stats.attackMagic;
        default:
          return total;
      }
    }, 0);
  } else {
    // For monsters, use their stats directly
    switch (style) {
      case 'melee':
        return Math.max(
          entity.stats.attackStab,
          entity.stats.attackSlash,
          entity.stats.attackCrush
        );
      case 'ranged':
        return entity.stats.attackRanged;
      case 'magic':
        return entity.stats.attackMagic;
      default:
        return 0;
    }
  }
};

// Helper function to get defence bonus based on attack style
const getDefenceBonus = (entity: Character | Monster, attackStyle: CombatStyle): number => {
  if ('equipment' in entity) {
    // For characters, get bonus from equipment
    return Object.values(entity.equipment).reduce((total, item) => {
      if (!item?.stats) return total;
      switch (attackStyle) {
        case 'melee':
          return total + Math.max(
            item.stats.defenceStab,
            item.stats.defenceSlash,
            item.stats.defenceCrush
          );
        case 'ranged':
          return total + item.stats.defenceRanged;
        case 'magic':
          return total + item.stats.defenceMagic;
        default:
          return total;
      }
    }, 0);
  } else {
    // For monsters, use their stats directly
    switch (attackStyle) {
      case 'melee':
        return Math.max(
          entity.stats.defenceStab,
          entity.stats.defenceSlash,
          entity.stats.defenceCrush
        );
      case 'ranged':
        return entity.stats.defenceRanged;
      case 'magic':
        return entity.stats.defenceMagic;
      default:
        return 0;
    }
  }
}; 