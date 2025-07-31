import type { Location, SkillAction } from '../../types/game';

export const campLocation: Location = {
  id: 'camp',
  name: 'Camp',
  description: 'A cozy camp where you can cook food and make fires.',
  type: 'resource',
  levelRequired: 1,
  resources: [],
  category: 'cooking',
  icon: '/assets/locations/camp.png',
  availableSkills: ['cooking', 'firemaking'],
  actions: [
    // Cooking actions - ordered by level required ascending
    {
      id: 'cook_shrimp',
      name: 'Cook Shrimp',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 1,
      experience: 30,
      baseTime: 2000,
      itemReward: { id: 'cooked_shrimp', name: 'Cooked Shrimp', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 1 },
        { type: 'item', itemId: 'raw_shrimp', quantity: 1 }
      ]
    },
    {
      id: 'cook_sardine',
      name: 'Cook Sardine',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 1,
      experience: 40,
      baseTime: 2000,
      itemReward: { id: 'cooked_sardine', name: 'Cooked Sardine', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 1 },
        { type: 'item', itemId: 'raw_sardine', quantity: 1 }
      ]
    },
    {
      id: 'cook_anchovies',
      name: 'Cook Anchovies',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 1,
      experience: 30,
      baseTime: 2000,
      itemReward: { id: 'cooked_anchovies', name: 'Cooked Anchovies', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 1 },
        { type: 'item', itemId: 'raw_anchovies', quantity: 1 }
      ]
    },
    {
      id: 'cook_herring',
      name: 'Cook Herring',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 5,
      experience: 50,
      baseTime: 2000,
      itemReward: { id: 'cooked_herring', name: 'Cooked Herring', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 5 },
        { type: 'item', itemId: 'raw_herring', quantity: 1 }
      ]
    },
    {
      id: 'cook_trout',
      name: 'Cook Trout',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 15,
      experience: 70,
      baseTime: 2000,
      itemReward: { id: 'cooked_trout', name: 'Cooked Trout', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 15 },
        { type: 'item', itemId: 'raw_trout', quantity: 1 }
      ]
    },
    {
      id: 'cook_salmon',
      name: 'Cook Salmon',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 25,
      experience: 90,
      baseTime: 2000,
      itemReward: { id: 'cooked_salmon', name: 'Cooked Salmon', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 25 },
        { type: 'item', itemId: 'raw_salmon', quantity: 1 }
      ]
    },
    {
      id: 'cook_tuna',
      name: 'Cook Tuna',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 30,
      experience: 100,
      baseTime: 2000,
      itemReward: { id: 'cooked_tuna', name: 'Cooked Tuna', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 30 },
        { type: 'item', itemId: 'raw_tuna', quantity: 1 }
      ]
    },
    {
      id: 'cook_lobster',
      name: 'Cook Lobster',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 40,
      experience: 120,
      baseTime: 2000,
      itemReward: { id: 'cooked_lobster', name: 'Cooked Lobster', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 40 },
        { type: 'item', itemId: 'raw_lobster', quantity: 1 }
      ]
    },
    {
      id: 'cook_swordfish',
      name: 'Cook Swordfish',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 45,
      experience: 140,
      baseTime: 2000,
      itemReward: { id: 'cooked_swordfish', name: 'Cooked Swordfish', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 45 },
        { type: 'item', itemId: 'raw_swordfish', quantity: 1 }
      ]
    },
    {
      id: 'cook_monkfish',
      name: 'Cook Monkfish',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 62,
      experience: 150,
      baseTime: 2000,
      itemReward: { id: 'cooked_monkfish', name: 'Cooked Monkfish', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 62 },
        { type: 'item', itemId: 'raw_monkfish', quantity: 1 }
      ]
    },
    {
      id: 'cook_shark',
      name: 'Cook Shark',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 80,
      experience: 210,
      baseTime: 2000,
      itemReward: { id: 'cooked_shark', name: 'Cooked Shark', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 80 },
        { type: 'item', itemId: 'raw_shark', quantity: 1 }
      ]
    },
    {
      id: 'cook_anglerfish',
      name: 'Cook Anglerfish',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 84,
      experience: 230,
      baseTime: 2000,
      itemReward: { id: 'cooked_anglerfish', name: 'Cooked Anglerfish', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 84 },
        { type: 'item', itemId: 'raw_anglerfish', quantity: 1 }
      ]
    },
    {
      id: 'cook_dark_crab',
      name: 'Cook Dark Crab',
      type: 'cooking',
      skill: 'cooking',
      levelRequired: 90,
      experience: 215,
      baseTime: 2000,
      itemReward: { id: 'cooked_dark_crab', name: 'Cooked Dark Crab', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'cooking', level: 90 },
        { type: 'item', itemId: 'raw_dark_crab', quantity: 1 }
      ]
    },
    
    // Firemaking actions - ordered by level required ascending
    {
      id: 'light_logs',
      name: 'Light Logs',
      type: 'firemaking',
      skill: 'firemaking',
      levelRequired: 1,
      experience: 40,
      baseTime: 2000,
      itemReward: { id: 'ashes', name: 'Ashes', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'firemaking', level: 1 },
        { type: 'item', itemId: 'logs', quantity: 1 }
      ]
    },
    {
      id: 'light_oak_logs',
      name: 'Light Oak Logs',
      type: 'firemaking',
      skill: 'firemaking',
      levelRequired: 15,
      experience: 60,
      baseTime: 2000,
      itemReward: { id: 'ashes', name: 'Ashes', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'firemaking', level: 15 },
        { type: 'item', itemId: 'oak_logs', quantity: 1 }
      ]
    },
    {
      id: 'light_willow_logs',
      name: 'Light Willow Logs',
      type: 'firemaking',
      skill: 'firemaking',
      levelRequired: 30,
      experience: 90,
      baseTime: 2000,
      itemReward: { id: 'ashes', name: 'Ashes', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'firemaking', level: 30 },
        { type: 'item', itemId: 'willow_logs', quantity: 1 }
      ]
    },
    {
      id: 'light_maple_logs',
      name: 'Light Maple Logs',
      type: 'firemaking',
      skill: 'firemaking',
      levelRequired: 45,
      experience: 135,
      baseTime: 2000,
      itemReward: { id: 'ashes', name: 'Ashes', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'firemaking', level: 45 },
        { type: 'item', itemId: 'maple_logs', quantity: 1 }
      ]
    },
    {
      id: 'light_yew_logs',
      name: 'Light Yew Logs',
      type: 'firemaking',
      skill: 'firemaking',
      levelRequired: 60,
      experience: 202.5,
      baseTime: 2000,
      itemReward: { id: 'ashes', name: 'Ashes', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'firemaking', level: 60 },
        { type: 'item', itemId: 'yew_logs', quantity: 1 }
      ]
    },
    {
      id: 'light_magic_logs',
      name: 'Light Magic Logs',
      type: 'firemaking',
      skill: 'firemaking',
      levelRequired: 75,
      experience: 303.8,
      baseTime: 2000,
      itemReward: { id: 'ashes', name: 'Ashes', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'firemaking', level: 75 },
        { type: 'item', itemId: 'magic_logs', quantity: 1 }
      ]
    },
    {
      id: 'light_redwood_logs',
      name: 'Light Redwood Logs',
      type: 'firemaking',
      skill: 'firemaking',
      levelRequired: 90,
      experience: 350,
      baseTime: 2000,
      itemReward: { id: 'ashes', name: 'Ashes', quantity: 1 },
      requirements: [
        { type: 'level', skill: 'firemaking', level: 90 },
        { type: 'item', itemId: 'redwood_logs', quantity: 1 }
      ]
    }
  ]
}; 