import { XMLParser } from 'fast-xml-parser';
import type { AlertItem } from '@/types/pricewatch';
import { mockAlerts } from '@/lib/pricewatch/mock';

export async function fetchFoodAlerts(): Promise<AlertItem[]> {
  try {
    const [enRes, zhRes] = await Promise.all([
      fetch('https://www.cfs.gov.hk/filemanager/foodalert/english/foodalert_datagovhk.xml', {
        next: { revalidate: 3600 }, // cache for 1 hour
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }),
      fetch('https://www.cfs.gov.hk/filemanager/foodalert/tc_chi/foodalert_datagovhk.xml', {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000)
      })
    ]);

    if (!enRes.ok || !zhRes.ok) {
      console.warn('CFS Food Alerts returned non-ok status. Using fallback.');
      return mockAlerts;
    }

    const enXml = await enRes.text();
    const zhXml = await zhRes.text();

    const parser = new XMLParser({
      ignoreAttributes: true,
      trimValues: true,
      parseTagValue: false
    });

    const enData = parser.parse(enXml);
    const zhData = parser.parse(zhXml);

    const getRecords = (data: any) => {
      const root = data?.foodalert_datagovhk;
      if (!root) return [];
      const record = root.record || root.Record;
      if (!record) return [];
      return Array.isArray(record) ? record : [record];
    };

    const enRecords = getRecords(enData);
    const zhRecords = getRecords(zhData);

    const alerts: AlertItem[] = [];
    const maxLen = Math.max(enRecords.length, zhRecords.length);

    for (let i = 0; i < maxLen; i++) {
      const enRec = enRecords[i] || {};
      const zhRec = zhRecords[i] || {};

      // Match records by ID if possible, otherwise use index-based alignment
      const rawId = enRec.id || zhRec.id || `alert-${i}`;
      const date = enRec.date || zhRec.date || new Date().toISOString().split('T')[0];
      const titleEn = enRec.title || enRec.headline || 'Food Safety Alert';
      const titleZh = zhRec.title || zhRec.headline || '食物安全警示';
      const url = enRec.detail_url || enRec.url || zhRec.detail_url || zhRec.url || 'https://www.cfs.gov.hk';

      let severity: 'recall' | 'warning' | 'notice' = 'notice';
      const lowerEn = String(titleEn).toLowerCase();
      const lowerZh = String(titleZh).toLowerCase();

      if (
        lowerEn.includes('recall') ||
        lowerZh.includes('召回') ||
        lowerZh.includes('回收')
      ) {
        severity = 'recall';
      } else if (
        lowerEn.includes('warn') ||
        lowerEn.includes('alert') ||
        lowerZh.includes('警告') ||
        lowerZh.includes('呼籲')
      ) {
        severity = 'warning';
      }

      alerts.push({
        id: String(rawId),
        severity,
        date: String(date),
        title: {
          en: String(titleEn),
          'zh-Hant': String(titleZh)
        },
        url: String(url)
      });
    }

    if (alerts.length === 0) {
      return mockAlerts;
    }

    // Sort by date descending
    return alerts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 15);
  } catch (error) {
    console.error('Failed to fetch live CFS alerts, using mock alerts fallback:', error);
    return mockAlerts;
  }
}
