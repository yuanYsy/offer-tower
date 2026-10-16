import { useId, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  seed: string; // 主题色
  size?: number;
  showRing?: boolean;
  enter?: boolean; // 是否播放出场弹簧动画
  /** 面试官 id（luchen/yehang/...），决定目镜形态等差异化外观 */
  variant?: string;
}

// 字符串稳定哈希 → 0-1
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

// 上浮数据粒（相位错开）
const MOTES = Array.from({ length: 7 }, (_, i) => ({
  x: 26 + ((i * 37) % 68),
  delay: (i % 5) * 0.55,
  dur: 3.2 + (i % 4) * 0.7,
  r: i % 3 === 0 ? 1.6 : 1.1,
}));

// ============ SVG 赛博全息虚像：hood 兜帽（面试官）/ helmet 全覆头盔（玩家） ============
export function CyberPhantom({
  seed,
  vIdx,
  kind = 'hood',
}: {
  seed: string;
  vIdx: number;
  /** hood = 兜帽虚像；helmet = 全覆式头盔 */
  kind?: 'hood' | 'helmet';
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" role="img" aria-label="面试官">
      <defs>
        <clipPath id={`${uid}-clip`}>
          <circle cx="60" cy="60" r="58" />
        </clipPath>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="34%" r="78%">
          <stop offset="0%" stopColor={seed} stopOpacity="0.26" />
          <stop offset="55%" stopColor="#0B1322" />
          <stop offset="100%" stopColor="#060A14" />
        </radialGradient>
        <linearGradient id={`${uid}-hood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16233C" />
          <stop offset="100%" stopColor="#080D19" />
        </linearGradient>
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={seed} stopOpacity="0" />
          <stop offset="100%" stopColor={seed} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${uid}-visor`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={seed} stopOpacity="0.35" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor={seed} stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050A14" stopOpacity="0" />
          <stop offset="100%" stopColor="#050A14" stopOpacity="0.9" />
        </linearGradient>
        <pattern id={`${uid}-scan`} width="4" height="3" patternUnits="userSpaceOnUse">
          <rect width="4" height="1" fill="#9BDCFF" fillOpacity="0.06" />
        </pattern>
        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g clipPath={`url(#${uid}-clip)`}>
        {/* 背景与背后能量涡 */}
        <rect width="120" height="120" fill={`url(#${uid}-bg)`} />
        <motion.circle
          cx="60"
          cy="56"
          r="30"
          fill="none"
          stroke={seed}
          strokeOpacity="0.2"
          strokeWidth="1"
          strokeDasharray="3 7"
          style={{ transformOrigin: '60px 56px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />

        {/* 兜帽虚像主体 */}
        <g>
          {/* 肩身 */}
          <path
            d="M14,122 C17,94 36,83 60,83 C84,83 103,94 106,122 Z"
            fill={`url(#${uid}-hood)`}
          />
          {/* 胸口电路纹 */}
          <g stroke={seed} strokeOpacity="0.4" strokeWidth="1.1" fill="none">
            <path d="M48,96 h9 l4,5 h10" />
            <path d="M42,104 h7 l5,-4" />
            <path d="M70,108 h8" />
          </g>
          <g fill={seed} fillOpacity="0.65">
            <circle cx="57" cy="101" r="1.5" />
            <circle cx="71" cy="101" r="1.5" />
            <circle cx="49" cy="100" r="1.3" />
            <circle cx="78" cy="108" r="1.3" />
          </g>

          {/* ===== 玩家形态：全覆式头盔 ===== */}
        {kind === 'helmet' ? (
          <>
            <path
              d="M60,16 C42,16 32,31 32,49 C32,66 42,78 60,80 C78,78 88,66 88,49 C88,31 78,16 60,16 Z"
              fill={`url(#${uid}-hood)`}
            />
            {/* 头盔缘光（右侧亮、左侧弱） */}
            <path d="M32,49 C32,31 42,16 60,16" fill="none" stroke={seed} strokeOpacity="0.8" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M88,49 C88,31 78,16 60,16" fill="none" stroke={seed} strokeOpacity="0.35" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M32,49 C32,66 42,78 60,80" fill="none" stroke={seed} strokeOpacity="0.3" strokeWidth="1.4" strokeLinecap="round" />
            {/* 侧通气槽 */}
            <g stroke={seed} strokeOpacity="0.45" strokeWidth="1.3" strokeLinecap="round">
              <path d="M35,60 h4" />
              <path d="M35,64.5 h4" />
              <path d="M81,60 h4" />
              <path d="M81,64.5 h4" />
            </g>
            {/* 全宽发光目镜 + 扫掠高光 */}
            <g filter={`url(#${uid}-glow)`}>
              <rect x="40" y="42" width="40" height="16" rx="8" fill="#030710" />
              <rect x="43" y="45.5" width="34" height="9" rx="4.5" fill={seed} fillOpacity="0.92" />
              <motion.rect
                x="43"
                y="45.5"
                width="12"
                height="9"
                rx="4.5"
                fill={`url(#${uid}-visor)`}
                animate={{ x: [43, 64] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <rect x="44.5" y="49.55" width="31" height="0.9" fill="#FFFFFF" fillOpacity="0.55" />
            </g>
            {/* 下颌指示灯 */}
            <motion.rect
              x="53"
              y="66.5"
              width="14"
              height="3"
              rx="1.5"
              fill={seed}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        ) : (
          <>
        {/* 兜帽头部（三种帽型随 variant 变化） */}
          {vIdx === 2 ? (
            <path
              d="M60,18 L74,36 C82,44 86,54 84,62 C82,74 74,82 60,82 C46,82 38,74 36,62 C34,54 38,44 46,36 Z"
              fill={`url(#${uid}-hood)`}
            />
          ) : (
            <path
              d="M60,20 C44,20 34,34 35,52 C36,68 44,80 60,82 C76,80 84,68 85,52 C86,34 76,20 60,20 Z"
              fill={`url(#${uid}-hood)`}
            />
          )}
          {/* 顶部天线（variant 1 专属） */}
          {vIdx === 1 && (
            <g stroke={seed} strokeWidth="1.6" strokeLinecap="round" fill="none">
              <path d="M74,26 L82,14" strokeOpacity="0.75" />
              <circle cx="83" cy="12" r="2.2" fill={seed} stroke="none" filter={`url(#${uid}-glow)`} />
            </g>
          )}
          {/* 兜帽右侧缘光 */}
          <path
            d={
              vIdx === 2
                ? 'M74,36 C82,44 86,54 84,62 C82,74 74,82 60,82'
                : 'M85,52 C86,34 76,20 60,20 M85,52 C84,68 76,80 60,82'
            }
            fill="none"
            stroke={`url(#${uid}-rim)`}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* 面腔阴影 */}
          <ellipse cx="60" cy="56" rx="18" ry="21" fill="#030710" />

          {/* 发光目镜（三种形态） */}
          {vIdx === 0 && (
            <g filter={`url(#${uid}-glow)`}>
              <rect x="45" y="50" width="30" height="6.5" rx="3.2" fill={seed} fillOpacity="0.92" />
              <motion.rect
                x="45"
                y="50"
                width="10"
                height="6.5"
                rx="3.2"
                fill={`url(#${uid}-visor)`}
                animate={{ x: [45, 66] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </g>
          )}
          {vIdx === 1 && (
            <g filter={`url(#${uid}-glow)`}>
              <motion.circle
                cx="52"
                cy="53"
                r="2.8"
                fill={seed}
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <motion.circle
                cx="68"
                cy="53"
                r="2.8"
                fill={seed}
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <rect x="46" y="51.6" width="28" height="1.2" rx="0.6" fill={seed} fillOpacity="0.5" />
            </g>
          )}
          {vIdx === 2 && (
            <g filter={`url(#${uid}-glow)`}>
              <path d="M46,55 L60,46 L74,55 L60,60 Z" fill={seed} fillOpacity="0.92" />
              <motion.path
                d="M46,55 L60,46 L74,55"
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.9"
                strokeWidth="1"
                animate={{ pathLength: [0, 1], opacity: [0, 0.9, 0] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
            </g>
          )}
          {/* 下颌语音波纹（说话感的呼吸灯） */}
          <motion.path
            d="M52,68 h16"
            stroke={seed}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            animate={{ opacity: [0.15, 0.8, 0.15], scaleX: [0.6, 1, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '60px 68px' }}
          />
          </>
        )}
        </g>

        {/* 上浮数据粒 */}
        {MOTES.map((m, i) => (
          <motion.circle
            key={i}
            cx={m.x}
            r={m.r}
            fill={seed}
            initial={{ cy: 104, opacity: 0 }}
            animate={{ cy: [104, 30], opacity: [0, 0.85, 0] }}
            transition={{ duration: m.dur, repeat: Infinity, delay: m.delay, ease: 'easeIn' }}
          />
        ))}

        {/* 扫描线 + 底部消隐 */}
        <rect width="120" height="120" fill={`url(#${uid}-scan)`} />
        <rect y="86" width="120" height="34" fill={`url(#${uid}-fade)`} />
        {/* 周期掠过的横向全息扫描束 */}
        <motion.rect
          width="120"
          height="10"
          fill={seed}
          fillOpacity="0.1"
          animate={{ y: [-12, 122] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'linear' }}
        />
      </g>
      {/* 外圈描边 */}
      <circle cx="60" cy="60" r="57.2" fill="none" stroke={seed} strokeOpacity="0.35" strokeWidth="1.4" />
    </svg>
  );
}

// 赛博全息虚像头像：兜帽剪影 + 发光目镜 + 电路纹 + 数据粒
export default function InterviewerAvatar({
  seed,
  size = 180,
  showRing = true,
  enter = false,
  variant,
}: Props) {
  const accent = /^#[0-9A-Fa-f]{6}$/.test(seed) ? seed : '#22D3EE';
  const vIdx = useMemo(() => Math.floor(hashStr(variant ?? seed) * 3) % 3, [variant, seed]);

  return (
    <motion.div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      initial={enter ? { opacity: 0, scale: 0.82, y: 14 } : false}
      animate={enter ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 旋转能量环 */}
      {showRing && (
        <motion.div
          className="pointer-events-none absolute -inset-1.5 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, ${accent}AA 12%, transparent 30%, transparent 56%, ${accent}66 68%, transparent 84%)`,
            filter: 'blur(3px)',
            opacity: 0.8,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <div
        className="relative h-full w-full overflow-hidden rounded-full border"
        style={{
          borderColor: `${accent}55`,
          boxShadow: `0 0 22px -4px ${accent}66, inset 0 0 18px ${accent}22`,
        }}
      >
        <CyberPhantom seed={accent} vIdx={vIdx} />
      </div>
    </motion.div>
  );
}
