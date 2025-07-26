import type { Location, SkillAction } from '../../types/game';
import { SMITHING_BASE_LEVELS } from '../items';

// Smithing template for generating all smithing actions
const SMITHING_ACTIONS_TEMPLATE = [
  // Small, simple items (1 bar)
  { id: 'dagger', name: 'Dagger', levelOver: 0, bars: 1, exp: 12.5, time: 2000 },
  { id: 'axe', name: 'Axe', levelOver: 0, bars: 1, exp: 12.5, time: 2000 },
  { id: 'mace', name: 'Mace', levelOver: 1, bars: 1, exp: 12.5, time: 2000 },
  { id: 'medium_helm', name: 'Medium Helm', levelOver: 2, bars: 1, exp: 12.5, time: 2000 },
  { id: 'bolts_unf', name: 'Unfinished Bolts', levelOver: 2, bars: 1, exp: 12.5, time: 1500 },
  { id: 'sword', name: 'Sword', levelOver: 3, bars: 1, exp: 12.5, time: 2000 },
  { id: 'dart_tips', name: 'Dart Tips', levelOver: 3, bars: 1, exp: 12.5, time: 1500 },
  { id: 'nails', name: 'Nails', levelOver: 3, bars: 1, exp: 12.5, time: 1500 },
  
  // Medium items (2 bars)
  { id: 'scimitar', name: 'Scimitar', levelOver: 4, bars: 2, exp: 25, time: 3500 },
  { id: 'spear', name: 'Spear', levelOver: 4, bars: 1, exp: 12.5, time: 2500 },
  { id: 'arrowtips', name: 'Arrowtips', levelOver: 4, bars: 1, exp: 12.5, time: 1500 },
  { id: 'crossbow_limbs', name: 'Crossbow Limbs', levelOver: 5, bars: 1, exp: 12.5, time: 2500 },
  { id: 'longsword', name: 'Longsword', levelOver: 5, bars: 2, exp: 25, time: 3500 },
  { id: 'javelin_heads', name: 'Javelin Heads', levelOver: 5, bars: 1, exp: 12.5, time: 1500 },
  { id: 'full_helm', name: 'Full Helm', levelOver: 6, bars: 2, exp: 25, time: 3500 },
  { id: 'throwing_knives', name: 'Throwing Knives', levelOver: 6, bars: 1, exp: 12.5, time: 2000 },
  { id: 'square_shield', name: 'Square Shield', levelOver: 7, bars: 2, exp: 25, time: 3500 },
  
  // Large items (3+ bars)
  { id: 'warhammer', name: 'Warhammer', levelOver: 8, bars: 3, exp: 37.5, time: 5000 },
  { id: 'battleaxe', name: 'Battleaxe', levelOver: 9, bars: 3, exp: 37.5, time: 5000 },
  { id: 'chainbody', name: 'Chainbody', levelOver: 10, bars: 3, exp: 37.5, time: 5500 },
  { id: 'kiteshield', name: 'Kiteshield', levelOver: 11, bars: 3, exp: 37.5, time: 5500 },
  { id: 'claws', name: 'Claws', levelOver: 12, bars: 2, exp: 25, time: 4000 },
  { id: 'two_handed_sword', name: 'Two-handed Sword', levelOver: 13, bars: 3, exp: 37.5, time: 5500 },
  { id: 'platelegs', name: 'Platelegs', levelOver: 15, bars: 3, exp: 37.5, time: 6000 },
  { id: 'plateskirt', name: 'Plateskirt', levelOver: 15, bars: 3, exp: 37.5, time: 6000 },
  { id: 'platebody', name: 'Platebody', levelOver: 17, bars: 5, exp: 62.5, time: 8000 }
] as const;

// Function to generate smithing actions for a metal type
const generateSmithingActions = (metalType: keyof typeof SMITHING_BASE_LEVELS): SkillAction[] => {
  return SMITHING_ACTIONS_TEMPLATE.map(template => {
    const itemId = `${metalType}_${template.id}`;
    const level = SMITHING_BASE_LEVELS[metalType] + template.levelOver;
    
    // Experience per bar for each metal type
    const expPerBar = {
      bronze: 12.5,
      iron: 25,
      steel: 37.5,
      mithril: 50,
      adamant: 62.5,
      rune: 75
    }[metalType];

    return {
      id: `smith_${itemId}`,
      name: `${metalType.charAt(0).toUpperCase() + metalType.slice(1)} ${template.name}`,
      type: 'smithing',
      skill: 'smithing',
      levelRequired: level,
      experience: template.bars * expPerBar,
      baseTime: template.time,
      itemReward: {
        id: itemId,
        name: `${metalType.charAt(0).toUpperCase() + metalType.slice(1)} ${template.name}`,
        quantity: 1
      },
      requirements: [
        {
          type: 'level',
          skill: 'smithing',
          level: level
        },
        {
          type: 'item',
          itemId: `${metalType}_bar`,
          quantity: template.bars,
          description: `${template.bars} ${metalType.charAt(0).toUpperCase() + metalType.slice(1)} bars`
        }
      ]
    };
  });
};

// Generate all smithing actions for all metals
const allSmithingActions: SkillAction[] = [
  ...generateSmithingActions('bronze'),
  ...generateSmithingActions('iron'),
  ...generateSmithingActions('steel'),
  ...generateSmithingActions('mithril'),
  ...generateSmithingActions('adamant'),
  ...generateSmithingActions('rune')
];

// Sort actions by level required
allSmithingActions.sort((a, b) => a.levelRequired - b.levelRequired);

export const forgeLocation: Location = {
  id: 'forge',
  name: 'Forge',
  description: 'A hot forge where you can smith metal items into weapons and armor.',
  type: 'resource',
  levelRequired: 1,
  resources: [],
  category: 'smithing',
  icon: '/assets/locations/forge.png',
  availableSkills: ['smithing'],
  actions: allSmithingActions
}; 