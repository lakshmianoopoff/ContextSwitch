import React, { useState, useEffect } from 'react';
import { PatternTheme } from '../../types';
import { InsightCallout } from './InsightCallout';
import { PatternsChart } from './PatternsChart';
import { Layers, ArrowUpRight, FolderGit2, RefreshCw, Sparkles } from 'lucide-react';
import { PatternsSkeleton } from '../common/LoadingSkeleton';
import { fetchLivePatterns } from '../../services/api';

interface PatternsViewProps {
  patterns?: PatternTheme[];
  insight?: string;
  recommendation?: string;
  onSelectProjectName?: (projectName: string) => void;
}

export const PatternsView: React.FC<PatternsViewProps> = ({
  patterns: initialPatterns = [],
  insight: initialInsight = '',
  recommendation: initialRecommendation = '',
  onSelectProjectName,
}) => {
  const [data, setData] = useState<PatternTheme[]>(initialPatterns);
  const [liveInsight, setLiveInsight] = useState<string>(initialInsight);
  const [liveRecommendation, setLiveRecommendation] = useState<string>(initialRecommendation);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadPatterns = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const liveData = await fetchLivePatterns();
      setData(liveData.patterns);
      if (liveData.insight) setLiveInsight(liveData.insight);
      if (liveData.recommendation) setLiveRecommendation(liveData.recommendation);
    } catch (err) {
      console.warn('Failed to load patterns from backend:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (initialPatterns.length === 0) {
      loadPatterns();
    } else {
      setData(initialPatterns);
      if (initialInsight) setLiveInsight(initialInsight);
      if (initialRecommendation) setLiveRecommendation(initialRecommendation);
    }
  }, [initialPatterns, initialInsight, initialRecommendation]);

  if (loading && data.length === 0) {
    return <PatternsSkeleton />;
  }

  const topPattern = data[0];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7">
      {/* View Header */}
      <div className="hairline-border-b pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent bg-accent-light px-2 py-0.5 rounded flex items-center gap-1 border border-accent/20">
              <Sparkles className="w-3 h-3" /> Cross-Repository Intelligence
            </span>
            <span className="text-xs text-warm-muted">· Live Codex Pattern Synthesis</span>
          </div>
          <h2 className="text-2xl font-bold text-warm-text tracking-tight">
            Patterns & Developer Friction Themes
          </h2>
          <p className="text-sm text-warm-muted mt-1 max-w-3xl">
            Aggregated analysis of why and where development pauses across all your tracked repositories. Identify systemic engineering bottlenecks before they compound into cognitive debt.
          </p>
        </div>

        <button
          onClick={() => loadPatterns(true)}
          disabled={refreshing}
          className="self-start md:self-auto inline-flex items-center gap-1.5 text-xs font-medium text-warm-text bg-warm-panel hairline-border hover:border-warm-muted px-3 py-1.5 rounded-md shadow-flat transition-all shrink-0 disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-warm-muted ${refreshing ? 'animate-spin text-accent' : ''}`} />
          <span>{refreshing ? 'Synthesizing...' : 'Re-run Codex Analysis'}</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className="bg-warm-panel hairline-border p-12 text-center rounded-lg">
          <p className="text-sm text-warm-muted">
            No cross-project pattern data recorded yet. Capture snapshots across multiple projects to detect recurring bottlenecks.
          </p>
        </div>
      ) : (
        <>
          {/* The Single Bold Accent Callout for this screen */}
          {topPattern && (
            <InsightCallout
              headline={`${topPattern.theme} is Your Primary Blocker`}
              body={liveInsight || `Detected across ${topPattern.affectedProjects?.length || 1} repositories with an average resolution delay of ${topPattern.avgResolutionTime || '2.1 days'}.`}
              recommendation={liveRecommendation || topPattern.recommendation}
            />
          )}

          {/* Recharts Horizontal Bar Chart */}
          <PatternsChart patterns={data} />

          {/* Detailed Theme Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-warm-text">
                  Theme Breakdown & Remediation
                </h3>
                <p className="text-xs text-warm-muted">
                  Correlated repositories and preventative architectural patterns
                </p>
              </div>
              <span className="text-xs font-mono text-warm-muted">
                {data.length} themes categorized
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-warm-panel hairline-border p-5 rounded-lg shadow-flat space-y-3 hover:border-warm-muted/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-warm-bg border border-warm-border text-[11px] font-mono font-bold flex items-center justify-center text-warm-muted">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-warm-text">
                          {item.theme}
                        </h4>
                        <span className="text-[11px] font-mono text-warm-muted">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-semibold text-warm-text block">
                        {item.count} pauses
                      </span>
                      <span className="text-[11px] font-mono text-warm-muted">
                        {item.percentage}% of total
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-warm-text/90 leading-relaxed bg-warm-bg/60 p-2.5 rounded border border-warm-border/60">
                    {item.description}
                  </p>

                  {/* Affected Projects & Resolution */}
                  <div className="pt-2 hairline-border-t space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <FolderGit2 className="w-3.5 h-3.5 text-warm-muted shrink-0" />
                      <span className="text-[11px] text-warm-muted font-medium">Affected repos:</span>
                      {item.affectedProjects?.map((proj) => (
                        <button
                          key={proj}
                          onClick={() => onSelectProjectName && onSelectProjectName(proj)}
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-warm-text bg-warm-bg px-2 py-0.5 rounded border border-warm-border hover:border-accent hover:text-accent transition-colors"
                        >
                          <span>{proj}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-60" />
                        </button>
                      ))}
                    </div>

                    {item.recommendation && (
                      <div className="text-[11px] text-warm-muted flex items-start gap-1">
                        <Layers className="w-3.5 h-3.5 text-warm-muted/70 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-warm-text font-medium">Fix:</strong> {item.recommendation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
