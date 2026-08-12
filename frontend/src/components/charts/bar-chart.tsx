'use client';

interface ChartDataset {
  label: string;
  data: number[];
  color: string;
}

interface BarChartProps {
  labels: string[];
  datasets: ChartDataset[];
  height?: number;
}

export default function BarChart({ labels, datasets, height = 220 }: BarChartProps) {
  if (!labels.length) return <div className="flex items-center justify-center text-slate-500 text-sm" style={{ height }}>Sem dados</div>;

  const allValues = datasets.flatMap((d) => d.data);
  const maxVal = Math.max(...allValues, 1);
  const padding = { top: 20, bottom: 30, left: 0, right: 0 };
  const chartW = 600;
  const chartH = height;
  const barAreaW = chartW - padding.left - padding.right;
  const barAreaH = chartH - padding.top - padding.bottom;
  const groupWidth = barAreaW / labels.length;
  const barWidth = (groupWidth * 0.7) / datasets.length;
  const barGap = groupWidth * 0.3 / (datasets.length + 1);

  const yTicks = 4;
  const formatValue = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
    return String(v);
  };

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ maxHeight: height }}>
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const y = padding.top + (barAreaH / yTicks) * i;
        const val = maxVal - (maxVal / yTicks) * i;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={chartW - padding.right} y2={y} stroke="#1e293b" strokeWidth={1} />
            <text x={0} y={y + 4} fill="#64748b" fontSize={10} textAnchor="start">
              {formatValue(val)}
            </text>
          </g>
        );
      })}

      {labels.map((label, i) => {
        const x = padding.left + groupWidth * i;
        return (
          <text key={i} x={x + groupWidth / 2} y={chartH - 6} fill="#64748b" fontSize={10} textAnchor="middle">
            {label}
          </text>
        );
      })}

      {datasets.map((ds, dsIdx) =>
        ds.data.map((val, i) => {
          const barH = maxVal > 0 ? (val / maxVal) * barAreaH : 0;
          const x = padding.left + groupWidth * i + barGap * (dsIdx + 1) + barWidth * dsIdx;
          const y = padding.top + barAreaH - barH;
          return (
            <rect key={`${dsIdx}-${i}`} x={x} y={y} width={barWidth} height={Math.max(barH, 2)} rx={3} fill={ds.color} opacity={0.85} />
          );
        }),
      )}
    </svg>
  );
}
