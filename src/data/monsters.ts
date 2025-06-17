import type { Monster, CombatStats, MonsterDrop } from '../types/game';

// Define base stats for easy monsters
const GOBLIN_STATS: CombatStats = {
  attackStab: 1,
  attackSlash: 1,
  attackCrush: 1,
  attackMagic: 0,
  attackRanged: 0,
  defenceStab: 1,
  defenceSlash: 1,
  defenceCrush: 1,
  defenceMagic: -5,
  defenceRanged: 1,
  strengthMelee: 2,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

const RAT_STATS: CombatStats = {
  attackStab: 1,
  attackSlash: 1,
  attackCrush: 1,
  attackMagic: 0,
  attackRanged: 0,
  defenceStab: 1,
  defenceSlash: 1,
  defenceCrush: 1,
  defenceMagic: 1,
  defenceRanged: 1,
  strengthMelee: 1,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

const MINOTAUR_STATS: CombatStats = {
  attackStab: 5,
  attackSlash: 5,
  attackCrush: 5,
  attackMagic: 0,
  attackRanged: 0,
  defenceStab: 3,
  defenceSlash: 3,
  defenceCrush: 3,
  defenceMagic: 2,
  defenceRanged: 3,
  strengthMelee: 5,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

const ZOMBIE_STATS: CombatStats = {
  attackStab: 6,
  attackSlash: 6,
  attackCrush: 6,
  attackMagic: 0,
  attackRanged: 0,
  defenceStab: 4,
  defenceSlash: 4,
  defenceCrush: 4,
  defenceMagic: 3,
  defenceRanged: 4,
  strengthMelee: 6,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

const BEAR_STATS: CombatStats = {
  attackStab: 7,
  attackSlash: 7,
  attackCrush: 7,
  attackMagic: 0,
  attackRanged: 0,
  defenceStab: 5,
  defenceSlash: 5,
  defenceCrush: 5,
  defenceMagic: 3,
  defenceRanged: 5,
  strengthMelee: 7,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

const GHOST_STATS: CombatStats = {
  attackStab: 8,
  attackSlash: 8,
  attackCrush: 8,
  attackMagic: 2,
  attackRanged: 0,
  defenceStab: 6,
  defenceSlash: 6,
  defenceCrush: 6,
  defenceMagic: 8,
  defenceRanged: 6,
  strengthMelee: 8,
  strengthRanged: 0,
  strengthMagic: 2,
  prayerBonus: 0
};

const CAVE_CRAWLER_STATS: CombatStats = {
  attackStab: 10,
  attackSlash: 10,
  attackCrush: 10,
  attackMagic: 0,
  attackRanged: 0,
  defenceStab: 8,
  defenceSlash: 8,
  defenceCrush: 8,
  defenceMagic: 5,
  defenceRanged: 8,
  strengthMelee: 10,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

export const EASY_MONSTERS: Monster[] = [
  {
    id: 'goblin',
    name: 'Goblin',
    level: 2,
    hitpoints: 5,
    maxHitpoints: 5,
    combatStyle: 'melee',
    stats: GOBLIN_STATS,
    drops: [
      { itemId: 'coins', quantity: 5, chance: 1.0 },
      { itemId: 'bones', quantity: 1, chance: 1.0 }
    ],
    thumbnail: '/assets/monsters/goblin.png'
  },
  {
    id: 'giant_rat',
    name: 'Giant Rat',
    level: 3,
    hitpoints: 6,
    maxHitpoints: 6,
    combatStyle: 'melee',
    stats: RAT_STATS,
    drops: [
      { itemId: 'coins', quantity: 3, chance: 1.0 },
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'raw_rat_meat', quantity: 1, chance: 0.5 }
    ],
    thumbnail: '/assets/monsters/giant_rat.png'
  },
  {
    id: 'crawling_hand',
    name: 'Crawling Hand',
    level: 8,
    hitpoints: 16,
    maxHitpoints: 16,
    combatStyle: 'melee',
    stats: {
      attackStab: 3,
      attackSlash: 3,
      attackCrush: 3,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 2,
      defenceSlash: 2,
      defenceCrush: 2,
      defenceMagic: 1,
      defenceRanged: 2,
      strengthMelee: 3,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 8, chance: 1.0 },
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'leather_gloves', quantity: 1, chance: 0.1 }
    ],
    thumbnail: '/assets/monsters/crawling_hand.png'
  },
  {
    id: 'minotaur',
    name: 'Minotaur',
    level: 12,
    hitpoints: 20,
    maxHitpoints: 20,
    combatStyle: 'melee',
    stats: MINOTAUR_STATS,
    drops: [
      { itemId: 'coins', quantity: 12, chance: 1.0 },
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'iron_axe', quantity: 1, chance: 0.1 }
    ],
    thumbnail: '/assets/monsters/minotaur.png'
  },
  {
    id: 'zombie',
    name: 'Zombie',
    level: 13,
    hitpoints: 22,
    maxHitpoints: 22,
    combatStyle: 'melee',
    stats: ZOMBIE_STATS,
    drops: [
      { itemId: 'coins', quantity: 15, chance: 1.0 },
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'zombie_essence', quantity: 1, chance: 0.1 }
    ],
    thumbnail: '/assets/monsters/zombie.png'
  },
  {
    id: 'bear',
    name: 'Bear',
    level: 15,
    hitpoints: 25,
    maxHitpoints: 25,
    combatStyle: 'melee',
    stats: BEAR_STATS,
    drops: [
      { itemId: 'coins', quantity: 18, chance: 1.0 },
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'bear_fur', quantity: 1, chance: 0.5 },
      { itemId: 'raw_bear_meat', quantity: 1, chance: 0.5 }
    ],
    thumbnail: '/assets/monsters/bear.png'
  },
  {
    id: 'ghost',
    name: 'Ghost',
    level: 19,
    hitpoints: 30,
    maxHitpoints: 30,
    combatStyle: 'magic',
    stats: GHOST_STATS,
    drops: [
      { itemId: 'coins', quantity: 22, chance: 1.0 },
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'ghost_essence', quantity: 1, chance: 0.1 }
    ],
    thumbnail: '/assets/monsters/ghost.png'
  },
  {
    id: 'cave_crawler',
    name: 'Cave Crawler',
    level: 23,
    hitpoints: 35,
    maxHitpoints: 35,
    combatStyle: 'melee',
    stats: CAVE_CRAWLER_STATS,
    drops: [
      { itemId: 'coins', quantity: 25, chance: 1.0 },
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'herbs', quantity: 1, chance: 0.3 }
    ],
    thumbnail: '/assets/monsters/cave_crawler.png'
  }
];

export const MEDIUM_MONSTERS: Monster[] = [
  {
    id: 'hobgoblin',
    name: 'Hobgoblin',
    level: 5,
    hitpoints: 12,
    maxHitpoints: 12,
    combatStyle: 'melee',
    stats: {
      attackStab: 3,
      attackSlash: 3,
      attackCrush: 3,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 2,
      defenceSlash: 2,
      defenceCrush: 2,
      defenceMagic: 1,
      defenceRanged: 2,
      strengthMelee: 3,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 8, chance: 1.0 },
      { itemId: 'bones', quantity: 1, chance: 1.0 }
    ],
    thumbnail: '/assets/monsters/hobgoblin.png'
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    level: 8,
    hitpoints: 15,
    maxHitpoints: 15,
    combatStyle: 'melee',
    stats: {
      attackStab: 4,
      attackSlash: 4,
      attackCrush: 4,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 3,
      defenceSlash: 3,
      defenceCrush: 3,
      defenceMagic: 2,
      defenceRanged: 3,
      strengthMelee: 4,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 10, chance: 1.0 },
      { itemId: 'bones', quantity: 1, chance: 1.0 }
    ],
    thumbnail: '/assets/monsters/skeleton.png'
  }
];

export const HARD_MONSTERS: Monster[] = [
  {
    id: 'greater_demon',
    name: 'Greater Demon',
    level: 92,
    hitpoints: 80,
    maxHitpoints: 80,
    combatStyle: 'melee',
    stats: {
      attackStab: 20,
      attackSlash: 20,
      attackCrush: 20,
      attackMagic: 5,
      attackRanged: 0,
      defenceStab: 18,
      defenceSlash: 18,
      defenceCrush: 18,
      defenceMagic: 15,
      defenceRanged: 18,
      strengthMelee: 25,
      strengthRanged: 0,
      strengthMagic: 5,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 50, chance: 1.0 },
      { itemId: 'ashes', quantity: 1, chance: 1.0 }
    ],
    thumbnail: '/assets/monsters/greater_demon.png'
  },
  {
    id: 'black_dragon',
    name: 'Black Dragon',
    level: 100,
    hitpoints: 100,
    maxHitpoints: 100,
    combatStyle: 'melee',
    stats: {
      attackStab: 25,
      attackSlash: 25,
      attackCrush: 25,
      attackMagic: 10,
      attackRanged: 0,
      defenceStab: 22,
      defenceSlash: 22,
      defenceCrush: 22,
      defenceMagic: 20,
      defenceRanged: 22,
      strengthMelee: 30,
      strengthRanged: 0,
      strengthMagic: 10,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 100, chance: 1.0 },
      { itemId: 'dragon_bones', quantity: 1, chance: 1.0 }
    ],
    thumbnail: '/assets/monsters/black_dragon.png'
  }
];

export const NIGHTMARE_MONSTERS: Monster[] = [
  {
    id: 'king_black_dragon',
    name: 'King Black Dragon',
    level: 276,
    hitpoints: 240,
    maxHitpoints: 240,
    combatStyle: 'melee',
    stats: {
      attackStab: 50,
      attackSlash: 50,
      attackCrush: 50,
      attackMagic: 25,
      attackRanged: 0,
      defenceStab: 45,
      defenceSlash: 45,
      defenceCrush: 45,
      defenceMagic: 40,
      defenceRanged: 45,
      strengthMelee: 60,
      strengthRanged: 0,
      strengthMagic: 25,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 500, chance: 1.0 },
      { itemId: 'dragon_bones', quantity: 2, chance: 1.0 }
    ],
    thumbnail: '/assets/monsters/king_black_dragon.png'
  },
  {
    id: 'kalphite_queen',
    name: 'Kalphite Queen',
    level: 333,
    hitpoints: 255,
    maxHitpoints: 255,
    combatStyle: 'melee',
    stats: {
      attackStab: 55,
      attackSlash: 55,
      attackCrush: 55,
      attackMagic: 30,
      attackRanged: 0,
      defenceStab: 50,
      defenceSlash: 50,
      defenceCrush: 50,
      defenceMagic: 45,
      defenceRanged: 50,
      strengthMelee: 65,
      strengthRanged: 0,
      strengthMagic: 30,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 750, chance: 1.0 },
      { itemId: 'dragon_chainbody', quantity: 1, chance: 0.1 }
    ],
    thumbnail: '/assets/monsters/kalphite_queen.png'
  }
]; 