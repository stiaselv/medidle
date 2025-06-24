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
    stats: { woodcutting: 2 }
  },
  steel_pickaxe: {
    name: 'Steel Pickaxe',
    level: 20,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/steel_pickaxe.png',
    stats: { woodcutting: 3 }
  },
  mithril_pickaxe: {
    name: 'Mithril Pickaxe',
    level: 30,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/mithril_pickaxe.png',
    stats: { woodcutting: 4 }
  },
  adamant_pickaxe: {
    name: 'Adamant Pickaxe',
    level: 40,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/adamant_pickaxe.png',
    stats: { woodcutting: 5 }
  },
  rune_pickaxe: {
    name: 'Rune Pickaxe',
    level: 50,
    category: ITEM_CATEGORIES.TOOLS,
    slot: EQUIPMENT_SLOTS.WEAPON,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/rune_pickaxe.png',
    stats: { woodcutting: 6 }
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

export const getEquipmentSlot = (template: SmithingTemplate): keyof typeof EQUIPMENT_SLOTS => {
  if (template.armorType) {
    if (template.armorType.includes('helm')) return 'HEAD';
    if (template.armorType.includes('body')) return 'BODY';
    if (template.armorType.includes('legs') || template.armorType.includes('skirt')) return 'LEGS';
    if (template.armorType.includes('shield')) return 'SHIELD';
  }
  return 'WEAPON';
};

const generateSmithingItems = (metalType: string) => {
  const items: Record<string, Item> = {};
  const metalTier = getMetalTier(metalType);
  
  SMITHING_TEMPLATES.forEach(template => {
    const itemId = `${metalType}_${template.id}`;
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

    const iconPath = template.weaponType
      ? `/assets/ItemThumbnail/Gear/Weapons/${template.weaponType}/${metalType}_${template.weaponType}.png`
      : `/assets/items/placeholder.png`;
    
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
    icon: '/assets/ItemThumbnail/Div/Coins.png'
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
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  steel_pickaxe: {
    id: 'steel_pickaxe',
    name: 'Steel Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/steel_pickaxe.png',
    level: 20,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  mithril_pickaxe: {
    id: 'mithril_pickaxe',
    name: 'Mithril Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/mithril_pickaxe.png',
    level: 30,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  adamant_pickaxe: {
    id: 'adamant_pickaxe',
    name: 'Adamant Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/adamant_pickaxe.png',
    level: 40,
    slot: EQUIPMENT_SLOTS.WEAPON
  },
  rune_pickaxe: {
    id: 'rune_pickaxe',
    name: 'Rune Pickaxe',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/ItemThumbnail/Gear/Weapons/pickaxe/rune_pickaxe.png',
    level: 50,
    slot: EQUIPMENT_SLOTS.WEAPON
  },

  // Resources - Ores
  copper_ore: {
    id: 'copper_ore',
    name: 'Copper Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Copper_Ore.png',
  },
  tin_ore: {
    id: 'tin_ore',
    name: 'Tin Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Tin_Ore.png',
  },
  iron_ore: {
    id: 'iron_ore',
    name: 'Iron Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Iron_Ore.png',
  },
  silver_ore: {
    id: 'silver_ore',
    name: 'Silver Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Silver_Ore.png',
  },
  gold_ore: {
    id: 'gold_ore',
    name: 'Gold Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Gold_Ore.png',
  },
  mithril_ore: {
    id: 'mithril_ore',
    name: 'Mithril Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Mithril_Ore.png',
  },
  adamantite_ore: {
    id: 'adamantite_ore',
    name: 'Adamantite Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Adamant_Ore.png',
  },
  runite_ore: {
    id: 'runite_ore',
    name: 'Runite Ore',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Rune_Ore.png',
  },
  coal: {
    id: 'coal',
    name: 'Coal',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Mining/Coal_Ore.png',
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

  // Resources - Logs
  normal_logs: {
    id: 'normal_logs',
    name: 'Normal Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Normal_Log.png'
  },
  oak_logs: {
    id: 'oak_logs',
    name: 'Oak Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png' // Placeholder, update later
  },
  willow_logs: {
    id: 'willow_logs',
    name: 'Willow Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png' // Placeholder, update later
  },
  maple_logs: {
    id: 'maple_logs',
    name: 'Maple Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Maple_Log.png'
  },
  yew_logs: {
    id: 'yew_logs',
    name: 'Yew Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png' // Placeholder, update later
  },
  magic_logs: {
    id: 'magic_logs',
    name: 'Magic Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Magic_Log.png'
  },
  redwood_logs: {
    id: 'redwood_logs',
    name: 'Redwood Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png' // Placeholder, update later
  },
  teak_logs: {
    id: 'teak_logs',
    name: 'Teak Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Teak_Log.png',
  },
  mahogany_logs: {
    id: 'mahogany_logs',
    name: 'Mahogany Logs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Woodcutting/Mahogany_Log.png',
  },

  // Resources - Fishing
  raw_shrimp: {
    id: 'raw_shrimp',
    name: 'Raw Shrimp',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/raw_shrimp.png',
  },
  raw_anchovy: {
    id: 'raw_anchovy',
    name: 'Raw Anchovy',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/raw_anchovy.png',
  },
  raw_trout: {
    id: 'raw_trout',
    name: 'Raw Trout',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Trout.png',
  },
  raw_herring: {
    id: 'raw_herring',
    name: 'Raw Herring',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/ItemThumbnail/Fishing/Raw_Herring.png',
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
    icon: '/assets/ItemThumbnail/Fishing/Raw_Swordfish.png',
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
    icon: '/assets/ItemThumbnail/Fishing/Raw_Dark_Crab.png',
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
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Shrimp.png',
    healing: 3,
  },
  cooked_sardine: {
    id: 'cooked_sardine',
    name: 'Cooked Sardine',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Sardine.png',
    healing: 4,
  },
  cooked_herring: {
    id: 'cooked_herring',
    name: 'Cooked Herring',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Herring.png',
    healing: 5,
  },
  cooked_trout: {
    id: 'cooked_trout',
    name: 'Cooked Trout',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Trout.png',
    healing: 7,
  },
  cooked_pike: {
    id: 'cooked_pike',
    name: 'Cooked Pike',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Pike.png',
    healing: 8,
  },
  cooked_salmon: {
    id: 'cooked_salmon',
    name: 'Cooked Salmon',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Salmon.png',
    healing: 9,
  },
  cooked_tuna: {
    id: 'cooked_tuna',
    name: 'Cooked Tuna',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Tuna.png',
    healing: 10,
  },
  cooked_lobster: {
    id: 'cooked_lobster',
    name: 'Cooked Lobster',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Lobster.png',
    healing: 12,
  },
  cooked_bass: {
    id: 'cooked_bass',
    name: 'Cooked Bass',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Bass.png',
    healing: 13,
  },
  cooked_swordfish: {
    id: 'cooked_swordfish',
    name: 'Cooked Swordfish',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Swordfish.png',
    healing: 14,
  },
  cooked_monkfish: {
    id: 'cooked_monkfish',
    name: 'Cooked Monkfish',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Monkfish.png',
    healing: 16,
  },
  cooked_shark: {
    id: 'cooked_shark',
    name: 'Cooked Shark',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Shark.png',
    healing: 20,
  },
  cooked_anglerfish: {
    id: 'cooked_anglerfish',
    name: 'Cooked Anglerfish',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Anglerfish.png',
    healing: 21,
  },
  cooked_dark_crab: {
    id: 'cooked_dark_crab',
    name: 'Cooked Dark Crab',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/ItemThumbnail/Cooking/Cooked_Dark_Crab.png',
    healing: 22,
  },

  // Firemaking Products
  ashes: {
    id: 'ashes',
    name: 'Ashes',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/ashes.png',
  },

  bones: {
    id: 'bones',
    name: 'Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  big_bones: {
    id: 'big_bones',
    name: 'Big Bones',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
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
  tomato_seed: {
    id: 'tomato_seed',
    name: 'Tomato Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  sweetcorn_seed: {
    id: 'sweetcorn_seed',
    name: 'Sweetcorn Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  strawberry_seed: {
    id: 'strawberry_seed',
    name: 'Strawberry Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  watermelon_seed: {
    id: 'watermelon_seed',
    name: 'Watermelon Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  guam_leaf: {
    id: 'guam_leaf',
    name: 'Guam Leaf',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  marrentill: {
    id: 'marrentill',
    name: 'Marrentill',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  tarromin: {
    id: 'tarromin',
    name: 'Tarromin',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  harralander: {
    id: 'harralander',
    name: 'Harralander',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  ranarr_weed: {
    id: 'ranarr_weed',
    name: 'Ranarr Weed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  irit_leaf: {
    id: 'irit_leaf',
    name: 'Irit Leaf',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  avantoe: {
    id: 'avantoe',
    name: 'Avantoe',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  kwuarm: {
    id: 'kwuarm',
    name: 'Kwuarm',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  cadantine: {
    id: 'cadantine',
    name: 'Cadantine',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  lantadyme: {
    id: 'lantadyme',
    name: 'Lantadyme',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  dwarf_weed: {
    id: 'dwarf_weed',
    name: 'Dwarf Weed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  death_rune: {
    id: 'death_rune',
    name: 'Death Rune',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
  },
  blood_rune: {
    id: 'blood_rune',
    name: 'Blood Rune',
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

  // --- Thieving Reward Items ---
  potato_seed: {
    id: 'potato_seed',
    name: 'Potato Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 10,
    sellPrice: 2
  },
  onion_seed: {
    id: 'onion_seed',
    name: 'Onion Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 12,
    sellPrice: 3
  },
  guam_seed: {
    id: 'guam_seed',
    name: 'Guam Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 20,
    sellPrice: 5
  },
  cabbage_seed: {
    id: 'cabbage_seed',
    name: 'Cabbage Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 14,
    sellPrice: 3
  },
  snape_grass_seed: {
    id: 'snape_grass_seed',
    name: 'Snape Grass Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 30,
    sellPrice: 7
  },
  marentill_seed: {
    id: 'marentill_seed',
    name: 'Marentill Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 25,
    sellPrice: 6
  },
  tarromin_seed: {
    id: 'tarromin_seed',
    name: 'Tarromin Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 28,
    sellPrice: 7
  },
  harralander_seed: {
    id: 'harralander_seed',
    name: 'Harralander Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 32,
    sellPrice: 8
  },
  ranarr_seed: {
    id: 'ranarr_seed',
    name: 'Ranarr Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 40,
    sellPrice: 10
  },
  toadflax_seed: {
    id: 'toadflax_seed',
    name: 'Toadflax Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 38,
    sellPrice: 9
  },
  irit_seed: {
    id: 'irit_seed',
    name: 'Irit Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 42,
    sellPrice: 11
  },
  avantoe_seed: {
    id: 'avantoe_seed',
    name: 'Avantoe Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 44,
    sellPrice: 12
  },
  kwuarm_seed: {
    id: 'kwuarm_seed',
    name: 'Kwuarm Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 46,
    sellPrice: 13
  },
  snapdragon_seed: {
    id: 'snapdragon_seed',
    name: 'Snapdragon Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 48,
    sellPrice: 14
  },
  cadantine_seed: {
    id: 'cadantine_seed',
    name: 'Cadantine Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 50,
    sellPrice: 15
  },
  lantadyme_seed: {
    id: 'lantadyme_seed',
    name: 'Lantadyme Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 52,
    sellPrice: 16
  },
  dwarf_weed_seed: {
    id: 'dwarf_weed_seed',
    name: 'Dwarf Weed Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 54,
    sellPrice: 17
  },
  torstol_seed: {
    id: 'torstol_seed',
    name: 'Torstol Seed',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 60,
    sellPrice: 20
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
  iron_dagger: {
    id: 'iron_dagger',
    name: 'Iron Dagger',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 50,
    sellPrice: 12
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
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 40,
    sellPrice: 10
  },
  bronze_medium_helm: {
    id: 'bronze_medium_helm',
    name: 'Bronze Medium Helm',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 45,
    sellPrice: 11
  },
  iron_kiteshield: {
    id: 'iron_kiteshield',
    name: 'Iron Kiteshield',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 60,
    sellPrice: 15
  },
  iron_platebody: {
    id: 'iron_platebody',
    name: 'Iron Platebody',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 80,
    sellPrice: 20
  },
  steel_sword: {
    id: 'steel_sword',
    name: 'Steel Sword',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 100,
    sellPrice: 25
  },
  steel_platebody: {
    id: 'steel_platebody',
    name: 'Steel Platebody',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 120,
    sellPrice: 30
  },
  steel_platelegs: {
    id: 'steel_platelegs',
    name: 'Steel Platelegs',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 110,
    sellPrice: 28
  },
  mithril_scimitar: {
    id: 'mithril_scimitar',
    name: 'Mithril Scimitar',
    type: 'tool',
    category: ITEM_CATEGORIES.TOOLS,
    icon: '/assets/items/placeholder.png',
    buyPrice: 200,
    sellPrice: 50
  },
  arrow_shafts: {
    id: 'arrow_shafts',
    name: 'Arrow Shafts',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 5,
    sellPrice: 1
  },
  mithril_full_helm: {
    id: 'mithril_full_helm',
    name: 'Mithril Full Helm',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 220,
    sellPrice: 55
  },
  mithril_kiteshield: {
    id: 'mithril_kiteshield',
    name: 'Mithril Kiteshield',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
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
  uncut_ruby: {
    id: 'uncut_ruby',
    name: 'Uncut Ruby',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 120,
    sellPrice: 30
  },
  uncut_sapphire: {
    id: 'uncut_sapphire',
    name: 'Uncut Sapphire',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 80,
    sellPrice: 20
  },
  uncut_emerald: {
    id: 'uncut_emerald',
    name: 'Uncut Emerald',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 100,
    sellPrice: 25
  },
  uncut_diamond: {
    id: 'uncut_diamond',
    name: 'Uncut Diamond',
    type: 'resource',
    category: ITEM_CATEGORIES.RESOURCES,
    icon: '/assets/items/placeholder.png',
    buyPrice: 200,
    sellPrice: 50
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

  // Handle Tools first, as they might share the 'weapon' slot
  if (item.category === ITEM_CATEGORIES.TOOLS) {
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

  // Melee weapons
  if (item.slot === 'weapon') {
    if (name.includes('sword') || name.includes('scimitar') || name.includes('mace') || name.includes('warhammer') || name.includes('longsword') || name.includes('battleaxe')) {
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