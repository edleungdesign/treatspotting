import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  color?: string;
}

export default function Sparkline({
  data,
  width = 80,
  height = 24,
  strokeWidth = 2,
  color,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  // Map values to coordinates
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    // Invert Y so higher value is higher up in height
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return { x, y };
  });

  // Decide stroke color based on overall direction if not overridden
  const startVal = data[0];
  const endVal = data[data.length - 1];
  const strokeColor =
    color || (endVal < startVal ? '#10b981' : endVal > startVal ? '#f43f5e' : '#64748b');

  // Build a smooth cubic bezier path
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    // Control points
    const cpX1 = p0.x + (p1.x - p0.x) / 3;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
    const cpY2 = p1.y;
    path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  return (
    <svg
      id={`sparkline-${data.join('-')}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible inline-block"
    >
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
