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
  | 'agility'
  | 'herblore'
  | 'thieving'
  | 'crafting'
  | 'fletching'
  | 'slayer'
  | 'none';  // For store actions and other non-skill activities

export type ActionType = 
  | 'woodcutting'
  | 'fishing'
  | 'mining'
  | 'smithing'
  | 'smithing_category'  // For metal categories in smithing
  | 'cooking'
  | 'firemaking'
  | 'farming'
  | 'herblore'
  | 'combat'
  | 'combat_selection'  // For selecting combat difficulty
  | 'store'
  | 'crafting'
  | 'fletching'
  | 'agility'
  | 'thieving'
  | 'prayer'
  | 'runecrafting'
  | 'none'
  | 'death';

export type ItemType = 'tool' | 'resource' | 'consumable' | 'currency' | 'weapon' | 'armor' | 'ammo';

export type ItemStats = {
  attack?: number;
  strength?: number;
  defence?: number;
  woodcutting?: number;
  fishing?: number;
  mining?: number;
  magic?: number;
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
  hitpoints: Skill;
  agility: Skill;
  herblore: Skill;
  thieving: Skill;
  crafting: Skill;
  fletching: Skill;
  slayer: Skill;
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
    description?: string;
  }>;
}

export interface SkillAction extends BaseAction {
  type: 'woodcutting' | 'mining' | 'fishing' | 'cooking' | 'firemaking' | 'smithing' | 'smithing_category' | 'crafting' | 'fletching' | 'prayer' | 'runecrafting' | 'agility' | 'thieving' | 'farming' | 'herblore';
  skill: SkillName;
  levelRequired: number;
  experience: number;
  baseTime: number;
  itemReward: ItemReward;
  possibleLoot?: {
    id: string;
    name?: string;
    quantity?: number;
    chance: number;
  }[];
  requirements: {
    type: 'level' | 'item' | 'equipment';
    skill?: SkillName;
    level?: number;
    itemId?: string;
    quantity?: number;
    category?: string;
    description?: string;
  }[];
  // Farming-specific properties
  harvestTime?: number; // Time in minutes to harvest after planting
  category?: string; // Category for farming (allotment, herbs, trees)
}

// Patch-based farming system types
export type PatchType = 'allotment' | 'herbs' | 'trees';

export type PatchStatus = 'empty' | 'growing' | 'ready' | 'diseased';

export interface FarmingPatch {
  id: string;
  type: PatchType;
  status: PatchStatus;
  levelRequired: number; // Level required to unlock this patch
  plantedCrop?: {
    cropId: string;
    cropName: string;
    plantedAt: number; // Timestamp when planted
    harvestTime: number; // Growth time in minutes
    experience: number; // XP rewarded on harvest
    itemReward: ItemReward;
  };
}

export interface FarmingCrop {
  id: string;
  name: string;
  type: PatchType;
  levelRequired: number;
  experience: number;
  harvestTime: number; // Growth time in minutes
  itemReward: ItemReward;
  seedRequirement: {
    itemId: string;
    quantity: number;
  };
}

export interface StoreTab {
  id: string;
  name: string;
  items: StoreItem[];
}

export interface StoreAction extends BaseAction {
  type: 'store';
  storeItems?: StoreItem[];
  storeTabs?: StoreTab[];
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
  background?: string; // Background image for combat locations
  actions: (SkillAction | StoreAction | CombatAction | CombatSelectionAction)[];
        availableSkills?: SkillName[];
      group?: 'World' | 'Dungeons' | 'Raids';
      isCombatHub?: boolean; // Flag to indicate this is a combat hub location
      isSlayerHub?: boolean; // Flag to indicate this is a slayer hub location
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

// Branded type for resource counts
export type ResourceCount = number & { __resourceCountBrand: true };
export type StrictResourceMap = { [key: string]: ResourceCount };

// Tracks all persistent character statistics for the statistics modal
export interface CharacterStats {
  // --- General ---
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
  combatLevel: number;
  favouriteAction: string;
  topSkills: Array<{ skill: string; level: number; experience: number }>;

  // --- Gathering ---
  logsChopped: number;
  oresMined: number;
  fishCaught: number;
  itemsPickpocketed: number;
  creaturesHunted: number;
  cropsHarvested: number;

  // --- Processing ---
  itemsCrafted: number;
  arrowsFletched: number;
  barsSmelted: number;
  foodCooked: number;
  logsBurned: number;
  bonesBuried: number;
  runesCrafted: number;

  // --- Combat ---
  monstersKilled: number;
  totalKills: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  favouriteFoodEaten: number;
  totalHealthHealed: number;
  slayerTasksCompleted: number;

  // --- Detailed tracking ---
  resourcesGathered: StrictResourceMap;
  actionsPerformed: Record<string, number>;
  monstersKilledByType: Record<string, number>;
  
  // --- Farming tracking ---
  farmingPatchesPlanted: Record<string, number>; // patchId -> count
  farmingCropsPlanted: Record<string, number>; // cropId -> count
  farmingHarvests: Record<string, number>; // cropId -> total harvested
  
  // --- Thieving tracking ---
  thievingActions: Record<string, number>; // actionId -> count
  
  // --- Agility tracking ---
  agilityLaps: Record<string, number>; // courseId -> laps completed
  
  // --- Processing detailed tracking ---
  smithingActions: Record<string, number>; // actionId -> count (includes forge and smelting)
  cookingActions: Record<string, number>; // foodId -> count
  firemakingLogs: Record<string, number>; // logType -> count burned
  fletchingArrows: Record<string, number>; // arrowType -> count
  fletchingBows: Record<string, number>; // bowType -> count (unstrung)
  fletchingBowsStrung: Record<string, number>; // bowType -> count (strung)
  fletchingJavelins: Record<string, number>; // javelinType -> count
  craftingArmor: Record<string, number>; // armorType -> count
  craftingJewelry: Record<string, number>; // jewelryType -> count
  craftingStaves: Record<string, number>; // staffType -> count
  craftingGems: Record<string, number>; // gemType -> count
  herblorePotions: Record<string, number>; // potionType -> count
  prayerBones: Record<string, number>; // boneType -> count
  runecraftingRunes: Record<string, number>; // runeType -> count
}

export interface Character {
  id: string; // Used on the client
  _id?: any; // Comes from MongoDB
  userId?: any; // Comes from MongoDB
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
  bankTabs: BankTab[]; // Store bank tabs in character data
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
  friends: Friend[];
  messages: Message[];
  friendRequests: FriendRequest[];
  dungeonProgress: Record<string, DungeonProgress>;
  activeQuests: Quest[];
  questProgress: Record<string, QuestProgress>;
  achievements: Achievement[];
  achievementProgress: Record<string, AchievementProgress>;
  autoEating: {
    enabled: boolean;
    tier: number; // 0 = disabled, 1-3 = tier levels
    selectedFood: string | null; // item ID of selected food
  };
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
  attackSpeed?: number; // Attack speed in seconds (e.g., 2.4 for 2.4 seconds between attacks)
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

export interface BankTab {
  id: string;
  name: string;
  items: ItemReward[];
}

export interface GameState {
  // Character state
  character: Character | null;
  user: { id: string; username: string; } | null;
  characters: Character[];
  loadCharacters: (user?: { id: string; username: string; }) => Promise<void>;
  checkAuth: () => Promise<void>;
  selectCharacter: (character: Character) => void;
  deleteCharacter: (characterId: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
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
    result: 'victory' | 'defeat' | 'continue';
    loot: string[];
  } | null;
  isLoading: boolean;

  // Bank state
  bankTabs: BankTab[];
  activeBankTab: string;

  // Farming state
  farmingPatches: FarmingPatch[];
  initializeFarmingPatches: () => void;
  plantCrop: (patchId: string, cropId: string) => boolean;
  harvestPatch: (patchId: string) => void;
  updatePatchStatuses: () => void;

  // View state
  activeView: 'location' | 'combat_selection';
  setView: (view: 'location' | 'combat_selection') => void;

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
  setLocation: (location: Location | undefined) => void;
  startAction: (action: SkillAction | CombatAction | CombatSelectionAction) => void;
  stopAction: () => void;
  completeAction: () => void;
  addItemToBank: (item: Item, quantity: number) => void;
  removeItemFromBank: (itemId: string, quantity: number) => void;
  sellItem: (itemId: string, quantity: number) => void;
  buyItem: (itemId: string, quantity: number, buyPrice?: number) => void;
  updateBankOrder: (newBank: ItemReward[]) => void;
  
  // Bank tab methods
  createBankTab: (name: string, initialItem?: ItemReward) => void;
  deleteBankTab: (tabId: string) => void;
  setBankTab: (tabId: string) => void;
  moveBankItem: (fromTabId: string, fromIndex: number, toTabId: string, toIndex: number) => void;
  equipItem: (item: Item) => void;
  unequipItem: (slot: string) => void;
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
  saveCharacter: (character: Character) => Promise<void>;

  // Stat helpers
  incrementStat: (stat: keyof Character["stats"], amount?: number) => void;
  updateActiveTime: (ms: number) => void;
  updateOfflineTime: (ms: number) => void;

  // Friends system
  sendFriendRequest: (characterName: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  sendMessage: (friendId: string, content: string) => Promise<void>;
  markMessageAsRead: (messageId: string) => void;
  getFriendRequests: () => Promise<FriendRequest[]>;
  getMessages: (friendId: string) => Promise<Message[]>;

  // Quest system
  startQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  updateQuestProgress: (questId: string, requirementId: string, progress: number) => void;
  checkQuestRequirements: (questId: string) => boolean;

  // Achievement system
  checkAchievements: () => void;
  completeAchievement: (achievementId: string) => void;
  getAchievementProgress: (achievementId: string) => number;

  // Auto-eating system
  upgradeAutoEating: (tier: number) => boolean;
  setAutoEatingFood: (foodId: string | null) => void;
  toggleAutoEating: () => void;
  checkAutoEating: () => void;
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
  return EXPERIENCE_TABLE[cappedLevel + 1] || EXPERIENCE_TABLE[99];
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

export const createSkill = (name: string, level = 1): Skill => {
  const experience = EXPERIENCE_TABLE[level] || 0;
  return {
    name,
    level,
    experience,
    nextLevelExperience: EXPERIENCE_TABLE[level + 1] || EXPERIENCE_TABLE[99]
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

export interface Friend {
  id: string;
  characterId: string;
  characterName: string;
  lastOnline: Date;
  isOnline: boolean;
  totalLevel: number;
  combatLevel: number;
  favoriteSkill?: string;
  addedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  sentAt: Date;
  read: boolean;
}

export interface FriendRequest {
  id: string;
  fromCharacterId: string;
  fromCharacterName: string;
  toCharacterId: string;
  toCharacterName: string;
  sentAt: Date;
  status: 'pending' | 'accepted' | 'declined';
} 

export interface DungeonProgress {
  currentMonsterIndex: number;
  completed: boolean;
  monstersDefeated: string[];
  completedAt?: Date;
}

export interface Dungeon {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  monsters: string[]; // Array of monster IDs in order
  completionReward: {
    itemId: string;
    quantity: number;
  };
  thumbnail?: string;
  background?: string;
}

export interface QuestRequirement {
  id: string;
  type: 'item' | 'kill' | 'skill_level';
  itemId?: string;
  itemName?: string;
  monsterId?: string;
  monsterName?: string;
  skillName?: SkillName;
  quantity: number;
  currentQuantity: number;
}

export interface QuestReward {
  id: string;
  type: 'item' | 'experience' | 'gold';
  itemId?: string;
  itemName?: string;
  skillName?: SkillName;
  quantity: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  requirements: QuestRequirement[];
  rewards: QuestReward[];
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: Date;
  startedAt?: Date;
}

export interface QuestProgress {
  questId: string;
  requirements: Record<string, number>; // requirement id -> current progress
  isCompleted: boolean;
  completedAt?: Date;
} 

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'actions' | 'wealth' | 'skills';
  icon: string;
  requirement: {
    type: 'action_count' | 'gold_total' | 'skill_level';
    skillName?: SkillName;
    target: number;
  };
  isCompleted: boolean;
  completedAt?: Date;
}

export interface AchievementProgress {
  achievementId: string;
  currentProgress: number;
  isCompleted: boolean;
  completedAt?: Date;
} 