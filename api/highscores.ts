import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { skill = 'total' } = req.query;

    // Mock highscores data - in a real implementation, this would query the database
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
        }
      },
      {
        id: '2',
        name: 'SkillMaster',
        skills: {
          attack: { level: 95, experience: 9684577 },
          strength: { level: 98, experience: 11805606 },
          defence: { level: 92, experience: 6517253 },
          hitpoints: { level: 96, experience: 10692629 },
          prayer: { level: 85, experience: 3258594 },
          ranged: { level: 99, experience: 13034431 },
          magic: { level: 94, experience: 8771558 },
          cooking: { level: 89, experience: 5346332 },
          woodcutting: { level: 97, experience: 11224382 },
          fletching: { level: 88, experience: 4842295 },
          fishing: { level: 91, experience: 5902831 },
          firemaking: { level: 93, experience: 7195629 },
          crafting: { level: 86, experience: 3597792 },
          smithing: { level: 84, experience: 3258594 },
          mining: { level: 90, experience: 5346332 },
          herblore: { level: 87, experience: 4142160 },
          agility: { level: 82, experience: 2421087 },
          thieving: { level: 89, experience: 5346332 },
          slayer: { level: 95, experience: 9684577 },
          farming: { level: 88, experience: 4842295 },
          runecrafting: { level: 83, experience: 2746773 },
        }
      },
      {
        id: '3',
        name: 'Ironman123',
        skills: {
          attack: { level: 80, experience: 1986068 },
          strength: { level: 85, experience: 3258594 },
          defence: { level: 75, experience: 1210421 },
          hitpoints: { level: 82, experience: 2421087 },
          prayer: { level: 70, experience: 737627 },
          ranged: { level: 88, experience: 4842295 },
          magic: { level: 76, experience: 1336443 },
          cooking: { level: 92, experience: 6517253 },
          woodcutting: { level: 85, experience: 3258594 },
          fletching: { level: 78, experience: 1629200 },
          fishing: { level: 87, experience: 4142160 },
          firemaking: { level: 81, experience: 2192818 },
          crafting: { level: 79, experience: 1798808 },
          smithing: { level: 83, experience: 2746773 },
          mining: { level: 86, experience: 3597792 },
          herblore: { level: 74, experience: 1101333 },
          agility: { level: 77, experience: 1475581 },
          thieving: { level: 72, experience: 889549 },
          slayer: { level: 84, experience: 3258594 },
          farming: { level: 73, experience: 1006013 },
          runecrafting: { level: 68, experience: 609250 },
        }
      },
      {
        id: '4',
        name: 'PvPMaster',
        skills: {
          attack: { level: 99, experience: 13034431 },
          strength: { level: 99, experience: 13034431 },
          defence: { level: 1, experience: 0 },
          hitpoints: { level: 99, experience: 13034431 },
          prayer: { level: 52, experience: 123660 },
          ranged: { level: 99, experience: 13034431 },
          magic: { level: 94, experience: 8771558 },
          cooking: { level: 1, experience: 0 },
          woodcutting: { level: 1, experience: 0 },
          fletching: { level: 1, experience: 0 },
          fishing: { level: 1, experience: 0 },
          firemaking: { level: 1, experience: 0 },
          crafting: { level: 1, experience: 0 },
          smithing: { level: 1, experience: 0 },
          mining: { level: 1, experience: 0 },
          herblore: { level: 1, experience: 0 },
          agility: { level: 1, experience: 0 },
          thieving: { level: 1, experience: 0 },
          slayer: { level: 1, experience: 0 },
          farming: { level: 1, experience: 0 },
          runecrafting: { level: 1, experience: 0 },
        }
      },
      {
        id: '5',
        name: 'Skiller',
        skills: {
          attack: { level: 1, experience: 0 },
          strength: { level: 1, experience: 0 },
          defence: { level: 1, experience: 0 },
          hitpoints: { level: 10, experience: 1154 },
          prayer: { level: 99, experience: 13034431 },
          ranged: { level: 1, experience: 0 },
          magic: { level: 1, experience: 0 },
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
          slayer: { level: 1, experience: 0 },
          farming: { level: 99, experience: 13034431 },
          runecrafting: { level: 99, experience: 13034431 },
        }
      }
    ];

    // Calculate totals and prepare highscore entries
    const calculateTotalLevel = (skills: any) => {
      return Object.values(skills).reduce((total: number, skill: any) => total + skill.level, 0);
    };

    const calculateTotalExperience = (skills: any) => {
      return Object.values(skills).reduce((total: number, skill: any) => total + skill.experience, 0);
    };

    let highscoreEntries;

    if (skill === 'total') {
      // Sort by total level, then by total experience
      highscoreEntries = mockCharacters
        .map(char => ({
          characterId: char.id,
          characterName: char.name,
          rank: 0, // Will be set below
          level: calculateTotalLevel(char.skills),
          experience: calculateTotalExperience(char.skills),
          totalLevel: calculateTotalLevel(char.skills),
          totalExperience: calculateTotalExperience(char.skills)
        }))
        .sort((a, b) => {
          if (b.level !== a.level) return b.level - a.level;
          return b.experience - a.experience;
        });
    } else {
      // Sort by specific skill level, then by experience in that skill
      highscoreEntries = mockCharacters
        .map(char => {
          const skillData = char.skills[skill as keyof typeof char.skills];
          return {
            characterId: char.id,
            characterName: char.name,
            rank: 0, // Will be set below
            level: skillData.level,
            experience: skillData.experience,
            totalLevel: calculateTotalLevel(char.skills),
            totalExperience: calculateTotalExperience(char.skills)
          };
        })
        .sort((a, b) => {
          if (b.level !== a.level) return b.level - a.level;
          return b.experience - a.experience;
        });
    }

    // Assign ranks
    highscoreEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.status(200).json(highscoreEntries);
  } catch (error) {
    console.error('Highscores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 