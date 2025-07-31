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
    // Agility actions - ordered by level required ascending
    {
      id: 'rooftop_agility_course',
      name: 'Rooftop Agility Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 1,
      experience: 125,
      baseTime: 8000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      requirements: [
        { type: 'level', skill: 'agility', level: 1 }
      ]
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
      requirements: [
        { type: 'level', skill: 'agility', level: 20 }
      ]
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
      requirements: [
        { type: 'level', skill: 'agility', level: 40 }
      ]
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
      requirements: [
        { type: 'level', skill: 'agility', level: 60 }
      ]
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
      requirements: [
        { type: 'level', skill: 'agility', level: 80 }
      ]
    },

    // Basic thieving targets - ordered by level required ascending
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
      requirements: [
        { type: 'level', skill: 'thieving', level: 1 }
      ]
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
      requirements: [
        { type: 'level', skill: 'thieving', level: 1 }
      ]
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
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 10 }
      ]
    },
    {
      id: 'pickpocket_guard',
      name: 'Pickpocket Guard',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 20,
      experience: 22.5,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 18 },
      possibleLoot: [
        { id: 'coins', quantity: 18, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 20 }
      ]
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
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 25 }
      ]
    },
    {
      id: 'pickpocket_rogue',
      name: 'Pickpocket Rogue',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 32,
      experience: 35.5,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 28 },
      possibleLoot: [
        { id: 'coins', quantity: 28, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 32 }
      ]
    },
    {
      id: 'pickpocket_cave_hobgoblin',
      name: 'Pickpocket Cave Hobgoblin',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 36,
      experience: 40,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 32 },
      possibleLoot: [
        { id: 'coins', quantity: 32, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 36 }
      ]
    },
    {
      id: 'pickpocket_master_farmer',
      name: 'Pickpocket Master Farmer',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 38,
      experience: 43,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 35 },
      possibleLoot: [
        { id: 'coins', quantity: 35, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 38 }
      ]
    },
    {
      id: 'pickpocket_guard_hill_giant',
      name: 'Pickpocket Guard (Hill Giant)',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 42,
      experience: 47,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 40 },
      possibleLoot: [
        { id: 'coins', quantity: 40, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 42 }
      ]
    },
    {
      id: 'pickpocket_fremennik_citizen',
      name: 'Pickpocket Fremennik Citizen',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 45,
      experience: 51.8,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 45 },
      possibleLoot: [
        { id: 'coins', quantity: 45, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 45 }
      ]
    },
    {
      id: 'pickpocket_bearded_pollnivnian_bandit',
      name: 'Pickpocket Bearded Pollnivnian Bandit',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 45,
      experience: 51.8,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 45 },
      possibleLoot: [
        { id: 'coins', quantity: 45, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 45 }
      ]
    },
    {
      id: 'pickpocket_desert_bandit',
      name: 'Pickpocket Desert Bandit',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 53,
      experience: 59.5,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 50 },
      possibleLoot: [
        { id: 'coins', quantity: 50, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 53 }
      ]
    },
    {
      id: 'pickpocket_knight_of_ardougne',
      name: 'Pickpocket Knight of Ardougne',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 55,
      experience: 84.3,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 55 },
      possibleLoot: [
        { id: 'coins', quantity: 55, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 55 }
      ]
    },
    {
      id: 'pickpocket_pollnivnian_bandit',
      name: 'Pickpocket Pollnivnian Bandit',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 55,
      experience: 84.3,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 55 },
      possibleLoot: [
        { id: 'coins', quantity: 55, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 55 }
      ]
    },
    {
      id: 'pickpocket_yanille_watchman',
      name: 'Pickpocket Yanille Watchman',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 65,
      experience: 137.5,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 60 },
      possibleLoot: [
        { id: 'coins', quantity: 60, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 65 }
      ]
    },
    {
      id: 'pickpocket_menaphite_thug',
      name: 'Pickpocket Menaphite Thug',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 65,
      experience: 137.5,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 60 },
      possibleLoot: [
        { id: 'coins', quantity: 60, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 65 }
      ]
    },
    {
      id: 'pickpocket_paladin',
      name: 'Pickpocket Paladin',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 70,
      experience: 151.8,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 65 },
      possibleLoot: [
        { id: 'coins', quantity: 65, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 70 }
      ]
    },
    {
      id: 'pickpocket_gnome',
      name: 'Pickpocket Gnome',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 75,
      experience: 198.5,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 70 },
      possibleLoot: [
        { id: 'coins', quantity: 70, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 75 }
      ]
    },
    {
      id: 'pickpocket_hero',
      name: 'Pickpocket Hero',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 80,
      experience: 275.7,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 75 },
      possibleLoot: [
        { id: 'coins', quantity: 75, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 80 }
      ]
    },
    {
      id: 'pickpocket_elf',
      name: 'Pickpocket Elf',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 85,
      experience: 353.3,
      baseTime: 3000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 80 },
      possibleLoot: [
        { id: 'coins', quantity: 80, chance: 0.8 },
        { id: 'bread', quantity: 1, chance: 0.2 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 85 }
      ]
    }
  ]
}; 