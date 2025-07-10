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

async function handleUpdateCharacter(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication details not found.' });
    }

    const { id } = req.query;
    if (!id || !ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: 'Invalid character ID format.' });
    }
    
    const characterId = new ObjectId(id as string);
    // Accept both 'id' and '_id' from the frontend, but do not update them
    const { id: reqBodyId, _id, userId, ...characterDataToUpdate } = req.body;

    console.log('Updating character:', characterId.toString());
    console.log('Update data keys:', Object.keys(characterDataToUpdate));

    const charactersCollection = await getCharactersCollection();
    
    // Verify ownership
    const existingCharacter = await charactersCollection.findOne({
      _id: characterId,
      userId: new ObjectId(req.user.userId)
    });

    if (!existingCharacter) {
      return res.status(404).json({ message: 'Character not found or access denied.' });
    }

    // Ensure dates are properly handled
    if (characterDataToUpdate.lastLogin) {
      characterDataToUpdate.lastLogin = new Date(characterDataToUpdate.lastLogin);
    }

    // Update character
    const result = await charactersCollection.updateOne(
      { _id: characterId },
      { 
        $set: {
          ...characterDataToUpdate,
          lastActionTime: Date.now()
        }
      }
    );

    console.log('Update result:', { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Character not found.' });
    }

    res.status(200).json({ message: 'Character updated successfully', modifiedCount: result.modifiedCount });

  } catch (error) {
    console.error('Error updating character:', error);
    res.status(500).json({ message: 'Internal server error.', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

const handler = withAuth(async (req: AuthenticatedRequest, res: VercelResponse) => {
  if (req.method === 'PUT') {
    return handleUpdateCharacter(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
});

export default handler; 