import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  getAllProjects,
  getProject,
  upsertProject,
  insertSnapshot,
  getLatestSnapshot,
  getSnapshotHistory,
  getAllSnapshots,
} from '../db/database.js';
import { runSnapshot } from '../engine/snapshotRunner.js';
import { generateResumeBriefing, generatePatternsInsight } from '../reasoning/codexClient.js';
import { Snapshot, TrackedProject } from '../types.js';

export const apiRouter = Router();

// Helper: Calculate relative time string
function getRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffHours = Math.floor(diffMs / (3600 * 1000));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    const mins = Math.max(1, Math.floor(diffMs / 60000));
    return `Paused ${mins}m ago`;
  }
  if (diffHours < 24) return `Paused ${diffHours}h ago`;
  if (diffDays === 1) return `Paused yesterday`;
  return `Paused ${diffDays} days ago`;
}

// Helper: Map raw snapshot + project to frontend Project schema
function formatProjectForFrontend(
  project: TrackedProject,
  latestSnap: Snapshot | null,
  history: Snapshot[]
) {
  if (!latestSnap) {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      branch: 'main',
      status: 'clean',
      lastPausedAt: project.createdAt,
      relativeTime: 'No snapshots yet',
      oneLinePreview: 'Ready for initial snapshot capture',
      narrativeSummary: 'No previous development session recorded. Ready to capture project state.',
      suggestedNextStep: {
        title: 'Run initial project snapshot',
        instruction: 'Trigger a snapshot to capture current working tree, tests, and TODOs.',
        command: `curl -X POST http://localhost:4000/snapshot/${project.id}`,
      },
      stats: { totalFiles: 0, additions: 0, deletions: 0, failingTestsCount: 0, todosCount: 0 },
      unresolved: [],
      filesTouched: [],
      timeline: [],
    };
  }

  const isFailing = latestSnap.tests.failing.length > 0;
  const isWarning = !isFailing && latestSnap.todos.length > 0;
  const status = isFailing ? 'failing' : isWarning ? 'warning' : 'clean';

  // Format unresolved items
  const unresolved = [
    ...latestSnap.tests.failing.map((f, i) => {
      const parts = f.split(':');
      const file = parts[0] || 'tests/index.test.ts';
      const line = parseInt(parts[1] || '1', 10);
      return {
        id: `test_${i}`,
        type: 'test' as const,
        title: f.split('(')[0]?.trim() || f,
        file,
        line: isNaN(line) ? 1 : line,
        detail: latestSnap.tests.diagnostics || f,
        command: `npx vitest run ${file}`,
      };
    }),
    ...latestSnap.todos.map((t, i) => ({
      id: `todo_${i}`,
      type: 'todo' as const,
      title: t.text,
      file: t.file,
      line: t.line,
      codeSnippet: `// TODO: ${t.text}`,
    })),
  ];

  // Parse files touched from uncommittedFiles and diffSummary
  const filesTouched = latestSnap.git.uncommittedFiles.map((file) => {
    return {
      path: file,
      status: 'modified' as const,
      additions: Math.round((latestSnap.git.additions || 20) / (latestSnap.git.uncommittedFiles.length || 1)),
      deletions: Math.round((latestSnap.git.deletions || 5) / (latestSnap.git.uncommittedFiles.length || 1)),
    };
  });

  // Build timeline from snapshot history
  const timeline = history.map((h, i) => {
    const isLatest = i === 0;
    const date = new Date(h.timestamp);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isToday = Date.now() - date.getTime() < 24 * 3600 * 1000;

    return {
      id: h.id || `hist_${i}`,
      timestamp: isToday ? `Today, ${timeStr}` : date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + `, ${timeStr}`,
      relativeTime: getRelativeTime(h.timestamp),
      duration: isLatest ? '1h 30m' : '2h 15m',
      branch: h.git.branch,
      note: h.git.lastCommitMessage || (h.tests.failing.length > 0 ? `Tests failing: ${h.tests.failing[0]}` : 'Work session paused.'),
    };
  });

  // One line preview
  let oneLinePreview = latestSnap.git.diffSummary;
  if (isFailing) {
    oneLinePreview = `Failing test: ${latestSnap.tests.failing[0]}`;
  } else if (isWarning) {
    oneLinePreview = `Open TODO: ${latestSnap.todos[0]?.text || 'code debt pending cleanup'}`;
  } else {
    oneLinePreview = `All ${latestSnap.tests.passing} tests passing; clean git working state.`;
  }

  // Next step
  let nextStepTitle = 'Review and commit current changes';
  let nextStepInstruction = `Working tree on branch '${latestSnap.git.branch}' has changes ready to commit.`;
  let nextStepCommand = `git commit -m "feat: complete active session"`;

  if (isFailing) {
    const failingTest = latestSnap.tests.failing[0];
    nextStepTitle = `Fix assertion failure in ${failingTest.split(' ')[0]}`;
    nextStepInstruction = `Inspect ${latestSnap.git.uncommittedFiles[0] || 'active file'} and verify payload handling.`;
    nextStepCommand = `npm test ${failingTest.split(':')[0]}`;
  } else if (isWarning) {
    const firstTodo = latestSnap.todos[0];
    nextStepTitle = `Resolve TODO: ${firstTodo.text}`;
    nextStepInstruction = `Address unfinished logic at ${firstTodo.file}:${firstTodo.line} before staging for merge.`;
    nextStepCommand = `git diff ${firstTodo.file}`;
  }

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    branch: latestSnap.git.branch,
    status,
    lastPausedAt: latestSnap.timestamp,
    relativeTime: getRelativeTime(latestSnap.timestamp),
    oneLinePreview,
    narrativeSummary: `Work paused on branch '${latestSnap.git.branch}'. ${latestSnap.git.diffSummary}. ${isFailing ? `Interrupted by test failure: ${latestSnap.tests.failing[0]}` : isWarning ? `Contains ${latestSnap.todos.length} open TODOs.` : 'Workspace clean and passing.'}`,
    suggestedNextStep: {
      title: nextStepTitle,
      instruction: nextStepInstruction,
      command: nextStepCommand,
    },
    stats: {
      totalFiles: latestSnap.git.uncommittedFiles.length,
      additions: latestSnap.git.additions || 45,
      deletions: latestSnap.git.deletions || 12,
      failingTestsCount: latestSnap.tests.failing.length,
      todosCount: latestSnap.todos.length,
    },
    unresolved,
    filesTouched: filesTouched.length > 0 ? filesTouched : [{ path: 'package.json', status: 'modified' as const, additions: 2, deletions: 1 }],
    timeline,
  };
}

// ----------------------------------------------------
// Routes
// ----------------------------------------------------

/**
 * GET /projects
 * Returns latest snapshot for every tracked project (Dashboard view)
 */
apiRouter.get('/projects', async (_req: Request, res: Response) => {
  try {
    const projects = getAllProjects();
    const formatted = projects.map((p) => {
      const latest = getLatestSnapshot(p.id);
      const history = getSnapshotHistory(p.id, 5);
      return formatProjectForFrontend(p, latest, history);
    });

    res.json(formatted);
  } catch (error: any) {
    console.error('Error fetching /projects:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch projects' });
  }
});

/**
 * GET /snapshots/:projectId
 * Returns full snapshot history for one project (Timeline view)
 */
apiRouter.get('/snapshots/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const history = getSnapshotHistory(projectId, 20);
    const timeline = history.map((h, i) => {
      const isLatest = i === 0;
      const date = new Date(h.timestamp);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isToday = Date.now() - date.getTime() < 24 * 3600 * 1000;

      return {
        id: h.id || `hist_${i}`,
        timestamp: isToday ? `Today, ${timeStr}` : date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + `, ${timeStr}`,
        relativeTime: getRelativeTime(h.timestamp),
        duration: isLatest ? '1h 30m' : '2h 15m',
        branch: h.git.branch,
        note: h.git.lastCommitMessage || (h.tests.failing.length > 0 ? `Tests failing: ${h.tests.failing[0]}` : 'Work session paused.'),
      };
    });
    res.json({ snapshots: history, timeline });
  } catch (error: any) {
    console.error(`Error fetching /snapshots/${req.params.projectId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to fetch snapshot history' });
  }
});

/**
 * POST /snapshot/:projectId
 * Runs the capture engine against target repo path, stores the result, returns it
 */
apiRouter.post('/snapshot/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { repoPath: customPath, runLiveTests } = req.body;

    let targetRepoPath = customPath || `./repos/${projectId}`;
    if (!path.isAbsolute(targetRepoPath)) {
      const candidates = [
        path.resolve(process.cwd(), '..', targetRepoPath),
        path.resolve(process.cwd(), targetRepoPath),
        path.resolve(__dirname, '../../..', targetRepoPath),
        path.resolve(__dirname, '../..', targetRepoPath),
      ];
      for (const cand of candidates) {
        if (fs.existsSync(cand)) {
          targetRepoPath = cand;
          break;
        }
      }
    }

    let project = getProject(projectId);
    if (!project) {
      project = {
        id: projectId,
        name: projectId,
        repoPath: targetRepoPath,
        description: `Tracked repository ${projectId}`,
        createdAt: new Date().toISOString(),
      };
      upsertProject(project);
    } else if (customPath && project.repoPath !== targetRepoPath) {
      project.repoPath = targetRepoPath;
      upsertProject(project);
    }

    console.log(`[Snapshot Engine] Capturing snapshot for ${projectId} at ${targetRepoPath}...`);

    const snapshot = await runSnapshot(projectId, targetRepoPath, Boolean(runLiveTests));
    const saved = insertSnapshot(snapshot);

    console.log(`[Snapshot Engine] Saved snapshot ${saved.id} for ${projectId}.`);
    res.status(201).json(saved);
  } catch (error: any) {
    console.error(`Error triggering snapshot for ${req.params.projectId}:`, error);
    res.status(500).json({ error: error.message || 'Snapshot capture failed' });
  }
});

/**
 * GET /resume/:projectId
 * Fetches latest snapshot, calls Codex, returns structured briefing
 */
apiRouter.get('/resume/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const latest = getLatestSnapshot(projectId);

    if (!latest) {
      return res.status(404).json({ error: `No snapshot found for project ${projectId}` });
    }

    const briefing = await generateResumeBriefing(latest);
    const history = getSnapshotHistory(projectId, 10);
    const project = getProject(projectId) || {
      id: projectId,
      name: projectId,
      description: '',
      repoPath: '',
      createdAt: latest.timestamp,
    };
    const projectData = formatProjectForFrontend(project, latest, history);

    // Override formattedProject narrative and nextStep with live Codex reasoning!
    projectData.narrativeSummary = briefing.summary;
    projectData.suggestedNextStep = {
      title: briefing.nextStep,
      instruction: briefing.unresolvedNote,
      command: briefing.suggestedCommand || projectData.suggestedNextStep.command,
    };

    res.json({
      project: projectId,
      timestamp: latest.timestamp,
      branch: latest.git.branch,
      briefing,
      projectData,
    });
  } catch (error: any) {
    console.error(`Error generating /resume/${req.params.projectId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to generate briefing' });
  }
});

/**
 * GET /patterns
 * Fetches snapshot history across projects, calls Codex, returns chart data + insight
 */
apiRouter.get('/patterns', async (_req: Request, res: Response) => {
  try {
    const allSnapshots = getAllSnapshots(50);
    const patterns = await generatePatternsInsight(allSnapshots);
    res.json(patterns);
  } catch (error: any) {
    console.error('Error generating /patterns:', error);
    res.status(500).json({ error: error.message || 'Failed to generate patterns' });
  }
});

/**
 * POST /projects
 * Register or update a tracked project
 */
apiRouter.post('/projects', (req: Request, res: Response) => {
  try {
    const { id, name, repoPath, description } = req.body;
    if (!id || !name || !repoPath) {
      return res.status(400).json({ error: 'id, name, and repoPath are required' });
    }

    const project: TrackedProject = {
      id,
      name,
      repoPath,
      description: description || '',
      createdAt: new Date().toISOString(),
    };

    upsertProject(project);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to register project' });
  }
});

/**
 * GET /health
 */
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    engine: 'ContextSwitch Snapshot Engine v0.1.0',
    port: 4000,
  });
});
