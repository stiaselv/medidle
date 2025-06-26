import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import clientPromise from './db';
import characterRoutes from './routes/characters';
import authRoutes from './routes/auth';

const app = express();
const port = process.env.PORT || 5000;

// Production and development origins
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175',
  // Add your production frontend URL here
  process.env.FRONTEND_URL || 'https://your-app-name.vercel.app'
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('MedIdle server is running!');
});

// A test route to check DB connection
app.get('/api/db-status', async (req: Request, res: Response) => {
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });
    res.status(200).send({ status: 'success', message: 'Successfully connected to MongoDB!' });
  } catch (e) {
    res.status(500).send({ status: 'error', message: 'Failed to connect to MongoDB', error: e });
  }
});

// Use the character routes
app.use('/api/characters', characterRoutes);
app.use('/api/auth', authRoutes);

clientPromise.then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(err => {
  console.error("Failed to connect to the database. Server not started.", err);
});