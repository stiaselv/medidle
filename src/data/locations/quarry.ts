import type { Location, SkillAction } from '../../types/game';

export const quarryLocation: Location = {
  id: 'quarry',
  name: 'Quarry',
  description: 'A rocky quarry where you can mine various ores and smelt them into bars.',
  type: 'resource',
  levelRequired: 1,
  resources: [],
  category: 'mining',
  icon: '/assets/locations/quarry.png',
  availableSkills: ['mining', 'smithing'],
  actions: [
    // Mining actions - ordered by level required ascending
    {
      id: 'mine_copper',
      name: 'Mine Copper Ore',
      type: 'mining',
      skill: 'mining',
      levelRequired: 1,
      experience: 17.5,
      baseTime: 3000,
      itemReward: { id: 'copper_ore', name: 'Copper Ore', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'mining', level: 1 },
        { type: 'equipment', category: 'pickaxe' }
      ]
    },
    {
      id: 'mine_tin',
      name: 'Mine Tin Ore',
      type: 'mining',
      skill: 'mining',
      levelRequired: 1,
      experience: 17.5,
      baseTime: 3000,
      itemReward: { id: 'tin_ore', name: 'Tin Ore', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'mining', level: 1 },
        { type: 'equipment', category: 'pickaxe' }
      ]
    },
    {
      id: 'mine_iron',
      name: 'Mine Iron Ore',
      type: 'mining',
      skill: 'mining',
      levelRequired: 15,
      experience: 35,
      baseTime: 3000,
      itemReward: { id: 'iron_ore', name: 'Iron Ore', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'mining', level: 15 },
        { type: 'equipment', category: 'pickaxe' }
      ]
    },
    {
      id: 'mine_coal',
      name: 'Mine Coal',
      type: 'mining',
      skill: 'mining',
      levelRequired: 30,
      experience: 50,
      baseTime: 3000,
      itemReward: { id: 'coal', name: 'Coal', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'mining', level: 30 },
        { type: 'equipment', category: 'pickaxe' }
      ]
    },
    {
      id: 'mine_gold',
      name: 'Mine Gold Ore',
      type: 'mining',
      skill: 'mining',
      levelRequired: 40,
      experience: 65,
      baseTime: 3000,
      itemReward: { id: 'gold_ore', name: 'Gold Ore', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'mining', level: 40 },
        { type: 'equipment', category: 'pickaxe' }
      ]
    },
    {
      id: 'mine_mithril',
      name: 'Mine Mithril Ore',
      type: 'mining',
      skill: 'mining',
      levelRequired: 55,
      experience: 80,
      baseTime: 3000,
      itemReward: { id: 'mithril_ore', name: 'Mithril Ore', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'mining', level: 55 },
        { type: 'equipment', category: 'pickaxe' }
      ]
    },
    {
      id: 'mine_adamantite',
      name: 'Mine Adamantite Ore',
      type: 'mining',
      skill: 'mining',
      levelRequired: 70,
      experience: 95,
      baseTime: 3000,
      itemReward: { id: 'adamantite_ore', name: 'Adamantite Ore', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'mining', level: 70 },
        { type: 'equipment', category: 'pickaxe' }
      ]
    },
    {
      id: 'mine_runite',
      name: 'Mine Runite Ore',
      type: 'mining',
      skill: 'mining',
      levelRequired: 85,
      experience: 125,
      baseTime: 3000,
      itemReward: { id: 'runite_ore', name: 'Runite Ore', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'mining', level: 85 },
        { type: 'equipment', category: 'pickaxe' }
      ]
    },

    // Smelting actions - ordered by level required ascending
    {
      id: 'smelt_bronze_bar',
      name: 'Smelt Bronze Bar',
      type: 'smithing',
      skill: 'smithing',
      levelRequired: 1,
      experience: 6.2,
      baseTime: 3000,
      itemReward: { id: 'bronze_bar', name: 'Bronze Bar', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'smithing', level: 1 },
        { type: 'item', itemId: 'copper_ore', quantity: 1 },
        { type: 'item', itemId: 'tin_ore', quantity: 1 }
      ]
    },
    {
      id: 'smelt_iron_bar',
      name: 'Smelt Iron Bar',
      type: 'smithing',
      skill: 'smithing',
      levelRequired: 15,
      experience: 12.5,
      baseTime: 3000,
      itemReward: { id: 'iron_bar', name: 'Iron Bar', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'smithing', level: 15 },
        { type: 'item', itemId: 'iron_ore', quantity: 1 }
      ]
    },
    {
      id: 'smelt_steel_bar',
      name: 'Smelt Steel Bar',
      type: 'smithing',
      skill: 'smithing',
      levelRequired: 30,
      experience: 17.5,
      baseTime: 3000,
      itemReward: { id: 'steel_bar', name: 'Steel Bar', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'smithing', level: 30 },
        { type: 'item', itemId: 'iron_ore', quantity: 1 },
        { type: 'item', itemId: 'coal', quantity: 2 }
      ]
    },
    {
      id: 'smelt_gold_bar',
      name: 'Smelt Gold Bar',
      type: 'smithing',
      skill: 'smithing',
      levelRequired: 40,
      experience: 22.5,
      baseTime: 3000,
      itemReward: { id: 'gold_bar', name: 'Gold Bar', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'smithing', level: 40 },
        { type: 'item', itemId: 'gold_ore', quantity: 1 }
      ]
    },
    {
      id: 'smelt_mithril_bar',
      name: 'Smelt Mithril Bar',
      type: 'smithing',
      skill: 'smithing',
      levelRequired: 50,
      experience: 30,
      baseTime: 3000,
      itemReward: { id: 'mithril_bar', name: 'Mithril Bar', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'smithing', level: 50 },
        { type: 'item', itemId: 'mithril_ore', quantity: 1 },
        { type: 'item', itemId: 'coal', quantity: 4 }
      ]
    },
    {
      id: 'smelt_adamant_bar',
      name: 'Smelt Adamant Bar',
      type: 'smithing',
      skill: 'smithing',
      levelRequired: 70,
      experience: 37.5,
      baseTime: 3000,
      itemReward: { id: 'adamant_bar', name: 'Adamant Bar', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'smithing', level: 70 },
        { type: 'item', itemId: 'adamantite_ore', quantity: 1 },
        { type: 'item', itemId: 'coal', quantity: 6 }
      ]
    },
    {
      id: 'smelt_rune_bar',
      name: 'Smelt Rune Bar',
      type: 'smithing',
      skill: 'smithing',
      levelRequired: 85,
      experience: 50,
      baseTime: 3000,
      itemReward: { id: 'rune_bar', name: 'Rune Bar', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'smithing', level: 85 },
        { type: 'item', itemId: 'runite_ore', quantity: 1 },
        { type: 'item', itemId: 'coal', quantity: 8 }
      ]
    }
  ]
}; 