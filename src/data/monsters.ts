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
      { itemId: 'bones', quantity: 1, chance: 100.0 },
      { itemId: 'bronze_spear', quantity: 1, chance: 3.13 },
      { itemId: 'water_rune', quantity: 6, chance: 4.76 },
      { itemId: 'earth_rune', quantity: 4, chance: 2.38 },
      { itemId: 'bronze_bolts', quantity: 8, chance: 2.38 },
      { itemId: 'coins', quantity: 5, chance: 20.0 },
      { itemId: 'coins', quantity: 9, chance: 2.38 },
      { itemId: 'coins', quantity: 15, chance: 2.38 },
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/goblin.png'
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
      { itemId: 'bones', quantity: 1, chance: 100.0 },
      { itemId: 'raw_meat', quantity: 1, chance: 100.0 },
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/giant_rat.png'
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
      { itemId: 'bones', quantity: 1, chance: 100.0 },
      { itemId: 'leather_gloves', quantity: 1, chance: 14.29 },
      { itemId: 'gold_ring', quantity: 1, chance: 2.38 },
      { itemId: 'sapphire_ring', quantity: 1, chance: 1.56 },
      { itemId: 'emerald_ring', quantity: 1, chance: 1.56 },
      { itemId: 'coins', quantity: 5, chance: 20.0 },
      { itemId: 'coins', quantity: 8, chance: 16.67 },
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/crawling_hand.png'
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
      { itemId: 'bones', quantity: 1, chance: 100.0 },
      { itemId: 'iron_arrows', quantity: 7, chance: 10.0 },
      { itemId: 'bronze_spear', quantity: 1, chance: 9.90 },
      { itemId: 'bronze_full_helm', quantity: 1, chance: 9.90 },
      { itemId: 'bronze_dagger', quantity: 1, chance: 3.96 },
      { itemId: 'copper_ore', quantity: 1, chance: 5.94 },
      { itemId: 'tin_ore', quantity: 1, chance: 5.94 },
      { itemId: 'pure_essence', quantity: 15, chance: 4.95 },
      { itemId: 'cooked_meat', quantity: 1, chance: 2.97 },
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/minotaur.png'
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
      { itemId: 'bones', quantity: 1, chance: 100.0 },
      { itemId: 'bronze_med_helm', quantity: 1, chance: 3.13 },
      { itemId: 'bronze_longsword', quantity: 1, chance: 0.78 },
      { itemId: 'iron_axe', quantity: 1, chance: 0.78 },
      { itemId: 'iron_arrows', quantity: 5, chance: 5.56 },
      { itemId: 'body_rune', quantity: 6, chance: 3.91 },
      { itemId: 'mind_rune', quantity: 5, chance: 3.91 },
      { itemId: 'air_rune', quantity: 13, chance: 3.13 },
      { itemId: 'nature_rune', quantity: 6, chance: 0.78 },
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/zombie.png'
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
      { itemId: 'bones', quantity: 1, chance: 100.0 },
      { itemId: 'raw_meat', quantity: 1, chance: 100.0 },
      { itemId: 'coins', quantity: 15, chance: 8.33 },
      { itemId: 'bronze_full_helm', quantity: 1, chance: 9.90 },
      { itemId: 'bronze_dagger', quantity: 1, chance: 3.96 },
      { itemId: 'copper_ore', quantity: 1, chance: 5.94 },
      { itemId: 'iron_axe', quantity: 1, chance: 0.78 },
      { itemId: 'iron_arrows', quantity: 5, chance: 5.56 },
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/bear.png'
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
      { itemId: 'death_rune', quantity: 1, chance: 2.73 },
      { itemId: 'blood_rune', quantity: 1, chance: 1.49 },
      { itemId: 'pure_essence', quantity: 5, chance: 6.67 },
      { itemId: 'coins', quantity: 5, chance: 33.33 },
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/ghost.png'
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
      { itemId: 'bronze_boots', quantity: 1, chance: 0.78 },
      { itemId: 'nature_rune', quantity: 3, chance: 4.69 },
      { itemId: 'fire_rune', quantity: 12, chance: 3.91 },
      { itemId: 'earth_rune', quantity: 9, chance: 1.56 },
      { itemId: 'potato_seed', quantity: 2, chance: 10.20 },
      { itemId: 'onion_seed', quantity: 2, chance: 5.08 },
      { itemId: 'cabbage_seed', quantity: 2, chance: 2.56 },
      { itemId: 'tomato_seed', quantity: 1, chance: 1.28 },
      { itemId: 'sweetcorn_seed', quantity: 1, chance: 0.64 },
      { itemId: 'strawberry_seed', quantity: 1, chance: 0.32 },
      { itemId: 'watermelon_seed', quantity: 1, chance: 0.16 },
      { itemId: 'guam_leaf', quantity: 1, chance: 4.35 },
      { itemId: 'marrentill', quantity: 1, chance: 3.23 },
      { itemId: 'tarromin', quantity: 1, chance: 2.44 },
      { itemId: 'harralander', quantity: 1, chance: 1.89 },
      { itemId: 'ranarr_weed', quantity: 1, chance: 1.48 },
      { itemId: 'irit_leaf', quantity: 1, chance: 1.07 },
      { itemId: 'avantoe', quantity: 1, chance: 0.81 },
      { itemId: 'kwuarm', quantity: 1, chance: 0.67 },
      { itemId: 'cadantine', quantity: 1, chance: 0.54 },
      { itemId: 'lantadyme', quantity: 1, chance: 0.40 },
      { itemId: 'dwarf_weed', quantity: 1, chance: 0.40 },
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/cave_crawler.png'
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