import type { Location, Monster } from '../../types/game';
import { ITEM_CATEGORIES } from '../../constants/items';

// Define slayer monsters
const SLAYER_MONSTERS: Record<string, Monster> = {
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

export const slayerCaveLocation: Location = {
  id: 'slayer_cave',
  name: 'Slayer Cave',
  description: 'A dark cave filled with creatures that require slayer training to defeat.',
  type: 'combat',
  levelRequired: 1,
  monsters: ['cave_bug', 'cave_crawler', 'cave_slime'],
  resources: [],
  category: ITEM_CATEGORIES.COMBAT,
  icon: '/assets/BG/slayer_cave.webp',
  availableSkills: ['attack', 'strength', 'defence', 'slayer'],
  actions: [
    {
      id: 'fight_cave_bug',
      name: 'Fight Cave Bug',
      type: 'combat',
      skill: 'attack',
      levelRequired: 1,
      experience: SLAYER_MONSTERS.cave_bug.maxHitpoints * 4,
      baseTime: 4000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      monster: SLAYER_MONSTERS.cave_bug,
      requirements: [
        { type: 'level', skill: 'slayer', level: 1 }
      ],
      location: 'slayer_cave'
    },
    {
      id: 'fight_cave_crawler',
      name: 'Fight Cave Crawler',
      type: 'combat',
      skill: 'attack',
      levelRequired: 5,
      experience: SLAYER_MONSTERS.cave_crawler.maxHitpoints * 4,
      baseTime: 5000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      monster: SLAYER_MONSTERS.cave_crawler,
      requirements: [
        { type: 'level', skill: 'slayer', level: 5 }
      ],
      location: 'slayer_cave'
    },
    {
      id: 'fight_cave_slime',
      name: 'Fight Cave Slime',
      type: 'combat',
      skill: 'attack',
      levelRequired: 10,
      experience: SLAYER_MONSTERS.cave_slime.maxHitpoints * 4,
      baseTime: 6000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      monster: SLAYER_MONSTERS.cave_slime,
      requirements: [
        { type: 'level', skill: 'slayer', level: 10 }
      ],
      location: 'slayer_cave'
    }
  ],
  isSlayerHub: true // Flag to indicate this is a slayer hub location
}; 