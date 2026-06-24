'use client';

import React, { useState, useMemo } from 'react';
import { Star, Trash2, Share2, Shuffle, Check, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import StorePill from '@/components/ui/StorePill';
import PriceBadge from '@/components/ui/PriceBadge';
import TrendChip from '@/components/ui/TrendChip';
import Sparkline from '@/components/charts/Sparkline';
import EmptyState from '@/components/ui/EmptyState';
import type { Product, Locale } from '@/types/pricewatch';

interface WatchlistViewProps {
  products: Product[];
  locale: Locale;
  onProductClick: (id: string) => void;
  onWatchToggle: (id: string) => void;
  onBulkRemove: (ids: string[]) => void;
}

type TabType = 'all' | 'drops' | 'offers' | 'lowest90' | 'shared';

export default function WatchlistView({
  products,
  locale,
  onProductClick,
  onWatchToggle,
  onBulkRemove,
}: WatchlistViewProps) {
  const t = useTranslations('watchlist');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter products to only watched items
  const watchedProducts = useMemo(() => products.filter((p) => p.watched), [products]);

  // Apply tab filter on top of watched items
  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case 'drops':
        return watchedProducts.filter(
          (p) => p.trend === 'down' || p.prices.some((sp) => sp.prevPrice && sp.prevPrice > sp.price)
        );
      case 'offers':
        return watchedProducts.filter((p) => p.offerBadge || p.prices.some((sp) => sp.offer));
      case 'lowest90':
        // Product is at lowest 90D if current cheapestPrice is equal to minimum in sparkline
        return watchedProducts.filter((p) => {
          const minHistory = Math.min(...p.sparkline);
          return p.cheapestPrice <= minHistory;
        });
      case 'shared':
        // Just return a static mock subset for preview
        return watchedProducts.slice(0, 2);
      case 'all':
      default:
        return watchedProducts;
    }
  }, [watchedProducts, activeTab]);

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBulkUntrack = () => {
    onBulkRemove(selectedIds);
    setSelectedIds([]);
    triggerToast('Removed selected items from Watchlist.');
  };

  const handleBulkShare = () => {
    triggerToast(t('bulkBar.shareSuccess'));
  };

  const handleBulkCompare = () => {
    triggerToast(t('bulkBar.compareSuccess'));
  };

  if (watchedProducts.length === 0) {
    return (
      <EmptyState
        icon={<Star size={36} className="text-amber-500 animate-pulse" />}
        title="Your Watchlist is empty"
        description="Search for supermarket products and click the star icon to start monitoring prices across retail chains."
      />
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 relative" id="watchlist-view">
      {/* View Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('title')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('subtitle')}
        </p>
      </div>

      {/* Segmented Tab Row */}
      <div className="flex border-b border-slate-100 dark:border-slate-800/80 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none gap-4">
        {(['all', 'drops', 'offers', 'lowest90', 'shared'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedIds([]);
            }}
            className={`py-3 px-1 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors relative ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {t(`tabs.${tab}`)}
            {tab === 'all' && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {watchedProducts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* FILTERED RESULTS LIST / TABLE */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-sm">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            No tracked items match the &quot;{t(`tabs.${activeTab}`)}&quot; category filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* MOBILE LIST LAYOUT (< 640px) */}
          <div className="block sm:hidden space-y-4 pb-20">
            {filteredProducts.map((p) => {
              const isSelected = selectedIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-sm relative flex flex-col gap-3 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/10'
                      : 'border-slate-100 dark:border-slate-800/80'
                  }`}
                >
                  {/* Select Row Checkbox */}
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectRow(p.id)}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {/* Product Details Wrapper */}
                  <div className="pl-8 flex flex-col gap-2">
                    <div onClick={() => onProductClick(p.id)} className="space-y-0.5 cursor-pointer">
                      <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {p.brand[locale]} • {p.category}
                      </span>
                      <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs line-clamp-2 leading-tight">
                        {p.name[locale]}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/40 pt-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <StorePill store={p.cheapestStore} />
                        <PriceBadge price={p.cheapestPrice} size="sm" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkline data={p.sparkline} width={45} height={14} />
                        <span className="font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-1 py-0.5 rounded text-[10px]">
                          ${p.priceSpread.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE LAYOUT (>= 640px) */}
          <div className="hidden sm:block overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm pb-20">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
              <thead>
                <tr className="text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/20">
                  <th scope="col" className="px-6 py-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th scope="col" className="px-6 py-4">Product Details</th>
                  <th scope="col" className="px-6 py-4">Cheapest Store</th>
                  <th scope="col" className="px-6 py-4">Price Spread</th>
                  <th scope="col" className="px-6 py-4">Price Trend</th>
                  <th scope="col" className="px-6 py-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors ${
                        isSelected ? 'bg-blue-50/10 dark:bg-blue-950/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(p.id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {/* Product details */}
                      <td className="px-6 py-4 max-w-sm" onClick={() => onProductClick(p.id)}>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          {p.brand[locale]} • {p.category}
                        </span>
                        <div className="font-extrabold text-slate-800 dark:text-slate-200 text-sm leading-snug line-clamp-2 mt-0.5 cursor-pointer">
                          {p.name[locale]}
                        </div>
                      </td>

                      {/* Cheapest store */}
                      <td className="px-6 py-4 whitespace-nowrap" onClick={() => onProductClick(p.id)}>
                        <div className="flex flex-col gap-1 items-start cursor-pointer">
                          <StorePill store={p.cheapestStore} />
                          <PriceBadge price={p.cheapestPrice} size="sm" />
                        </div>
                      </td>

                      {/* Price spread */}
                      <td className="px-6 py-4 whitespace-nowrap" onClick={() => onProductClick(p.id)}>
                        <div className="flex flex-col gap-1 items-start cursor-pointer">
                          <span className="font-extrabold text-rose-600 dark:text-rose-400 text-xs bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded">
                            ${p.priceSpread.toFixed(1)}
                          </span>
                          {p.offerBadge && (
                            <span className="inline-flex items-center rounded bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50 px-1.5 py-0.2 text-[9px] font-bold">
                              {p.offerBadge}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Sparkline & trend */}
                      <td className="px-6 py-4 whitespace-nowrap" onClick={() => onProductClick(p.id)}>
                        <div className="flex items-center gap-3 cursor-pointer">
                          <Sparkline data={p.sparkline} width={70} height={20} />
                          <TrendChip trend={p.trend} />
                        </div>
                      </td>

                      {/* View Button */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => onProductClick(p.id)}
                          className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-full shadow-lg flex items-center gap-2 border border-slate-800 animate-slide-up">
          <Check size={16} className="text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* FLOATING BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold">
            <span className="h-5 w-5 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-extrabold text-xs">
              {selectedIds.length}
            </span>
            <span>{t('bulkBar.selected', { count: selectedIds.length })}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={handleBulkCompare}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-1 sm:flex-none"
            >
              <Shuffle size={14} />
              <span>Compare</span>
            </button>
            <button
              onClick={handleBulkShare}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-1 sm:flex-none"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
            <button
              onClick={handleBulkUntrack}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex-1 sm:flex-none"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
