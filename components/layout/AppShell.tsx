'use client';

import React, { useEffect, useState } from 'react';
import {
  Bell,
  Languages,
  LayoutDashboard,
  Search,
  Star,
  LineChart,
  Sun,
  Moon,
  AlertTriangle,
  Compass,
  TrendingUp
} from 'lucide-react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import StorePill from '@/components/ui/StorePill';
import type { Locale, StoreName, ViewName, AlertItem } from '@/types/pricewatch';

interface AppShellProps {
  locale: Locale;
  view: ViewName;
  search: string;
  activeStore: StoreName | 'all';
  quickFilter: string;
  alerts: AlertItem[];
  alertsOpen: boolean;
  onViewChange: (v: ViewName) => void;
  onSearchChange: (s: string) => void;
  onStoreChange: (st: StoreName | 'all') => void;
  onQuickFilterChange: (qf: string) => void;
  onAlertsToggle: () => void;
  onLocaleToggle: () => void;
  children: React.ReactNode;
}

const STORES: Array<StoreName | 'all'> = ['all', 'WELLCOME', 'PARKNSHOP', 'TASTE', 'AEON', 'HKTVMALL'];

export default function AppShell({
  locale,
  view,
  search,
  activeStore,
  quickFilter,
  alerts,
  alertsOpen,
  onViewChange,
  onSearchChange,
  onStoreChange,
  onQuickFilterChange,
  onAlertsToggle,
  onLocaleToggle,
  children
}: AppShellProps) {
  const t = useTranslations('appShell');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize Theme class from client-side
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || 
                   localStorage.getItem('theme') === 'dark';
    setTimeout(() => {
      setDarkMode(isDark);
    }, 0);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleDarkModeToggle = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navItems = [
    { key: 'dashboard' as ViewName, label: t('views.dashboard'), icon: LayoutDashboard },
    { key: 'results' as ViewName, label: t('views.results'), icon: Compass },
    { key: 'watchlist' as ViewName, label: t('views.watchlist'), icon: Star },
    { key: 'categories' as ViewName, label: t('views.categories'), icon: LineChart }
  ];

  // Active food alerts of recall or warning severity
  const activeAlertsCount = alerts.filter(a => a.severity === 'recall' || a.severity === 'warning').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row font-sans text-slate-800 dark:text-slate-200 transition-colors duration-200">
      
      {/* DESKTOP SIDEBAR NAV (>= 1024px) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/80 p-5 sticky top-0 h-screen justify-between shrink-0">
        <div className="space-y-8">
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/20">
              PW
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                {t('eyebrow')}
              </p>
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                Treatspotting
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5" aria-label={t('nav')}>
            {navItems.map(({ key, label, icon: Icon }) => {
              const isActive = view === key && !alertsOpen;
              return (
                <button
                  key={key}
                  onClick={() => {
                    onViewChange(key);
                    if (alertsOpen) onAlertsToggle();
                  }}
                  className={clsx(
                    'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all relative',
                    isActive
                      ? 'bg-blue-50/70 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-900/40'
                  )}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer controls inside sidebar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleDarkModeToggle}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            aria-label={t('theme')}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={onLocaleToggle}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-extrabold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            aria-label={t('language')}
          >
            <Languages size={14} />
            <span>{locale === 'en' ? '繁中' : 'EN'}</span>
          </button>
        </div>
      </aside>

      {/* MAIN MAIN CONTENT COLUMN */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        
        {/* TOP COMPACT HEADER (SearchBar, chain pills, alert triggers) */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 sticky top-0 z-30 p-4 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (view !== 'results' && !alertsOpen) {
                    onViewChange('results');
                  }
                }}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm font-semibold border-0 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-inner"
              />
            </div>

            {/* Topbar Actions (Active Alert Bell, Mobile switches) */}
            <div className="flex items-center gap-2">
              <button
                onClick={onAlertsToggle}
                className={clsx(
                  'p-2 sm:p-2.5 rounded-2xl relative border transition-all active:scale-95',
                  alertsOpen
                    ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                )}
                aria-label={t('alerts')}
              >
                <Bell size={18} className={activeAlertsCount > 0 && !alertsOpen ? 'animate-swing origin-top' : ''} />
                {activeAlertsCount > 0 && (
                  <span className={clsx(
                    'absolute -top-1 -right-1 h-5 w-5 rounded-full text-[10px] font-extrabold flex items-center justify-center border-2',
                    alertsOpen ? 'bg-white text-amber-500 border-amber-500' : 'bg-amber-500 text-white border-white dark:border-slate-900'
                  )}>
                    {activeAlertsCount}
                  </span>
                )}
              </button>

              {/* Mobile controls (Languages + Theme) */}
              <button
                onClick={onLocaleToggle}
                className="lg:hidden p-2 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-500 text-xs font-bold active:scale-95 transition-all"
              >
                {locale === 'en' ? '中' : 'EN'}
              </button>

              <button
                onClick={handleDarkModeToggle}
                className="lg:hidden p-2 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-500 active:scale-95 transition-all"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          {/* Supermarket Chain filter row (horizontal scroll on mobile) */}
          {!alertsOpen && (
            <div className="flex flex-col gap-2.5">
              {/* Chain horizontal pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                {STORES.map((st) => (
                  <button
                    key={st}
                    onClick={() => onStoreChange(st)}
                    className="shrink-0 transition-transform active:scale-95"
                  >
                    {st === 'all' ? (
                      <span className={clsx(
                        'inline-flex items-center rounded px-3 py-1 text-xs font-bold border transition-all',
                        activeStore === 'all'
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-150 dark:border-slate-800'
                      )}>
                        {t('allStores')}
                      </span>
                    ) : (
                      <StorePill store={st} active={activeStore === st} />
                    )}
                  </button>
                ))}
              </div>

              {/* Quick filter chips */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
                {(['all', 'drops', 'offers', 'lowest90'] as const).map((qf) => {
                  const isActive = quickFilter === qf || (qf === 'all' && !quickFilter);
                  const displayLabel = qf === 'all' ? 'All Items' : t(`quick.${qf}`);
                  return (
                    <button
                      key={qf}
                      onClick={() => onQuickFilterChange(qf === 'all' ? '' : qf)}
                      className={clsx(
                        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 border',
                        isActive
                          ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-950 dark:border-slate-200 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-150 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800/80'
                      )}
                    >
                      {qf === 'drops' && <TrendingUp size={12} className="text-emerald-500" />}
                      <span>{displayLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </header>

        {/* CONTAINER MAIN WINDOW AREA */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="animate-fade-in py-2">
            {children}
          </div>
        </main>
      </div>

      {/* MOBILE STICKY BOTTOM NAV BAR (< 1024px) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 px-4 py-2 flex items-center justify-around z-40 shadow-lg">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = view === key && !alertsOpen;
          return (
            <button
              key={key}
              onClick={() => {
                onViewChange(key);
                if (alertsOpen) onAlertsToggle();
              }}
              className={clsx(
                'flex flex-col items-center gap-1.5 py-1 px-3 rounded-xl transition-all relative',
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              )}
            >
              <Icon size={18} />
              <span className="text-[10px] tracking-tight">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
