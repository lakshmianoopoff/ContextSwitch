import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ActiveView, Project, PatternTheme } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { BriefingView } from './components/briefing/BriefingView';
import { PatternsView } from './components/patterns/PatternsView';
import { Toast } from './components/common/Toast';
import { TrackRepoModal } from './components/common/TrackRepoModal';
import { JudgeGuideModal } from './components/common/JudgeGuideModal';
import { fetchLiveProjects, fetchLivePatterns, triggerLiveSnapshot, checkBackendHealth, untrackProject } from './services/api';

export function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [patterns, setPatterns] = useState<PatternTheme[]>([]);
  const [patternsInsight, setPatternsInsight] = useState<string>('');
  const [patternsRecommendation, setPatternsRecommendation] = useState<string>('');
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Auto-open interactive guide for first-time visitors / judges
  useEffect(() => {
    try {
      const seen = localStorage.getItem('contextswitch_tour_seen');
      if (!seen) {
        const timer = setTimeout(() => setIsTourOpen(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Load live data from backend (GET /projects & GET /patterns)
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const health = await checkBackendHealth();
      setIsLiveBackend(health.connected);

      const { projects: liveProjects, isLive } = await fetchLiveProjects();
      setProjects(liveProjects);
      if (isLive) setIsLiveBackend(true);

      const livePatternsData = await fetchLivePatterns();
      setPatterns(livePatternsData.patterns);
      setPatternsInsight(livePatternsData.insight);
      setPatternsRecommendation(livePatternsData.recommendation);

      setIsLoading(false);
    }
    loadData();
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  const handleNavigate = (view: ActiveView, projectId?: string) => {
    setActiveView(view);
    if (view === 'briefing') {
      if (projectId) {
        setActiveProjectId(projectId);
      } else if (!activeProjectId && projects.length > 0) {
        setActiveProjectId(projects[0].id);
      }
    } else if (view === 'dashboard') {
      setActiveProjectId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveView('briefing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProjectByName = (projectName: string) => {
    const match = projects.find((p) => p.name.toLowerCase() === projectName.toLowerCase());
    if (match) {
      handleSelectProject(match.id);
    }
  };

  const handleTriggerSnapshot = async (projectId: string) => {
    const res = await triggerLiveSnapshot(projectId);
    if (res.success) {
      // Refresh project list live from backend
      const { projects: updatedProjects } = await fetchLiveProjects();
      setProjects(updatedProjects);
      showToast(`Live snapshot captured and saved to SQLite for ${projectId}`);
    } else {
      showToast(`Snapshot trigger failed: ${res.error || 'Server error'}`);
    }
  };

  const handleTrackRepo = async (projectId: string, repoPath: string, runLiveTests: boolean) => {
    const res = await triggerLiveSnapshot(projectId, repoPath, runLiveTests);
    if (res.success) {
      const { projects: updatedProjects } = await fetchLiveProjects();
      setProjects(updatedProjects);
      setActiveProjectId(projectId);
      setActiveView('briefing');
      showToast(`Scanned and tracked live repository: ${projectId}`);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to scan repository' };
  };

  const handleUntrackProject = async (projectId: string) => {
    const ok = await untrackProject(projectId);
    if (ok) {
      const { projects: updatedProjects } = await fetchLiveProjects();
      setProjects(updatedProjects);
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
        setActiveView('dashboard');
      }
      showToast(`Untracked ${projectId}`);
    } else {
      showToast(`Failed to untrack ${projectId}`);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-warm-bg font-sans text-warm-text">
      {/* Persistent Left Sidebar */}
      <Sidebar
        projects={projects}
        activeView={activeView}
        activeProjectId={activeProjectId}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-warm-bg flex flex-col">
        {/* Real-time Backend Status Bar */}
        <div className="px-8 py-2 bg-warm-panel/80 hairline-border-b flex items-center justify-between text-[11px] text-warm-muted">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isLiveBackend ? 'bg-status-clean animate-pulse' : 'bg-status-failing'}`} />
              <span className="font-semibold text-warm-text">
                {isLiveBackend ? 'Backend Connected (Port 4000)' : 'Backend Disconnected (Port 4000 unreachable)'}
              </span>
            </div>
            <span className="text-warm-border">|</span>
            <span>
              Live Snapshot Engine: <strong className="font-mono text-warm-text font-normal">http://localhost:4000</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTourOpen(true)}
              className="px-2.5 py-1 rounded bg-warm-bg hairline-border text-[11px] font-semibold text-accent hover:border-accent flex items-center gap-1.5 transition-all shadow-flat active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Judge Guide & Tour</span>
            </button>
            <span className="font-mono text-[10px] text-warm-muted">ContextSwitch Live Engine</span>
          </div>
        </div>

        <div className="flex-1">
          {isLoading && projects.length === 0 ? (
            <div className="p-12 text-center text-sm text-warm-muted animate-pulse">
              Connecting to live snapshot engine...
            </div>
          ) : (
            <>
              {activeView === 'dashboard' && (
                <DashboardView
                  projects={projects}
                  onSelectProject={handleSelectProject}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onOpenTrackModal={() => setIsTrackModalOpen(true)}
                  onUntrackProject={handleUntrackProject}
                />
              )}

              {activeView === 'briefing' && (
                activeProject ? (
                  <BriefingView
                    project={activeProject}
                    onBack={() => handleNavigate('dashboard')}
                    onToast={showToast}
                    onTriggerSnapshot={handleTriggerSnapshot}
                  />
                ) : (
                  <div className="p-12 text-center bg-warm-panel hairline-border m-8 rounded-lg">
                    <h3 className="text-base font-semibold text-warm-text">No project selected</h3>
                    <p className="text-xs text-warm-muted mt-1">
                      {projects.length === 0
                        ? 'No tracked projects found in backend database. Trigger a snapshot on a local repository.'
                        : 'Select a project from the sidebar or dashboard to view its resume briefing.'}
                    </p>
                    <button
                      onClick={() => handleNavigate('dashboard')}
                      className="mt-4 px-3 py-1.5 rounded bg-warm-bg hairline-border text-xs font-medium hover:border-warm-muted text-warm-text"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                )
              )}

              {activeView === 'patterns' && (
                <PatternsView
                  patterns={patterns}
                  insight={patternsInsight}
                  recommendation={patternsRecommendation}
                  onSelectProjectName={handleSelectProjectByName}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Action Toast Feedback */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Track Real Local Repository Modal */}
      <TrackRepoModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        onTrack={handleTrackRepo}
      />

      {/* Interactive Judge Guide / Tour Modal */}
      <JudgeGuideModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectProject={handleSelectProject}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
      />
    </div>
  );
}

export default App;
