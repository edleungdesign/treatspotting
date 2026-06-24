import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon = <HelpCircle size={36} className="text-slate-400 dark:text-slate-600" />,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      id="empty-state"
      className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10 max-w-md mx-auto my-12"
    >
      <div className="mb-4 p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="w-full flex justify-center">{action}</div>}
    </div>
  );
}
