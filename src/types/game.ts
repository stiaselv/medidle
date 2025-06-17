import type { IconType } from 'react-icons';

// Equipment Level Requirement Rule
//
// Weapons
// Melee:
//   - Bronze and Iron: require level 1 Attack
//   - Steel: require level 5 Attack
//   - Mithril: require level 20 Attack
//   - Adamant: require level 30 Attack
//   - Rune: require level 40 Attack
//   - Dragon: require level 60 Attack
// Ranged:
//   - Bows and longbows: require level 1 Ranged
//   - Oak shortbow/longbow: require level 5 Ranged
//   - Willow shortbow/longbow: require level 20 Ranged
//   - Maple shortbow/longbow: require level 30 Ranged
//   - Yew shortbow/longbow: require level 40 Ranged
//   - Magic shortbow/longbow: require level 50 Ranged
// Magic:
//   - No requirement for wielding staffs
//
// Armor
// Melee:
//   - Bronze and Iron: require level 1 Defence
//   - Steel: require level 5 Defence
//   - Mithril: require level 20 Defence
//   - Adamant: require level 30 Defence
//   - Rune: require level 40 Defence
//   - Dragon: require level 60 Defence
// Ranged:
//   - Ranged armor not yet added (will be added through crafting)
// Magic:
//   - Not implemented yet
//
// This rule will be updated as new weapons and armor are added.

export type SkillName = 
  | 'woodcutting'
  | 'fishing'
  | 'mining'
  | 'smithing'
  | 'cooking'
  | 'firemaking'
  | 'farming'
  | 'attack'
  | 'strength'
  | 'defence'
  | 'hitpoints'
  | 'prayer'
  | 'magic'
  | 'ranged'
  | 'runecrafting'
  | 'construction'
  | 'agility'
  | 'herblore'
  | 'thieving'
  | 'crafting'
  | 'fletching'
  | 'slayer'
  | 'hunter'
  | 'none';  // For store actions and other non-skill activities

export type ActionType = 
  | 'woodcutting'
  | 'fishing'
  | 'mining'
  | 'smithing'
  | 'smithing_category'  // For metal categories in smithing
  | 'cooking'
  | 'firemaking'
  | 'combat'
  | 'combat_selection'  // For selecting combat difficulty
  | 'store'
  | 'crafting'
  | 'fletching'
  | 'none'
  | 'death';

export type ItemType = 'tool' | 'resource' | 'consumable' | 'currency';

export type ItemStats = {
  defence?: number;
  woodcutting?: number;
  fishing?: number;
  // Add other skill stats as needed
};

export interface Skill {
  name: string;
  level: number;
  experience: number;
  nextLevelExperience: number;
}

export interface Skills {
  attack: Skill;
  strength: Skill;
  defence: Skill;
  ranged: Skill;
  prayer: Skill;
  magic: Skill;
  runecrafting: Skill;
  construction: Skill;
  hitpoints: Skill;
  agility: Skill;
  herblore: Skill;
  thieving: Skill;
  crafting: Skill;
  fletching: Skill;
  slayer: Skill;
  hunter: Skill;
  mining: Skill;
  smithing: Skill;
  fishing: Skill;
  cooking: Skill;
  firemaking: Skill;
  woodcutting: Skill;
  farming: Skill;
  none: Skill;
}

export interface Requirement {
  type: 'level' | 'equipment' | 'item';
  skill?: SkillName;
  level?: number;
  itemId?: string;
  quantity?: number;
  description?: string;
  category?: string;
}

export interface ItemReward {
  id: string;
  name: string;
  quantity: number;
  category?: string;
  type?: string;
  thumbnail?: string;
}

export interface BaseAction {
  id: string;
  name: string;
  type: string;
  skill: SkillName;
  levelRequired: number;
  experience: number;
  baseTime: number;
  itemReward: ItemReward;
  requirements?: Array<{
    type: 'level' | 'equipment' | 'item';
    skill?: SkillName;
    level?: number;
    itemId?: string;
    quantity?: number;
    category?: string;
  }>;
}

export interface SkillAction extends BaseAction {
  type: 'woodcutting' | 'mining' | 'fishing' | 'cooking' | 'firemaking' | 'smithing' | 'smithing_category' | 'crafting' | 'fletching' | 'prayer' | 'runecrafting';
}

export interface StoreAction extends BaseAction {
  type: 'store';
  storeItems: StoreItem[];
}

export interface CombatAction extends BaseAction {
  type: 'combat';
  monster: Monster;
  attackStyle?: AttackStyle;
  useSpecial?: boolean;
  location?: string;
}

export interface CombatSelectionAction extends BaseAction {
  type: 'combat_selection';
  targetLocation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Nightmare';
}

export interface StoreItem {
  id: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  quantity?: number;  // For limited stock items
  levelRequired?: number;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  type: 'resource' | 'combat' | 'city';
  levelRequired: number;
  monsters?: string[];
  resources: string[];
  category: string;
  icon: string | IconType;
  actions: (SkillAction | StoreAction | CombatAction | CombatSelectionAction)[];
  availableSkills?: SkillName[];
  group?: 'World' | 'Dungeons' | 'Raids'; // Optional grouping for combat locations
}

export interface Equipment {
  weapon?: Item;
  shield?: Item;
  head?: Item;
  body?: Item;
  legs?: Item;
  feet?: Item;
  hands?: Item;
  neck?: Item;
  ring?: Item;
  ammo?: Item;
  [key: string]: Item | undefined;
}

export interface SlayerTask {
  monsterId: string;
  monsterName: string;
  amount: number;
  remaining: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Nightmare';
}

// Tracks all persistent character statistics for the statistics modal
export interface CharacterStats {
  deaths: number;
  foodEaten: number;
  hitpointsGained: number;
  damageDone: number;
  damageTaken: number;
  coinsSpent: number;
  coinsEarned: number;
  slayerPointsSpent: number;
  slayerPointsEarned: number;
  totalActiveTime: number; // ms
  totalOfflineTime: number; // ms
}

export interface Character {
  id: string;
  name: string;
  lastLogin: Date;
  lastAction: {
    type: ActionType;
    location: string;
    target?: string;
    id?: string;
  };
  skills: Skills;
  bank: {
    id: string;
    name: string;
    quantity: number;
  }[];
  equipment: Equipment;
  combatLevel: number;
  hitpoints: number;
  maxHitpoints: number;
  prayer: number;
  maxPrayer: number;
  specialEnergy: number;
  maxSpecialEnergy: number;
  activeEffects: {
    type: 'stun' | 'drain' | 'boost';
    remainingDuration: number;
    value: number;
    affectedStats?: string[];
  }[];
  slayerPoints: number;
  currentSlayerTask: SlayerTask | null;
  slayerTaskStreak: number;
  stats: CharacterStats;
}

import type { CombatStyle } from '../combat/combatTriangle';

export interface MonsterDrop {
  itemId: string;
  quantity: number;
  chance: number;
}

export interface Monster {
  id: string;
  name: string;
  level: number;
  hitpoints: number;
  maxHitpoints: number;
  combatStyle: CombatStyle;
  stats: CombatStats;
  drops?: MonsterDrop[];
  slayerLevel?: number;
  slayerCategory?: string;
  activeEffects?: {
    type: 'stun' | 'drain' | 'boost';
    remainingDuration: number;
    value: number;
    affectedStats?: string[];
  }[];
  thumbnail?: string; // Path to monster's thumbnail image
}

export interface CombatStats {
  // Attack bonuses
  attackStab: number;
  attackSlash: number;
  attackCrush: number;
  attackMagic: number;
  attackRanged: number;
  // Defence bonuses
  defenceStab: number;
  defenceSlash: number;
  defenceCrush: number;
  defenceMagic: number;
  defenceRanged: number;
  // Other bonuses
  strengthMelee: number;
  strengthRanged: number;
  strengthMagic: number;
  prayerBonus: number;
}

export interface GameState {
  // Character state
  character: Character | null;
  selectedMonster: Monster | null;
  currentLocation: Location | undefined;
  currentAction: SkillAction | CombatAction | CombatSelectionAction | null;
  actionProgress: number;
  isActionInProgress: boolean;
  actionInterval: ReturnType<typeof setInterval> | null;
  lastActionTime: number;
  characterState: 'idle' | 'busy';
  lastActionReward: {
    xp: number;
    item: ItemReward | null;
    levelUp?: {
      skill: string;
      level: number;
    };
    skill?: SkillName;
    hitpointsXp?: number;
  } | null;
  lastCombatRound: {
    playerDamage: number;
    monsterDamage: number;
    result: 'continue' | 'victory' | 'defeat';
    loot: string[];
  } | null;

  // Location state
  locations: Record<string, LocationState>;  // Non-nullable
  recentLocations: string[];
  favoriteLocations: string[];
  discoveredLocations: string[];

  // Location actions
  setLocationState: (locationId: string, state: Partial<LocationState>) => void;
  unlockLocation: (locationId: string) => void;
  visitLocation: (locationId: string) => void;
  addToRecentLocations: (locationId: string) => void;
  toggleFavorite: (locationId: string) => void;
  updateLocationProgress: (locationId: string, type: 'monster' | 'resource' | 'action', itemId: string, count?: number) => void;
  setLocationNotes: (locationId: string, notes: string) => void;
  completeLocationAction: (locationId: string, actionId: string) => void;
  discoverLocation: (locationId: string) => void;
  checkAndUnlockConnectedLocations: (locationId: string) => void;
  batchUpdateProgress: (updates: Array<{
    locationId: string;
    type: 'monster' | 'resource' | 'action';
    itemId: string;
    count: number;
  }>) => void;

  // Character actions
  setCharacter: (character: Character | null) => void;
  createCharacter: (name: string) => void;
  setLocation: (location: Location) => void;
  startAction: (action: SkillAction | CombatAction | CombatSelectionAction) => void;
  stopAction: () => void;
  completeAction: () => void;
  addItemToBank: (item: Item, quantity: number) => void;
  removeItemFromBank: (itemId: string, quantity: number) => void;
  sellItem: (itemId: string, quantity: number) => void;
  updateBankOrder: (newBank: ItemReward[]) => void;
  canPerformAction: (action: SkillAction | CombatAction | CombatSelectionAction) => boolean;
  gainExperience: (skill: SkillName, amount: number) => { level: number; skill: string } | null;

  // Slayer actions
  getNewSlayerTask: (difficulty: 'Easy' | 'Medium' | 'Hard' | 'Nightmare') => void;
  completeSlayerTask: () => void;
  cancelSlayerTask: () => void;

  // Offline progress
  processOfflineProgress: () => OfflineRewards | null;
  clearActionReward: () => void;

  // Auth
  signOut: () => void;
  updateCharacter: (character: Character) => void;

  // Stat helpers
  incrementStat: (stat: keyof Character["stats"], amount?: number) => void;
  updateActiveTime: (ms: number) => void;
  updateOfflineTime: (ms: number) => void;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  category: string;
  icon: string;
  level?: number;
  stats?: CombatStats | ItemStats;
  slot?: string;
  speed?: number;
  quantity?: number;
  buyPrice?: number;
  sellPrice?: number;
  healing?: number;  // Amount of health restored when consumed
  boost?: {
    stat: SkillName | 'hitpoints' | 'prayer';
    amount: number;
    duration: number; // in turns or seconds
  };
}

// Helper function for next level experience (move from gameStore.ts)
export const getNextLevelExperience = (level: number): number => {
  // Cap level at 99 for next level experience calculation
  const cappedLevel = Math.min(level, 99);
  return cappedLevel * cappedLevel * 83;
};

export const createSkill = (name: string, level = 1): Skill => {
  // Set experience to the minimum required for the given level
  const experience = level > 1 ? getNextLevelExperience(level - 1) : 0;
  return {
    name,
    level,
    experience,
    nextLevelExperience: getNextLevelExperience(level)
  };
};

// Helper function to ensure level requirements don't exceed 99
export const capLevelRequirement = (level: number): number => {
  return Math.min(level, 99);
};

export type WeaponStyle = 'stab' | 'slash' | 'crush';
export type AttackStyle = 'accurate' | 'aggressive' | 'defensive' | 'rapid' | 'longrange' | 'balanced';

export interface WeaponSpecialAttack {
  name: string;
  description: string;
  energyCost: number;
  effects: {
    damageMultiplier?: number;
    accuracyMultiplier?: number;
    drainEffect?: {
      stats: ('attack' | 'strength' | 'defence' | 'magic' | 'ranged')[];
      amount: number;
    };
    healEffect?: {
      percentage: number;
    };
    stunEffect?: {
      duration: number; // in seconds
    };
  };
}

export interface Weapon extends Item {
  styles: WeaponStyle[];
  specialAttack?: WeaponSpecialAttack;
  speed: number; // Attack speed in milliseconds
}

export interface ItemDrop {
  id: string;
  name: string;
  quantity: number;
  chance: number; // Percentage chance (0-100)
}

export interface LocationState {
  id: string;
  unlocked: boolean;
  visited: boolean;
  completedActions: string[];  // IDs of completed actions
  progress: {
    monstersDefeated: Record<string, number>;  // monster_id -> count
    resourcesGathered: Record<string, number>;  // resource_id -> count
    actionsCompleted: Record<string, number>;   // action_id -> count
  };
  lastVisited: Date | null;
  favorited: boolean;
  customNotes: string;
}

export interface LocationsState {
  // State
  locations: Record<string, LocationState>;
  currentLocation: string | null;
  recentLocations: string[];
  favoriteLocations: string[];
  discoveredLocations: string[];

  // Actions
  setLocationState: (locationId: string, state: Partial<LocationState>) => void;
  unlockLocation: (locationId: string) => void;
  visitLocation: (locationId: string) => void;
  addToRecentLocations: (locationId: string) => void;
  toggleFavorite: (locationId: string) => void;
  updateLocationProgress: (locationId: string, type: 'monster' | 'resource' | 'action', itemId: string, count?: number) => void;
  setLocationNotes: (locationId: string, notes: string) => void;
  completeLocationAction: (locationId: string, actionId: string) => void;
  discoverLocation: (locationId: string) => void;
}

export interface OfflineRewards {
  xp: number;
  item: {
    id: string;
    name: string;
    quantity: number;
  } | null;
  skill: SkillName;
  timePassed: number;
  actionsCompleted: number;
} 