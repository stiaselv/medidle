import type { Location, Character, StoreAction, SkillAction } from '../types/game';
import { createSkill } from '../types/game';
import { SMITHING_BASE_LEVELS } from './items';

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

// Define all locations
export const mockLocations: Location[] = [
  {
    id: 'general_store',
    name: 'General Store',
    description: 'A well-stocked shop where you can buy tools and sell your items.',
    type: 'store',
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
            itemId: 'small_net'
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
            itemId: 'small_net'
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
            itemId: 'small_net'
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
    type: 'smithing',
    actions: generateMetalCategories(),
    availableSkills: ['smithing']
  }
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
    farming: createSkill('Farming'),
    combat: createSkill('Combat')
  },
  bank: [],
  equipment: {
    bronze_axe: { id: 'bronze_axe', name: 'Bronze Axe', quantity: 1 },
    small_net: { id: 'small_net', name: 'Small Fishing Net', quantity: 1 },
    bronze_pickaxe: { id: 'bronze_pickaxe', name: 'Bronze Pickaxe', quantity: 1 }
  },
  combatLevel: 3,
  hitpoints: 10,
  maxHitpoints: 10,
  prayer: 1,
  maxPrayer: 1
}; 