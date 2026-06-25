import React from 'react';
import clsx from 'clsx';
import type { StoreName } from '@/types/pricewatch';

interface StorePillProps {
  store: StoreName;
  active?: boolean;
  className?: string;
}

export default function StorePill({ store, active = false, className }: StorePillProps) {
  const getStoreStyles = (name: StoreName) => {
    switch (name) {
      case 'WELLCOME':
        return active
          ? 'bg-rose-600 text-white border-rose-600'
          : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40';
      case 'PARKNSHOP':
        return active
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40';
      case 'TASTE':
        return active
          ? 'bg-emerald-600 text-white border-emerald-600'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40';
      case 'AEON':
        return active
          ? 'bg-purple-600 text-white border-purple-600'
          : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40';
      case 'HKTVMALL':
        return active
          ? 'bg-orange-600 text-white border-orange-600'
          : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40';
      case 'JASONS':
        return active
          ? 'bg-teal-600 text-white border-teal-600'
          : 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/40';
      case 'LUNGFUNG':
        return active
          ? 'bg-pink-600 text-white border-pink-600'
          : 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-900/40';
      case 'DCHFOOD':
        return active
          ? 'bg-amber-600 text-white border-amber-600'
          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40';
      case 'WATSONS':
        return active
          ? 'bg-cyan-600 text-white border-cyan-600'
          : 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/20 dark:text-cyan-400 dark:border-cyan-900/40';
      case 'MANNINGS':
        return active
          ? 'bg-orange-600 text-white border-orange-600'
          : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40';
      case 'SASA':
        return active
          ? 'bg-fuchsia-600 text-white border-fuchsia-600'
          : 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950/20 dark:text-fuchsia-400 dark:border-fuchsia-900/40';
      default:
        return active
          ? 'bg-slate-700 text-white border-slate-700'
          : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getStoreDisplayName = (name: StoreName) => {
    switch (name) {
      case 'WELLCOME':
        return 'Wellcome 惠康';
      case 'PARKNSHOP':
        return 'PNS 百佳';
      case 'TASTE':
        return 'TASTE';
      case 'AEON':
        return 'AEON';
      case 'HKTVMALL':
        return 'HKTVmall';
      case 'JASONS':
        return 'Market Place';
      case 'LUNGFUNG':
        return 'Lung Fung 龍豐';
      case 'DCHFOOD':
        return 'DCH Food 大昌';
      case 'WATSONS':
        return 'Watsons 屈臣氏';
      case 'MANNINGS':
        return 'Mannings 萬寧';
      case 'SASA':
        return 'Sasa 莎莎';
      default:
        return name;
    }
  };

  return (
    <span
      id={`store-pill-${store}`}
      className={clsx(
        'inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold border transition-all shadow-sm',
        getStoreStyles(store),
        className
      )}
    >
      {getStoreDisplayName(store)}
    </span>
  );
}
