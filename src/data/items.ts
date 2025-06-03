import type { Item, ItemType, ItemStats } from '../types/game';
import { capLevelRequirement } from '../types/game';

// Import images
import normalLogImg from '../assets/ItemThumbnail/Woodcutting/Normal_Log.png';
import oakLogImg from '../assets/ItemThumbnail/Woodcutting/Oak_Log.png';
import willowLogImg from '../assets/ItemThumbnail/Woodcutting/Willow_Log.png';
import mapleLogImg from '../assets/ItemThumbnail/Woodcutting/Maple_Log.png';
import yewLogImg from '../assets/ItemThumbnail/Woodcutting/Yew_Log.png';
import magicLogImg from '../assets/ItemThumbnail/Woodcutting/Magic_Log.png';
import redwoodLogImg from '../assets/ItemThumbnail/Woodcutting/RedWood_Log.png';
import coinsImg from '../assets/ItemThumbnail/Div/Coins.png';

// Mining images
import copperOreImg from '../assets/ItemThumbnail/Mining/Copper_Ore.png';
import tinOreImg from '../assets/ItemThumbnail/Mining/Tin_Ore.png';
import ironOreImg from '../assets/ItemThumbnail/Mining/Iron_Ore.png';
import silverOreImg from '../assets/ItemThumbnail/Mining/Silver_Ore.png';
import goldOreImg from '../assets/ItemThumbnail/Mining/Gold_Ore.png';
import mithrilOreImg from '../assets/ItemThumbnail/Mining/Mithril_Ore.png';
import adamantOreImg from '../assets/ItemThumbnail/Mining/Adamant_Ore.png';
import runeOreImg from '../assets/ItemThumbnail/Mining/Rune_Ore.png';
import coalOreImg from '../assets/ItemThumbnail/Mining/Coal_Ore.png';

// Item Categories
export const ITEM_CATEGORIES = {
  TOOLS: 'Tools',
  WEAPONS: 'Weapons',
  ARMOR: 'Armor',
  RESOURCES: 'Resources',
  CONSUMABLES: 'Consumables',
  CURRENCY: 'Currency'
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

// Smithing item template for generating items of different metal types
const SMITHING_ITEMS_TEMPLATE = [
  { id: 'dagger', name: 'Dagger', levelOver: 0, bars: 1, type: 'weapon' },
  { id: 'axe', name: 'Axe', levelOver: 0, bars: 1, type: 'weapon' },
  { id: 'mace', name: 'Mace', levelOver: 1, bars: 1, type: 'weapon' },
  { id: 'medium_helm', name: 'Medium Helm', levelOver: 2, bars: 1, type: 'armor' },
  { id: 'bolts_unf', name: 'Unfinished Bolts', levelOver: 2, bars: 1, type: 'ammo' },
  { id: 'sword', name: 'Sword', levelOver: 3, bars: 1, type: 'weapon' },
  { id: 'dart_tips', name: 'Dart Tips', levelOver: 3, bars: 1, type: 'ammo' },
  { id: 'nails', name: 'Nails', levelOver: 3, bars: 1, type: 'resource' },
  { id: 'scimitar', name: 'Scimitar', levelOver: 4, bars: 2, type: 'weapon' },
  { id: 'spear', name: 'Spear', levelOver: 4, bars: 1, type: 'weapon' },
  { id: 'arrowtips', name: 'Arrowtips', levelOver: 4, bars: 1, type: 'ammo' },
  { id: 'crossbow_limbs', name: 'Crossbow Limbs', levelOver: 5, bars: 1, type: 'resource' },
  { id: 'longsword', name: 'Longsword', levelOver: 5, bars: 2, type: 'weapon' },
  { id: 'javelin_heads', name: 'Javelin Heads', levelOver: 5, bars: 1, type: 'ammo' },
  { id: 'full_helm', name: 'Full Helm', levelOver: 6, bars: 2, type: 'armor' },
  { id: 'throwing_knives', name: 'Throwing Knives', levelOver: 6, bars: 1, type: 'ammo' },
  { id: 'square_shield', name: 'Square Shield', levelOver: 7, bars: 2, type: 'armor' },
  { id: 'warhammer', name: 'Warhammer', levelOver: 8, bars: 3, type: 'weapon' },
  { id: 'battleaxe', name: 'Battleaxe', levelOver: 9, bars: 3, type: 'weapon' },
  { id: 'chainbody', name: 'Chainbody', levelOver: 10, bars: 3, type: 'armor' },
  { id: 'kiteshield', name: 'Kiteshield', levelOver: 11, bars: 3, type: 'armor' },
  { id: 'claws', name: 'Claws', levelOver: 12, bars: 2, type: 'weapon' },
  { id: 'two_handed_sword', name: 'Two-handed Sword', levelOver: 13, bars: 3, type: 'weapon' },
  { id: 'platelegs', name: 'Platelegs', levelOver: 13, bars: 3, type: 'armor' },
  { id: 'plateskirt', name: 'Plateskirt', levelOver: 13, bars: 3, type: 'armor' },
  { id: 'platebody', name: 'Platebody', levelOver: 14, bars: 5, type: 'armor' }
] as const;

// Function to generate all smithing items for a metal type
const generateSmithingItems = (metalType: keyof typeof SMITHING_BASE_LEVELS): Record<string, Item> => {
  const items: Record<string, Item> = {};
  
  SMITHING_ITEMS_TEMPLATE.forEach(template => {
    const itemId = `${metalType}_${template.id}`;
    const level = getSmithingLevel(metalType, template.levelOver);
    const { buyPrice, sellPrice } = calculateSmithingItemPrice(metalType, template.bars);
    
    // Calculate stats based on metal type and item type
    const baseStats = METAL_PRICE_MULTIPLIERS[metalType];
    const stats: ItemStats = template.type === 'weapon' 
      ? { attack: baseStats } 
      : template.type === 'armor' 
        ? { defence: baseStats }
        : {};

    items[itemId] = {
      id: itemId,
      name: `${metalType.charAt(0).toUpperCase() + metalType.slice(1)} ${template.name}`,
      type: template.type === 'ammo' || template.type === 'resource' ? 'resource' : 'tool',
      level,
      stats,
      category: template.type === 'weapon' 
        ? ITEM_CATEGORIES.WEAPONS 
        : template.type === 'armor' 
          ? ITEM_CATEGORIES.ARMOR 
          : ITEM_CATEGORIES.RESOURCES,
      slot: template.type === 'armor' 
        ? template.id === 'platebody' 
          ? EQUIPMENT_SLOTS.BODY
          : template.id === 'platelegs' || template.id === 'plateskirt'
            ? EQUIPMENT_SLOTS.LEGS
            : template.id === 'full_helm' || template.id === 'medium_helm'
              ? EQUIPMENT_SLOTS.HEAD
              : EQUIPMENT_SLOTS.SHIELD
        : template.type === 'weapon'
          ? EQUIPMENT_SLOTS.WEAPON
          : undefined,
      icon: '/assets/items/placeholder.png',
      buyPrice,
      sellPrice,
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
  // Currency
  coins: {
    id: 'coins',
    name: 'Coins',
    type: 'currency',
    category: ITEM_CATEGORIES.CURRENCY,
    icon: coinsImg,
    buyPrice: 1,
    sellPrice: 1,
  },

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
  mithril_pickaxe: {
    id: 'mithril_pickaxe',
    name: 'Mithril Pickaxe',
    type: 'tool',
    level: 30,
    stats: { mining: 4 },
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/items/mithril_pickaxe.png',
    buyPrice: 1000,
    sellPrice: 400,
  },
  adamant_pickaxe: {
    id: 'adamant_pickaxe',
    name: 'Adamant Pickaxe',
    type: 'tool',
    level: 40,
    stats: { mining: 5 },
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/items/adamant_pickaxe.png',
    buyPrice: 2000,
    sellPrice: 800,
  },
  rune_pickaxe: {
    id: 'rune_pickaxe',
    name: 'Rune Pickaxe',
    type: 'tool',
    level: 50,
    stats: { mining: 6 },
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/items/rune_pickaxe.png',
    buyPrice: 4000,
    sellPrice: 1600,
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
    stats: { attack: 1 },
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
    stats: { attack: 3 },
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
    stats: { attack: 2 },
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
    stats: { attack: 2 },
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
    stats: { attack: 6 },
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
    stats: { attack: 4 },
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
    stats: { attack: 3 },
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
    stats: { attack: 9 },
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
    stats: { attack: 6 },
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
    stats: { attack: 4 },
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
    stats: { attack: 12 },
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
    stats: { attack: 8 },
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
    stats: { attack: 5 },
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
    stats: { attack: 15 },
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
    stats: { attack: 10 },
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
    stats: { attack: 6 },
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
    stats: { attack: 18 },
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
    stats: { attack: 12 },
    category: ITEM_CATEGORIES.ARMOR,
    slot: EQUIPMENT_SLOTS.LEGS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 9600,
    sellPrice: 3840,
  },
  ...SMITHING_ITEMS,
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
  return item.type === 'tool';
};

export const getEquipmentSlot = (item: Item): string | undefined => {
  if (!isEquippable(item)) return undefined;
  return item.slot;
};

export const meetsLevelRequirement = (item: Item, playerLevel: number): boolean => {
  if (!item.level) return true;
  const cappedLevel = capLevelRequirement(item.level);
  return playerLevel >= cappedLevel;
}; 