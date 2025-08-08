import type { FarmingCrop } from '../types/game';

export const FARMING_CROPS: Record<string, FarmingCrop> = {
  // Allotment crops
  potato: {
    id: 'potato',
    name: 'Potato',
    type: 'allotment',
    levelRequired: 1,
    experience: 8,
    harvestTime: 40,
    itemReward: { id: 'potato', name: 'Potato', quantity: 3 },
    seedRequirement: { itemId: 'potato_seeds', quantity: 3 }
  },
  onion: {
    id: 'onion',
    name: 'Onion',
    type: 'allotment',
    levelRequired: 5,
    experience: 10,
    harvestTime: 40,
    itemReward: { id: 'onion', name: 'Onion', quantity: 3 },
    seedRequirement: { itemId: 'onion_seed', quantity: 3 }
  },
  cabbage: {
    id: 'cabbage',
    name: 'Cabbage',
    type: 'allotment',
    levelRequired: 7,
    experience: 12,
    harvestTime: 40,
    itemReward: { id: 'cabbage', name: 'Cabbage', quantity: 3 },
    seedRequirement: { itemId: 'cabbage_seed', quantity: 3 }
  },
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    type: 'allotment',
    levelRequired: 12,
    experience: 15,
    harvestTime: 40,
    itemReward: { id: 'tomato', name: 'Tomato', quantity: 3 },
    seedRequirement: { itemId: 'tomato_seed', quantity: 1 }
  },
  sweetcorn: {
    id: 'sweetcorn',
    name: 'Sweetcorn',
    type: 'allotment',
    levelRequired: 20,
    experience: 20,
    harvestTime: 60,
    itemReward: { id: 'sweetcorn', name: 'Sweetcorn', quantity: 3 },
    seedRequirement: { itemId: 'sweetcorn_seed', quantity: 1 }
  },
  strawberry: {
    id: 'strawberry',
    name: 'Strawberry',
    type: 'allotment',
    levelRequired: 31,
    experience: 26,
    harvestTime: 60,
    itemReward: { id: 'strawberry', name: 'Strawberry', quantity: 4 },
    seedRequirement: { itemId: 'strawberry_seed', quantity: 1 }
  },
  watermelon: {
    id: 'watermelon',
    name: 'Watermelon',
    type: 'allotment',
    levelRequired: 47,
    experience: 50,
    harvestTime: 80,
    itemReward: { id: 'watermelon', name: 'Watermelon', quantity: 1 },
    seedRequirement: { itemId: 'watermelon_seed', quantity: 1 }
  },
  snape_grass: {
    id: 'snape_grass',
    name: 'Snape Grass',
    type: 'allotment',
    levelRequired: 61,
    experience: 82,
    harvestTime: 80,
    itemReward: { id: 'snape_grass', name: 'Snape Grass', quantity: 4 },
    seedRequirement: { itemId: 'snapegrass_seed', quantity: 1 }
  },

  // Herb crops
  guam: {
    id: 'guam',
    name: 'Guam',
    type: 'herbs',
    levelRequired: 9,
    experience: 11,
    harvestTime: 80,
    itemReward: { id: 'guam_leaf', name: 'Guam Leaf', quantity: 3 },
    seedRequirement: { itemId: 'guam_seed', quantity: 1 }
  },
  marrentill: {
    id: 'marrentill',
    name: 'Marrentill',
    type: 'herbs',
    levelRequired: 14,
    experience: 14,
    harvestTime: 80,
    itemReward: { id: 'marrentill', name: 'Marrentill', quantity: 3 },
    seedRequirement: { itemId: 'marentill_seed', quantity: 1 }
  },
  tarromin: {
    id: 'tarromin',
    name: 'Tarromin',
    type: 'herbs',
    levelRequired: 19,
    experience: 18,
    harvestTime: 80,
    itemReward: { id: 'tarromin', name: 'Tarromin', quantity: 3 },
    seedRequirement: { itemId: 'tarromin_seed', quantity: 1 }
  },
  harralander: {
    id: 'harralander',
    name: 'Harralander',
    type: 'herbs',
    levelRequired: 26,
    experience: 22,
    harvestTime: 80,
    itemReward: { id: 'harralander', name: 'Harralander', quantity: 3 },
    seedRequirement: { itemId: 'harralander_seed', quantity: 1 }
  },
  ranarr: {
    id: 'ranarr',
    name: 'Ranarr',
    type: 'herbs',
    levelRequired: 32,
    experience: 27,
    harvestTime: 80,
    itemReward: { id: 'ranarr', name: 'Ranarr', quantity: 3 },
    seedRequirement: { itemId: 'ranarr_seed', quantity: 1 }
  },
  toadflax: {
    id: 'toadflax',
    name: 'Toadflax',
    type: 'herbs',
    levelRequired: 38,
    experience: 33,
    harvestTime: 80,
    itemReward: { id: 'toadflax', name: 'Toadflax', quantity: 3 },
    seedRequirement: { itemId: 'toadflax_seed', quantity: 1 }
  },
  irit: {
    id: 'irit',
    name: 'Irit',
    type: 'herbs',
    levelRequired: 44,
    experience: 43,
    harvestTime: 80,
    itemReward: { id: 'irit', name: 'Irit', quantity: 3 },
    seedRequirement: { itemId: 'irit_seed', quantity: 1 }
  },
  avantoe: {
    id: 'avantoe',
    name: 'Avantoe',
    type: 'herbs',
    levelRequired: 50,
    experience: 55,
    harvestTime: 80,
    itemReward: { id: 'avantoe', name: 'Avantoe', quantity: 3 },
    seedRequirement: { itemId: 'avantoe_seed', quantity: 1 }
  },
  kwuarm: {
    id: 'kwuarm',
    name: 'Kwuarm',
    type: 'herbs',
    levelRequired: 56,
    experience: 70,
    harvestTime: 80,
    itemReward: { id: 'kwuarm', name: 'Kwuarm', quantity: 3 },
    seedRequirement: { itemId: 'kwuarm_seed', quantity: 1 }
  },
  snapdragon: {
    id: 'snapdragon',
    name: 'Snapdragon',
    type: 'herbs',
    levelRequired: 62,
    experience: 88,
    harvestTime: 80,
    itemReward: { id: 'snapdragon', name: 'Snapdragon', quantity: 3 },
    seedRequirement: { itemId: 'snapdragon_seed', quantity: 1 }
  },
  cadantine: {
    id: 'cadantine',
    name: 'Cadantine',
    type: 'herbs',
    levelRequired: 67,
    experience: 107,
    harvestTime: 80,
    itemReward: { id: 'cadantine', name: 'Cadantine', quantity: 3 },
    seedRequirement: { itemId: 'cadantine_seed', quantity: 1 }
  },
  lantadyme: {
    id: 'lantadyme',
    name: 'Lantadyme',
    type: 'herbs',
    levelRequired: 73,
    experience: 135,
    harvestTime: 80,
    itemReward: { id: 'lantadyme', name: 'Lantadyme', quantity: 3 },
    seedRequirement: { itemId: 'lantadyme_seed', quantity: 1 }
  },
  dwarf_weed: {
    id: 'dwarf_weed',
    name: 'Dwarf Weed',
    type: 'herbs',
    levelRequired: 79,
    experience: 173,
    harvestTime: 80,
    itemReward: { id: 'dwarf_weed', name: 'Dwarf Weed', quantity: 3 },
    seedRequirement: { itemId: 'dwarf_weed_seed', quantity: 1 }
  },
  torstol: {
    id: 'torstol',
    name: 'Torstol',
    type: 'herbs',
    levelRequired: 85,
    experience: 200,
    harvestTime: 80,
    itemReward: { id: 'torstol', name: 'Torstol', quantity: 3 },
    seedRequirement: { itemId: 'torstol_seed', quantity: 1 }
  },

  // Tree crops
  oak: {
    id: 'oak',
    name: 'Oak Tree',
    type: 'trees',
    levelRequired: 15,
    experience: 14,
    harvestTime: 200,
    itemReward: { id: 'oak_logs', name: 'Oak Logs', quantity: 8 },
    seedRequirement: { itemId: 'acorn', quantity: 1 }
  },
  willow: {
    id: 'willow',
    name: 'Willow Tree',
    type: 'trees',
    levelRequired: 30,
    experience: 25,
    harvestTime: 240,
    itemReward: { id: 'willow_logs', name: 'Willow Logs', quantity: 12 },
    seedRequirement: { itemId: 'willow_seed', quantity: 1 }
  },
  teak: {
    id: 'teak',
    name: 'Teak Tree',
    type: 'trees',
    levelRequired: 35,
    experience: 35,
    harvestTime: 280,
    itemReward: { id: 'teak_logs', name: 'Teak Logs', quantity: 10 },
    seedRequirement: { itemId: 'teak_seed', quantity: 1 }
  },
  maple: {
    id: 'maple',
    name: 'Maple Tree',
    type: 'trees',
    levelRequired: 45,
    experience: 45,
    harvestTime: 320,
    itemReward: { id: 'maple_logs', name: 'Maple Logs', quantity: 15 },
    seedRequirement: { itemId: 'maple_seed', quantity: 1 }
  },
  mahogany: {
    id: 'mahogany',
    name: 'Mahogany Tree',
    type: 'trees',
    levelRequired: 55,
    experience: 63,
    harvestTime: 360,
    itemReward: { id: 'mahogany_logs', name: 'Mahogany Logs', quantity: 12 },
    seedRequirement: { itemId: 'mahogany_seed', quantity: 1 }
  },
  yew: {
    id: 'yew',
    name: 'Yew Tree',
    type: 'trees',
    levelRequired: 60,
    experience: 81,
    harvestTime: 400,
    itemReward: { id: 'yew_logs', name: 'Yew Logs', quantity: 20 },
    seedRequirement: { itemId: 'yew_seed', quantity: 1 }
  },
  magic: {
    id: 'magic',
    name: 'Magic Tree',
    type: 'trees',
    levelRequired: 75,
    experience: 145,
    harvestTime: 480,
    itemReward: { id: 'magic_logs', name: 'Magic Logs', quantity: 25 },
    seedRequirement: { itemId: 'magic_seed', quantity: 1 }
  },
  redwood: {
    id: 'redwood',
    name: 'Redwood Tree',
    type: 'trees',
    levelRequired: 90,
    experience: 230,
    harvestTime: 640,
    itemReward: { id: 'redwood_logs', name: 'Redwood Logs', quantity: 30 },
    seedRequirement: { itemId: 'redwood_seed', quantity: 1 }
  }
};

// Helper functions
export const getCropsByType = (type: 'allotment' | 'herbs' | 'trees'): FarmingCrop[] => {
  return Object.values(FARMING_CROPS).filter(crop => crop.type === type);
};

export const getCropById = (id: string): FarmingCrop | undefined => {
  return FARMING_CROPS[id];
};

export const getAvailableCrops = (type: 'allotment' | 'herbs' | 'trees', farmingLevel: number): FarmingCrop[] => {
  return getCropsByType(type).filter(crop => crop.levelRequired <= farmingLevel);
}; 