export type Locale = 'en' | 'zh-Hant';
export type ViewName = 'dashboard' | 'results' | 'watchlist' | 'categories';
export type StoreName = 'WELLCOME' | 'PARKNSHOP' | 'TASTE' | 'AEON' | 'HKTVMALL' | 'JASONS' | 'LUNGFUNG' | 'DCHFOOD' | 'WATSONS' | 'MANNINGS' | 'SASA';

export interface StorePrice {
  store: StoreName;
  price: number;
  prevPrice?: number;
  offer?: string;
}

export interface Product {
  id: string;
  code: string;
  name: Record<Locale, string>;
  brand: Record<Locale, string>;
  category: string;
  category1?: Record<Locale, string>;
  category2?: Record<Locale, string>;
  category3?: Record<Locale, string>;
  prices: StorePrice[];
  sparkline: number[];
  watched: boolean;
  cheapestStore: StoreName;
  cheapestPrice: number;
  priceSpread: number;
  trend: 'up' | 'down' | 'stable';
  offerBadge?: string;
}

export interface AlertItem {
  id: string;
  severity: 'recall' | 'warning' | 'notice';
  date: string;
  title: Record<Locale, string>;
  url: string;
}

export type HistoryRange = '7D' | '30D' | '90D';
export type WatchlistFilter = 'all' | 'drops' | 'offers' | 'lowest90' | 'shared';
