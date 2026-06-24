import React from 'react';
import { ExternalLink, ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/pricewatch/utils';
import type { AlertItem, Locale } from '@/types/pricewatch';

interface AlertsListProps {
  alerts: AlertItem[];
  locale: Locale;
  fromLive?: boolean;
}

export default function AlertsList({ alerts, locale, fromLive = true }: AlertsListProps) {
  const t = useTranslations('alerts');

  const getAlertIcon = (severity: 'recall' | 'warning' | 'notice') => {
    switch (severity) {
      case 'recall':
        return <ShieldAlert className="text-rose-500 shrink-0" size={18} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500 shrink-0" size={18} />;
      default:
        return <Info className="text-slate-400 shrink-0" size={18} />;
    }
  };

  const getBadgeColor = (severity: 'recall' | 'warning' | 'notice') => {
    switch (severity) {
      case 'recall':
        return 'red';
      case 'warning':
        return 'amber';
      default:
        return 'blue';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6" id="alerts-list">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {t('title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('subtitle')}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {fromLive ? 'Live CFS Feed' : 'Cached Feed'}
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('empty')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="group relative flex flex-col p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.severity)}
                  <Badge tone={getBadgeColor(alert.severity)}>
                    {t(`severity.${alert.severity}`)}
                  </Badge>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {formatDate(alert.date, locale)}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mb-3 leading-snug tracking-tight group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                {alert.title[locale] || alert.title.en}
              </h3>

              <div className="flex items-center mt-auto pt-2 border-t border-slate-50 dark:border-slate-800/40">
                <a
                  href={alert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  {t('link')}
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
