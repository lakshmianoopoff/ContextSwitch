import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './routes/api.js';
import { initDb } from './db/database.js';
import { runSeed } from './db/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server or workspace root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.set('trust proxy', 1);
const parsedPort = Number.parseInt(process.env.PORT || '', 10);
const PORT = Number.isFinite(parsedPort) ? parsedPort : 4000;

const localOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = (process.env.CORS_ORIGINS || localOrigins.join(','))
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

// Use CORS_ORIGINS for the Vercel production URL (or a comma-separated list).
app.use(cors({
  origin(origin, callback) {
    // Health checks and curl calls do not include a browser Origin header.
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Initialize SQLite database and seed initial demo data
initDb();
runSeed();

// Mount routes both at root and /api for seamless frontend consumption
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
┌────────────────────────────────────────────────────────┐
│   ContextSwitch — Snapshot & Reasoning Engine          │
│   Developer Context Recovery & Resume Assistant        │
├────────────────────────────────────────────────────────┤
│   Server port:    ${PORT}                                  │
│   Health check:   /health                                  │
│   Projects API:   /projects                                │
│   Patterns API:   /patterns                                │
└────────────────────────────────────────────────────────┘
  `);
});

export default app;
