'use client';

import React from 'react';
import { Star, StarOff, HelpCircle, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import StorePill from '@/components/ui/StorePill';
import PriceBadge from '@/components/ui/PriceBadge';
import TrendChip from '@/components/ui/TrendChip';
import Sparkline from '@/components/charts/Sparkline';
import EmptyState from '@/components/ui/EmptyState';
import type { Product, Locale } from '@/types/pricewatch';

interface ResultsViewProps {
  products: Product[];
  locale: Locale;
  onProductClick: (id: string) => void;
  onWatchToggle: (id: string) => void;
}

export default function ResultsView({ products, locale, onProductClick, onWatchToggle }: ResultsViewProps) {
  const t = useTranslations('results');

  if (products.length === 0) {
    return (
      <EmptyState
        title={t('noResults')}
        description="Try searching for another keyword or removing active store filters."
      />
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-4" id="results-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('title')}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {t('subtitle', { count: products.length })}
          </p>
        </div>
      </div>

      {/* MOBILE LIST LAYOUT (< 640px) */}
      <div className="block sm:hidden space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm relative flex flex-col gap-3 hover:border-slate-200 transition-all active:scale-[0.98]"
          >
            {/* Watch Star */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWatchToggle(p.id);
              }}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-amber-500 transition-colors"
              aria-label="Track item"
            >
              <Star size={18} fill={p.watched ? '#f59e0b' : 'none'} />
            </button>

            {/* Product Meta */}
            <div onClick={() => onProductClick(p.id)} className="space-y-1 pr-6 cursor-pointer">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {p.brand[locale]} • {p.category}
              </span>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-snug line-clamp-2">
                {p.name[locale]}
              </h3>
            </div>

            {/* Prices, Sparkline & Trend */}
            <div onClick={() => onProductClick(p.id)} className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/40 cursor-pointer">
              <div className="flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mb-1">
                  Cheapest At:
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  <StorePill store={p.cheapestStore} />
                  <PriceBadge price={p.cheapestPrice} size="sm" />
                </div>
              </div>

              <div className="flex flex-col items-end justify-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mb-1">
                  Trend & History:
                </span>
                <div className="flex items-center gap-2">
                  <Sparkline data={p.sparkline} width={50} height={16} />
                  <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-1 py-0.5 rounded">
                    Spread: ${p.priceSpread.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Offer Badge & View Details */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/40">
              {p.offerBadge ? (
                <span className="inline-flex items-center rounded bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50 px-2 py-0.5 text-[10px] font-bold">
                  {p.offerBadge}
                </span>
              ) : (
                <div />
              )}
              <button
                onClick={() => onProductClick(p.id)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1"
              >
                View Details <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE LAYOUT (>= 640px) */}
      <div className="hidden sm:block overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
          <thead>
            <tr className="text-left text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/20">
              <th scope="col" className="px-6 py-4">{t('table.product')}</th>
              <th scope="col" className="px-6 py-4">{t('table.cheapest')}</th>
              <th scope="col" className="px-6 py-4">{t('table.spread')}</th>
              <th scope="col" className="px-6 py-4">{t('table.history')}</th>
              <th scope="col" className="px-6 py-4 text-center">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {products.map((p) => (
              <tr
                key={p.id}
                onClick={() => onProductClick(p.id)}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 cursor-pointer transition-colors"
              >
                {/* Product Name / Brand */}
                <td className="px-6 py-4 pr-3 max-w-sm">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {p.brand[locale]} • {p.category}
                  </span>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200 text-sm leading-snug line-clamp-2 mt-0.5">
                    {p.name[locale]}
                  </div>
                </td>

                {/* Cheapest Store + Price */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1.5 items-start">
                    <StorePill store={p.cheapestStore} />
                    <PriceBadge price={p.cheapestPrice} size="sm" />
                  </div>
                </td>

                {/* Price Spread & Offer badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="font-extrabold text-rose-600 dark:text-rose-400 text-xs bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded">
                      ${p.priceSpread.toFixed(1)}
                    </span>
                    {p.offerBadge && (
                      <span className="inline-flex items-center rounded bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50 px-1.5 py-0.2 text-[9px] font-bold mt-1">
                        {p.offerBadge}
                      </span>
                    )}
                  </div>
                </td>

                {/* Sparkline & Trend */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Sparkline data={p.sparkline} width={70} height={20} />
                    <TrendChip trend={p.trend} />
                  </div>
                </td>

                {/* Action star */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onWatchToggle(p.id);
                    }}
                    className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-amber-500 transition-colors"
                  >
                    <Star size={18} fill={p.watched ? '#f59e0b' : 'none'} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
