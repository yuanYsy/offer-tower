import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Props {
  // 8 个轴：标签 + 数值 0-100
  axes: { label: string; value: number }[];
  size?: number;
}

// 纯 SVG 手绘雷达图（八边形），无图表库
export default function RadarChart({ axes, size = 320 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 46; // 留出标签空间
  const n = axes.length;

  const pointAt = (i: number, r: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2; // 从正上方开始
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as const;
  };

  // 数据多边形顶点
  const dataPoints = useMemo(
    () =>
      axes
        .map((a, i) => pointAt(i, (Math.max(0, Math.min(100, a.value)) / 100) * R).join(','))
        .join(' '),
    [axes, R, n, cx, cy],
  );

  const ring = (ratio: number) =>
    axes.map((_, i) => pointAt(i, R * ratio).join(',')).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* 网格环 */}
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <polygon
          key={r}
          points={ring(r)}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {/* 轴线 */}
      {axes.map((_, i) => {
        const [x, y] = pointAt(i, R);
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" />
        );
      })}
      {/* 数据多边形 */}
      <motion.polygon
        points={dataPoints}
        fill="rgba(34,211,238,0.18)"
        stroke="#22D3EE"
        strokeWidth="2"
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: `${cx}px`, originY: `${cy}px` }}
      />
      {/* 数据点 */}
      {axes.map((a, i) => {
        const [x, y] = pointAt(i, (Math.max(0, Math.min(100, a.value)) / 100) * R);
        return <circle key={i} cx={x} cy={y} r="3.5" fill="#22D3EE" />;
      })}
      {/* 轴标签 */}
      {axes.map((a, i) => {
        const [x, y] = pointAt(i, R + 26);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fill={a.value < 50 ? '#FB7185' : '#94A3B8'}
          >
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}
