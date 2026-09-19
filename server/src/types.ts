export interface GitState {
  branch: string;
  diffSummary: string;
  lastCommitMessage: string;
  uncommittedFiles: string[];
  additions?: number;
  deletions?: number;
}

export interface TestState {
  failing: string[];
  passing: number;
  diagnostics?: string;
}

export interface TodoItem {
  file: string;
  line: number;
  text: string;
}

export interface Snapshot {
  id?: string;
  project: string;
  timestamp: string;
  git: GitState;
  tests: TestState;
  todos: TodoItem[];
}

export interface ResumeBriefing {
  summary: string;
  unresolvedNote: string;
  nextStep: string;
  suggestedCommand?: string;
}

export interface PatternThemeResult {
  theme: string;
  count: number;
  percentage?: number;
  category?: string;
  avgResolutionTime?: string;
  affectedProjects?: string[];
}

export interface PatternsResponse {
  topPatterns: PatternThemeResult[];
  insight: string;
  recommendation?: string;
}

export interface TrackedProject {
  id: string;
  name: string;
  repoPath: string;
  description: string;
  createdAt: string;
}
