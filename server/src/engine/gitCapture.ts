import { simpleGit, SimpleGit } from 'simple-git';
import fs from 'fs';
import { GitState } from '../types.js';

export async function captureGitState(repoPath: string): Promise<GitState> {
  if (!fs.existsSync(repoPath)) {
    return {
      branch: 'main',
      diffSummary: 'No changes',
      lastCommitMessage: 'initial commit',
      uncommittedFiles: [],
      additions: 0,
      deletions: 0,
    };
  }

  const git: SimpleGit = simpleGit(repoPath);

  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      return {
        branch: 'untracked',
        diffSummary: 'Not a git repository',
        lastCommitMessage: 'No commit history',
        uncommittedFiles: [],
        additions: 0,
        deletions: 0,
      };
    }

    const currentBranch = (await git.branch()).current || 'main';
    const status = await git.status();
    const log = await git.log({ maxCount: 1 }).catch(() => null);

    // Get diff stat summary
    let diffSummaryText = 'clean working tree';
    let additions = 0;
    let deletions = 0;

    try {
      const diffStat = await git.diffSummary(['HEAD']);
      additions = diffStat.insertions;
      deletions = diffStat.deletions;

      if (diffStat.files.length > 0) {
        const fileParts = diffStat.files.slice(0, 5).map((f) => {
          const ins = 'insertions' in f ? f.insertions : 0;
          const del = 'deletions' in f ? f.deletions : 0;
          return `${f.file} (+${ins}/-${del})`;
        });
        diffSummaryText = fileParts.join(', ');
        if (diffStat.files.length > 5) {
          diffSummaryText += `, +${diffStat.files.length - 5} more files`;
        }
      }
    } catch {
      // If no HEAD exists or error running diff
      diffSummaryText = `${status.files.length} modified/untracked files`;
    }

    const uncommitted = status.files.map((f) => f.path);
    const lastCommit = log?.latest?.message || 'Initial commit';

    return {
      branch: currentBranch,
      diffSummary: diffSummaryText,
      lastCommitMessage: lastCommit,
      uncommittedFiles: uncommitted,
      additions,
      deletions,
    };
  } catch (error) {
    console.error('Git capture error:', error);
    return {
      branch: 'unknown',
      diffSummary: 'Error inspecting git',
      lastCommitMessage: 'unknown',
      uncommittedFiles: [],
      additions: 0,
      deletions: 0,
    };
  }
}
