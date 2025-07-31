// Shared type definitions for the game
// This file can be used by both the client and server

// Basic types
export type SkillName = 'attack' | 'strength' | 'defence' | 'hitpoints' | 'ranged' | 'magic' | 'prayer' | 'slayer' | 'mining' | 'smithing' | 'fishing' | 'cooking' | 'firemaking' | 'woodcutting' | 'crafting' | 'fletching' | 'thieving' | 'farming' | 'runecrafting' | 'construction' | 'hunter' | 'agility';
export type ItemType = 'tool' | 'resource' | 'consumable' | 'equipment';
export type EquipmentSlot = 'head' | 'cape' | 'neck' | 'ammo' | 'weapon' | 'body' | 'shield' | 'legs' | 'hands' | 'feet' | 'ring';

// Interfaces
export interface Skill {
  level: number;
  experience: number;
  nextLevelExperience: number;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  icon: string;
  description?: string;
  level?: number;
  stats?: ItemStats;
  slot?: EquipmentSlot;
  category?: string;
  sellPrice?: number;
  buyPrice?: number;
}

export interface ItemStats {
  attack?: number;
  strength?: number;
  defence?: number;
  ranged?: number;
  magic?: number;
  prayer?: number;
}

export interface ItemReward {
  id: string;
  name: string;
  quantity: number;
}

export interface BankTab {
  id: string;
  name: string;
  items: ItemReward[];
}

export interface Requirement {
  type: 'level' | 'item' | 'equipment';
  skill?: SkillName;
  level?: number;
  itemId?: string;
  quantity?: number;
  category?: string;
}

export interface SkillAction {
  id: string;
  name: string;
  type: 'woodcutting' | 'mining' | 'fishing' | 'smithing' | 'cooking' | 'firemaking' | 'farming' | 'prayer' | 'runecrafting' | 'agility' | 'thieving' | 'crafting' | 'fletching' | 'smithing_category' | 'store';
  description: string;
  requirements: Requirement[];
  experience: number;
  baseTime: number; // in milliseconds
  itemReward: ItemReward;
  skill: SkillName;
}

export interface CombatAction {
    id: string;
    name: string;
    type: 'combat';
    description: string;
    monster: Monster;
    baseTime: number;
    attackStyle?: 'accurate' | 'aggressive' | 'defensive';
}

export interface CombatSelectionAction {
    id: string;
    name: string;
    type: 'combat_selection';
    targetLocation: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  type: 'general' | 'combat' | 'skilling';
  image: string;
  thumbnail: string;
  actions: (SkillAction | CombatSelectionAction)[];
  store?: StoreItem[];
}

export interface StoreItem {
  id: string;
  price: number;
}

export interface StoreAction {
    id: string;
    name: string;
    type: 'store';
    description: string;
    price: number;
    itemId: string;
}

export interface Monster {
    id: string;
    name: string;
    level: number;
    hitpoints: number;
    maxHit: number;
    attackSpeed: number; // in milliseconds
    attackStyle: 'melee' | 'ranged' | 'magic';
    combatStats: CombatStats;
    drops?: { itemId: string; chance: number, quantity?: number }[]; // Chance from 0 to 1
}

export interface SlayerTask {
    monsterId: string;
    monsterName: string;
    amount: number;
    remaining: number;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Nightmare';
}

export interface Character {
  _id?: any;
  id: string;
  name: string;
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
  skills: Record<SkillName, Skill>;
  bank: ItemReward[];
  bankTabs: BankTab[]; // Store bank tabs in character data
  equipment: Record<EquipmentSlot, Item | undefined>;
  lastLogin: Date;
  lastAction: {
    type: string;
    location: string;
    target?: string;
    id?: string;
  };
  lastActionTime: number;
  currentSlayerTask: SlayerTask | null;
  slayerPoints: number;
  slayerTaskStreak: number;
  stats: CharacterStats;
}

export interface CharacterStats {
    totalPlayTime: number;
    totalActiveTime: number;
    totalOfflineTime: number;
    damageDone: number;
    damageTaken: number;
    deaths: number;
    monstersKilled: number;
    bossesKilled: number;
    slayerTasksCompleted: number;
    slayerPointsEarned: number;
    slayerPointsSpent: number;
    cluesCompleted: number;
    coinsEarned: number;
    coinsSpent: number;
    itemsFarmed: number;
    itemsCrafted: number;
    itemsConsumed: number;
    foodEaten: number;
    hitpointsGained: number;

    // --- Detailed tracking ---
    resourcesGathered: Record<string, number>;
    actionsPerformed: Record<string, number>;
    monstersKilledByType: Record<string, number>;
}

export interface CombatStats {
    attack: number;
    strength: number;
    defence: number;
    ranged: number;
    magic: number;
}

export interface LocationState {
    id: string;
    resourceCounts: Record<string, number>;
}

export type CharacterCreationData = Pick<Character, 'name' | 'skills' | 'bank' | 'equipment'>;

export interface GameState {
  character: Character | null;
  user: { id: string; username: string } | null;
  characters: Character[];
  currentLocation: Location | undefined;
  currentAction: SkillAction | CombatAction | CombatSelectionAction | null;
  actionProgress: number;
  isActionInProgress: boolean;
  actionInterval: NodeJS.Timeout | null;
  lastActionTime: number;
  characterState: 'idle' | 'action' | 'combat';
  lastActionReward: {
    xp?: number;
    item?: ItemReward | null;
    levelUp?: { skill: string; level: number };
    skill?: SkillName;
    hitpointsXp?: number;
  } | null;
  selectedMonster: Monster | null;
  lastCombatRound: {
      playerDamage: number;
      monsterDamage: number;
      result: 'victory' | 'defeat' | 'continue';
      loot: string[];
  } | null;

  // Actions
  loadCharacters: (user?: { id: string, username: string }) => Promise<void>;
  saveCharacter: (character: Character) => Promise<void>;
  selectCharacter: (character: Character) => void;
  setCharacter: (character: Character | null) => void;
  createCharacter: (name: string) => Promise<Character | null>;
  startAction: (action: SkillAction | CombatAction | CombatSelectionAction) => void;
  stopAction: () => void;
  completeAction: () => void;
  addItemToBank: (item: Item, quantity: number) => void;
  removeItemFromBank: (itemId: string, quantity: number) => void;
  updateBankOrder: (newBank: ItemReward[]) => void;
  canPerformAction: (action: SkillAction | CombatAction | CombatSelectionAction) => boolean;
  gainExperience: (skill: SkillName, amount: number) => { skill: string; level: number } | null;
  setLocation: (location: Location) => void;
  getNewSlayerTask: (difficulty: 'Easy' | 'Medium' | 'Hard' | 'Nightmare') => void;
  completeSlayerTask: () => void;
  cancelSlayerTask: () => void;
  processOfflineProgress: () => OfflineRewards | null;
  clearActionReward: () => void;
  signOut: () => void;
  updateCharacter: (character: Character) => void;
  buyItem: (itemId: string, quantity: number, buyPrice?: number) => void;
  sellItem: (itemId: string, quantity: number) => void;
  equipItem: (item: Item) => void;
  unequipItem: (slot: keyof Character['equipment']) => void;
  incrementStat: (stat: keyof CharacterStats, amount?: number) => void;
  updateActiveTime: () => void;
  updateOfflineTime: () => void;

  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface OfflineRewards {
    timeAway: number;
    xp: number;
    item: ItemReward | null;
}

export const capLevelRequirement = (level: number): number => {
    return Math.max(1, Math.min(level, 99));
};

// Experience table for levels 1-99 (RuneScape formula)
const EXPERIENCE_TABLE: Record<number, number> = {
  1: 0, 2: 83, 3: 174, 4: 276, 5: 388, 6: 512, 7: 650, 8: 801, 9: 969, 10: 1154,
  11: 1358, 12: 1584, 13: 1833, 14: 2107, 15: 2411, 16: 2746, 17: 3115, 18: 3523, 19: 3973, 20: 4470,
  21: 5018, 22: 5624, 23: 6291, 24: 7028, 25: 7842, 26: 8740, 27: 9730, 28: 10824, 29: 12031, 30: 13363,
  31: 14833, 32: 16456, 33: 18247, 34: 20224, 35: 22406, 36: 24815, 37: 27473, 38: 30408, 39: 33648, 40: 37224,
  41: 41171, 42: 45529, 43: 50339, 44: 55649, 45: 61512, 46: 67983, 47: 75127, 48: 83014, 49: 91721, 50: 101333,
  51: 111945, 52: 123660, 53: 136594, 54: 150872, 55: 166636, 56: 184040, 57: 203254, 58: 224466, 59: 247886, 60: 273742,
  61: 302288, 62: 333804, 63: 368599, 64: 407015, 65: 449428, 66: 496254, 67: 547953, 68: 605032, 69: 668051, 70: 737627,
  71: 814445, 72: 899257, 73: 992895, 74: 1096278, 75: 1210421, 76: 1336443, 77: 1475581, 78: 1629200, 79: 1798808, 80: 1986068,
  81: 2192818, 82: 2421087, 83: 2673114, 84: 2951373, 85: 3258594, 86: 3597792, 87: 3972294, 88: 4385776, 89: 4842295, 90: 5346332,
  91: 5902831, 92: 6517253, 93: 7195629, 94: 7944614, 95: 8771558, 96: 9684577, 97: 10692629, 98: 11805606, 99: 13034431
};

// Function to create a new skill object
export const createSkill = (level: number): Skill => {
  const experience = EXPERIENCE_TABLE[level] || 0;
  return {
    level,
    experience,
    nextLevelExperience: EXPERIENCE_TABLE[level + 1] || EXPERIENCE_TABLE[99]
  };
};

export const getNextLevelExperience = (level: number): number => {
  const cappedLevel = Math.min(level, 99);
  return EXPERIENCE_TABLE[cappedLevel + 1] || EXPERIENCE_TABLE[99];
};