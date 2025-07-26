import type { Location } from '../../types/game';
import { ITEM_CATEGORIES } from '../../constants/items';

export const rooftopThievingLocation: Location = {
  id: 'rooftop_thieving',
  name: 'Rooftop Thieving',
  description: 'A series of rooftops perfect for training thieving and agility skills.',
  type: 'resource',
  levelRequired: 1,
  monsters: [],
  resources: ['pickpocket_targets'],
  category: ITEM_CATEGORIES.MISC,
  icon: '/assets/BG/rooftop_thieving.webp',
  availableSkills: ['thieving', 'agility'],
  actions: [
    // Agility actions
    {
      id: 'rooftop_agility_course',
      name: 'Rooftop Agility Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 1,
      experience: 125,
      baseTime: 8000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      requirements: []
    },
    {
      id: 'rooftop_agility_course_advanced',
      name: 'Advanced Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 20,
      experience: 175,
      baseTime: 7000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      requirements: []
    },
    {
      id: 'rooftop_agility_course_expert',
      name: 'Expert Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 40,
      experience: 250,
      baseTime: 6000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      requirements: []
    },
    {
      id: 'rooftop_agility_course_master',
      name: 'Master Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 60,
      experience: 350,
      baseTime: 5000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      requirements: []
    },
    {
      id: 'rooftop_agility_course_elite',
      name: 'Elite Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 80,
      experience: 500,
      baseTime: 4000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      requirements: []
    },

    // Basic thieving targets
    {
      id: 'pickpocket_man',
      name: 'Pickpocket Man',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 1,
      experience: 8,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 3 },
      possibleLoot: [
        { id: 'coins', quantity: 3, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_woman',
      name: 'Pickpocket Woman',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 1,
      experience: 8,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 3 },
      possibleLoot: [
        { id: 'coins', quantity: 3, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_farmer',
      name: 'Pickpocket Farmer',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 10,
      experience: 14.5,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 9 },
      possibleLoot: [
        { id: 'coins', quantity: 9, chance: 0.8 },
        { id: 'potato', quantity: 1, chance: 0.3 },
        { id: 'onion', quantity: 1, chance: 0.2 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_guard',
      name: 'Pickpocket Guard',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 20,
      experience: 19.8,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 18 },
      possibleLoot: [
        { id: 'coins', quantity: 18, chance: 0.8 },
        { id: 'iron_ore', quantity: 1, chance: 0.1 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_warrior',
      name: 'Pickpocket Warrior',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 25,
      experience: 26.8,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 22 },
      possibleLoot: [
        { id: 'coins', quantity: 22, chance: 0.8 },
        { id: 'iron_bar', quantity: 1, chance: 0.1 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_rogue',
      name: 'Pickpocket Rogue',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 32,
      experience: 35.4,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 28 },
      possibleLoot: [
        { id: 'coins', quantity: 28, chance: 0.8 },
        { id: 'lockpick', quantity: 1, chance: 0.1 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_cave_goblin',
      name: 'Pickpocket Cave Goblin',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 36,
      experience: 47.8,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 40 },
      possibleLoot: [
        { id: 'coins', quantity: 40, chance: 0.8 },
        { id: 'iron_ore', quantity: 1, chance: 0.2 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_master_farmer',
      name: 'Pickpocket Master Farmer',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 38,
      experience: 43,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 30 },
      possibleLoot: [
        { id: 'coins', quantity: 30, chance: 0.8 },
        { id: 'potato_seed', quantity: 1, chance: 0.3 },
        { id: 'onion_seed', quantity: 1, chance: 0.2 },
        { id: 'cabbage_seed', quantity: 1, chance: 0.1 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_guard_dog',
      name: 'Pickpocket Guard Dog',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 40,
      experience: 52.4,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 50 },
      possibleLoot: [
        { id: 'coins', quantity: 50, chance: 0.8 },
        { id: 'bones', quantity: 1, chance: 0.3 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_fremennik_citizen',
      name: 'Pickpocket Fremennik Citizen',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 45,
      experience: 65,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 60 },
      possibleLoot: [
        { id: 'coins', quantity: 60, chance: 0.8 },
        { id: 'iron_bar', quantity: 1, chance: 0.2 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_bandit',
      name: 'Pickpocket Bandit',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 53,
      experience: 79.5,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 75 },
      possibleLoot: [
        { id: 'coins', quantity: 75, chance: 0.8 },
        { id: 'iron_ore', quantity: 1, chance: 0.2 },
        { id: 'coal', quantity: 1, chance: 0.1 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_knight',
      name: 'Pickpocket Knight',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 55,
      experience: 84.3,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 80 },
      possibleLoot: [
        { id: 'coins', quantity: 80, chance: 0.8 },
        { id: 'steel_bar', quantity: 1, chance: 0.1 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_paladin',
      name: 'Pickpocket Paladin',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 70,
      experience: 151.8,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 160 },
      possibleLoot: [
        { id: 'coins', quantity: 160, chance: 0.8 },
        { id: 'mithril_bar', quantity: 1, chance: 0.1 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_gnome',
      name: 'Pickpocket Gnome',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 75,
      experience: 198.5,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 200 },
      possibleLoot: [
        { id: 'coins', quantity: 200, chance: 0.8 },
        { id: 'adamant_bar', quantity: 1, chance: 0.1 }
      ],
      requirements: []
    },
    {
      id: 'pickpocket_hero',
      name: 'Pickpocket Hero',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 80,
      experience: 275.7,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 300 },
      possibleLoot: [
        { id: 'coins', quantity: 300, chance: 0.8 },
        { id: 'rune_bar', quantity: 1, chance: 0.05 }
      ],
      requirements: []
    }
  ]
}; 