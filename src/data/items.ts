import type { Item, ItemType, ItemStats } from '../types/game';

// Item Categories
export const ITEM_CATEGORIES = {
  TOOLS: 'Tools',
  WEAPONS: 'Weapons',
  ARMOR: 'Armor',
  RESOURCES: 'Resources',
  CONSUMABLES: 'Consumables',
  CURRENCIES: 'Currencies',
} as const;

// Tool tiers for progression
export const TOOL_TIERS = {
  // Woodcutting
  bronze_axe: 1,
  iron_axe: 2,
  steel_axe: 3,
  mithril_axe: 4,
  adamant_axe: 5,
  rune_axe: 6,
  dragon_axe: 7,

  // Fishing
  small_net: 1,
  big_net: 2,
  fly_fishing_rod: 3,
  harpoon: 4,
  dragon_harpoon: 5,

  // Mining (for future use)
  bronze_pickaxe: 1,
  iron_pickaxe: 2,
  steel_pickaxe: 3,
  mithril_pickaxe: 4,
  adamant_pickaxe: 5,
  rune_pickaxe: 6,
  dragon_pickaxe: 7,
} as const;

// Equipment slots
export const EQUIPMENT_SLOTS = {
  HEAD: 'head',
  CAPE: 'cape',
  NECK: 'neck',
  WEAPON: 'weapon',
  BODY: 'body',
  SHIELD: 'shield',
  LEGS: 'legs',
  HANDS: 'hands',
  FEET: 'feet',
  RING: 'ring',
  TOOL: 'tool',
} as const;

// Item Definitions
export const ITEMS: Record<string, Item> = {
  // Tools - Woodcutting
  bronze_axe: {
    id: 'bronze_axe',
    name: 'Bronze Axe',
    type: 'tool',
    level: 1,
    stats: { attack: 1 },
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/items/bronze_axe.png',
    buyPrice: 100,
    sellPrice: 40,
  },
  iron_axe: {
    id: 'iron_axe',
    name: 'Iron Axe',
    type: 'tool',
    level: 5,
    stats: { attack: 2 },
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/items/iron_axe.png',
    buyPrice: 250,
    sellPrice: 100,
  },
  steel_axe: {
    id: 'steel_axe',
    name: 'Steel Axe',
    type: 'tool',
    level: 20,
    stats: { attack: 3 },
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/items/steel_axe.png',
    buyPrice: 500,
    sellPrice: 200,
  },
  mithril_axe: {
    id: 'mithril_axe',
    name: 'Mithril Axe',
    type: 'tool',
    level: 30,
    stats: { attack: 4 },
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/items/mithril_axe.png',
    buyPrice: 1000,
    sellPrice: 400,
  },
  adamant_axe: {
    id: 'adamant_axe',
    name: 'Adamant Axe',
    type: 'tool',
    level: 40,
    stats: { attack: 5 },
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/items/adamant_axe.png',
    buyPrice: 2000,
    sellPrice: 800,
  },
  rune_axe: {
    id: 'rune_axe',
    name: 'Rune Axe',
    type: 'tool',
    level: 50,
    stats: { attack: 6 },
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/items/rune_axe.png',
    buyPrice: 4000,
    sellPrice: 1600,
  },

  // Tools - Fishing
  small_net: {
    id: 'small_net',
    name: 'Small Fishing Net',
    type: 'tool',
    level: 1,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.TOOL,
    icon: '/assets/items/small_net.png',
    buyPrice: 100,
    sellPrice: 40,
  },
  fly_fishing_rod: {
    id: 'fly_fishing_rod',
    name: 'Fly Fishing Rod',
    type: 'tool',
    level: 20,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.TOOL,
    icon: '/assets/items/fly_fishing_rod.png',
    buyPrice: 500,
    sellPrice: 200,
  },
  harpoon: {
    id: 'harpoon',
    name: 'Harpoon',
    type: 'tool',
    level: 35,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.TOOL,
    icon: '/assets/items/harpoon.png',
    buyPrice: 1000,
    sellPrice: 400,
  },

  // Resources - Woodcutting
  logs: {
    id: 'logs',
    name: 'Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Normal_Log.png',
    buyPrice: 10,
    sellPrice: 4,
  },
  oak_logs: {
    id: 'oak_logs',
    name: 'Oak Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Oak_Log.png',
    buyPrice: 20,
    sellPrice: 8,
  },
  willow_logs: {
    id: 'willow_logs',
    name: 'Willow Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Willow_Log.png',
    buyPrice: 40,
    sellPrice: 16,
  },
  maple_logs: {
    id: 'maple_logs',
    name: 'Maple Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Maple_Log.png',
    buyPrice: 80,
    sellPrice: 32,
  },
  yew_logs: {
    id: 'yew_logs',
    name: 'Yew Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Yew_Log.png',
    buyPrice: 160,
    sellPrice: 64,
  },
  magic_logs: {
    id: 'magic_logs',
    name: 'Magic Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Magic_Log.png',
    buyPrice: 320,
    sellPrice: 128,
  },

  // Resources - Fishing
  raw_shrimp: {
    id: 'raw_shrimp',
    name: 'Raw Shrimp',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/raw_shrimp.png',
    buyPrice: 5,
    sellPrice: 2,
  },
  raw_anchovy: {
    id: 'raw_anchovy',
    name: 'Raw Anchovy',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/raw_anchovy.png',
    buyPrice: 10,
    sellPrice: 4,
  },
  raw_trout: {
    id: 'raw_trout',
    name: 'Raw Trout',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/raw_trout.png',
    buyPrice: 20,
    sellPrice: 8,
  },
  raw_salmon: {
    id: 'raw_salmon',
    name: 'Raw Salmon',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/raw_salmon.png',
    buyPrice: 40,
    sellPrice: 16,
  },
  raw_tuna: {
    id: 'raw_tuna',
    name: 'Raw Tuna',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/raw_tuna.png',
    buyPrice: 80,
    sellPrice: 32,
  },
  raw_swordfish: {
    id: 'raw_swordfish',
    name: 'Raw Swordfish',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/raw_swordfish.png',
    buyPrice: 160,
    sellPrice: 64,
  },
  raw_shark: {
    id: 'raw_shark',
    name: 'Raw Shark',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/raw_shark.png',
    buyPrice: 320,
    sellPrice: 128,
  },

  // Cooked Fish
  cooked_shrimp: {
    id: 'cooked_shrimp',
    name: 'Cooked Shrimp',
    type: 'resource',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/items/cooked_shrimp.png',
    buyPrice: 10,
    sellPrice: 4,
  },
  cooked_sardine: {
    id: 'cooked_sardine',
    name: 'Cooked Sardine',
    type: 'resource',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/items/cooked_sardine.png',
    buyPrice: 20,
    sellPrice: 8,
  },
  cooked_trout: {
    id: 'cooked_trout',
    name: 'Cooked Trout',
    type: 'resource',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/items/cooked_trout.png',
    buyPrice: 40,
    sellPrice: 16,
  },

  // Firemaking Products
  ashes: {
    id: 'ashes',
    name: 'Ashes',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/ashes.png',
    buyPrice: 2,
    sellPrice: 1,
  },

  // Tools - Mining
  bronze_pickaxe: {
    id: 'bronze_pickaxe',
    name: 'Bronze Pickaxe',
    type: 'tool',
    level: 1,
    stats: { mining: 1 },
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/items/bronze_pickaxe.png',
    buyPrice: 100,
    sellPrice: 40,
  },
  iron_pickaxe: {
    id: 'iron_pickaxe',
    name: 'Iron Pickaxe',
    type: 'tool',
    level: 5,
    stats: { mining: 2 },
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/items/iron_pickaxe.png',
    buyPrice: 250,
    sellPrice: 100,
  },
  steel_pickaxe: {
    id: 'steel_pickaxe',
    name: 'Steel Pickaxe',
    type: 'tool',
    level: 20,
    stats: { mining: 3 },
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/items/steel_pickaxe.png',
    buyPrice: 500,
    sellPrice: 200,
  },

  // Resources - Mining
  copper_ore: {
    id: 'copper_ore',
    name: 'Copper Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/copper_ore.png',
    buyPrice: 10,
    sellPrice: 4,
  },
  tin_ore: {
    id: 'tin_ore',
    name: 'Tin Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/tin_ore.png',
    buyPrice: 10,
    sellPrice: 4,
  },
  iron_ore: {
    id: 'iron_ore',
    name: 'Iron Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/iron_ore.png',
    buyPrice: 20,
    sellPrice: 8,
  },
  coal: {
    id: 'coal',
    name: 'Coal',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/coal.png',
    buyPrice: 40,
    sellPrice: 16,
  },

  // Resources - Smithing
  bronze_bar: {
    id: 'bronze_bar',
    name: 'Bronze Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/bronze_bar.png',
    buyPrice: 25,
    sellPrice: 10,
  },
  iron_bar: {
    id: 'iron_bar',
    name: 'Iron Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/iron_bar.png',
    buyPrice: 50,
    sellPrice: 20,
  },
  steel_bar: {
    id: 'steel_bar',
    name: 'Steel Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/steel_bar.png',
    buyPrice: 100,
    sellPrice: 40,
  },

  // Currencies
  coins: {
    id: 'coins',
    name: 'Coins',
    type: 'resource',
    category: ITEM_CATEGORIES.CURRENCIES,
    icon: '/assets/items/coins.png',
    buyPrice: 1,
    sellPrice: 1,
  },
};

// Helper functions
export const getItemById = (id: string): Item | undefined => ITEMS[id];

export const getItemsByCategory = (category: string): Item[] => {
  return Object.values(ITEMS).filter(item => item.category === category);
};

export const getToolTier = (itemId: string): number => {
  return TOOL_TIERS[itemId as keyof typeof TOOL_TIERS] || 0;
};

export const isEquippable = (item: Item): boolean => {
  return item.type === 'tool' || item.type === 'weapon' || item.type === 'armor';
};

export const getEquipmentSlot = (item: Item): string | undefined => {
  if (!isEquippable(item)) return undefined;
  return item.slot;
};

export const meetsLevelRequirement = (item: Item, playerLevel: number): boolean => {
  if (!item.level) return true;
  return playerLevel >= item.level;
}; 