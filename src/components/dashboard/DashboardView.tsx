import React, { useState } from 'react';
import { Project, StatusType } from '../../types';
import { ProjectCard } from './ProjectCard';
import { LayoutGrid, AlertCircle, FileCode, CheckCircle2 } from 'lucide-react';

interface DashboardViewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ projects, onSelectProject }) => {
  const [filter, setFilter] = useState<'all' | StatusType>('all');

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const totalFailing = projects.filter((p) => p.status === 'failing').length;
  const totalWarning = projects.filter((p) => p.status === 'warning').length;
  const totalClean = projects.filter((p) => p.status === 'clean').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7">
      {/* Top Banner & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 hairline-border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent bg-accent-light px-2 py-0.5 rounded">
              Workspace Overview
            </span>
            <span className="text-xs text-warm-muted">· Real-time snapshot engine</span>
          </div>
          <h2 className="text-2xl font-bold text-warm-text tracking-tight">
            Developer Context Dashboard
          </h2>
          <p className="text-sm text-warm-muted mt-1 max-w-2xl">
            Reconstruct your mental workspace in seconds. High-fidelity snapshots of paused sessions, unresolved tests, and actionable next steps across all active repositories.
          </p>
        </div>

        {/* Quick KPI Overview */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-warm-panel hairline-border px-3.5 py-2 rounded-lg text-center shadow-flat">
            <span className="block text-xl font-bold font-mono text-warm-text">{projects.length}</span>
            <span className="text-[11px] text-warm-muted font-medium">Tracked Repos</span>
          </div>
          <div className="bg-warm-panel hairline-border px-3.5 py-2 rounded-lg text-center shadow-flat">
            <span className="block text-xl font-bold font-mono text-status-failing">{totalFailing}</span>
            <span className="text-[11px] text-warm-muted font-medium">Failing Tests</span>
          </div>
          <div className="bg-warm-panel hairline-border px-3.5 py-2 rounded-lg text-center shadow-flat">
            <span className="block text-xl font-bold font-mono text-status-warning">{totalWarning}</span>
            <span className="text-[11px] text-warm-muted font-medium">Open TODOs</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="inline-flex items-center p-1 bg-warm-panel hairline-border rounded-lg shadow-flat text-xs font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              filter === 'all'
                ? 'bg-warm-bg text-warm-text font-semibold border border-warm-border shadow-flat'
                : 'text-warm-muted hover:text-warm-text'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Projects ({projects.length})</span>
          </button>
          <button
            onClick={() => setFilter('failing')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              filter === 'failing'
                ? 'bg-[#FDF0F0] text-[#9D2626] font-semibold border border-[#F6BCBC] shadow-flat'
                : 'text-warm-muted hover:text-warm-text'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-status-failing" />
            <span>Failing Tests ({totalFailing})</span>
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              filter === 'warning'
                ? 'bg-[#FEF8EB] text-[#9A6715] font-semibold border border-[#F6DCAC] shadow-flat'
                : 'text-warm-muted hover:text-warm-text'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-status-warning" />
            <span>Unresolved TODOs ({totalWarning})</span>
          </button>
          <button
            onClick={() => setFilter('clean')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              filter === 'clean'
                ? 'bg-[#EBF7EE] text-[#256B30] font-semibold border border-[#BFE3C6] shadow-flat'
                : 'text-warm-muted hover:text-warm-text'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-status-clean" />
            <span>Clean State ({totalClean})</span>
          </button>
        </div>

        <span className="text-xs text-warm-muted font-mono">
          Showing {filteredProjects.length} of {projects.length} workspaces
        </span>
      </div>

      {/* Grid of Project Cards */}
      {filteredProjects.length === 0 ? (
        <div className="bg-warm-panel hairline-border p-12 text-center rounded-lg shadow-flat">
          <h3 className="text-base font-semibold text-warm-text">
            {projects.length === 0 ? 'No projects tracked yet' : 'No projects found with the selected filter'}
          </h3>
          <p className="text-xs text-warm-muted mt-1.5 max-w-md mx-auto">
            {projects.length === 0
              ? 'Your local snapshot engine has not recorded any repository snapshots yet. Run a snapshot to begin tracking developer context.'
              : 'Try clearing the status filter or searching for another workspace.'}
          </p>
          {projects.length > 0 && (
            <button
              onClick={() => setFilter('all')}
              className="mt-3 text-xs text-accent font-semibold hover:underline"
            >
              Reset filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};
