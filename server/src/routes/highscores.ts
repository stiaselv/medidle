import { Router } from 'express';
import { Collection } from 'mongodb';
import clientPromise from '../db';
import type { Character } from '../types/game';

const router = Router();

async function getCharactersCollection(): Promise<Collection<Character>> {
  const client = await clientPromise;
  return client.db().collection<Character>('characters');
}

// Helper function to calculate level from experience
const calculateLevel = (experience: number): number => {
  if (experience <= 0) return 1;
  
  let level = 1;
  let totalExp = 0;
  
  while (level < 99) {
    const expForNextLevel = Math.floor(level + 300 * Math.pow(2, level / 7)) / 4;
    totalExp += expForNextLevel;
    
    if (experience < totalExp) {
      break;
    }
    level++;
  }
  
  return level;
};

const calculateTotalLevel = (skills: Record<string, { experience: number }>): number => {
  return Object.values(skills)
    .filter(skill => skill && typeof skill.experience === 'number')
    .reduce((total, skill) => total + calculateLevel(skill.experience), 0);
};

const calculateTotalExperience = (skills: Record<string, { experience: number }>): number => {
  return Object.values(skills)
    .filter(skill => skill && typeof skill.experience === 'number')
    .reduce((total, skill) => total + skill.experience, 0);
};

// GET /api/highscores
router.get('/', async (req, res) => {
  try {
    const { skill = 'total', currentCharacterId } = req.query;
    
    const charactersCollection = await getCharactersCollection();
    
    // Fetch all characters from the database
    const allCharacters = await charactersCollection.find({}).toArray();
    
    if (allCharacters.length === 0) {
      // Return empty array if no characters exist
      return res.status(200).json([]);
    }

    let sortedCharacters;

    if (skill === 'total') {
      // Sort by total level, then by total experience
      sortedCharacters = allCharacters
        .map((char) => ({
          characterId: char._id?.toString() || char.id,
          characterName: char.name,
          rank: 0, // Will be set below
          level: calculateTotalLevel(char.skills),
          experience: calculateTotalExperience(char.skills),
          totalLevel: calculateTotalLevel(char.skills),
          totalExperience: calculateTotalExperience(char.skills),
          isCurrentUser: char._id?.toString() === currentCharacterId || char.id === currentCharacterId
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
      sortedCharacters = allCharacters
        .map((char) => {
          const skillData = char.skills[skill as keyof typeof char.skills] || { experience: 0 };
          const skillLevel = calculateLevel(skillData.experience);
          return {
            characterId: char._id?.toString() || char.id,
            characterName: char.name,
            rank: 0, // Will be set below
            level: skillLevel,
            experience: skillData.experience,
            isCurrentUser: char._id?.toString() === currentCharacterId || char.id === currentCharacterId
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

    // Return top 10 + current user's rank if not in top 10
    const top10 = sortedCharacters.slice(0, 10);
    const currentUserEntry = sortedCharacters.find(char => char.isCurrentUser);
    
    let result = top10;
    
    // If current user is not in top 10, add them separately
    if (currentUserEntry && currentUserEntry.rank > 10) {
      result = [...top10, currentUserEntry];
    }

    res.status(200).json(result);

  } catch (error) {
    console.error('Error in highscores API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;