import type { Item, ItemType, ItemStats, CombatStats, SkillName } from '../types/game';
import { capLevelRequirement } from '../types/game';
import { combineStats, BRONZE_TOOL_STATS, IRON_TOOL_STATS, STEEL_TOOL_STATS, MITHRIL_TOOL_STATS, ADAMANT_TOOL_STATS, RUNE_TOOL_STATS, DRAGON_TOOL_STATS } from './combatStats';

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
  SMITHING: 'Smithing',
  RUNES: 'Runes',
  FARMING: 'Farming',
  HERBLORE: 'Herblore',
  JEWELRY: 'Jewelry',
  CRAFTING: 'Crafting'
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
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/bronze_pickaxe.png',
    stats: { mining: 1 }
  },
  iron_pickaxe: {
    name: 'Iron Pickaxe',
    level: 10,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/iron_pickaxe.png',
    stats: { mining: 2 }
  },
  steel_pickaxe: {
    name: 'Steel Pickaxe',
    level: 20,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/steel_pickaxe.png',
    stats: { mining: 3 }
  },
  mithril_pickaxe: {
    name: 'Mithril Pickaxe',
    level: 30,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/mithril_pickaxe.png',
    stats: { mining: 4 }
  },
  adamant_pickaxe: {
    name: 'Adamant Pickaxe',
    level: 40,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/adamant_pickaxe.png',
    stats: { mining: 5 }
  },
  rune_pickaxe: {
    name: 'Rune Pickaxe',
    level: 50,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/rune_pickaxe.png',
    stats: { mining: 6 }
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
  rune: 32,
  dragon: 64
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
  { id: 'spear', name: 'Spear', levelOver: 4, bars: 1, type: 'weapon', weaponType: 'spear' },
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

export const getEquipmentSlot = (template: SmithingTemplate): string => {
  if (template.armorType) {
    if (template.armorType.includes('helm')) return EQUIPMENT_SLOTS.HEAD;
    if (template.armorType.includes('body')) return EQUIPMENT_SLOTS.BODY;
    if (template.armorType.includes('legs') || template.armorType.includes('skirt')) return EQUIPMENT_SLOTS.LEGS;
    if (template.armorType.includes('shield')) return EQUIPMENT_SLOTS.SHIELD;
  }
  return EQUIPMENT_SLOTS.WEAPON;
};

// Items that are defined statically and should not be generated
const STATIC_SMITHING_ITEMS = [
  'bronze_medium_helm', 'iron_medium_helm', 'steel_medium_helm', 'mithril_medium_helm', 'adamant_medium_helm', 'rune_medium_helm', 'dragon_medium_helm',
  'steel_full_helm', 'mithril_full_helm',
  'iron_kiteshield', 'mithril_kiteshield',
  'iron_platelegs', 'steel_platelegs', 'mithril_platelegs',
  'iron_platebody', 'steel_platebody', 'mithril_platebody'
];

const generateSmithingItems = (metalType: string) => {
  const items: Record<string, Item> = {};
  const metalTier = getMetalTier(metalType);
  
  SMITHING_TEMPLATES.forEach(template => {
    const itemId = `${metalType}_${template.id}`;
    
    // Skip items that are defined statically
    if (STATIC_SMITHING_ITEMS.includes(itemId)) {
      return;
    }
    
    const itemName = `${capitalize(metalType)} ${template.name}`;
    const level = getSmithingLevel(metalType as keyof typeof SMITHING_BASE_LEVELS, template.levelOver);
    const { buyPrice, sellPrice } = calculateSmithingItemPrice(metalType as keyof typeof METAL_PRICE_MULTIPLIERS, template.bars);

    const baseStats = createDefaultCombatStats();
    let combatStats: CombatStats;

    if (template.type === 'weapon') {
      combatStats = combineStats(baseStats, {
        attackStab: metalTier * 5,
        attackSlash: metalTier * 5,
        attackCrush: metalTier * 5,
        strengthMelee: metalTier * 3,
      });
    } else if (template.type === 'armor') {
      combatStats = combineStats(baseStats, {
        defenceStab: metalTier * 10,
        defenceSlash: metalTier * 10,
        defenceCrush: metalTier * 10,
      });
    } else {
      combatStats = baseStats;
    }

    // Generate icon path based on item type
    let iconPath = '/assets/items/placeholder.png';
    
    if (template.type === 'weapon' && template.weaponType) {
      // Map weapon types to directory names
      const weaponTypeMap: Record<string, string> = {
        'sword': 'sword',
        'longsword': 'longsword',
        'scimitar': 'scimitar',
        'dagger': 'dagger',
        'mace': 'mace',
        'battleaxe': 'battleaxe',
        'axe': 'axe',
        'pickaxe': 'pickaxe',
        'two_handed_sword': '2h_sword',
        'spear': 'spear',
        'bow': 'bow',
        'staff': 'staff',
        'warhammer': 'warhammer'
      };
      
      const weaponDir = weaponTypeMap[template.weaponType] || template.weaponType;
      iconPath = `/assets/ItemThumbnail/Gear/Weapons/${weaponDir}/${metalType}_${template.weaponType}.png`;
    } else if (template.type === 'armor' && template.armorType) {
      // Map armor types to directory names
      const armorDirMap: Record<string, string> = {
        'medium_helm': 'Med_helm',
        'full_helm': 'Full_helm',
        'chainbody': 'Chainbody',
        'platebody': 'Platebody',
        'platelegs': 'Platelegs',
        'plateskirt': 'Plateskirt',
        'kiteshield': 'Kiteshield',
        'square_shield': 'Square_shield',
        'boots': 'Boots'
      };
      const armorDir = armorDirMap[template.armorType] || template.armorType;
      iconPath = `/assets/ItemThumbnail/Gear/${armorDir}/${metalType}_${template.armorType}.png`;
    }
    
    items[itemId] = {
      id: itemId,
      name: itemName,
      type: template.type as ItemType,
      category: ITEM_CATEGORIES.SMITHING,
      icon: iconPath,
      level: level,
      buyPrice: buyPrice,
      sellPrice: sellPrice,
      slot: template.type === 'weapon' || template.type === 'armor' ? getEquipmentSlot(template) : undefined,
      stats: combatStats,
      speed: template.speed,
    };
  });
  
  return items;
};

export const ITEMS: Record<string, Item> = {
  // --- Static Items ---
  coins: {
    id: 'coins',
    name: 'Coins',
    type: 'currency',
    category: ITEM_CATEGORIES.CURRENCY,
    icon: '/assets/ItemThumbnail/Div/coins.png'
  },

  // Tools - Woodcutting
  bronze_axe: {
    id: 'bronze_axe',
    name: 'Bronze Axe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/axe/bronze_axe.png',
    level: 1,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { woodcutting: 1 }
  },
  iron_axe: {
    id: 'iron_axe',
    name: 'Iron Axe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/axe/iron_axe.png',
    level: 10,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { woodcutting: 2 }
  },
  steel_axe: {
    id: 'steel_axe',
    name: 'Steel Axe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/axe/steel_axe.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { woodcutting: 3 }
  },
  mithril_axe: {
    id: 'mithril_axe',
    name: 'Mithril Axe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/axe/mithril_axe.png',
    level: 30,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { woodcutting: 4 }
  },
  adamant_axe: {
    id: 'adamant_axe',
    name: 'Adamant Axe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/axe/adamant_axe.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { woodcutting: 5 }
  },
  rune_axe: {
    id: 'rune_axe',
    name: 'Rune Axe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/axe/rune_axe.png',
    level: 50,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { woodcutting: 6 }
  },

  // Tools - Fishing
  small_fishing_net: {
    id: 'small_fishing_net',
    name: 'Small Fishing Net',
    type: 'tool',
    level: 1,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.TOOL,
    stats: { fishing: 1 },
    icon: '/assets/ItemThumbnail/Div/small_fishing_net.png'
  },
  big_fishing_net: {
    id: 'big_fishing_net',
    name: 'Big Fishing Net',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.TOOL,
    icon: '/assets/ItemThumbnail/Div/big_fishing_net.png',
  },
  fishing_rod: {
    id: 'fishing_rod',
    name: 'Fishing Rod',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.TOOL,
    icon: '/assets/ItemThumbnail/Div/fishing_rod.png',
  },
  fly_fishing_rod: {
    id: 'fly_fishing_rod',
    name: 'Fly Fishing Rod',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.TOOL,
    icon: '/assets/ItemThumbnail/Div/fly_fishing_rod.png',
  },
  harpoon: {
    id: 'harpoon',
    name: 'Harpoon',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.TOOL,
    icon: '/assets/ItemThumbnail/Div/harpoon.png',
  },
  lobster_pot: {
    id: 'lobster_pot',
    name: 'Lobster Pot',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.TOOL,
    icon: '/assets/ItemThumbnail/Div/lobster_pot.png',
  },
  feather: {
    id: 'feather',
    name: 'Feather',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Div/feather.png',
  },
  raw_chicken: {
    id: 'raw_chicken',
    name: 'Raw Chicken',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },

  // Thieving items
  bread: {
    id: 'bread',
    name: 'Bread',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 3,
    sellPrice: 1
  },
  beer: {
    id: 'beer',
    name: 'Beer',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 5,
    sellPrice: 2
  },
  wine: {
    id: 'wine',
    name: 'Wine',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 15,
    sellPrice: 5
  },
  lockpick: {
    id: 'lockpick',
    name: 'Lockpick',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 20,
    sellPrice: 8
  },
  lantern: {
    id: 'lantern',
    name: 'Lantern',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 25,
    sellPrice: 10
  },
  silk: {
    id: 'silk',
    name: 'Silk',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 40,
    sellPrice: 15
  },
  garlic: {
    id: 'garlic',
    name: 'Garlic',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 8,
    sellPrice: 3
  },
  crystal_shard: {
    id: 'crystal_shard',
    name: 'Crystal Shard',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 500,
    sellPrice: 200
  },
  obsidian_shard: {
    id: 'obsidian_shard',
    name: 'Obsidian Shard',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 300,
    sellPrice: 120
  },
  raw_fish: {
    id: 'raw_fish',
    name: 'Raw Fish',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 10,
    sellPrice: 4
  },
  fruit_tree_seed: {
    id: 'fruit_tree_seed',
    name: 'Fruit Tree Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 200,
    sellPrice: 80
  },

  // Tools - Mining
  bronze_pickaxe: {
    id: 'bronze_pickaxe',
    name: 'Bronze Pickaxe',
    type: 'tool',
    level: 1,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { mining: 1 },
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/bronze_pickaxe.png'
  },
  iron_pickaxe: {
    id: 'iron_pickaxe',
    name: 'Iron Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/iron_pickaxe.png',
    level: 10,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { mining: 2 }
  },
  steel_pickaxe: {
    id: 'steel_pickaxe',
    name: 'Steel Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/steel_pickaxe.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { mining: 3 }
  },
  mithril_pickaxe: {
    id: 'mithril_pickaxe',
    name: 'Mithril Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/mithril_pickaxe.png',
    level: 30,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { mining: 4 }
  },
  adamant_pickaxe: {
    id: 'adamant_pickaxe',
    name: 'Adamant Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/adamant_pickaxe.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { mining: 5 }
  },
  rune_pickaxe: {
    id: 'rune_pickaxe',
    name: 'Rune Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/rune_pickaxe.png',
    level: 50,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { mining: 6 }
  },

  // Resources - Ores
  copper_ore: {
    id: 'copper_ore',
    name: 'Copper Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Copper_Ore.png',
    buyPrice: 15,
    sellPrice: 10,
  },
  tin_ore: {
    id: 'tin_ore',
    name: 'Tin Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Tin_Ore.png',
    buyPrice: 20,
    sellPrice: 15,
  },
  iron_ore: {
    id: 'iron_ore',
    name: 'Iron Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Iron_Ore.png',
    buyPrice: 35,
    sellPrice: 25,
  },
  silver_ore: {
    id: 'silver_ore',
    name: 'Silver Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Silver_Ore.png',
    buyPrice: 50,
    sellPrice: 35,
  },
  gold_ore: {
    id: 'gold_ore',
    name: 'Gold Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Gold_Ore.png',
    buyPrice: 80,
    sellPrice: 60,
  },
  mithril_ore: {
    id: 'mithril_ore',
    name: 'Mithril Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Mithril_Ore.png',
    buyPrice: 150,
    sellPrice: 120,
  },
  adamantite_ore: {
    id: 'adamantite_ore',
    name: 'Adamantite Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Adamant_Ore.png',
    buyPrice: 300,
    sellPrice: 240,
  },
  runite_ore: {
    id: 'runite_ore',
    name: 'Runite Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Rune_Ore.png',
    buyPrice: 800,
    sellPrice: 640,
  },
  coal_ore: {
    id: 'coal_ore',
    name: 'Coal Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Coal_Ore.png',
    buyPrice: 25,
    sellPrice: 20,
  },
  pure_essence: {
    id: 'pure_essence',
    name: 'Pure Essence',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Pure_Essence.png',
    buyPrice: 15,
    sellPrice: 10,
  },
  coal: {
    id: 'coal',
    name: 'Coal',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Coal_Ore.png',
    buyPrice: 25,
    sellPrice: 20,
  },

  // Resources - Bars
  bronze_bar: {
    id: 'bronze_bar',
    name: 'Bronze Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Smithing/Bronze_Bar.png',
  },
  iron_bar: {
    id: 'iron_bar',
    name: 'Iron Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Smithing/Iron_Bar.png',
  },
  silver_bar: {
    id: 'silver_bar',
    name: 'Silver Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Smithing/Silver_Bar.png',
  },
  steel_bar: {
    id: 'steel_bar',
    name: 'Steel Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Smithing/Steel_Bar.png',
  },
  gold_bar: {
    id: 'gold_bar',
    name: 'Gold Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Smithing/Gold_Bar.png',
  },
  mithril_bar: {
    id: 'mithril_bar',
    name: 'Mithril Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Smithing/Mithril_Bar.png',
  },
  adamant_bar: {
    id: 'adamant_bar',
    name: 'Adamant Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Smithing/Adamant_Bar.png',
  },
  runite_bar: {
    id: 'runite_bar',
    name: 'Runite Bar',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Smithing/Runite_Bar.png',
  },

  // Resources - Logs (Updated with correct image paths)
  logs: {
    id: 'logs',
    name: 'Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/normal_log.png',
    buyPrice: 10,
    sellPrice: 4
  },
  normal_logs: {
    id: 'normal_logs',
    name: 'Normal Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/normal_log.png',
    buyPrice: 10,
    sellPrice: 4
  },
  oak_logs: {
    id: 'oak_logs',
    name: 'Oak Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/oak_log.png',
    buyPrice: 25,
    sellPrice: 10
  },
  willow_logs: {
    id: 'willow_logs',
    name: 'Willow Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/willow_log.png',
    buyPrice: 50,
    sellPrice: 20
  },
  maple_logs: {
    id: 'maple_logs',
    name: 'Maple Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/maple_log.png',
    buyPrice: 100,
    sellPrice: 40
  },
  yew_logs: {
    id: 'yew_logs',
    name: 'Yew Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/yew_log.png',
    buyPrice: 200,
    sellPrice: 80
  },
  magic_logs: {
    id: 'magic_logs',
    name: 'Magic Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/magic_log.png',
    buyPrice: 500,
    sellPrice: 200
  },
  redwood_logs: {
    id: 'redwood_logs',
    name: 'Redwood Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/redwood_log.png',
    buyPrice: 1000,
    sellPrice: 400
  },
  teak_logs: {
    id: 'teak_logs',
    name: 'Teak Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/teak_log.png',
    buyPrice: 150,
    sellPrice: 60
  },
  mahogany_logs: {
    id: 'mahogany_logs',
    name: 'Mahogany Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/mahogany_log.png',
    buyPrice: 300,
    sellPrice: 120
  },

  // Resources - Fishing
  raw_shrimp: {
    id: 'raw_shrimp',
    name: 'Raw Shrimp',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/raw_shrimp.png',
  },
  raw_anchovy: {
    id: 'raw_anchovy',
    name: 'Raw Anchovy',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  raw_trout: {
    id: 'raw_trout',
    name: 'Raw Trout',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/raw_trout.png',
  },
  raw_herring: {
    id: 'raw_herring',
    name: 'Raw Herring',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/raw_herring.png',
  },
  raw_pike: {
    id: 'raw_pike',
    name: 'Raw Pike',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Pike.png',
  },
  raw_salmon: {
    id: 'raw_salmon',
    name: 'Raw Salmon',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Salmon.png',
  },
  raw_tuna: {
    id: 'raw_tuna',
    name: 'Raw Tuna',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Tuna.png',
  },
  raw_lobster: {
    id: 'raw_lobster',
    name: 'Raw Lobster',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Lobster.png',
  },
  raw_bass: {
    id: 'raw_bass',
    name: 'Raw Bass',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Bass.png',
  },
  raw_swordfish: {
    id: 'raw_swordfish',
    name: 'Raw Swordfish',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/raw swordfish.png',
  },
  raw_monkfish: {
    id: 'raw_monkfish',
    name: 'Raw Monkfish',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Monkfish.png',
  },
  raw_shark: {
    id: 'raw_shark',
    name: 'Raw Shark',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Shark.png',
  },
  raw_anglerfish: {
    id: 'raw_anglerfish',
    name: 'Raw Anglerfish',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Anglerfish.png',
  },
  raw_dark_crab: {
    id: 'raw_dark_crab',
    name: 'Raw Dark Crab',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/raw_dark_carb.png',
  },
  raw_sardine: {
    id: 'raw_sardine',
    name: 'Raw Sardine',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/raw_sardine.png',
  },

  // Cooked Food
  cooked_meat: {
    id: 'cooked_meat',
    name: 'Cooked Meat',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Meat.png',
    healing: 3,
  },
  cooked_chicken: {
    id: 'cooked_chicken',
    name: 'Cooked Chicken',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Chicken.png',
    healing: 3,
  },
  cooked_shrimp: {
    id: 'cooked_shrimp',
    name: 'Cooked Shrimp',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/shrimp.png',
    healing: 3,
  },
  cooked_sardine: {
    id: 'cooked_sardine',
    name: 'Cooked Sardine',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/sardine.png',
    healing: 4,
  },
  cooked_herring: {
    id: 'cooked_herring',
    name: 'Cooked Herring',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/herring.png',
    healing: 5,
  },
  cooked_trout: {
    id: 'cooked_trout',
    name: 'Cooked Trout',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/trout.png',
    healing: 7,
  },
  cooked_pike: {
    id: 'cooked_pike',
    name: 'Cooked Pike',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/pike.png',
    healing: 8,
  },
  cooked_salmon: {
    id: 'cooked_salmon',
    name: 'Cooked Salmon',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/salmon.png',
    healing: 9,
  },
  cooked_tuna: {
    id: 'cooked_tuna',
    name: 'Cooked Tuna',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/tuna.png',
    healing: 10,
  },
  cooked_lobster: {
    id: 'cooked_lobster',
    name: 'Cooked Lobster',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/lobster.png',
    healing: 12,
  },
  cooked_bass: {
    id: 'cooked_bass',
    name: 'Cooked Bass',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/bass.png',
    healing: 13,
  },
  cooked_swordfish: {
    id: 'cooked_swordfish',
    name: 'Cooked Swordfish',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/swordfish.png',
    healing: 14,
  },
  cooked_monkfish: {
    id: 'cooked_monkfish',
    name: 'Cooked Monkfish',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/monkfish.png',
    healing: 16,
  },
  cooked_shark: {
    id: 'cooked_shark',
    name: 'Cooked Shark',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/shark.png',
    healing: 20,
  },
  cooked_anglerfish: {
    id: 'cooked_anglerfish',
    name: 'Cooked Anglerfish',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/anglerfish.png',
    healing: 21,
  },
  cooked_dark_crab: {
    id: 'cooked_dark_crab',
    name: 'Cooked Dark Crab',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/dark_crab.png',
    healing: 22,
  },

  // Firemaking Products
  ashes: {
    id: 'ashes',
    name: 'Ashes',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Herblore/secondaries/ashes.png',
  },

  bones: {
    id: 'bones',
    name: 'Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Div/bones.png',
  },
  egg: {
    id: 'egg',
    name: 'Egg',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  water_rune: {
    id: 'water_rune',
    name: 'Water Rune',
    type: 'resource',
    category: ITEM_CATEGORIES.RUNES,
    icon: '/assets/ItemThumbnail/Runecrafting/water_rune.png',
  },
  earth_rune: {
    id: 'earth_rune',
    name: 'Earth Rune',
    type: 'resource',
    category: ITEM_CATEGORIES.RUNES,
    icon: '/assets/ItemThumbnail/Runecrafting/earth_rune.png',
  },
  cosmic_rune: {
    id: 'cosmic_rune',
    name: 'Cosmic Rune',
    type: 'resource',
    category: ITEM_CATEGORIES.RUNES,
    icon: '/assets/ItemThumbnail/Runecrafting/cosmic_rune.png',
  },
  big_bones: {
    id: 'big_bones',
    name: 'Big Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Div/big_bones.png',
  },
  dragon_bones: {
    id: 'dragon_bones',
    name: 'Dragon Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  bat_bones: {
    id: 'bat_bones',
    name: 'Bat Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  burnt_bones: {
    id: 'burnt_bones',
    name: 'Burnt Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  wolf_bones: {
    id: 'wolf_bones',
    name: 'Wolf Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  monkey_bones: {
    id: 'monkey_bones',
    name: 'Monkey Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  dagannoth_bones: {
    id: 'dagannoth_bones',
    name: 'Dagannoth Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  wyvern_bones: {
    id: 'wyvern_bones',
    name: 'Wyvern Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  lava_dragon_bones: {
    id: 'lava_dragon_bones',
    name: 'Lava Dragon Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  babydragon_bones: {
    id: 'babydragon_bones',
    name: 'Babydragon Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  superior_dragon_bones: {
    id: 'superior_dragon_bones',
    name: 'Superior Dragon Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    type: 'resource',
    category: ITEM_CATEGORIES.MISC,
    icon: '/assets/ItemThumbnail/Combat/goblin.png',
  },

  // --- Generated Smithing Items ---
  ...generateSmithingItems('bronze'),
  ...generateSmithingItems('iron'),
  ...generateSmithingItems('steel'),
  ...generateSmithingItems('mithril'),
  ...generateSmithingItems('adamant'),
  ...generateSmithingItems('rune'),

  // Harvested crops
  potato: {
    id: 'potato',
    name: 'Potato',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 8,
    sellPrice: 2
  },
  onion: {
    id: 'onion',
    name: 'Onion',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 10,
    sellPrice: 2
  },
  cabbage: {
    id: 'cabbage',
    name: 'Cabbage',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 12,
    sellPrice: 3
  },
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 15,
    sellPrice: 4
  },
  sweetcorn: {
    id: 'sweetcorn',
    name: 'Sweetcorn',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 20,
    sellPrice: 5
  },
  strawberry: {
    id: 'strawberry',
    name: 'Strawberry',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 30,
    sellPrice: 7
  },
  watermelon: {
    id: 'watermelon',
    name: 'Watermelon',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 40,
    sellPrice: 10
  },

  bow_string: {
    id: 'bow_string',
    name: 'Bow String',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 30,
    sellPrice: 8
  },

  feathers: {
    id: 'feathers',
    name: 'Feathers',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Div/feather.png',
    buyPrice: 2,
    sellPrice: 1
  },
  iron_arrows: {
    id: 'iron_arrows',
    name: 'Iron Arrows',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 10,
    sellPrice: 2
  },
  bronze_boots: {
    id: 'bronze_boots',
    name: 'Bronze Boots',
    type: 'tool',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Boots/bronze_boots.png',
    level: 1,
    slot: EQUIPMENT_SLOTS.FEET,
    stats: { defence: 2 },
    buyPrice: 40,
    sellPrice: 10
  },
  bronze_medium_helm: {
    id: 'bronze_medium_helm',
    name: 'Bronze Medium Helm',
    type: 'tool',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Med_helm/bronze_medium_helm.png',
    level: 1,
    slot: EQUIPMENT_SLOTS.HEAD,
    stats: { defence: 3 },
    buyPrice: 45,
    sellPrice: 11
  },
  iron_kiteshield: {
    id: 'iron_kiteshield',
    name: 'Iron Kiteshield',
    type: 'tool',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Kiteshield/iron_kiteshield.png',
    level: 1,
    slot: EQUIPMENT_SLOTS.SHIELD,
    stats: { defence: 8 },
    buyPrice: 60,
    sellPrice: 15
  },
  iron_platebody: {
    id: 'iron_platebody',
    name: 'Iron Platebody',
    type: 'armor',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Platebody/iron_platebody.png',
    level: 1,
    slot: EQUIPMENT_SLOTS.BODY,
    stats: { defence: 15 },
    buyPrice: 80,
    sellPrice: 20
  },
  steel_sword: {
    id: 'steel_sword',
    name: 'Steel Sword',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/sword/steel_sword.png',
    level: 5,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { attack: 12 },
    buyPrice: 100,
    sellPrice: 25
  },
  steel_platebody: {
    id: 'steel_platebody',
    name: 'Steel Platebody',
    type: 'armor',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Platebody/steel_platebody.png',
    level: 5,
    slot: EQUIPMENT_SLOTS.BODY,
    stats: { defence: 20 },
    buyPrice: 120,
    sellPrice: 30
  },
  steel_platelegs: {
    id: 'steel_platelegs',
    name: 'Steel Platelegs',
    type: 'armor',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Platelegs/steel_platelegs.png',
    level: 5,
    slot: EQUIPMENT_SLOTS.LEGS,
    stats: { defence: 18 },
    buyPrice: 110,
    sellPrice: 28
  },
  mithril_scimitar: {
    id: 'mithril_scimitar',
    name: 'Mithril Scimitar',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/scimitar/mithril_scimitar.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.WEAPON,
    stats: { attack: 20 },
    buyPrice: 200,
    sellPrice: 50
  },
  arrow_shafts: {
    id: 'arrow_shafts',
    name: 'Arrow Shafts',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fletching/arrow_shafts.png',
    buyPrice: 5,
    sellPrice: 1
  },
  headless_arrows: {
    id: 'headless_arrows',
    name: 'Headless Arrows',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fletching/headless_arrows.png',
    buyPrice: 8,
    sellPrice: 2
  },
  mithril_full_helm: {
    id: 'mithril_full_helm',
    name: 'Mithril Full Helm',
    type: 'armor',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Full_helm/mithril_full_helm.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.HEAD,
    stats: { defence: 12 },
    buyPrice: 220,
    sellPrice: 55
  },
  mithril_kiteshield: {
    id: 'mithril_kiteshield',
    name: 'Mithril Kiteshield',
    type: 'armor',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Kiteshield/mithril_kiteshield.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.SHIELD,
    stats: { defence: 10 },
    buyPrice: 230,
    sellPrice: 58
  },
  nature_rune: {
    id: 'nature_rune',
    name: 'Nature Rune',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 60,
    sellPrice: 15
  },
  chaos_rune: {
    id: 'chaos_rune',
    name: 'Chaos Rune',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 50,
    sellPrice: 13
  },
  fire_rune: {
    id: 'fire_rune',
    name: 'Fire Rune',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 10,
    sellPrice: 2
  },
  raw_meat: {
    id: 'raw_meat',
    name: 'Raw Meat',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 8,
    sellPrice: 2
  },

  // Missing items for thieving loot tables

  iron_platelegs: {
    id: 'iron_platelegs',
    name: 'Iron Platelegs',
    type: 'tool',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Platelegs/iron_platelegs.png',
    level: 1,
    slot: EQUIPMENT_SLOTS.LEGS,
    stats: { defence: 5 },
    buyPrice: 640,
    sellPrice: 256
  },

  steel_full_helm: {
    id: 'steel_full_helm',
    name: 'Steel Full Helm',
    type: 'tool',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Full_helm/steel_full_helm.png',
    level: 5,
    slot: EQUIPMENT_SLOTS.HEAD,
    stats: { defence: 6 },
    buyPrice: 780,
    sellPrice: 312
  },

  steel_boot: {
    id: 'steel_boot',
    name: 'Steel Boots',
    type: 'tool',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Boots/steel_boots.png',
    level: 5,
    slot: EQUIPMENT_SLOTS.FEET,
    stats: { defence: 4 },
    buyPrice: 500,
    sellPrice: 200
  },

  mithril_platebody: {
    id: 'mithril_platebody',
    name: 'Mithril Platebody',
    type: 'tool',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Platebody/mithril_platebody.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.BODY,
    stats: { defence: 25 },
    buyPrice: 5200,
    sellPrice: 2080
  },

  mithril_fullhelm: {
    id: 'mithril_fullhelm',
    name: 'Mithril Full Helm',
    type: 'tool',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Full_helm/mithril_full_helm.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.HEAD,
    stats: { defence: 12 },
    buyPrice: 1650,
    sellPrice: 660
  },

  mithril_platelegs: {
    id: 'mithril_platelegs',
    name: 'Mithril Platelegs',
    type: 'tool',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Platelegs/mithril_platelegs.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.LEGS,
    stats: { defence: 22 },
    buyPrice: 2600,
    sellPrice: 1040
  },

  adamantite_sword: {
    id: 'adamantite_sword',
    name: 'Adamantite Sword',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 3200,
    sellPrice: 1280
  },

  adamantite_chainbody: {
    id: 'adamantite_chainbody',
    name: 'Adamantite Chainbody',
    type: 'tool',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Chainbody/adamant_chainbody.png',
    level: 30,
    slot: EQUIPMENT_SLOTS.BODY,
    stats: { defence: 30 },
    buyPrice: 8800,
    sellPrice: 3520
  },

  adamantite_platelegs: {
    id: 'adamantite_platelegs',
    name: 'Adamantite Platelegs',
    type: 'tool',
    category: ITEM_CATEGORIES.ARMOR,
    icon: '/assets/ItemThumbnail/Gear/Platelegs/adamant_platelegs.png',
    level: 30,
    slot: EQUIPMENT_SLOTS.LEGS,
    stats: { defence: 33 },
    buyPrice: 4800,
    sellPrice: 1920
  },

  steel_arrows: {
    id: 'steel_arrows',
    name: 'Steel Arrows',
    type: 'tool',
    category: ITEM_CATEGORIES.WEAPONS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 20,
    sellPrice: 8
  },

  mithril_arrows: {
    id: 'mithril_arrows',
    name: 'Mithril Arrows',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 50,
    sellPrice: 20
  },

  magic_shortbow: {
    id: 'magic_shortbow',
    name: 'Magic Shortbow',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 12000,
    sellPrice: 4800
  },


  // === JEWELRY - AMULETS ===
  silver_sapphire_amulet: {
    id: 'silver_sapphire_amulet',
    name: 'Silver Sapphire Amulet',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Neck/silver_sapphire_amulet.png',
    level: 1,
    slot: EQUIPMENT_SLOTS.NECK,
    stats: { magic: 2 },
    buyPrice: 150,
    sellPrice: 60
  },
  gold_sapphire_amulet: {
    id: 'gold_sapphire_amulet',
    name: 'Gold Sapphire Amulet',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Neck/gold_sapphire_amulet.png',
    level: 5,
    slot: EQUIPMENT_SLOTS.NECK,
    stats: { magic: 4 },
    buyPrice: 300,
    sellPrice: 120
  },
  silver_emerald_amulet: {
    id: 'silver_emerald_amulet',
    name: 'Silver Emerald Amulet',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Neck/silver_emerald_amulet.png',
    level: 10,
    slot: EQUIPMENT_SLOTS.NECK,
    stats: { magic: 5 },
    buyPrice: 400,
    sellPrice: 160
  },
  gold_emerald_amulet: {
    id: 'gold_emerald_amulet',
    name: 'Gold Emerald Amulet',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Neck/gold_emerald_amulet.png',
    level: 15,
    slot: EQUIPMENT_SLOTS.NECK,
    stats: { magic: 8 },
    buyPrice: 800,
    sellPrice: 320
  },
  silver_ruby_amulet: {
    id: 'silver_ruby_amulet',
    name: 'Silver Ruby Amulet',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Neck/silver_ruby_amulet.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.NECK,
    stats: { magic: 10 },
    buyPrice: 1200,
    sellPrice: 480
  },
  gold_ruby_amulet: {
    id: 'gold_ruby_amulet',
    name: 'Gold Ruby Amulet',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Neck/gold_ruby_amulet.png',
    level: 25,
    slot: EQUIPMENT_SLOTS.NECK,
    stats: { magic: 15 },
    buyPrice: 2000,
    sellPrice: 800
  },
  silver_diamond_amulet: {
    id: 'silver_diamond_amulet',
    name: 'Silver Diamond Amulet',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Neck/silver_diamond_amulet.png',
    level: 30,
    slot: EQUIPMENT_SLOTS.NECK,
    stats: { magic: 18 },
    buyPrice: 3000,
    sellPrice: 1200
  },
  gold_diamond_amulet: {
    id: 'gold_diamond_amulet',
    name: 'Gold Diamond Amulet',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Neck/gold_diamond_amulet.png',
    level: 35,
    slot: EQUIPMENT_SLOTS.NECK,
    stats: { magic: 25 },
    buyPrice: 5000,
    sellPrice: 2000
  },
  silver_dragonstone_amulet: {
    id: 'silver_dragonstone_amulet',
    name: 'Silver Dragonstone Amulet',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Neck/silver_dragonstone_amulet.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.NECK,
    stats: { magic: 30 },
    buyPrice: 8000,
    sellPrice: 3200
  },
  gold_dragonstone_amulet: {
    id: 'gold_dragonstone_amulet',
    name: 'Gold Dragonstone Amulet',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Neck/gold dragonstone_amulet.png',
    level: 50,
    slot: EQUIPMENT_SLOTS.NECK,
    stats: { magic: 40 },
    buyPrice: 15000,
    sellPrice: 6000
  },

  // === JEWELRY - RINGS ===
  silver_sapphire_ring: {
    id: 'silver_sapphire_ring',
    name: 'Silver Sapphire Ring',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Ring/silver_sapphire_ring.png',
    level: 1,
    slot: EQUIPMENT_SLOTS.RING,
    stats: { magic: 1 },
    buyPrice: 100,
    sellPrice: 40
  },
  gold_sapphire_ring: {
    id: 'gold_sapphire_ring',
    name: 'Gold Sapphire Ring',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Ring/gold_sapphire_ring.png',
    level: 5,
    slot: EQUIPMENT_SLOTS.RING,
    stats: { magic: 2 },
    buyPrice: 200,
    sellPrice: 80
  },
  silver_emerald_ring: {
    id: 'silver_emerald_ring',
    name: 'Silver Emerald Ring',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Ring/silver_emerald_ring.png',
    level: 10,
    slot: EQUIPMENT_SLOTS.RING,
    stats: { magic: 3 },
    buyPrice: 300,
    sellPrice: 120
  },
  gold_emerald_ring: {
    id: 'gold_emerald_ring',
    name: 'Gold Emerald Ring',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Ring/gold_emerald_ring.png',
    level: 15,
    slot: EQUIPMENT_SLOTS.RING,
    stats: { magic: 5 },
    buyPrice: 500,
    sellPrice: 200
  },
  silver_ruby_ring: {
    id: 'silver_ruby_ring',
    name: 'Silver Ruby Ring',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Ring/silver_ruby_ring.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.RING,
    stats: { magic: 7 },
    buyPrice: 800,
    sellPrice: 320
  },
  gold_ruby_ring: {
    id: 'gold_ruby_ring',
    name: 'Gold Ruby Ring',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Ring/gold_ruby_ring.png',
    level: 25,
    slot: EQUIPMENT_SLOTS.RING,
    stats: { magic: 10 },
    buyPrice: 1200,
    sellPrice: 480
  },
  silver_diamond_ring: {
    id: 'silver_diamond_ring',
    name: 'Silver Diamond Ring',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Ring/silver_diamond_ring.png',
    level: 30,
    slot: EQUIPMENT_SLOTS.RING,
    stats: { magic: 12 },
    buyPrice: 2000,
    sellPrice: 800
  },
  gold_diamond_ring: {
    id: 'gold_diamond_ring',
    name: 'Gold Diamond Ring',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Ring/gold_diamond_ring.png',
    level: 35,
    slot: EQUIPMENT_SLOTS.RING,
    stats: { magic: 18 },
    buyPrice: 3500,
    sellPrice: 1400
  },
  silver_dragonstone_ring: {
    id: 'silver_dragonstone_ring',
    name: 'Silver Dragonstone Ring',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Ring/silver_dragonstone_ring.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.RING,
    stats: { magic: 20 },
    buyPrice: 5000,
    sellPrice: 2000
  },
  gold_dragonstone_ring: {
    id: 'gold_dragonstone_ring',
    name: 'Gold Dragonstone Ring',
    type: 'armor',
    category: ITEM_CATEGORIES.JEWELRY,
    icon: '/assets/ItemThumbnail/Gear/Ring/gold_dragonstone_ring.png',
    level: 50,
    slot: EQUIPMENT_SLOTS.RING,
    stats: { magic: 30 },
    buyPrice: 10000,
    sellPrice: 4000
  },

  // === FARMING - SEEDS (Updated with correct image paths) ===
  potato_seeds: {
    id: 'potato_seeds',
    name: 'Potato Seeds',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/potato_seeds.png',
    buyPrice: 5,
    sellPrice: 2
  },
  onion_seed: {
    id: 'onion_seed',
    name: 'Onion Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/onion_seed.png',
    buyPrice: 12,
    sellPrice: 3
  },
  cabbage_seed: {
    id: 'cabbage_seed',
    name: 'Cabbage Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/cabbage_seed.png',
    buyPrice: 14,
    sellPrice: 3
  },
  tomato_seed: {
    id: 'tomato_seed',
    name: 'Tomato Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/tomato_seed.png',
    buyPrice: 15,
    sellPrice: 4
  },
  sweetcorn_seed: {
    id: 'sweetcorn_seed',
    name: 'Sweetcorn Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/sweetcorn_seed.png',
    buyPrice: 20,
    sellPrice: 5
  },
  strawberry_seed: {
    id: 'strawberry_seed',
    name: 'Strawberry Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/strawberry_seed.png',
    buyPrice: 30,
    sellPrice: 7
  },
  watermelon_seed: {
    id: 'watermelon_seed',
    name: 'Watermelon Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/watermelon_seed.png',
    buyPrice: 40,
    sellPrice: 10
  },
  snapegrass_seed: {
    id: 'snapegrass_seed',
    name: 'Snapegrass Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/snapegrass_seed.png',
    buyPrice: 120,
    sellPrice: 80
  },
  acorn: {
    id: 'acorn',
    name: 'Acorn',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/acorn_seed.png',
    buyPrice: 100,
    sellPrice: 25
  },
  willow_seed: {
    id: 'willow_seed',
    name: 'Willow Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/willow_seed.png',
    buyPrice: 200,
    sellPrice: 50
  },
  teak_seed: {
    id: 'teak_seed',
    name: 'Teak Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/teak_seed.png',
    buyPrice: 300,
    sellPrice: 75
  },
  maple_seed: {
    id: 'maple_seed',
    name: 'Maple Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/maple_seed.png',
    buyPrice: 500,
    sellPrice: 125
  },
  mahogany_seed: {
    id: 'mahogany_seed',
    name: 'Mahogany Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/mahogany_seed.png',
    buyPrice: 800,
    sellPrice: 200
  },
  yew_seed: {
    id: 'yew_seed',
    name: 'Yew Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/yew_seed.png',
    buyPrice: 1200,
    sellPrice: 300
  },
  magic_seed: {
    id: 'magic_seed',
    name: 'Magic Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/magic_seed.png',
    buyPrice: 2000,
    sellPrice: 500
  },
  redwood_seed: {
    id: 'redwood_seed',
    name: 'Redwood Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.FARMING,
    icon: '/assets/ItemThumbnail/Farming/redwood_seed.png',
    buyPrice: 5000,
    sellPrice: 1250
  },

  // === HERBLORE - HERBS (Updated with correct image paths) ===
  guam_leaf: {
    id: 'guam_leaf',
    name: 'Guam Leaf',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/guam_leaf.png',
    buyPrice: 50,
    sellPrice: 20
  },
  marrentill: {
    id: 'marrentill',
    name: 'Marrentill',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/marrentill.png',
    buyPrice: 75,
    sellPrice: 30
  },
  tarromin: {
    id: 'tarromin',
    name: 'Tarromin',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/tarromin.png',
    buyPrice: 100,
    sellPrice: 40
  },
  harralander: {
    id: 'harralander',
    name: 'Harralander',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/harralander.png',
    buyPrice: 125,
    sellPrice: 50
  },
  ranarr_weed: {
    id: 'ranarr_weed',
    name: 'Ranarr Weed',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/ranarr.png',
    buyPrice: 150,
    sellPrice: 60
  },
  irit_leaf: {
    id: 'irit_leaf',
    name: 'Irit Leaf',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/irit.png',
    buyPrice: 200,
    sellPrice: 80
  },
  avantoe: {
    id: 'avantoe',
    name: 'Avantoe',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/avantoe.png',
    buyPrice: 250,
    sellPrice: 100
  },
  kwuarm: {
    id: 'kwuarm',
    name: 'Kwuarm',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/kwuarm.png',
    buyPrice: 300,
    sellPrice: 120
  },
  cadantine: {
    id: 'cadantine',
    name: 'Cadantine',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/cadantine.png',
    buyPrice: 350,
    sellPrice: 140
  },
  lantadyme: {
    id: 'lantadyme',
    name: 'Lantadyme',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/lantadyme.png',
    buyPrice: 400,
    sellPrice: 160
  },
  dwarf_weed: {
    id: 'dwarf_weed',
    name: 'Dwarf Weed',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/dwarf_weed.png',
    buyPrice: 450,
    sellPrice: 180
  },
  toadflax: {
    id: 'toadflax',
    name: 'Toadflax',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/toadflax.png',
    buyPrice: 275,
    sellPrice: 110
  },
  snapdragon: {
    id: 'snapdragon',
    name: 'Snapdragon',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/snapdragon.png',
    buyPrice: 300,
    sellPrice: 120
  },
  torstol: {
    id: 'torstol',
    name: 'Torstol',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/herbs/torstol.png',
    buyPrice: 500,
    sellPrice: 200
  },

  // === HERBLORE - POTIONS ===
  vial_of_water: {
    id: 'vial_of_water',
    name: 'Vial of Water',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/vial_of_water.png',
    buyPrice: 5,
    sellPrice: 2
  },
  attack_potion: {
    id: 'attack_potion',
    name: 'Attack Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/attack_potion.png',
    buyPrice: 200,
    sellPrice: 80
  },
  strength_potion: {
    id: 'strength_potion',
    name: 'Strength Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/strength_potion.png',
    buyPrice: 250,
    sellPrice: 100
  },
  defence_potion: {
    id: 'defence_potion',
    name: 'Defence Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/defence_potion.png',
    buyPrice: 300,
    sellPrice: 120
  },
  super_attack_potion: {
    id: 'super_attack_potion',
    name: 'Super Attack Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/super_attack_potion.png',
    buyPrice: 400,
    sellPrice: 160
  },
  super_strength_potion: {
    id: 'super_strength_potion',
    name: 'Super Strength Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/super_strength_potion.png',
    buyPrice: 450,
    sellPrice: 180
  },
  super_defence_potion: {
    id: 'super_defence_potion',
    name: 'Super Defence Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/super_defence_potion.png',
    buyPrice: 500,
    sellPrice: 200
  },
  prayer_potion: {
    id: 'prayer_potion',
    name: 'Prayer Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/prayer_potion.png',
    buyPrice: 100,
    sellPrice: 40
  },
  antipoison: {
    id: 'antipoison',
    name: 'Antipoison',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/antipoison.png',
    buyPrice: 150,
    sellPrice: 60
  },
  antifire: {
    id: 'antifire',
    name: 'Antifire Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/antifire.png',
    buyPrice: 600,
    sellPrice: 240
  },
  magic_potion: {
    id: 'magic_potion',
    name: 'Magic Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/magic_potion.png',
    buyPrice: 350,
    sellPrice: 140
  },
  super_magic_potion: {
    id: 'super_magic_potion',
    name: 'Super Magic Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/super_magic_potion.png',
    buyPrice: 550,
    sellPrice: 220
  },
  ranged_potion: {
    id: 'ranged_potion',
    name: 'Ranged Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/ranged_potion.png',
    buyPrice: 350,
    sellPrice: 140
  },
  super_range_potion: {
    id: 'super_range_potion',
    name: 'Super Range Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/super_range_potion.png',
    buyPrice: 550,
    sellPrice: 220
  },
  super_melee_potion: {
    id: 'super_melee_potion',
    name: 'Super Melee Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/super_melee_potion.png',
    buyPrice: 600,
    sellPrice: 240
  },
  bastion_potion: {
    id: 'bastion_potion',
    name: 'Bastion Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/bastion_potion.png',
    buyPrice: 700,
    sellPrice: 280
  },
  battlemage_potion: {
    id: 'battlemage_potion',
    name: 'Battlemage Potion',
    type: 'consumable',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/potions/battlemage_potion.png',
    buyPrice: 700,
    sellPrice: 280
  },

  // === HERBLORE - SECONDARIES ===
  eye_of_newt: {
    id: 'eye_of_newt',
    name: 'Eye of Newt',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/secondaries/eye_of_newt.png',
    buyPrice: 10,
    sellPrice: 4
  },
  limpwurt_root: {
    id: 'limpwurt_root',
    name: 'Limpwurt Root',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/secondaries/limpwurt_root.png',
    buyPrice: 50,
    sellPrice: 20
  },
  red_spiders_eggs: {
    id: 'red_spiders_eggs',
    name: 'Red Spiders Eggs',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/secondaries/red_spiders_eggs.png',
    buyPrice: 30,
    sellPrice: 12
  },
  snape_grass: {
    id: 'snape_grass',
    name: 'Snape Grass',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/secondaries/snapegrass.png',
    buyPrice: 35,
    sellPrice: 8
  },
  white_berries: {
    id: 'white_berries',
    name: 'White Berries',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/secondaries/white_berries.png',
    buyPrice: 40,
    sellPrice: 16
  },
  red_berries: {
    id: 'red_berries',
    name: 'Red Berries',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/secondaries/red_berries.png',
    buyPrice: 25,
    sellPrice: 10
  },
  blue_berries: {
    id: 'blue_berries',
    name: 'Blue Berries',
    type: 'resource',
    category: ITEM_CATEGORIES.HERBLORE,
    icon: '/assets/ItemThumbnail/Herblore/secondaries/blue_berries.png',
    buyPrice: 30,
    sellPrice: 12
  },

  // === CRAFTING - HIDE ITEMS ===
  cowhide: {
    id: 'cowhide',
    name: 'Cowhide',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/cowhide.png',
    buyPrice: 20,
    sellPrice: 8
  },
  leather_body: {
    id: 'leather_body',
    name: 'Leather Body',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/leather_body.png',
    level: 1,
    slot: EQUIPMENT_SLOTS.BODY,
    stats: { defence: 2 },
    buyPrice: 100,
    sellPrice: 40
  },
  leather_chaps: {
    id: 'leather_chaps',
    name: 'Leather Chaps',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/leather_chaps.png',
    level: 1,
    slot: EQUIPMENT_SLOTS.LEGS,
    stats: { defence: 2 },
    buyPrice: 80,
    sellPrice: 32
  },
  leather_coif: {
    id: 'leather_coif',
    name: 'Leather Coif',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/leather_coif.png',
    level: 1,
    slot: EQUIPMENT_SLOTS.HEAD,
    stats: { defence: 1 },
    buyPrice: 60,
    sellPrice: 24
  },
  leather_vambraces: {
    id: 'leather_vambraces',
    name: 'Leather Vambraces',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/leather_vambraces.png',
    level: 1,
    slot: EQUIPMENT_SLOTS.HANDS,
    stats: { defence: 1 },
    buyPrice: 40,
    sellPrice: 16
  },
  green_dragonhide: {
    id: 'green_dragonhide',
    name: 'Green Dragonhide',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/green_dragonhide.png',
    buyPrice: 100,
    sellPrice: 40
  },
  green_dragonhide_body: {
    id: 'green_dragonhide_body',
    name: 'Green Dragonhide Body',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/green_dragonhide_body.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.BODY,
    stats: { defence: 15 },
    buyPrice: 500,
    sellPrice: 200
  },
  green_dragonhide_chaps: {
    id: 'green_dragonhide_chaps',
    name: 'Green Dragonhide Chaps',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/green_dragonhide_chaps.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.LEGS,
    stats: { defence: 12 },
    buyPrice: 400,
    sellPrice: 160
  },
  green_dragonhide_coif: {
    id: 'green_dragonhide_coif',
    name: 'Green Dragonhide Coif',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/green_dragonhide_coif.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.HEAD,
    stats: { defence: 8 },
    buyPrice: 300,
    sellPrice: 120
  },
  green_dragonhide_vambraces: {
    id: 'green_dragonhide_vambraces',
    name: 'Green Dragonhide Vambraces',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/green_dragonhide_vambraces.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.HANDS,
    stats: { defence: 6 },
    buyPrice: 200,
    sellPrice: 80
  },
  blue_dragonhide: {
    id: 'blue_dragonhide',
    name: 'Blue Dragonhide',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/blue_dragonhide.png',
    buyPrice: 200,
    sellPrice: 80
  },
  blue_dragonhide_body: {
    id: 'blue_dragonhide_body',
    name: 'Blue Dragonhide Body',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/blue_dragonhide_body.png',
    level: 50,
    slot: EQUIPMENT_SLOTS.BODY,
    stats: { defence: 20 },
    buyPrice: 800,
    sellPrice: 320
  },
  blue_dragonhide_chaps: {
    id: 'blue_dragonhide_chaps',
    name: 'Blue Dragonhide Chaps',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/blue_dragonhide_chaps.png',
    level: 50,
    slot: EQUIPMENT_SLOTS.LEGS,
    stats: { defence: 16 },
    buyPrice: 600,
    sellPrice: 240
  },
  blue_dragonhide_vambraces: {
    id: 'blue_dragonhide_vambraces',
    name: 'Blue Dragonhide Vambraces',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/blue_dragonhide_vambraces.png',
    level: 50,
    slot: EQUIPMENT_SLOTS.HANDS,
    stats: { defence: 10 },
    buyPrice: 400,
    sellPrice: 160
  },
  red_dragonhide: {
    id: 'red_dragonhide',
    name: 'Red Dragonhide',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/red_dragonhide.png',
    buyPrice: 400,
    sellPrice: 160
  },
  red_dragonhide_body: {
    id: 'red_dragonhide_body',
    name: 'Red Dragonhide Body',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/red_dragonhide_body.png',
    level: 60,
    slot: EQUIPMENT_SLOTS.BODY,
    stats: { defence: 25 },
    buyPrice: 1200,
    sellPrice: 480
  },
  red_dragonhide_chaps: {
    id: 'red_dragonhide_chaps',
    name: 'Red Dragonhide Chaps',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/red_dragonhide_chaps.png',
    level: 60,
    slot: EQUIPMENT_SLOTS.LEGS,
    stats: { defence: 20 },
    buyPrice: 900,
    sellPrice: 360
  },
  red_dragonhide_vambraces: {
    id: 'red_dragonhide_vambraces',
    name: 'Red Dragonhide Vambraces',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/red_dragonhide_vambraces.png',
    level: 60,
    slot: EQUIPMENT_SLOTS.HANDS,
    stats: { defence: 15 },
    buyPrice: 600,
    sellPrice: 240
  },
  black_dragonhide: {
    id: 'black_dragonhide',
    name: 'Black Dragonhide',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/black_dragonhide.png',
    buyPrice: 800,
    sellPrice: 320
  },
  black_dragonhide_body: {
    id: 'black_dragonhide_body',
    name: 'Black Dragonhide Body',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/black_dragonhide_body.png',
    level: 70,
    slot: EQUIPMENT_SLOTS.BODY,
    stats: { defence: 30 },
    buyPrice: 2000,
    sellPrice: 800
  },
  black_dragonhide_chaps: {
    id: 'black_dragonhide_chaps',
    name: 'Black Dragonhide Chaps',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/black_dragonhide_chaps.png',
    level: 70,
    slot: EQUIPMENT_SLOTS.LEGS,
    stats: { defence: 25 },
    buyPrice: 1500,
    sellPrice: 600
  },
  black_dragonhide_coif: {
    id: 'black_dragonhide_coif',
    name: 'Black Dragonhide Coif',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/black_dragonhide_coif.png',
    level: 70,
    slot: EQUIPMENT_SLOTS.HEAD,
    stats: { defence: 15 },
    buyPrice: 900,
    sellPrice: 360
  },
  black_dragonhide_vambraces: {
    id: 'black_dragonhide_vambraces',
    name: 'Black Dragonhide Vambraces',
    type: 'armor',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Hide/black_dragonhide_vambraces.png',
    level: 70,
    slot: EQUIPMENT_SLOTS.HANDS,
    stats: { defence: 20 },
    buyPrice: 1200,
    sellPrice: 480
  },

  // === CRAFTING - GEMS (Updated with correct image paths) ===
  uncut_sapphire: {
    id: 'uncut_sapphire',
    name: 'Uncut Sapphire',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Gems/uncut_sapphire.png',
    buyPrice: 80,
    sellPrice: 20
  },
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Gems/sapphire.png',
    buyPrice: 120,
    sellPrice: 30
  },
  uncut_emerald: {
    id: 'uncut_emerald',
    name: 'Uncut Emerald',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Gems/uncut_emerald.png',
    buyPrice: 100,
    sellPrice: 25
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Gems/emerald.png',
    buyPrice: 150,
    sellPrice: 40
  },
  uncut_ruby: {
    id: 'uncut_ruby',
    name: 'Uncut Ruby',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Gems/uncut_ruby.png',
    buyPrice: 120,
    sellPrice: 30
  },
  ruby: {
    id: 'ruby',
    name: 'Ruby',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Gems/ruby.png',
    buyPrice: 180,
    sellPrice: 45
  },
  uncut_diamond: {
    id: 'uncut_diamond',
    name: 'Uncut Diamond',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Gems/uncut_diamond.png',
    buyPrice: 200,
    sellPrice: 50
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Gems/diamond.png',
    buyPrice: 300,
    sellPrice: 75
  },
  uncut_onyx: {
    id: 'uncut_onyx',
    name: 'Uncut Onyx',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Gems/uncut_onyx.png',
    buyPrice: 50000,
    sellPrice: 35000
  },
  onyx: {
    id: 'onyx',
    name: 'Onyx',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Gems/onyx.png',
    buyPrice: 75000,
    sellPrice: 50000
  },
  uncut_zenyte: {
    id: 'uncut_zenyte',
    name: 'Uncut Zenyte',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Gems/uncut_zenyte.png',
    buyPrice: 100000,
    sellPrice: 70000
  },
  zenyte: {
    id: 'zenyte',
    name: 'Zenyte',
    type: 'resource',
    category: ITEM_CATEGORIES.CRAFTING,
    icon: '/assets/ItemThumbnail/Crafting/Gems/zenyte.png',
    buyPrice: 150000,
    sellPrice: 100000
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
  return item.type === 'tool' || item.type === 'weapon' || item.type === 'armor';
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

  // For tools in weapon slot (axes, pickaxes), treat them as weapons requiring attack level
  if (item.slot === 'weapon') {
    if (name.includes('sword') || name.includes('scimitar') || name.includes('mace') || name.includes('warhammer') || name.includes('longsword') || name.includes('battleaxe') || name.includes('_axe') || name.includes('_pickaxe')) {
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

  // Handle Tools that are NOT in weapon slot (fishing nets, etc.)
  if (item.category === ITEM_CATEGORIES.TOOLS && item.slot !== 'weapon') {
    if (name.includes('_axe')) {
      if (name.includes('bronze')) return { skill: 'woodcutting', level: 1 };
      if (name.includes('iron')) return { skill: 'woodcutting', level: 10 };
      if (name.includes('steel')) return { skill: 'woodcutting', level: 20 };
      if (name.includes('mithril')) return { skill: 'woodcutting', level: 30 };
      if (name.includes('adamant')) return { skill: 'woodcutting', level: 40 };
      if (name.includes('rune')) return { skill: 'woodcutting', level: 50 };
    }
    if (name.includes('_pickaxe')) {
      if (name.includes('bronze')) return { skill: 'mining', level: 1 };
      if (name.includes('iron')) return { skill: 'mining', level: 10 };
      if (name.includes('steel')) return { skill: 'mining', level: 20 };
      if (name.includes('mithril')) return { skill: 'mining', level: 30 };
      if (name.includes('adamant')) return { skill: 'mining', level: 40 };
      if (name.includes('rune')) return { skill: 'mining', level: 50 };
    }
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
