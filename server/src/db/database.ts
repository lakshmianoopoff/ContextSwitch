import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Snapshot, TrackedProject } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// database.ts loads before server.ts executes, so load local env files here
// before reading DATABASE_PATH.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Local development keeps using server/data/contextswitch.db. Render sets an
// absolute path on its persistent disk through DATABASE_PATH.
const defaultDbPath = path.resolve(__dirname, '../../data/contextswitch.db');
const dbPath = process.env.DATABASE_PATH?.trim() || defaultDbPath;
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      repo_path TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS snapshots (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      git_branch TEXT,
      diff_summary TEXT,
      last_commit_message TEXT,
      uncommitted_files TEXT,
      failing_tests TEXT,
      passing_tests_count INTEGER,
      todos TEXT,
      raw_snapshot_json TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_snapshots_project_ts 
    ON snapshots(project_id, timestamp DESC);
  `);
}

// Projects queries
export function upsertProject(project: TrackedProject): void {
  const stmt = db.prepare(`
    INSERT INTO projects (id, name, repo_path, description, created_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      repo_path = excluded.repo_path,
      description = excluded.description
  `);
  stmt.run(project.id, project.name, project.repoPath, project.description, project.createdAt);
}

export function getAllProjects(): TrackedProject[] {
  const stmt = db.prepare('SELECT id, name, repo_path as repoPath, description, created_at as createdAt FROM projects ORDER BY name ASC');
  return stmt.all() as TrackedProject[];
}

export function getProject(id: string): TrackedProject | undefined {
  const stmt = db.prepare('SELECT id, name, repo_path as repoPath, description, created_at as createdAt FROM projects WHERE id = ?');
  return stmt.get(id) as TrackedProject | undefined;
}

export function deleteProject(id: string): void {
  db.prepare('DELETE FROM snapshots WHERE project_id = ?').run(id);
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
}

// Snapshots queries
export function insertSnapshot(snapshot: Snapshot): Snapshot {
  const id = snapshot.id || `snap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const preparedSnapshot: Snapshot = { ...snapshot, id };

  const stmt = db.prepare(`
    INSERT INTO snapshots (
      id, project_id, timestamp, git_branch, diff_summary, 
      last_commit_message, uncommitted_files, failing_tests, 
      passing_tests_count, todos, raw_snapshot_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    preparedSnapshot.project,
    preparedSnapshot.timestamp,
    preparedSnapshot.git.branch,
    preparedSnapshot.git.diffSummary,
    preparedSnapshot.git.lastCommitMessage,
    JSON.stringify(preparedSnapshot.git.uncommittedFiles),
    JSON.stringify(preparedSnapshot.tests.failing),
    preparedSnapshot.tests.passing,
    JSON.stringify(preparedSnapshot.todos),
    JSON.stringify(preparedSnapshot)
  );

  return preparedSnapshot;
}

export function getLatestSnapshot(projectId: string): Snapshot | null {
  const stmt = db.prepare(`
    SELECT raw_snapshot_json FROM snapshots 
    WHERE project_id = ? 
    ORDER BY timestamp DESC LIMIT 1
  `);
  const row = stmt.get(projectId) as { raw_snapshot_json: string } | undefined;
  if (!row) return null;
  return JSON.parse(row.raw_snapshot_json) as Snapshot;
}

export function getSnapshotHistory(projectId: string, limit = 20): Snapshot[] {
  const stmt = db.prepare(`
    SELECT raw_snapshot_json FROM snapshots 
    WHERE project_id = ? 
    ORDER BY timestamp DESC LIMIT ?
  `);
  const rows = stmt.all(projectId, limit) as { raw_snapshot_json: string }[];
  return rows.map((r) => JSON.parse(r.raw_snapshot_json) as Snapshot);
}

export function getAllSnapshots(limit = 100): Snapshot[] {
  const stmt = db.prepare(`
    SELECT raw_snapshot_json FROM snapshots 
    ORDER BY timestamp DESC LIMIT ?
  `);
  const rows = stmt.all(limit) as { raw_snapshot_json: string }[];
  return rows.map((r) => JSON.parse(r.raw_snapshot_json) as Snapshot);
}
