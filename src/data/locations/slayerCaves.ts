import type { Location, Monster } from '../../types/game';
import { ITEM_CATEGORIES } from '../../constants/items';

// Define slayer monsters for different difficulty levels
const EASY_SLAYER_MONSTERS: Record<string, Monster> = {
  cave_bug: {
    id: 'cave_bug',
    name: 'Cave Bug',
    level: 5,
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
      defenceMagic: 2,
      defenceRanged: 2,
      strengthMelee: 3,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'coins', quantity: 10, chance: 0.8 }
    ],
    slayerLevel: 1,
    slayerCategory: 'bugs',
    thumbnail: '/assets/ItemThumbnail/Combat/cave_bug.png'
  },
  cave_crawler: {
    id: 'cave_crawler',
    name: 'Cave Crawler',
    level: 10,
    hitpoints: 15,
    maxHitpoints: 15,
    combatStyle: 'melee',
    stats: {
      attackStab: 4,
      attackSlash: 4,
      attackCrush: 4,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 4,
      defenceSlash: 4,
      defenceCrush: 4,
      defenceMagic: 4,
      defenceRanged: 4,
      strengthMelee: 6,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'coins', quantity: 20, chance: 0.7 },
      { itemId: 'iron_ore', quantity: 1, chance: 0.3 }
    ],
    slayerLevel: 5,
    slayerCategory: 'crawlers',
    thumbnail: '/assets/ItemThumbnail/Combat/cave_crawler.png'
  },
  cave_slime: {
    id: 'cave_slime',
    name: 'Cave Slime',
    level: 15,
    hitpoints: 20,
    maxHitpoints: 20,
    combatStyle: 'melee',
    stats: {
      attackStab: 6,
      attackSlash: 6,
      attackCrush: 6,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 6,
      defenceSlash: 6,
      defenceCrush: 6,
      defenceMagic: 6,
      defenceRanged: 6,
      strengthMelee: 8,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'coins', quantity: 30, chance: 0.6 },
      { itemId: 'iron_ore', quantity: 1, chance: 0.4 }
    ],
    slayerLevel: 10,
    slayerCategory: 'slimes',
    thumbnail: '/assets/ItemThumbnail/Combat/cave_slime.png'
  }
};

const MEDIUM_SLAYER_MONSTERS: Record<string, Monster> = {
  cave_horror: {
    id: 'cave_horror',
    name: 'Cave Horror',
    level: 35,
    hitpoints: 45,
    maxHitpoints: 45,
    combatStyle: 'melee',
    stats: {
      attackStab: 15,
      attackSlash: 15,
      attackCrush: 15,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 15,
      defenceSlash: 15,
      defenceCrush: 15,
      defenceMagic: 15,
      defenceRanged: 15,
      strengthMelee: 20,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'coins', quantity: 100, chance: 0.8 },
      { itemId: 'iron_ore', quantity: 2, chance: 0.5 },
      { itemId: 'coal_ore', quantity: 1, chance: 0.4 }
    ],
    slayerLevel: 25,
    slayerCategory: 'horrors',
    thumbnail: '/assets/ItemThumbnail/Combat/cave_horror.png'
  },
  cave_abomination: {
    id: 'cave_abomination',
    name: 'Cave Abomination',
    level: 45,
    hitpoints: 60,
    maxHitpoints: 60,
    combatStyle: 'melee',
    stats: {
      attackStab: 20,
      attackSlash: 20,
      attackCrush: 20,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 20,
      defenceSlash: 20,
      defenceCrush: 20,
      defenceMagic: 20,
      defenceRanged: 20,
      strengthMelee: 25,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'coins', quantity: 150, chance: 0.7 },
      { itemId: 'coal_ore', quantity: 2, chance: 0.5 },
      { itemId: 'mithril_ore', quantity: 1, chance: 0.3 }
    ],
    slayerLevel: 35,
    slayerCategory: 'abominations',
    thumbnail: '/assets/ItemThumbnail/Combat/cave_abomination.png'
  }
};

const HARD_SLAYER_MONSTERS: Record<string, Monster> = {
  cave_demon: {
    id: 'cave_demon',
    name: 'Cave Demon',
    level: 75,
    hitpoints: 100,
    maxHitpoints: 100,
    combatStyle: 'melee',
    stats: {
      attackStab: 35,
      attackSlash: 35,
      attackCrush: 35,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 35,
      defenceSlash: 35,
      defenceCrush: 35,
      defenceMagic: 35,
      defenceRanged: 35,
      strengthMelee: 40,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'coins', quantity: 300, chance: 0.8 },
      { itemId: 'mithril_ore', quantity: 2, chance: 0.6 },
      { itemId: 'adamant_ore', quantity: 1, chance: 0.4 },
      { itemId: 'rune_ore', quantity: 1, chance: 0.1 }
    ],
    slayerLevel: 60,
    slayerCategory: 'demons',
    thumbnail: '/assets/ItemThumbnail/Combat/cave_demon.png'
  },
  cave_behemoth: {
    id: 'cave_behemoth',
    name: 'Cave Behemoth',
    level: 90,
    hitpoints: 120,
    maxHitpoints: 120,
    combatStyle: 'melee',
    stats: {
      attackStab: 45,
      attackSlash: 45,
      attackCrush: 45,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 45,
      defenceSlash: 45,
      defenceCrush: 45,
      defenceMagic: 45,
      defenceRanged: 45,
      strengthMelee: 50,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'coins', quantity: 500, chance: 0.7 },
      { itemId: 'adamant_ore', quantity: 2, chance: 0.5 },
      { itemId: 'rune_ore', quantity: 1, chance: 0.3 },
      { itemId: 'dragon_bones', quantity: 1, chance: 0.1 }
    ],
    slayerLevel: 75,
    slayerCategory: 'behemoths',
    thumbnail: '/assets/ItemThumbnail/Combat/cave_behemoth.png'
  }
};

const NIGHTMARE_SLAYER_MONSTERS: Record<string, Monster> = {
  cave_ancient: {
    id: 'cave_ancient',
    name: 'Cave Ancient',
    level: 120,
    hitpoints: 200,
    maxHitpoints: 200,
    combatStyle: 'melee',
    stats: {
      attackStab: 60,
      attackSlash: 60,
      attackCrush: 60,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 60,
      defenceSlash: 60,
      defenceCrush: 60,
      defenceMagic: 60,
      defenceRanged: 60,
      strengthMelee: 65,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'coins', quantity: 1000, chance: 0.8 },
      { itemId: 'rune_ore', quantity: 3, chance: 0.6 },
      { itemId: 'dragon_bones', quantity: 2, chance: 0.4 },
      { itemId: 'superior_dragon_bones', quantity: 1, chance: 0.1 }
    ],
    slayerLevel: 90,
    slayerCategory: 'ancients',
    thumbnail: '/assets/ItemThumbnail/Combat/cave_ancient.png'
  },
  cave_void_walker: {
    id: 'cave_void_walker',
    name: 'Cave Void Walker',
    level: 150,
    hitpoints: 250,
    maxHitpoints: 250,
    combatStyle: 'melee',
    stats: {
      attackStab: 75,
      attackSlash: 75,
      attackCrush: 75,
      attackMagic: 0,
      attackRanged: 0,
      defenceStab: 75,
      defenceSlash: 75,
      defenceCrush: 75,
      defenceMagic: 75,
      defenceRanged: 75,
      strengthMelee: 80,
      strengthRanged: 0,
      strengthMagic: 0,
      prayerBonus: 0
    },
    drops: [
      { itemId: 'bones', quantity: 1, chance: 1.0 },
      { itemId: 'coins', quantity: 2000, chance: 0.7 },
      { itemId: 'dragon_bones', quantity: 3, chance: 0.6 },
      { itemId: 'superior_dragon_bones', quantity: 2, chance: 0.4 },
      { itemId: 'pure_essence', quantity: 5, chance: 0.3 }
    ],
    slayerLevel: 99,
    slayerCategory: 'void_walkers',
    thumbnail: '/assets/ItemThumbnail/Combat/cave_void_walker.png'
  }
};

// Helper function to generate combat actions for a monster
const generateCombatAction = (monster: Monster, locationId: string) => ({
  id: `fight_${monster.id}`,
  name: `Fight ${monster.name}`,
  type: 'combat' as const,
  skill: 'attack' as const,
  levelRequired: monster.level,
  experience: monster.maxHitpoints * 4,
  baseTime: 4000 + (monster.level * 100),
  itemReward: { id: 'none', name: 'None', quantity: 0 },
  monster: monster,
  requirements: [
    { type: 'level' as const, skill: 'slayer' as const, level: monster.slayerLevel }
  ],
  location: locationId
});

// Easy Cave
export const easyCaveLocation: Location = {
  id: 'easy_cave',
  name: 'Easy Cave',
  description: 'A beginner-friendly slayer cave with weak creatures suitable for new slayers.',
  type: 'combat',
  levelRequired: 1,
  monsters: Object.keys(EASY_SLAYER_MONSTERS),
  resources: [],
  category: ITEM_CATEGORIES.COMBAT,
  icon: '/assets/locations/placeholder.png',
  availableSkills: ['attack', 'strength', 'defence', 'slayer'],
  actions: Object.values(EASY_SLAYER_MONSTERS).map(monster => 
    generateCombatAction(monster, 'easy_cave')
  )
};

// Medium Cave
export const mediumCaveLocation: Location = {
  id: 'medium_cave',
  name: 'Medium Cave',
  description: 'A moderately challenging slayer cave with stronger creatures requiring more experience.',
  type: 'combat',
  levelRequired: 25,
  monsters: Object.keys(MEDIUM_SLAYER_MONSTERS),
  resources: [],
  category: ITEM_CATEGORIES.COMBAT,
  icon: '/assets/locations/placeholder.png',
  availableSkills: ['attack', 'strength', 'defence', 'slayer'],
  actions: Object.values(MEDIUM_SLAYER_MONSTERS).map(monster => 
    generateCombatAction(monster, 'medium_cave')
  )
};

// Hard Cave
export const hardCaveLocation: Location = {
  id: 'hard_cave',
  name: 'Hard Cave',
  description: 'A dangerous slayer cave with powerful creatures that only experienced slayers should attempt.',
  type: 'combat',
  levelRequired: 60,
  monsters: Object.keys(HARD_SLAYER_MONSTERS),
  resources: [],
  category: ITEM_CATEGORIES.COMBAT,
  icon: '/assets/locations/placeholder.png',
  availableSkills: ['attack', 'strength', 'defence', 'slayer'],
  actions: Object.values(HARD_SLAYER_MONSTERS).map(monster => 
    generateCombatAction(monster, 'hard_cave')
  )
};

// Nightmare Cave
export const nightmareCaveLocation: Location = {
  id: 'nightmare_cave',
  name: 'Nightmare Cave',
  description: 'The most dangerous slayer cave, home to ancient and void creatures that only the strongest slayers can defeat.',
  type: 'combat',
  levelRequired: 90,
  monsters: Object.keys(NIGHTMARE_SLAYER_MONSTERS),
  resources: [],
  category: ITEM_CATEGORIES.COMBAT,
  icon: '/assets/locations/placeholder.png',
  availableSkills: ['attack', 'strength', 'defence', 'slayer'],
  actions: Object.values(NIGHTMARE_SLAYER_MONSTERS).map(monster => 
    generateCombatAction(monster, 'nightmare_cave')
  )
};

// Export all slayer cave locations as sub-locations
export const SLAYER_CAVE_LOCATIONS: Record<string, Location> = {
  easy_cave: easyCaveLocation,
  medium_cave: mediumCaveLocation,
  hard_cave: hardCaveLocation,
  nightmare_cave: nightmareCaveLocation
};

// Export all monsters for reference
export const ALL_SLAYER_MONSTERS = {
  ...EASY_SLAYER_MONSTERS,
  ...MEDIUM_SLAYER_MONSTERS,
  ...HARD_SLAYER_MONSTERS,
  ...NIGHTMARE_SLAYER_MONSTERS
}; 