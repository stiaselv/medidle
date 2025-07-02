import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Collection, ObjectId } from 'mongodb';
import clientPromise from '../../src/lib/api/db';
import { withAuth, AuthenticatedRequest } from '../../src/lib/api/auth';
import { Character, SkillName, createSkill } from '../../src/lib/api/types';

// Helper to get the characters collection
async function getCharactersCollection(): Promise<Collection<Character>> {
  const client = await clientPromise;
  return client.db().collection<Character>('characters');
}

// Helper function to calculate max hitpoints
const calculateMaxHitpoints = (hitpointsLevel: number): number => {
  return hitpointsLevel;
};

async function handleGetCharacters(req: AuthenticatedRequest, res: VercelResponse) {
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
}

async function handleCreateCharacter(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication details not found.' });
    }

    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.length < 3) {
      return res.status(400).json({ message: 'Character name must be at least 3 characters long.' });
    }

    const charactersCollection = await getCharactersCollection();

    // Check if character with that name already exists for this user
    const existingCharacter = await charactersCollection.findOne({ 
      name, 
      userId: new ObjectId(req.user.userId) 
    });
    if (existingCharacter) {
      return res.status(409).json({ message: 'A character with that name already exists.' });
    }

    const allSkills: SkillName[] = [
      'attack', 'strength', 'defence', 'hitpoints', 'ranged', 'magic', 'prayer', 
      'slayer', 'mining', 'smithing', 'fishing', 'cooking', 'firemaking', 
      'woodcutting', 'crafting', 'fletching', 'thieving', 'farming', 
      'runecrafting', 'construction', 'hunter'
    ];
    
    const initialSkills: Record<SkillName, any> = allSkills.reduce((acc, skill) => {
      acc[skill] = createSkill(skill === 'hitpoints' ? 10 : 1);
      return acc;
    }, {} as Record<SkillName, any>);

    const newCharacter: Omit<Character, 'id' | '_id'> & { userId: ObjectId } = {
      userId: new ObjectId(req.user.userId),
      name,
      combatLevel: 3,
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
      equipment: {
        head: undefined, cape: undefined, neck: undefined, ammo: undefined,
        weapon: undefined, body: undefined, shield: undefined, legs: undefined,
        hands: undefined, feet: undefined, ring: undefined
      },
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
}

const handler = withAuth(async (req: AuthenticatedRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    return handleGetCharacters(req, res);
  } else if (req.method === 'POST') {
    return handleCreateCharacter(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
});

export default handler; 