import clsx from 'clsx';
import {ArrowDown, ArrowRight, ArrowUp} from 'lucide-react';
import type {TrendDirection} from '@/types/pricewatch';
const icons = {up: ArrowUp, down: ArrowDown, flat: ArrowRight};
export default function TrendChip({direction, value}: {direction: TrendDirection; value: string}) { const Icon = icons[direction]; return <span className={clsx('pw-trend-chip', `is-${direction}`)}><Icon size={14} />{value}</span>; }
