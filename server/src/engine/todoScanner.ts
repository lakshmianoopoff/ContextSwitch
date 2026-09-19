import fs from 'fs';
import path from 'path';
import { TodoItem } from '../types.js';

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  '.next',
  'coverage',
  'vendor',
  '.turbo',
  '.cache',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.py',
  '.go',
  '.rs',
  '.java',
  '.rb',
  '.sql',
  '.c',
  '.cpp',
  '.h',
  '.cs',
  '.sh',
  '.yaml',
  '.yml',
  '.json',
]);

export async function scanTodos(repoPath: string, maxFiles = 300): Promise<TodoItem[]> {
  const todos: TodoItem[] = [];
  if (!fs.existsSync(repoPath)) return todos;

  let fileCount = 0;

  function walk(currentDir: string) {
    if (fileCount >= maxFiles) return;

    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (fileCount >= maxFiles) break;

      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ALLOWED_EXTENSIONS.has(ext)) {
          fileCount++;
          scanFile(fullPath, repoPath, todos);
        }
      }
    }
  }

  walk(repoPath);
  return todos;
}

function scanFile(filePath: string, repoRoot: string, todos: TodoItem[]): void {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const relativePath = path.relative(repoRoot, filePath).replace(/\\/g, '/');

    // Regex for TODO comments across multiple language styles:
    // // TODO: something
    // # TODO: something
    // -- TODO: something
    // /* TODO: something */
    const todoRegex = /(?:\/\/|#|--|\/\*)\s*TODO:?\s*(.*?)(?:\*\/|$)/i;

    lines.forEach((line, index) => {
      const match = line.match(todoRegex);
      if (match && match[1]) {
        const todoText = match[1].trim();
        if (todoText) {
          todos.push({
            file: relativePath,
            line: index + 1,
            text: todoText,
          });
        }
      }
    });
  } catch {
    // skip unreadable files
  }
}
