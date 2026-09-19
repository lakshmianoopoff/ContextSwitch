import React from 'react';

export const BriefingSkeleton: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Top back & actions skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-36 bg-warm-border/50 rounded-md" />
        <div className="h-8 w-44 bg-warm-border/50 rounded-md" />
      </div>

      {/* Header skeleton */}
      <div className="bg-warm-panel hairline-border p-6 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-7 w-52 bg-warm-border/60 rounded" />
            <div className="h-4 w-32 bg-warm-border/40 rounded" />
          </div>
          <div className="h-8 w-24 bg-warm-border/50 rounded-full" />
        </div>
        <div className="pt-4 border-t border-warm-border/40 space-y-2">
          <div className="h-3 w-40 bg-warm-border/50 rounded" />
          <div className="h-4 w-full bg-warm-border/40 rounded" />
          <div className="h-4 w-3/4 bg-warm-border/40 rounded" />
        </div>
      </div>

      {/* Suggested next step skeleton */}
      <div className="h-32 bg-accent/20 border border-accent/30 rounded-lg p-5 flex flex-col justify-between">
        <div className="h-4 w-48 bg-accent/30 rounded" />
        <div className="h-5 w-3/4 bg-accent/30 rounded" />
        <div className="h-8 w-full bg-accent/20 rounded" />
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="h-64 bg-warm-panel hairline-border rounded-lg p-4" />
          <div className="h-48 bg-warm-panel hairline-border rounded-lg p-4" />
        </div>
        <div className="lg:col-span-5">
          <div className="h-96 bg-warm-panel hairline-border rounded-lg p-4" />
        </div>
      </div>
    </div>
  );
};

export const PatternsSkeleton: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-warm-border/50 rounded" />
        <div className="h-8 w-72 bg-warm-border/60 rounded" />
        <div className="h-4 w-96 bg-warm-border/40 rounded" />
      </div>
      <div className="h-28 bg-accent/20 rounded-lg" />
      <div className="h-80 bg-warm-panel hairline-border rounded-lg" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-40 bg-warm-panel hairline-border rounded-lg" />
        <div className="h-40 bg-warm-panel hairline-border rounded-lg" />
      </div>
    </div>
  );
};
