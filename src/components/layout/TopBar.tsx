import React from 'react';
import { Sparkles } from 'lucide-react';
import { API_BASE } from '../../services/api';

interface TopBarProps {
  isLiveBackend: boolean;
  onOpenTour: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ isLiveBackend, onOpenTour }) => {
  return (
    <header className="px-8 py-2 bg-warm-panel/80 hairline-border-b flex items-center justify-between text-[11px] text-warm-muted shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveBackend ? 'bg-status-clean animate-pulse' : 'bg-status-failing'
            }`}
          />
          <span className="font-semibold text-warm-text">
            {isLiveBackend ? 'Backend Connected' : 'Backend Disconnected'}
          </span>
        </div>
        <span className="text-warm-border">|</span>
        <span>
          Live Snapshot Engine: <strong className="font-mono text-warm-text font-normal">{API_BASE}</strong>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenTour}
          className="px-2.5 py-1 rounded bg-warm-bg hairline-border text-[11px] font-semibold text-accent hover:border-accent flex items-center gap-1.5 transition-all shadow-flat active:scale-95"
          title="Open interactive Beginner Guide Tour"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Beginner Guide Tour</span>
        </button>
        <span className="font-mono text-[10px] text-warm-muted">ContextSwitch Live Engine</span>
      </div>
    </header>
  );
};
