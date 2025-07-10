import type { Location, Monster } from '../../types/game';
import { ITEM_CATEGORIES } from '../../constants/items';

// Define monsters
export const MONSTERS: Record<string, Monster> = {
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    level: 2,
    hitpoints: 5,
    maxHitpoints: 5,
    combatStyle: 'melee',
    stats: {
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
      strengthMelee: 2,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'bronze_sword', quantity: 1, chance: 0.1 },
      { itemId: 'bronze_shield', quantity: 1, chance: 0.1 },
      { itemId: 'coins', quantity: 5, chance: 1.0 }
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/goblin.png'
  },
  rat: {
    id: 'rat',
    name: 'Giant Rat',
    level: 1,
    hitpoints: 3,
    maxHitpoints: 3,
    combatStyle: 'melee',
    stats: {
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
    },
    drops: [
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'coins', quantity: 1, chance: 0.5 }
    ],
    thumbnail: '/assets/monsters/rat.png'
  },
  chicken: {
    id: 'chicken',
    name: 'Chicken',
    level: 1,
    hitpoints: 3,
    maxHitpoints: 3,
    combatStyle: 'melee',
    stats: {
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
    },
    drops: [
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'raw_chicken', quantity: 1, chance: 1.0 },
      { itemId: 'feathers', quantity: 5, chance: 0.8 }
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/chicken.png'
  }
};

// Define combat locations
export const COMBAT_LOCATIONS: Record<string, Location> = {
  lumbridge_goblins: {
    id: 'lumbridge_goblins',
    name: 'Goblin Village',
    description: 'A small village inhabited by goblins. Good for beginners.',
    type: 'combat',
    levelRequired: 1,
    monsters: ['goblin'],
    resources: [],
    category: ITEM_CATEGORIES.COMBAT,
    icon: '/assets/locations/goblin_village.png',
    actions: [
      {
        id: 'fight_goblin',
        name: 'Fight Goblin',
        type: 'combat',
        skill: 'attack',
        levelRequired: 1,
        experience: MONSTERS.goblin.maxHitpoints * 4,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: MONSTERS.goblin,
        requirements: [],
        location: 'lumbridge_goblins'
      }
    ]
  },
  chicken_coop: {
    id: 'chicken_coop',
    name: 'Chicken Coop',
    description: 'A pen full of chickens. Great for collecting feathers.',
    type: 'combat',
    levelRequired: 1,
    monsters: ['chicken'],
    resources: [],
    category: ITEM_CATEGORIES.COMBAT,
    icon: '/assets/locations/chicken_coop.png',
    actions: [
      {
        id: 'fight_chicken',
        name: 'Fight Chicken',
        type: 'combat',
        skill: 'attack',
        levelRequired: 1,
        experience: MONSTERS.chicken.maxHitpoints * 4,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: MONSTERS.chicken,
        requirements: [],
        location: 'chicken_coop'
      }
    ]
  },
  rat_cellar: {
    id: 'rat_cellar',
    name: 'Rat Cellar',
    description: 'A dark cellar infested with giant rats.',
    type: 'combat',
    levelRequired: 1,
    monsters: ['rat'],
    resources: [],
    category: ITEM_CATEGORIES.COMBAT,
    icon: '/assets/locations/rat_cellar.png',
    actions: [
      {
        id: 'fight_rat',
        name: 'Fight Giant Rat',
        type: 'combat',
        skill: 'attack',
        levelRequired: 1,
        experience: MONSTERS.rat.maxHitpoints * 4,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: MONSTERS.rat,
        requirements: [],
        location: 'rat_cellar'
      }
    ]
  }
}; 