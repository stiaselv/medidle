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

export type EquipmentSlot = typeof EQUIPMENT_SLOTS[keyof typeof EQUIPMENT_SLOTS]; 