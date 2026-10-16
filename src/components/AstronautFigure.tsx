import { useId } from 'react';
import { motion } from 'framer-motion';

export interface AstronautFigureProps {
  /** walk = 背面全身（迈步）；bust = 正面半身（头像框用） */
  pose?: 'walk' | 'bust';
  /** 主题色：目镜反光 / 胸灯 / 服饰条纹 */
  accent?: string;
  /** 裁切方式：头像框内用 slice 铺满 */
  fit?: 'meet' | 'slice';
  className?: string;
}

// 写实风宇航员：白色舱外服 + 加压头盔 + 主题色目镜反光（玩家角色专属形象）
export default function AstronautFigure({
  pose = 'walk',
  accent = '#22D3EE',
  fit = 'meet',
  className = '',
}: AstronautFigureProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  return (
    <svg
      viewBox="0 0 120 150"
      width="100%"
      height="100%"
      preserveAspectRatio={fit === 'slice' ? 'xMidYMid slice' : 'xMidYMid meet'}
      className={className}
      role="img"
      aria-label="宇航员"
    >
      <defs>
        {/* 白色舱外服 */}
        <linearGradient id={`${uid}-suit`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F6F9FF" />
          <stop offset="58%" stopColor="#DCE5F0" />
          <stop offset="100%" stopColor="#A9B9CC" />
        </linearGradient>
        {/* 背包 / 阴影件 */}
        <linearGradient id={`${uid}-pack`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#9DAEC2" />
          <stop offset="100%" stopColor="#6E8098" />
        </linearGradient>
        {/* 头盔壳体 */}
        <radialGradient id={`${uid}-shell`} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E2E9F3" />
          <stop offset="100%" stopColor="#A7B7C9" />
        </radialGradient>
        {/* 目镜玻璃 */}
        <linearGradient id={`${uid}-visor`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#0A1526" />
          <stop offset="60%" stopColor="#13233D" />
          <stop offset="100%" stopColor="#1C3050" />
        </linearGradient>
        {/* 目镜上的主题色反光 */}
        <linearGradient id={`${uid}-refl`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.05" />
        </linearGradient>
        <filter id={`${uid}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      {pose === 'walk' ? (
        /* ===== 背面全身（登塔地图行走姿态） ===== */
        <g>
          {/* 背包 */}
          <rect x="37" y="54" width="46" height="42" rx="11" fill={`url(#${uid}-pack)`} />
          <rect x="37" y="54" width="46" height="42" rx="11" fill="none" stroke="#8395AB" strokeOpacity="0.5" />
          {/* 背包主题色能量条 */}
          <rect x="46" y="64" width="28" height="5" rx="2.5" fill={accent} fillOpacity="0.75" filter={`url(#${uid}-soft)`} />
          <rect x="52" y="74" width="16" height="3" rx="1.5" fill="#C8D4E4" />
          {/* 腿（迈步姿态：左腿前右腿后） */}
          <g fill={`url(#${uid}-suit)`} stroke="#94A6BA" strokeOpacity="0.45" strokeWidth="1">
            <path d="M46,92 L44,124 Q43.5,130 49,130 L54,130 Q58,130 57.5,124 L56,96 Z" />
            <path d="M64,92 L66,120 Q66.5,126 72,126 L76,126 Q80.5,126 80,120 L76,94 Z" />
          </g>
          {/* 靴子 */}
          <g fill="#7E90A6">
            <rect x="42" y="126" width="15" height="9" rx="4" />
            <rect x="64" y="122" width="15" height="9" rx="4" />
          </g>
          {/* 躯干 */}
          <path
            d="M42,54 Q40,52 44,48 L76,48 Q80,52 78,54 L76,96 Q64,102 44,96 Z"
            fill={`url(#${uid}-suit)`}
            stroke="#94A6BA"
            strokeOpacity="0.45"
          />
          {/* 腰部主题色环带 */}
          <rect x="45" y="84" width="30" height="4.5" rx="2.25" fill={accent} fillOpacity="0.6" />
          {/* 手臂（自然下垂微张） */}
          <g fill={`url(#${uid}-suit)`} stroke="#94A6BA" strokeOpacity="0.45" strokeWidth="1">
            <path d="M42,52 C34,56 30,66 30,76 Q30,82 35,82 Q40,82 40,76 L43,60 Z" />
            <path d="M78,52 C86,56 90,66 90,76 Q90,82 85,82 Q80,82 80,76 L77,60 Z" />
          </g>
          {/* 手套 */}
          <circle cx="34.5" cy="80" r="5.5" fill="#7E90A6" />
          <circle cx="85.5" cy="80" r="5.5" fill="#7E90A6" />
          {/* 头盔（背面：纯白壳体 + 顶部反光弧） */}
          <circle cx="60" cy="30" r="23" fill={`url(#${uid}-shell)`} stroke="#93A5B9" strokeOpacity="0.5" />
          <path d="M45,22 Q53,12 66,15" fill="none" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" />
          {/* 头盔通信天线 */}
          <path d="M78,20 L86,10" stroke="#9DAEC2" strokeWidth="2" strokeLinecap="round" />
          <circle cx="87" cy="8.5" r="2.4" fill={accent} fillOpacity="0.9" filter={`url(#${uid}-soft)`} />
          {/* 颈环 */}
          <rect x="47" y="48" width="26" height="7" rx="3.5" fill="#8FA0B4" />
        </g>
      ) : (
        /* ===== 正面半身（头像框） ===== */
        <g>
          {/* 肩身 */}
          <path
            d="M18,150 C22,116 40,104 60,104 C80,104 98,116 102,150 Z"
            fill={`url(#${uid}-suit)`}
            stroke="#94A6BA"
            strokeOpacity="0.45"
          />
          {/* 胸前面板 + 主题色胸灯 */}
          <rect x="46" y="120" width="28" height="18" rx="6" fill={`url(#${uid}-pack)`} fillOpacity="0.55" />
          <motion.circle
            cx="60"
            cy="129"
            r="4"
            fill={accent}
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <rect x="30" y="116" width="10" height="14" rx="4" fill="#8FA0B4" fillOpacity="0.7" />
          <rect x="80" y="116" width="10" height="14" rx="4" fill="#8FA0B4" fillOpacity="0.7" />
          {/* 颈环 */}
          <rect x="46" y="96" width="28" height="10" rx="5" fill="#8FA0B4" />
          <rect x="48" y="98" width="24" height="2.4" rx="1.2" fill="#C8D4E4" />
          {/* 头盔（正面） */}
          <circle cx="60" cy="62" r="34" fill={`url(#${uid}-shell)`} stroke="#93A5B9" strokeOpacity="0.55" strokeWidth="1.4" />
          <path d="M34,50 Q40,32 58,29" fill="none" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="4" strokeLinecap="round" />
          {/* 目镜（宽幅） */}
          <path
            d="M34,62 Q34,42 60,42 Q86,42 86,62 Q86,76 60,76 Q34,76 34,62 Z"
            fill={`url(#${uid}-visor)`}
          />
          {/* 主题色反光 + 白色高光 */}
          <path d="M40,56 Q46,46 60,45 Q74,46 78,54 L72,60 Q60,52 48,60 Z" fill={`url(#${uid}-refl)`} />
          <ellipse cx="49" cy="52" rx="6" ry="3.2" fill="#FFFFFF" fillOpacity="0.7" transform="rotate(-24 49 52)" />
          {/* 头盔侧通信灯 */}
          <circle cx="88" cy="58" r="2.6" fill={accent} fillOpacity="0.85" filter={`url(#${uid}-soft)`} />
        </g>
      )}
    </svg>
  );
}
