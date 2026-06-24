import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  tone?: 'green' | 'red' | 'amber' | 'blue';
  className?: string;
}

export default function Badge({ children, tone = 'blue', className }: BadgeProps) {
  return (
    <span
      id={`badge-${tone}`}
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors',
        {
          'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50':
            tone === 'green',
          'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50':
            tone === 'red',
          'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50':
            tone === 'amber',
          'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50':
            tone === 'blue',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
