import { captureGitState } from './gitCapture.js';
import { captureTestResults } from './testCapture.js';
import { scanTodos } from './todoScanner.js';
import { Snapshot } from '../types.js';

export async function runSnapshot(projectId: string, repoPath: string, runLiveTests = false): Promise<Snapshot> {
  const [git, tests, todos] = await Promise.all([
    captureGitState(repoPath),
    captureTestResults(repoPath, runLiveTests),
    scanTodos(repoPath),
  ]);

  const snapshot: Snapshot = {
    project: projectId,
    timestamp: new Date().toISOString(),
    git: {
      branch: git.branch,
      diffSummary: git.diffSummary,
      lastCommitMessage: git.lastCommitMessage,
      uncommittedFiles: git.uncommittedFiles,
      additions: git.additions,
      deletions: git.deletions,
    },
    tests,
    todos,
  };

  return snapshot;
}
