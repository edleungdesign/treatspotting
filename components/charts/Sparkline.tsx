'use client';
import {Line, LineChart, ResponsiveContainer} from 'recharts';
import type {PriceHistoryPoint} from '@/types/pricewatch';
export default function Sparkline({data}: {data: PriceHistoryPoint[]}) { return <div className="pw-sparkline" aria-hidden="true"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><Line type="monotone" dataKey="price" stroke="var(--color-primary)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>; }
