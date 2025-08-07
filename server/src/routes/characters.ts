import express from 'express';
import { Collection, ObjectId } from 'mongodb';
import clientPromise from '../db';
import { withAuth, AuthenticatedRequest } from '../middleware/auth';
import type { Character, Skill, SkillName } from '../types/game';
import { createSkill } from '../types/game'; // Assuming createSkill is in game.ts

const router = express.Router();

// Middleware to log headers for debugging
const logHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('--- Incoming Headers for /api/characters ---');
    console.log(req.headers);
    console.log('--- Cookies ---');
    console.log(req.cookies);
    console.log('------------------------------------------');
    next();
};

// Helper function to calculate max hitpoints based on hitpoints skill level
const calculateMaxHitpoints = (hitpointsLevel: number): number => {
  // Max hitpoints equals the hitpoints skill level
  return hitpointsLevel;
};

// Helper functions for experience and level calculations
const calculateLevel = (experience: number): number => {
  // Find the highest level where the experience requirement is met
  let level = 1;
  while (experience >= Math.floor(level * level * 83)) {
    level++;
    if (level > 99) return 99; // Cap level at 99
  }
  return level;
};

// Helper to get the characters collection
async function getCharactersCollection(): Promise<Collection<Character>> {
  const client = await clientPromise;
  return client.db().collection<Character>('characters');
}

// GET /api/characters - Fetch all characters for the logged-in user
router.get('/', logHeaders, withAuth, (req: AuthenticatedRequest, res, next) => {
  (async () => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication details not found.' });
      }

      const charactersCollection = await getCharactersCollection();
      const characters = await charactersCollection.find({ userId: new ObjectId(req.user.userId) }).toArray();
      
      // Map _id to id for client-side consistency
      const charactersForClient = characters.map(char => {
          const { _id, ...rest } = char;
          return {
              ...rest,
              id: _id,
              prayer: typeof char.prayer === 'number' ? char.prayer : 1,
              maxPrayer: typeof char.maxPrayer === 'number' ? char.maxPrayer : 1,
          };
      });

      res.status(200).json(charactersForClient);
    } catch (error) {
      console.error('Error fetching characters:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  })().catch(next);
});


// POST /api/characters - Create a new character
router.post('/', withAuth, (req: AuthenticatedRequest, res, next) => {
  (async () => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication details not found.' });
        }

        const { name } = req.body;
        if (!name || typeof name !== 'string' || name.length < 3) {
            return res.status(400).json({ message: 'Character name must be at least 3 characters long.' });
        }

        const charactersCollection = await getCharactersCollection();

        // Check if a character with that name already exists for this user
        const existingCharacter = await charactersCollection.findOne({ name, userId: new ObjectId(req.user.userId) });
        if (existingCharacter) {
            return res.status(409).json({ message: 'A character with that name already exists.' });
        }

        const allSkills: SkillName[] = ['attack', 'strength', 'defence', 'hitpoints', 'ranged', 'magic', 'prayer', 'slayer', 'mining', 'smithing', 'fishing', 'cooking', 'firemaking', 'woodcutting', 'crafting', 'fletching', 'thieving', 'farming', 'runecrafting', 'agility'];
        
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
        
        const initialSkills: Record<SkillName, Skill> = allSkills.reduce((acc, skill) => {
            acc[skill] = createSkill(skill === 'hitpoints' ? 10 : 1);
            return acc;
        }, {} as Record<SkillName, Skill>);


        // Calculate proper combat level based on initial skills
        const calculateCombatLevel = (skills: Record<SkillName, any>): number => {
          const defence = calculateLevel(skills.defence.experience);
          const hitpoints = calculateLevel(skills.hitpoints.experience);
          const prayer = calculateLevel(skills.prayer.experience);
          const attack = calculateLevel(skills.attack.experience);
          const strength = calculateLevel(skills.strength.experience);
          const ranged = calculateLevel(skills.ranged.experience);
          const magic = calculateLevel(skills.magic.experience);

          // Base = (1/4) × (Defence + Hitpoints + floor(Prayer × 1/2))
          const base = (1/4) * (defence + hitpoints + Math.floor(prayer * 0.5));

          // Melee = (13/40) × (Attack + Strength)
          const melee = (13/40) * (attack + strength);

          // Range = (13/40) × floor(Ranged × 3/2)
          const range = (13/40) * Math.floor(ranged * 1.5);

          // Mage = (13/40) × floor(Magic × 3/2)
          const mage = (13/40) * Math.floor(magic * 1.5);

          // Final = floor(Base + max(Melee, Range, Mage))
          return Math.floor(base + Math.max(melee, range, mage));
        };

        const newCharacter: Omit<Character, 'id' | '_id'> & { userId: ObjectId } = {
            userId: new ObjectId(req.user.userId),
            name,
            combatLevel: calculateCombatLevel(initialSkills),
            hitpoints: 10,
            maxHitpoints: calculateMaxHitpoints(initialSkills['hitpoints'].level),
            prayer: 1,
            maxPrayer: 1,
            specialEnergy: 100,
            maxSpecialEnergy: 100,
            activeEffects: [],
            skills: initialSkills,
            bank: [
                { id: 'coins', name: 'Coins', quantity: 25 },
                { id: 'bronze_axe', name: 'Bronze Axe', quantity: 1 },
                { id: 'bronze_pickaxe', name: 'Bronze Pickaxe', quantity: 1 },
                { id: 'small_fishing_net', name: 'Small Fishing Net', quantity: 1 }
            ],
            equipment: { head: undefined, cape: undefined, neck: undefined, ammo: undefined, weapon: undefined, body: undefined, shield: undefined, legs: undefined, hands: undefined, feet: undefined, ring: undefined },
            lastLogin: new Date(),
            lastAction: {
                type: 'none',
                location: '',
                target: undefined,
                id: undefined
            },
            lastActionTime: Date.now(),
            currentSlayerTask: null,
            slayerPoints: 0,
            slayerTaskStreak: 0,
            bankTabs: [
              {
                id: 'main',
                name: 'Main',
                items: [
                  { id: 'coins', name: 'Coins', quantity: 25 },
                  { id: 'bronze_axe', name: 'Bronze Axe', quantity: 1 },
                  { id: 'bronze_pickaxe', name: 'Bronze Pickaxe', quantity: 1 },
                  { id: 'small_fishing_net', name: 'Small Fishing Net', quantity: 1 }
                ]
              }
            ],
            stats: {
                totalPlayTime: 0,
                totalActiveTime: 0,
                totalOfflineTime: 0,
                damageDone: 0,
                damageTaken: 0,
                deaths: 0,
                monstersKilled: 0,
                bossesKilled: 0,
                slayerTasksCompleted: 0,
                slayerPointsEarned: 0,
                slayerPointsSpent: 0,
                cluesCompleted: 0,
                coinsEarned: 25,
                coinsSpent: 0,
                itemsFarmed: 0,
                itemsCrafted: 0,
                itemsConsumed: 0,
                foodEaten: 0,
                hitpointsGained: 0,
                resourcesGathered: {},
                actionsPerformed: {},
                monstersKilledByType: {},
            },
        };

        const result = await charactersCollection.insertOne(newCharacter as any);
        const createdCharacter = await charactersCollection.findOne({ _id: result.insertedId });
        
        if (!createdCharacter) {
            return res.status(500).json({ message: 'Failed to retrieve created character.' });
        }

        const { _id, ...rest } = createdCharacter;
        res.status(201).json({ ...rest, id: _id });

    } catch (error) {
        console.error('Error creating character:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
  })().catch(next);
});


// PUT /api/characters/:id - Save character progress
router.put('/:id', withAuth, (req: AuthenticatedRequest, res, next) => {
  (async () => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication details not found.' });
        }

        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid character ID format.' });
        }
        
        // Log the incoming request body for debugging
        console.log('PUT /api/characters/:id - Incoming body:', req.body);

        const characterId = new ObjectId(id);
        // Accept both 'id' and '_id' from the frontend, but do not update them
        const { id: reqBodyId, _id, userId, ...characterDataToUpdate } = req.body;

        // Log the update payload
        console.log('Updating character:', characterId, characterDataToUpdate);

        const charactersCollection = await getCharactersCollection();
        
        // Ensure the character belongs to the logged-in user
        const character = await charactersCollection.findOne({ _id: characterId, userId: new ObjectId(req.user.userId) });
        if (!character) {
            return res.status(404).json({ message: 'Character not found or you do not have permission to edit it.' });
        }

        // Update the entire character document except for _id and userId
        const result = await charactersCollection.updateOne(
            { _id: characterId },
            { $set: characterDataToUpdate }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Character not found.' });
        }

        res.status(200).json({ message: 'Character saved successfully.' });
    } catch (error) {
        console.error('Error saving character:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
  })().catch(next);
});

// DELETE /api/characters/:id - Delete a character
router.delete('/:id', withAuth, (req: AuthenticatedRequest, res, next) => {
  (async () => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication details not found.' });
      }

      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid character ID format.' });
      }

      const characterId = new ObjectId(id);
      const charactersCollection = await getCharactersCollection();
      
      // Ensure the character belongs to the logged-in user
      const character = await charactersCollection.findOne({ _id: characterId, userId: new ObjectId(req.user.userId) });
      if (!character) {
        return res.status(404).json({ message: 'Character not found or you do not have permission to delete it.' });
      }

      // Delete the character
      const result = await charactersCollection.deleteOne({ _id: characterId });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Character not found.' });
      }

      res.status(200).json({ message: 'Character deleted successfully.' });
    } catch (error) {
      console.error('Error deleting character:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  })().catch(next);
});

export default router;