import React, { useState, useEffect } from 'react';
import { ArrowLeft, Terminal, Check, Clock, Sparkles } from 'lucide-react';
import { Project } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { CodeBadge } from '../common/CodeBadge';
import { NextStepCallout } from './NextStepCallout';
import { UnresolvedPanel } from './UnresolvedPanel';
import { FilesTouchedPanel } from './FilesTouchedPanel';
import { SessionTimeline } from './SessionTimeline';
import { BriefingSkeleton } from '../common/LoadingSkeleton';
import { fetchResumeBriefing, fetchProjectTimeline } from '../../services/api';

interface BriefingViewProps {
  project: Project;
  onBack: () => void;
  onToast: (msg: string) => void;
  onTriggerSnapshot?: (projectId: string) => Promise<void>;
}

export const BriefingView: React.FC<BriefingViewProps> = ({ project, onBack, onToast, onTriggerSnapshot }) => {
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const [loading, setLoading] = useState(false);
  const [copiedResume, setCopiedResume] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Live fetch resume briefing and timeline when project id changes
  useEffect(() => {
    let isMounted = true;

    async function loadLiveBriefing() {
      setLoading(true);
      try {
        const [resumeRes, timelineRes] = await Promise.all([
          fetchResumeBriefing(project.id),
          fetchProjectTimeline(project.id),
        ]);

        if (isMounted && resumeRes.projectData) {
          const updated = { ...resumeRes.projectData };
          if (timelineRes && timelineRes.length > 0) {
            updated.timeline = timelineRes;
          }
          setCurrentProject(updated);
        }
      } catch (err) {
        console.warn('Using cached briefing state for resilience:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLiveBriefing();

    return () => {
      isMounted = false;
    };
  }, [project.id]);

  const p = currentProject;

  const resumeCommand = p.suggestedNextStep.command
    ? `git checkout ${p.branch} && ${p.suggestedNextStep.command}`
    : `git checkout ${p.branch}`;

  const handleCopyResumeCommand = () => {
    navigator.clipboard.writeText(resumeCommand);
    setCopiedResume(true);
    onToast(`Copied resume command for ${p.name}`);
    setTimeout(() => setCopiedResume(false), 2000);
  };

  const handleTriggerSnapshot = async () => {
    if (!onTriggerSnapshot) return;
    setIsCapturing(true);
    try {
      await onTriggerSnapshot(p.id);
      // Re-fetch live resume and timeline
      const [resumeRes, timelineRes] = await Promise.all([
        fetchResumeBriefing(p.id),
        fetchProjectTimeline(p.id),
      ]);
      if (resumeRes.projectData) {
        const updated = { ...resumeRes.projectData };
        if (timelineRes && timelineRes.length > 0) {
          updated.timeline = timelineRes;
        }
        setCurrentProject(updated);
      }
      onToast(`Captured new live snapshot for ${p.name}`);
    } catch {
      onToast(`Snapshot capture completed`);
    } finally {
      setIsCapturing(false);
    }
  };

  if (loading && !currentProject) {
    return <BriefingSkeleton />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-warm-muted hover:text-warm-text bg-warm-panel hairline-border px-3 py-1.5 rounded-md shadow-flat transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspaces</span>
        </button>

        <div className="flex items-center gap-2">
          {onTriggerSnapshot && (
            <button
              onClick={handleTriggerSnapshot}
              disabled={isCapturing}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-warm-text bg-warm-panel hairline-border hover:border-accent hover:text-accent px-3 py-1.5 rounded-md shadow-flat transition-all disabled:opacity-60"
            >
              <span className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-accent animate-ping' : 'bg-status-clean'}`} />
              <span>{isCapturing ? 'Capturing Git & Tests...' : 'Capture Snapshot'}</span>
            </button>
          )}

          <button
            onClick={handleCopyResumeCommand}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-warm-text bg-warm-panel hairline-border hover:border-warm-muted px-3 py-1.5 rounded-md shadow-flat transition-all"
          >
            {copiedResume ? (
              <>
                <Check className="w-3.5 h-3.5 text-status-clean" />
                <span className="text-status-clean font-semibold">Command Copied!</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5 text-warm-muted" />
                <span>Copy Full Resume Script</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Project Header */}
      <div className="bg-warm-panel hairline-border p-6 rounded-lg shadow-flat">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 hairline-border-b pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl font-bold text-warm-text tracking-tight">
                {p.name}
              </h2>
              <StatusPill status={p.status} size="md" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-light text-accent font-semibold flex items-center gap-1 border border-accent/20">
                <Sparkles className="w-3 h-3" /> Live Codex Reasoning
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <CodeBadge code={p.branch} isBranch copyable onCopy={(b) => onToast(`Copied branch name: ${b}`)} />
              <span className="flex items-center gap-1 text-xs text-warm-muted">
                <Clock className="w-3 h-3 text-warm-muted/70" />
                <span>{p.relativeTime}</span>
              </span>
            </div>
          </div>

          {/* Quick Snapshot Metrics */}
          <div className="flex items-center gap-4 text-xs font-mono text-warm-muted shrink-0 bg-warm-bg px-3 py-2 rounded border border-warm-border">
            <div>
              <span className="text-warm-text font-bold block text-sm">
                {p.stats.failingTestsCount}
              </span>
              <span className="text-[10px] text-warm-muted uppercase">Failures</span>
            </div>
            <div className="w-[1px] h-6 bg-warm-border" />
            <div>
              <span className="text-warm-text font-bold block text-sm">
                {p.stats.todosCount}
              </span>
              <span className="text-[10px] text-warm-muted uppercase">TODOs</span>
            </div>
            <div className="w-[1px] h-6 bg-warm-border" />
            <div>
              <span className="text-warm-text font-bold block text-sm">
                {p.filesTouched.length}
              </span>
              <span className="text-[10px] text-warm-muted uppercase">Files</span>
            </div>
          </div>
        </div>

        {/* Narrative Summary (2-3 sentences of what was in progress) */}
        <div className="pt-4">
          <span className="text-[11px] font-semibold text-warm-muted uppercase tracking-wider block mb-1">
            Context Reconstruction Summary
          </span>
          <p className="text-sm text-warm-text leading-relaxed font-normal">
            {p.narrativeSummary}
          </p>
        </div>
      </div>

      {/* The Single Bold Accent Callout (Section 4.3 rule) */}
      <NextStepCallout
        step={p.suggestedNextStep}
        onCopyCommand={(cmd) => onToast(`Copied test command: ${cmd}`)}
      />

      {/* Two-Column Grid: Left (Unresolved & Files Touched) | Right (Session Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 7 columns */}
        <div className="lg:col-span-7 space-y-6">
          <UnresolvedPanel
            items={p.unresolved}
            onCopyText={(txt) => onToast(`Copied reference: ${txt}`)}
          />

          <FilesTouchedPanel
            files={p.filesTouched}
            onCopyPath={(path) => onToast(`Copied file path: ${path}`)}
          />
        </div>

        {/* Right Column: 5 columns */}
        <div className="lg:col-span-5">
          <SessionTimeline timeline={p.timeline} />
        </div>
      </div>
    </div>
  );
};
