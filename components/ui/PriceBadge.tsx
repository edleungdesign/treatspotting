import clsx from 'clsx';
export default function PriceBadge({label, tone = 'neutral'}: {label: string; tone?: 'success' | 'warning' | 'neutral'}) { return <span className={clsx('pw-price-badge', `is-${tone}`)}>{label}</span>; }
