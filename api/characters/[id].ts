import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Collection, ObjectId } from 'mongodb';
import clientPromise from '../lib/db';
import { withAuth, AuthenticatedRequest } from '../lib/auth';
import { Character } from '../lib/types';

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

    const charactersCollection = await getCharactersCollection();
    
    // Verify ownership
    const existingCharacter = await charactersCollection.findOne({
      _id: characterId,
      userId: new ObjectId(req.user.userId)
    });

    if (!existingCharacter) {
      return res.status(404).json({ message: 'Character not found or access denied.' });
    }

    // Update character
    const result = await charactersCollection.updateOne(
      { _id: characterId },
      { 
        $set: {
          ...characterDataToUpdate,
          lastLogin: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Character not found.' });
    }

    // Return updated character
    const updatedCharacter = await charactersCollection.findOne({ _id: characterId });
    if (!updatedCharacter) {
      return res.status(500).json({ message: 'Failed to retrieve updated character.' });
    }

    const { _id: charId, ...rest } = updatedCharacter;
    res.status(200).json({ ...rest, id: charId });

  } catch (error) {
    console.error('Error updating character:', error);
    res.status(500).json({ message: 'Internal server error.' });
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