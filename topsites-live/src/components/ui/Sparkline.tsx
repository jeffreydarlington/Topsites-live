
import React from 'react';

interface SparklineProps {
  data: number[];
}

export const Sparkline: React.FC<SparklineProps> = ({ data }) => {
  if (!data || data.length < 2) {
    return null;
  }

  const width = 96;
  const height = 34;

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height;

      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-cyan-400"
      role="img"
      aria-label="Sparkline chart"
    >
      <polyline
        points={points}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};
