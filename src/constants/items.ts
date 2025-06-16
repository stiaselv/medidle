export const ITEM_CATEGORIES = {
  WEAPONS: 'weapons',
  ARMOR: 'armor',
  TOOLS: 'tools',
  RESOURCES: 'resources',
  CONSUMABLES: 'consumables',
  MISC: 'misc',
  COMBAT: 'combat'
} as const;

export type ItemCategory = typeof ITEM_CATEGORIES[keyof typeof ITEM_CATEGORIES]; 