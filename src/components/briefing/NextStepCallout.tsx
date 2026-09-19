import React, { useState } from 'react';
import { Play, Copy, Check, Terminal } from 'lucide-react';
import { SuggestedNextStep } from '../../types';

interface NextStepCalloutProps {
  step: SuggestedNextStep;
  onCopyCommand?: (cmd: string) => void;
}

export const NextStepCallout: React.FC<NextStepCalloutProps> = ({ step, onCopyCommand }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!step.command) return;
    navigator.clipboard.writeText(step.command);
    setCopied(true);
    if (onCopyCommand) onCopyCommand(step.command);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-accent text-white rounded-lg p-5 shadow-flat transition-all relative overflow-hidden">
      {/* Decorative subtle background angle */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Tag */}
      <div className="flex items-center justify-between gap-3 mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center shrink-0">
            <Play className="w-3 h-3 fill-white text-white translate-x-0.2" />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/90">
            Suggested Next Step · Priority Action
          </span>
        </div>
        <span className="text-[11px] font-mono bg-white/15 px-2 py-0.5 rounded text-white/90">
          Codex Recommendation
        </span>
      </div>

      {/* Main Title & Action Instruction */}
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
          {step.title}
        </h3>
        <p className="text-sm text-white/90 mt-1.5 leading-relaxed">
          {step.instruction}
        </p>
      </div>

      {/* Embedded Command Box if command exists */}
      {step.command && (
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between gap-3 relative z-10 bg-black/15 p-3 rounded-md">
          <div className="flex items-center gap-2 font-mono text-xs text-white overflow-x-auto">
            <Terminal className="w-3.5 h-3.5 text-white/70 shrink-0" />
            <span className="select-all">{step.command}</span>
          </div>

          <button
            onClick={handleCopy}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white text-accent hover:bg-white/90 font-medium text-xs shadow-sm transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-status-clean" />
                <span className="text-status-clean font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-accent" />
                <span>Copy Command</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
