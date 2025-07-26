import type { Location, Monster } from '../../types/game';
import { ITEM_CATEGORIES } from '../../constants/items';

// Define monsters
export const MONSTERS: Record<string, Monster> = {
  // Farm monsters
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
  },
  cow: {
    id: 'cow',
    name: 'Cow',
    level: 2,
    hitpoints: 8,
    maxHitpoints: 8,
    combatStyle: 'melee',
    stats: {
      attackStab: 2,
      attackSlash: 2,
      attackCrush: 2,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 2,
      defenceSlash: 2,
      defenceCrush: 2,
      defenceMagic: 1,
      defenceRanged: 1,
      strengthMelee: 3,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'raw_beef', quantity: 1, chance: 1.0 },
      { itemId: 'cowhide', quantity: 1, chance: 1.0 }
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/cow.png'
  },
  farmer: {
    id: 'farmer',
    name: 'Farmer',
    level: 7,
    hitpoints: 20,
    maxHitpoints: 20,
    combatStyle: 'melee',
    stats: {
      attackStab: 5,
      attackSlash: 5,
      attackCrush: 5,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 5,
      defenceSlash: 5,
      defenceCrush: 5,
      defenceMagic: 2,
      defenceRanged: 2,
      strengthMelee: 8,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 10, chance: 1.0 },
      { itemId: 'bread', quantity: 1, chance: 0.5 },
      { itemId: 'potato', quantity: 1, chance: 0.3 }
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/farmer.png'
  },

  // Lumbridge Swamp Cave monsters
  giant_frog: {
    id: 'giant_frog',
    name: 'Giant Frog',
    level: 25,
    hitpoints: 40,
    maxHitpoints: 40,
    combatStyle: 'melee',
    stats: {
      attackStab: 15,
      attackSlash: 15,
      attackCrush: 15,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 12,
      defenceSlash: 12,
      defenceCrush: 12,
      defenceMagic: 8,
      defenceRanged: 8,
      strengthMelee: 20,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 25, chance: 1.0 },
      { itemId: 'frog_legs', quantity: 1, chance: 0.8 },
      { itemId: 'big_bones', quantity: 1, chance: 1.0 }
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/giant_frog.png'
  },
  cave_crawler: {
    id: 'cave_crawler',
    name: 'Cave Crawler',
    level: 23,
    hitpoints: 35,
    maxHitpoints: 35,
    combatStyle: 'melee',
    stats: {
      attackStab: 12,
      attackSlash: 12,
      attackCrush: 12,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 10,
      defenceSlash: 10,
      defenceCrush: 10,
      defenceMagic: 6,
      defenceRanged: 6,
      strengthMelee: 18,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 20, chance: 1.0 },
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'spider_legs', quantity: 1, chance: 0.6 }
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/cave_crawler.png'
  },
  cave_slime: {
    id: 'cave_slime',
    name: 'Cave Slime',
    level: 28,
    hitpoints: 45,
    maxHitpoints: 45,
    combatStyle: 'melee',
    stats: {
      attackStab: 18,
      attackSlash: 18,
      attackCrush: 18,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 15,
      defenceSlash: 15,
      defenceCrush: 15,
      defenceMagic: 10,
      defenceRanged: 10,
      strengthMelee: 25,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 30, chance: 1.0 },
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'slime_ball', quantity: 1, chance: 0.7 }
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/cave_slime.png'
  },

  // Ice Dungeon monsters
  ice_warrior: {
    id: 'ice_warrior',
    name: 'Ice Warrior',
    level: 57,
    hitpoints: 80,
    maxHitpoints: 80,
    combatStyle: 'melee',
    stats: {
      attackStab: 35,
      attackSlash: 35,
      attackCrush: 35,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 30,
      defenceSlash: 30,
      defenceCrush: 30,
      defenceMagic: 20,
      defenceRanged: 20,
      strengthMelee: 45,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 100, chance: 1.0 },
      { itemId: 'big_bones', quantity: 1, chance: 1.0 },
      { itemId: 'iron_ore', quantity: 1, chance: 0.4 },
      { itemId: 'steel_ore', quantity: 1, chance: 0.2 }
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/ice_warrior.png'
  },
  ice_giant: {
    id: 'ice_giant',
    name: 'Ice Giant',
    level: 67,
    hitpoints: 100,
    maxHitpoints: 100,
    combatStyle: 'melee',
    stats: {
      attackStab: 45,
      attackSlash: 45,
      attackCrush: 45,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 40,
      defenceSlash: 40,
      defenceCrush: 40,
      defenceMagic: 25,
      defenceRanged: 25,
      strengthMelee: 55,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 150, chance: 1.0 },
      { itemId: 'big_bones', quantity: 1, chance: 1.0 },
      { itemId: 'iron_ore', quantity: 1, chance: 0.6 },
      { itemId: 'steel_ore', quantity: 1, chance: 0.3 },
      { itemId: 'mithril_ore', quantity: 1, chance: 0.1 }
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/ice_giant.png'
  },
  ice_elemental: {
    id: 'ice_elemental',
    name: 'Ice Elemental',
    level: 77,
    hitpoints: 120,
    maxHitpoints: 120,
    combatStyle: 'magic',
    stats: {
      attackStab: 20,
      attackSlash: 20,
      attackCrush: 20,
      attackMagic: 60,
      attackRanged: 0,
      defenceStab: 25,
      defenceSlash: 25,
      defenceCrush: 25,
      defenceMagic: 50,
      defenceRanged: 30,
      strengthMelee: 30,
      strengthRanged: 0,
      strengthMagic: 70,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'coins', quantity: 200, chance: 1.0 },
      { itemId: 'big_bones', quantity: 1, chance: 1.0 },
      { itemId: 'iron_ore', quantity: 1, chance: 0.8 },
      { itemId: 'steel_ore', quantity: 1, chance: 0.5 },
      { itemId: 'mithril_ore', quantity: 1, chance: 0.2 },
      { itemId: 'adamant_ore', quantity: 1, chance: 0.1 }
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/ice_elemental.png'
  }
};

// Main Combat hub location
export const combatLocation: Location = {
  id: 'combat',
  name: 'Combat',
  description: 'Various combat areas where you can fight monsters and gain combat experience.',
  type: 'combat',
  levelRequired: 1,
  monsters: [],
  resources: [],
  category: ITEM_CATEGORIES.COMBAT,
  icon: '/assets/locations/placeholder.png',
  availableSkills: ['attack', 'strength', 'defence', 'magic', 'ranged', 'prayer'],
  actions: [],
  isCombatHub: true // Flag to indicate this is a combat hub
};

// Define combat sub-locations
export const COMBAT_LOCATIONS: Record<string, Location> = {
  farm: {
    id: 'farm',
    name: 'Farm',
    description: 'A peaceful farm with chickens, cows, and the occasional farmer.',
    type: 'combat',
    levelRequired: 1,
    monsters: ['chicken', 'cow', 'farmer'],
    resources: [],
    category: ITEM_CATEGORIES.COMBAT,
    icon: '/assets/locations/placeholder.png',
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
        location: 'farm'
      },
      {
        id: 'fight_cow',
        name: 'Fight Cow',
        type: 'combat',
        skill: 'attack',
        levelRequired: 2,
        experience: MONSTERS.cow.maxHitpoints * 4,
        baseTime: 4000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: MONSTERS.cow,
        requirements: [],
        location: 'farm'
      },
      {
        id: 'fight_farmer',
        name: 'Fight Farmer',
        type: 'combat',
        skill: 'attack',
        levelRequired: 7,
        experience: MONSTERS.farmer.maxHitpoints * 4,
        baseTime: 5000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: MONSTERS.farmer,
        requirements: [],
        location: 'farm'
      }
    ]
  },
  lumbridge_swamp_cave: {
    id: 'lumbridge_swamp_cave',
    name: 'Lumbridge Swamp Cave',
    description: 'A dark cave in the Lumbridge Swamp filled with dangerous creatures.',
    type: 'combat',
    levelRequired: 23,
    monsters: ['giant_frog', 'cave_crawler', 'cave_slime'],
    resources: [],
    category: ITEM_CATEGORIES.COMBAT,
    icon: '/assets/locations/placeholder.png',
    actions: [
      {
        id: 'fight_giant_frog',
        name: 'Fight Giant Frog',
        type: 'combat',
        skill: 'attack',
        levelRequired: 25,
        experience: MONSTERS.giant_frog.maxHitpoints * 4,
        baseTime: 6000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: MONSTERS.giant_frog,
        requirements: [],
        location: 'lumbridge_swamp_cave'
      },
      {
        id: 'fight_cave_crawler',
        name: 'Fight Cave Crawler',
        type: 'combat',
        skill: 'attack',
        levelRequired: 23,
        experience: MONSTERS.cave_crawler.maxHitpoints * 4,
        baseTime: 5500,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: MONSTERS.cave_crawler,
        requirements: [],
        location: 'lumbridge_swamp_cave'
      },
      {
        id: 'fight_cave_slime',
        name: 'Fight Cave Slime',
        type: 'combat',
        skill: 'attack',
        levelRequired: 28,
        experience: MONSTERS.cave_slime.maxHitpoints * 4,
        baseTime: 6500,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: MONSTERS.cave_slime,
        requirements: [],
        location: 'lumbridge_swamp_cave'
      }
    ]
  },
  ice_dungeon: {
    id: 'ice_dungeon',
    name: 'Ice Dungeon',
    description: 'A freezing dungeon deep in the mountains, home to powerful ice creatures.',
    type: 'combat',
    levelRequired: 57,
    monsters: ['ice_warrior', 'ice_giant', 'ice_elemental'],
    resources: [],
    category: ITEM_CATEGORIES.COMBAT,
    icon: '/assets/locations/placeholder.png',
    actions: [
      {
        id: 'fight_ice_warrior',
        name: 'Fight Ice Warrior',
        type: 'combat',
        skill: 'attack',
        levelRequired: 57,
        experience: MONSTERS.ice_warrior.maxHitpoints * 4,
        baseTime: 8000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: MONSTERS.ice_warrior,
        requirements: [],
        location: 'ice_dungeon'
      },
      {
        id: 'fight_ice_giant',
        name: 'Fight Ice Giant',
        type: 'combat',
        skill: 'attack',
        levelRequired: 67,
        experience: MONSTERS.ice_giant.maxHitpoints * 4,
        baseTime: 9000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: MONSTERS.ice_giant,
        requirements: [],
        location: 'ice_dungeon'
      },
      {
        id: 'fight_ice_elemental',
        name: 'Fight Ice Elemental',
        type: 'combat',
        skill: 'attack',
        levelRequired: 77,
        experience: MONSTERS.ice_elemental.maxHitpoints * 4,
        baseTime: 10000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: MONSTERS.ice_elemental,
        requirements: [],
        location: 'ice_dungeon'
      }
    ]
  }
}; 