import React, { useState } from 'react';
import { AlertCircle, FileCode, CheckCircle2, ChevronDown, ChevronRight, Copy, Check, Terminal } from 'lucide-react';
import { UnresolvedItem } from '../../types';

interface UnresolvedPanelProps {
  items: UnresolvedItem[];
  onCopyText?: (text: string) => void;
}

export const UnresolvedPanel: React.FC<UnresolvedPanelProps> = ({ items, onCopyText }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'test' | 'todo'>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [items[0]?.id || '']: true,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tests = items.filter((i) => i.type === 'test');
  const todos = items.filter((i) => i.type === 'todo');

  const displayedItems = items.filter((i) => {
    if (activeTab === 'all') return true;
    return i.type === activeTab;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyRef = (item: UnresolvedItem) => {
    const text = `${item.file}:${item.line}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    if (onCopyText) onCopyText(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-warm-panel hairline-border rounded-lg shadow-flat overflow-hidden flex flex-col">
      {/* Header & Tabs */}
      <div className="p-4 hairline-border-b flex items-center justify-between gap-3 bg-warm-panel flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-warm-text">Unresolved Context</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-warm-bg border border-warm-border text-warm-muted">
              {items.length} total
            </span>
          </div>
          <p className="text-xs text-warm-muted mt-0.5">
            Failing test assertions and open TODO comments blocking branch merge
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex items-center p-0.5 bg-warm-bg hairline-border rounded-md text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'all'
                ? 'bg-warm-panel text-warm-text font-semibold shadow-flat'
                : 'text-warm-muted hover:text-warm-text'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              activeTab === 'test'
                ? 'bg-[#FDF0F0] text-[#9D2626] font-semibold border border-[#F6BCBC] shadow-flat'
                : 'text-warm-muted hover:text-warm-text'
            }`}
          >
            <AlertCircle className="w-3 h-3 text-status-failing" />
            <span>Tests ({tests.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('todo')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              activeTab === 'todo'
                ? 'bg-[#FEF8EB] text-[#9A6715] font-semibold border border-[#F6DCAC] shadow-flat'
                : 'text-warm-muted hover:text-warm-text'
            }`}
          >
            <FileCode className="w-3 h-3 text-status-warning" />
            <span>TODOs ({todos.length})</span>
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="divide-y divide-warm-border/60 max-h-[500px] overflow-y-auto">
        {displayedItems.length === 0 ? (
          <div className="p-8 text-center bg-warm-bg/30">
            <CheckCircle2 className="w-8 h-8 text-status-clean mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-warm-text">All Clear</h4>
            <p className="text-xs text-warm-muted mt-1">
              No unresolved {activeTab === 'all' ? 'issues' : activeTab === 'test' ? 'failing tests' : 'TODOs'} detected on this branch snapshot.
            </p>
          </div>
        ) : (
          displayedItems.map((item) => {
            const isExpanded = !!expandedIds[item.id];
            const isTest = item.type === 'test';
            const fileLine = `${item.file}:${item.line}`;

            return (
              <div key={item.id} className="p-4 transition-colors hover:bg-warm-bg/20">
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="flex items-start gap-2.5 flex-1 cursor-pointer select-none"
                  >
                    <span className="mt-0.5 text-warm-muted">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {isTest ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#FDF0F0] text-[#9D2626] border border-[#F6BCBC]">
                            <AlertCircle className="w-3 h-3" />
                            <span>Failing Test</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#FEF8EB] text-[#9A6715] border border-[#F6DCAC]">
                            <FileCode className="w-3 h-3" />
                            <span>Open TODO</span>
                          </span>
                        )}

                        <span className="font-semibold text-sm text-warm-text">
                          {item.title}
                        </span>
                      </div>

                      {/* File:Line reference in JetBrains Mono */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyRef(item);
                          }}
                          className="font-mono text-xs text-warm-text bg-warm-bg px-2 py-0.5 rounded border border-warm-border hover:border-warm-muted transition-colors inline-flex items-center gap-1.5 group"
                          title="Click to copy file:line"
                        >
                          <span>{fileLine}</span>
                          {copiedId === item.id ? (
                            <Check className="w-3 h-3 text-status-clean" />
                          ) : (
                            <Copy className="w-3 h-3 text-warm-muted group-hover:text-warm-text" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details: Code Snippet & Error Details */}
                {isExpanded && (
                  <div className="mt-3.5 pl-6 space-y-2.5">
                    {item.detail && (
                      <div className="text-xs text-warm-text/90 bg-warm-bg/70 p-2.5 rounded border border-warm-border/70 font-mono">
                        <span className="text-warm-muted block text-[10px] uppercase font-sans font-semibold mb-1">
                          Diagnostic Message:
                        </span>
                        {item.detail}
                      </div>
                    )}

                    {item.codeSnippet && (
                      <div className="bg-[#2B2118] text-[#FFF8ED] rounded p-3 text-xs font-mono overflow-x-auto border border-warm-border">
                        <pre className="leading-relaxed">{item.codeSnippet}</pre>
                      </div>
                    )}

                    {item.command && (
                      <div className="flex items-center justify-between gap-2 p-2 bg-warm-bg rounded border border-warm-border text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-warm-muted truncate">
                          <Terminal className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate text-warm-text">{item.command}</span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.command || '');
                            if (onCopyText) onCopyText(item.command || '');
                          }}
                          className="text-[11px] text-accent font-sans font-medium hover:underline shrink-0"
                        >
                          Copy Run Command
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
