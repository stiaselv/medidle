// Essential types for API routes
export type SkillName = 'attack' | 'strength' | 'defence' | 'hitpoints' | 'ranged' | 'magic' | 'prayer' | 'slayer' | 'mining' | 'smithing' | 'fishing' | 'cooking' | 'firemaking' | 'woodcutting' | 'crafting' | 'fletching' | 'thieving' | 'farming' | 'runecrafting' | 'construction' | 'hunter';
export type ItemType = 'tool' | 'resource' | 'consumable' | 'equipment';
export type EquipmentSlot = 'head' | 'cape' | 'neck' | 'ammo' | 'weapon' | 'body' | 'shield' | 'legs' | 'hands' | 'feet' | 'ring';

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
  resourcesGathered: Record<string, number>;
  actionsPerformed: Record<string, number>;
  monstersKilledByType: Record<string, number>;
}

// Helper functions
export const createSkill = (level: number): Skill => {
  const experience = level === 1 ? 0 : Math.floor(level * level * 83);
  return {
    level,
    experience,
    nextLevelExperience: Math.floor((level + 1) * (level + 1) * 83)
  };
};

// User interface for authentication
export interface User {
  _id?: string;
  username: string;
  passwordHash: string;
} 