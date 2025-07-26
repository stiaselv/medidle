import type { Location, SkillAction } from '../../types/game';

export const forestLocation: Location = {
  id: 'forest',
  name: 'Forest',
  description: 'A dense forest with trees to cut and a peaceful fishing spot where you can catch various types of fish.',
  type: 'resource',
  levelRequired: 1,
  resources: [],
  category: 'woodcutting',
  icon: '/assets/locations/forest.png',
  availableSkills: ['woodcutting', 'fishing'],
  actions: [
    // Woodcutting actions
    {
      id: 'cut_normal_logs',
      name: 'Cut Normal Logs',
      type: 'woodcutting',
      skill: 'woodcutting',
      levelRequired: 1,
      experience: 25,
      baseTime: 3000,
      itemReward: { id: 'logs', name: 'Logs', quantity: 1 },
      requirements: []
    },
    {
      id: 'cut_oak_logs',
      name: 'Cut Oak Logs',
      type: 'woodcutting',
      skill: 'woodcutting',
      levelRequired: 15,
      experience: 37.5,
      baseTime: 3000,
      itemReward: { id: 'oak_logs', name: 'Oak Logs', quantity: 1 },
      requirements: []
    },
    {
      id: 'cut_willow_logs',
      name: 'Cut Willow Logs',
      type: 'woodcutting',
      skill: 'woodcutting',
      levelRequired: 30,
      experience: 67.5,
      baseTime: 3000,
      itemReward: { id: 'willow_logs', name: 'Willow Logs', quantity: 1 },
      requirements: []
    },
    {
      id: 'cut_maple_logs',
      name: 'Cut Maple Logs',
      type: 'woodcutting',
      skill: 'woodcutting',
      levelRequired: 45,
      experience: 100,
      baseTime: 3000,
      itemReward: { id: 'maple_logs', name: 'Maple Logs', quantity: 1 },
      requirements: []
    },
    {
      id: 'cut_yew_logs',
      name: 'Cut Yew Logs',
      type: 'woodcutting',
      skill: 'woodcutting',
      levelRequired: 60,
      experience: 175,
      baseTime: 3000,
      itemReward: { id: 'yew_logs', name: 'Yew Logs', quantity: 1 },
      requirements: []
    },
    {
      id: 'cut_magic_logs',
      name: 'Cut Magic Logs',
      type: 'woodcutting',
      skill: 'woodcutting',
      levelRequired: 75,
      experience: 250,
      baseTime: 3000,
      itemReward: { id: 'magic_logs', name: 'Magic Logs', quantity: 1 },
      requirements: []
    },
    {
      id: 'cut_redwood_logs',
      name: 'Cut Redwood Logs',
      type: 'woodcutting',
      skill: 'woodcutting',
      levelRequired: 90,
      experience: 380,
      baseTime: 3000,
      itemReward: { id: 'redwood_logs', name: 'Redwood Logs', quantity: 1 },
      requirements: []
    },
    {
      id: 'cut_teak_logs',
      name: 'Cut Teak Logs',
      type: 'woodcutting',
      skill: 'woodcutting',
      levelRequired: 35,
      experience: 85,
      baseTime: 3000,
      itemReward: { id: 'teak_logs', name: 'Teak Logs', quantity: 1 },
      requirements: []
    },
    {
      id: 'cut_mahogany_logs',
      name: 'Cut Mahogany Logs',
      type: 'woodcutting',
      skill: 'woodcutting',
      levelRequired: 50,
      experience: 125,
      baseTime: 3000,
      itemReward: { id: 'mahogany_logs', name: 'Mahogany Logs', quantity: 1 },
      requirements: []
    },

    // Fishing actions
    {
      id: 'fish_shrimp',
      name: 'Fish Shrimp',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 1,
      experience: 10,
      baseTime: 3000,
      itemReward: { id: 'raw_shrimp', name: 'Raw Shrimp', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'small_fishing_net', quantity: 1 }
      ]
    },
    {
      id: 'fish_sardine',
      name: 'Fish Sardine',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 5,
      experience: 20,
      baseTime: 3000,
      itemReward: { id: 'raw_sardine', name: 'Raw Sardine', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'small_fishing_net', quantity: 1 }
      ]
    },
    {
      id: 'fish_herring',
      name: 'Fish Herring',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 10,
      experience: 30,
      baseTime: 3000,
      itemReward: { id: 'raw_herring', name: 'Raw Herring', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'fishing_rod', quantity: 1 }
      ]
    },
    {
      id: 'fish_trout',
      name: 'Fish Trout',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 20,
      experience: 50,
      baseTime: 3000,
      itemReward: { id: 'raw_trout', name: 'Raw Trout', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'small_fishing_net', quantity: 1 }
      ]
    },
    {
      id: 'fish_pike',
      name: 'Fish Pike',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 25,
      experience: 60,
      baseTime: 3000,
      itemReward: { id: 'raw_pike', name: 'Raw Pike', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'fishing_rod', quantity: 1 }
      ]
    },
    {
      id: 'fish_salmon',
      name: 'Fish Salmon',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 30,
      experience: 70,
      baseTime: 3000,
      itemReward: { id: 'raw_salmon', name: 'Raw Salmon', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'harpoon', quantity: 1 }
      ]
    },
    {
      id: 'fish_tuna',
      name: 'Fish Tuna',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 35,
      experience: 80,
      baseTime: 3000,
      itemReward: { id: 'raw_tuna', name: 'Raw Tuna', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'harpoon', quantity: 1 }
      ]
    },
    {
      id: 'fish_lobster',
      name: 'Fish Lobster',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 40,
      experience: 90,
      baseTime: 3000,
      itemReward: { id: 'raw_lobster', name: 'Raw Lobster', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'lobster_pot', quantity: 1 }
      ]
    },
    {
      id: 'fish_bass',
      name: 'Fish Bass',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 46,
      experience: 100,
      baseTime: 3000,
      itemReward: { id: 'raw_bass', name: 'Raw Bass', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'big_net', quantity: 1 }
      ]
    },
    {
      id: 'fish_swordfish',
      name: 'Fish Swordfish',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 50,
      experience: 100,
      baseTime: 3000,
      itemReward: { id: 'raw_swordfish', name: 'Raw Swordfish', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'harpoon', quantity: 1 }
      ]
    },
    {
      id: 'fish_monkfish',
      name: 'Fish Monkfish',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 62,
      experience: 120,
      baseTime: 3000,
      itemReward: { id: 'raw_monkfish', name: 'Raw Monkfish', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'small_fishing_net', quantity: 1 }
      ]
    },
    {
      id: 'fish_shark',
      name: 'Fish Shark',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 76,
      experience: 110,
      baseTime: 3000,
      itemReward: { id: 'raw_shark', name: 'Raw Shark', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'harpoon', quantity: 1 }
      ]
    },
    {
      id: 'fish_anglerfish',
      name: 'Fish Anglerfish',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 82,
      experience: 120,
      baseTime: 3000,
      itemReward: { id: 'raw_anglerfish', name: 'Raw Anglerfish', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'harpoon', quantity: 1 }
      ]
    },
    {
      id: 'fish_dark_crab',
      name: 'Fish Dark Crab',
      type: 'fishing',
      skill: 'fishing',
      levelRequired: 85,
      experience: 130,
      baseTime: 3000,
      itemReward: { id: 'raw_dark_crab', name: 'Raw Dark Crab', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'lobster_pot', quantity: 1 }
      ]
    }
  ]
}; 