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

const CATEGORY_CODES: Record<string, string> = {
  'Rice & Grains': 'RICE',
  'Dairy & Chilled': 'DAIRY',
  'Cooking Oil & Condiments': 'OILS',
  'Noodles & Pasta': 'PASTA',
  'Beverages': 'BEV',
  'Household': 'HOUSE',
  'Canned Food': 'CANNED',
  'Baby Care': 'BABY',
  'Personal Care': 'PERS',
};

function getCategoryCode(cat: string): string {
  if (CATEGORY_CODES[cat]) {
    return CATEGORY_CODES[cat];
  }
  const cleaned = cat.replace('&', '').replace('and', '').replace(/\s+/g, ' ').trim();
  const words = cleaned.split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 5).toUpperCase();
  } else if (words.length >= 2) {
    return (words[0].substring(0, 3) + '-' + words[1].substring(0, 3)).toUpperCase();
  }
  return cat.toUpperCase();
}

export default function CategoryHistoryView({ products, locale, onCategoryClick }: CategoryHistoryViewProps) {
  const t = useTranslations('categories');
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState<'30D' | '90D' | '180D' | '1Y' | 'ALL'>('90D');
  const [hiddenCategories, setHiddenCategories] = useState<Record<string, boolean>>({});

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
    
    // Core categories synchronized with the summaries card list
    const categoriesList = summaries.map((s) => s.category);

    let pointCount = 15;
    let daysInterval = 6;

    if (period === '30D') {
      pointCount = 15;
      daysInterval = 2;
    } else if (period === '90D') {
      pointCount = 15;
      daysInterval = 6;
    } else if (period === '180D') {
      pointCount = 15;
      daysInterval = 12;
    } else if (period === '1Y') {
      pointCount = 12;
      daysInterval = 30;
    } else if (period === 'ALL') {
      pointCount = 12;
      daysInterval = 60;
    }

    for (let i = pointCount - 1; i >= 0; i--) {
      const date = new Date(now);
      const daysAgo = i * daysInterval;
      date.setDate(now.getDate() - daysAgo);

      let dateStr = '';
      if (period === '1Y' || period === 'ALL') {
        dateStr = date.toLocaleDateString(locale === 'zh-Hant' ? 'zh-HK' : 'en-US', { month: 'short', year: '2-digit' });
      } else {
        dateStr = date.toLocaleDateString(locale === 'zh-Hant' ? 'zh-HK' : 'en-US', { month: 'short', day: 'numeric' });
      }

      const point: any = { date: dateStr };

      categoriesList.forEach((cat, index) => {
        // Generate a stable seed from category name
        const seed = cat.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + index * 17;
        
        // Let t represent absolute days forward (epoch relative to today)
        const t = 1000 - daysAgo;

        // Base price index value
        const baseValue = 100.0 + (seed % 6) - 3;

        // Long-term linear drift
        const driftSign = index % 3 === 0 ? -1.0 : (index % 3 === 1 ? 1.0 : 0.3);
        const driftRate = 0.008 * driftSign;
        const drift = (t - 500) * driftRate;

        // Long term seasonal wave (~150 to 190 days)
        const longFreq = 2 * Math.PI / (150 + (seed % 40));
        const longAmp = 2.5 + (seed % 3) * 0.5;
        const longWave = Math.sin(t * longFreq + (seed % 5)) * longAmp;

        // Medium term supply fluctuations (~25 to 33 days)
        const medFreq = 2 * Math.PI / (25 + (seed % 8));
        const medAmp = 1.0 + (seed % 2) * 0.3;
        const medWave = Math.sin(t * medFreq + (seed % 3)) * medAmp;

        // Weekly promotions wave (~7 days)
        const shortFreq = 2 * Math.PI / 7;
        const shortAmp = 0.4 + (seed % 2) * 0.2;
        const shortWave = Math.sin(t * shortFreq + (seed % 2)) * shortAmp;

        // Deterministic daily noise based purely on daysAgo and seed
        const noiseVal = Math.sin(daysAgo * 12.9898 + seed * 78.233) * 43758.5453;
        const noise = (noiseVal - Math.floor(noiseVal) - 0.5) * 0.6;

        // Combine into a realistic, deterministic price index value
        let val = baseValue + drift + longWave + medWave + shortWave + noise;
        
        // Limit to standard retail index bounds
        val = Math.max(88, Math.min(115, val));
        
        point[cat] = Math.round(val * 10) / 10;
      });

      dates.push(point);
    }

    return { dates, categoriesList };
  }, [summaries, period, locale]);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('chartTitle')}
          </h3>
          
          {/* Stock-style period selector */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800/80 self-start sm:self-auto">
            {(['30D', '90D', '180D', '1Y', 'ALL'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  period === p
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

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
                  formatter={(value, name) => [String(value ?? '—'), name]}
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
                  wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px', cursor: 'pointer' }}
                  onClick={(o) => {
                    const dataKey = o?.dataKey;
                    if (typeof dataKey === 'string') {
                      setHiddenCategories((prev) => ({
                        ...prev,
                        [dataKey]: !prev[dataKey],
                      }));
                    }
                  }}
                  formatter={(value, entry: any) => {
                    const cat = entry?.payload?.dataKey;
                    const isHidden = cat ? hiddenCategories[cat] : false;
                    const found = chartData.categoriesList.find((c) => getCategoryCode(c) === value);
                    const label = found ? `${value} (${found})` : value;
                    
                    return (
                      <span className={`select-none transition-all ${
                        isHidden 
                          ? 'text-slate-300 dark:text-slate-600 line-through decoration-slate-400 dark:decoration-slate-500 font-normal' 
                          : 'text-slate-700 dark:text-slate-300 hover:text-blue-500'
                      }`}>
                        {label}
                      </span>
                    );
                  }}
                />

                {chartData.categoriesList.map((cat, index) => (
                  <Line
                    key={cat}
                    type="monotone"
                    dataKey={cat}
                    name={getCategoryCode(cat)}
                    stroke={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                    hide={hiddenCategories[cat]}
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
