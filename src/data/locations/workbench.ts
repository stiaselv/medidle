import type { Location, SkillAction } from '../../types/game';

export const workbenchLocation: Location = {
  id: 'workbench',
  name: 'Workbench',
  description: 'A sturdy workbench for crafting and fletching various items.',
  type: 'resource',
  levelRequired: 1,
  resources: [],
  category: 'crafting',
  icon: '/assets/locations/workbench.png',
  availableSkills: ['crafting', 'fletching'],
  actions: [
    // --- CRAFTING ACTIONS ---
    
    // --- ARMOR ---
    {
      id: 'craft_leather_gloves',
      name: 'Craft Leather Gloves',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 1,
      experience: 13.8,
      baseTime: 3000,
      itemReward: { id: 'leather_gloves', name: 'Leather Gloves', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'cowhide', quantity: 1 }
      ]
    },
    {
      id: 'craft_leather_boots',
      name: 'Craft Leather Boots',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 5,
      experience: 16.3,
      baseTime: 3000,
      itemReward: { id: 'leather_boots', name: 'Leather Boots', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'cowhide', quantity: 1 }
      ]
    },
    {
      id: 'craft_leather_coif',
      name: 'Craft Leather Coif',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 9,
      experience: 18.5,
      baseTime: 3000,
      itemReward: { id: 'leather_coif', name: 'Leather Coif', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'cowhide', quantity: 1 }
      ]
    },
    {
      id: 'craft_leather_vambraces',
      name: 'Craft Leather Vambraces',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 11,
      experience: 22.0,
      baseTime: 3000,
      itemReward: { id: 'leather_vambraces', name: 'Leather Vambraces', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'cowhide', quantity: 1 }
      ]
    },
    {
      id: 'craft_leather_body',
      name: 'Craft Leather Body',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 14,
      experience: 25.0,
      baseTime: 4000,
      itemReward: { id: 'leather_body', name: 'Leather Body', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'cowhide', quantity: 3 }
      ]
    },
    {
      id: 'craft_leather_chaps',
      name: 'Craft Leather Chaps',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 18,
      experience: 27.0,
      baseTime: 4000,
      itemReward: { id: 'leather_chaps', name: 'Leather Chaps', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'cowhide', quantity: 3 }
      ]
    },
    {
      id: 'craft_green_dragonhide_coif',
      name: 'Craft Green Dragonhide Coif',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 53,
      experience: 124.0,
      baseTime: 3000,
      itemReward: { id: 'green_dragonhide_coif', name: 'Green Dragonhide Coif', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'green_dragonhide', quantity: 1 }
      ]
    },
    {
      id: 'craft_green_dragonhide_vambraces',
      name: 'Craft Green Dragonhide Vambraces',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 57,
      experience: 136.0,
      baseTime: 3000,
      itemReward: { id: 'green_dragonhide_vambraces', name: 'Green Dragonhide Vambraces', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'green_dragonhide', quantity: 1 }
      ]
    },
    {
      id: 'craft_green_dragonhide_chaps',
      name: 'Craft Green Dragonhide Chaps',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 60,
      experience: 186.0,
      baseTime: 4000,
      itemReward: { id: 'green_dragonhide_chaps', name: 'Green Dragonhide Chaps', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'green_dragonhide', quantity: 2 }
      ]
    },
    {
      id: 'craft_green_dragonhide_shield',
      name: 'Craft Green Dragonhide Shield',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 62,
      experience: 186.0,
      baseTime: 4000,
      itemReward: { id: 'green_dragonhide_shield', name: 'Green Dragonhide Shield', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'green_dragonhide', quantity: 2 },
        { type: 'item', itemId: 'maple_shield', quantity: 1 },
        { type: 'item', itemId: 'steel_nails', quantity: 15 }
      ]
    },
    {
      id: 'craft_green_dragonhide_body',
      name: 'Craft Green Dragonhide Body',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 63,
      experience: 210.0,
      baseTime: 5000,
      itemReward: { id: 'green_dragonhide_body', name: 'Green Dragonhide Body', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'green_dragonhide', quantity: 3 }
      ]
    },
    {
      id: 'craft_blue_dragonhide_coif',
      name: 'Craft Blue Dragonhide Coif',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 66,
      experience: 140.0,
      baseTime: 3000,
      itemReward: { id: 'blue_dragonhide_coif', name: 'Blue Dragonhide Coif', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'blue_dragonhide', quantity: 1 }
      ]
    },
    {
      id: 'craft_blue_dragonhide_vambraces',
      name: 'Craft Blue Dragonhide Vambraces',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 68,
      experience: 156.0,
      baseTime: 3000,
      itemReward: { id: 'blue_dragonhide_vambraces', name: 'Blue Dragonhide Vambraces', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'blue_dragonhide', quantity: 1 }
      ]
    },
    {
      id: 'craft_blue_dragonhide_chaps',
      name: 'Craft Blue Dragonhide Chaps',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 70,
      experience: 210.0,
      baseTime: 4000,
      itemReward: { id: 'blue_dragonhide_chaps', name: 'Blue Dragonhide Chaps', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'blue_dragonhide', quantity: 2 }
      ]
    },
    {
      id: 'craft_blue_dragonhide_shield',
      name: 'Craft Blue Dragonhide Shield',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 71,
      experience: 210.0,
      baseTime: 4000,
      itemReward: { id: 'blue_dragonhide_shield', name: 'Blue Dragonhide Shield', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'blue_dragonhide', quantity: 2 },
        { type: 'item', itemId: 'yew_shield', quantity: 1 },
        { type: 'item', itemId: 'mithril_nails', quantity: 15 }
      ]
    },
    {
      id: 'craft_blue_dragonhide_body',
      name: 'Craft Blue Dragonhide Body',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 73,
      experience: 235.0,
      baseTime: 5000,
      itemReward: { id: 'blue_dragonhide_body', name: 'Blue Dragonhide Body', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'blue_dragonhide', quantity: 3 }
      ]
    },
    {
      id: 'craft_red_dragonhide_coif',
      name: 'Craft Red Dragonhide Coif',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 75,
      experience: 156.0,
      baseTime: 3000,
      itemReward: { id: 'red_dragonhide_coif', name: 'Red Dragonhide Coif', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'red_dragonhide', quantity: 1 }
      ]
    },
    {
      id: 'craft_red_dragonhide_vambraces',
      name: 'Craft Red Dragonhide Vambraces',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 76,
      experience: 168.0,
      baseTime: 3000,
      itemReward: { id: 'red_dragonhide_vambraces', name: 'Red Dragonhide Vambraces', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'red_dragonhide', quantity: 1 }
      ]
    },
    {
      id: 'craft_red_dragonhide_chaps',
      name: 'Craft Red Dragonhide Chaps',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 77,
      experience: 234.0,
      baseTime: 4000,
      itemReward: { id: 'red_dragonhide_chaps', name: 'Red Dragonhide Chaps', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'red_dragonhide', quantity: 2 }
      ]
    },
    {
      id: 'craft_red_dragonhide_shield',
      name: 'Craft Red Dragonhide Shield',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 79,
      experience: 234.0,
      baseTime: 4000,
      itemReward: { id: 'red_dragonhide_shield', name: 'Red Dragonhide Shield', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'red_dragonhide', quantity: 2 },
        { type: 'item', itemId: 'magic_shield', quantity: 1 },
        { type: 'item', itemId: 'adamant_nails', quantity: 15 }
      ]
    },
    {
      id: 'craft_red_dragonhide_body',
      name: 'Craft Red Dragonhide Body',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 81,
      experience: 260.0,
      baseTime: 5000,
      itemReward: { id: 'red_dragonhide_body', name: 'Red Dragonhide Body', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'red_dragonhide', quantity: 3 }
      ]
    },
    {
      id: 'craft_black_dragonhide_coif',
      name: 'Craft Black Dragonhide Coif',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 83,
      experience: 168.0,
      baseTime: 3000,
      itemReward: { id: 'black_dragonhide_coif', name: 'Black Dragonhide Coif', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'black_dragonhide', quantity: 1 }
      ]
    },
    {
      id: 'craft_black_dragonhide_vambraces',
      name: 'Craft Black Dragonhide Vambraces',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 85,
      experience: 184.0,
      baseTime: 3000,
      itemReward: { id: 'black_dragonhide_vambraces', name: 'Black Dragonhide Vambraces', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'black_dragonhide', quantity: 1 }
      ]
    },
    {
      id: 'craft_black_dragonhide_chaps',
      name: 'Craft Black Dragonhide Chaps',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 86,
      experience: 258.0,
      baseTime: 4000,
      itemReward: { id: 'black_dragonhide_chaps', name: 'Black Dragonhide Chaps', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'black_dragonhide', quantity: 2 }
      ]
    },
    {
      id: 'craft_black_dragonhide_shield',
      name: 'Craft Black Dragonhide Shield',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 87,
      experience: 258.0,
      baseTime: 4000,
      itemReward: { id: 'black_dragonhide_shield', name: 'Black Dragonhide Shield', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'black_dragonhide', quantity: 2 },
        { type: 'item', itemId: 'redwood_shield', quantity: 1 },
        { type: 'item', itemId: 'rune_nails', quantity: 15 }
      ]
    },
    {
      id: 'craft_black_dragonhide_body',
      name: 'Craft Black Dragonhide Body',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 89,
      experience: 286.0,
      baseTime: 5000,
      itemReward: { id: 'black_dragonhide_body', name: 'Black Dragonhide Body', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'black_dragonhide', quantity: 3 }
      ]
    },

    // --- JEWELRY ---
    {
      id: 'craft_sapphire_silver_ring',
      name: 'Craft Sapphire Silver Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 21,
      experience: 17.5,
      baseTime: 3000,
      itemReward: { id: 'sapphire_silver_ring', name: 'Sapphire Silver Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'sapphire', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_sapphire_gold_ring',
      name: 'Craft Sapphire Gold Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 23,
      experience: 17.5,
      baseTime: 3000,
      itemReward: { id: 'sapphire_gold_ring', name: 'Sapphire Gold Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'sapphire', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_sapphire_silver_amulet',
      name: 'Craft Sapphire Silver Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 25,
      experience: 17.5,
      baseTime: 3000,
      itemReward: { id: 'sapphire_silver_amulet', name: 'Sapphire Silver Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'sapphire', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_sapphire_gold_amulet',
      name: 'Craft Sapphire Gold Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 27,
      experience: 17.5,
      baseTime: 3000,
      itemReward: { id: 'sapphire_gold_amulet', name: 'Sapphire Gold Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'sapphire', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_emerald_silver_ring',
      name: 'Craft Emerald Silver Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 31,
      experience: 37.0,
      baseTime: 3000,
      itemReward: { id: 'emerald_silver_ring', name: 'Emerald Silver Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'emerald', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_emerald_gold_ring',
      name: 'Craft Emerald Gold Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 33,
      experience: 37.0,
      baseTime: 3000,
      itemReward: { id: 'emerald_gold_ring', name: 'Emerald Gold Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'emerald', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_emerald_silver_amulet',
      name: 'Craft Emerald Silver Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 35,
      experience: 37.0,
      baseTime: 3000,
      itemReward: { id: 'emerald_silver_amulet', name: 'Emerald Silver Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'emerald', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_emerald_gold_amulet',
      name: 'Craft Emerald Gold Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 37,
      experience: 37.0,
      baseTime: 3000,
      itemReward: { id: 'emerald_gold_amulet', name: 'Emerald Gold Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'emerald', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_ruby_silver_ring',
      name: 'Craft Ruby Silver Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 41,
      experience: 59.0,
      baseTime: 3000,
      itemReward: { id: 'ruby_silver_ring', name: 'Ruby Silver Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'ruby', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_ruby_gold_ring',
      name: 'Craft Ruby Gold Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 43,
      experience: 59.0,
      baseTime: 3000,
      itemReward: { id: 'ruby_gold_ring', name: 'Ruby Gold Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'ruby', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_ruby_silver_amulet',
      name: 'Craft Ruby Silver Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 45,
      experience: 59.0,
      baseTime: 3000,
      itemReward: { id: 'ruby_silver_amulet', name: 'Ruby Silver Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'ruby', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_ruby_gold_amulet',
      name: 'Craft Ruby Gold Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 47,
      experience: 59.0,
      baseTime: 3000,
      itemReward: { id: 'ruby_gold_amulet', name: 'Ruby Gold Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'ruby', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_diamond_silver_ring',
      name: 'Craft Diamond Silver Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 51,
      experience: 67.0,
      baseTime: 3000,
      itemReward: { id: 'diamond_silver_ring', name: 'Diamond Silver Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'diamond', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_diamond_gold_ring',
      name: 'Craft Diamond Gold Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 53,
      experience: 67.0,
      baseTime: 3000,
      itemReward: { id: 'diamond_gold_ring', name: 'Diamond Gold Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'diamond', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_diamond_silver_amulet',
      name: 'Craft Diamond Silver Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 55,
      experience: 67.0,
      baseTime: 3000,
      itemReward: { id: 'diamond_silver_amulet', name: 'Diamond Silver Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'diamond', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_diamond_gold_amulet',
      name: 'Craft Diamond Gold Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 57,
      experience: 67.0,
      baseTime: 3000,
      itemReward: { id: 'diamond_gold_amulet', name: 'Diamond Gold Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'diamond', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_dragonstone_silver_ring',
      name: 'Craft Dragonstone Silver Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 71,
      experience: 137.5,
      baseTime: 3000,
      itemReward: { id: 'dragonstone_silver_ring', name: 'Dragonstone Silver Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'dragonstone', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_dragonstone_gold_ring',
      name: 'Craft Dragonstone Gold Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 73,
      experience: 137.5,
      baseTime: 3000,
      itemReward: { id: 'dragonstone_gold_ring', name: 'Dragonstone Gold Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'dragonstone', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_dragonstone_silver_amulet',
      name: 'Craft Dragonstone Silver Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 77,
      experience: 137.5,
      baseTime: 3000,
      itemReward: { id: 'dragonstone_silver_amulet', name: 'Dragonstone Silver Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'dragonstone', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_dragonstone_gold_amulet',
      name: 'Craft Dragonstone Gold Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 80,
      experience: 137.5,
      baseTime: 3000,
      itemReward: { id: 'dragonstone_gold_amulet', name: 'Dragonstone Gold Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'dragonstone', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_onyx_silver_ring',
      name: 'Craft Onyx Silver Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 84,
      experience: 167.5,
      baseTime: 3000,
      itemReward: { id: 'onyx_silver_ring', name: 'Onyx Silver Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'onyx', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_onyx_gold_ring',
      name: 'Craft Onyx Gold Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 87,
      experience: 167.5,
      baseTime: 3000,
      itemReward: { id: 'onyx_gold_ring', name: 'Onyx Gold Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'onyx', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_onyx_silver_amulet',
      name: 'Craft Onyx Silver Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 88,
      experience: 167.5,
      baseTime: 3000,
      itemReward: { id: 'onyx_silver_amulet', name: 'Onyx Silver Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'onyx', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_onyx_gold_amulet',
      name: 'Craft Onyx Gold Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 90,
      experience: 167.5,
      baseTime: 3000,
      itemReward: { id: 'onyx_gold_amulet', name: 'Onyx Gold Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'onyx', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_zenyte_silver_ring',
      name: 'Craft Zenyte Silver Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 92,
      experience: 200.0,
      baseTime: 3000,
      itemReward: { id: 'zenyte_silver_ring', name: 'Zenyte Silver Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'zenyte', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_zenyte_gold_ring',
      name: 'Craft Zenyte Gold Ring',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 93,
      experience: 200.0,
      baseTime: 3000,
      itemReward: { id: 'zenyte_gold_ring', name: 'Zenyte Gold Ring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'zenyte', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_zenyte_silver_amulet',
      name: 'Craft Zenyte Silver Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 97,
      experience: 200.0,
      baseTime: 3000,
      itemReward: { id: 'zenyte_silver_amulet', name: 'Zenyte Silver Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'zenyte', quantity: 1 },
        { type: 'item', itemId: 'silver_bar', quantity: 1 }
      ]
    },
    {
      id: 'craft_zenyte_gold_amulet',
      name: 'Craft Zenyte Gold Amulet',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 98,
      experience: 200.0,
      baseTime: 3000,
      itemReward: { id: 'zenyte_gold_amulet', name: 'Zenyte Gold Amulet', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'zenyte', quantity: 1 },
        { type: 'item', itemId: 'gold_bar', quantity: 1 }
      ]
    },

    // --- STAVES ---
    {
      id: 'craft_water_battlestaff',
      name: 'Craft Water Battlestaff',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 54,
      experience: 100.0,
      baseTime: 4000,
      itemReward: { id: 'water_battlestaff', name: 'Water Battlestaff', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'battlestaff', quantity: 1 },
        { type: 'item', itemId: 'water_orb', quantity: 1 }
      ]
    },
    {
      id: 'craft_earth_battlestaff',
      name: 'Craft Earth Battlestaff',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 58,
      experience: 112.5,
      baseTime: 4000,
      itemReward: { id: 'earth_battlestaff', name: 'Earth Battlestaff', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'battlestaff', quantity: 1 },
        { type: 'item', itemId: 'earth_orb', quantity: 1 }
      ]
    },
    {
      id: 'craft_fire_battlestaff',
      name: 'Craft Fire Battlestaff',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 62,
      experience: 125.0,
      baseTime: 4000,
      itemReward: { id: 'fire_battlestaff', name: 'Fire Battlestaff', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'battlestaff', quantity: 1 },
        { type: 'item', itemId: 'fire_orb', quantity: 1 }
      ]
    },
    {
      id: 'craft_air_battlestaff',
      name: 'Craft Air Battlestaff',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 66,
      experience: 137.5,
      baseTime: 4000,
      itemReward: { id: 'air_battlestaff', name: 'Air Battlestaff', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'battlestaff', quantity: 1 },
        { type: 'item', itemId: 'air_orb', quantity: 1 }
      ]
    },

    // --- GEMS ---
    {
      id: 'cut_sapphire',
      name: 'Cut Sapphire',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 20,
      experience: 50.0,
      baseTime: 2000,
      itemReward: { id: 'sapphire', name: 'Sapphire', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'uncut_sapphire', quantity: 1 }
      ]
    },
    {
      id: 'cut_emerald',
      name: 'Cut Emerald',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 30,
      experience: 67.5,
      baseTime: 2000,
      itemReward: { id: 'emerald', name: 'Emerald', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'uncut_emerald', quantity: 1 }
      ]
    },
    {
      id: 'cut_ruby',
      name: 'Cut Ruby',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 36,
      experience: 85.0,
      baseTime: 2000,
      itemReward: { id: 'ruby', name: 'Ruby', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'uncut_ruby', quantity: 1 }
      ]
    },
    {
      id: 'cut_diamond',
      name: 'Cut Diamond',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 45,
      experience: 107.5,
      baseTime: 2000,
      itemReward: { id: 'diamond', name: 'Diamond', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'uncut_diamond', quantity: 1 }
      ]
    },
    {
      id: 'cut_dragonstone',
      name: 'Cut Dragonstone',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 65,
      experience: 137.5,
      baseTime: 2000,
      itemReward: { id: 'dragonstone', name: 'Dragonstone', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'uncut_dragonstone', quantity: 1 }
      ]
    },
    {
      id: 'cut_onyx',
      name: 'Cut Onyx',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 77,
      experience: 167.5,
      baseTime: 2000,
      itemReward: { id: 'onyx', name: 'Onyx', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'uncut_onyx', quantity: 1 }
      ]
    },
    {
      id: 'cut_zenyte',
      name: 'Cut Zenyte',
      type: 'crafting',
      skill: 'crafting',
      levelRequired: 90,
      experience: 200.0,
      baseTime: 2000,
      itemReward: { id: 'zenyte', name: 'Zenyte', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'onyx', quantity: 1 },
        { type: 'item', itemId: 'uncut_zenyte', quantity: 1 }
      ]
    },

    // --- FLETCHING ACTIONS (EXISTING) ---
    
    // --- Arrows ---
    {
      id: 'fletch_arrow_shafts',
      name: 'Fletch Arrow Shafts',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 1,
      experience: 5,
      baseTime: 2000,
      itemReward: { id: 'arrow_shafts', name: 'Arrow Shafts', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'logs', quantity: 1 }
      ]
    },
    {
      id: 'fletch_headless_arrows',
      name: 'Fletch Headless Arrows',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 1,
      experience: 5,
      baseTime: 2000,
      itemReward: { id: 'headless_arrows', name: 'Headless Arrows', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'arrow_shafts', quantity: 15 },
        { type: 'item', itemId: 'feathers', quantity: 15 }
      ]
    },
    {
      id: 'fletch_bronze_arrows',
      name: 'Fletch Bronze Arrows',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 1,
      experience: 10,
      baseTime: 2000,
      itemReward: { id: 'bronze_arrows', name: 'Bronze Arrows', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'headless_arrows', quantity: 15 },
        { type: 'item', itemId: 'bronze_arrowtips', quantity: 15 }
      ]
    },
    {
      id: 'fletch_iron_arrows',
      name: 'Fletch Iron Arrows',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 15,
      experience: 15,
      baseTime: 2000,
      itemReward: { id: 'iron_arrows', name: 'Iron Arrows', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'headless_arrows', quantity: 15 },
        { type: 'item', itemId: 'iron_arrowtips', quantity: 15 }
      ]
    },
    {
      id: 'fletch_steel_arrows',
      name: 'Fletch Steel Arrows',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 30,
      experience: 20,
      baseTime: 2000,
      itemReward: { id: 'steel_arrows', name: 'Steel Arrows', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'headless_arrows', quantity: 15 },
        { type: 'item', itemId: 'steel_arrowtips', quantity: 15 }
      ]
    },
    {
      id: 'fletch_mithril_arrows',
      name: 'Fletch Mithril Arrows',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 45,
      experience: 25,
      baseTime: 2000,
      itemReward: { id: 'mithril_arrows', name: 'Mithril Arrows', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'headless_arrows', quantity: 15 },
        { type: 'item', itemId: 'mithril_arrowtips', quantity: 15 }
      ]
    },
    {
      id: 'fletch_adamant_arrows',
      name: 'Fletch Adamant Arrows',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 60,
      experience: 30,
      baseTime: 2000,
      itemReward: { id: 'adamant_arrows', name: 'Adamant Arrows', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'headless_arrows', quantity: 15 },
        { type: 'item', itemId: 'adamant_arrowtips', quantity: 15 }
      ]
    },
    {
      id: 'fletch_rune_arrows',
      name: 'Fletch Rune Arrows',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 75,
      experience: 40,
      baseTime: 2000,
      itemReward: { id: 'rune_arrows', name: 'Rune Arrows', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'headless_arrows', quantity: 15 },
        { type: 'item', itemId: 'rune_arrowtips', quantity: 15 }
      ]
    },
    
    // --- Bows ---
    // Oak
    {
      id: 'fletch_oak_shortbow_u',
      name: 'Fletch Oak Shortbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 5,
      experience: 10,
      baseTime: 3000,
      itemReward: { id: 'unstrung_oak_shortbow', name: 'Unstrung Oak Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'oak_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_oak_shortbow',
      name: 'String Oak Shortbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 5,
      experience: 10,
      baseTime: 3000,
      itemReward: { id: 'oak_shortbow', name: 'Oak Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_oak_shortbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    {
      id: 'fletch_oak_longbow_u',
      name: 'Fletch Oak Longbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 5,
      experience: 15,
      baseTime: 3500,
      itemReward: { id: 'unstrung_oak_longbow', name: 'Unstrung Oak Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'oak_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_oak_longbow',
      name: 'String Oak Longbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 5,
      experience: 15,
      baseTime: 3500,
      itemReward: { id: 'oak_longbow', name: 'Oak Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_oak_longbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    
    // Willow
    {
      id: 'fletch_willow_shortbow_u',
      name: 'Fletch Willow Shortbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 10,
      experience: 15,
      baseTime: 3000,
      itemReward: { id: 'unstrung_willow_shortbow', name: 'Unstrung Willow Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'willow_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_willow_shortbow',
      name: 'String Willow Shortbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 10,
      experience: 15,
      baseTime: 3000,
      itemReward: { id: 'willow_shortbow', name: 'Willow Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_willow_shortbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    {
      id: 'fletch_willow_longbow_u',
      name: 'Fletch Willow Longbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 10,
      experience: 20,
      baseTime: 3500,
      itemReward: { id: 'unstrung_willow_longbow', name: 'Unstrung Willow Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'willow_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_willow_longbow',
      name: 'String Willow Longbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 10,
      experience: 20,
      baseTime: 3500,
      itemReward: { id: 'willow_longbow', name: 'Willow Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_willow_longbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    
    // Maple
    {
      id: 'fletch_maple_shortbow_u',
      name: 'Fletch Maple Shortbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 20,
      experience: 25,
      baseTime: 3000,
      itemReward: { id: 'unstrung_maple_shortbow', name: 'Unstrung Maple Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'maple_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_maple_shortbow',
      name: 'String Maple Shortbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 20,
      experience: 25,
      baseTime: 3000,
      itemReward: { id: 'maple_shortbow', name: 'Maple Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_maple_shortbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    {
      id: 'fletch_maple_longbow_u',
      name: 'Fletch Maple Longbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 20,
      experience: 32.5,
      baseTime: 3500,
      itemReward: { id: 'unstrung_maple_longbow', name: 'Unstrung Maple Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'maple_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_maple_longbow',
      name: 'String Maple Longbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 20,
      experience: 32.5,
      baseTime: 3500,
      itemReward: { id: 'maple_longbow', name: 'Maple Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_maple_longbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    
    // Yew
    {
      id: 'fletch_yew_shortbow_u',
      name: 'Fletch Yew Shortbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 30,
      experience: 40,
      baseTime: 3000,
      itemReward: { id: 'unstrung_yew_shortbow', name: 'Unstrung Yew Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'yew_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_yew_shortbow',
      name: 'String Yew Shortbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 30,
      experience: 40,
      baseTime: 3000,
      itemReward: { id: 'yew_shortbow', name: 'Yew Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_yew_shortbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    {
      id: 'fletch_yew_longbow_u',
      name: 'Fletch Yew Longbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 30,
      experience: 50,
      baseTime: 3500,
      itemReward: { id: 'unstrung_yew_longbow', name: 'Unstrung Yew Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'yew_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_yew_longbow',
      name: 'String Yew Longbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 30,
      experience: 50,
      baseTime: 3500,
      itemReward: { id: 'yew_longbow', name: 'Yew Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_yew_longbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    
    // Magic
    {
      id: 'fletch_magic_shortbow_u',
      name: 'Fletch Magic Shortbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 40,
      experience: 55,
      baseTime: 3000,
      itemReward: { id: 'unstrung_magic_shortbow', name: 'Unstrung Magic Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'magic_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_magic_shortbow',
      name: 'String Magic Shortbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 40,
      experience: 55,
      baseTime: 3000,
      itemReward: { id: 'magic_shortbow', name: 'Magic Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_magic_shortbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    {
      id: 'fletch_magic_longbow_u',
      name: 'Fletch Magic Longbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 40,
      experience: 70,
      baseTime: 3500,
      itemReward: { id: 'unstrung_magic_longbow', name: 'Unstrung Magic Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'magic_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_magic_longbow',
      name: 'String Magic Longbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 40,
      experience: 70,
      baseTime: 3500,
      itemReward: { id: 'magic_longbow', name: 'Magic Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_magic_longbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    
    // Redwood
    {
      id: 'fletch_redwood_shortbow_u',
      name: 'Fletch Redwood Shortbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 60,
      experience: 80,
      baseTime: 3000,
      itemReward: { id: 'unstrung_redwood_shortbow', name: 'Unstrung Redwood Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'redwood_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_redwood_shortbow',
      name: 'String Redwood Shortbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 60,
      experience: 80,
      baseTime: 3000,
      itemReward: { id: 'redwood_shortbow', name: 'Redwood Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_redwood_shortbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    {
      id: 'fletch_redwood_longbow_u',
      name: 'Fletch Redwood Longbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 60,
      experience: 90,
      baseTime: 3500,
      itemReward: { id: 'unstrung_redwood_longbow', name: 'Unstrung Redwood Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'redwood_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_redwood_longbow',
      name: 'String Redwood Longbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 60,
      experience: 90,
      baseTime: 3500,
      itemReward: { id: 'redwood_longbow', name: 'Redwood Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_redwood_longbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    
    // Teak
    {
      id: 'fletch_teak_shortbow_u',
      name: 'Fletch Teak Shortbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 35,
      experience: 30,
      baseTime: 3000,
      itemReward: { id: 'unstrung_teak_shortbow', name: 'Unstrung Teak Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'teak_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_teak_shortbow',
      name: 'String Teak Shortbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 35,
      experience: 30,
      baseTime: 3000,
      itemReward: { id: 'teak_shortbow', name: 'Teak Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_teak_shortbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    {
      id: 'fletch_teak_longbow_u',
      name: 'Fletch Teak Longbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 35,
      experience: 35,
      baseTime: 3500,
      itemReward: { id: 'unstrung_teak_longbow', name: 'Unstrung Teak Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'teak_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_teak_longbow',
      name: 'String Teak Longbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 35,
      experience: 35,
      baseTime: 3500,
      itemReward: { id: 'teak_longbow', name: 'Teak Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_teak_longbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    
    // Mahogany
    {
      id: 'fletch_mahogany_shortbow_u',
      name: 'Fletch Mahogany Shortbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 45,
      experience: 50,
      baseTime: 3000,
      itemReward: { id: 'unstrung_mahogany_shortbow', name: 'Unstrung Mahogany Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'mahogany_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_mahogany_shortbow',
      name: 'String Mahogany Shortbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 45,
      experience: 50,
      baseTime: 3000,
      itemReward: { id: 'mahogany_shortbow', name: 'Mahogany Shortbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_mahogany_shortbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    {
      id: 'fletch_mahogany_longbow_u',
      name: 'Fletch Mahogany Longbow (u)',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 45,
      experience: 55,
      baseTime: 3500,
      itemReward: { id: 'unstrung_mahogany_longbow', name: 'Unstrung Mahogany Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'mahogany_logs', quantity: 1 }
      ]
    },
    {
      id: 'string_mahogany_longbow',
      name: 'String Mahogany Longbow',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 45,
      experience: 55,
      baseTime: 3500,
      itemReward: { id: 'mahogany_longbow', name: 'Mahogany Longbow', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'unstrung_mahogany_longbow', quantity: 1 },
        { type: 'item', itemId: 'bow_string', quantity: 1 }
      ]
    },
    
    // --- JAVELINS ---
    {
      id: 'fletch_javelin_shafts',
      name: 'Fletch Javelin Shafts',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 5,
      experience: 15,
      baseTime: 2500,
      itemReward: { id: 'javelin_shafts', name: 'Javelin Shafts', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'logs', quantity: 1 }
      ]
    },
    {
      id: 'fletch_bronze_javelin',
      name: 'Fletch Bronze Javelin',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 7,
      experience: 20,
      baseTime: 3000,
      itemReward: { id: 'bronze_javelin', name: 'Bronze Javelin', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'javelin_shafts', quantity: 15 },
        { type: 'item', itemId: 'bronze_javelin_heads', quantity: 15 }
      ]
    },
    {
      id: 'fletch_iron_javelin',
      name: 'Fletch Iron Javelin',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 17,
      experience: 30,
      baseTime: 3000,
      itemReward: { id: 'iron_javelin', name: 'Iron Javelin', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'javelin_shafts', quantity: 15 },
        { type: 'item', itemId: 'iron_javelin_heads', quantity: 15 }
      ]
    },
    {
      id: 'fletch_steel_javelin',
      name: 'Fletch Steel Javelin',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 32,
      experience: 45,
      baseTime: 3000,
      itemReward: { id: 'steel_javelin', name: 'Steel Javelin', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'javelin_shafts', quantity: 15 },
        { type: 'item', itemId: 'steel_javelin_heads', quantity: 15 }
      ]
    },
    {
      id: 'fletch_mithril_javelin',
      name: 'Fletch Mithril Javelin',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 47,
      experience: 60,
      baseTime: 3000,
      itemReward: { id: 'mithril_javelin', name: 'Mithril Javelin', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'javelin_shafts', quantity: 15 },
        { type: 'item', itemId: 'mithril_javelin_heads', quantity: 15 }
      ]
    },
    {
      id: 'fletch_adamant_javelin',
      name: 'Fletch Adamant Javelin',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 62,
      experience: 75,
      baseTime: 3000,
      itemReward: { id: 'adamant_javelin', name: 'Adamant Javelin', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'javelin_shafts', quantity: 15 },
        { type: 'item', itemId: 'adamant_javelin_heads', quantity: 15 }
      ]
    },
    {
      id: 'fletch_rune_javelin',
      name: 'Fletch Rune Javelin',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 77,
      experience: 90,
      baseTime: 3000,
      itemReward: { id: 'rune_javelin', name: 'Rune Javelin', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'javelin_shafts', quantity: 15 },
        { type: 'item', itemId: 'rune_javelin_heads', quantity: 15 }
      ]
    },
    {
      id: 'fletch_amethyst_javelin',
      name: 'Fletch Amethyst Javelin',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 84,
      experience: 105,
      baseTime: 3000,
      itemReward: { id: 'amethyst_javelin', name: 'Amethyst Javelin', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'javelin_shafts', quantity: 15 },
        { type: 'item', itemId: 'amethyst_javelin_heads', quantity: 15 }
      ]
    },
    {
      id: 'fletch_dragon_javelin',
      name: 'Fletch Dragon Javelin',
      type: 'fletching',
      skill: 'fletching',
      levelRequired: 92,
      experience: 120,
      baseTime: 3000,
      itemReward: { id: 'dragon_javelin', name: 'Dragon Javelin', quantity: 15 },
      requirements: [
        { type: 'item', itemId: 'javelin_shafts', quantity: 15 },
        { type: 'item', itemId: 'dragon_javelin_heads', quantity: 15 }
      ]
    }
  ]
}; 