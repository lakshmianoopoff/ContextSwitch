import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { PatternTheme } from '../../types';

interface PatternsChartProps {
  patterns: PatternTheme[];
}

export const PatternsChart: React.FC<PatternsChartProps> = ({ patterns }) => {
  // Sort by count descending
  const sortedData = [...patterns].sort((a, b) => b.count - a.count);

  const getBarColor = (index: number) => {
    if (index === 0) return '#F2542D'; // Accent for top bottleneck
    if (index === 1) return '#E8A93B'; // Warning amber for second
    if (index === 2) return '#D9822B';
    return '#8F7D68'; // Muted warm
  };

  return (
    <div className="bg-warm-panel hairline-border rounded-lg shadow-flat p-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-semibold text-warm-text">
            Recurring Stuck Themes Across Projects
          </h3>
          <p className="text-xs text-warm-muted mt-0.5">
            Frequency of context loss reasons detected when sessions are paused
          </p>
        </div>
        <div className="text-xs font-mono text-warm-muted bg-warm-bg px-2.5 py-1 rounded border border-warm-border">
          Total Pauses: {patterns.reduce((sum, p) => sum + p.count, 0)}
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE0CC" horizontal={false} />
            <XAxis
              type="number"
              stroke="#8F7D68"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickLine={false}
              axisLine={{ stroke: '#EDE0CC' }}
              tickFormatter={(v) => `${v} pauses`}
            />
            <YAxis
              dataKey="theme"
              type="category"
              stroke="#2B2118"
              fontSize={12}
              fontFamily="Inter"
              tickLine={false}
              axisLine={{ stroke: '#EDE0CC' }}
              width={240}
              tick={{ fill: '#2B2118', fontWeight: 500 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(237, 224, 204, 0.3)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as PatternTheme;
                  return (
                    <div className="bg-warm-panel p-3 rounded shadow-lg border border-warm-border text-xs font-sans space-y-1">
                      <p className="font-semibold text-warm-text">{data.theme}</p>
                      <div className="flex items-center gap-3 font-mono text-[11px] text-warm-muted">
                        <span>{data.count} paused sessions</span>
                        <span>·</span>
                        <span>{data.percentage}% of total</span>
                      </div>
                      <p className="text-[11px] text-warm-muted pt-1 border-t border-warm-border/60">
                        Avg resolution delay: <strong className="text-warm-text">{data.avgResolutionTime}</strong>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
              {sortedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
