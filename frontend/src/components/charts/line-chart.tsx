'use client';

interface LineChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; color: string }[];
  height?: number;
  formatValue?: (v: number) => string;
}

export default function LineChart({ labels, datasets, height = 220, formatValue }: LineChartProps) {
  if (!labels.length) return <div className="flex items-center justify-center text-slate-500 text-sm" style={{ height }}>Sem dados</div>;

  const allValues = datasets.flatMap((d) => d.data);
  const maxVal = Math.max(...allValues, 1);
  const padding = { top: 10, bottom: 30, left: 0, right: 0 };
  const chartW = 600;
  const chartH = height;
  const areaW = chartW - padding.left - padding.right;
  const areaH = chartH - padding.top - padding.bottom;

  const yTicks = 4;
  const fmt = formatValue || ((v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)));

  const pointsToD = (data: number[]) => {
    if (!data.length) return '';
    return data
      .map((val, i) => {
        const x = padding.left + (areaW / (labels.length - 1 || 1)) * i;
        const y = padding.top + areaH - (maxVal > 0 ? (val / maxVal) * areaH : 0);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  };

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ maxHeight: height }}>
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const y = padding.top + (areaH / yTicks) * i;
        const val = maxVal - (maxVal / yTicks) * i;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={chartW - padding.right} y2={y} stroke="#1e293b" strokeWidth={1} />
            <text x={0} y={y + 4} fill="#64748b" fontSize={10} textAnchor="start">
              {fmt(val)}
            </text>
          </g>
        );
      })}

      {labels.map((label, i) => (
        <text key={i} x={padding.left + (areaW / (labels.length - 1 || 1)) * i} y={chartH - 6} fill="#64748b" fontSize={10} textAnchor="middle">
          {label}
        </text>
      ))}

      {datasets.map((ds, idx) => (
        <g key={idx}>
          <path d={pointsToD(ds.data)} fill="none" stroke={ds.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          {ds.data.map((val, i) => {
            const cx = padding.left + (areaW / (labels.length - 1 || 1)) * i;
            const cy = padding.top + areaH - (maxVal > 0 ? (val / maxVal) * areaH : 0);
            return <circle key={i} cx={cx} cy={cy} r={3} fill={ds.color} />;
          })}
        </g>
      ))}
    </svg>
  );
}
