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
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// Enable CORS for Vite frontend (http://localhost:5173) and any local dev origin
app.use(cors({
  origin: '*',
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
│   Server live:    http://localhost:${PORT}                 │
│   Health check:   http://localhost:${PORT}/health          │
│   Projects API:   http://localhost:${PORT}/projects        │
│   Patterns API:   http://localhost:${PORT}/patterns        │
└────────────────────────────────────────────────────────┘
  `);
});

export default app;
