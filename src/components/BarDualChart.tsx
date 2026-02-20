import React from 'react';

interface BarDualChartProps {
  months: string[]; // e.g., ['Jan',...,'Dec']
  seriesA: number[]; // climate
  seriesB: number[]; // societal
  colorA?: string;
  colorB?: string;
  valueColorA?: string; // value labels for A
  valueColorB?: string; // value labels for B
  height?: number;
  width?: number;
  barWidthScale?: number; // 0..1, default 0.5
  showValues?: boolean;
}

const BarDualChart: React.FC<BarDualChartProps> = ({ months, seriesA, seriesB, colorA = '#2F8F83', colorB = '#D97706', valueColorA = '#333333', valueColorB = '#333333', height = 360, width = 980, barWidthScale = 0.6, showValues = true }) => {
  const padding = { left: 40, right: 20, top: 20, bottom: 30 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const n = months.length;
  const groupW = innerW / n;
  const barW = Math.max(12, groupW * barWidthScale * 0.45);

  const maxVal = Math.max(
    ...seriesA.map(v => Math.abs(v)),
    ...seriesB.map(v => Math.abs(v))
  );
  const headroom = 12; // keep tallest bars from touching top
  const scaleY = (v: number) => {
    const ratio = maxVal > 0 ? Math.abs(v) / maxVal : 0;
    return ratio * (innerH - headroom);
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="dual-bar-chart" style={{ width: '100%', height }}>
      <rect x={padding.left} y={padding.top} width={innerW} height={innerH} fill="#fff" stroke="#e6eef9" />
      {months.map((m, i) => {
        const x0 = padding.left + i * groupW + groupW * 0.1;
        const aH = scaleY(seriesA[i] || 0);
        const bH = scaleY(seriesB[i] || 0);
        const aX = x0;
        const bX = x0 + barW + 4;
        const aY = padding.top + innerH - aH;
        const bY = padding.top + innerH - bH;
        return (
          <g key={i}>
            <rect x={aX} y={aY} width={barW} height={aH} fill={colorA} rx={3} />
            {showValues && (
              <text x={aX + barW / 2} y={aY + 14} textAnchor="middle" fontSize={10} fill={valueColorA}>{(seriesA[i] ?? 0).toFixed(0)}</text>
            )}
            <rect x={bX} y={bY} width={barW} height={bH} fill={colorB} rx={3} />
            {showValues && (
              <text x={bX + barW / 2} y={bY + 14} textAnchor="middle" fontSize={10} fill={valueColorB}>{(seriesB[i] ?? 0).toFixed(0)}</text>
            )}
            <text x={padding.left + i * groupW + groupW / 2} y={padding.top + innerH + 18} textAnchor="middle" fontSize={11} fill="#334155">{m}</text>
          </g>
        );
      })}
      {/* Axis label removed as requested */}
    </svg>
  );
};

export default BarDualChart;
