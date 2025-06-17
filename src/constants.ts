export const ITEM_CATEGORIES = {
  WEAPONS: 'weapons',
  ARMOR: 'armor',
  TOOLS: 'tools',
  RESOURCES: 'resources',
  CONSUMABLES: 'consumables',
  MISC: 'misc'
} as const;

export const EQUIPMENT_SLOTS = {
  HEAD: 'head',
  NECK: 'neck',
  BODY: 'body',
  LEGS: 'legs',
  FEET: 'feet',
  HANDS: 'hands',
  CAPE: 'cape',
  WEAPON: 'weapon',
  SHIELD: 'shield',
  RING: 'ring',
  AMMO: 'ammo'
} as const;

export type ItemCategory = typeof ITEM_CATEGORIES[keyof typeof ITEM_CATEGORIES];
export type EquipmentSlot = typeof EQUIPMENT_SLOTS[keyof typeof EQUIPMENT_SLOTS]; 