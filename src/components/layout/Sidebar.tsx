import React from 'react';
import { LayoutDashboard, TrendingUp, FolderGit2, Search, ArrowRight, Layers } from 'lucide-react';
import { Project, ActiveView } from '../../types';
import { StatusPill } from '../common/StatusPill';

interface SidebarProps {
  projects: Project[];
  activeView: ActiveView;
  activeProjectId: string | null;
  onNavigate: (view: ActiveView, projectId?: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeView,
  activeProjectId,
  onNavigate,
  searchQuery,
  onSearchChange,
}) => {
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-72 h-screen bg-warm-panel hairline-border-r flex flex-col shrink-0 select-none z-20">
      {/* Header & Branding */}
      <div className="p-5 hairline-border-b bg-warm-panel">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-warm-bg border border-warm-border flex items-center justify-center text-accent shadow-flat">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base tracking-tight text-warm-text">ContextSwitch</h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-accent-light text-accent font-semibold tracking-wider">
                Codex
              </span>
            </div>
            <p className="text-xs text-warm-muted mt-0.5 leading-none">
              Developer context recovery
            </p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="p-3 hairline-border-b space-y-1 bg-warm-panel/50">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
            activeView === 'dashboard' && !activeProjectId
              ? 'bg-warm-bg text-warm-text font-semibold shadow-flat border border-warm-border'
              : 'text-warm-muted hover:text-warm-text hover:bg-warm-bg/60 border border-transparent'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4 text-warm-muted" />
            <span>Dashboard</span>
          </div>
          <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-warm-border/40 text-warm-muted">
            {projects.length}
          </span>
        </button>

        <button
          onClick={() => onNavigate('patterns')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
            activeView === 'patterns'
              ? 'bg-warm-bg text-warm-text font-semibold shadow-flat border border-warm-border'
              : 'text-warm-muted hover:text-warm-text hover:bg-warm-bg/60 border border-transparent'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-warm-muted" />
            <span>Patterns & Bottlenecks</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </button>
      </div>

      {/* Project Switcher Header & Filter */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-warm-muted" />
            <span className="text-xs font-semibold uppercase tracking-wider text-warm-muted">
              Tracked Projects
            </span>
          </div>
          <span className="text-[11px] font-mono text-warm-muted">
            {filteredProjects.length}
          </span>
        </div>

        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-2.5 text-warm-text/70 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Filter projects or branches..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded bg-warm-bg border border-warm-border text-warm-text placeholder:text-warm-muted/70 focus:outline-none focus:border-warm-muted transition-colors relative z-0"
          />
        </div>
      </div>

      {/* Scrollable Project List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-6 text-xs text-warm-muted">
            {searchQuery ? `No projects match "${searchQuery}"` : 'No tracked projects yet'}
          </div>
        ) : (
          filteredProjects.map((project) => {
            const isSelected = activeView === 'briefing' && activeProjectId === project.id;
            return (
              <button
                key={project.id}
                onClick={() => onNavigate('briefing', project.id)}
                className={`w-full text-left p-2.5 rounded-md border transition-all text-xs group relative ${
                  isSelected
                    ? 'bg-warm-bg border-warm-border shadow-flat'
                    : 'bg-warm-panel border-warm-border/50 hover:border-warm-border hover:bg-warm-bg/40'
                }`}
              >
                {/* Active Indicator Strip */}
                {isSelected && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-accent rounded-r" />
                )}

                <div className="flex items-start justify-between gap-2 pl-1">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-semibold truncate text-sm ${isSelected ? 'text-warm-text' : 'text-warm-text/90'}`}>
                        {project.name}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-warm-muted truncate mt-0.5">
                      {project.branch}
                    </div>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <StatusPill status={project.status} size="sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-warm-muted mt-2 pl-1">
                  <span>{project.relativeTime}</span>
                  <ArrowRight className={`w-3 h-3 transition-transform ${isSelected ? 'text-accent translate-x-0.5' : 'opacity-0 group-hover:opacity-60'}`} />
                </div>
              </button>
            );
          })
        )}
      </div>

    </aside>
  );
};
