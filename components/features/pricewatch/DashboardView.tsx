'use client';

import React, { useMemo } from 'react';
import { BookmarkCheck, Percent, ShoppingBag, BellRing, ArrowRight, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getDashboardStats, getCategorySummaries, CategorySummary } from '@/lib/pricewatch/utils';
import StorePill from '@/components/ui/StorePill';
import PriceBadge from '@/components/ui/PriceBadge';
import TrendChip from '@/components/ui/TrendChip';
import type { Product, AlertItem, Locale } from '@/types/pricewatch';

interface DashboardViewProps {
  products: Product[];
  alerts: AlertItem[];
  locale: Locale;
  onProductClick: (id: string) => void;
  onStatClick?: (statType: 'tracked' | 'drops' | 'savings' | 'alerts') => void;
}

export default function DashboardView({ products, alerts, locale, onProductClick, onStatClick }: DashboardViewProps) {
  const t = useTranslations('dashboard');

  const stats = useMemo(() => getDashboardStats(products, alerts), [products, alerts]);

  // Sort products by priceSpread descending for the biggest arbitrage opportunities
  const spreadOpportunities = useMemo(() => {
    return [...products]
      .filter(p => p.priceSpread > 0)
      .sort((a, b) => b.priceSpread - a.priceSpread)
      .slice(0, 5);
  }, [products]);

  // Sort products by greatest discount percent on any store
  const topDrops = useMemo(() => {
    const dropsList: Array<{ product: Product; store: string; discountPercent: number; currentPrice: number; prevPrice: number }> = [];

    products.forEach((p) => {
      p.prices.forEach((sp) => {
        if (sp.prevPrice && sp.prevPrice > sp.price) {
          const discountPercent = Math.round(((sp.prevPrice - sp.price) / sp.prevPrice) * 100);
          dropsList.push({
            product: p,
            store: sp.store,
            discountPercent,
            currentPrice: sp.price,
            prevPrice: sp.prevPrice
          });
        }
      });
    });

    return dropsList
      .sort((a, b) => b.discountPercent - a.discountPercent)
      .slice(0, 5);
  }, [products]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-8" id="dashboard-view">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t('subtitle')}
          </p>
        </div>
        
        {/* Connection status */}
        <div className="self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            {t('liveIndicator')}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div 
          onClick={() => onStatClick?.('tracked')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all active:scale-[0.98] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-blue-500 transition-colors">
              {t('kpi.tracked')}
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all">
              <BookmarkCheck size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.trackedCount}
            </span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
              <span>Items saved in list</span>
              <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">→</span>
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => onStatClick?.('drops')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all active:scale-[0.98] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-emerald-500 transition-colors">
              {t('kpi.drops')}
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {stats.priceDropsCount}
            </span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
              <span>Supermarkets price cuts</span>
              <span className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">→</span>
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => onStatClick?.('savings')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between cursor-pointer hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-md transition-all active:scale-[0.98] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-rose-500 transition-colors">
              {t('kpi.savings')}
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-all">
              <Percent size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
              {stats.avgSavingPercent}%
            </span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
              <span>Average discount depth</span>
              <span className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">→</span>
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => onStatClick?.('alerts')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all active:scale-[0.98] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-amber-500 transition-colors">
              {t('kpi.alerts')}
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-all">
              <BellRing size={20} className={stats.foodAlertsCount > 0 ? 'animate-bounce' : ''} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.foodAlertsCount}
            </span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
              <span>Active CFS warnings</span>
              <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">→</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Sections - Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spread Opportunities - 7 cols */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              {t('topDifferences.title')}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t('topDifferences.desc')}
            </p>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                <thead>
                  <tr className="text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <th scope="col" className="py-3">{t('topDifferences.product')}</th>
                    <th scope="col" className="py-3 text-right">{t('topDifferences.spread')}</th>
                    <th scope="col" className="py-3 text-right">{t('topDifferences.cheapest')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {spreadOpportunities.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => onProductClick(p.id)}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-colors"
                    >
                      <td className="py-3 pr-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm line-clamp-1">
                          {p.name[locale]}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          {p.brand[locale]} • {p.category}
                        </div>
                      </td>
                      <td className="py-3 text-right font-extrabold text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
                        ${p.priceSpread.toFixed(1)}
                      </td>
                      <td className="py-3 text-right">
                        <StorePill store={p.cheapestStore} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Hot Drops List - 5 cols */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Percent size={20} className="text-rose-500" />
              {t('recentDrops.title')}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t('recentDrops.desc')}
            </p>
          </div>

          <div className="space-y-4">
            {topDrops.map((drop, index) => (
              <div
                key={`${drop.product.id}-${index}`}
                onClick={() => onProductClick(drop.product.id)}
                className="group flex items-center justify-between p-3 rounded-xl border border-slate-50 dark:border-slate-800/40 hover:border-slate-100 dark:hover:border-slate-700/80 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 cursor-pointer transition-all duration-150"
              >
                <div className="space-y-1 pr-3 max-w-[65%]">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {drop.product.name[locale]}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StorePill store={drop.store as any} />
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold line-through">
                      ${drop.prevPrice.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end shrink-0">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50">
                    -{drop.discountPercent}% OFF
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm mt-1">
                    ${drop.currentPrice.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
