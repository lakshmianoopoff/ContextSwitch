import { Project, PatternTheme } from '../types';

const API_BASE = 'http://localhost:4000';

export interface BackendStatus {
  connected: boolean;
  message: string;
  codex?: {
    provider: string;
    model: string;
    apiKeyConfigured: boolean;
  };
}

export async function checkBackendHealth(): Promise<BackendStatus> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        message: 'Backend connected (Port 4000)',
        codex: data.codex,
      };
    }
    return { connected: false, message: 'Backend unhealthy' };
  } catch {
    return { connected: false, message: 'Backend offline' };
  }
}

export async function fetchLiveProjects(): Promise<{ projects: Project[]; isLive: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return { projects: data as Project[], isLive: true };
      }
    }
  } catch (error) {
    console.error('Failed to fetch /projects from backend:', error);
  }
  return { projects: [], isLive: false };
}

export interface LivePatternsData {
  patterns: PatternTheme[];
  insight: string;
  recommendation: string;
}

export async function fetchLivePatterns(): Promise<LivePatternsData> {
  try {
    const res = await fetch(`${API_BASE}/patterns`);
    if (res.ok) {
      const data = await res.json();
      if (data.topPatterns && Array.isArray(data.topPatterns)) {
        const patterns = data.topPatterns.map((p: any, i: number) => ({
          id: `pat_${i}`,
          theme: p.theme,
          category: p.category || 'General',
          count: p.count,
          percentage: Math.round((p.count / 20) * 100),
          avgResolutionTime: p.avgResolutionTime || '2 days',
          description: `Identified by Codex reasoning engine across active development pause history.`,
          affectedProjects: p.affectedProjects || [],
          recommendation: data.recommendation || 'Standardize project middleware configuration.',
        }));
        return {
          patterns,
          insight: data.insight || 'No significant pattern detected yet.',
          recommendation: data.recommendation || '',
        };
      }
    }
  } catch (error) {
    console.error('Failed to fetch /patterns from backend:', error);
  }
  return { patterns: [], insight: '', recommendation: '' };
}

export async function triggerLiveSnapshot(
  projectId: string,
  repoPath?: string,
  runLiveTests?: boolean
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/snapshot/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoPath, runLiveTests }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    const err = await res.json().catch(() => ({ error: 'Snapshot failed' }));
    return { success: false, error: err.error || 'Failed to capture snapshot' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

export interface ResumeBriefingData {
  summary: string;
  unresolvedNote: string;
  nextStep: string;
  suggestedCommand?: string;
}

export async function fetchResumeBriefing(projectId: string): Promise<{ briefing?: ResumeBriefingData; projectData?: Project; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/resume/${projectId}`);
    if (res.ok) {
      const data = await res.json();
      return { briefing: data.briefing, projectData: data.projectData };
    }
  } catch (error: any) {
    console.error(`Failed to fetch /resume/${projectId} from backend:`, error);
  }
  return { error: 'Failed to fetch live briefing' };
}

export async function fetchProjectTimeline(projectId: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/snapshots/${projectId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.timeline && Array.isArray(data.timeline)) {
        return data.timeline;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch /snapshots/${projectId} from backend:`, error);
  }
  return [];
}

export async function untrackProject(projectId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, { method: 'DELETE' });
    return res.ok;
  } catch (error) {
    console.error(`Failed to untrack ${projectId}:`, error);
    return false;
  }
}
