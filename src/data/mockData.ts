import type { Location, Character } from '../types/game';
import { createSkill } from '../types/game';

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
        storeItems: [
          // Woodcutting Tools
          {
            id: 'bronze_axe',
            name: 'Bronze Axe',
            buyPrice: 100,
            sellPrice: 40,
            levelRequired: 1
          },
          {
            id: 'iron_axe',
            name: 'Iron Axe',
            buyPrice: 250,
            sellPrice: 100,
            levelRequired: 5
          },
          {
            id: 'steel_axe',
            name: 'Steel Axe',
            buyPrice: 500,
            sellPrice: 200,
            levelRequired: 20
          },
          {
            id: 'mithril_axe',
            name: 'Mithril Axe',
            buyPrice: 1000,
            sellPrice: 400,
            levelRequired: 30
          },
          {
            id: 'adamant_axe',
            name: 'Adamant Axe',
            buyPrice: 2000,
            sellPrice: 800,
            levelRequired: 40
          },
          {
            id: 'rune_axe',
            name: 'Rune Axe',
            buyPrice: 4000,
            sellPrice: 1600,
            levelRequired: 50
          },

          // Fishing Tools
          {
            id: 'small_net',
            name: 'Small Fishing Net',
            buyPrice: 100,
            sellPrice: 40,
            levelRequired: 1
          },
          {
            id: 'fly_fishing_rod',
            name: 'Fly Fishing Rod',
            buyPrice: 500,
            sellPrice: 200,
            levelRequired: 20
          },
          {
            id: 'harpoon',
            name: 'Harpoon',
            buyPrice: 1000,
            sellPrice: 400,
            levelRequired: 35
          },

          // Mining Tools
          {
            id: 'bronze_pickaxe',
            name: 'Bronze Pickaxe',
            buyPrice: 100,
            sellPrice: 40,
            levelRequired: 1
          },
          {
            id: 'iron_pickaxe',
            name: 'Iron Pickaxe',
            buyPrice: 250,
            sellPrice: 100,
            levelRequired: 5
          },
          {
            id: 'steel_pickaxe',
            name: 'Steel Pickaxe',
            buyPrice: 500,
            sellPrice: 200,
            levelRequired: 20
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
        baseTime: 4000,
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
        baseTime: 5000,
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
        baseTime: 4000,
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
      }
    ]
  },
  {
    id: 'camp',
    name: 'Camp',
    description: 'A cozy camp where you can cook your food and practice firemaking.',
    actions: [
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
        baseTime: 3500,
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
        id: 'cook_trout',
        name: 'Cook Trout',
        type: 'cooking',
        skill: 'cooking',
        levelRequired: 15,
        experience: 70,
        baseTime: 4000,
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
      }
    ]
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