/**
 * Experience calculation utilities using RuneScape's formula
 * Formula: Experience difference between level L-1 and L is floor((L-1+300*2^((L-1)/7))/4)
 */

/**
 * Calculate the experience required for a specific level
 * @param level The level to calculate experience for
 * @returns The total experience required for that level
 */
export const getExperienceForLevel = (level: number): number => {
  if (level <= 1) return 0;
  
  let totalExp = 0;
  for (let l = 1; l < level; l++) {
    totalExp += getExperienceDifference(l);
  }
  return totalExp;
};

/**
 * Calculate the experience difference between level L-1 and L
 * Formula: floor((L-1+300*2^((L-1)/7))/4)
 * @param level The level to calculate the difference for
 * @returns The experience difference
 */
export const getExperienceDifference = (level: number): number => {
  if (level <= 0) return 0;
  return Math.floor((level - 1 + 300 * Math.pow(2, (level - 1) / 7)) / 4);
};

/**
 * Calculate the level from total experience
 * @param experience The total experience
 * @returns The level (1-99)
 */
export const getLevelFromExperience = (experience: number): number => {
  if (experience <= 0) return 1;
  
  let level = 1;
  let totalExp = 0;
  
  while (level <= 99) {
    const nextLevelExp = getExperienceForLevel(level + 1);
    if (experience < nextLevelExp) {
      return level;
    }
    level++;
  }
  
  return 99; // Cap at level 99
};

/**
 * Calculate experience needed for next level
 * @param currentExperience Current total experience
 * @returns Experience needed for next level
 */
export const getExperienceForNextLevel = (currentExperience: number): number => {
  const currentLevel = getLevelFromExperience(currentExperience);
  if (currentLevel >= 99) return 0;
  
  const nextLevelExp = getExperienceForLevel(currentLevel + 1);
  return nextLevelExp - currentExperience;
};

/**
 * Calculate progress to next level (0-1)
 * @param currentExperience Current total experience
 * @returns Progress as a decimal (0-1)
 */
export const getProgressToNextLevel = (currentExperience: number): number => {
  const currentLevel = getLevelFromExperience(currentExperience);
  if (currentLevel >= 99) return 1;
  
  const currentLevelExp = getExperienceForLevel(currentLevel);
  const nextLevelExp = getExperienceForLevel(currentLevel + 1);
  const levelExp = nextLevelExp - currentLevelExp;
  const progressExp = currentExperience - currentLevelExp;
  
  return progressExp / levelExp;
};

/**
 * Experience table for levels 1-99
 * Generated using the RuneScape formula
 */
export const EXPERIENCE_TABLE: Record<number, number> = {
  1: 0,
  2: 83,
  3: 174,
  4: 276,
  5: 388,
  6: 512,
  7: 650,
  8: 801,
  9: 969,
  10: 1154,
  11: 1358,
  12: 1584,
  13: 1833,
  14: 2107,
  15: 2411,
  16: 2746,
  17: 3115,
  18: 3523,
  19: 3973,
  20: 4470,
  21: 5018,
  22: 5624,
  23: 6291,
  24: 7028,
  25: 7842,
  26: 8740,
  27: 9730,
  28: 10824,
  29: 12031,
  30: 13363,
  31: 14833,
  32: 16456,
  33: 18247,
  34: 20224,
  35: 22406,
  36: 24815,
  37: 27473,
  38: 30408,
  39: 33648,
  40: 37224,
  41: 41171,
  42: 45529,
  43: 50339,
  44: 55649,
  45: 61512,
  46: 67983,
  47: 75127,
  48: 83014,
  49: 91721,
  50: 101333,
  51: 111945,
  52: 123660,
  53: 136594,
  54: 150872,
  55: 166636,
  56: 184040,
  57: 203254,
  58: 224466,
  59: 247886,
  60: 273742,
  61: 302288,
  62: 333804,
  63: 368599,
  64: 407015,
  65: 449428,
  66: 496254,
  67: 547953,
  68: 605032,
  69: 668051,
  70: 737627,
  71: 814445,
  72: 899257,
  73: 992895,
  74: 1096278,
  75: 1210421,
  76: 1336443,
  77: 1475581,
  78: 1629200,
  79: 1798808,
  80: 1986068,
  81: 2192818,
  82: 2421087,
  83: 2673114,
  84: 2951373,
  85: 3258594,
  86: 3597792,
  87: 3972294,
  88: 4385776,
  89: 4842295,
  90: 5346332,
  91: 5902831,
  92: 6517253,
  93: 7195629,
  94: 7944614,
  95: 8771558,
  96: 9684577,
  97: 10692629,
  98: 11805606,
  99: 13034431
}; 

// Helper function to calculate total levels from skills
export const calculateTotalLevel = (skills: Record<string, { level: number }> | import('../types/game').Skills): number => {
  return Object.entries(skills)
    .filter(([skillName]) => skillName !== 'none') // Exclude 'none' skill
    .reduce((total, [_, skill]) => total + skill.level, 0);
};

export const calculateTotalExperience = (skills: Record<string, { experience: number }> | import('../types/game').Skills): number => {
  return Object.entries(skills)
    .filter(([skillName]) => skillName !== 'none') // Exclude 'none' skill
    .reduce((total, [_, skill]) => total + skill.experience, 0);
}; 