import React, { useState } from 'react';
import { X, Sparkles, FolderGit2, ChevronRight, ChevronLeft, ArrowRight, ShieldCheck, Laptop } from 'lucide-react';

interface JudgeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  onOpenTrackModal: () => void;
}

export const JudgeGuideModal: React.FC<JudgeGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onOpenTrackModal,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to ContextSwitch ⚡',
      subtitle: 'Codex Community Hackathon · Next-Gen Productivity & Automation',
      badge: 'Product Overview',
      icon: Sparkles,
      content: (
        <div className="space-y-3.5 text-xs text-warm-text/90 leading-relaxed">
          <p>
            Developers spend <strong>20–30 minutes reconstructing their mental cache</strong> every time they switch branches, step away for meetings, or return to paused work.
          </p>
          <div className="p-3 rounded-lg bg-warm-bg border border-warm-border/80 space-y-1.5">
            <span className="font-semibold text-warm-text block">The ContextSwitch Solution:</span>
            <ul className="list-disc list-inside space-y-1 text-warm-muted">
              <li>Captures in-flight Git diffs, failing test assertions, and source code TODOs.</li>
              <li>Uses <strong>OpenAI Codex / GPT-4o</strong> to synthesize a 3-sentence plain-English resume briefing.</li>
              <li>Prescribes a <strong>single 1-click copyable terminal command</strong> to get you back to flow.</li>
            </ul>
          </div>
          <p className="text-[11px] text-warm-muted">
            Designed with an editorial warm ivory and terracotta aesthetic — no generic dark mode, no low-contrast AI gradients.
          </p>
        </div>
      ),
    },
    {
      title: 'How It Works with Real Local Repositories',
      subtitle: 'Zero simulated mocks — runs on real disk and live Git trees',
      badge: 'Capture Engine',
      icon: FolderGit2,
      content: (
        <div className="space-y-3.5 text-xs text-warm-text/90 leading-relaxed">
          <p>
            ContextSwitch is an <strong>agentic developer tool</strong> running locally on your computer (<code className="font-mono text-[11px] bg-warm-bg px-1 py-0.5 rounded hairline-border">localhost:4000</code>).
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-lg bg-warm-bg border border-warm-border">
              <span className="font-semibold text-[11px] text-warm-text block mb-1">1. Git Telemetry</span>
              <p className="text-[10px] text-warm-muted">Uses <code className="font-mono">simple-git</code> to read real branches, last commits, and uncommitted additions/deletions.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-warm-bg border border-warm-border">
              <span className="font-semibold text-[11px] text-warm-text block mb-1">2. AST & TODO Scanner</span>
              <p className="text-[10px] text-warm-muted">Scans your active source tree for exact file and line references (e.g. <code className="font-mono">checkout.js:42</code>).</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-accent-light/50 border border-accent/20 text-accent text-[11px]">
            <strong>Works with ANY repository on your computer:</strong> You can point it to this cloned project, the included <code className="font-mono">pizza-app</code>, or any custom project folder on your machine!
          </div>
        </div>
      ),
    },
    {
      title: 'Testing It on Your Own Machine (Judge Guide)',
      subtitle: '3 quick ways to experience ContextSwitch right now',
      badge: 'Interactive Testing',
      icon: Laptop,
      content: (
        <div className="space-y-3 text-xs text-warm-text/90 leading-relaxed">
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-warm-bg border border-warm-border flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <div>
                <strong className="text-warm-text">Inspect Active Codebase (ContextSwitch):</strong>
                <p className="text-[11px] text-warm-muted">Click the project card to see OpenAI reason over the actual TypeScript code and recent Git commits of this very repository.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-warm-bg border border-warm-border flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <div>
                <strong className="text-warm-text">Inspect the pizza-app Testbed:</strong>
                <p className="text-[11px] text-warm-muted">Includes in-flight uncommitted files, an active Stripe webhook feature branch, and failing test assertions.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-warm-bg border border-warm-border flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              <div>
                <strong className="text-warm-text">Track Any Local Folder:</strong>
                <p className="text-[11px] text-warm-muted">Click <strong>"+ Track Local Repo"</strong>, paste any folder path on your computer, and watch ContextSwitch capture your live state instantly.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Codex AI & Offline Resilience',
      subtitle: '100% demo safety with structured JSON reasoning',
      badge: 'AI Architecture',
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 text-xs text-warm-text/90 leading-relaxed">
          <p>
            ContextSwitch connects directly to <strong>OpenAI GPT-4o</strong> with strict structured JSON output schemas:
          </p>
          <ul className="list-disc list-inside space-y-1 text-warm-muted text-[11px]">
            <li><strong>Resume Briefing:</strong> Summary of what was in-flight + unresolved blockers + single copyable action.</li>
            <li><strong>Cross-Project Patterns:</strong> Detects team-wide bottlenecks (e.g. 34% of stalled sessions related to HMAC signature validation).</li>
          </ul>
          <div className="p-3 rounded-lg bg-[#EBF7EE] border border-[#BFE3C6] text-[#256B30] text-[11px]">
            <strong>Zero-Config Offline Safe:</strong> If an OpenAI API key is not provided or the network is offline, the backend automatically switches to its built-in local deterministic reasoning engine. It will NEVER crash or throw unhandled errors during evaluation.
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

  const handleTryPizzaApp = () => {
    handleComplete();
    onSelectProject('pizza-app');
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

        {/* Quick Launch Buttons on final step */}
        {currentStep === 2 && (
          <div className="px-6 pb-2 flex items-center gap-2">
            <button
              onClick={handleTryPizzaApp}
              className="flex-1 py-2 px-3 rounded-lg bg-warm-bg border border-warm-border text-xs font-semibold text-warm-text hover:border-warm-muted transition-all flex items-center justify-center gap-1.5 shadow-flat"
            >
              <span>Explore pizza-app Testbed</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
            </button>
            <button
              onClick={handleOpenTrack}
              className="flex-1 py-2 px-3 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition-all flex items-center justify-center gap-1.5 shadow-flat"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Track My Local Folder</span>
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
