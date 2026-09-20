import React from 'react';
import { Clock, ArrowUpRight, AlertCircle, FileCode, CheckCircle2, Trash2 } from 'lucide-react';
import { Project } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { CodeBadge } from '../common/CodeBadge';

interface ProjectCardProps {
  project: Project;
  onSelect: (projectId: string) => void;
  onUntrack?: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, onUntrack }) => {
  return (
    <div
      onClick={() => onSelect(project.id)}
      className="bg-warm-panel hairline-border p-5 rounded-lg hover:border-warm-muted/40 transition-all duration-200 cursor-pointer group flex flex-col justify-between relative shadow-flat hover:shadow-subtle"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div>
            <h3 className="text-base font-semibold text-warm-text group-hover:text-accent transition-colors flex items-center gap-1.5">
              <span>{project.name}</span>
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-accent" />
            </h3>
            <p className="text-xs text-warm-muted line-clamp-1 mt-0.5">
              {project.description}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1.5">
            <StatusPill status={project.status} size="sm" />
            {onUntrack && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Untrack "${project.name}" from ContextSwitch?`)) {
                    onUntrack(project.id);
                  }
                }}
                title={`Untrack ${project.name}`}
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100 p-1 text-warm-muted hover:text-status-failing transition-all rounded hover:bg-warm-bg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Branch & Time Monospace Row */}
        <div className="flex items-center gap-2 mb-3.5 flex-wrap">
          <CodeBadge code={project.branch} isBranch />
          <span className="flex items-center gap-1 text-xs text-warm-muted">
            <Clock className="w-3 h-3 text-warm-muted/70" />
            <span>{project.relativeTime}</span>
          </span>
        </div>

        {/* One-Line Preview of what was last happening */}
        <div className="bg-warm-bg/75 rounded p-3 border border-warm-border/60 text-xs text-warm-text leading-relaxed mb-4">
          <span className="text-warm-muted font-medium block text-[10px] uppercase tracking-wider mb-1">
            Last in-flight activity:
          </span>
          <p className="font-normal text-warm-text/95">
            {project.oneLinePreview}
          </p>
        </div>
      </div>

      {/* Card Footer: Detailed Stats */}
      <div className="hairline-border-t pt-3 flex items-center justify-between text-xs text-warm-muted">
        <div className="flex items-center gap-3">
          {project.stats.failingTestsCount > 0 && (
            <span className="flex items-center gap-1 text-status-failing font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{project.stats.failingTestsCount} test failing</span>
            </span>
          )}
          {project.stats.todosCount > 0 && (
            <span className="flex items-center gap-1 text-status-warning font-medium">
              <FileCode className="w-3.5 h-3.5" />
              <span>{project.stats.todosCount} TODOs</span>
            </span>
          )}
          {project.stats.failingTestsCount === 0 && project.stats.todosCount === 0 && (
            <span className="flex items-center gap-1 text-status-clean font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Clean state</span>
            </span>
          )}
        </div>

        {/* Diff stats in JetBrains Mono */}
        <div className="font-mono text-[11px] flex items-center gap-1.5">
          <span className="text-status-clean">+{project.stats.additions}</span>
          <span className="text-warm-muted/40">/</span>
          <span className="text-status-failing">-{project.stats.deletions}</span>
        </div>
      </div>
    </div>
  );
};
