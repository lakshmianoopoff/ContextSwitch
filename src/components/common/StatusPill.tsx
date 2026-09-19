import React from 'react';
import { StatusType } from '../../types';

interface StatusPillProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, label, size = 'sm' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'clean':
        return {
          bg: 'bg-[#EBF7EE]',
          border: 'border-[#BFE3C6]',
          text: 'text-[#256B30]',
          dot: 'bg-[#3FA34D]',
          defaultLabel: 'Clean',
        };
      case 'warning':
        return {
          bg: 'bg-[#FEF8EB]',
          border: 'border-[#F6DCAC]',
          text: 'text-[#9A6715]',
          dot: 'bg-[#E8A93B]',
          defaultLabel: 'Unresolved TODOs',
        };
      case 'failing':
        return {
          bg: 'bg-[#FDF0F0]',
          border: 'border-[#F6BCBC]',
          text: 'text-[#9D2626]',
          dot: 'bg-[#D93F3F]',
          defaultLabel: 'Failing tests',
        };
    }
  };

  const config = getStatusConfig();
  const displayLabel = label || config.defaultLabel;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs font-medium' 
    : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.border} ${config.text} ${sizeClasses} tracking-tight transition-all select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      <span>{displayLabel}</span>
    </span>
  );
};
