import type { Character, Monster, CombatStats } from '../types/game';
import { getCombatStyle, type CombatStyle } from './combatTriangle';

// Enhanced combat triangle multipliers with more nuanced bonuses
const ENHANCED_COMBAT_TRIANGLE = {
  melee: {
    melee: {
      accuracy: 1.0,    // Normal accuracy against melee
      damage: 1.0,      // Normal damage against melee
      defence: 1.0      // Normal defence against melee
    },
    ranged: {
      accuracy: 1.3,    // 30% bonus accuracy against ranged
      damage: 1.25,     // 25% bonus damage against ranged
      defence: 1.2      // 20% bonus defence against ranged
    },
    magic: {
      accuracy: 0.7,    // 30% reduced accuracy against magic
      damage: 0.75,     // 25% reduced damage against magic
      defence: 0.8      // 20% reduced defence against magic
    }
  },
  ranged: {
    melee: {
      accuracy: 0.7,    // 30% reduced accuracy against melee
      damage: 0.75,     // 25% reduced damage against melee
      defence: 0.8      // 20% reduced defence against melee
    },
    ranged: {
      accuracy: 1.0,    // Normal accuracy against ranged
      damage: 1.0,      // Normal damage against ranged
      defence: 1.0      // Normal defence against ranged
    },
    magic: {
      accuracy: 1.3,    // 30% bonus accuracy against magic
      damage: 1.25,     // 25% bonus damage against magic
      defence: 1.2      // 20% bonus defence against magic
    }
  },
  magic: {
    melee: {
      accuracy: 1.3,    // 30% bonus accuracy against melee
      damage: 1.25,     // 25% bonus damage against melee
      defence: 1.2      // 20% bonus defence against melee
    },
    ranged: {
      accuracy: 0.7,    // 30% reduced accuracy against ranged
      damage: 0.75,     // 25% reduced damage against ranged
      defence: 0.8      // 20% reduced defence against ranged
    },
    magic: {
      accuracy: 1.0,    // Normal accuracy against magic
      damage: 1.0,      // Normal damage against magic
      defence: 1.0      // Normal defence against magic
    }
  }
} as const;

// Style-specific bonuses
const STYLE_BONUSES = {
  melee: {
    accurate: {
      attackBonus: 3,     // +3 to effective attack level
      strengthBonus: 0,   // No strength bonus
      defenceBonus: 0     // No defence bonus
    },
    aggressive: {
      attackBonus: 0,     // No attack bonus
      strengthBonus: 3,   // +3 to effective strength level
      defenceBonus: -1    // -1 to effective defence level
    },
    defensive: {
      attackBonus: -1,    // -1 to effective attack level
      strengthBonus: 0,   // No strength bonus
      defenceBonus: 3     // +3 to effective defence level
    }
  },
  ranged: {
    accurate: {
      attackBonus: 3,     // +3 to effective ranged level
      strengthBonus: 0,   // No strength bonus
      defenceBonus: 0     // No defence bonus
    },
    rapid: {
      attackBonus: 0,     // No attack bonus
      strengthBonus: 3,   // +3 to effective ranged strength
      defenceBonus: 0     // No defence penalty
    },
    longrange: {
      attackBonus: -1,    // -1 to effective ranged level
      strengthBonus: 0,   // No strength bonus
      defenceBonus: 3     // +3 to effective defence level
    }
  },
  magic: {
    accurate: {
      attackBonus: 3,     // +3 to effective magic level
      strengthBonus: 0,   // No strength bonus
      defenceBonus: 0     // No defence bonus
    },
    balanced: {
      attackBonus: 1,     // +1 to effective magic level
      strengthBonus: 1,   // +1 to effective magic damage
      defenceBonus: 1     // +1 to effective defence level
    },
    defensive: {
      attackBonus: -1,    // -1 to effective magic level
      strengthBonus: 0,   // No strength bonus
      defenceBonus: 3     // +3 to effective defence level
    }
  }
} as const;

// Get combat triangle multipliers for accuracy, damage, and defence
export const getCombatTriangleMultipliers = (
  attackerStyle: CombatStyle,
  defenderStyle: CombatStyle
): {
  accuracy: number;
  damage: number;
  defence: number;
} => {
  return ENHANCED_COMBAT_TRIANGLE[attackerStyle][defenderStyle];
};

// Get style-specific bonuses based on combat style and attack style
export const getStyleBonuses = (
  combatStyle: CombatStyle,
  attackStyle: 'accurate' | 'aggressive' | 'defensive' | 'rapid' | 'longrange' | 'balanced'
): {
  attackBonus: number;
  strengthBonus: number;
  defenceBonus: number;
} => {
  // Map ranged and magic styles to their equivalent melee styles for bonus calculation
  const normalizedStyle = attackStyle === 'rapid' ? 'aggressive' :
                         attackStyle === 'longrange' ? 'defensive' :
                         attackStyle === 'balanced' ? 'accurate' :
                         attackStyle;

  // Get the appropriate style bonuses
  const styleGroup = STYLE_BONUSES[combatStyle];
  return styleGroup[normalizedStyle as keyof typeof styleGroup];
};

// Calculate effective combat levels with style bonuses
export const getEffectiveCombatLevels = (
  entity: Character | Monster,
  attackStyle: 'accurate' | 'aggressive' | 'defensive' | 'rapid' | 'longrange' | 'balanced'
): {
  effectiveAttack: number;
  effectiveStrength: number;
  effectiveDefence: number;
} => {
  const combatStyle = getCombatStyle(entity);
  const styleBonuses = getStyleBonuses(combatStyle, attackStyle);

  if ('skills' in entity) {
    // For characters, use skill levels
    return {
      effectiveAttack: entity.skills.attack.level + styleBonuses.attackBonus,
      effectiveStrength: entity.skills.strength.level + styleBonuses.strengthBonus,
      effectiveDefence: entity.skills.defence.level + styleBonuses.defenceBonus
    };
  } else {
    // For monsters, use their stats
    const baseAttack = Math.max(
      entity.stats.attackStab,
      entity.stats.attackSlash,
      entity.stats.attackCrush
    );
    const baseDefence = Math.max(
      entity.stats.defenceStab,
      entity.stats.defenceSlash,
      entity.stats.defenceCrush
    );

    return {
      effectiveAttack: baseAttack + styleBonuses.attackBonus,
      effectiveStrength: entity.stats.strengthMelee + styleBonuses.strengthBonus,
      effectiveDefence: baseDefence + styleBonuses.defenceBonus
    };
  }
}; 