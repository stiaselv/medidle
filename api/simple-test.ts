import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    res.status(200).json({
      success: true,
      message: 'Simple test working!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Simple test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 