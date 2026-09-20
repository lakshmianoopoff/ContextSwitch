import React, { useState } from 'react';
import { X, Sparkles, FolderGit2, ChevronRight, ChevronLeft, ArrowRight, ShieldCheck, Laptop } from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTrackModal: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenTrackModal,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to ContextSwitch ⚡',
      subtitle: 'Developer Context Recovery & Resume Assistant',
      badge: 'Getting Started',
      icon: Sparkles,
      content: (
        <div className="space-y-3.5 text-xs text-warm-text/90 leading-relaxed">
          <p>
            ContextSwitch helps you pick up exactly where you left off across all your development projects without losing your flow.
          </p>
          <div className="p-3.5 rounded-lg bg-warm-bg border border-warm-border/80 space-y-2.5">
            <span className="font-semibold text-warm-text block text-[11px] uppercase tracking-wider">What ContextSwitch Does:</span>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <div>
                  <strong className="text-warm-text">Live Context Capture:</strong>
                  <span className="text-warm-muted ml-1">Inspects uncommitted Git diffs, active branches, and source TODOs across your local projects.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <div>
                  <strong className="text-warm-text">AI Resume Briefings:</strong>
                  <span className="text-warm-muted ml-1">Generates a concise summary of what was in progress and any unresolved blockers.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <div>
                  <strong className="text-warm-text">Actionable Next Step:</strong>
                  <span className="text-warm-muted ml-1">Provides a 1-click copyable terminal command to get you back to coding immediately.</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-warm-muted">
            Click <strong>Next</strong> for a quick walkthrough on how to track repositories and navigate your projects.
          </p>
        </div>
      ),
    },
    {
      title: 'Tracking Real Local Repositories',
      subtitle: 'Direct filesystem and Git integration — no simulated mocks',
      badge: 'Local Engine',
      icon: FolderGit2,
      content: (
        <div className="space-y-3.5 text-xs text-warm-text/90 leading-relaxed">
          <p>
            ContextSwitch runs locally on your machine (<code className="font-mono text-[11px] bg-warm-bg px-1 py-0.5 rounded hairline-border">localhost:4000</code>) and directly interfaces with your local disk and Git binary.
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-lg bg-warm-bg border border-warm-border">
              <span className="font-semibold text-[11px] text-warm-text block mb-1">1. Git Telemetry</span>
              <p className="text-[10px] text-warm-muted">Reads live branch names, recent commit logs, and uncommitted additions and deletions.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-warm-bg border border-warm-border">
              <span className="font-semibold text-[11px] text-warm-text block mb-1">2. AST & TODO Scanner</span>
              <p className="text-[10px] text-warm-muted">Scans your source tree for exact file and line references (e.g. <code className="font-mono">checkout.js:42</code>).</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-accent-light/50 border border-accent/20 text-accent text-[11px]">
            <strong>Works with ANY Git repository:</strong> You can track this cloned project itself, or point ContextSwitch to any local repository folder on your machine!
          </div>
        </div>
      ),
    },
    {
      title: 'How to Use & Explore',
      subtitle: '3 quick ways to experience ContextSwitch right now',
      badge: 'Quick Guide',
      icon: Laptop,
      content: (
        <div className="space-y-3 text-xs text-warm-text/90 leading-relaxed">
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-warm-bg border border-warm-border flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <div>
                <strong className="text-warm-text">Inspect Tracked Projects:</strong>
                <p className="text-[11px] text-warm-muted">Click any project card on the dashboard to view its resume briefing, changed files, and historical timeline.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-warm-bg border border-warm-border flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <div>
                <strong className="text-warm-text">Track Your Own Local Repo:</strong>
                <p className="text-[11px] text-warm-muted">Click <strong>"+ Track Local Repo"</strong> on the Dashboard or Sidebar, enter any directory on your computer, and run an instant snapshot.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-warm-bg border border-warm-border flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              <div>
                <strong className="text-warm-text">Resume with 1-Click Copy:</strong>
                <p className="text-[11px] text-warm-muted">Click the terracotta command box in the briefing view to copy the suggested resume command directly to your clipboard.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'AI Reasoning & Offline Support',
      subtitle: 'Works seamlessly online or 100% offline',
      badge: 'Engine',
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 text-xs text-warm-text/90 leading-relaxed">
          <p>
            ContextSwitch connects directly to <strong>OpenAI GPT-4o</strong> with strict structured JSON output schemas:
          </p>
          <ul className="list-disc list-inside space-y-1 text-warm-muted text-[11px]">
            <li><strong>Resume Briefing:</strong> Summary of in-flight work + unresolved blockers + single copyable action.</li>
            <li><strong>Cross-Project Patterns:</strong> Aggregates recurring patterns across multiple repositories.</li>
          </ul>
          <div className="p-3 rounded-lg bg-[#EBF7EE] border border-[#BFE3C6] text-[#256B30] text-[11px]">
            <strong>Zero-Config Offline Safe:</strong> If an OpenAI API key is not configured or the network is offline, the backend automatically uses its built-in deterministic heuristic engine. It never crashes or fails.
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];
  const StepIcon = current.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('contextswitch_tour_seen', 'true');
    } catch {
      // Ignore storage errors
    }
    onClose();
  };


  const handleOpenTrack = () => {
    handleComplete();
    onOpenTrackModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-warm-panel rounded-xl hairline-border shadow-2xl overflow-hidden border border-warm-border flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 hairline-border-b flex items-center justify-between bg-warm-bg/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center shadow-flat">
              <StepIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-warm-text">{current.title}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-warm-border/50 text-warm-muted font-medium">
                  {current.badge}
                </span>
              </div>
              <p className="text-[11px] text-warm-muted">{current.subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleComplete}
            className="text-warm-muted hover:text-warm-text p-1.5 rounded-lg hover:bg-warm-bg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {current.content}
        </div>

        {/* Quick Launch Buttons on step 2 */}
        {currentStep === 2 && (
          <div className="px-6 pb-2 flex items-center gap-2">
            <button
              onClick={handleComplete}
              className="flex-1 py-2 px-3 rounded-lg bg-warm-bg border border-warm-border text-xs font-semibold text-warm-text hover:border-warm-muted transition-all flex items-center justify-center gap-1.5 shadow-flat"
            >
              <span>View Dashboard Repos</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
            </button>
            <button
              onClick={handleOpenTrack}
              className="flex-1 py-2 px-3 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition-all flex items-center justify-center gap-1.5 shadow-flat"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Track Local Repo</span>
            </button>
          </div>
        )}

        {/* Modal Footer / Navigation */}
        <div className="px-6 py-3.5 hairline-border-t bg-warm-bg/40 flex items-center justify-between">
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep ? 'w-5 bg-accent' : 'bg-warm-border hover:bg-warm-muted/40'
                }`}
                title={`Go to step ${i + 1}`}
              />
            ))}
            <span className="text-[10px] text-warm-muted font-mono ml-2">
              {currentStep + 1} of {steps.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-warm-muted hover:text-warm-text hover:bg-warm-bg transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-accent text-white hover:bg-accent/90 transition-all flex items-center gap-1 shadow-flat"
            >
              <span>{currentStep === steps.length - 1 ? 'Start Exploring' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
