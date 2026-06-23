'use client';
import {ExternalLink} from 'lucide-react';
import {useTranslations} from 'next-intl';
import Badge from '@/components/ui/Badge';
import type {AlertItem, Locale} from '@/types/pricewatch';
import {formatDate} from '@/lib/pricewatch/utils';
export default function AlertsList({alerts, locale}: {alerts: AlertItem[]; locale: Locale}) { const t = useTranslations('alerts'); return <section className="pw-panel pw-alerts-list"><div className="pw-section-head"><div><p className="pw-eyebrow">{t('eyebrow')}</p><h2>{t('title')}</h2></div></div><div className="pw-alert-items">{alerts.map((alert) => <a key={alert.id} className="pw-alert-item" href={alert.url} target="_blank" rel="noreferrer noopener"><div className="pw-alert-meta"><Badge tone={alert.severity === 'recall' ? 'red' : alert.severity === 'warning' ? 'amber' : 'green'}>{t(`severity.${alert.severity}`)}</Badge><span>{formatDate(alert.date, locale)}</span></div><div className="pw-alert-title-row"><h3>{alert.title[locale]}</h3><ExternalLink size={14} /></div><p>{t('source')}</p></a>)}</div></section>; }
