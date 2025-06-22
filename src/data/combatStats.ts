import type { CombatStats, ItemStats } from '../types/game';

// Base stats for different metal tiers
export const BRONZE_STATS: CombatStats = {
  attackStab: 4,
  attackSlash: 3,
  attackCrush: 2,
  attackMagic: -1,
  attackRanged: 0,
  defenceStab: 3,
  defenceSlash: 3,
  defenceCrush: 3,
  defenceMagic: -1,
  defenceRanged: 3,
  strengthMelee: 5,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

export const IRON_STATS: CombatStats = {
  attackStab: 7,
  attackSlash: 6,
  attackCrush: 5,
  attackMagic: -1,
  attackRanged: 0,
  defenceStab: 6,
  defenceSlash: 6,
  defenceCrush: 6,
  defenceMagic: -1,
  defenceRanged: 6,
  strengthMelee: 8,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

export const STEEL_STATS: CombatStats = {
  attackStab: 11,
  attackSlash: 10,
  attackCrush: 9,
  attackMagic: -1,
  attackRanged: 0,
  defenceStab: 10,
  defenceSlash: 10,
  defenceCrush: 10,
  defenceMagic: -2,
  defenceRanged: 10,
  strengthMelee: 13,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

export const MITHRIL_STATS: CombatStats = {
  attackStab: 16,
  attackSlash: 15,
  attackCrush: 14,
  attackMagic: -1,
  attackRanged: 0,
  defenceStab: 15,
  defenceSlash: 15,
  defenceCrush: 15,
  defenceMagic: -2,
  defenceRanged: 15,
  strengthMelee: 18,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

export const ADAMANT_STATS: CombatStats = {
  attackStab: 22,
  attackSlash: 21,
  attackCrush: 20,
  attackMagic: -2,
  attackRanged: 0,
  defenceStab: 21,
  defenceSlash: 21,
  defenceCrush: 21,
  defenceMagic: -3,
  defenceRanged: 21,
  strengthMelee: 24,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

export const RUNE_STATS: CombatStats = {
  attackStab: 29,
  attackSlash: 28,
  attackCrush: 27,
  attackMagic: -2,
  attackRanged: 0,
  defenceStab: 28,
  defenceSlash: 28,
  defenceCrush: 28,
  defenceMagic: -3,
  defenceRanged: 28,
  strengthMelee: 31,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

export const DRAGON_STATS: CombatStats = {
  attackStab: 38,
  attackSlash: 37,
  attackCrush: 36,
  attackMagic: -2,
  attackRanged: 0,
  defenceStab: 37,
  defenceSlash: 37,
  defenceCrush: 37,
  defenceMagic: -4,
  defenceRanged: 37,
  strengthMelee: 40,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

// Weapon-specific stat modifiers
export const WEAPON_STATS: Record<string, Partial<CombatStats>> = {
  // Daggers
  dagger: {
    attackStab: 4,
    attackSlash: -2,
    attackCrush: -1,
    strengthMelee: 2
  },
  
  // Swords
  sword: {
    attackStab: 1,
    attackSlash: 3,
    attackCrush: 0,
    strengthMelee: 3
  },
  
  // Scimitars
  scimitar: {
    attackStab: 0,
    attackSlash: 5,
    attackCrush: -2,
    strengthMelee: 4
  },
  
  // Longswords
  longsword: {
    attackStab: 2,
    attackSlash: 4,
    attackCrush: 1,
    strengthMelee: 5
  },
  
  // Battleaxes
  battleaxe: {
    attackStab: -2,
    attackSlash: 3,
    attackCrush: 4,
    strengthMelee: 6
  },
  
  // Warhammers
  warhammer: {
    attackStab: -4,
    attackSlash: -2,
    attackCrush: 6,
    strengthMelee: 7
  },
  
  // Two-handed swords
  two_handed_sword: {
    attackStab: 0,
    attackSlash: 6,
    attackCrush: 4,
    strengthMelee: 8
  }
};

// Armor-specific stat modifiers
export const ARMOR_STATS: Record<string, Partial<CombatStats>> = {
  // Full helms
  full_helm: {
    defenceStab: 3,
    defenceSlash: 4,
    defenceCrush: 3,
    defenceMagic: -1,
    defenceRanged: 3
  },
  
  // Platebodies
  platebody: {
    defenceStab: 5,
    defenceSlash: 5,
    defenceCrush: 4,
    defenceMagic: -3,
    defenceRanged: 5
  },
  
  // Platelegs/Plateskirts
  platelegs: {
    defenceStab: 4,
    defenceSlash: 4,
    defenceCrush: 4,
    defenceMagic: -2,
    defenceRanged: 4
  },
  
  // Chainbodies
  chainbody: {
    defenceStab: 3,
    defenceSlash: 4,
    defenceCrush: 2,
    defenceMagic: -1,
    defenceRanged: 3
  },
  
  // Square shields
  square_shield: {
    defenceStab: 4,
    defenceSlash: 4,
    defenceCrush: 4,
    defenceMagic: -1,
    defenceRanged: 4
  },
  
  // Kiteshields
  kiteshield: {
    defenceStab: 5,
    defenceSlash: 5,
    defenceCrush: 5,
    defenceMagic: -2,
    defenceRanged: 5
  }
};

// Helper function to combine base metal stats with weapon/armor modifiers
export const combineStats = (base: CombatStats, addition: Partial<CombatStats>): CombatStats => {
  const combined: CombatStats = { ...base };
  for (const key in addition) {
    if (Object.prototype.hasOwnProperty.call(addition, key)) {
      const statKey = key as keyof CombatStats;
      combined[statKey] = (base[statKey] || 0) + (addition[statKey] || 0);
    }
  }
  return combined;
};

// Tool stats for different metal tiers
export const BRONZE_TOOL_STATS: ItemStats = {
  woodcutting: 1,
  defence: 1
};

export const IRON_TOOL_STATS: ItemStats = {
  woodcutting: 2,
  defence: 2
};

export const STEEL_TOOL_STATS: ItemStats = {
  woodcutting: 3,
  defence: 3
};

export const MITHRIL_TOOL_STATS: ItemStats = {
  woodcutting: 5,
  defence: 5
};

export const ADAMANT_TOOL_STATS: ItemStats = {
  woodcutting: 7,
  defence: 7
};

export const RUNE_TOOL_STATS: ItemStats = {
  woodcutting: 10,
  defence: 10
};

export const DRAGON_TOOL_STATS: ItemStats = {
  woodcutting: 13,
  defence: 13
}; 