'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import AppShell from './AppShell';
import DashboardView from '@/components/features/pricewatch/DashboardView';
import ResultsView from '@/components/features/pricewatch/ResultsView';
import WatchlistView from '@/components/features/pricewatch/WatchlistView';
import CategoryHistoryView from '@/components/features/pricewatch/CategoryHistoryView';
import ProductDrawer from '@/components/features/pricewatch/ProductDrawer';
import AlertsList from '@/components/features/alerts/AlertsList';
import { filterProducts } from '@/lib/pricewatch/utils';
import type { AlertItem, Locale, Product, StoreName, ViewName } from '@/types/pricewatch';

interface AppClientProps {
  initialProducts: Product[];
  initialAlerts: AlertItem[];
  fromLive: boolean;
}

export default function AppClient({ initialProducts, initialAlerts, fromLive }: AppClientProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  // Core state engines
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [alerts] = useState<AlertItem[]>(initialAlerts);
  const [view, setView] = useState<ViewName>('dashboard');
  const [search, setSearch] = useState('');
  const [activeStore, setActiveStore] = useState<StoreName | 'all'>('all');
  const [quickFilter, setQuickFilter] = useState<string>('');
  const [drawerProductId, setDrawerProductId] = useState<string | null>(null);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pricewatch_watchlist');
      if (stored) {
        const watchedIds: string[] = JSON.parse(stored);
        if (Array.isArray(watchedIds) && watchedIds.length > 0) {
          setTimeout(() => {
            setProducts((prev) =>
              prev.map((p) => ({
                ...p,
                watched: watchedIds.includes(p.id),
              }))
            );
            setIsHydrated(true);
          }, 0);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load watchlist from localStorage', e);
    }
    setTimeout(() => {
      setIsHydrated(true);
    }, 0);
  }, []);

  // Save watchlist to localStorage when products state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const watchedIds = products.filter((p) => p.watched).map((p) => p.id);
      localStorage.setItem('pricewatch_watchlist', JSON.stringify(watchedIds));
    } catch (e) {
      console.error('Failed to save watchlist to localStorage', e);
    }
  }, [products, isHydrated]);

  // Toggle alert list display
  const handleAlertsToggle = useCallback(() => {
    setAlertsOpen((prev) => !prev);
  }, []);

  // Update locale dynamically through next-intl routing
  const handleLocaleToggle = useCallback(() => {
    const nextLocale = locale === 'en' ? 'zh-Hant' : 'en';
    router.replace(pathname, { locale: nextLocale });
  }, [locale, pathname, router]);

  // Toggle bookmarked/watched items in list
  const handleWatchToggle = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, watched: !p.watched } : p))
    );
  }, []);

  // Bulk remove untracked items
  const handleBulkRemove = useCallback((ids: string[]) => {
    setProducts((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, watched: false } : p))
    );
  }, []);

  // Handle KPI card clicks from the Dashboard
  const handleStatClick = useCallback((statType: 'tracked' | 'drops' | 'savings' | 'alerts') => {
    if (statType === 'tracked') {
      setQuickFilter('watched');
      setSearch('');
      setActiveStore('all');
      setView('results');
    } else if (statType === 'drops') {
      setQuickFilter('drops');
      setSearch('');
      setActiveStore('all');
      setView('results');
    } else if (statType === 'savings') {
      setQuickFilter('offers');
      setSearch('');
      setActiveStore('all');
      setView('results');
    } else if (statType === 'alerts') {
      setAlertsOpen(true);
    }
  }, []);

  // Handle clickable categories and breadcrumbs
  const handleCategoryClick = useCallback((category: string, store?: StoreName | 'all') => {
    setSearch(category);
    if (store) {
      setActiveStore(store);
    } else {
      setActiveStore('all');
    }
    setQuickFilter('');
    setView('results');
    setDrawerProductId(null); // Close the details drawer
  }, []);

  // Process filtered items for search/comparisons
  const filteredProducts = useMemo(() => {
    // 1. Core category & store filtration
    let result = filterProducts(products, search, '', activeStore);

    // 2. Secondary quick filters
    if (quickFilter === 'watched') {
      result = result.filter((p) => p.watched);
    } else if (quickFilter === 'drops') {
      result = result.filter(
        (p) => p.trend === 'down' || p.prices.some((sp) => sp.prevPrice && sp.prevPrice > sp.price)
      );
    } else if (quickFilter === 'offers') {
      result = result.filter((p) => p.offerBadge || p.prices.some((sp) => sp.offer));
    } else if (quickFilter === 'lowest90') {
      result = result.filter((p) => {
        const minHistory = Math.min(...p.sparkline);
        return p.cheapestPrice <= minHistory;
      });
    }

    return result;
  }, [products, search, activeStore, quickFilter]);

  // Retrieve details of the product currently loaded in the drawer
  const drawerProduct = useMemo(() => {
    return products.find((p) => p.id === drawerProductId) || null;
  }, [products, drawerProductId]);

  return (
    <>
      <AppShell
        locale={locale}
        view={view}
        search={search}
        activeStore={activeStore}
        quickFilter={quickFilter}
        alerts={alerts}
        alertsOpen={alertsOpen}
        onViewChange={setView}
        onSearchChange={setSearch}
        onStoreChange={setActiveStore}
        onQuickFilterChange={setQuickFilter}
        onAlertsToggle={handleAlertsToggle}
        onLocaleToggle={handleLocaleToggle}
      >
        {alertsOpen ? (
          <AlertsList alerts={alerts} locale={locale} fromLive={fromLive} />
        ) : view === 'dashboard' ? (
          <DashboardView
            products={filteredProducts}
            alerts={alerts}
            locale={locale}
            onProductClick={setDrawerProductId}
            onStatClick={handleStatClick}
          />
        ) : view === 'results' ? (
          <ResultsView
            products={filteredProducts}
            locale={locale}
            onProductClick={setDrawerProductId}
            onWatchToggle={handleWatchToggle}
          />
        ) : view === 'watchlist' ? (
          <WatchlistView
            products={products}
            locale={locale}
            onProductClick={setDrawerProductId}
            onWatchToggle={handleWatchToggle}
            onBulkRemove={handleBulkRemove}
          />
        ) : (
          <CategoryHistoryView 
            products={products} 
            locale={locale} 
            onCategoryClick={handleCategoryClick}
          />
        )}
      </AppShell>

      {/* Slide-in details Drawer panel */}
      <ProductDrawer
        product={drawerProduct}
        open={drawerProductId !== null}
        onClose={() => setDrawerProductId(null)}
        locale={locale}
        onWatchToggle={handleWatchToggle}
        onCategoryClick={handleCategoryClick}
      />
    </>
  );
}
