import type { Product, AlertItem, StoreName } from '@/types/pricewatch';

export function filterProducts(
  products: Product[],
  query: string,
  category: string,
  store: string
): Product[] {
  const normQuery = query.toLowerCase().trim();
  
  return products.filter((product) => {
    // Search filter
    if (normQuery) {
      const nameEn = product.name.en.toLowerCase();
      const nameZh = product.name['zh-Hant'].toLowerCase();
      const brandEn = product.brand.en.toLowerCase();
      const brandZh = product.brand['zh-Hant'].toLowerCase();
      const code = product.code;

      const matchesSearch =
        nameEn.includes(normQuery) ||
        nameZh.includes(normQuery) ||
        brandEn.includes(normQuery) ||
        brandZh.includes(normQuery) ||
        code.includes(normQuery);

      if (!matchesSearch) return false;
    }

    // Category filter
    if (category && category !== 'all' && product.category !== category) {
      return false;
    }

    // Store filter
    if (store && store !== 'all') {
      const hasStore = product.prices.some((p) => p.store === store);
      if (!hasStore) return false;
    }

    return true;
  });
}

export interface CategorySummary {
  category: string;
  itemCount: number;
  avgDelta: number; // average % saving from prevPrice to current price
  cheapestStore: StoreName;
}

export function getCategorySummaries(products: Product[]): CategorySummary[] {
  const categoriesMap: Record<string, { prices: number[]; deltas: number[]; storeCounts: Record<StoreName, number> }> = {};

  products.forEach((p) => {
    if (!categoriesMap[p.category]) {
      categoriesMap[p.category] = { prices: [], deltas: [], storeCounts: {} as Record<StoreName, number> };
    }
    const catObj = categoriesMap[p.category];

    // Count items
    catObj.prices.push(p.cheapestPrice);

    // Save cheapest store count
    const chStore = p.cheapestStore;
    catObj.storeCounts[chStore] = (catObj.storeCounts[chStore] || 0) + 1;

    // Calculate saving delta
    p.prices.forEach((sp) => {
      if (sp.prevPrice && sp.prevPrice > sp.price) {
        const deltaPct = ((sp.prevPrice - sp.price) / sp.prevPrice) * 100;
        catObj.deltas.push(deltaPct);
      }
    });
  });

  return Object.keys(categoriesMap).map((catName) => {
    const catObj = categoriesMap[catName];
    
    // Determine average delta
    const avgDelta = catObj.deltas.length > 0 
      ? catObj.deltas.reduce((a, b) => a + b, 0) / catObj.deltas.length 
      : 0;

    // Determine cheapest store for this category
    let bestStore: StoreName = 'WELLCOME';
    let maxCount = -1;
    (Object.keys(catObj.storeCounts) as StoreName[]).forEach((store) => {
      if (catObj.storeCounts[store] > maxCount) {
        maxCount = catObj.storeCounts[store];
        bestStore = store;
      }
    });

    return {
      category: catName,
      itemCount: catObj.prices.length,
      avgDelta: Math.round(avgDelta * 10) / 10,
      cheapestStore: bestStore
    };
  });
}

export interface DashboardStats {
  trackedCount: number;
  priceDropsCount: number;
  avgSavingPercent: number;
  foodAlertsCount: number;
}

export function getDashboardStats(products: Product[], alerts: AlertItem[]): DashboardStats {
  const tracked = products.filter((p) => p.watched);
  const trackedCount = tracked.length;

  // Items currently exhibiting a price drop
  let priceDropsCount = 0;
  let totalSavingsPct = 0;
  let savingsCount = 0;

  products.forEach((p) => {
    let hasDrop = false;
    p.prices.forEach((sp) => {
      if (sp.prevPrice && sp.prevPrice > sp.price) {
        hasDrop = true;
        const savingPct = ((sp.prevPrice - sp.price) / sp.prevPrice) * 100;
        totalSavingsPct += savingPct;
        savingsCount++;
      }
    });
    if (hasDrop) {
      priceDropsCount++;
    }
  });

  const avgSavingPercent = savingsCount > 0 
    ? Math.round((totalSavingsPct / savingsCount) * 10) / 10 
    : 0;

  const foodAlertsCount = alerts.filter(a => a.severity === 'recall' || a.severity === 'warning').length;

  return {
    trackedCount,
    priceDropsCount,
    avgSavingPercent,
    foodAlertsCount
  };
}

export function formatDate(dateString: string, locale: 'en' | 'zh-Hant'): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    if (locale === 'zh-Hant') {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}
