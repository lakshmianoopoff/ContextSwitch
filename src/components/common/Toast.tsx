import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-warm-text text-warm-bg px-4 py-3 rounded-lg shadow-lg border border-warm-border/40 animate-fade-in text-sm font-medium">
      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-warm-bg/70 hover:text-warm-bg p-0.5 rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
