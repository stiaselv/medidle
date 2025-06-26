import type { Location, Character, StoreAction, SkillAction, CombatStats, Monster, ActionType, SkillName, ItemReward, CombatAction, CombatSelectionAction } from '../types/game';
import { createSkill } from '../types/game';
import { SMITHING_BASE_LEVELS } from './items';
import { EASY_MONSTERS, MEDIUM_MONSTERS, HARD_MONSTERS, NIGHTMARE_MONSTERS } from './monsters';

// Template for smithing items with their experience rewards and base times
const SMITHING_ACTIONS_TEMPLATE = [
  // Small, simple items (1 bar)
  { id: 'dagger', name: 'Dagger', levelOver: 0, bars: 1, exp: 12.5, time: 2000 },
  { id: 'axe', name: 'Axe', levelOver: 0, bars: 1, exp: 12.5, time: 2000 },
  { id: 'mace', name: 'Mace', levelOver: 1, bars: 1, exp: 12.5, time: 2000 },
  { id: 'medium_helm', name: 'Medium Helm', levelOver: 2, bars: 1, exp: 12.5, time: 2000 },
  { id: 'bolts_unf', name: 'Unfinished Bolts', levelOver: 2, bars: 1, exp: 12.5, time: 1500 },
  { id: 'sword', name: 'Sword', levelOver: 3, bars: 1, exp: 12.5, time: 2000 },
  { id: 'dart_tips', name: 'Dart Tips', levelOver: 3, bars: 1, exp: 12.5, time: 1500 },
  { id: 'nails', name: 'Nails', levelOver: 3, bars: 1, exp: 12.5, time: 1500 },
  
  // Medium items (2 bars)
  { id: 'scimitar', name: 'Scimitar', levelOver: 4, bars: 2, exp: 25, time: 3500 },
  { id: 'spear', name: 'Spear', levelOver: 4, bars: 1, exp: 12.5, time: 2500 },
  { id: 'arrowtips', name: 'Arrowtips', levelOver: 4, bars: 1, exp: 12.5, time: 1500 },
  { id: 'crossbow_limbs', name: 'Crossbow Limbs', levelOver: 5, bars: 1, exp: 12.5, time: 2500 },
  { id: 'longsword', name: 'Longsword', levelOver: 5, bars: 2, exp: 25, time: 3500 },
  { id: 'javelin_heads', name: 'Javelin Heads', levelOver: 5, bars: 1, exp: 12.5, time: 1500 },
  { id: 'full_helm', name: 'Full Helm', levelOver: 6, bars: 2, exp: 25, time: 3500 },
  { id: 'throwing_knives', name: 'Throwing Knives', levelOver: 6, bars: 1, exp: 12.5, time: 2000 },
  { id: 'square_shield', name: 'Square Shield', levelOver: 7, bars: 2, exp: 25, time: 3500 },
  
  // Large items (3+ bars)
  { id: 'warhammer', name: 'Warhammer', levelOver: 8, bars: 3, exp: 37.5, time: 5000 },
  { id: 'battleaxe', name: 'Battleaxe', levelOver: 9, bars: 3, exp: 37.5, time: 5000 },
  { id: 'chainbody', name: 'Chainbody', levelOver: 10, bars: 3, exp: 37.5, time: 5500 },
  { id: 'kiteshield', name: 'Kiteshield', levelOver: 11, bars: 3, exp: 37.5, time: 5500 },
  { id: 'claws', name: 'Claws', levelOver: 12, bars: 2, exp: 25, time: 4000 },
  { id: 'two_handed_sword', name: 'Two-handed Sword', levelOver: 13, bars: 3, exp: 37.5, time: 5500 },
  { id: 'platelegs', name: 'Platelegs', levelOver: 15, bars: 3, exp: 37.5, time: 6000 },
  { id: 'plateskirt', name: 'Plateskirt', levelOver: 15, bars: 3, exp: 37.5, time: 6000 },
  { id: 'platebody', name: 'Platebody', levelOver: 17, bars: 5, exp: 62.5, time: 8000 }
] as const;

// Function to generate smithing actions for a metal type
const generateSmithingActions = (metalType: keyof typeof SMITHING_BASE_LEVELS): SkillAction[] => {
  return SMITHING_ACTIONS_TEMPLATE.map(template => {
    const itemId = `${metalType}_${template.id}`;
    const level = SMITHING_BASE_LEVELS[metalType] + template.levelOver;
    
    // Experience per bar for each metal type
    const expPerBar = {
      bronze: 12.5,
      iron: 25,
      steel: 37.5,
      mithril: 50,
      adamant: 62.5,
      rune: 75
    }[metalType];

    return {
      id: `smith_${itemId}`,
      name: `${metalType.charAt(0).toUpperCase() + metalType.slice(1)} ${template.name}`,
      type: 'smithing',
      skill: 'smithing',
      levelRequired: level,
      experience: template.bars * expPerBar, // Calculate exp based on number of bars and metal type
      baseTime: template.time,
      itemReward: {
        id: itemId,
        name: `${metalType.charAt(0).toUpperCase() + metalType.slice(1)} ${template.name}`,
        quantity: 1
      },
      requirements: [
        {
          type: 'level',
          skill: 'smithing',
          level: level
        },
        {
          type: 'item',
          itemId: `${metalType}_bar`,
          quantity: template.bars,
          description: `${template.bars} ${metalType.charAt(0).toUpperCase() + metalType.slice(1)} bars`
        }
      ]
    };
  });
};

// Generate category actions for each metal type
const generateMetalCategories = (): SkillAction[] => {
  const metalTypes = ['bronze', 'iron', 'steel', 'mithril', 'adamant', 'rune'] as const;
  
  return metalTypes.map(metalType => ({
    id: `smith_${metalType}`,
    name: `${metalType.charAt(0).toUpperCase() + metalType.slice(1)} Smithing`,
    type: 'smithing_category',
    skill: 'smithing',
    levelRequired: SMITHING_BASE_LEVELS[metalType],
    experience: 0, // Categories don't give direct experience
    baseTime: 0, // Categories don't have a base time
    itemReward: {
      id: `${metalType}_bar`,
      name: `${metalType.charAt(0).toUpperCase() + metalType.slice(1)} Bar`,
      quantity: 0
    },
    requirements: [
      {
        type: 'level',
        skill: 'smithing',
        level: SMITHING_BASE_LEVELS[metalType]
      }
    ],
    subActions: generateSmithingActions(metalType)
  }));
};

const GOBLIN_STATS: CombatStats = {
  // Attack bonuses
  attackStab: 1,
  attackSlash: 1,
  attackCrush: 1,
  attackMagic: 0,
  attackRanged: 0,
  // Defence bonuses
  defenceStab: 1,
  defenceSlash: 1,
  defenceCrush: 1,
  defenceMagic: -5,
  defenceRanged: 1,
  // Other bonuses
  strengthMelee: 5,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

export const mockMonsters: Monster[] = [
  {
    id: 'goblin',
    name: 'Goblin',
    level: 2,
    hitpoints: 5,
    maxHitpoints: 5,
    combatStyle: 'melee',
    stats: GOBLIN_STATS,
    drops: [
      {
        itemId: 'coins',
        quantity: 5,
        chance: 100 // Always drops
      },
      {
        itemId: 'bronze_sword',
        quantity: 1,
        chance: 10 // 10% chance
      }
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/goblin.png'
  }
  // Add more monsters here...
];

// Define all locations
export const mockLocations: Location[] = [
  {
    id: 'general_store',
    name: 'General Store',
    description: 'A well-stocked shop where you can buy tools and sell your items.',
    type: 'city',
    levelRequired: 1,
    resources: [],
    category: 'store',
    icon: '/assets/locations/store.png',
    actions: [
      {
        id: 'general_store',
        name: 'General Store',
        type: 'store',
        skill: 'none',
        levelRequired: 1,
        experience: 0,
        baseTime: 0,
        itemReward: { id: '', name: '', quantity: 0 },
        storeItems: [
          // Woodcutting Tools
          {
            id: 'bronze_axe',
            name: 'Bronze Axe',
            buyPrice: 100,
            sellPrice: 40,
            levelRequired: 1,
            quantity: 999
          },
          {
            id: 'iron_axe',
            name: 'Iron Axe',
            buyPrice: 250,
            sellPrice: 100,
            levelRequired: 5,
            quantity: 999
          },
          {
            id: 'steel_axe',
            name: 'Steel Axe',
            buyPrice: 500,
            sellPrice: 200,
            levelRequired: 20,
            quantity: 999
          },
          {
            id: 'mithril_axe',
            name: 'Mithril Axe',
            buyPrice: 1000,
            sellPrice: 400,
            levelRequired: 30,
            quantity: 999
          },
          {
            id: 'adamant_axe',
            name: 'Adamant Axe',
            buyPrice: 2000,
            sellPrice: 800,
            levelRequired: 40,
            quantity: 999
          },
          {
            id: 'rune_axe',
            name: 'Rune Axe',
            buyPrice: 4000,
            sellPrice: 1600,
            levelRequired: 50,
            quantity: 999
          },

          // Mining Tools
          {
            id: 'bronze_pickaxe',
            name: 'Bronze Pickaxe',
            buyPrice: 100,
            sellPrice: 40,
            levelRequired: 1,
            quantity: 999
          },
          {
            id: 'iron_pickaxe',
            name: 'Iron Pickaxe',
            buyPrice: 250,
            sellPrice: 100,
            levelRequired: 5,
            quantity: 999
          },
          {
            id: 'steel_pickaxe',
            name: 'Steel Pickaxe',
            buyPrice: 500,
            sellPrice: 200,
            levelRequired: 20,
            quantity: 999
          },
          {
            id: 'mithril_pickaxe',
            name: 'Mithril Pickaxe',
            buyPrice: 1000,
            sellPrice: 400,
            levelRequired: 30,
            quantity: 999
          },
          {
            id: 'adamant_pickaxe',
            name: 'Adamant Pickaxe',
            buyPrice: 2000,
            sellPrice: 800,
            levelRequired: 40,
            quantity: 999
          },
          {
            id: 'rune_pickaxe',
            name: 'Rune Pickaxe',
            buyPrice: 4000,
            sellPrice: 1600,
            levelRequired: 50,
            quantity: 999
          },

          // Fishing Tools
          {
            id: 'small_net',
            name: 'Small Fishing Net',
            buyPrice: 100,
            sellPrice: 40,
            levelRequired: 1,
            quantity: 999
          },
          {
            id: 'fly_fishing_rod',
            name: 'Fly Fishing Rod',
            buyPrice: 500,
            sellPrice: 200,
            levelRequired: 20,
            quantity: 999
          },
          {
            id: 'harpoon',
            name: 'Harpoon',
            buyPrice: 1000,
            sellPrice: 400,
            levelRequired: 35,
            quantity: 999
          }
        ]
      }
    ]
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'A dense forest filled with various trees and fishing spots.',
    type: 'resource',
    levelRequired: 1,
    resources: ['logs', 'oak_logs', 'willow_logs', 'teak_logs', 'maple_logs', 'mahogany_logs', 'yew_logs', 'magic_logs', 'redwood_logs'],
    category: 'woodcutting',
    icon: '/assets/locations/forest.png',
    actions: [
      {
        id: 'cut_tree',
        name: 'Cut Tree',
        type: 'woodcutting',
        skill: 'woodcutting',
        levelRequired: 1,
        experience: 25,
        baseTime: 3000,
        itemReward: {
          id: 'logs',
          name: 'Logs',
          quantity: 1,
          thumbnail: '/assets/items/logs.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'woodcutting',
            level: 1
          },
          {
            type: 'equipment',
            itemId: 'bronze_axe'
          }
        ]
      },
      {
        id: 'cut_oak',
        name: 'Cut Oak Tree',
        type: 'woodcutting',
        skill: 'woodcutting',
        levelRequired: 15,
        experience: 37.5,
        baseTime: 5000,
        itemReward: {
          id: 'oak_logs',
          name: 'Oak Logs',
          quantity: 1,
          thumbnail: '/assets/items/oak_logs.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'woodcutting',
            level: 15
          },
          {
            type: 'equipment',
            itemId: 'bronze_axe'
          }
        ]
      },
      {
        id: 'cut_willow',
        name: 'Cut Willow Tree',
        type: 'woodcutting',
        skill: 'woodcutting',
        levelRequired: 30,
        experience: 67.5,
        baseTime: 4000,
        itemReward: {
          id: 'willow_logs',
          name: 'Willow Logs',
          quantity: 1,
          thumbnail: '/assets/items/willow_logs.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'woodcutting',
            level: 30
          },
          {
            type: 'equipment',
            itemId: 'bronze_axe'
          }
        ]
      },
      {
        id: 'cut_teak',
        name: 'Cut Teak Tree',
        type: 'woodcutting',
        skill: 'woodcutting',
        levelRequired: 35,
        experience: 85,
        baseTime: 4000,
        itemReward: {
          id: 'teak_logs',
          name: 'Teak Logs',
          quantity: 1,
          thumbnail: '/assets/items/teak_logs.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'woodcutting',
            level: 35
          },
          {
            type: 'equipment',
            itemId: 'steel_axe'
          }
        ]
      },
      {
        id: 'cut_maple',
        name: 'Cut Maple Tree',
        type: 'woodcutting',
        skill: 'woodcutting',
        levelRequired: 45,
        experience: 100,
        baseTime: 6000,
        itemReward: {
          id: 'maple_logs',
          name: 'Maple Logs',
          quantity: 1,
          thumbnail: '/assets/items/maple_logs.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'woodcutting',
            level: 45
          },
          {
            type: 'equipment',
            itemId: 'mithril_axe'
          }
        ]
      },
      {
        id: 'cut_mahogany',
        name: 'Cut Mahogany Tree',
        type: 'woodcutting',
        skill: 'woodcutting',
        levelRequired: 50,
        experience: 125,
        baseTime: 6000,
        itemReward: {
          id: 'mahogany_logs',
          name: 'Mahogany Logs',
          quantity: 1,
          thumbnail: '/assets/items/mahogany_logs.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'woodcutting',
            level: 50
          },
          {
            type: 'equipment',
            itemId: 'adamant_axe'
          }
        ]
      },
      {
        id: 'cut_yew',
        name: 'Cut Yew Tree',
        type: 'woodcutting',
        skill: 'woodcutting',
        levelRequired: 60,
        experience: 175,
        baseTime: 8000,
        itemReward: {
          id: 'yew_logs',
          name: 'Yew Logs',
          quantity: 1,
          thumbnail: '/assets/items/yew_logs.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'woodcutting',
            level: 60
          },
          {
            type: 'equipment',
            itemId: 'rune_axe'
          }
        ]
      },
      {
        id: 'cut_magic',
        name: 'Cut Magic Tree',
        type: 'woodcutting',
        skill: 'woodcutting',
        levelRequired: 75,
        experience: 250,
        baseTime: 12000,
        itemReward: {
          id: 'magic_logs',
          name: 'Magic Logs',
          quantity: 1,
          thumbnail: '/assets/items/magic_logs.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'woodcutting',
            level: 75
          },
          {
            type: 'equipment',
            itemId: 'rune_axe'
          }
        ]
      },
      {
        id: 'cut_redwood',
        name: 'Cut Redwood Tree',
        type: 'woodcutting',
        skill: 'woodcutting',
        levelRequired: 90,
        experience: 380,
        baseTime: 10000,
        itemReward: {
          id: 'redwood_logs',
          name: 'Redwood Logs',
          quantity: 1,
          thumbnail: '/assets/items/redwood_logs.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'woodcutting',
            level: 90
          },
          {
            type: 'equipment',
            itemId: 'rune_axe'
          }
        ]
      },
      {
        id: 'fish_shrimp',
        name: 'Fish Shrimp',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 1,
        experience: 10,
        baseTime: 3000,
        itemReward: {
          id: 'raw_shrimp',
          name: 'Raw Shrimp',
          quantity: 1,
          thumbnail: '/assets/items/raw_shrimp.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 1
          },
          {
            type: 'equipment',
            itemId: 'small_fishing_net'
          }
        ]
      },
      {
        id: 'fish_sardine',
        name: 'Fish Sardine',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 5,
        experience: 20,
        baseTime: 4000,
        itemReward: {
          id: 'raw_sardine',
          name: 'Raw Sardine',
          quantity: 1,
          thumbnail: '/assets/items/raw_sardine.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 5
          },
          {
            type: 'equipment',
            itemId: 'small_fishing_net'
          }
        ]
      },
      {
        id: 'fish_trout',
        name: 'Fish Trout',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 20,
        experience: 50,
        baseTime: 5000,
        itemReward: {
          id: 'raw_trout',
          name: 'Raw Trout',
          quantity: 1,
          thumbnail: '/assets/items/raw_trout.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 20
          },
          {
            type: 'equipment',
            itemId: 'small_fishing_net'
          }
        ]
      },
      {
        id: 'fish_herring',
        name: 'Fish Herring',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 10,
        experience: 30,
        baseTime: 4000,
        itemReward: {
          id: 'raw_herring',
          name: 'Raw Herring',
          quantity: 1,
          thumbnail: '/assets/items/raw_herring.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 10
          },
          {
            type: 'equipment',
            itemId: 'fishing_rod'
          }
        ]
      },
      {
        id: 'fish_pike',
        name: 'Fish Pike',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 25,
        experience: 60,
        baseTime: 5000,
        itemReward: {
          id: 'raw_pike',
          name: 'Raw Pike',
          quantity: 1,
          thumbnail: '/assets/items/raw_pike.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 25
          },
          {
            type: 'equipment',
            itemId: 'fishing_rod'
          }
        ]
      },
      {
        id: 'fish_salmon',
        name: 'Fish Salmon',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 30,
        experience: 70,
        baseTime: 5500,
        itemReward: {
          id: 'raw_salmon',
          name: 'Raw Salmon',
          quantity: 1,
          thumbnail: '/assets/items/raw_salmon.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 30
          },
          {
            type: 'equipment',
            itemId: 'harpoon'
          },
          {
            type: 'item',
            itemId: 'feathers',
            quantity: 1
          }
        ]
      },
      {
        id: 'fish_tuna',
        name: 'Fish Tuna',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 35,
        experience: 80,
        baseTime: 6000,
        itemReward: {
          id: 'raw_tuna',
          name: 'Raw Tuna',
          quantity: 1,
          thumbnail: '/assets/items/raw_tuna.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 35
          },
          {
            type: 'equipment',
            itemId: 'harpoon'
          }
        ]
      },
      {
        id: 'fish_lobster',
        name: 'Fish Lobster',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 40,
        experience: 90,
        baseTime: 6500,
        itemReward: {
          id: 'raw_lobster',
          name: 'Raw Lobster',
          quantity: 1,
          thumbnail: '/assets/items/raw_lobster.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 40
          },
          {
            type: 'equipment',
            itemId: 'lobster_pot'
          }
        ]
      },
      {
        id: 'fish_bass',
        name: 'Fish Bass',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 46,
        experience: 100,
        baseTime: 7000,
        itemReward: {
          id: 'raw_bass',
          name: 'Raw Bass',
          quantity: 1,
          thumbnail: '/assets/items/raw_bass.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 46
          },
          {
            type: 'equipment',
            itemId: 'big_net'
          }
        ]
      },
      {
        id: 'fish_swordfish',
        name: 'Fish Swordfish',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 50,
        experience: 120,
        baseTime: 7500,
        itemReward: {
          id: 'raw_swordfish',
          name: 'Raw Swordfish',
          quantity: 1,
          thumbnail: '/assets/items/raw_swordfish.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 50
          },
          {
            type: 'equipment',
            itemId: 'harpoon'
          }
        ]
      },
      {
        id: 'fish_monkfish',
        name: 'Fish Monkfish',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 62,
        experience: 150,
        baseTime: 8000,
        itemReward: {
          id: 'raw_monkfish',
          name: 'Raw Monkfish',
          quantity: 1,
          thumbnail: '/assets/items/raw_monkfish.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 62
          },
          {
            type: 'equipment',
            itemId: 'small_net'
          }
        ]
      },
      {
        id: 'fish_shark',
        name: 'Fish Shark',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 76,
        experience: 200,
        baseTime: 9000,
        itemReward: {
          id: 'raw_shark',
          name: 'Raw Shark',
          quantity: 1,
          thumbnail: '/assets/items/raw_shark.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 76
          },
          {
            type: 'equipment',
            itemId: 'harpoon'
          }
        ]
      },
      {
        id: 'fish_anglerfish',
        name: 'Fish Anglerfish',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 82,
        experience: 250,
        baseTime: 9500,
        itemReward: {
          id: 'raw_anglerfish',
          name: 'Raw Anglerfish',
          quantity: 1,
          thumbnail: '/assets/items/raw_anglerfish.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 82
          },
          {
            type: 'equipment',
            itemId: 'fishing_rod'
          }
        ]
      },
      {
        id: 'fish_dark_crab',
        name: 'Fish Dark Crab',
        type: 'fishing',
        skill: 'fishing',
        levelRequired: 85,
        experience: 300,
        baseTime: 10000,
        itemReward: {
          id: 'raw_dark_crab',
          name: 'Raw Dark Crab',
          quantity: 1,
          thumbnail: '/assets/items/raw_dark_crab.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'fishing',
            level: 85
          },
          {
            type: 'equipment',
            itemId: 'lobster_pot'
          }
        ]
      }
    ]
  },
  {
    id: 'quarry',
    name: 'Quarry',
    description: 'A rocky quarry with various ores and a smithing area.',
    type: 'resource',
    levelRequired: 1,
    resources: ['copper_ore', 'tin_ore', 'iron_ore', 'silver_ore', 'gold_ore', 'mithril_ore', 'adamantite_ore', 'runite_ore'],
    category: 'mining',
    icon: '/assets/locations/quarry.png',
    actions: [
      {
        id: 'mine_copper',
        name: 'Mine Copper',
        type: 'mining',
        skill: 'mining',
        levelRequired: 1,
        experience: 17.5,
        baseTime: 3000,
        itemReward: {
          id: 'copper_ore',
          name: 'Copper Ore',
          quantity: 1,
          thumbnail: '/assets/items/copper_ore.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'mining',
            level: 1
          },
          {
            type: 'equipment',
            itemId: 'bronze_pickaxe'
          }
        ]
      },
      {
        id: 'mine_tin',
        name: 'Mine Tin',
        type: 'mining',
        skill: 'mining',
        levelRequired: 1,
        experience: 17.5,
        baseTime: 3000,
        itemReward: {
          id: 'tin_ore',
          name: 'Tin Ore',
          quantity: 1,
          thumbnail: '/assets/items/tin_ore.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'mining',
            level: 1
          },
          {
            type: 'equipment',
            itemId: 'bronze_pickaxe'
          }
        ]
      },
      {
        id: 'mine_iron',
        name: 'Mine Iron',
        type: 'mining',
        skill: 'mining',
        levelRequired: 15,
        experience: 35,
        baseTime: 4000,
        itemReward: {
          id: 'iron_ore',
          name: 'Iron Ore',
          quantity: 1,
          thumbnail: '/assets/items/iron_ore.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'mining',
            level: 15
          },
          {
            type: 'equipment',
            itemId: 'bronze_pickaxe'
          }
        ]
      },
      {
        id: 'mine_silver',
        name: 'Mine Silver',
        type: 'mining',
        skill: 'mining',
        levelRequired: 20,
        experience: 40,
        baseTime: 4500,
        itemReward: {
          id: 'silver_ore',
          name: 'Silver Ore',
          quantity: 1,
          thumbnail: '/assets/ItemThumbnail/Mining/Silver_Ore.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'mining',
            level: 20
          },
          {
            type: 'equipment',
            itemId: 'steel_pickaxe'
          }
        ]
      },
      {
        id: 'mine_pure_essence',
        name: 'Mine Pure Essence',
        type: 'mining',
        skill: 'mining',
        levelRequired: 30,
        experience: 50,
        baseTime: 5000,
        itemReward: {
          id: 'pure_essence',
          name: 'Pure Essence',
          quantity: 1,
          thumbnail: '/assets/ItemThumbnail/Mining/Pure_Essence.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'mining',
            level: 30
          },
          {
            type: 'equipment',
            itemId: 'steel_pickaxe'
          }
        ]
      },
      {
        id: 'mine_gold',
        name: 'Mine Gold',
        type: 'mining',
        skill: 'mining',
        levelRequired: 40,
        experience: 65,
        baseTime: 6000,
        itemReward: {
          id: 'gold_ore',
          name: 'Gold Ore',
          quantity: 1,
          thumbnail: '/assets/ItemThumbnail/Mining/Gold_Ore.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'mining',
            level: 40
          },
          {
            type: 'equipment',
            itemId: 'steel_pickaxe'
          }
        ]
      },
      {
        id: 'mine_mithril',
        name: 'Mine Mithril',
        type: 'mining',
        skill: 'mining',
        levelRequired: 55,
        experience: 80,
        baseTime: 7000,
        itemReward: {
          id: 'mithril_ore',
          name: 'Mithril Ore',
          quantity: 1,
          thumbnail: '/assets/ItemThumbnail/Mining/Mithril_Ore.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'mining',
            level: 55
          },
          {
            type: 'equipment',
            itemId: 'mithril_pickaxe'
          }
        ]
      },
      {
        id: 'mine_adamantite',
        name: 'Mine Adamantite',
        type: 'mining',
        skill: 'mining',
        levelRequired: 70,
        experience: 95,
        baseTime: 8000,
        itemReward: {
          id: 'adamantite_ore',
          name: 'Adamantite Ore',
          quantity: 1,
          thumbnail: '/assets/ItemThumbnail/Mining/Adamantite_Ore.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'mining',
            level: 70
          },
          {
            type: 'equipment',
            itemId: 'adamant_pickaxe'
          }
        ]
      },
      {
        id: 'mine_runite',
        name: 'Mine Runite',
        type: 'mining',
        skill: 'mining',
        levelRequired: 85,
        experience: 125,
        baseTime: 9000,
        itemReward: {
          id: 'runite_ore',
          name: 'Runite Ore',
          quantity: 1,
          thumbnail: '/assets/ItemThumbnail/Mining/Runite_Ore.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'mining',
            level: 85
          },
          {
            type: 'equipment',
            itemId: 'rune_pickaxe'
          }
        ]
      },
      {
        id: 'mine_amethyst',
        name: 'Mine Amethyst',
        type: 'mining',
        skill: 'mining',
        levelRequired: 92,
        experience: 170,
        baseTime: 10000,
        itemReward: {
          id: 'amethyst',
          name: 'Amethyst',
          quantity: 1,
          thumbnail: '/assets/ItemThumbnail/Mining/Amethyst.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'mining',
            level: 92
          },
          {
            type: 'equipment',
            itemId: 'rune_pickaxe'
          }
        ]
      },
      {
        id: 'smelt_bronze',
        name: 'Smelt Bronze',
        type: 'smithing',
        skill: 'smithing',
        levelRequired: 1,
        experience: 6.2,
        baseTime: 3000,
        itemReward: {
          id: 'bronze_bar',
          name: 'Bronze Bar',
          quantity: 1,
          thumbnail: '/assets/items/bronze_bar.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'smithing',
            level: 1
          },
          {
            type: 'item',
            itemId: 'copper_ore',
            quantity: 1
          },
          {
            type: 'item',
            itemId: 'tin_ore',
            quantity: 1
          }
        ]
      },
      {
        id: 'smelt_iron',
        name: 'Smelt Iron',
        type: 'smithing',
        skill: 'smithing',
        levelRequired: 15,
        experience: 12.5,
        baseTime: 3000,
        itemReward: {
          id: 'iron_bar',
          name: 'Iron Bar',
          quantity: 1,
          thumbnail: '/assets/items/iron_bar.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'smithing',
            level: 15
          },
          {
            type: 'item',
            itemId: 'iron_ore',
            quantity: 1
          }
        ]
      },
      {
        id: 'smelt_silver',
        name: 'Smelt Silver',
        type: 'smithing',
        skill: 'smithing',
        levelRequired: 20,
        experience: 13.7,
        baseTime: 3500,
        itemReward: {
          id: 'silver_bar',
          name: 'Silver Bar',
          quantity: 1,
          thumbnail: '/assets/items/silver_bar.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'smithing',
            level: 20
          },
          {
            type: 'item',
            itemId: 'silver_ore',
            quantity: 1
          }
        ]
      },
      {
        id: 'smelt_steel',
        name: 'Smelt Steel',
        type: 'smithing',
        skill: 'smithing',
        levelRequired: 30,
        experience: 17.5,
        baseTime: 4000,
        itemReward: {
          id: 'steel_bar',
          name: 'Steel Bar',
          quantity: 1,
          thumbnail: '/assets/items/steel_bar.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'smithing',
            level: 30
          },
          {
            type: 'item',
            itemId: 'iron_ore',
            quantity: 1
          },
          {
            type: 'item',
            itemId: 'coal',
            quantity: 2
          }
        ]
      },
      {
        id: 'smelt_gold',
        name: 'Smelt Gold',
        type: 'smithing',
        skill: 'smithing',
        levelRequired: 40,
        experience: 22.5,
        baseTime: 4500,
        itemReward: {
          id: 'gold_bar',
          name: 'Gold Bar',
          quantity: 1,
          thumbnail: '/assets/items/gold_bar.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'smithing',
            level: 40
          },
          {
            type: 'item',
            itemId: 'gold_ore',
            quantity: 1
          }
        ]
      },
      {
        id: 'smelt_mithril',
        name: 'Smelt Mithril',
        type: 'smithing',
        skill: 'smithing',
        levelRequired: 50,
        experience: 30,
        baseTime: 5000,
        itemReward: {
          id: 'mithril_bar',
          name: 'Mithril Bar',
          quantity: 1,
          thumbnail: '/assets/items/mithril_bar.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'smithing',
            level: 50
          },
          {
            type: 'item',
            itemId: 'mithril_ore',
            quantity: 1
          },
          {
            type: 'item',
            itemId: 'coal',
            quantity: 4
          }
        ]
      },
      {
        id: 'smelt_adamant',
        name: 'Smelt Adamant',
        type: 'smithing',
        skill: 'smithing',
        levelRequired: 70,
        experience: 37.5,
        baseTime: 6000,
        itemReward: {
          id: 'adamant_bar',
          name: 'Adamant Bar',
          quantity: 1,
          thumbnail: '/assets/items/adamant_bar.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'smithing',
            level: 70
          },
          {
            type: 'item',
            itemId: 'adamantite_ore',
            quantity: 1
          },
          {
            type: 'item',
            itemId: 'coal',
            quantity: 6
          }
        ]
      },
      {
        id: 'smelt_runite',
        name: 'Smelt Runite',
        type: 'smithing',
        skill: 'smithing',
        levelRequired: 85,
        experience: 50,
        baseTime: 7000,
        itemReward: {
          id: 'runite_bar',
          name: 'Runite Bar',
          quantity: 1,
          thumbnail: '/assets/items/runite_bar.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'smithing',
            level: 85
          },
          {
            type: 'item',
            itemId: 'runite_ore',
            quantity: 1
          },
          {
            type: 'item',
            itemId: 'coal',
            quantity: 8
          }
        ]
      }
    ]
  },
  {
    id: 'camp',
    name: 'Camp',
    description: 'A cozy camp where you can cook your food and practice firemaking.',
    type: 'resource',
    levelRequired: 1,
    resources: ['logs', 'oak_logs', 'willow_logs', 'maple_logs', 'yew_logs', 'magic_logs'],
    category: 'cooking',
    icon: '/assets/locations/camp.png',
    actions: [
      {
        id: 'cook_meat',
        name: 'Cook Meat',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 1,
        experience: 30,
        baseTime: 3000,
        itemReward: {
          id: 'cooked_meat',
          name: 'Cooked Meat',
          quantity: 1,
          thumbnail: '/assets/items/cooked_meat.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 1
          },
          {
            type: 'item',
            itemId: 'raw_meat',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_chicken',
        name: 'Cook Chicken',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 1,
        experience: 30,
        baseTime: 3000,
        itemReward: {
          id: 'cooked_chicken',
          name: 'Cooked Chicken',
          quantity: 1,
          thumbnail: '/assets/items/cooked_chicken.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 1
          },
          {
            type: 'item',
            itemId: 'raw_chicken',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_shrimp',
        name: 'Cook Shrimp',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 1,
        experience: 30,
        baseTime: 3000,
        itemReward: {
          id: 'cooked_shrimp',
          name: 'Cooked Shrimp',
          quantity: 1,
          thumbnail: '/assets/items/cooked_shrimp.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 1
          },
          {
            type: 'item',
            itemId: 'raw_shrimp',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_sardine',
        name: 'Cook Sardine',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 5,
        experience: 40,
        baseTime: 3000,
        itemReward: {
          id: 'cooked_sardine',
          name: 'Cooked Sardine',
          quantity: 1,
          thumbnail: '/assets/items/cooked_sardine.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 5
          },
          {
            type: 'item',
            itemId: 'raw_sardine',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_herring',
        name: 'Cook Herring',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 10,
        experience: 50,
        baseTime: 3000,
        itemReward: {
          id: 'cooked_herring',
          name: 'Cooked Herring',
          quantity: 1,
          thumbnail: '/assets/items/cooked_herring.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 10
          },
          {
            type: 'item',
            itemId: 'raw_herring',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_trout',
        name: 'Cook Trout',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 15,
        experience: 70,
        baseTime: 3500,
        itemReward: {
          id: 'cooked_trout',
          name: 'Cooked Trout',
          quantity: 1,
          thumbnail: '/assets/items/cooked_trout.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 15
          },
          {
            type: 'item',
            itemId: 'raw_trout',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_pike',
        name: 'Cook Pike',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 20,
        experience: 80,
        baseTime: 3500,
        itemReward: {
          id: 'cooked_pike',
          name: 'Cooked Pike',
          quantity: 1,
          thumbnail: '/assets/items/cooked_pike.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 20
          },
          {
            type: 'item',
            itemId: 'raw_pike',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_salmon',
        name: 'Cook Salmon',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 25,
        experience: 90,
        baseTime: 4000,
        itemReward: {
          id: 'cooked_salmon',
          name: 'Cooked Salmon',
          quantity: 1,
          thumbnail: '/assets/items/cooked_salmon.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 25
          },
          {
            type: 'item',
            itemId: 'raw_salmon',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_tuna',
        name: 'Cook Tuna',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 30,
        experience: 100,
        baseTime: 4000,
        itemReward: {
          id: 'cooked_tuna',
          name: 'Cooked Tuna',
          quantity: 1,
          thumbnail: '/assets/items/cooked_tuna.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 30
          },
          {
            type: 'item',
            itemId: 'raw_tuna',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_lobster',
        name: 'Cook Lobster',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 40,
        experience: 120,
        baseTime: 4500,
        itemReward: {
          id: 'cooked_lobster',
          name: 'Cooked Lobster',
          quantity: 1,
          thumbnail: '/assets/items/cooked_lobster.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 40
          },
          {
            type: 'item',
            itemId: 'raw_lobster',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_bass',
        name: 'Cook Bass',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 45,
        experience: 130,
        baseTime: 4500,
        itemReward: {
          id: 'cooked_bass',
          name: 'Cooked Bass',
          quantity: 1,
          thumbnail: '/assets/items/cooked_bass.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 45
          },
          {
            type: 'item',
            itemId: 'raw_bass',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_swordfish',
        name: 'Cook Swordfish',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 50,
        experience: 140,
        baseTime: 5000,
        itemReward: {
          id: 'cooked_swordfish',
          name: 'Cooked Swordfish',
          quantity: 1,
          thumbnail: '/assets/items/cooked_swordfish.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 50
          },
          {
            type: 'item',
            itemId: 'raw_swordfish',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_monkfish',
        name: 'Cook Monkfish',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 62,
        experience: 150,
        baseTime: 5000,
        itemReward: {
          id: 'cooked_monkfish',
          name: 'Cooked Monkfish',
          quantity: 1,
          thumbnail: '/assets/items/cooked_monkfish.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 62
          },
          {
            type: 'item',
            itemId: 'raw_monkfish',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_shark',
        name: 'Cook Shark',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 80,
        experience: 210,
        baseTime: 5500,
        itemReward: {
          id: 'cooked_shark',
          name: 'Cooked Shark',
          quantity: 1,
          thumbnail: '/assets/items/cooked_shark.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 80
          },
          {
            type: 'item',
            itemId: 'raw_shark',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_anglerfish',
        name: 'Cook Anglerfish',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 84,
        experience: 230,
        baseTime: 5500,
        itemReward: {
          id: 'cooked_anglerfish',
          name: 'Cooked Anglerfish',
          quantity: 1,
          thumbnail: '/assets/items/cooked_anglerfish.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 84
          },
          {
            type: 'item',
            itemId: 'raw_anglerfish',
            quantity: 1
          }
        ]
      },
      {
        id: 'cook_dark_crab',
        name: 'Cook Dark Crab',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 90,
        experience: 250,
        baseTime: 6000,
        itemReward: {
          id: 'cooked_dark_crab',
          name: 'Cooked Dark Crab',
          quantity: 1,
          thumbnail: '/assets/items/cooked_dark_crab.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'cooking',
            level: 90
          },
          {
            type: 'item',
            itemId: 'raw_dark_crab',
            quantity: 1
          }
        ]
      },
      {
        id: 'burn_logs',
        name: 'Burn Logs',
        type: 'firemaking',
        skill: 'firemaking',
        levelRequired: 1,
        experience: 40,
        baseTime: 3000,
        itemReward: {
          id: 'ashes',
          name: 'Ashes',
          quantity: 1,
          thumbnail: '/assets/items/ashes.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'firemaking',
            level: 1
          },
          {
            type: 'item',
            itemId: 'logs',
            quantity: 1
          }
        ]
      },
      {
        id: 'burn_oak_logs',
        name: 'Burn Oak Logs',
        type: 'firemaking',
        skill: 'firemaking',
        levelRequired: 15,
        experience: 60,
        baseTime: 4000,
        itemReward: {
          id: 'ashes',
          name: 'Ashes',
          quantity: 1,
          thumbnail: '/assets/items/ashes.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'firemaking',
            level: 15
          },
          {
            type: 'item',
            itemId: 'oak_logs',
            quantity: 1
          }
        ]
      },
      {
        id: 'burn_willow_logs',
        name: 'Burn Willow Logs',
        type: 'firemaking',
        skill: 'firemaking',
        levelRequired: 30,
        experience: 90,
        baseTime: 5000,
        itemReward: {
          id: 'ashes',
          name: 'Ashes',
          quantity: 1,
          thumbnail: '/assets/items/ashes.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'firemaking',
            level: 30
          },
          {
            type: 'item',
            itemId: 'willow_logs',
            quantity: 1
          }
        ]
      },
      {
        id: 'burn_teak_logs',
        name: 'Burn Teak Logs',
        type: 'firemaking',
        skill: 'firemaking',
        levelRequired: 35,
        experience: 105,
        baseTime: 5000,
        itemReward: {
          id: 'ashes',
          name: 'Ashes',
          quantity: 1,
          thumbnail: '/assets/items/ashes.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'firemaking',
            level: 35
          },
          {
            type: 'item',
            itemId: 'teak_logs',
            quantity: 1
          }
        ]
      },
      {
        id: 'burn_maple_logs',
        name: 'Burn Maple Logs',
        type: 'firemaking',
        skill: 'firemaking',
        levelRequired: 45,
        experience: 135,
        baseTime: 5500,
        itemReward: {
          id: 'ashes',
          name: 'Ashes',
          quantity: 1,
          thumbnail: '/assets/items/ashes.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'firemaking',
            level: 45
          },
          {
            type: 'item',
            itemId: 'maple_logs',
            quantity: 1
          }
        ]
      },
      {
        id: 'burn_mahogany_logs',
        name: 'Burn Mahogany Logs',
        type: 'firemaking',
        skill: 'firemaking',
        levelRequired: 50,
        experience: 157.5,
        baseTime: 6000,
        itemReward: {
          id: 'ashes',
          name: 'Ashes',
          quantity: 1,
          thumbnail: '/assets/items/ashes.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'firemaking',
            level: 50
          },
          {
            type: 'item',
            itemId: 'mahogany_logs',
            quantity: 1
          }
        ]
      },
      {
        id: 'burn_yew_logs',
        name: 'Burn Yew Logs',
        type: 'firemaking',
        skill: 'firemaking',
        levelRequired: 60,
        experience: 202.5,
        baseTime: 7000,
        itemReward: {
          id: 'ashes',
          name: 'Ashes',
          quantity: 1,
          thumbnail: '/assets/items/ashes.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'firemaking',
            level: 60
          },
          {
            type: 'item',
            itemId: 'yew_logs',
            quantity: 1
          }
        ]
      },
      {
        id: 'burn_magic_logs',
        name: 'Burn Magic Logs',
        type: 'firemaking',
        skill: 'firemaking',
        levelRequired: 75,
        experience: 303.8,
        baseTime: 8000,
        itemReward: {
          id: 'ashes',
          name: 'Ashes',
          quantity: 1,
          thumbnail: '/assets/items/ashes.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'firemaking',
            level: 75
          },
          {
            type: 'item',
            itemId: 'magic_logs',
            quantity: 1
          }
        ]
      },
      {
        id: 'burn_redwood_logs',
        name: 'Burn Redwood Logs',
        type: 'firemaking',
        skill: 'firemaking',
        levelRequired: 90,
        experience: 350,
        baseTime: 8500,
        itemReward: {
          id: 'ashes',
          name: 'Ashes',
          quantity: 1,
          thumbnail: '/assets/items/ashes.png'
        },
        requirements: [
          {
            type: 'level',
            skill: 'firemaking',
            level: 90
          },
          {
            type: 'item',
            itemId: 'redwood_logs',
            quantity: 1
          }
        ]
      }
    ]
  },
  {
    id: 'forge',
    name: 'Forge',
    description: 'A blazing forge where you can smith metal bars into various items.',
    type: 'resource',
    levelRequired: 1,
    resources: [],
    category: 'smithing',
    icon: '/assets/locations/forge.png',
    actions: generateMetalCategories(),
    availableSkills: ['smithing']
  },
  {
    id: 'slayer_cave',
    name: 'Slayer Cave',
    description: 'A dangerous cave system filled with various monsters. Visit the Slayer Master to get tasks.',
    type: 'combat',
    levelRequired: 1,
    resources: [],
    category: 'combat',
    icon: '/assets/locations/slayer_cave.png',
    group: 'Dungeons',
    actions: [
      {
        id: 'easy_cave',
        name: 'Easy Cave',
        type: 'combat_selection',
        skill: 'attack',
        levelRequired: 1,
        experience: 0,
        baseTime: 0,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        targetLocation: 'easy_cave',
        difficulty: 'Easy',
        requirements: []
      },
      {
        id: 'medium_cave',
        name: 'Medium Cave',
        type: 'combat_selection',
        skill: 'attack',
        levelRequired: 20,
        experience: 0,
        baseTime: 0,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        targetLocation: 'medium_cave',
        difficulty: 'Medium',
        requirements: []
      },
      {
        id: 'hard_cave',
        name: 'Hard Cave',
        type: 'combat_selection',
        skill: 'attack',
        levelRequired: 40,
        experience: 0,
        baseTime: 0,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        targetLocation: 'hard_cave',
        difficulty: 'Hard',
        requirements: []
      },
      {
        id: 'nightmare_cave',
        name: 'Nightmare Cave',
        type: 'combat_selection',
        skill: 'attack',
        levelRequired: 70,
        experience: 0,
        baseTime: 0,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        targetLocation: 'nightmare_cave',
        difficulty: 'Nightmare',
        requirements: []
      }
    ]
  },
  {
    id: 'easy_cave',
    name: 'Easy Cave',
    description: 'A cave filled with low-level monsters.',
    type: 'combat',
    levelRequired: 1,
    resources: [],
    category: 'combat',
    icon: '/assets/locations/cave.png',
    group: 'World',
    actions: EASY_MONSTERS.map(monster => ({
      id: `fight_${monster.id}`,
      name: `Fight ${monster.name}`,
      type: 'combat',
      skill: 'attack',
      levelRequired: monster.level,
      experience: monster.maxHitpoints * 4,
      baseTime: 3000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      monster,
      requirements: [],
      location: 'easy_cave'
    }))
  },
  {
    id: 'medium_cave',
    name: 'Medium Cave',
    description: 'A cave filled with medium-level monsters.',
    type: 'combat',
    levelRequired: 20,
    resources: [],
    category: 'combat',
    icon: '/assets/locations/cave.png',
    group: 'World',
    actions: MEDIUM_MONSTERS.map(monster => ({
      id: `fight_${monster.id}`,
      name: `Fight ${monster.name}`,
      type: 'combat',
      skill: 'attack',
      levelRequired: monster.level,
      experience: monster.maxHitpoints * 4,
      baseTime: 3000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      monster,
      requirements: [],
      location: 'medium_cave'
    }))
  },
  {
    id: 'hard_cave',
    name: 'Hard Cave',
    description: 'A cave filled with high-level monsters.',
    type: 'combat',
    levelRequired: 40,
    resources: [],
    category: 'combat',
    icon: '/assets/locations/cave.png',
    group: 'Dungeons',
    actions: HARD_MONSTERS.map(monster => ({
      id: `fight_${monster.id}`,
      name: `Fight ${monster.name}`,
      type: 'combat',
      skill: 'attack',
      levelRequired: monster.level,
      experience: monster.maxHitpoints * 4,
      baseTime: 3000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      monster,
      requirements: [],
      location: 'hard_cave'
    }))
  },
  {
    id: 'nightmare_cave',
    name: 'Nightmare Cave',
    description: 'A cave filled with extremely dangerous monsters.',
    type: 'combat',
    levelRequired: 70,
    resources: [],
    category: 'combat',
    icon: '/assets/locations/cave.png',
    group: 'Raids',
    actions: NIGHTMARE_MONSTERS.map(monster => ({
      id: `fight_${monster.id}`,
      name: `Fight ${monster.name}`,
      type: 'combat',
      skill: 'attack',
      levelRequired: monster.level,
      experience: monster.maxHitpoints * 4,
      baseTime: 3000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      monster,
      requirements: [],
      location: 'nightmare_cave'
    }))
  },
  {
    id: 'farm',
    name: 'Farm',
    description: 'A peaceful farm with livestock and a wary farmer.',
    type: 'combat',
    levelRequired: 3,
    resources: [],
    category: 'combat',
    icon: '/assets/locations/placeholder.png',
    group: 'World',
    actions: [
      {
        id: 'fight_chicken',
        name: 'Fight Chicken',
        type: 'combat',
        skill: 'attack',
        levelRequired: 3,
        experience: 12,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'chicken', name: 'Chicken', level: 3, hitpoints: 5, maxHitpoints: 5, combatStyle: 'melee', stats: { attackStab: 1, attackSlash: 1, attackCrush: 1, attackMagic: 0, attackRanged: 0, defenceStab: 1, defenceSlash: 1, defenceCrush: 1, defenceMagic: 1, defenceRanged: 1, strengthMelee: 1, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [
  { itemId: 'bones', quantity: 1, chance: 100.0 },
  { itemId: 'feather', quantity: 3, chance: 100.0 },
  { itemId: 'egg', quantity: 1, chance: 20.0 }
], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      },
      {
        id: 'fight_cow',
        name: 'Fight Cow',
        type: 'combat',
        skill: 'attack',
        levelRequired: 7,
        experience: 20,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'cow', name: 'Cow', level: 7, hitpoints: 12, maxHitpoints: 12, combatStyle: 'melee', stats: { attackStab: 2, attackSlash: 2, attackCrush: 2, attackMagic: 0, attackRanged: 0, defenceStab: 2, defenceSlash: 2, defenceCrush: 2, defenceMagic: 1, defenceRanged: 1, strengthMelee: 2, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [
  { itemId: 'bones', quantity: 1, chance: 100.0 },
  { itemId: 'cowhide', quantity: 1, chance: 100.0 }
], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      },
      {
        id: 'fight_farmer',
        name: 'Fight Farmer',
        type: 'combat',
        skill: 'attack',
        levelRequired: 9,
        experience: 30,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'farmer', name: 'Farmer', level: 9, hitpoints: 15, maxHitpoints: 15, combatStyle: 'melee', stats: { attackStab: 3, attackSlash: 3, attackCrush: 3, attackMagic: 0, attackRanged: 0, defenceStab: 3, defenceSlash: 3, defenceCrush: 3, defenceMagic: 2, defenceRanged: 2, strengthMelee: 3, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [
  { itemId: 'bones', quantity: 1, chance: 100.0 },
  { itemId: 'coins', quantity: 5, chance: 20.0 },
  { itemId: 'potato_seed', quantity: 1, chance: 5.0 },
  { itemId: 'guam_seed', quantity: 1, chance: 5.0 }
], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      }
    ]
  },
  {
    id: 'lumbridge_swamp',
    name: 'Lumbridge Swamp',
    description: 'A murky swamp crawling with dangerous creatures.',
    type: 'combat',
    levelRequired: 5,
    resources: [],
    category: 'combat',
    icon: '/assets/locations/placeholder.png',
    group: 'World',
    actions: [
      {
        id: 'fight_giant_rat',
        name: 'Fight Giant Rat',
        type: 'combat',
        skill: 'attack',
        levelRequired: 5,
        experience: 15,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'giant_rat', name: 'Giant rat', level: 5, hitpoints: 8, maxHitpoints: 8, combatStyle: 'melee', stats: { attackStab: 2, attackSlash: 2, attackCrush: 2, attackMagic: 0, attackRanged: 0, defenceStab: 2, defenceSlash: 2, defenceCrush: 2, defenceMagic: 1, defenceRanged: 1, strengthMelee: 2, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [
  { itemId: 'bones', quantity: 1, chance: 100.0 },
  { itemId: 'raw_meat', quantity: 1, chance: 100.0 },
  { itemId: 'coins', quantity: 3, chance: 50.0 }
], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      },
      {
        id: 'fight_slug',
        name: 'Fight Slug',
        type: 'combat',
        skill: 'attack',
        levelRequired: 9,
        experience: 22,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'slug', name: 'Slug', level: 9, hitpoints: 10, maxHitpoints: 10, combatStyle: 'melee', stats: { attackStab: 3, attackSlash: 3, attackCrush: 3, attackMagic: 0, attackRanged: 0, defenceStab: 3, defenceSlash: 3, defenceCrush: 3, defenceMagic: 2, defenceRanged: 2, strengthMelee: 3, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [
  { itemId: 'coins', quantity: 3, chance: 50.0 },
  { itemId: 'copper_ore', quantity: 1, chance: 20.0 },
  { itemId: 'tin_ore', quantity: 1, chance: 20.0 },
  { itemId: 'iron_dagger', quantity: 1, chance: 10.0 }
], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      },
      {
        id: 'fight_cave_slime',
        name: 'Fight Cave Slime',
        type: 'combat',
        skill: 'attack',
        levelRequired: 13,
        experience: 30,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'cave_slime', name: 'Cave slime', level: 13, hitpoints: 16, maxHitpoints: 16, combatStyle: 'melee', stats: { attackStab: 4, attackSlash: 4, attackCrush: 4, attackMagic: 0, attackRanged: 0, defenceStab: 4, defenceSlash: 4, defenceCrush: 4, defenceMagic: 2, defenceRanged: 2, strengthMelee: 4, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [
  { itemId: 'coins', quantity: 10, chance: 40.0 },
  { itemId: 'iron_sword', quantity: 1, chance: 20.0 },
  { itemId: 'water_rune', quantity: 5, chance: 20.0 },
  { itemId: 'earth_rune', quantity: 4, chance: 20.0 }
], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      },
      {
        id: 'fight_big_frog',
        name: 'Fight Big Frog',
        type: 'combat',
        skill: 'attack',
        levelRequired: 23,
        experience: 45,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'big_frog', name: 'Big frog', level: 23, hitpoints: 30, maxHitpoints: 30, combatStyle: 'melee', stats: { attackStab: 6, attackSlash: 6, attackCrush: 6, attackMagic: 0, attackRanged: 0, defenceStab: 6, defenceSlash: 6, defenceCrush: 6, defenceMagic: 3, defenceRanged: 3, strengthMelee: 6, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [
  { itemId: 'bones', quantity: 1, chance: 100.0 },
  { itemId: 'coins', quantity: 5, chance: 25.0 },
  { itemId: 'water_rune', quantity: 10, chance: 10.0 },
  { itemId: 'earth_rune', quantity: 10, chance: 10.0 },
  { itemId: 'nature_rune', quantity: 2, chance: 2.5 },
  { itemId: 'cosmic_rune', quantity: 2, chance: 2.5 }
], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      }
    ]
  },
  {
    id: 'ardougne_marketplace',
    name: 'Ardougne Marketplace',
    description: 'A bustling market with vigilant guards and noble defenders.',
    type: 'combat',
    levelRequired: 28,
    resources: [],
    category: 'combat',
    icon: '/assets/locations/placeholder.png',
    group: 'World',
    actions: [
      {
        id: 'fight_guard',
        name: 'Fight Guard',
        type: 'combat',
        skill: 'attack',
        levelRequired: 28,
        experience: 50,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'guard', name: 'Guard', level: 28, hitpoints: 35, maxHitpoints: 35, combatStyle: 'melee', stats: { attackStab: 8, attackSlash: 8, attackCrush: 8, attackMagic: 0, attackRanged: 0, defenceStab: 8, defenceSlash: 8, defenceCrush: 8, defenceMagic: 4, defenceRanged: 4, strengthMelee: 8, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      },
      {
        id: 'fight_knight',
        name: 'Fight Knight',
        type: 'combat',
        skill: 'attack',
        levelRequired: 38,
        experience: 70,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'knight', name: 'Knight', level: 38, hitpoints: 50, maxHitpoints: 50, combatStyle: 'melee', stats: { attackStab: 12, attackSlash: 12, attackCrush: 12, attackMagic: 0, attackRanged: 0, defenceStab: 12, defenceSlash: 12, defenceCrush: 12, defenceMagic: 6, defenceRanged: 6, strengthMelee: 12, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      },
      {
        id: 'fight_paladin',
        name: 'Fight Paladin',
        type: 'combat',
        skill: 'attack',
        levelRequired: 85,
        experience: 150,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'paladin', name: 'Paladin', level: 85, hitpoints: 120, maxHitpoints: 120, combatStyle: 'melee', stats: { attackStab: 25, attackSlash: 25, attackCrush: 25, attackMagic: 0, attackRanged: 0, defenceStab: 25, defenceSlash: 25, defenceCrush: 25, defenceMagic: 12, defenceRanged: 12, strengthMelee: 25, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      }
    ]
  },
  {
    id: 'ice_dungeon',
    name: 'Ice dungeon',
    description: 'A freezing cavern filled with powerful monsters.',
    type: 'combat',
    levelRequired: 43,
    resources: [],
    category: 'combat',
    icon: '/assets/locations/placeholder.png',
    group: 'Dungeons',
    actions: [
      {
        id: 'fight_ice_warrior',
        name: 'Fight Ice warrior',
        type: 'combat',
        skill: 'attack',
        levelRequired: 43,
        experience: 80,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'ice_warrior', name: 'Ice warrior', level: 43, hitpoints: 60, maxHitpoints: 60, combatStyle: 'melee', stats: { attackStab: 15, attackSlash: 15, attackCrush: 15, attackMagic: 0, attackRanged: 0, defenceStab: 15, defenceSlash: 15, defenceCrush: 15, defenceMagic: 8, defenceRanged: 8, strengthMelee: 15, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      },
      {
        id: 'fight_ice_giant',
        name: 'Fight Ice giant',
        type: 'combat',
        skill: 'attack',
        levelRequired: 63,
        experience: 120,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'ice_giant', name: 'Ice giant', level: 63, hitpoints: 90, maxHitpoints: 90, combatStyle: 'melee', stats: { attackStab: 20, attackSlash: 20, attackCrush: 20, attackMagic: 0, attackRanged: 0, defenceStab: 20, defenceSlash: 20, defenceCrush: 20, defenceMagic: 10, defenceRanged: 10, strengthMelee: 20, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      },
      {
        id: 'fight_frost_dragon',
        name: 'Fight Frost dragon',
        type: 'combat',
        skill: 'attack',
        levelRequired: 132,
        experience: 300,
        baseTime: 3000,
        itemReward: { id: 'none', name: 'None', quantity: 0 },
        monster: { id: 'frost_dragon', name: 'Frost dragon', level: 132, hitpoints: 250, maxHitpoints: 250, combatStyle: 'melee', stats: { attackStab: 40, attackSlash: 40, attackCrush: 40, attackMagic: 0, attackRanged: 0, defenceStab: 40, defenceSlash: 40, defenceCrush: 40, defenceMagic: 20, defenceRanged: 20, strengthMelee: 40, strengthRanged: 0, strengthMagic: 0, prayerBonus: 0 }, drops: [], thumbnail: '/assets/monsters/placeholder.png' },
        requirements: []
      }
    ]
  },
  {
    id: 'goblin_village',
    name: 'Goblin Village',
    description: 'A future raid location. Will be implemented at a later date.',
    type: 'combat',
    levelRequired: 1,
    resources: [],
    category: 'combat',
    icon: '/assets/locations/placeholder.png',
    group: 'Raids',
    actions: []
  },
  {
    id: 'workbench',
    name: 'Workbench',
    description: 'A sturdy workbench for crafting and fletching various items.',
    type: 'resource',
    levelRequired: 1,
    resources: [],
    category: 'crafting',
    icon: '/assets/locations/workbench.png',
    actions: [
      // --- Arrows ---
      {
        id: 'fletch_arrow_shafts',
        name: 'Fletch Arrow Shafts',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 1,
        experience: 5,
        baseTime: 2000,
        itemReward: { id: 'arrow_shafts', name: 'Arrow Shafts', quantity: 15 },
        requirements: [
          { type: 'item', itemId: 'logs', quantity: 1 }
        ]
      },
      {
        id: 'fletch_headless_arrows',
        name: 'Fletch Headless Arrows',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 1,
        experience: 5,
        baseTime: 2000,
        itemReward: { id: 'headless_arrows', name: 'Headless Arrows', quantity: 15 },
        requirements: [
          { type: 'item', itemId: 'arrow_shafts', quantity: 15 },
          { type: 'item', itemId: 'feathers', quantity: 15 }
        ]
      },
      {
        id: 'fletch_bronze_arrows',
        name: 'Fletch Bronze Arrows',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 1,
        experience: 10,
        baseTime: 2000,
        itemReward: { id: 'bronze_arrows', name: 'Bronze Arrows', quantity: 15 },
        requirements: [
          { type: 'item', itemId: 'headless_arrows', quantity: 15 },
          { type: 'item', itemId: 'bronze_arrowtips', quantity: 15 }
        ]
      },
      {
        id: 'fletch_iron_arrows',
        name: 'Fletch Iron Arrows',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 15,
        experience: 15,
        baseTime: 2000,
        itemReward: { id: 'iron_arrows', name: 'Iron Arrows', quantity: 15 },
        requirements: [
          { type: 'item', itemId: 'headless_arrows', quantity: 15 },
          { type: 'item', itemId: 'iron_arrowtips', quantity: 15 }
        ]
      },
      {
        id: 'fletch_steel_arrows',
        name: 'Fletch Steel Arrows',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 30,
        experience: 20,
        baseTime: 2000,
        itemReward: { id: 'steel_arrows', name: 'Steel Arrows', quantity: 15 },
        requirements: [
          { type: 'item', itemId: 'headless_arrows', quantity: 15 },
          { type: 'item', itemId: 'steel_arrowtips', quantity: 15 }
        ]
      },
      {
        id: 'fletch_mithril_arrows',
        name: 'Fletch Mithril Arrows',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 45,
        experience: 25,
        baseTime: 2000,
        itemReward: { id: 'mithril_arrows', name: 'Mithril Arrows', quantity: 15 },
        requirements: [
          { type: 'item', itemId: 'headless_arrows', quantity: 15 },
          { type: 'item', itemId: 'mithril_arrowtips', quantity: 15 }
        ]
      },
      {
        id: 'fletch_adamant_arrows',
        name: 'Fletch Adamant Arrows',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 60,
        experience: 30,
        baseTime: 2000,
        itemReward: { id: 'adamant_arrows', name: 'Adamant Arrows', quantity: 15 },
        requirements: [
          { type: 'item', itemId: 'headless_arrows', quantity: 15 },
          { type: 'item', itemId: 'adamant_arrowtips', quantity: 15 }
        ]
      },
      {
        id: 'fletch_rune_arrows',
        name: 'Fletch Rune Arrows',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 75,
        experience: 40,
        baseTime: 2000,
        itemReward: { id: 'rune_arrows', name: 'Rune Arrows', quantity: 15 },
        requirements: [
          { type: 'item', itemId: 'headless_arrows', quantity: 15 },
          { type: 'item', itemId: 'rune_arrowtips', quantity: 15 }
        ]
      },
      // --- Bows ---
      // Oak
      {
        id: 'fletch_oak_shortbow_u',
        name: 'Fletch Oak Shortbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 5,
        experience: 10,
        baseTime: 3000,
        itemReward: { id: 'unstrung_oak_shortbow', name: 'Unstrung Oak Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'oak_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_oak_shortbow',
        name: 'String Oak Shortbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 5,
        experience: 10,
        baseTime: 3000,
        itemReward: { id: 'oak_shortbow', name: 'Oak Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_oak_shortbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      {
        id: 'fletch_oak_longbow_u',
        name: 'Fletch Oak Longbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 5,
        experience: 15,
        baseTime: 3500,
        itemReward: { id: 'unstrung_oak_longbow', name: 'Unstrung Oak Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'oak_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_oak_longbow',
        name: 'String Oak Longbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 5,
        experience: 15,
        baseTime: 3500,
        itemReward: { id: 'oak_longbow', name: 'Oak Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_oak_longbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      // Willow
      {
        id: 'fletch_willow_shortbow_u',
        name: 'Fletch Willow Shortbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 10,
        experience: 15,
        baseTime: 3000,
        itemReward: { id: 'unstrung_willow_shortbow', name: 'Unstrung Willow Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'willow_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_willow_shortbow',
        name: 'String Willow Shortbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 10,
        experience: 15,
        baseTime: 3000,
        itemReward: { id: 'willow_shortbow', name: 'Willow Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_willow_shortbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      {
        id: 'fletch_willow_longbow_u',
        name: 'Fletch Willow Longbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 10,
        experience: 20,
        baseTime: 3500,
        itemReward: { id: 'unstrung_willow_longbow', name: 'Unstrung Willow Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'willow_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_willow_longbow',
        name: 'String Willow Longbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 10,
        experience: 20,
        baseTime: 3500,
        itemReward: { id: 'willow_longbow', name: 'Willow Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_willow_longbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      // Maple
      {
        id: 'fletch_maple_shortbow_u',
        name: 'Fletch Maple Shortbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 20,
        experience: 20,
        baseTime: 3000,
        itemReward: { id: 'unstrung_maple_shortbow', name: 'Unstrung Maple Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'maple_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_maple_shortbow',
        name: 'String Maple Shortbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 20,
        experience: 20,
        baseTime: 3000,
        itemReward: { id: 'maple_shortbow', name: 'Maple Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_maple_shortbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      {
        id: 'fletch_maple_longbow_u',
        name: 'Fletch Maple Longbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 20,
        experience: 25,
        baseTime: 3500,
        itemReward: { id: 'unstrung_maple_longbow', name: 'Unstrung Maple Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'maple_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_maple_longbow',
        name: 'String Maple Longbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 20,
        experience: 25,
        baseTime: 3500,
        itemReward: { id: 'maple_longbow', name: 'Maple Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_maple_longbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      // Yew
      {
        id: 'fletch_yew_shortbow_u',
        name: 'Fletch Yew Shortbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 40,
        experience: 40,
        baseTime: 3000,
        itemReward: { id: 'unstrung_yew_shortbow', name: 'Unstrung Yew Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'yew_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_yew_shortbow',
        name: 'String Yew Shortbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 40,
        experience: 40,
        baseTime: 3000,
        itemReward: { id: 'yew_shortbow', name: 'Yew Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_yew_shortbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      {
        id: 'fletch_yew_longbow_u',
        name: 'Fletch Yew Longbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 40,
        experience: 45,
        baseTime: 3500,
        itemReward: { id: 'unstrung_yew_longbow', name: 'Unstrung Yew Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'yew_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_yew_longbow',
        name: 'String Yew Longbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 40,
        experience: 45,
        baseTime: 3500,
        itemReward: { id: 'yew_longbow', name: 'Yew Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_yew_longbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      // Magic
      {
        id: 'fletch_magic_shortbow_u',
        name: 'Fletch Magic Shortbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 50,
        experience: 60,
        baseTime: 3000,
        itemReward: { id: 'unstrung_magic_shortbow', name: 'Unstrung Magic Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'magic_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_magic_shortbow',
        name: 'String Magic Shortbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 50,
        experience: 60,
        baseTime: 3000,
        itemReward: { id: 'magic_shortbow', name: 'Magic Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_magic_shortbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      {
        id: 'fletch_magic_longbow_u',
        name: 'Fletch Magic Longbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 50,
        experience: 75,
        baseTime: 3500,
        itemReward: { id: 'unstrung_magic_longbow', name: 'Unstrung Magic Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'magic_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_magic_longbow',
        name: 'String Magic Longbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 50,
        experience: 75,
        baseTime: 3500,
        itemReward: { id: 'magic_longbow', name: 'Magic Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_magic_longbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      // Redwood
      {
        id: 'fletch_redwood_shortbow_u',
        name: 'Fletch Redwood Shortbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 60,
        experience: 80,
        baseTime: 3000,
        itemReward: { id: 'unstrung_redwood_shortbow', name: 'Unstrung Redwood Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'redwood_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_redwood_shortbow',
        name: 'String Redwood Shortbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 60,
        experience: 80,
        baseTime: 3000,
        itemReward: { id: 'redwood_shortbow', name: 'Redwood Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_redwood_shortbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      {
        id: 'fletch_redwood_longbow_u',
        name: 'Fletch Redwood Longbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 60,
        experience: 90,
        baseTime: 3500,
        itemReward: { id: 'unstrung_redwood_longbow', name: 'Unstrung Redwood Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'redwood_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_redwood_longbow',
        name: 'String Redwood Longbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 60,
        experience: 90,
        baseTime: 3500,
        itemReward: { id: 'redwood_longbow', name: 'Redwood Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_redwood_longbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      // Teak
      {
        id: 'fletch_teak_shortbow_u',
        name: 'Fletch Teak Shortbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 35,
        experience: 30,
        baseTime: 3000,
        itemReward: { id: 'unstrung_teak_shortbow', name: 'Unstrung Teak Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'teak_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_teak_shortbow',
        name: 'String Teak Shortbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 35,
        experience: 30,
        baseTime: 3000,
        itemReward: { id: 'teak_shortbow', name: 'Teak Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_teak_shortbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      {
        id: 'fletch_teak_longbow_u',
        name: 'Fletch Teak Longbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 35,
        experience: 35,
        baseTime: 3500,
        itemReward: { id: 'unstrung_teak_longbow', name: 'Unstrung Teak Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'teak_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_teak_longbow',
        name: 'String Teak Longbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 35,
        experience: 35,
        baseTime: 3500,
        itemReward: { id: 'teak_longbow', name: 'Teak Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_teak_longbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      // Mahogany
      {
        id: 'fletch_mahogany_shortbow_u',
        name: 'Fletch Mahogany Shortbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 45,
        experience: 50,
        baseTime: 3000,
        itemReward: { id: 'unstrung_mahogany_shortbow', name: 'Unstrung Mahogany Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'mahogany_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_mahogany_shortbow',
        name: 'String Mahogany Shortbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 45,
        experience: 50,
        baseTime: 3000,
        itemReward: { id: 'mahogany_shortbow', name: 'Mahogany Shortbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_mahogany_shortbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      {
        id: 'fletch_mahogany_longbow_u',
        name: 'Fletch Mahogany Longbow (u)',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 45,
        experience: 55,
        baseTime: 3500,
        itemReward: { id: 'unstrung_mahogany_longbow', name: 'Unstrung Mahogany Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'mahogany_logs', quantity: 1 }
        ]
      },
      {
        id: 'string_mahogany_longbow',
        name: 'String Mahogany Longbow',
        type: 'fletching',
        skill: 'fletching',
        levelRequired: 45,
        experience: 55,
        baseTime: 3500,
        itemReward: { id: 'mahogany_longbow', name: 'Mahogany Longbow', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'unstrung_mahogany_longbow', quantity: 1 },
          { type: 'item', itemId: 'bow_string', quantity: 1 }
        ]
      },
      // --- Placeholders for Staves, Armor, Jewelry, Tan ---
      // TODO: Add actions for Staves
      // TODO: Add actions for Armor
      // TODO: Add actions for Jewelry
      // TODO: Add actions for Tan
    ]
  },
  {
    id: 'temple',
    name: 'Temple',
    description: 'A sacred temple where you can train your spiritual and magical skills.',
    type: 'resource',
    levelRequired: 1,
    resources: [],
    category: 'temple',
    icon: '/assets/BG/temple.webp',
    availableSkills: ['prayer', 'runecrafting'],
    actions: [
      // Prayer actions
      {
        id: 'offer_normal_bones',
        name: 'Offer Normal Bones',
        type: 'prayer',
        skill: 'prayer',
        levelRequired: 1,
        experience: 15,
        baseTime: 3000,
        itemReward: { id: 'prayer_xp', name: 'Prayer XP', quantity: 15 },
        requirements: [ { type: 'item', itemId: 'bones', quantity: 1 } ]
      },
      {
        id: 'offer_big_bones',
        name: 'Offer Big Bones',
        type: 'prayer',
        skill: 'prayer',
        levelRequired: 1,
        experience: 52,
        baseTime: 3000,
        itemReward: { id: 'prayer_xp', name: 'Prayer XP', quantity: 52 },
        requirements: [ { type: 'item', itemId: 'big_bones', quantity: 1 } ]
      },
      {
        id: 'offer_babydragon_bones',
        name: 'Offer Babydragon Bones',
        type: 'prayer',
        skill: 'prayer',
        levelRequired: 1,
        experience: 105,
        baseTime: 3000,
        itemReward: { id: 'prayer_xp', name: 'Prayer XP', quantity: 105 },
        requirements: [ { type: 'item', itemId: 'babydragon_bones', quantity: 1 } ]
      },
      {
        id: 'offer_wyrm_bones',
        name: 'Offer Wyrm Bones',
        type: 'prayer',
        skill: 'prayer',
        levelRequired: 1,
        experience: 150,
        baseTime: 3000,
        itemReward: { id: 'prayer_xp', name: 'Prayer XP', quantity: 150 },
        requirements: [ { type: 'item', itemId: 'wyrm_bones', quantity: 1 } ]
      },
      {
        id: 'offer_wyvern_bones',
        name: 'Offer Wyvern Bones',
        type: 'prayer',
        skill: 'prayer',
        levelRequired: 1,
        experience: 252,
        baseTime: 3000,
        itemReward: { id: 'prayer_xp', name: 'Prayer XP', quantity: 252 },
        requirements: [ { type: 'item', itemId: 'wyvern_bones', quantity: 1 } ]
      },
      {
        id: 'offer_dragon_bones',
        name: 'Offer Dragon Bones',
        type: 'prayer',
        skill: 'prayer',
        levelRequired: 1,
        experience: 252,
        baseTime: 3000,
        itemReward: { id: 'prayer_xp', name: 'Prayer XP', quantity: 252 },
        requirements: [ { type: 'item', itemId: 'dragon_bones', quantity: 1 } ]
      },
      {
        id: 'offer_superior_dragon_bones',
        name: 'Offer Superior Dragon Bones',
        type: 'prayer',
        skill: 'prayer',
        levelRequired: 70,
        experience: 400,
        baseTime: 3000,
        itemReward: { id: 'prayer_xp', name: 'Prayer XP', quantity: 400 },
        requirements: [ { type: 'item', itemId: 'superior_dragon_bones', quantity: 1 } ]
      },
      // Runecrafting actions
      {
        id: 'craft_air_rune',
        name: 'Craft Air Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 1,
        experience: 5,
        baseTime: 4000,
        itemReward: { id: 'air_rune', name: 'Air Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_mind_rune',
        name: 'Craft Mind Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 2,
        experience: 5.5,
        baseTime: 4000,
        itemReward: { id: 'mind_rune', name: 'Mind Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_water_rune',
        name: 'Craft Water Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 5,
        experience: 6,
        baseTime: 4000,
        itemReward: { id: 'water_rune', name: 'Water Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_earth_rune',
        name: 'Craft Earth Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 9,
        experience: 6.5,
        baseTime: 4000,
        itemReward: { id: 'earth_rune', name: 'Earth Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_fire_rune',
        name: 'Craft Fire Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 14,
        experience: 7,
        baseTime: 4000,
        itemReward: { id: 'fire_rune', name: 'Fire Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_body_rune',
        name: 'Craft Body Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 20,
        experience: 7.5,
        baseTime: 4000,
        itemReward: { id: 'body_rune', name: 'Body Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_cosmic_rune',
        name: 'Craft Cosmic Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 27,
        experience: 8,
        baseTime: 4000,
        itemReward: { id: 'cosmic_rune', name: 'Cosmic Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_chaos_rune',
        name: 'Craft Chaos Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 35,
        experience: 8.5,
        baseTime: 4000,
        itemReward: { id: 'chaos_rune', name: 'Chaos Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_astral_rune',
        name: 'Craft Astral Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 40,
        experience: 8.7,
        baseTime: 4000,
        itemReward: { id: 'astral_rune', name: 'Astral Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_nature_rune',
        name: 'Craft Nature Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 44,
        experience: 9,
        baseTime: 4000,
        itemReward: { id: 'nature_rune', name: 'Nature Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_law_rune',
        name: 'Craft Law Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 54,
        experience: 9.5,
        baseTime: 4000,
        itemReward: { id: 'law_rune', name: 'Law Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_death_rune',
        name: 'Craft Death Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 65,
        experience: 10,
        baseTime: 4000,
        itemReward: { id: 'death_rune', name: 'Death Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_blood_rune',
        name: 'Craft Blood Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 77,
        experience: 23.8,
        baseTime: 4000,
        itemReward: { id: 'blood_rune', name: 'Blood Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      },
      {
        id: 'craft_soul_rune',
        name: 'Craft Soul Rune',
        type: 'runecrafting',
        skill: 'runecrafting',
        levelRequired: 90,
        experience: 29.7,
        baseTime: 4000,
        itemReward: { id: 'soul_rune', name: 'Soul Rune', quantity: 1 },
        requirements: [ { type: 'item', itemId: 'rune_essence', quantity: 1 } ]
      }
    ]
  },
  {
    id: 'rooftop_thieving',
    name: 'Outer city',
    description: 'The outer city is filled with rooftops for agility training and crowds for thieving.',
    type: 'resource',
    levelRequired: 1,
    resources: [],
    category: 'agility',
    icon: '/assets/locations/rooftop_thieving.png',
    // @ts-ignore - Type assertion for deployment fix
    actions: [
      // Agility actions
      {
        id: 'draynor_rooftop',
        name: 'Draynor Rooftop',
        type: 'agility',
        skill: 'agility',
        levelRequired: 1,
        experience: 10,
        baseTime: 3000,
        itemReward: { id: 'coins', name: 'Coins', quantity: 5 },
        requirements: [],
        possibleLoot: []
      },
      {
        id: 'al_kharid_rooftop',
        name: 'Al Kharid Rooftop',
        type: 'agility',
        skill: 'agility',
        levelRequired: 10,
        experience: 20,
        baseTime: 3500,
        itemReward: { id: 'coins', name: 'Coins', quantity: 10 },
        requirements: [],
        possibleLoot: []
      },
      {
        id: 'shayzien_agility',
        name: 'Shayzien Agility',
        type: 'agility',
        skill: 'agility',
        levelRequired: 20,
        experience: 30,
        baseTime: 4000,
        itemReward: { id: 'coins', name: 'Coins', quantity: 15 },
        requirements: [],
        possibleLoot: []
      },
      {
        id: 'varrock_rooftop',
        name: 'Varrock Rooftop',
        type: 'agility',
        skill: 'agility',
        levelRequired: 30,
        experience: 40,
        baseTime: 4500,
        itemReward: { id: 'coins', name: 'Coins', quantity: 20 },
        requirements: [],
        possibleLoot: []
      },
      {
        id: 'canifis_rooftop',
        name: 'Canifis Rooftop',
        type: 'agility',
        skill: 'agility',
        levelRequired: 40,
        experience: 50,
        baseTime: 5000,
        itemReward: { id: 'coins', name: 'Coins', quantity: 25 },
        requirements: [],
        possibleLoot: []
      },
      {
        id: 'falador_rooftop',
        name: 'Falador Rooftop',
        type: 'agility',
        skill: 'agility',
        levelRequired: 50,
        experience: 60,
        baseTime: 5500,
        itemReward: { id: 'coins', name: 'Coins', quantity: 30 },
        requirements: [],
        possibleLoot: []
      },
      {
        id: 'seers_rooftop',
        name: 'Seers Rooftop',
        type: 'agility',
        skill: 'agility',
        levelRequired: 60,
        experience: 70,
        baseTime: 6000,
        itemReward: { id: 'coins', name: 'Coins', quantity: 35 },
        requirements: [],
        possibleLoot: []
      },
      {
        id: 'pollniveach_rooftop',
        name: 'Pollniveach Rooftop',
        type: 'agility',
        skill: 'agility',
        levelRequired: 70,
        experience: 80,
        baseTime: 6500,
        itemReward: { id: 'coins', name: 'Coins', quantity: 40 },
        requirements: [],
        possibleLoot: []
      },
      {
        id: 'rellekka_rooftop',
        name: 'Rellekka Rooftop',
        type: 'agility',
        skill: 'agility',
        levelRequired: 80,
        experience: 90,
        baseTime: 7000,
        itemReward: { id: 'coins', name: 'Coins', quantity: 45 },
        requirements: [],
        possibleLoot: []
      },
      {
        id: 'ardougne_rooftop',
        name: 'Ardougne Rooftop',
        type: 'agility',
        skill: 'agility',
        levelRequired: 90,
        experience: 100,
        baseTime: 7500,
        itemReward: { id: 'coins', name: 'Coins', quantity: 50 },
        requirements: [],
        possibleLoot: []
      },
      // Thieving actions
      {
        id: 'pickpocket_man',
        name: 'Pickpocket Man',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 1,
        experience: 8,
        baseTime: 3000,
        itemReward: { id: 'coins', name: 'Coins', quantity: 3 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }]
      },
      {
        id: 'pickpocket_farmer',
        name: 'Pickpocket Farmer',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 10,
        experience: 14,
        baseTime: 3200,
        itemReward: { id: 'coins', name: 'Coins', quantity: 5 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }]
      },
      {
        id: 'pickpocket_warrior',
        name: 'Pickpocket Warrior',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 15,
        experience: 18,
        baseTime: 3400,
        itemReward: { id: 'coins', name: 'Coins', quantity: 18 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }]
      },
      {
        id: 'pickpocket_rogue',
        name: 'Pickpocket Rogue',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 25,
        experience: 24,
        baseTime: 3600,
        itemReward: { id: 'coins', name: 'Coins', quantity: 30 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }]
      },
      {
        id: 'pickpocket_villager',
        name: 'Pickpocket Villager',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 30,
        experience: 28,
        baseTime: 3800,
        itemReward: { id: 'coins', name: 'Coins', quantity: 32 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }]
      },
      {
        id: 'pickpocket_master_farmer',
        name: 'Pickpocket Master Farmer',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 38,
        experience: 43,
        baseTime: 4000,
        itemReward: { id: 'potato_seed', name: 'Potato Seed', quantity: 2 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }, { id: 'cabbage_seed', chance: 5 }, { id: 'tomato_seed', chance: 5 }, { id: 'strawberry_seed', chance: 5 }]
      },
      {
        id: 'pickpocket_guard',
        name: 'Pickpocket Guard',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 45,
        experience: 46,
        baseTime: 4200,
        itemReward: { id: 'coins', name: 'Coins', quantity: 35 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }, { id: 'bow_string', chance: 10 }, { id: 'feathers', chance: 10 }, { id: 'iron_arrows', chance: 10 }]
      },
      {
        id: 'pickpocket_wealthy_citizen',
        name: 'Pickpocket Wealthy Citizen',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 50,
        experience: 54,
        baseTime: 4400,
        itemReward: { id: 'coins', name: 'Coins', quantity: 45 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }]
      },
      {
        id: 'pickpocket_knight',
        name: 'Pickpocket Knight',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 55,
        experience: 60,
        baseTime: 4600,
        itemReward: { id: 'coins', name: 'Coins', quantity: 50 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }, { id: 'iron_kiteshield', chance: 10 }, { id: 'bronze_boots', chance: 10 }, { id: 'bronze_medium_helm', chance: 10 }]
      },
      {
        id: 'pickpocket_watchman',
        name: 'Pickpocket Watchman',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 65,
        experience: 66,
        baseTime: 4800,
        itemReward: { id: 'coins', name: 'Coins', quantity: 60 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }, { id: 'iron_platebody', chance: 10 }, { id: 'steel_sword', chance: 10 }]
      },
      {
        id: 'pickpocket_paladin',
        name: 'Pickpocket Paladin',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 70,
        experience: 74,
        baseTime: 5000,
        itemReward: { id: 'coins', name: 'Coins', quantity: 65 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }, { id: 'chaos_rune', chance: 10 }, { id: 'steel_platebody', chance: 10 }, { id: 'steel_platelegs', chance: 10 }, { id: 'mithril_scimitar', chance: 10 }]
      },
      {
        id: 'pickpocket_gnome',
        name: 'Pickpocket Gnome',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 75,
        experience: 80,
        baseTime: 5200,
        itemReward: { id: 'coins', name: 'Coins', quantity: 85 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }, { id: 'arrow_shafts', chance: 10 }, { id: 'gold_ore', chance: 10 }, { id: 'earth_rune', chance: 10 }, { id: 'raw_lobster', chance: 10 }]
      },
      {
        id: 'pickpocket_hero',
        name: 'Pickpocket Hero',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 80,
        experience: 87,
        baseTime: 5400,
        itemReward: { id: 'coins', name: 'Coins', quantity: 90 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }, { id: 'mithril_full_helm', chance: 10 }, { id: 'mithril_kiteshield', chance: 10 }, { id: 'nature_rune', chance: 10 }]
      },
      {
        id: 'pickpocket_vampire',
        name: 'Pickpocket Vampire',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 85,
        experience: 94,
        baseTime: 5600,
        itemReward: { id: 'coins', name: 'Coins', quantity: 115 },
        requirements: [],
        possibleLoot: [{ id: 'coins', chance: 80 }, { id: 'potato_seed', chance: 15 }, { id: 'onion_seed', chance: 5 }, { id: 'blood_rune', chance: 10 }, { id: 'death_rune', chance: 10 }, { id: 'chaos_rune', chance: 10 }, { id: 'fire_rune', chance: 10 }, { id: 'raw_meat', chance: 10 }, { id: 'uncut_ruby', chance: 10 }]
      },
      {
        id: 'pickpocket_elf',
        name: 'Pickpocket Elf',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 90,
        experience: 99,
        baseTime: 5800,
        itemReward: { id: 'coins', name: 'Coins', quantity: 140 },
        requirements: [],
        possibleLoot: ['nature_rune', 'death_rune', 'uncut_diamond']
      },
      {
        id: 'pickpocket_tzhaar',
        name: 'Pickpocket Tzhaar',
        type: 'thieving',
        skill: 'thieving',
        levelRequired: 95,
        experience: 110,
        baseTime: 6000,
        itemReward: { id: 'coins', name: 'Coins', quantity: 160 },
        requirements: [],
        possibleLoot: ['uncut_sapphire', 'uncut_emerald', 'uncut_ruby', 'uncut_diamond']
      }
    ].map(action => ({
      ...action,
      requirements:
        action.levelRequired === 1 && action.skill === 'agility'
          ? []
          : (action.requirements && action.requirements.length > 0
              ? action.requirements
              : [{ type: 'level', skill: action.skill, level: action.levelRequired }])
    })),
    availableSkills: ['agility', 'thieving']
  },
  {
    id: 'fields',
    name: 'Fields',
    description: 'A peaceful farming area where you can plant and harvest crops.',
    thumbnail: '/assets/BG/fields.webp',
    // @ts-ignore - Type assertion for deployment fix
    actions: [
      // Allotment farming actions
      {
        id: 'plant_potato',
        name: 'Plant Potato',
        type: 'farming' as ActionType,
        skill: 'farming' as SkillName,
        levelRequired: 1,
        experience: 8,
        baseTime: 1,
        itemReward: { id: 'potato', name: 'Potato', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'potato_seed', quantity: 3, description: 'Potato seeds to plant' }
        ],
        harvestTime: 40, // 40 minutes to harvest
        category: 'allotment'
      },
      {
        id: 'plant_onion',
        name: 'Plant Onion', 
        type: 'farming',
        skill: 'farming',
        levelRequired: 5,
        experience: 10,
        baseTime: 1,
        itemReward: { id: 'onion', name: 'Onion', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'onion_seed', quantity: 3, description: 'Onion seeds to plant' }
        ],
        harvestTime: 40,
        category: 'allotment'
      },
      {
        id: 'plant_cabbage',
        name: 'Plant Cabbage',
        type: 'farming',
        skill: 'farming', 
        levelRequired: 7,
        experience: 12,
        baseTime: 1,
        itemReward: { id: 'cabbage', name: 'Cabbage', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'cabbage_seed', quantity: 3, description: 'Cabbage seeds to plant' }
        ],
        harvestTime: 40,
        category: 'allotment'
      },
      {
        id: 'plant_tomato',
        name: 'Plant Tomato',
        type: 'farming',
        skill: 'farming',
        levelRequired: 12,
        experience: 15,
        baseTime: 1,
        itemReward: { id: 'tomato', name: 'Tomato', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'tomato_seed', quantity: 1, description: 'Tomato seed to plant' }
        ],
        harvestTime: 40,
        category: 'allotment'
      },
      {
        id: 'plant_sweetcorn',
        name: 'Plant Sweetcorn',
        type: 'farming',
        skill: 'farming',
        levelRequired: 20,
        experience: 20,
        baseTime: 1,
        itemReward: { id: 'sweetcorn', name: 'Sweetcorn', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'sweetcorn_seed', quantity: 1, description: 'Sweetcorn seed to plant' }
        ],
        harvestTime: 60,
        category: 'allotment'
      },
      {
        id: 'plant_strawberry',
        name: 'Plant Strawberry',
        type: 'farming',
        skill: 'farming',
        levelRequired: 31,
        experience: 26,
        baseTime: 1,
        itemReward: { id: 'strawberry', name: 'Strawberry', quantity: 4 },
        requirements: [
          { type: 'item', itemId: 'strawberry_seed', quantity: 1, description: 'Strawberry seed to plant' }
        ],
        harvestTime: 60,
        category: 'allotment'
      },
      {
        id: 'plant_watermelon',
        name: 'Plant Watermelon',
        type: 'farming',
        skill: 'farming',
        levelRequired: 47,
        experience: 50,
        baseTime: 1,
        itemReward: { id: 'watermelon', name: 'Watermelon', quantity: 1 },
        requirements: [
          { type: 'item', itemId: 'watermelon_seed', quantity: 1, description: 'Watermelon seed to plant' }
        ],
        harvestTime: 80,
        category: 'allotment'
      },
      {
        id: 'plant_snape_grass',
        name: 'Plant Snape Grass',
        type: 'farming',
        skill: 'farming',
        levelRequired: 61,
        experience: 82,
        baseTime: 1,
        itemReward: { id: 'snape_grass', name: 'Snape Grass', quantity: 4 },
        requirements: [
          { type: 'item', itemId: 'snape_grass_seed', quantity: 1, description: 'Snape grass seed to plant' }
        ],
        harvestTime: 80,
        category: 'allotment'
      },
      
      // Herb farming actions
      {
        id: 'plant_guam',
        name: 'Plant Guam',
        type: 'farming',
        skill: 'farming',
        levelRequired: 9,
        experience: 11,
        baseTime: 1,
        itemReward: { id: 'guam_leaf', name: 'Guam Leaf', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'guam_seed', quantity: 1, description: 'Guam seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_marrentill',
        name: 'Plant Marrentill',
        type: 'farming',
        skill: 'farming',
        levelRequired: 14,
        experience: 14,
        baseTime: 1,
        itemReward: { id: 'marrentill', name: 'Marrentill', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'marentill_seed', quantity: 1, description: 'Marrentill seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_tarromin',
        name: 'Plant Tarromin',
        type: 'farming',
        skill: 'farming',
        levelRequired: 19,
        experience: 18,
        baseTime: 1,
        itemReward: { id: 'tarromin', name: 'Tarromin', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'tarromin_seed', quantity: 1, description: 'Tarromin seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_harralander',
        name: 'Plant Harralander',
        type: 'farming',
        skill: 'farming',
        levelRequired: 26,
        experience: 22,
        baseTime: 1,
        itemReward: { id: 'harralander', name: 'Harralander', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'harralander_seed', quantity: 1, description: 'Harralander seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_ranarr',
        name: 'Plant Ranarr',
        type: 'farming',
        skill: 'farming',
        levelRequired: 32,
        experience: 27,
        baseTime: 1,
        itemReward: { id: 'ranarr', name: 'Ranarr', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'ranarr_seed', quantity: 1, description: 'Ranarr seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_toadflax',
        name: 'Plant Toadflax',
        type: 'farming',
        skill: 'farming',
        levelRequired: 38,
        experience: 33,
        baseTime: 1,
        itemReward: { id: 'toadflax', name: 'Toadflax', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'toadflax_seed', quantity: 1, description: 'Toadflax seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_irit',
        name: 'Plant Irit',
        type: 'farming',
        skill: 'farming',
        levelRequired: 44,
        experience: 43,
        baseTime: 1,
        itemReward: { id: 'irit', name: 'Irit', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'irit_seed', quantity: 1, description: 'Irit seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_avantoe',
        name: 'Plant Avantoe',
        type: 'farming',
        skill: 'farming',
        levelRequired: 50,
        experience: 55,
        baseTime: 1,
        itemReward: { id: 'avantoe', name: 'Avantoe', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'avantoe_seed', quantity: 1, description: 'Avantoe seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_kwuarm',
        name: 'Plant Kwuarm',
        type: 'farming',
        skill: 'farming',
        levelRequired: 56,
        experience: 70,
        baseTime: 1,
        itemReward: { id: 'kwuarm', name: 'Kwuarm', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'kwuarm_seed', quantity: 1, description: 'Kwuarm seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_snapdragon',
        name: 'Plant Snapdragon',
        type: 'farming',
        skill: 'farming',
        levelRequired: 62,
        experience: 88,
        baseTime: 1,
        itemReward: { id: 'snapdragon', name: 'Snapdragon', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'snapdragon_seed', quantity: 1, description: 'Snapdragon seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_cadantine',
        name: 'Plant Cadantine',
        type: 'farming',
        skill: 'farming',
        levelRequired: 67,
        experience: 107,
        baseTime: 1,
        itemReward: { id: 'cadantine', name: 'Cadantine', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'cadantine_seed', quantity: 1, description: 'Cadantine seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_lantadyme',
        name: 'Plant Lantadyme',
        type: 'farming',
        skill: 'farming',
        levelRequired: 73,
        experience: 135,
        baseTime: 1,
        itemReward: { id: 'lantadyme', name: 'Lantadyme', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'lantadyme_seed', quantity: 1, description: 'Lantadyme seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_dwarf_weed',
        name: 'Plant Dwarf Weed',
        type: 'farming',
        skill: 'farming',
        levelRequired: 79,
        experience: 173,
        baseTime: 1,
        itemReward: { id: 'dwarf_weed', name: 'Dwarf Weed', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'dwarf_weed_seed', quantity: 1, description: 'Dwarf weed seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      {
        id: 'plant_torstol',
        name: 'Plant Torstol',
        type: 'farming',
        skill: 'farming',
        levelRequired: 85,
        experience: 200,
        baseTime: 1,
        itemReward: { id: 'torstol', name: 'Torstol', quantity: 3 },
        requirements: [
          { type: 'item', itemId: 'torstol_seed', quantity: 1, description: 'Torstol seed to plant' }
        ],
        harvestTime: 80,
        category: 'herbs'
      },
      
      // Tree farming actions
      {
        id: 'plant_oak',
        name: 'Plant Oak Tree',
        type: 'farming',
        skill: 'farming',
        levelRequired: 15,
        experience: 14,
        baseTime: 1,
        itemReward: { id: 'oak_logs', name: 'Oak Logs', quantity: 8 },
        requirements: [
          { type: 'item', itemId: 'acorn', quantity: 1, description: 'Acorn to plant' }
        ],
        harvestTime: 200,
        category: 'trees'
      },
      {
        id: 'plant_willow',
        name: 'Plant Willow Tree',
        type: 'farming',
        skill: 'farming',
        levelRequired: 30,
        experience: 25,
        baseTime: 1,
        itemReward: { id: 'willow_logs', name: 'Willow Logs', quantity: 12 },
        requirements: [
          { type: 'item', itemId: 'willow_seed', quantity: 1, description: 'Willow seed to plant' }
        ],
        harvestTime: 240,
        category: 'trees'
      },
      {
        id: 'plant_teak',
        name: 'Plant Teak Tree',
        type: 'farming',
        skill: 'farming',
        levelRequired: 35,
        experience: 35,
        baseTime: 1,
        itemReward: { id: 'teak_logs', name: 'Teak Logs', quantity: 10 },
        requirements: [
          { type: 'item', itemId: 'teak_seed', quantity: 1, description: 'Teak seed to plant' }
        ],
        harvestTime: 280,
        category: 'trees'
      },
      {
        id: 'plant_maple',
        name: 'Plant Maple Tree',
        type: 'farming',
        skill: 'farming',
        levelRequired: 45,
        experience: 45,
        baseTime: 1,
        itemReward: { id: 'maple_logs', name: 'Maple Logs', quantity: 15 },
        requirements: [
          { type: 'item', itemId: 'maple_seed', quantity: 1, description: 'Maple seed to plant' }
        ],
        harvestTime: 320,
        category: 'trees'
      },
      {
        id: 'plant_mahogany',
        name: 'Plant Mahogany Tree',
        type: 'farming',
        skill: 'farming',
        levelRequired: 55,
        experience: 63,
        baseTime: 1,
        itemReward: { id: 'mahogany_logs', name: 'Mahogany Logs', quantity: 12 },
        requirements: [
          { type: 'item', itemId: 'mahogany_seed', quantity: 1, description: 'Mahogany seed to plant' }
        ],
        harvestTime: 360,
        category: 'trees'
      },
      {
        id: 'plant_yew',
        name: 'Plant Yew Tree',
        type: 'farming',
        skill: 'farming',
        levelRequired: 60,
        experience: 81,
        baseTime: 1,
        itemReward: { id: 'yew_logs', name: 'Yew Logs', quantity: 20 },
        requirements: [
          { type: 'item', itemId: 'yew_seed', quantity: 1, description: 'Yew seed to plant' }
        ],
        harvestTime: 400,
        category: 'trees'
      },
      {
        id: 'plant_magic',
        name: 'Plant Magic Tree',
        type: 'farming',
        skill: 'farming',
        levelRequired: 75,
        experience: 145,
        baseTime: 1,
        itemReward: { id: 'magic_logs', name: 'Magic Logs', quantity: 25 },
        requirements: [
          { type: 'item', itemId: 'magic_seed', quantity: 1, description: 'Magic seed to plant' }
        ],
        harvestTime: 480,
        category: 'trees'
      },
      {
        id: 'plant_redwood',
        name: 'Plant Redwood Tree',
        type: 'farming',
        skill: 'farming',
        levelRequired: 90,
        experience: 230,
        baseTime: 1,
        itemReward: { id: 'redwood_logs', name: 'Redwood Logs', quantity: 30 },
        requirements: [
          { type: 'item', itemId: 'redwood_seed', quantity: 1, description: 'Redwood seed to plant' }
        ],
        harvestTime: 640,
        category: 'trees'
      }
    ].map(action => ({
      ...action,
      requirements:
        action.levelRequired === 1 && action.skill === 'farming'
          ? action.requirements
          : (action.requirements && action.requirements.length > 0
              ? action.requirements
              : [{ type: 'level', skill: action.skill, level: action.levelRequired }])
    })),
    availableSkills: ['farming'],
    type: 'resource' as const,
    levelRequired: 1,
    resources: [],
    category: 'farming',
    icon: '/assets/BG/fields.webp'
  },
];

export const mockCharacter: Character = {
  id: 'mock-character',
  name: 'Mock Character',
  lastLogin: new Date(),
  lastAction: {
    type: 'none',
    location: 'forest'
  },
  skills: {
    none: createSkill('None'),
    attack: createSkill('Attack'),
    strength: createSkill('Strength'),
    defence: createSkill('Defence'),
    ranged: createSkill('Ranged'),
    prayer: createSkill('Prayer'),
    magic: createSkill('Magic'),
    runecrafting: createSkill('Runecrafting'),
    construction: createSkill('Construction'),
    hitpoints: createSkill('Hitpoints', 10),
    agility: createSkill('Agility'),
    herblore: createSkill('Herblore'),
    thieving: createSkill('Thieving'),
    crafting: createSkill('Crafting'),
    fletching: createSkill('Fletching'),
    slayer: createSkill('Slayer'),
    hunter: createSkill('Hunter'),
    mining: createSkill('Mining'),
    smithing: createSkill('Smithing'),
    fishing: createSkill('Fishing'),
    cooking: createSkill('Cooking'),
    firemaking: createSkill('Firemaking'),
    woodcutting: createSkill('Woodcutting'),
    farming: createSkill('Farming')
  },
  bank: [],
  equipment: {
    weapon: { id: 'bronze_axe', name: 'Bronze Axe', quantity: 1, type: 'tool', category: 'Tools', icon: '/assets/items/bronze_axe.png' },
    shield: { id: 'bronze_pickaxe', name: 'Bronze Pickaxe', quantity: 1, type: 'tool', category: 'Tools', icon: '/assets/items/bronze_pickaxe.png' }
  },
  combatLevel: 3,
  hitpoints: 10,
  maxHitpoints: 10, // Max hitpoints equals hitpoints skill level (10)
  prayer: 1,
  maxPrayer: 1,
  specialEnergy: 100,
  maxSpecialEnergy: 100,
  activeEffects: [],
  slayerPoints: 0,
  currentSlayerTask: null,
  slayerTaskStreak: 0,
  stats: {
    // General
    deaths: 0,
    foodEaten: 0,
    hitpointsGained: 0,
    damageDone: 0,
    damageTaken: 0,
    coinsSpent: 0,
    coinsEarned: 0,
    slayerPointsSpent: 0,
    slayerPointsEarned: 0,
    totalActiveTime: 0,
    totalOfflineTime: 0,

    // Gathering
    logsChopped: 0,
    oresMined: 0,
    fishCaught: 0,
    itemsPickpocketed: 0,
    creaturesHunted: 0,
    cropsHarvested: 0,

    // Processing
    itemsCrafted: 0,
    arrowsFletched: 0,
    barsSmelted: 0,
    foodCooked: 0,
    logsBurned: 0,
    bonesBuried: 0,
    runesCrafted: 0,

    // Combat
    monstersKilled: 0,
    totalKills: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    favouriteFoodEaten: 0,
    totalHealthHealed: 0,

    // Detailed tracking
    resourcesGathered: {},
    actionsPerformed: {},
    monstersKilledByType: {}
  }
}; 