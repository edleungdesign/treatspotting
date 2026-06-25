'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { getCategorySummaries, CategorySummary } from '@/lib/pricewatch/utils';
import StorePill from '@/components/ui/StorePill';
import type { Product, Locale, StoreName } from '@/types/pricewatch';

interface CategoryHistoryViewProps {
  products: Product[];
  locale: Locale;
  onCategoryClick?: (category: string, store?: StoreName | 'all') => void;
}

const CATEGORY_COLORS = [
  '#2563eb', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#9333ea', // purple
  '#ec4899', // pink
  '#ea580c', // orange
  '#06b6d4', // cyan
];

export default function CategoryHistoryView({ products, locale, onCategoryClick }: CategoryHistoryViewProps) {
  const t = useTranslations('categories');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const summaries = useMemo(() => getCategorySummaries(products), [products]);

  // Generate indexed time series data per category starting at 100
  const chartData = useMemo(() => {
    const dates = [];
    const now = new Date();
    
    // Core categories in our system
    const categoriesList = Array.from(new Set(products.map((p) => p.category))).slice(0, 5);

    for (let i = 14; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i * 3); // 15 points spaced 3 days apart (approx 45 days of index)

      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const point: any = { date: dateStr };

      categoriesList.forEach((cat, index) => {
        // Base category trend. Start at 100 on June 1st.
        // Slight drift downwards (representing drops) or upwards.
        const baseTrend = 100;
        const drift = (14 - i) * (index % 2 === 0 ? -0.2 : 0.15);
        const wave = Math.sin(i * 1.2 + index) * 1.0;
        
        point[cat] = Math.round((baseTrend + drift + wave) * 10) / 10;
      });

      dates.push(point);
    }

    return { dates, categoriesList };
  }, [products]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-8" id="category-history-view">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('title')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('subtitle')}
        </p>
      </div>

      {/* Categories Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaries.map((summary) => (
          <div
            key={summary.category}
            onClick={() => onCategoryClick?.(summary.category)}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 dark:hover:border-blue-900/60 group"
          >
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-blue-500 transition-colors">
                Category
              </span>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-1 tracking-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {summary.category}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-slate-50 dark:border-slate-800/40 text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{t('stat.count')}</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{summary.itemCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{t('stat.saving')}</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">{summary.avgDelta}%</span>
              </div>
            </div>

            <div 
              onClick={(e) => {
                e.stopPropagation();
                onCategoryClick?.(summary.category, summary.cheapestStore);
              }}
              className="flex items-center justify-between mt-4 bg-slate-50 dark:bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group/store"
            >
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase group-hover/store:text-blue-500 transition-colors">{t('stat.bestStore')}</span>
              <StorePill store={summary.cheapestStore} className="transition-transform group-hover/store:scale-105" />
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Price Index over Time */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('chartTitle')}
        </h3>

        {!mounted ? (
          <div className="h-80 w-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-slate-100 animate-pulse">
            <span className="text-xs text-slate-400 font-semibold">Loading index chart...</span>
          </div>
        ) : (
          <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.dates} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="opacity-40 dark:stroke-slate-800" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip
                  formatter={(value) => [String(value ?? '—'), t('indexBase')]}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }}
                />

                {chartData.categoriesList.map((cat, index) => (
                  <Line
                    key={cat}
                    type="monotone"
                    dataKey={cat}
                    stroke={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
