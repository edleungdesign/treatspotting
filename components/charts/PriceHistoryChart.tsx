'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import type { Product, StoreName } from '@/types/pricewatch';

interface PriceHistoryChartProps {
  product: Product;
  range: '7D' | '30D' | '90D';
  locale: 'en' | 'zh-Hant';
}

const STORE_COLORS: Record<StoreName, string> = {
  WELLCOME: '#f43f5e',   // Rose
  PARKNSHOP: '#2563eb',  // Blue
  TASTE: '#10b981',      // Emerald
  AEON: '#9333ea',       // Purple
  HKTVMALL: '#ea580c'    // Orange
};

export default function PriceHistoryChart({ product, range, locale }: PriceHistoryChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const chartData = useMemo(() => {
    const pointsCount = range === '7D' ? 7 : range === '30D' ? 15 : 30;
    const now = new Date();
    const dataList = [];

    // Base price configurations per store for this product
    const storeBases = product.prices.reduce((acc, sp) => {
      acc[sp.store] = {
        price: sp.price,
        prevPrice: sp.prevPrice || sp.price
      };
      return acc;
    }, {} as Record<StoreName, { price: number; prevPrice: number }>);

    for (let i = pointsCount - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i * (range === '7D' ? 1 : range === '30D' ? 2 : 3));
      
      const dateString = locale === 'zh-Hant'
        ? `${date.getMonth() + 1}/${date.getDate()}`
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dataPoint: any = { date: dateString };

      // Generate a simulated but consistent history point per store
      product.prices.forEach((sp) => {
        const store = sp.store;
        const currentPrice = sp.price;
        const prevPrice = sp.prevPrice || currentPrice;

        // Smoothly slide from original price to current price
        const ratio = (pointsCount - 1 - i) / (pointsCount - 1);
        const interpolated = prevPrice + (currentPrice - prevPrice) * ratio;

        // Add a small sine wave oscillation for historical flavor
        const wave = Math.sin(i * 0.8 + store.charCodeAt(0)) * (currentPrice * 0.015);
        dataPoint[store] = Math.round((interpolated + wave) * 10) / 10;
      });

      dataList.push(dataPoint);
    }

    return dataList;
  }, [product, range, locale]);

  if (!mounted) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/10 rounded-xl border border-slate-100 dark:border-slate-800 animate-pulse">
        <span className="text-xs text-slate-400 font-medium">Loading historical trend...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-64 mt-4 bg-white dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="opacity-40 dark:stroke-slate-800" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            axisLine={false} 
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            axisLine={false} 
            tickLine={false}
            domain={['dataMin - 1', 'dataMax + 1']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }}
          />
          
          {product.prices.map((sp) => (
            <Line
              key={sp.store}
              type="monotone"
              dataKey={sp.store}
              name={sp.store === 'WELLCOME' ? 'Wellcome' : sp.store === 'PARKNSHOP' ? 'PNS' : sp.store}
              stroke={STORE_COLORS[sp.store] || '#64748b'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
