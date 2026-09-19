import React from 'react';
import { FileEdit, FilePlus, FileX, Copy, Check } from 'lucide-react';
import { TouchedFile } from '../../types';

interface FilesTouchedPanelProps {
  files: TouchedFile[];
  onCopyPath?: (path: string) => void;
}

export const FilesTouchedPanel: React.FC<FilesTouchedPanelProps> = ({ files, onCopyPath }) => {
  const [copiedPath, setCopiedPath] = React.useState<string | null>(null);

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    if (onCopyPath) onCopyPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const getStatusBadge = (status: TouchedFile['status']) => {
    switch (status) {
      case 'modified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-warm-muted bg-warm-bg px-1.5 py-0.5 rounded border border-warm-border">
            <FileEdit className="w-3 h-3 text-status-warning" />
            <span>M</span>
          </span>
        );
      case 'added':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-status-clean bg-status-clean-bg px-1.5 py-0.5 rounded border border-status-clean-border">
            <FilePlus className="w-3 h-3" />
            <span>A</span>
          </span>
        );
      case 'deleted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-status-failing bg-status-failing-bg px-1.5 py-0.5 rounded border border-status-failing-border">
            <FileX className="w-3 h-3" />
            <span>D</span>
          </span>
        );
    }
  };

  const totalAdditions = files.reduce((acc, f) => acc + f.additions, 0);
  const totalDeletions = files.reduce((acc, f) => acc + f.deletions, 0);

  return (
    <div className="bg-warm-panel hairline-border rounded-lg shadow-flat overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 hairline-border-b flex items-center justify-between gap-3 bg-warm-panel">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-warm-text">Files Touched</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-warm-bg border border-warm-border text-warm-muted">
              {files.length} {files.length === 1 ? 'file' : 'files'}
            </span>
          </div>
          <p className="text-xs text-warm-muted mt-0.5">
            Git working tree state relative to target branch
          </p>
        </div>

        {/* Diff summary total */}
        <div className="font-mono text-xs flex items-center gap-1.5 bg-warm-bg px-2.5 py-1 rounded border border-warm-border">
          <span className="text-status-clean font-semibold">+{totalAdditions}</span>
          <span className="text-warm-muted/40">/</span>
          <span className="text-status-failing font-semibold">-{totalDeletions}</span>
        </div>
      </div>

      {/* Files list */}
      <div className="divide-y divide-warm-border/60 max-h-[360px] overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.path}
            className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-warm-bg/30 transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {getStatusBadge(file.status)}
              <span className="font-mono text-xs text-warm-text truncate select-all">
                {file.path}
              </span>
              <button
                onClick={() => handleCopy(file.path)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-warm-text text-warm-muted transition-opacity"
                title="Copy relative file path"
              >
                {copiedPath === file.path ? (
                  <Check className="w-3 h-3 text-status-clean" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>

            {/* Line counts in JetBrains Mono */}
            <div className="font-mono text-xs flex items-center gap-2 shrink-0">
              {file.additions > 0 && (
                <span className="text-status-clean font-medium">+{file.additions}</span>
              )}
              {file.deletions > 0 && (
                <span className="text-status-failing font-medium">-{file.deletions}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
