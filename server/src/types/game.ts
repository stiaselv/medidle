// Shared type definitions for the game
// This file can be used by both the client and server

// Basic types
export type SkillName = 'attack' | 'strength' | 'defence' | 'hitpoints' | 'ranged' | 'magic' | 'prayer' | 'slayer' | 'mining' | 'smithing' | 'fishing' | 'cooking' | 'firemaking' | 'woodcutting' | 'crafting' | 'fletching' | 'thieving' | 'farming' | 'runecrafting' | 'construction' | 'hunter';
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
  type: 'woodcutting' | 'mining' | 'fishing' | 'smithing' | 'cooking' | 'firemaking';
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

export interface StoreAction extends SkillAction {
    type: 'store';
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
  skills: Record<SkillName, Skill>;
  bank: ItemReward[];
  equipment: Record<EquipmentSlot, Item | undefined>;
  lastLogin: Date;
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
  buyItem: (itemId: string, quantity: number) => void;
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

// Function to create a new skill object
export const createSkill = (level: number): Skill => {
  let experience = 0;
  for (let i = 1; i < level; i++) {
    experience += Math.floor(i * i * 83);
  }
  return {
    level,
    experience,
    nextLevelExperience: getNextLevelExperience(level)
  };
};

export const getNextLevelExperience = (level: number): number => {
  const cappedLevel = Math.min(level, 99);
  return cappedLevel * cappedLevel * 83;
};