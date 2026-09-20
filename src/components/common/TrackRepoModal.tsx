import React, { useState } from 'react';
import { X, FolderGit2, Sparkles, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

interface TrackRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrack: (projectId: string, repoPath: string, runLiveTests: boolean) => Promise<{ success: boolean; error?: string }>;
}

export const TrackRepoModal: React.FC<TrackRepoModalProps> = ({ isOpen, onClose, onTrack }) => {
  const [projectId, setProjectId] = useState('');
  const [repoPath, setRepoPath] = useState('');
  const [runLiveTests, setRunLiveTests] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickCurrent = () => {
    setProjectId('ContextSwitch');
    setRepoPath('.');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId.trim()) {
      setError('Please enter a project identifier');
      return;
    }
    if (!repoPath.trim()) {
      setError('Please enter the local folder path to your Git repository');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await onTrack(projectId.trim(), repoPath.trim(), runLiveTests);
    setIsLoading(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to scan and capture repository state');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-warm-panel rounded-xl hairline-border shadow-2xl overflow-hidden border border-warm-border">
        {/* Modal Header */}
        <div className="px-6 py-4 hairline-border-b flex items-center justify-between bg-warm-bg/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center shadow-flat">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-warm-text">Track Real Local Repository</h3>
              <p className="text-xs text-warm-muted">Capture real Git branch, diffs, TODOs & live Codex briefing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-warm-muted hover:text-warm-text p-1.5 rounded-lg hover:bg-warm-bg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-[#FDF0F0] border border-[#F6BCBC] text-xs text-[#9D2626] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Quick Preset */}
          <div className="p-3.5 rounded-lg bg-warm-bg border border-warm-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-warm-text flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Quick Preset: This Repository (.)
              </span>
              <button
                type="button"
                onClick={handleQuickCurrent}
                className="text-xs font-medium text-accent hover:underline"
              >
                Use Preset
              </button>
            </div>
            <p className="text-[11px] text-warm-muted leading-relaxed">
              Track the current <strong>ContextSwitch</strong> repository itself (<code className="font-mono bg-warm-panel px-1 py-0.5 rounded">.</code>) to inspect live branches, commits, and source files.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-warm-text mb-1">
                Project Name / ID
              </label>
              <input
                type="text"
                placeholder="e.g. contextswitch, my-api, billing-worker"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-lg bg-warm-bg border border-warm-border text-warm-text placeholder:text-warm-muted/60 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-warm-text mb-1 flex items-center justify-between">
                <span>Local Repository Path</span>
                <span className="text-[10px] text-warm-muted font-normal">Absolute or relative path</span>
              </label>
              <div className="relative flex items-center">
                <Terminal className="w-3.5 h-3.5 absolute left-3 text-warm-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. C:/Users/dell/OneDrive/Desktop/ContextSwitch"
                  value={repoPath}
                  onChange={(e) => setRepoPath(e.target.value)}
                  className="w-full text-xs pl-8 pr-3.5 py-2 rounded-lg bg-warm-bg border border-warm-border text-warm-text font-mono placeholder:text-warm-muted/60 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={runLiveTests}
                onChange={(e) => setRunLiveTests(e.target.checked)}
                className="rounded border-warm-border text-accent focus:ring-accent"
              />
              <span className="text-xs text-warm-text">
                Run test suite during capture (<code className="font-mono text-[11px]">npm test</code>)
              </span>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 hairline-border-t flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-warm-muted hover:text-warm-text rounded-lg hover:bg-warm-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold bg-accent text-white rounded-lg shadow-flat hover:bg-accent/90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Scanning Git & AST...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Scan & Track Real Repository</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
