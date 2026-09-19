import React from 'react';
import { History, Clock, GitCommit } from 'lucide-react';
import { SessionEntry } from '../../types';

interface SessionTimelineProps {
  timeline: SessionEntry[];
}

export const SessionTimeline: React.FC<SessionTimelineProps> = ({ timeline }) => {
  return (
    <div className="bg-warm-panel hairline-border rounded-lg shadow-flat p-4 flex flex-col">
      {/* Header */}
      <div className="hairline-border-b pb-3 mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-warm-text">Session History</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-warm-bg border border-warm-border text-warm-muted">
              {timeline.length} pauses
            </span>
          </div>
          <p className="text-xs text-warm-muted mt-0.5">
            Previous development sessions and context checkpoints
          </p>
        </div>
        <History className="w-4 h-4 text-warm-muted" />
      </div>

      {/* Vertical Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-warm-border">
        {timeline.map((session, index) => {
          const isLatest = index === 0;

          return (
            <div key={session.id} className="relative group">
              {/* Timeline Node Dot */}
              <div
                className={`absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full border-2 transition-all ${
                  isLatest
                    ? 'bg-accent border-white ring-4 ring-accent/20'
                    : 'bg-warm-border border-warm-panel group-hover:bg-warm-muted'
                }`}
              />

              <div className="space-y-1">
                {/* Meta info row */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-warm-text">
                      {session.timestamp}
                    </span>
                    {isLatest && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent-light text-accent font-semibold">
                        Latest Pause
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-warm-muted font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-warm-muted/70" />
                      <span>{session.duration}</span>
                    </span>
                  </div>
                </div>

                {/* Branch reference */}
                <div className="flex items-center gap-1 text-[11px] font-mono text-warm-muted">
                  <GitCommit className="w-3 h-3 text-warm-muted/80" />
                  <span>{session.branch}</span>
                </div>

                {/* Session note */}
                <p className="text-xs text-warm-text/90 leading-relaxed bg-warm-bg/50 p-2 rounded border border-warm-border/60 mt-1.5">
                  {session.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
