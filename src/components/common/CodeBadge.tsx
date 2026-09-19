import React, { useState } from 'react';
import { Copy, Check, GitBranch } from 'lucide-react';

interface CodeBadgeProps {
  code: string;
  isBranch?: boolean;
  copyable?: boolean;
  className?: string;
  onCopy?: (text: string) => void;
}

export const CodeBadge: React.FC<CodeBadgeProps> = ({
  code,
  isBranch = false,
  copyable = false,
  className = '',
  onCopy,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (onCopy) onCopy(code);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-xs text-warm-text bg-warm-bg/90 border border-warm-border/80 group ${
        copyable ? 'cursor-pointer hover:border-warm-muted/50 hover:bg-warm-bg' : ''
      } ${className}`}
      onClick={copyable ? handleCopy : undefined}
      title={copyable ? 'Click to copy' : undefined}
    >
      {isBranch && <GitBranch className="w-3 h-3 text-warm-muted shrink-0" />}
      <span className="truncate max-w-[280px]">{code}</span>
      {copyable && (
        <span className="text-warm-muted group-hover:text-warm-text transition-colors ml-0.5">
          {copied ? <Check className="w-3 h-3 text-status-clean" /> : <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />}
        </span>
      )}
    </span>
  );
};
