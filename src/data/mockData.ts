import type { Location, Character, StoreAction, SkillAction, CombatStats, Monster, ActionType, SkillName, ItemReward, CombatAction, CombatSelectionAction } from '../types/game';
import { createSkill } from '../types/game';
import { SMITHING_BASE_LEVELS } from './items';
import { EASY_MONSTERS, MEDIUM_MONSTERS, HARD_MONSTERS, NIGHTMARE_MONSTERS } from './monsters';

// Import locations from modular structure
import { locations } from './locations';

// Template for smithing items with their experience rewards and base times
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
      experience: template.bars * expPerBar, // Calculate exp based on number of bars and metal type
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

// Generate category actions for each metal type
const generateMetalCategories = (): SkillAction[] => {
  const metalTypes = ['bronze', 'iron', 'steel', 'mithril', 'adamant', 'rune'] as const;
  
  return metalTypes.map(metalType => ({
    id: `smith_${metalType}`,
    name: `${metalType.charAt(0).toUpperCase() + metalType.slice(1)} Smithing`,
    type: 'smithing_category',
    skill: 'smithing',
    levelRequired: SMITHING_BASE_LEVELS[metalType],
    experience: 0, // Categories don't give direct experience
    baseTime: 0, // Categories don't have a base time
    itemReward: {
      id: `${metalType}_bar`,
      name: `${metalType.charAt(0).toUpperCase() + metalType.slice(1)} Bar`,
      quantity: 0
    },
    requirements: [
      {
        type: 'level',
        skill: 'smithing',
        level: SMITHING_BASE_LEVELS[metalType]
      }
    ],
    subActions: generateSmithingActions(metalType)
  }));
};

const GOBLIN_STATS: CombatStats = {
  // Attack bonuses
  attackStab: 1,
  attackSlash: 1,
  attackCrush: 1,
  attackMagic: 0,
  attackRanged: 0,
  // Defence bonuses
  defenceStab: 1,
  defenceSlash: 1,
  defenceCrush: 1,
  defenceMagic: -5,
  defenceRanged: 1,
  // Other bonuses
  strengthMelee: 5,
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

export const mockMonsters: Monster[] = [
  {
    id: 'goblin',
    name: 'Goblin',
    level: 2,
    hitpoints: 5,
    maxHitpoints: 5,
    combatStyle: 'melee',
    stats: GOBLIN_STATS,
    drops: [
      {
        itemId: 'coins',
        quantity: 5,
        chance: 100 // Always drops
      },
      {
        itemId: 'bronze_sword',
        quantity: 1,
        chance: 10 // 10% chance
      }
    ],
    thumbnail: '/assets/ItemThumbnail/Combat/goblin.png'
  }
  // Add more monsters here...
];

// Define all locations using the modular structure
import { COMBAT_LOCATIONS } from './locations/combat';
export const mockLocations: Location[] = [
  ...locations,
  ...Object.values(COMBAT_LOCATIONS)
];

export const mockCharacter: Character = {
  id: 'mock-character',
  name: 'Mock Character',
  lastLogin: new Date(),
  lastAction: {
    type: 'none',
    location: 'forest'
  },
  skills: {
    none: createSkill('None'),
    attack: createSkill('Attack'),
    strength: createSkill('Strength'),
    defence: createSkill('Defence'),
    ranged: createSkill('Ranged'),
    prayer: createSkill('Prayer'),
    magic: createSkill('Magic'),
    runecrafting: createSkill('Runecrafting'),
    hitpoints: createSkill('Hitpoints', 10),
    agility: createSkill('Agility'),
    herblore: createSkill('Herblore'),
    thieving: createSkill('Thieving'),
    crafting: createSkill('Crafting'),
    fletching: createSkill('Fletching'),
    slayer: createSkill('Slayer'),
    mining: createSkill('Mining'),
    smithing: createSkill('Smithing'),
    fishing: createSkill('Fishing'),
    cooking: createSkill('Cooking'),
    firemaking: createSkill('Firemaking'),
    woodcutting: createSkill('Woodcutting'),
    farming: createSkill('Farming')
  },
  bank: [],
  bankTabs: [{
    id: 'main',
    name: 'Main',
    items: []
  }],
  equipment: {
    weapon: { id: 'bronze_axe', name: 'Bronze Axe', quantity: 1, type: 'tool', category: 'Tools', icon: '/assets/items/bronze_axe.png' },
    shield: { id: 'bronze_pickaxe', name: 'Bronze Pickaxe', quantity: 1, type: 'tool', category: 'Tools', icon: '/assets/items/bronze_pickaxe.png' }
  },
  combatLevel: 3, // Will be recalculated on first skill gain
  hitpoints: 10,
  maxHitpoints: 10, // Max hitpoints equals hitpoints skill level (10)
  prayer: 1,
  maxPrayer: 1,
  specialEnergy: 100,
  maxSpecialEnergy: 100,
  activeEffects: [],
  slayerPoints: 0,
  currentSlayerTask: null,
  slayerTaskStreak: 0,
  friends: [],
  messages: [],
  friendRequests: [],
  dungeonProgress: {},
  activeQuests: [],
  questProgress: {},
  achievements: [],
  achievementProgress: {},
  stats: {
    // General
    deaths: 0,
    foodEaten: 0,
    hitpointsGained: 0,
    damageDone: 0,
    damageTaken: 0,
    coinsSpent: 0,
    coinsEarned: 0,
    slayerPointsSpent: 0,
    slayerPointsEarned: 0,
    totalActiveTime: 0,
    totalOfflineTime: 0,
    combatLevel: 3,
    favouriteAction: '',
    topSkills: [],

    // Gathering
    logsChopped: 0,
    oresMined: 0,
    fishCaught: 0,
    itemsPickpocketed: 0,
    creaturesHunted: 0,
    cropsHarvested: 0,

    // Processing
    itemsCrafted: 0,
    arrowsFletched: 0,
    barsSmelted: 0,
    foodCooked: 0,
    logsBurned: 0,
    bonesBuried: 0,
    runesCrafted: 0,

    // Combat
    monstersKilled: 0,
    totalKills: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    favouriteFoodEaten: 0,
    totalHealthHealed: 0,
    slayerTasksCompleted: 0,

    // Detailed tracking
    resourcesGathered: {},
    actionsPerformed: {},
    monstersKilledByType: {},
    
    // Farming tracking
    farmingPatchesPlanted: {},
    farmingCropsPlanted: {},
    farmingHarvests: {},
    
    // Thieving tracking
    thievingActions: {},
    
    // Agility tracking
    agilityLaps: {},
    
    // Processing detailed tracking
    smithingActions: {},
    cookingActions: {},
    firemakingLogs: {},
    fletchingArrows: {},
    fletchingBows: {},
    fletchingBowsStrung: {},
    fletchingJavelins: {},
    craftingArmor: {},
    craftingJewelry: {},
    craftingStaves: {},
    craftingGems: {},
    herblorePotions: {},
    prayerBones: {},
    runecraftingRunes: {}
  }
}; 