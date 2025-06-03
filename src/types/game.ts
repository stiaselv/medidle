export type SkillName = 
  | 'woodcutting'
  | 'fishing'
  | 'mining'
  | 'smithing'
  | 'cooking'
  | 'firemaking'
  | 'combat'
  | 'farming'
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
  | 'store'
  | 'none';

export type ItemType = 'tool' | 'resource' | 'consumable' | 'currency';

export type ItemStats = {
  attack?: number;
  defence?: number;
  mining?: number;
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
  woodcutting: Skill;
  fishing: Skill;
  mining: Skill;
  smithing: Skill;
  cooking: Skill;
  firemaking: Skill;
  farming: Skill;
  combat: Skill;
  attack: Skill;
  defence: Skill;
  none: Skill;  // For store actions and other non-skill activities
}

export interface Requirement {
  type: 'level' | 'equipment' | 'item';
  skill?: SkillName;
  level?: number;
  itemId?: string;
  quantity?: number;
  description?: string;
}

export interface ItemReward {
  id: string;
  name: string;
  quantity: number;
  thumbnail?: string;
}

export interface SkillAction {
  id: string;
  name: string;
  type: ActionType;
  skill: SkillName;
  levelRequired: number;
  experience: number;
  baseTime: number;
  itemReward: ItemReward;
  requirements?: Requirement[];
  subActions?: SkillAction[];  // For nested actions like smithing categories
}

export interface StoreItem {
  id: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  quantity?: number;  // For limited stock items
  levelRequired?: number;
}

export interface StoreAction extends SkillAction {
  type: 'store';
  storeItems: StoreItem[];
}

export interface Location {
  id: string;
  name: string;
  description: string;
  actions: (SkillAction | StoreAction)[];
  availableSkills?: SkillName[];
  type?: 'store' | 'skill' | 'smithing';  // Added smithing type
}

export interface Equipment {
  [key: string]: {
    id: string;
    name: string;
    quantity: number;
  };
}

export interface Character {
  id: string;
  name: string;
  lastLogin: Date;
  lastAction: {
    type: ActionType;
    location: string;
    target?: string;
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
}

export interface GameState {
  character: Character | null;
  currentLocation: Location | null;
  currentAction: SkillAction | null;
  actionProgress: number;
  isActionInProgress: boolean;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  category: string;
  icon: string;
  buyPrice: number;
  sellPrice: number;
  level?: number;
  stats?: ItemStats;
  slot?: string;
  healing?: number;  // Amount of health restored when consumed
}

export const createSkill = (name: string, level = 1): Skill => ({
  name,
  level,
  experience: 0,
  nextLevelExperience: 83 // Level 2 experience
});

// Helper function to ensure level requirements don't exceed 99
export const capLevelRequirement = (level: number): number => {
  return Math.min(level, 99);
}; 