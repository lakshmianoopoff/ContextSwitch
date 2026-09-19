import { useState, useEffect } from 'react';
import { ActiveView, Project, PatternTheme } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { BriefingView } from './components/briefing/BriefingView';
import { PatternsView } from './components/patterns/PatternsView';
import { Toast } from './components/common/Toast';
import { fetchLiveProjects, fetchLivePatterns, triggerLiveSnapshot } from './services/api';

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

  // Load live data from backend (GET /projects & GET /patterns)
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const { projects: liveProjects, isLive } = await fetchLiveProjects();
      setProjects(liveProjects);
      setIsLiveBackend(isLive);

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
      />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-warm-bg flex flex-col">
        {/* Real-time Backend Status Bar */}
        <div className="px-8 py-2 bg-warm-panel/60 hairline-border-b flex items-center justify-between text-[11px] text-warm-muted">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLiveBackend ? 'bg-status-clean' : 'bg-status-failing'}`} />
            <span>
              {isLiveBackend
                ? 'Connected to Live Snapshot Engine (http://localhost:4000)'
                : 'Backend Disconnected — http://localhost:4000 unreachable'}
            </span>
          </div>
          <span className="font-mono text-[10px]">ContextSwitch Live Engine</span>
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
    </div>
  );
}

export default App;
