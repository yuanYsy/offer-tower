import { useId, useMemo } from 'react';
import type { CSSProperties } from 'react';

// 全息星球：珍珠/玻璃质感球体 + 多层环绕发光光带 + 星尘 + 顶部耀斑
// 可嵌入任意父 <svg>（传 x / y）或独立作为 <svg> 使用（传 size）

const VB = 240;
const C = VB / 2;
const RY = 0.3; // 光带扁平比（俯视倾斜角）

/** 每层星球的主题色（1F → 8F）：冷 → 暖 → 炽白，越往上越夺目，形成绚染 */
export const PLANET_HUES = [
  '#4FD6FF', // 1F 语法回廊 · 天青
  '#8B5CF6', // 2F 分布式迷城 · 靛紫
  '#34D399', // 3F 数据深渊 · 翠绿
  '#FF5CD2', // 4F AI 炼金工坊 · 品红
  '#FFC53D', // 5F 项目档案室 · 金黄
  '#D6E6F5', // 6F 机械工坊 · 银白
  '#FF7A45', // 7F 危机控制室 · 橙红
  '#FF3D8B', // 8F 最终面试厅 · 玫红
];

export interface HoloPlanetProps {
  /** 渲染尺寸（正方形，px） */
  size?: number;
  /** 嵌入父 svg 时的左上角坐标（用户坐标系） */
  x?: number;
  y?: number;
  /** 主题色相 */
  hue?: string;
  /** 环绕光带层数（0 = 只留珍珠球体，用于星门核心） */
  rings?: number;
  /** 亮度系数 0-1（锁定态压暗） */
  dim?: number;
  /** 是否播放流动 / 闪烁动画 */
  live?: boolean;
  /** 顶部耀斑 */
  flare?: boolean;
  className?: string;
  style?: CSSProperties;
}

function RingBand({
  uid,
  hue,
  rx,
  dim,
  live,
  delay,
  front,
}: {
  uid: string;
  hue: string;
  rx: number;
  dim: number;
  live: boolean;
  delay: number;
  front?: boolean;
}) {
  const ry = rx * RY;
  return (
    <g>
      {/* 背侧：宽而虚的辉光 */}
      {!front && (
        <ellipse
          cx={C}
          cy={C}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={hue}
          strokeWidth={rx * 0.18}
          strokeOpacity={0.16 * dim}
          filter={`url(#${uid}m)`}
        />
      )}
      {/* 光带主体（白 → 主题色 渐变） */}
      <ellipse
        cx={C}
        cy={C}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={`url(#${uid}r)`}
        strokeWidth="3.6"
        strokeOpacity={0.9 * dim}
      />
      {/* 细碎珠链 */}
      <ellipse
        cx={C}
        cy={C}
        rx={rx}
        ry={ry}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeOpacity={0.45 * dim}
        strokeDasharray="14 30"
      />
      {/* 外缘细丝（多层丝带感） */}
      <ellipse
        cx={C}
        cy={C}
        rx={rx + 4}
        ry={(rx + 4) * RY}
        fill="none"
        stroke={hue}
        strokeWidth="1.3"
        strokeOpacity={0.55 * dim}
        strokeDasharray="6 40"
      />
      {/* 流动亮弧 */}
      {live && (
        <ellipse
          cx={C}
          cy={C}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.4"
          strokeOpacity={0.9 * dim}
          strokeDasharray="74 430"
          strokeLinecap="round"
          className="planet-flow"
          style={{ animationDelay: `${delay}s` }}
        />
      )}
    </g>
  );
}

export default function HoloPlanet({
  size = 200,
  x,
  y,
  hue = '#8FD4F0',
  rings = 4,
  dim = 1,
  live = true,
  flare = true,
  className,
  style,
}: HoloPlanetProps) {
  // 同页多实例：隔离渐变 / 滤镜 id
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  const ringRx = (i: number) => 58 + (i / Math.max(rings - 1, 1)) * 46;

  // 沿光带散布的星尘（确定性伪随机，避免每次渲染跳动）
  const sparks = useMemo(() => {
    if (rings <= 0) return [];
    const out: { x: number; y: number; r: number; c: string; d: number; o: number }[] = [];
    for (let i = 0; i < 28; i++) {
      const rx = ringRx(i % rings);
      const a = i * 2.39996; // 黄金角，保证均匀铺开
      const jx = (((i * 37) % 11) / 11 - 0.5) * 26;
      const jy = (((i * 53) % 13) / 13 - 0.5) * 9;
      out.push({
        x: C + Math.cos(a) * rx + jx,
        y: C + Math.sin(a) * (rx * RY) + jy,
        r: i % 8 === 0 ? 2.1 : i % 4 === 0 ? 1.5 : 1,
        c: i % 5 === 0 ? '#FFE9A8' : i % 3 === 0 ? hue : '#FFFFFF',
        d: (i % 7) * 0.45,
        o: 0.45 + (i % 5) * 0.12,
      });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rings, hue]);

  return (
    <svg
      x={x}
      y={y}
      width={size}
      height={size}
      viewBox={`0 0 ${VB} ${VB}`}
      overflow="visible"
      className={className}
      style={{ display: 'block', ...style }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`${uid}h`} cx="50%" cy="48%" r="50%">
          <stop offset="0%" stopColor={hue} stopOpacity={0.34 * dim} />
          <stop offset="45%" stopColor={hue} stopOpacity={0.14 * dim} />
          <stop offset="100%" stopColor={hue} stopOpacity="0" />
        </radialGradient>
        {/* 珍珠玻璃球体：冷白核 → 主题色 → 暗边缘 */}
        <radialGradient id={`${uid}o`} cx="40%" cy="24%" r="82%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.98 * dim} />
          <stop offset="26%" stopColor="#EAF6FF" stopOpacity={0.94 * dim} />
          <stop offset="48%" stopColor={hue} stopOpacity={0.9 * dim} />
          <stop offset="74%" stopColor={hue} stopOpacity={0.7 * dim} />
          <stop offset="100%" stopColor="#07141F" stopOpacity={0.96 * dim} />
        </radialGradient>
        {/* 底部反弹光 */}
        <radialGradient id={`${uid}b`} cx="34%" cy="86%" r="54%">
          <stop offset="0%" stopColor={hue} stopOpacity={0.42 * dim} />
          <stop offset="100%" stopColor={hue} stopOpacity="0" />
        </radialGradient>
        {/* 光带横向渐变 */}
        <linearGradient id={`${uid}r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
          <stop offset="22%" stopColor="#EAF8FF" stopOpacity={0.95 * dim} />
          <stop offset="50%" stopColor={hue} stopOpacity={0.8 * dim} />
          <stop offset="78%" stopColor="#FFFFFF" stopOpacity={0.95 * dim} />
          <stop offset="100%" stopColor={hue} stopOpacity="0.12" />
        </linearGradient>
        {/* 顶部耀斑（金 → 白 → 透明） */}
        <radialGradient id={`${uid}f`} cx="50%" cy="74%" r="62%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95 * dim} />
          <stop offset="30%" stopColor="#FFE9A8" stopOpacity={0.72 * dim} />
          <stop offset="62%" stopColor={hue} stopOpacity={0.28 * dim} />
          <stop offset="100%" stopColor={hue} stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}s`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <filter id={`${uid}m`} x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        {/* 前侧光带裁剪：只保留球体下半（形成环绕穿插） */}
        <clipPath id={`${uid}c`}>
          <rect x="0" y={C + 2} width={VB} height={VB} />
        </clipPath>
      </defs>

      {/* 1. 外层光晕 */}
      <circle cx={C} cy={C} r="116" fill={`url(#${uid}h)`} />

      {/* 2. 背侧光带 */}
      {rings > 0 && (
        <g transform={`rotate(-6 ${C} ${C})`}>
          {Array.from({ length: rings }).map((_, i) => (
            <RingBand
              key={`b${i}`}
              uid={uid}
              hue={hue}
              rx={ringRx(i)}
              dim={dim}
              live={live}
              delay={i * -1.7}
            />
          ))}
        </g>
      )}

      {/* 3. 珍珠球体 */}
      <g>
        <circle cx={C} cy={C} r="45" fill={`url(#${uid}o)`} />
        <circle cx={C} cy={C} r="45" fill={`url(#${uid}b)`} />
        {/* 内部折射纹理 */}
        <ellipse
          cx={C - 8}
          cy={C + 8}
          rx="30"
          ry="15"
          fill="#FFFFFF"
          opacity={0.1 * dim}
          transform={`rotate(-18 ${C} ${C})`}
          filter={`url(#${uid}s)`}
        />
        <path
          d={`M${C - 30},${C - 12} Q${C - 4},${C - 32} ${C + 22},${C - 16}`}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity={0.34 * dim}
          strokeWidth="1.6"
          filter={`url(#${uid}s)`}
        />
        <path
          d={`M${C - 26},${C + 18} Q${C - 2},${C + 32} ${C + 24},${C + 14}`}
          fill="none"
          stroke={hue}
          strokeOpacity={0.36 * dim}
          strokeWidth="1.6"
          filter={`url(#${uid}s)`}
        />
        {/* 顶部镜面高光 */}
        <ellipse
          cx={C - 12}
          cy={C - 25}
          rx="15"
          ry="9"
          fill="#FFFFFF"
          opacity={0.9 * dim}
          transform={`rotate(-26 ${C - 12} ${C - 25})`}
          filter={`url(#${uid}s)`}
        />
        <circle cx={C - 20} cy={C - 32} r="3.4" fill="#FFFFFF" opacity={0.95 * dim} />
        {/* 边缘环 */}
        <circle cx={C} cy={C} r="45" fill="none" stroke="#EAF7FF" strokeOpacity={0.34 * dim} strokeWidth="1.2" />
        <circle
          cx={C}
          cy={C}
          r="49"
          fill="none"
          stroke={hue}
          strokeOpacity={0.22 * dim}
          strokeWidth="1"
          filter={`url(#${uid}s)`}
        />
      </g>

      {/* 4. 前侧光带（掠过球体下半） */}
      {rings > 0 && (
        <g clipPath={`url(#${uid}c)`}>
          <g transform={`rotate(-6 ${C} ${C})`}>
            {Array.from({ length: rings }).map((_, i) => (
              <RingBand
                key={`f${i}`}
                uid={uid}
                hue={hue}
                rx={ringRx(i)}
                dim={dim}
                live={live}
                delay={i * -1.7}
                front
              />
            ))}
          </g>
        </g>
      )}

      {/* 5. 星尘 */}
      {sparks.map((s, i) => (
        <circle
          key={`s${i}`}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={s.c}
          opacity={s.o * dim}
          className={live ? 'planet-spark' : undefined}
          style={live ? { animationDelay: `${s.d}s` } : undefined}
        />
      ))}

      {/* 6. 顶部耀斑 + 十字星芒 */}
      {flare && (
        <g className={live ? 'planet-flare' : undefined}>
          <ellipse cx={C} cy={C - 52} rx="38" ry="28" fill={`url(#${uid}f)`} />
          <rect
            x={C - 2.6}
            y={C - 94}
            width="5.2"
            height="52"
            rx="2.6"
            fill="#FFF7DC"
            opacity={0.42 * dim}
            filter={`url(#${uid}m)`}
          />
          <path
            d={`M${C},${C - 84} L${C + 3.2},${C - 58} L${C},${C - 34} L${C - 3.2},${C - 58} Z`}
            fill="#FFFFFF"
            opacity={0.9 * dim}
          />
          <path
            d={`M${C - 26},${C - 58} L${C},${C - 55} L${C + 26},${C - 58} L${C},${C - 61} Z`}
            fill="#FFFFFF"
            opacity={0.72 * dim}
          />
        </g>
      )}
    </svg>
  );
}
