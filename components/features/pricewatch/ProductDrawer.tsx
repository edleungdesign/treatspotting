'use client';

import React, { useState } from 'react';
import { X, ExternalLink, Sparkles, Tag, ShoppingCart, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import StorePill from '@/components/ui/StorePill';
import PriceBadge from '@/components/ui/PriceBadge';
import PriceHistoryChart from '@/components/charts/PriceHistoryChart';
import type { Product, Locale, HistoryRange } from '@/types/pricewatch';

interface ProductDrawerProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  locale: Locale;
  onWatchToggle?: (id: string) => void;
  onCategoryClick?: (category: string) => void;
}

export default function ProductDrawer({ product, open, onClose, locale, onWatchToggle, onCategoryClick }: ProductDrawerProps) {
  const t = useTranslations('drawer');
  const [range, setRange] = useState<HistoryRange>('30D');

  if (!open || !product) return null;

  // Find cheapest price
  const cheapestPrice = product.cheapestPrice;

  // External HKTVmall Search Link based on brand name + product name for maximum realworld compatibility
  const brandName = product.brand[locale] || product.brand.en || '';
  const productName = product.name[locale] || product.name.en || '';
  const queryStr = `${brandName} ${productName}`.trim();
  const hktvmallSearchUrl = `https://www.hktvmall.com/hktv/en/search_a?keyword=${encodeURIComponent(queryStr)}`;

  return (
    <div
      id="product-drawer-overlay"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        id="product-drawer-content"
        className="w-full h-full md:h-full md:max-w-md bg-white dark:bg-slate-950 flex flex-col shadow-2xl relative animate-slide-in overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10">
          <div className="space-y-1 max-w-[80%]">
            <div className="flex flex-wrap items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {product.category1 && (
                <button
                  onClick={() => onCategoryClick?.(product.category1![locale] || product.category1!.en)}
                  className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-left"
                >
                  {product.category1[locale] || product.category1.en}
                </button>
              )}
              {product.category2 && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">&gt;</span>
                  <button
                    onClick={() => onCategoryClick?.(product.category2![locale] || product.category2!.en)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-left"
                  >
                    {product.category2[locale] || product.category2.en}
                  </button>
                </>
              )}
              {product.category3 && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">&gt;</span>
                  <button
                    onClick={() => onCategoryClick?.(product.category3![locale] || product.category3!.en)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-left"
                  >
                    {product.category3[locale] || product.category3.en}
                  </button>
                </>
              )}
              {!product.category1 && (
                <button
                  onClick={() => onCategoryClick?.(product.category)}
                  className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-left"
                >
                  {product.category}
                </button>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight line-clamp-1">
              {product.name[locale]}
            </h2>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onWatchToggle && (
              <button
                onClick={() => onWatchToggle(product.id)}
                className="p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-amber-500 transition-colors"
                aria-label={product.watched ? "Remove from watchlist" : "Add to watchlist"}
                title={product.watched ? "Remove from watchlist" : "Add to watchlist"}
              >
                <Star size={20} fill={product.watched ? '#f59e0b' : 'none'} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-colors"
              aria-label="Close drawer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Metadata Cards */}
          <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <span className="font-semibold text-slate-400 dark:text-slate-500 mr-1">Brand:</span>
              <span className="font-extrabold text-slate-700 dark:text-slate-300">{product.brand[locale]}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-400 dark:text-slate-500 mr-1">Barcode:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{product.code}</span>
            </div>
          </div>

          {/* Store Pricing Grid/Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingCart size={16} className="text-blue-500" />
              {t('pricesHeader')}
            </h3>

            <div className="space-y-2.5">
              {product.prices.map((sp) => {
                const isCheapest = sp.price === cheapestPrice;
                // Calculate percentage difference vs cheapest
                const premiumPercent = cheapestPrice > 0 
                  ? Math.round(((sp.price - cheapestPrice) / cheapestPrice) * 100)
                  : 0;

                return (
                  <div
                    key={sp.store}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isCheapest
                        ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/50 dark:bg-emerald-950/10'
                        : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <StorePill store={sp.store} />
                      {sp.offer && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                          <Tag size={10} />
                          {sp.offer}
                        </span>
                      )}
                    </div>

                    <div className="text-right flex flex-col items-end gap-0.5">
                      <PriceBadge price={sp.price} prevPrice={sp.prevPrice} size="sm" />
                      {premiumPercent > 0 ? (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                          +{premiumPercent}% vs Best
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5">
                          ★ Best Choice
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price History Section */}
          <div className="space-y-3 pt-3 border-t border-slate-50 dark:border-slate-800/40">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('historyHeader')}
              </h3>

              {/* Range Switcher */}
              <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-900 p-0.5" role="group">
                {(['7D', '30D', '90D'] as HistoryRange[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-2 py-1 text-[10px] font-extrabold rounded-md transition-all ${
                      range === r
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Render the Recharts price history */}
            <PriceHistoryChart product={product} range={range} locale={locale} />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            {onWatchToggle && (
              <button
                onClick={() => onWatchToggle(product.id)}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-150 border shadow-xs active:scale-95 ${
                  product.watched
                    ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100/50 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80'
                }`}
              >
                <Star size={14} fill={product.watched ? 'currentColor' : 'none'} className="text-amber-500" />
                <span>{product.watched ? 'Stop Tracking' : 'Track Price'}</span>
              </button>
            )}
            <a
              href={hktvmallSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs sm:text-sm font-extrabold transition-all duration-150 shadow-md shadow-orange-500/20 text-center"
            >
              <span>{t('externalLink')}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
