import type { Character, Monster, CombatStats } from '../types/game';
import { getCombatStyle, type CombatStyle } from './combatTriangle';
import { getCombatTriangleMultipliers, getEffectiveCombatLevels, getStyleBonuses } from './enhancedCombatTriangle';

// --- New Combat Damage Calculation Helpers ---

// Get potion bonus for a character (stub: returns 0, fill in with actual logic)
function getPotionBonus(attacker: Character | Monster): number {
  // TODO: Check active potions/buffs on the character
  return 0;
}

// Get prayer bonus multiplier for a character (stub: returns 1.0, fill in with actual logic)
function getPrayerBonus(attacker: Character | Monster): number {
  // TODO: Check active prayers on the character
  return 1.0;
}

// Get void bonus multiplier for a character (stub: returns 1.0, fill in with actual logic)
function getVoidBonus(attacker: Character | Monster): number {
  // TODO: Check if character is wearing void melee armour
  return 1.0;
}

// Get style bonus for a given attack style (typically 0, 1, or 3)
function getStyleBonus(attackStyle: string): number {
  // Aggressive: +3, Accurate: +1, Defensive: 0, Balanced: 0
  switch (attackStyle) {
    case 'aggressive': return 3;
    case 'accurate': return 1;
    default: return 0;
  }
}

// Calculate effective strength for the new formula
function calculateEffectiveStrength(attacker: Character | Monster, attackStyle: string): number {
  // Strength Level
  let strengthLevel = 'skills' in attacker ? attacker.skills.strength.level : 1;
  // Potion Bonus
  const potionBonus = getPotionBonus(attacker);
  // Prayer Bonus (multiplier)
  const prayerBonus = getPrayerBonus(attacker);
  // Style Bonus
  const styleBonus = getStyleBonus(attackStyle);
  // Void Bonus (multiplier)
  const voidBonus = getVoidBonus(attacker);

  // Effective Strength formula
  const afterPotion = strengthLevel + potionBonus;
  const afterPrayer = Math.floor(afterPotion * prayerBonus);
  const afterStyle = afterPrayer + styleBonus + 8;
  const afterVoid = Math.floor(afterStyle * voidBonus);
  return afterVoid;
}

// Get ranged potion bonus for a character (stub: returns 0, fill in with actual logic)
function getRangedPotionBonus(attacker: Character | Monster): number {
  // TODO: Check active ranged potions/buffs on the character
  return 0;
}

// Get ranged prayer bonus multiplier for a character (stub: returns 1.0, fill in with actual logic)
function getRangedPrayerBonus(attacker: Character | Monster): number {
  // TODO: Check active ranged prayers on the character
  return 1.0;
}

// Get ranged void bonus multiplier for a character (stub: returns 1.0, fill in with actual logic)
function getRangedVoidBonus(attacker: Character | Monster): number {
  // TODO: Check if character is wearing void ranged armour
  return 1.0;
}

// Calculate effective ranged for the new formula
function calculateEffectiveRanged(attacker: Character | Monster, attackStyle: string): number {
  // Ranged Level
  let rangedLevel = 'skills' in attacker ? attacker.skills.ranged.level : 1;
  // Potion Bonus
  const potionBonus = getRangedPotionBonus(attacker);
  // Prayer Bonus (multiplier)
  const prayerBonus = getRangedPrayerBonus(attacker);
  // Style Bonus
  const styleBonus = getStyleBonus(attackStyle);
  // Void Bonus (multiplier)
  const voidBonus = getRangedVoidBonus(attacker);

  // Effective Ranged formula
  const afterPotion = rangedLevel + potionBonus;
  const afterPrayer = Math.floor(afterPotion * prayerBonus);
  const afterStyle = afterPrayer + styleBonus + 8;
  const afterVoid = Math.floor(afterStyle * voidBonus);
  return afterVoid;
}

// --- END New Helpers ---

// Calculate max hit based on new rules
export const calculateMaxHit = (
  attacker: Character | Monster,
  attackStyle: 'accurate' | 'aggressive' | 'defensive' | 'rapid' | 'longrange' | 'balanced',
  defender: Character | Monster,
  isSpecialAttack: boolean = false,
  specialAttackBonus: number = 1.0
): number => {
  const attackerStyle = getCombatStyle(attacker);
  if (attackerStyle === 'melee') {
    // Calculate effective strength
    const effectiveStrength = calculateEffectiveStrength(attacker, attackStyle);
    // Get strength bonus from equipment
    const strengthBonus = 'equipment' in attacker 
      ? Object.values(attacker.equipment).reduce((total, item) => {
          if (!item?.stats || typeof (item.stats as CombatStats).strengthMelee !== 'number') return total;
          return total + (item.stats as CombatStats).strengthMelee;
        }, 0)
      : attacker.stats.strengthMelee;
    // Base damage formula
    const baseDamage = 0.5 + (effectiveStrength * (strengthBonus + 64)) / 640;
    let maxHit = Math.floor(baseDamage);
    if (isSpecialAttack && specialAttackBonus !== 1.0) {
      maxHit = Math.floor(maxHit * specialAttackBonus);
    }
    return maxHit;
  } else if (attackerStyle === 'ranged') {
    // Calculate effective ranged
    const effectiveRanged = calculateEffectiveRanged(attacker, attackStyle);
    // Get ranged strength bonus from equipment
    const strengthBonus = 'equipment' in attacker 
      ? Object.values(attacker.equipment).reduce((total, item) => {
          if (!item?.stats || typeof (item.stats as CombatStats).strengthRanged !== 'number') return total;
          return total + (item.stats as CombatStats).strengthRanged;
        }, 0)
      : attacker.stats.strengthRanged;
    // Base damage formula
    const baseDamage = 0.5 + (effectiveRanged * (strengthBonus + 64)) / 640;
    let maxHit = Math.floor(baseDamage);
    if (isSpecialAttack && specialAttackBonus !== 1.0) {
      maxHit = Math.floor(maxHit * specialAttackBonus);
    }
    return maxHit;
  }
  // Fallback to old logic for other styles (e.g., magic)
  const defenderStyle = getCombatStyle(defender);
  const triangleMultipliers = getCombatTriangleMultipliers(attackerStyle, defenderStyle);
  const effectiveLevels = getEffectiveCombatLevels(attacker, attackStyle);
  const strengthBonus = 'equipment' in attacker 
    ? Object.values(attacker.equipment).reduce((total, item) => {
        if (!item?.stats || typeof (item.stats as CombatStats).strengthMelee !== 'number') return total;
        return total + (item.stats as CombatStats).strengthMelee;
      }, 0)
    : attacker.stats.strengthMelee;
  const baseMaxHit = Math.floor((effectiveLevels.effectiveStrength + 8) * (strengthBonus + 64) / 640);
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
      const stats = item.stats as CombatStats;
      switch (style) {
        case 'melee':
          return total + Math.max(
            stats.attackStab || 0,
            stats.attackSlash || 0,
            stats.attackCrush || 0
          );
        case 'ranged':
          return total + (stats.attackRanged || 0);
        case 'magic':
          return total + (stats.attackMagic || 0);
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
      const stats = item.stats as CombatStats;
      switch (attackStyle) {
        case 'melee':
          return total + Math.max(
            stats.defenceStab || 0,
            stats.defenceSlash || 0,
            stats.defenceCrush || 0
          );
        case 'ranged':
          return total + (stats.defenceRanged || 0);
        case 'magic':
          return total + (stats.defenceMagic || 0);
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