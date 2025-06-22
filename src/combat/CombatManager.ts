import type { Character, Monster } from '../types/game';
import { CombatCalculator } from './CombatCalculator';

export type CombatRoundResult = {
  playerDamage: number;
  monsterDamage: number;
  playerHit: boolean;
  monsterHit: boolean;
  playerDefeated: boolean;
  monsterDefeated: boolean;
  loot?: string[];
  result: 'continue' | 'victory' | 'defeat';
};

export class CombatManager {
  static runCombatRound(
    player: Character,
    monster: Monster,
    playerStyle: 'melee' | 'ranged' | 'magic',
    monsterStyle: 'melee' | 'ranged' | 'magic'
  ): CombatRoundResult {
    // Player attacks monster
    const playerAccuracy = CombatCalculator.calculateAccuracy(player, monster, playerStyle);
    const playerHit = Math.random() < playerAccuracy;
    const playerMaxHit = CombatCalculator.calculateMaxHit(player, playerStyle);
    const playerDamage = playerHit ? Math.floor(Math.random() * (playerMaxHit + 1)) : 0;
    const newMonsterHp = Math.max(0, monster.hitpoints - playerDamage);
    const monsterDefeated = newMonsterHp === 0;

    // Monster attacks player (if not defeated)
    let monsterAccuracy = 0;
    let monsterHit = false;
    let monsterMaxHit = 0;
    let monsterDamage = 0;
    let newPlayerHp = player.hitpoints;
    let playerDefeated = false;
    if (!monsterDefeated) {
      monsterAccuracy = CombatCalculator.calculateAccuracy(monster, player, monsterStyle);
      monsterHit = Math.random() < monsterAccuracy;
      monsterMaxHit = CombatCalculator.calculateMaxHit(monster, monsterStyle);
      monsterDamage = monsterHit ? Math.floor(Math.random() * (monsterMaxHit + 1)) : 0;
      newPlayerHp = Math.max(0, player.hitpoints - monsterDamage);
      playerDefeated = newPlayerHp === 0;
    }

    // Determine result
    let result: 'continue' | 'victory' | 'defeat' = 'continue';
    if (monsterDefeated) result = 'victory';
    else if (playerDefeated) result = 'defeat';

    // Loot (if monster defeated)
    const loot: string[] = [];
    if (monsterDefeated && monster.drops && monster.drops.length > 0) {
      monster.drops.forEach(drop => {
        if (Math.random() < (drop.chance ?? 1)) {
          loot.push(drop.itemId);
        }
      });
    }

    return {
      playerDamage,
      monsterDamage,
      playerHit,
      monsterHit,
      playerDefeated,
      monsterDefeated,
      loot,
      result
    };
  }
} 