import type { Achievement, SkillName } from '../types/game';

export const ACHIEVEMENTS: Record<string, Achievement> = {
  // Action milestones
  actions_1000: {
    id: 'actions_1000',
    title: 'Action Hero',
    description: 'Perform 1,000 actions of any type',
    category: 'actions',
    icon: '⚡',
    requirement: {
      type: 'action_count',
      target: 1000
    },
    isCompleted: false
  },
  actions_10000: {
    id: 'actions_10000',
    title: 'Legendary Adventurer',
    description: 'Perform 10,000 actions of any type',
    category: 'actions',
    icon: '🏆',
    requirement: {
      type: 'action_count',
      target: 10000
    },
    isCompleted: false
  },

  // Wealth milestones
  wealth_1m: {
    id: 'wealth_1m',
    title: 'Millionaire',
    description: 'Accumulate 1,000,000 gold',
    category: 'wealth',
    icon: '💰',
    requirement: {
      type: 'gold_total',
      target: 1000000
    },
    isCompleted: false
  },
  wealth_1b: {
    id: 'wealth_1b',
    title: 'Billionaire',
    description: 'Accumulate 1,000,000,000 gold',
    category: 'wealth',
    icon: '👑',
    requirement: {
      type: 'gold_total',
      target: 1000000000
    },
    isCompleted: false
  },

  // Skill level 99 achievements
  attack_99: {
    id: 'attack_99',
    title: 'Master Warrior',
    description: 'Reach level 99 in Attack',
    category: 'skills',
    icon: '⚔️',
    requirement: {
      type: 'skill_level',
      skillName: 'attack',
      target: 99
    },
    isCompleted: false
  },
  defence_99: {
    id: 'defence_99',
    title: 'Immovable Object',
    description: 'Reach level 99 in Defence',
    category: 'skills',
    icon: '🛡️',
    requirement: {
      type: 'skill_level',
      skillName: 'defence',
      target: 99
    },
    isCompleted: false
  },
  strength_99: {
    id: 'strength_99',
    title: 'Unstoppable Force',
    description: 'Reach level 99 in Strength',
    category: 'skills',
    icon: '💪',
    requirement: {
      type: 'skill_level',
      skillName: 'strength',
      target: 99
    },
    isCompleted: false
  },
  hitpoints_99: {
    id: 'hitpoints_99',
    title: 'Eternal Life',
    description: 'Reach level 99 in Hitpoints',
    category: 'skills',
    icon: '❤️',
    requirement: {
      type: 'skill_level',
      skillName: 'hitpoints',
      target: 99
    },
    isCompleted: false
  },
  ranged_99: {
    id: 'ranged_99',
    title: 'Master Archer',
    description: 'Reach level 99 in Ranged',
    category: 'skills',
    icon: '🏹',
    requirement: {
      type: 'skill_level',
      skillName: 'ranged',
      target: 99
    },
    isCompleted: false
  },
  prayer_99: {
    id: 'prayer_99',
    title: 'Divine Blessing',
    description: 'Reach level 99 in Prayer',
    category: 'skills',
    icon: '🙏',
    requirement: {
      type: 'skill_level',
      skillName: 'prayer',
      target: 99
    },
    isCompleted: false
  },
  magic_99: {
    id: 'magic_99',
    title: 'Archmage',
    description: 'Reach level 99 in Magic',
    category: 'skills',
    icon: '🔮',
    requirement: {
      type: 'skill_level',
      skillName: 'magic',
      target: 99
    },
    isCompleted: false
  },
  cooking_99: {
    id: 'cooking_99',
    title: 'Master Chef',
    description: 'Reach level 99 in Cooking',
    category: 'skills',
    icon: '👨‍🍳',
    requirement: {
      type: 'skill_level',
      skillName: 'cooking',
      target: 99
    },
    isCompleted: false
  },
  woodcutting_99: {
    id: 'woodcutting_99',
    title: 'Master Lumberjack',
    description: 'Reach level 99 in Woodcutting',
    category: 'skills',
    icon: '🪓',
    requirement: {
      type: 'skill_level',
      skillName: 'woodcutting',
      target: 99
    },
    isCompleted: false
  },
  fletching_99: {
    id: 'fletching_99',
    title: 'Master Fletcher',
    description: 'Reach level 99 in Fletching',
    category: 'skills',
    icon: '🏹',
    requirement: {
      type: 'skill_level',
      skillName: 'fletching',
      target: 99
    },
    isCompleted: false
  },
  fishing_99: {
    id: 'fishing_99',
    title: 'Master Angler',
    description: 'Reach level 99 in Fishing',
    category: 'skills',
    icon: '🎣',
    requirement: {
      type: 'skill_level',
      skillName: 'fishing',
      target: 99
    },
    isCompleted: false
  },
  firemaking_99: {
    id: 'firemaking_99',
    title: 'Pyromancer',
    description: 'Reach level 99 in Firemaking',
    category: 'skills',
    icon: '🔥',
    requirement: {
      type: 'skill_level',
      skillName: 'firemaking',
      target: 99
    },
    isCompleted: false
  },
  crafting_99: {
    id: 'crafting_99',
    title: 'Master Craftsman',
    description: 'Reach level 99 in Crafting',
    category: 'skills',
    icon: '🛠️',
    requirement: {
      type: 'skill_level',
      skillName: 'crafting',
      target: 99
    },
    isCompleted: false
  },
  smithing_99: {
    id: 'smithing_99',
    title: 'Master Smith',
    description: 'Reach level 99 in Smithing',
    category: 'skills',
    icon: '🔨',
    requirement: {
      type: 'skill_level',
      skillName: 'smithing',
      target: 99
    },
    isCompleted: false
  },
  mining_99: {
    id: 'mining_99',
    title: 'Master Miner',
    description: 'Reach level 99 in Mining',
    category: 'skills',
    icon: '⛏️',
    requirement: {
      type: 'skill_level',
      skillName: 'mining',
      target: 99
    },
    isCompleted: false
  },
  herblore_99: {
    id: 'herblore_99',
    title: 'Master Herbalist',
    description: 'Reach level 99 in Herblore',
    category: 'skills',
    icon: '🌿',
    requirement: {
      type: 'skill_level',
      skillName: 'herblore',
      target: 99
    },
    isCompleted: false
  },
  agility_99: {
    id: 'agility_99',
    title: 'Master Acrobat',
    description: 'Reach level 99 in Agility',
    category: 'skills',
    icon: '🤸',
    requirement: {
      type: 'skill_level',
      skillName: 'agility',
      target: 99
    },
    isCompleted: false
  },
  thieving_99: {
    id: 'thieving_99',
    title: 'Master Thief',
    description: 'Reach level 99 in Thieving',
    category: 'skills',
    icon: '🥷',
    requirement: {
      type: 'skill_level',
      skillName: 'thieving',
      target: 99
    },
    isCompleted: false
  },
  slayer_99: {
    id: 'slayer_99',
    title: 'Master Slayer',
    description: 'Reach level 99 in Slayer',
    category: 'skills',
    icon: '💀',
    requirement: {
      type: 'skill_level',
      skillName: 'slayer',
      target: 99
    },
    isCompleted: false
  },
  farming_99: {
    id: 'farming_99',
    title: 'Master Farmer',
    description: 'Reach level 99 in Farming',
    category: 'skills',
    icon: '🌾',
    requirement: {
      type: 'skill_level',
      skillName: 'farming',
      target: 99
    },
    isCompleted: false
  },
  runecrafting_99: {
    id: 'runecrafting_99',
    title: 'Master Runecrafter',
    description: 'Reach level 99 in Runecrafting',
    category: 'skills',
    icon: '🔮',
    requirement: {
      type: 'skill_level',
      skillName: 'runecrafting',
      target: 99
    },
    isCompleted: false
  }
};

export const getAllAchievements = (): Achievement[] => {
  return Object.values(ACHIEVEMENTS);
};

export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS[id];
};

export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return getAllAchievements().filter(achievement => achievement.category === category);
};

export const getCompletedAchievements = (achievements: Achievement[]): Achievement[] => {
  return achievements.filter(achievement => achievement.isCompleted);
};

export const getIncompleteAchievements = (achievements: Achievement[]): Achievement[] => {
  return achievements.filter(achievement => !achievement.isCompleted);
}; 