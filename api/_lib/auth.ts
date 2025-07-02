import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export interface AuthenticatedRequest extends VercelRequest {
  user?: {
    userId: string;
    username: string;
  };
}

export function withAuth(handler: (req: AuthenticatedRequest, res: VercelResponse) => Promise<any>) {
  return async (req: AuthenticatedRequest, res: VercelResponse) => {
    try {
      // Parse cookies
      const cookies = cookie.parse(req.headers.cookie || '');
      const token = cookies.token;

      if (!token) {
        return res.status(401).json({ message: 'Authentication token missing.' });
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