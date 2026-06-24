import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import clsx from 'clsx';

interface TrendChipProps {
  trend: 'up' | 'down' | 'stable';
  className?: string;
}

export default function TrendChip({ trend, className }: TrendChipProps) {
  return (
    <span
      id={`trend-chip-${trend}`}
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border shadow-sm transition-all',
        {
          'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50':
            trend === 'down',
          'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50':
            trend === 'up',
          'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700':
            trend === 'stable',
        },
        className
      )}
    >
      {trend === 'down' && <TrendingDown size={14} className="animate-pulse" />}
      {trend === 'up' && <TrendingUp size={14} />}
      {trend === 'stable' && <Minus size={14} />}
      <span className="capitalize">
        {trend === 'down' ? 'Price Drop' : trend === 'up' ? 'Price Up' : 'Stable'}
      </span>
    </span>
  );
}
