import type { Item, ItemType, ItemStats, CombatStats, SkillName } from '../types/game';
import { capLevelRequirement } from '../types/game';
import { getCombinedStats, BRONZE_TOOL_STATS, IRON_TOOL_STATS, STEEL_TOOL_STATS, MITHRIL_TOOL_STATS, ADAMANT_TOOL_STATS, RUNE_TOOL_STATS, DRAGON_TOOL_STATS } from './combatStats';

// Use a default image path for testing
const defaultImg = '/assets/items/default.png';

// Define image paths
const normalLogImg = defaultImg;
const oakLogImg = defaultImg;
const willowLogImg = defaultImg;
const mapleLogImg = defaultImg;
const yewLogImg = defaultImg;
const magicLogImg = defaultImg;
const redwoodLogImg = defaultImg;
const coinsImg = defaultImg;

const copperOreImg = defaultImg;
const tinOreImg = defaultImg;
const ironOreImg = defaultImg;
const silverOreImg = defaultImg;
const goldOreImg = defaultImg;
const mithrilOreImg = defaultImg;
const adamantOreImg = defaultImg;
const runeOreImg = defaultImg;
const coalOreImg = defaultImg;

// Item Categories
export const ITEM_CATEGORIES = {
  TOOLS: 'Tools',
  WEAPONS: 'Weapons',
  ARMOR: 'Armor',
  RESOURCES: 'Resources',
  CONSUMABLES: 'Consumables',
  CURRENCY: 'Currency',
  MISC: 'Misc',
  SMITHING: 'Smithing'
} as const;

// Equipment slots
export const EQUIPMENT_SLOTS = {
  WEAPON: 'weapon',
  SHIELD: 'shield',
  HEAD: 'head',
  BODY: 'body',
  LEGS: 'legs',
  FEET: 'feet',
  HANDS: 'hands',
  NECK: 'neck',
  RING: 'ring',
  TOOL: 'tool',
  CAPE: 'cape'
} as const;

// Tool tiers for progression
export const TOOL_TIERS = {
  // Woodcutting
  bronze_axe: {
    name: 'Bronze Axe',
    level: 1,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: BRONZE_TOOL_STATS
  },
  iron_axe: {
    name: 'Iron Axe',
    level: 10,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: IRON_TOOL_STATS
  },
  steel_axe: {
    name: 'Steel Axe',
    level: 20,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: STEEL_TOOL_STATS
  },
  mithril_axe: {
    name: 'Mithril Axe',
    level: 30,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: MITHRIL_TOOL_STATS
  },
  adamant_axe: {
    name: 'Adamant Axe',
    level: 40,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: ADAMANT_TOOL_STATS
  },
  rune_axe: {
    name: 'Rune Axe',
    level: 50,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: RUNE_TOOL_STATS
  },

  // Mining
  bronze_pickaxe: {
    name: 'Bronze Pickaxe',
    level: 1,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  iron_pickaxe: {
    name: 'Iron Pickaxe',
    level: 10,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  steel_pickaxe: {
    name: 'Steel Pickaxe',
    level: 20,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  mithril_pickaxe: {
    name: 'Mithril Pickaxe',
    level: 30,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  adamant_pickaxe: {
    name: 'Adamant Pickaxe',
    level: 40,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  rune_pickaxe: {
    name: 'Rune Pickaxe',
    level: 50,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON
  }
} as const;

// Base smithing levels for each metal type
export const SMITHING_BASE_LEVELS = {
  bronze: 1,
  iron: 15,
  steel: 30,
  mithril: 50,
  adamant: 70,
  rune: 85
} as const;

// Helper function to calculate smithing level requirement
export const getSmithingLevel = (metalType: keyof typeof SMITHING_BASE_LEVELS, levelOverBase: number): number => {
  const level = SMITHING_BASE_LEVELS[metalType] + levelOverBase;
  return Math.min(level, 99); // Cap level at 99
};

// Helper function to get the base price multiplier for each metal type
export const METAL_PRICE_MULTIPLIERS = {
  bronze: 1,
  iron: 2,
  steel: 4,
  mithril: 8,
  adamant: 16,
  rune: 32
} as const;

// Helper function to calculate item price based on metal type and bar count
export const calculateSmithingItemPrice = (
  metalType: keyof typeof METAL_PRICE_MULTIPLIERS,
  barCount: number,
  basePrice: number = 100
): { buyPrice: number; sellPrice: number } => {
  const multiplier = METAL_PRICE_MULTIPLIERS[metalType];
  const buyPrice = basePrice * multiplier * barCount;
  return {
    buyPrice,
    sellPrice: Math.floor(buyPrice * 0.4) // 40% of buy price for sell price
  };
};

interface SmithingTemplate {
  id: string;
  name: string;
  levelOver: number;
  bars: number;
  type: 'weapon' | 'armor' | 'ammo' | 'resource';
  weaponType?: string;
  armorType?: string;
  speed?: number;
}

// Helper functions
const getMetalTier = (metalType: string): number => {
  switch (metalType) {
    case 'bronze': return 1;
    case 'iron': return 2;
    case 'steel': return 3;
    case 'mithril': return 4;
    case 'adamant': return 5;
    case 'rune': return 6;
    default: return 1;
  }
};

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

const SMITHING_TEMPLATES: SmithingTemplate[] = [
  // Weapons
  { id: 'dagger', name: 'Dagger', levelOver: 0, bars: 1, type: 'weapon', weaponType: 'dagger', speed: 2.4 },
  { id: 'axe', name: 'Axe', levelOver: 1, bars: 1, type: 'weapon', weaponType: 'axe', speed: 3.0 },
  { id: 'mace', name: 'Mace', levelOver: 1, bars: 1, type: 'weapon', weaponType: 'mace', speed: 2.4 },
  { id: 'medium_helm', name: 'Medium Helm', levelOver: 2, bars: 1, type: 'armor', armorType: 'medium_helm' },
  { id: 'bolts_unf', name: 'Unfinished Bolts', levelOver: 2, bars: 1, type: 'ammo' },
  { id: 'sword', name: 'Sword', levelOver: 3, bars: 1, type: 'weapon', weaponType: 'sword', speed: 2.4 },
  { id: 'dart_tips', name: 'Dart Tips', levelOver: 3, bars: 1, type: 'ammo' },
  { id: 'nails', name: 'Nails', levelOver: 3, bars: 1, type: 'resource' },
  { id: 'scimitar', name: 'Scimitar', levelOver: 4, bars: 2, type: 'weapon', weaponType: 'scimitar', speed: 2.4 },
  { id: 'spear', name: 'Spear', levelOver: 4, bars: 1, type: 'weapon' },
  { id: 'arrowtips', name: 'Arrowtips', levelOver: 4, bars: 1, type: 'ammo' },
  { id: 'crossbow_limbs', name: 'Crossbow Limbs', levelOver: 5, bars: 1, type: 'resource' },
  { id: 'longsword', name: 'Longsword', levelOver: 5, bars: 2, type: 'weapon', weaponType: 'longsword', speed: 2.4 },
  { id: 'javelin_heads', name: 'Javelin Heads', levelOver: 5, bars: 1, type: 'ammo' },
  { id: 'full_helm', name: 'Full Helm', levelOver: 6, bars: 2, type: 'armor', armorType: 'full_helm' },
  { id: 'throwing_knives', name: 'Throwing Knives', levelOver: 6, bars: 1, type: 'ammo' },
  { id: 'square_shield', name: 'Square Shield', levelOver: 7, bars: 2, type: 'armor', armorType: 'square_shield' },
  { id: 'warhammer', name: 'Warhammer', levelOver: 8, bars: 3, type: 'weapon', weaponType: 'warhammer', speed: 3.6 },
  { id: 'battleaxe', name: 'Battleaxe', levelOver: 9, bars: 3, type: 'weapon', weaponType: 'battleaxe', speed: 3.0 },
  { id: 'chainbody', name: 'Chainbody', levelOver: 10, bars: 3, type: 'armor', armorType: 'chainbody' },
  { id: 'kiteshield', name: 'Kiteshield', levelOver: 11, bars: 3, type: 'armor', armorType: 'kiteshield' },
  { id: 'claws', name: 'Claws', levelOver: 12, bars: 2, type: 'weapon' },
  { id: 'two_handed_sword', name: 'Two-handed Sword', levelOver: 13, bars: 3, type: 'weapon', weaponType: 'two_handed_sword', speed: 3.6 },
  { id: 'platelegs', name: 'Platelegs', levelOver: 13, bars: 3, type: 'armor', armorType: 'platelegs' },
  { id: 'plateskirt', name: 'Plateskirt', levelOver: 13, bars: 3, type: 'armor', armorType: 'platelegs' },
  { id: 'platebody', name: 'Platebody', levelOver: 14, bars: 5, type: 'armor', armorType: 'platebody' }
];

// Helper function to create default combat stats for weapons/armor
const createDefaultCombatStats = (): CombatStats => ({
  attackStab: 0,
  attackSlash: 0,
  attackCrush: 0,
  attackMagic: 0,
  attackRanged: 0,
  defenceStab: 0,
  defenceSlash: 0,
  defenceCrush: 0,
  defenceMagic: 0,
  defenceRanged: 0,
  strengthMelee: 0,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
});

// Helper function to get equipment slot based on item type
export const getEquipmentSlot = (template: SmithingTemplate): keyof typeof EQUIPMENT_SLOTS => {
  if (template.type === 'weapon') return 'WEAPON';
  if (template.type === 'armor') {
    switch (template.armorType) {
      case 'platebody': return 'BODY';
      case 'platelegs':
      case 'plateskirt': return 'LEGS';
      case 'full_helm':
      case 'medium_helm': return 'HEAD';
      default: return 'SHIELD';
    }
  }
  return 'TOOL';
};

// Update generateSmithingItems to use the helper function
const generateSmithingItems = (metalType: string) => {
  const items: Record<string, Item> = {};
  
  SMITHING_TEMPLATES.forEach(template => {
    const itemId = `${metalType}_${template.id}`;
    const combatStats = template.type === 'weapon' 
      ? createDefaultCombatStats()
      : createDefaultCombatStats();
    
    items[itemId] = {
      id: itemId,
      name: `${capitalize(metalType)} ${template.name}`,
      type: 'tool',
      category: ITEM_CATEGORIES.TOOLS,
      icon: defaultImg,
      level: getMetalTier(metalType) + template.levelOver,
      stats: combatStats,
      slot: EQUIPMENT_SLOTS[getEquipmentSlot(template)],
      speed: template.speed
    };
  });
  
  return items;
};

// Generate all smithing items for each metal type
const SMITHING_ITEMS = {
  ...generateSmithingItems('bronze'),
  ...generateSmithingItems('iron'),
  ...generateSmithingItems('steel'),
  ...generateSmithingItems('mithril'),
  ...generateSmithingItems('adamant'),
  ...generateSmithingItems('rune'),
};

// Item Definitions
export const ITEMS: Record<string, Item> = {
  coins: {
    id: 'coins',
    name: 'Coins',
    type: 'resource',
    category: ITEM_CATEGORIES.MISC,
    icon: coinsImg,
    buyPrice: 1,
    sellPrice: 1
  },

  // Tools - Woodcutting
  bronze_axe: {
    id: 'bronze_axe',
    name: 'Bronze Axe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 1,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { woodcutting: 1 }
  },
  iron_axe: {
    id: 'iron_axe',
    name: 'Iron Axe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 10,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { woodcutting: 2 }
  },
  steel_axe: {
    id: 'steel_axe',
    name: 'Steel Axe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 20,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { woodcutting: 3 }
  },
  mithril_axe: {
    id: 'mithril_axe',
    name: 'Mithril Axe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 30,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { woodcutting: 4 }
  },
  adamant_axe: {
    id: 'adamant_axe',
    name: 'Adamant Axe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 40,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { woodcutting: 5 }
  },
  rune_axe: {
    id: 'rune_axe',
    name: 'Rune Axe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 50,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { woodcutting: 6 }
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
    icon: normalLogImg,
    buyPrice: 10,
    sellPrice: 4,
  },
  oak_logs: {
    id: 'oak_logs',
    name: 'Oak Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: oakLogImg,
    buyPrice: 20,
    sellPrice: 8,
  },
  willow_logs: {
    id: 'willow_logs',
    name: 'Willow Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: willowLogImg,
    buyPrice: 40,
    sellPrice: 16,
  },
  maple_logs: {
    id: 'maple_logs',
    name: 'Maple Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: mapleLogImg,
    buyPrice: 80,
    sellPrice: 32,
  },
  teak_logs: {
    id: 'teak_logs',
    name: 'Teak Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Teak_Log.png',
    buyPrice: 100,
    sellPrice: 40,
  },
  mahogany_logs: {
    id: 'mahogany_logs',
    name: 'Mahogany Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Mahogany_Log.png',
    buyPrice: 140,
    sellPrice: 56,
  },
  yew_logs: {
    id: 'yew_logs',
    name: 'Yew Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: yewLogImg,
    buyPrice: 160,
    sellPrice: 64,
  },
  magic_logs: {
    id: 'magic_logs',
    name: 'Magic Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: magicLogImg,
    buyPrice: 320,
    sellPrice: 128,
  },
  redwood_logs: {
    id: 'redwood_logs',
    name: 'Redwood Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: redwoodLogImg,
    buyPrice: 400,
    sellPrice: 160,
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
    icon: '/assets/ItemThumbnail/Fishing/Raw_Trout.png',
    buyPrice: 20,
    sellPrice: 8,
  },
  raw_herring: {
    id: 'raw_herring',
    name: 'Raw Herring',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Herring.png',
    buyPrice: 15,
    sellPrice: 6,
  },
  raw_pike: {
    id: 'raw_pike',
    name: 'Raw Pike',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Pike.png',
    buyPrice: 25,
    sellPrice: 10,
  },
  raw_salmon: {
    id: 'raw_salmon',
    name: 'Raw Salmon',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Salmon.png',
    buyPrice: 30,
    sellPrice: 12,
  },
  raw_tuna: {
    id: 'raw_tuna',
    name: 'Raw Tuna',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Tuna.png',
    buyPrice: 35,
    sellPrice: 14,
  },
  raw_lobster: {
    id: 'raw_lobster',
    name: 'Raw Lobster',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Lobster.png',
    buyPrice: 40,
    sellPrice: 16,
  },
  raw_bass: {
    id: 'raw_bass',
    name: 'Raw Bass',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Bass.png',
    buyPrice: 45,
    sellPrice: 18,
  },
  raw_swordfish: {
    id: 'raw_swordfish',
    name: 'Raw Swordfish',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Swordfish.png',
    buyPrice: 50,
    sellPrice: 20,
  },
  raw_monkfish: {
    id: 'raw_monkfish',
    name: 'Raw Monkfish',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Monkfish.png',
    buyPrice: 60,
    sellPrice: 24,
  },
  raw_shark: {
    id: 'raw_shark',
    name: 'Raw Shark',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Shark.png',
    buyPrice: 75,
    sellPrice: 30,
  },
  raw_anglerfish: {
    id: 'raw_anglerfish',
    name: 'Raw Anglerfish',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Anglerfish.png',
    buyPrice: 90,
    sellPrice: 36,
  },
  raw_dark_crab: {
    id: 'raw_dark_crab',
    name: 'Raw Dark Crab',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Dark_Crab.png',
    buyPrice: 100,
    sellPrice: 40,
  },
  feathers: {
    id: 'feathers',
    name: 'Feathers',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Feathers.png',
    buyPrice: 2,
    sellPrice: 1,
  },

  // Cooked Food
  cooked_meat: {
    id: 'cooked_meat',
    name: 'Cooked Meat',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Meat.png',
    buyPrice: 12,
    sellPrice: 5,
    healing: 3,
  },
  cooked_chicken: {
    id: 'cooked_chicken',
    name: 'Cooked Chicken',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Chicken.png',
    buyPrice: 12,
    sellPrice: 5,
    healing: 3,
  },
  cooked_shrimp: {
    id: 'cooked_shrimp',
    name: 'Cooked Shrimp',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Shrimp.png',
    buyPrice: 12,
    sellPrice: 5,
    healing: 3,
  },
  cooked_sardine: {
    id: 'cooked_sardine',
    name: 'Cooked Sardine',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Sardine.png',
    buyPrice: 15,
    sellPrice: 6,
    healing: 4,
  },
  cooked_herring: {
    id: 'cooked_herring',
    name: 'Cooked Herring',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Herring.png',
    buyPrice: 20,
    sellPrice: 8,
    healing: 5,
  },
  cooked_trout: {
    id: 'cooked_trout',
    name: 'Cooked Trout',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Trout.png',
    buyPrice: 25,
    sellPrice: 10,
    healing: 7,
  },
  cooked_pike: {
    id: 'cooked_pike',
    name: 'Cooked Pike',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Pike.png',
    buyPrice: 30,
    sellPrice: 12,
    healing: 8,
  },
  cooked_salmon: {
    id: 'cooked_salmon',
    name: 'Cooked Salmon',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Salmon.png',
    buyPrice: 35,
    sellPrice: 14,
    healing: 9,
  },
  cooked_tuna: {
    id: 'cooked_tuna',
    name: 'Cooked Tuna',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Tuna.png',
    buyPrice: 40,
    sellPrice: 16,
    healing: 10,
  },
  cooked_lobster: {
    id: 'cooked_lobster',
    name: 'Cooked Lobster',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Lobster.png',
    buyPrice: 50,
    sellPrice: 20,
    healing: 12,
  },
  cooked_bass: {
    id: 'cooked_bass',
    name: 'Cooked Bass',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Bass.png',
    buyPrice: 55,
    sellPrice: 22,
    healing: 13,
  },
  cooked_swordfish: {
    id: 'cooked_swordfish',
    name: 'Cooked Swordfish',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Swordfish.png',
    buyPrice: 60,
    sellPrice: 24,
    healing: 14,
  },
  cooked_monkfish: {
    id: 'cooked_monkfish',
    name: 'Cooked Monkfish',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Monkfish.png',
    buyPrice: 70,
    sellPrice: 28,
    healing: 16,
  },
  cooked_shark: {
    id: 'cooked_shark',
    name: 'Cooked Shark',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Shark.png',
    buyPrice: 85,
    sellPrice: 34,
    healing: 20,
  },
  cooked_anglerfish: {
    id: 'cooked_anglerfish',
    name: 'Cooked Anglerfish',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Anglerfish.png',
    buyPrice: 100,
    sellPrice: 40,
    healing: 21,
  },
  cooked_dark_crab: {
    id: 'cooked_dark_crab',
    name: 'Cooked Dark Crab',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Dark_Crab.png',
    buyPrice: 110,
    sellPrice: 44,
    healing: 22,
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
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 1,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  iron_pickaxe: {
    id: 'iron_pickaxe',
    name: 'Iron Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 10,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  steel_pickaxe: {
    id: 'steel_pickaxe',
    name: 'Steel Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 20,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  mithril_pickaxe: {
    id: 'mithril_pickaxe',
    name: 'Mithril Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 30,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  adamant_pickaxe: {
    id: 'adamant_pickaxe',
    name: 'Adamant Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 40,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  rune_pickaxe: {
    id: 'rune_pickaxe',
    name: 'Rune Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 50,
    slot: EQUIPMENT_SLOTS.WEAPON
  },

  // Resources - Mining
  copper_ore: {
    id: 'copper_ore',
    name: 'Copper Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: copperOreImg,
    buyPrice: 10,
    sellPrice: 4,
  },
  tin_ore: {
    id: 'tin_ore',
    name: 'Tin Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: tinOreImg,
    buyPrice: 10,
    sellPrice: 4,
  },
  iron_ore: {
    id: 'iron_ore',
    name: 'Iron Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: ironOreImg,
    buyPrice: 20,
    sellPrice: 8,
  },
  silver_ore: {
    id: 'silver_ore',
    name: 'Silver Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: silverOreImg,
    buyPrice: 25,
    sellPrice: 10,
  },
  pure_essence: {
    id: 'pure_essence',
    name: 'Pure Essence',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Pure_Essence.png',
    buyPrice: 30,
    sellPrice: 12,
  },
  gold_ore: {
    id: 'gold_ore',
    name: 'Gold Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: goldOreImg,
    buyPrice: 45,
    sellPrice: 18,
  },
  mithril_ore: {
    id: 'mithril_ore',
    name: 'Mithril Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: mithrilOreImg,
    buyPrice: 80,
    sellPrice: 32,
  },
  adamantite_ore: {
    id: 'adamantite_ore',
    name: 'Adamantite Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: adamantOreImg,
    buyPrice: 160,
    sellPrice: 64,
  },
  runite_ore: {
    id: 'runite_ore',
    name: 'Runite Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: runeOreImg,
    buyPrice: 320,
    sellPrice: 128,
  },
  amethyst: {
    id: 'amethyst',
    name: 'Amethyst',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Amethyst.png',
    buyPrice: 400,
    sellPrice: 160,
  },
  coal: {
    id: 'coal',
    name: 'Coal',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: coalOreImg,
    buyPrice: 45,
    sellPrice: 18,
  },

  // Resources - Smithing
  bronze_bar: {
    id: 'bronze_bar',
    name: 'Bronze Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 50,
    sellPrice: 20,
  },
  iron_bar: {
    id: 'iron_bar',
    name: 'Iron Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 100,
    sellPrice: 40,
  },
  silver_bar: {
    id: 'silver_bar',
    name: 'Silver Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 75,
    sellPrice: 30,
  },
  steel_bar: {
    id: 'steel_bar',
    name: 'Steel Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 200,
    sellPrice: 80,
  },
  gold_bar: {
    id: 'gold_bar',
    name: 'Gold Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 150,
    sellPrice: 60,
  },
  mithril_bar: {
    id: 'mithril_bar',
    name: 'Mithril Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 400,
    sellPrice: 160,
  },
  adamant_bar: {
    id: 'adamant_bar',
    name: 'Adamant Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 800,
    sellPrice: 320,
  },
  runite_bar: {
    id: 'runite_bar',
    name: 'Runite Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 1600,
    sellPrice: 640,
  },

  // Bronze Armor
  bronze_helmet: {
    id: 'bronze_helmet',
    name: 'Bronze Full Helm',
    type: 'tool',
    level: 1,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.HEAD,
    icon: '/assets/items/placeholder.png',
    buyPrice: 200,
    sellPrice: 80,
  },
  bronze_platebody: {
    id: 'bronze_platebody',
    name: 'Bronze Platebody',
    type: 'tool',
    level: 2,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.BODY,
    icon: '/assets/items/placeholder.png',
    buyPrice: 500,
    sellPrice: 200,
  },
  bronze_platelegs: {
    id: 'bronze_platelegs',
    name: 'Bronze Platelegs',
    type: 'tool',
    level: 3,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.LEGS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 300,
    sellPrice: 120,
  },

  // Iron Armor
  iron_helmet: {
    id: 'iron_helmet',
    name: 'Iron Full Helm',
    type: 'tool',
    level: 15,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.HEAD,
    icon: '/assets/items/placeholder.png',
    buyPrice: 400,
    sellPrice: 160,
  },
  iron_platebody: {
    id: 'iron_platebody',
    name: 'Iron Platebody',
    type: 'tool',
    level: 18,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.BODY,
    icon: '/assets/items/placeholder.png',
    buyPrice: 1000,
    sellPrice: 400,
  },
  iron_platelegs: {
    id: 'iron_platelegs',
    name: 'Iron Platelegs',
    type: 'tool',
    level: 16,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.LEGS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 600,
    sellPrice: 240,
  },

  // Steel Armor
  steel_helmet: {
    id: 'steel_helmet',
    name: 'Steel Full Helm',
    type: 'tool',
    level: 30,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.HEAD,
    icon: '/assets/items/placeholder.png',
    buyPrice: 800,
    sellPrice: 320,
  },
  steel_platebody: {
    id: 'steel_platebody',
    name: 'Steel Platebody',
    type: 'tool',
    level: 33,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.BODY,
    icon: '/assets/items/placeholder.png',
    buyPrice: 2000,
    sellPrice: 800,
  },
  steel_platelegs: {
    id: 'steel_platelegs',
    name: 'Steel Platelegs',
    type: 'tool',
    level: 31,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.LEGS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 1200,
    sellPrice: 480,
  },

  // Mithril Armor
  mithril_helmet: {
    id: 'mithril_helmet',
    name: 'Mithril Full Helm',
    type: 'tool',
    level: 50,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.HEAD,
    icon: '/assets/items/placeholder.png',
    buyPrice: 1600,
    sellPrice: 640,
  },
  mithril_platebody: {
    id: 'mithril_platebody',
    name: 'Mithril Platebody',
    type: 'tool',
    level: 53,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.BODY,
    icon: '/assets/items/placeholder.png',
    buyPrice: 4000,
    sellPrice: 1600,
  },
  mithril_platelegs: {
    id: 'mithril_platelegs',
    name: 'Mithril Platelegs',
    type: 'tool',
    level: 51,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.LEGS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 2400,
    sellPrice: 960,
  },

  // Adamant Armor
  adamant_helmet: {
    id: 'adamant_helmet',
    name: 'Adamant Full Helm',
    type: 'tool',
    level: 70,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.HEAD,
    icon: '/assets/items/placeholder.png',
    buyPrice: 3200,
    sellPrice: 1280,
  },
  adamant_platebody: {
    id: 'adamant_platebody',
    name: 'Adamant Platebody',
    type: 'tool',
    level: 73,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.BODY,
    icon: '/assets/items/placeholder.png',
    buyPrice: 8000,
    sellPrice: 3200,
  },
  adamant_platelegs: {
    id: 'adamant_platelegs',
    name: 'Adamant Platelegs',
    type: 'tool',
    level: 71,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.LEGS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 4800,
    sellPrice: 1920,
  },

  // Rune Armor
  rune_helmet: {
    id: 'rune_helmet',
    name: 'Rune Full Helm',
    type: 'tool',
    level: 85,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.HEAD,
    icon: '/assets/items/placeholder.png',
    buyPrice: 6400,
    sellPrice: 2560,
  },
  rune_platebody: {
    id: 'rune_platebody',
    name: 'Rune Platebody',
    type: 'tool',
    level: 88,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.BODY,
    icon: '/assets/items/placeholder.png',
    buyPrice: 16000,
    sellPrice: 6400,
  },
  rune_platelegs: {
    id: 'rune_platelegs',
    name: 'Rune Platelegs',
    type: 'tool',
    level: 86,
    stats: createDefaultCombatStats(),
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.LEGS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 9600,
    sellPrice: 3840,
  },
  ...SMITHING_ITEMS,
  bronze_dagger: {
    id: 'bronze_dagger',
    name: 'Bronze Dagger',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 1,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: createDefaultCombatStats()
  },
  iron_dagger: {
    id: 'iron_dagger',
    name: 'Iron Dagger',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 10,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: createDefaultCombatStats()
  },
  steel_dagger: {
    id: 'steel_dagger',
    name: 'Steel Dagger',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 20,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: createDefaultCombatStats()
  },
  mithril_dagger: {
    id: 'mithril_dagger',
    name: 'Mithril Dagger',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 30,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: createDefaultCombatStats()
  },
  adamant_dagger: {
    id: 'adamant_dagger',
    name: 'Adamant Dagger',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 40,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: createDefaultCombatStats()
  },
  rune_dagger: {
    id: 'rune_dagger',
    name: 'Rune Dagger',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 50,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: createDefaultCombatStats()
  },
  bronze_sword: {
    id: 'bronze_sword',
    name: 'Bronze Sword',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 1,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: createDefaultCombatStats()
  },
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 10,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: createDefaultCombatStats()
  },
  steel_sword: {
    id: 'steel_sword',
    name: 'Steel Sword',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 20,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: createDefaultCombatStats()
  },
  mithril_sword: {
    id: 'mithril_sword',
    name: 'Mithril Sword',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 30,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: createDefaultCombatStats()
  },
  adamant_sword: {
    id: 'adamant_sword',
    name: 'Adamant Sword',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 40,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: createDefaultCombatStats()
  },
  rune_sword: {
    id: 'rune_sword',
    name: 'Rune Sword',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: defaultImg,
    level: 50,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: createDefaultCombatStats()
  },

  // Fletching & Bow Crafting Items
  arrow_shafts: {
    id: 'arrow_shafts',
    name: 'Arrow Shafts',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/arrow_shafts.png',
    buyPrice: 5,
    sellPrice: 2,
  },
  headless_arrows: {
    id: 'headless_arrows',
    name: 'Headless Arrows',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/headless_arrows.png',
    buyPrice: 10,
    sellPrice: 4,
  },
  bow_string: {
    id: 'bow_string',
    name: 'Bow String',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/bow_string.png',
    buyPrice: 20,
    sellPrice: 8,
  },
  bronze_arrowtips: {
    id: 'bronze_arrowtips',
    name: 'Bronze Arrowtips',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/bronze_arrowtips.png',
    buyPrice: 15,
    sellPrice: 6,
  },
  iron_arrowtips: {
    id: 'iron_arrowtips',
    name: 'Iron Arrowtips',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/iron_arrowtips.png',
    buyPrice: 30,
    sellPrice: 12,
  },
  steel_arrowtips: {
    id: 'steel_arrowtips',
    name: 'Steel Arrowtips',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/steel_arrowtips.png',
    buyPrice: 60,
    sellPrice: 24,
  },
  mithril_arrowtips: {
    id: 'mithril_arrowtips',
    name: 'Mithril Arrowtips',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/mithril_arrowtips.png',
    buyPrice: 120,
    sellPrice: 48,
  },
  adamant_arrowtips: {
    id: 'adamant_arrowtips',
    name: 'Adamant Arrowtips',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/adamant_arrowtips.png',
    buyPrice: 240,
    sellPrice: 96,
  },
  rune_arrowtips: {
    id: 'rune_arrowtips',
    name: 'Rune Arrowtips',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/rune_arrowtips.png',
    buyPrice: 480,
    sellPrice: 192,
  },
  bronze_arrows: {
    id: 'bronze_arrows',
    name: 'Bronze Arrows',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/bronze_arrows.png',
    buyPrice: 30,
    sellPrice: 12,
  },
  iron_arrows: {
    id: 'iron_arrows',
    name: 'Iron Arrows',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/iron_arrows.png',
    buyPrice: 60,
    sellPrice: 24,
  },
  steel_arrows: {
    id: 'steel_arrows',
    name: 'Steel Arrows',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/steel_arrows.png',
    buyPrice: 120,
    sellPrice: 48,
  },
  mithril_arrows: {
    id: 'mithril_arrows',
    name: 'Mithril Arrows',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/mithril_arrows.png',
    buyPrice: 240,
    sellPrice: 96,
  },
  adamant_arrows: {
    id: 'adamant_arrows',
    name: 'Adamant Arrows',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/adamant_arrows.png',
    buyPrice: 480,
    sellPrice: 192,
  },
  rune_arrows: {
    id: 'rune_arrows',
    name: 'Rune Arrows',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/rune_arrows.png',
    buyPrice: 960,
    sellPrice: 384,
  },
  // Unstrung and Strung Bows for each log type
  unstrung_oak_shortbow: {
    id: 'unstrung_oak_shortbow',
    name: 'Unstrung Oak Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_oak_shortbow.png',
    level: 5,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  oak_shortbow: {
    id: 'oak_shortbow',
    name: 'Oak Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/oak_shortbow.png',
    level: 5,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_oak_longbow: {
    id: 'unstrung_oak_longbow',
    name: 'Unstrung Oak Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_oak_longbow.png',
    level: 5,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  oak_longbow: {
    id: 'oak_longbow',
    name: 'Oak Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/oak_longbow.png',
    level: 5,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_willow_shortbow: {
    id: 'unstrung_willow_shortbow',
    name: 'Unstrung Willow Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_willow_shortbow.png',
    level: 10,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  willow_shortbow: {
    id: 'willow_shortbow',
    name: 'Willow Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/willow_shortbow.png',
    level: 10,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_willow_longbow: {
    id: 'unstrung_willow_longbow',
    name: 'Unstrung Willow Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_willow_longbow.png',
    level: 10,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  willow_longbow: {
    id: 'willow_longbow',
    name: 'Willow Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/willow_longbow.png',
    level: 10,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_maple_shortbow: {
    id: 'unstrung_maple_shortbow',
    name: 'Unstrung Maple Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_maple_shortbow.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  maple_shortbow: {
    id: 'maple_shortbow',
    name: 'Maple Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/maple_shortbow.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_maple_longbow: {
    id: 'unstrung_maple_longbow',
    name: 'Unstrung Maple Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_maple_longbow.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  maple_longbow: {
    id: 'maple_longbow',
    name: 'Maple Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/maple_longbow.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_yew_shortbow: {
    id: 'unstrung_yew_shortbow',
    name: 'Unstrung Yew Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_yew_shortbow.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  yew_shortbow: {
    id: 'yew_shortbow',
    name: 'Yew Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/yew_shortbow.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_yew_longbow: {
    id: 'unstrung_yew_longbow',
    name: 'Unstrung Yew Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_yew_longbow.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  yew_longbow: {
    id: 'yew_longbow',
    name: 'Yew Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/yew_longbow.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_magic_shortbow: {
    id: 'unstrung_magic_shortbow',
    name: 'Unstrung Magic Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_magic_shortbow.png',
    level: 50,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  magic_shortbow: {
    id: 'magic_shortbow',
    name: 'Magic Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/magic_shortbow.png',
    level: 50,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_magic_longbow: {
    id: 'unstrung_magic_longbow',
    name: 'Unstrung Magic Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_magic_longbow.png',
    level: 50,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  magic_longbow: {
    id: 'magic_longbow',
    name: 'Magic Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/magic_longbow.png',
    level: 50,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_redwood_shortbow: {
    id: 'unstrung_redwood_shortbow',
    name: 'Unstrung Redwood Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_redwood_shortbow.png',
    level: 60,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  redwood_shortbow: {
    id: 'redwood_shortbow',
    name: 'Redwood Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/redwood_shortbow.png',
    level: 60,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_redwood_longbow: {
    id: 'unstrung_redwood_longbow',
    name: 'Unstrung Redwood Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_redwood_longbow.png',
    level: 60,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  redwood_longbow: {
    id: 'redwood_longbow',
    name: 'Redwood Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/redwood_longbow.png',
    level: 60,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_teak_shortbow: {
    id: 'unstrung_teak_shortbow',
    name: 'Unstrung Teak Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_teak_shortbow.png',
    level: 35,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  teak_shortbow: {
    id: 'teak_shortbow',
    name: 'Teak Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/teak_shortbow.png',
    level: 35,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_teak_longbow: {
    id: 'unstrung_teak_longbow',
    name: 'Unstrung Teak Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_teak_longbow.png',
    level: 35,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  teak_longbow: {
    id: 'teak_longbow',
    name: 'Teak Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/teak_longbow.png',
    level: 35,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_mahogany_shortbow: {
    id: 'unstrung_mahogany_shortbow',
    name: 'Unstrung Mahogany Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_mahogany_shortbow.png',
    level: 45,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  mahogany_shortbow: {
    id: 'mahogany_shortbow',
    name: 'Mahogany Shortbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/mahogany_shortbow.png',
    level: 45,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  unstrung_mahogany_longbow: {
    id: 'unstrung_mahogany_longbow',
    name: 'Unstrung Mahogany Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/unstrung_mahogany_longbow.png',
    level: 45,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
  mahogany_longbow: {
    id: 'mahogany_longbow',
    name: 'Mahogany Longbow',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/mahogany_longbow.png',
    level: 45,
    slot: EQUIPMENT_SLOTS.WEAPON,
  },
};

// Helper functions
export const getItemById = (id: string): Item | undefined => ITEMS[id];

export const getItemsByCategory = (category: string): Item[] => {
  return Object.values(ITEMS).filter(item => item.category === category);
};

export const getToolTier = (itemId: string): number => {
  const toolTier = TOOL_TIERS[itemId as keyof typeof TOOL_TIERS];
  return toolTier?.level || 0;
};

export const isEquippable = (item: Item): boolean => {
  return item.type === 'tool';
};

export const meetsLevelRequirement = (item: Item, playerLevel: number): boolean => {
  if (!item.level) return true;
  const cappedLevel = capLevelRequirement(item.level);
  return playerLevel >= cappedLevel;
};

// Returns the required skill and level for equipping an item, or null if no requirement
export function getEquipmentLevelRequirement(item: Item): { skill: SkillName, level: number } | null {
  if (!item || !item.slot) return null;
  const name = item.id.toLowerCase();
  // Melee weapons
  if (item.slot === 'weapon') {
    if (name.includes('sword') || name.includes('scimitar') || name.includes('mace') || name.includes('axe') || name.includes('warhammer') || name.includes('longsword') || name.includes('battleaxe')) {
      if (name.includes('bronze') || name.includes('iron')) return { skill: 'attack', level: 1 };
      if (name.includes('steel')) return { skill: 'attack', level: 5 };
      if (name.includes('mithril')) return { skill: 'attack', level: 20 };
      if (name.includes('adamant')) return { skill: 'attack', level: 30 };
      if (name.includes('rune')) return { skill: 'attack', level: 40 };
      if (name.includes('dragon')) return { skill: 'attack', level: 60 };
    }
    // Ranged weapons (bows)
    if (name.includes('bow')) {
      if (name.includes('oak')) return { skill: 'ranged', level: 5 };
      if (name.includes('willow')) return { skill: 'ranged', level: 20 };
      if (name.includes('maple')) return { skill: 'ranged', level: 30 };
      if (name.includes('yew')) return { skill: 'ranged', level: 40 };
      if (name.includes('magic')) return { skill: 'ranged', level: 50 };
      // Default for regular bows
      return { skill: 'ranged', level: 1 };
    }
    // Magic staves: no requirement
    if (name.includes('staff')) return null;
  }
  // Melee armor
  if (item.slot === 'head' || item.slot === 'body' || item.slot === 'legs' || item.slot === 'shield' || item.slot === 'feet' || item.slot === 'hands') {
    if (name.includes('bronze') || name.includes('iron')) return { skill: 'defence', level: 1 };
    if (name.includes('steel')) return { skill: 'defence', level: 5 };
    if (name.includes('mithril')) return { skill: 'defence', level: 20 };
    if (name.includes('adamant')) return { skill: 'defence', level: 30 };
    if (name.includes('rune')) return { skill: 'defence', level: 40 };
    if (name.includes('dragon')) return { skill: 'defence', level: 60 };
  }
  // Ranged and magic armor not implemented yet
  return null;
} 