import { Router } from 'express';

const router = Router();

// Mock data - same as in the Vercel function
const mockCharacters = [
  {
    id: '1',
    name: 'PlayerOne',
    skills: {
      attack: { level: 99, experience: 13034431 },
      strength: { level: 99, experience: 13034431 },
      defence: { level: 99, experience: 13034431 },
      hitpoints: { level: 99, experience: 13034431 },
      prayer: { level: 99, experience: 13034431 },
      ranged: { level: 99, experience: 13034431 },
      magic: { level: 99, experience: 13034431 },
      cooking: { level: 99, experience: 13034431 },
      woodcutting: { level: 99, experience: 13034431 },
      fletching: { level: 99, experience: 13034431 },
      fishing: { level: 99, experience: 13034431 },
      firemaking: { level: 99, experience: 13034431 },
      crafting: { level: 99, experience: 13034431 },
      smithing: { level: 99, experience: 13034431 },
      mining: { level: 99, experience: 13034431 },
      herblore: { level: 99, experience: 13034431 },
      agility: { level: 99, experience: 13034431 },
      thieving: { level: 99, experience: 13034431 },
      slayer: { level: 99, experience: 13034431 },
      farming: { level: 99, experience: 13034431 },
      runecrafting: { level: 99, experience: 13034431 },
      none: { level: 1, experience: 0 }
    }
  },
  {
    id: '2',
    name: 'SkillMaster',
    skills: {
      attack: { level: 95, experience: 9684577 },
      strength: { level: 96, experience: 10692629 },
      defence: { level: 94, experience: 8740021 },
      hitpoints: { level: 97, experience: 11805606 },
      prayer: { level: 85, experience: 3258594 },
      ranged: { level: 92, experience: 6517253 },
      magic: { level: 98, experience: 12031222 },
      cooking: { level: 90, experience: 5346332 },
      woodcutting: { level: 88, experience: 4385776 },
      fletching: { level: 87, experience: 3972294 },
      fishing: { level: 89, experience: 4842295 },
      firemaking: { level: 86, experience: 3597792 },
      crafting: { level: 91, experience: 5902831 },
      smithing: { level: 93, experience: 7195629 },
      mining: { level: 85, experience: 3258594 },
      herblore: { level: 84, experience: 3000000 },
      agility: { level: 83, experience: 2746773 },
      thieving: { level: 82, experience: 2500000 },
      slayer: { level: 88, experience: 4385776 },
      farming: { level: 79, experience: 1986068 },
      runecrafting: { level: 77, experience: 1629200 },
      none: { level: 1, experience: 0 }
    }
  },
  {
    id: '3',
    name: 'CombatPro',
    skills: {
      attack: { level: 99, experience: 13034431 },
      strength: { level: 99, experience: 13034431 },
      defence: { level: 99, experience: 13034431 },
      hitpoints: { level: 99, experience: 13034431 },
      prayer: { level: 99, experience: 13034431 },
      ranged: { level: 99, experience: 13034431 },
      magic: { level: 99, experience: 13034431 },
      cooking: { level: 75, experience: 1210421 },
      woodcutting: { level: 70, experience: 737627 },
      fletching: { level: 72, experience: 889815 },
      fishing: { level: 68, experience: 618833 },
      firemaking: { level: 65, experience: 449428 },
      crafting: { level: 73, experience: 1000000 },
      smithing: { level: 80, experience: 1986068 },
      mining: { level: 76, experience: 1336443 },
      herblore: { level: 78, experience: 1547953 },
      agility: { level: 74, experience: 1123660 },
      thieving: { level: 71, experience: 809250 },
      slayer: { level: 85, experience: 3258594 },
      farming: { level: 60, experience: 273742 },
      runecrafting: { level: 55, experience: 174777 },
      none: { level: 1, experience: 0 }
    }
  },
  {
    id: '4',
    name: 'Gatherer',
    skills: {
      attack: { level: 60, experience: 273742 },
      strength: { level: 65, experience: 449428 },
      defence: { level: 62, experience: 337423 },
      hitpoints: { level: 70, experience: 737627 },
      prayer: { level: 43, experience: 47388 },
      ranged: { level: 55, experience: 174777 },
      magic: { level: 58, experience: 224466 },
      cooking: { level: 99, experience: 13034431 },
      woodcutting: { level: 99, experience: 13034431 },
      fletching: { level: 95, experience: 9684577 },
      fishing: { level: 99, experience: 13034431 },
      firemaking: { level: 92, experience: 6517253 },
      crafting: { level: 88, experience: 4385776 },
      smithing: { level: 85, experience: 3258594 },
      mining: { level: 99, experience: 13034431 },
      herblore: { level: 90, experience: 5346332 },
      agility: { level: 45, experience: 61512 },
      thieving: { level: 50, experience: 101333 },
      slayer: { level: 40, experience: 37224 },
      farming: { level: 99, experience: 13034431 },
      runecrafting: { level: 85, experience: 3258594 },
      none: { level: 1, experience: 0 }
    }
  },
  {
    id: '5',
    name: 'Balanced',
    skills: {
      attack: { level: 80, experience: 1986068 },
      strength: { level: 82, experience: 2421087 },
      defence: { level: 78, experience: 1629200 },
      hitpoints: { level: 85, experience: 3258594 },
      prayer: { level: 70, experience: 737627 },
      ranged: { level: 75, experience: 1210421 },
      magic: { level: 77, experience: 1547953 },
      cooking: { level: 80, experience: 1986068 },
      woodcutting: { level: 82, experience: 2421087 },
      fletching: { level: 78, experience: 1629200 },
      fishing: { level: 81, experience: 2192818 },
      firemaking: { level: 79, experience: 1798808 },
      crafting: { level: 83, experience: 2746773 },
      smithing: { level: 84, experience: 3123612 },
      mining: { level: 85, experience: 3258594 },
      herblore: { level: 76, experience: 1336443 },
      agility: { level: 77, experience: 1547953 },
      thieving: { level: 80, experience: 1986068 },
      slayer: { level: 82, experience: 2421087 },
      farming: { level: 75, experience: 1210421 },
      runecrafting: { level: 73, experience: 1000000 },
      none: { level: 1, experience: 0 }
    }
  }
];

// Calculate total level and experience for sorting
const calculateTotalLevel = (skills: any) => {
  return Object.entries(skills)
    .filter(([skillName]) => skillName !== 'none')
    .reduce((total, [_, skill]: [string, any]) => total + skill.level, 0);
};

const calculateTotalExperience = (skills: any) => {
  return Object.entries(skills)
    .filter(([skillName]) => skillName !== 'none')
    .reduce((total, [_, skill]: [string, any]) => total + skill.experience, 0);
};

// GET /api/highscores
router.get('/', async (req, res) => {
  try {
    const { skill = 'total' } = req.query;

    let sortedCharacters;

    if (skill === 'total') {
      // Sort by total level, then by total experience
      sortedCharacters = mockCharacters
        .map((char, index) => ({
          characterId: char.id,
          characterName: char.name,
          rank: 0, // Will be set below
          level: calculateTotalLevel(char.skills),
          experience: calculateTotalExperience(char.skills),
          totalLevel: calculateTotalLevel(char.skills),
          totalExperience: calculateTotalExperience(char.skills)
        }))
        .sort((a, b) => {
          if (b.level !== a.level) {
            return b.level - a.level;
          }
          return b.experience - a.experience;
        })
        .map((char, index) => ({ ...char, rank: index + 1 }));
    } else {
      // Sort by specific skill level, then by experience in that skill
      sortedCharacters = mockCharacters
        .map((char, index) => {
          const skillData = char.skills[skill as keyof typeof char.skills] || { level: 1, experience: 0 };
          return {
            characterId: char.id,
            characterName: char.name,
            rank: 0, // Will be set below
            level: skillData.level,
            experience: skillData.experience
          };
        })
        .sort((a, b) => {
          if (b.level !== a.level) {
            return b.level - a.level;
          }
          return b.experience - a.experience;
        })
        .map((char, index) => ({ ...char, rank: index + 1 }));
    }

    res.status(200).json(sortedCharacters);

  } catch (error) {
    console.error('Error in highscores API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 