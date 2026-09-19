import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface InsightCalloutProps {
  headline: string;
  body: string;
  recommendation?: string;
}

export const InsightCallout: React.FC<InsightCalloutProps> = ({ headline, body, recommendation }) => {
  return (
    <div className="bg-accent text-white rounded-lg p-5 shadow-flat transition-all relative overflow-hidden">
      {/* Background glow element */}
      <div className="absolute -right-8 -top-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Tag */}
      <div className="flex items-center justify-between gap-3 mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-white" />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/90">
            Strongest Cross-Project Pattern
          </span>
        </div>
        <span className="text-[11px] font-mono bg-white/15 px-2 py-0.5 rounded text-white/90">
          Codex Aggregate Reasoning
        </span>
      </div>

      {/* Headline & Body */}
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white tracking-tight">
          {headline}
        </h3>
        <p className="text-sm text-white/90 mt-1.5 leading-relaxed">
          {body}
        </p>
      </div>

      {recommendation && (
        <div className="mt-4 pt-3 border-t border-white/20 flex items-start gap-2 relative z-10 text-xs text-white/95">
          <ArrowRight className="w-4 h-4 shrink-0 text-white/80 mt-0.5" />
          <span>
            <strong className="font-semibold text-white">Recommended Architectural Fix:</strong> {recommendation}
          </span>
        </div>
      )}
    </div>
  );
};
