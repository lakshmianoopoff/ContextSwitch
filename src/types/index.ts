export type StatusType = 'clean' | 'warning' | 'failing';

export type UnresolvedType = 'test' | 'todo';

export interface UnresolvedItem {
  id: string;
  type: UnresolvedType;
  title: string;
  file: string;
  line: number;
  column?: number;
  detail?: string;
  codeSnippet?: string;
  command?: string;
}

export interface TouchedFile {
  path: string;
  status: 'modified' | 'added' | 'deleted';
  additions: number;
  deletions: number;
}

export interface SessionEntry {
  id: string;
  timestamp: string;
  relativeTime: string;
  duration: string;
  branch: string;
  note: string;
}

export interface SuggestedNextStep {
  title: string;
  instruction: string;
  command?: string;
}

export interface ProjectStats {
  totalFiles: number;
  additions: number;
  deletions: number;
  failingTestsCount: number;
  todosCount: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  branch: string;
  status: StatusType;
  lastPausedAt: string;
  relativeTime: string;
  oneLinePreview: string;
  narrativeSummary: string;
  suggestedNextStep: SuggestedNextStep;
  unresolved: UnresolvedItem[];
  filesTouched: TouchedFile[];
  timeline: SessionEntry[];
  stats: ProjectStats;
}

export interface PatternTheme {
  id: string;
  theme: string;
  category: string;
  count: number;
  percentage: number;
  avgResolutionTime: string;
  description: string;
  affectedProjects: string[];
  recommendation: string;
}

export type ActiveView = 'dashboard' | 'briefing' | 'patterns';
