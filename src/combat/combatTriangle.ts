import type { Character, Monster } from '../types/game';

// Combat style types
export type CombatStyle = 'melee' | 'ranged' | 'magic';

// Combat triangle effectiveness multipliers
const COMBAT_TRIANGLE = {
  melee: {
    melee: 1.0,    // Normal damage against melee
    ranged: 1.25,  // 25% bonus damage against ranged
    magic: 0.75    // 25% reduced damage against magic
  },
  ranged: {
    melee: 0.75,   // 25% reduced damage against melee
    ranged: 1.0,   // Normal damage against ranged
    magic: 1.25    // 25% bonus damage against magic
  },
  magic: {
    melee: 1.25,   // 25% bonus damage against melee
    ranged: 0.75,  // 25% reduced damage against magic
    magic: 1.0     // Normal damage against magic
  }
} as const;

// Get the combat style of an entity based on their equipment and stats
export const getCombatStyle = (entity: Character | Monster): CombatStyle => {
  // For monsters, use their predefined style
  if ('combatStyle' in entity) {
    return entity.combatStyle;
  }

  // For players, determine style based on equipped weapon and stats
  const weapon = entity.equipment?.weapon;
  if (!weapon) return 'melee'; // Default to melee if no weapon

  // Check weapon type to determine combat style
  if (weapon.id.includes('bow') || weapon.id.includes('crossbow') || weapon.id.includes('dart') || weapon.id.includes('knife')) {
    return 'ranged';
  }

  if (weapon.id.includes('staff') || weapon.id.includes('wand')) {
    return 'magic';
  }

  return 'melee';
};

// Calculate combat triangle multiplier between attacker and defender
export const getCombatTriangleMultiplier = (attackerStyle: CombatStyle, defenderStyle: CombatStyle): number => {
  return COMBAT_TRIANGLE[attackerStyle][defenderStyle];
};

// Apply combat triangle bonus to base damage
export const applyTriangleBonus = (baseDamage: number, attackerStyle: CombatStyle, defenderStyle: CombatStyle): number => {
  const multiplier = getCombatTriangleMultiplier(attackerStyle, defenderStyle);
  return Math.floor(baseDamage * multiplier);
}; 