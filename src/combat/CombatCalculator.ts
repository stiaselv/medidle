// Core combat calculation logic for all styles
import type { Character, Monster } from '../types/game';

export interface ICombatStyle {
  calculateAccuracy(attacker: Character | Monster, defender: Character | Monster): number;
  calculateMaxHit(attacker: Character | Monster): number;
  calculateDamage(attacker: Character | Monster, defender: Character | Monster): number;
}

export class MeleeStyle implements ICombatStyle {
  calculateAccuracy(attacker: Character | Monster, defender: Character | Monster): number {
    const attackerLevel = 'skills' in attacker ? attacker.skills.attack.level : 1;
    const attackerBonus = 'equipment' in attacker
      ? Object.values(attacker.equipment).reduce((sum, item) => sum + (item?.stats?.attackStab || 0), 0)
      : attacker.stats.attackStab;
    const defenderLevel = 'skills' in defender ? defender.skills.defence.level : 1;
    const defenderBonus = 'equipment' in defender
      ? Object.values(defender.equipment).reduce((sum, item) => sum + (item?.stats?.defenceStab || 0), 0)
      : defender.stats.defenceStab;
    const attackRoll = attackerLevel + attackerBonus;
    const defenceRoll = defenderLevel + defenderBonus;
    let hitChance = attackRoll / (attackRoll + defenceRoll + 1);
    hitChance = Math.max(0.15, Math.min(0.95, hitChance));
    return hitChance;
  }
  calculateMaxHit(attacker: Character | Monster): number {
    const strengthLevel = 'skills' in attacker ? attacker.skills.strength.level : 1;
    const strengthBonus = 'equipment' in attacker
      ? Object.values(attacker.equipment).reduce((sum, item) => sum + (item?.stats?.strengthMelee || 0), 0)
      : attacker.stats.strengthMelee;
    return Math.floor((strengthLevel * (strengthBonus + 64)) / 640) + 1;
  }
  calculateDamage(attacker: Character | Monster, defender: Character | Monster): number {
    const maxHit = this.calculateMaxHit(attacker);
    return Math.floor(Math.random() * (maxHit + 1));
  }
}

export class RangedStyle implements ICombatStyle {
  calculateAccuracy(attacker: Character | Monster, defender: Character | Monster): number {
    const attackerLevel = 'skills' in attacker ? attacker.skills.ranged.level : 1;
    const attackerBonus = 'equipment' in attacker
      ? Object.values(attacker.equipment).reduce((sum, item) => sum + (item?.stats?.attackRanged || 0), 0)
      : attacker.stats.attackRanged;
    const defenderLevel = 'skills' in defender ? defender.skills.defence.level : 1;
    const defenderBonus = 'equipment' in defender
      ? Object.values(defender.equipment).reduce((sum, item) => sum + (item?.stats?.defenceRanged || 0), 0)
      : defender.stats.defenceRanged;
    const attackRoll = attackerLevel + attackerBonus;
    const defenceRoll = defenderLevel + defenderBonus;
    let hitChance = attackRoll / (attackRoll + defenceRoll + 1);
    hitChance = Math.max(0.15, Math.min(0.95, hitChance));
    return hitChance;
  }
  calculateMaxHit(attacker: Character | Monster): number {
    const rangedLevel = 'skills' in attacker ? attacker.skills.ranged.level : 1;
    const strengthBonus = 'equipment' in attacker
      ? Object.values(attacker.equipment).reduce((sum, item) => sum + (item?.stats?.strengthRanged || 0), 0)
      : attacker.stats.strengthRanged;
    return Math.floor((rangedLevel * (strengthBonus + 64)) / 640) + 1;
  }
  calculateDamage(attacker: Character | Monster, defender: Character | Monster): number {
    const maxHit = this.calculateMaxHit(attacker);
    return Math.floor(Math.random() * (maxHit + 1));
  }
}

export class MagicStyle implements ICombatStyle {
  calculateAccuracy(attacker: Character | Monster, defender: Character | Monster): number {
    const attackerLevel = 'skills' in attacker ? attacker.skills.magic.level : 1;
    const attackerBonus = 'equipment' in attacker
      ? Object.values(attacker.equipment).reduce((sum, item) => sum + (item?.stats?.attackMagic || 0), 0)
      : attacker.stats.attackMagic;
    const defenderLevel = 'skills' in defender ? defender.skills.defence.level : 1;
    const defenderBonus = 'equipment' in defender
      ? Object.values(defender.equipment).reduce((sum, item) => sum + (item?.stats?.defenceMagic || 0), 0)
      : defender.stats.defenceMagic;
    const attackRoll = attackerLevel + attackerBonus;
    const defenceRoll = defenderLevel + defenderBonus;
    let hitChance = attackRoll / (attackRoll + defenceRoll + 1);
    hitChance = Math.max(0.15, Math.min(0.95, hitChance));
    return hitChance;
  }
  calculateMaxHit(attacker: Character | Monster): number {
    const magicLevel = 'skills' in attacker ? attacker.skills.magic.level : 1;
    const strengthBonus = 'equipment' in attacker
      ? Object.values(attacker.equipment).reduce((sum, item) => sum + (item?.stats?.strengthMagic || 0), 0)
      : attacker.stats.strengthMagic;
    return Math.floor((magicLevel * (strengthBonus + 64)) / 640) + 1;
  }
  calculateDamage(attacker: Character | Monster, defender: Character | Monster): number {
    const maxHit = this.calculateMaxHit(attacker);
    return Math.floor(Math.random() * (maxHit + 1));
  }
}

export class CombatCalculator {
  static getStyleInstance(style: 'melee' | 'ranged' | 'magic'): ICombatStyle {
    if (style === 'melee') return new MeleeStyle();
    if (style === 'ranged') return new RangedStyle();
    if (style === 'magic') return new MagicStyle();
    throw new Error('Unknown combat style');
  }

  static calculateAccuracy(attacker: Character | Monster, defender: Character | Monster, style: 'melee' | 'ranged' | 'magic'): number {
    return this.getStyleInstance(style).calculateAccuracy(attacker, defender);
  }

  static calculateMaxHit(attacker: Character | Monster, style: 'melee' | 'ranged' | 'magic'): number {
    return this.getStyleInstance(style).calculateMaxHit(attacker);
  }

  static performHitRoll(attacker: Character | Monster, defender: Character | Monster, style: 'melee' | 'ranged' | 'magic'): number {
    const styleInstance = this.getStyleInstance(style);
    const accuracy = styleInstance.calculateAccuracy(attacker, defender);
    if (Math.random() > accuracy) {
      return 0; // Miss
    }
    const maxHit = styleInstance.calculateMaxHit(attacker);
    return Math.floor(Math.random() * (maxHit + 1));
  }
} 