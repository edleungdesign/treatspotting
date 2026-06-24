import React from 'react';
import clsx from 'clsx';

interface PriceBadgeProps {
  price: number;
  prevPrice?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceBadge({ price, prevPrice, className, size = 'md' }: PriceBadgeProps) {
  const formattedPrice = price.toFixed(1);
  const formattedPrevPrice = prevPrice?.toFixed(1);
  
  // Calculate discount percent
  const discountPercent = prevPrice && prevPrice > price
    ? Math.round(((prevPrice - price) / prevPrice) * 100)
    : 0;

  return (
    <div
      id={`price-badge-${price}`}
      className={clsx('inline-flex flex-col items-start gap-0.5', className)}
    >
      <div className="flex items-baseline gap-1.5">
        <span
          className={clsx('font-extrabold text-slate-900 dark:text-white tracking-tight', {
            'text-sm': size === 'sm',
            'text-lg': size === 'md',
            'text-2xl': size === 'lg',
          })}
        >
          <span className="text-xs font-semibold mr-0.5">$</span>
          {formattedPrice}
        </span>

        {prevPrice && prevPrice > price && (
          <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-medium">
            ${formattedPrevPrice}
          </span>
        )}
      </div>

      {discountPercent > 0 && (
        <span className="inline-flex items-center rounded bg-rose-100 dark:bg-rose-950/40 px-1 py-0.2 text-[10px] font-bold text-rose-700 dark:text-rose-400">
          -{discountPercent}% OFF
        </span>
      )}
    </div>
  );
}
