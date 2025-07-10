import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Collection, ObjectId, MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Inline database connection (previously from _lib/db.ts)
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri);
const clientPromise = client.connect();

// Inline types (previously from _lib/types.ts)
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

// Helper function
export const createSkill = (level: number): Skill => {
  const experience = level === 1 ? 0 : Math.floor(level * level * 83);
  return {
    level,
    experience,
    nextLevelExperience: Math.floor((level + 1) * (level + 1) * 83)
  };
};

// Inline auth middleware (previously from _lib/auth.ts)
export interface AuthenticatedRequest extends VercelRequest {
  user?: {
    userId: string;
    username: string;
  };
}

export function withAuth(handler: (req: AuthenticatedRequest, res: VercelResponse) => Promise<any>) {
  return async (req: AuthenticatedRequest, res: VercelResponse) => {
    try {
      // Enable CORS for authenticated routes
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }

      // Parse cookies
      const cookies = cookie.parse(req.headers.cookie || '');
      const token = cookies.token;

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
      }

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      
      req.user = {
        userId: decoded.userId,
        username: decoded.username
      };

      // Call the original handler
      return await handler(req, res);

    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }
  };
}

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