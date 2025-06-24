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

        const allSkills: SkillName[] = ['attack', 'strength', 'defence', 'hitpoints', 'ranged', 'magic', 'prayer', 'slayer', 'mining', 'smithing', 'fishing', 'cooking', 'firemaking', 'woodcutting', 'crafting', 'fletching', 'thieving', 'farming', 'runecrafting', 'construction', 'hunter'];
        const initialSkills: Record<SkillName, Skill> = allSkills.reduce((acc, skill) => {
            acc[skill] = createSkill(skill === 'hitpoints' ? 10 : 1);
            return acc;
        }, {} as Record<SkillName, Skill>);


        const newCharacter: Omit<Character, 'id' | '_id'> & { userId: ObjectId } = {
            userId: new ObjectId(req.user.userId),
            name,
            combatLevel: 3,
            hitpoints: 10,
            maxHitpoints: 10,
            skills: initialSkills,
            bank: [
                { id: 'coins', name: 'Coins', quantity: 25 },
                { id: 'bronze_axe', name: 'Bronze Axe', quantity: 1 },
                { id: 'bronze_pickaxe', name: 'Bronze Pickaxe', quantity: 1 },
                { id: 'small_fishing_net', name: 'Small Fishing Net', quantity: 1 }
            ],
            equipment: { head: undefined, cape: undefined, neck: undefined, ammo: undefined, weapon: undefined, body: undefined, shield: undefined, legs: undefined, hands: undefined, feet: undefined, ring: undefined },
            lastLogin: new Date(),
            lastActionTime: Date.now(),
            currentSlayerTask: null,
            slayerPoints: 0,
            slayerTaskStreak: 0,
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
            prayer: 1,
            maxPrayer: 1,
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

export default router;