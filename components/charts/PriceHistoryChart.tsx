'use client';
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import type {PriceHistoryPoint} from '@/types/pricewatch';
export default function PriceHistoryChart({data}: {data: PriceHistoryPoint[]}) { return <div className="pw-history-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><XAxis dataKey="date" minTickGap={24} /><YAxis width={44} /><Tooltip /><Line type="monotone" dataKey="price" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer></div>; }
