import { motion } from 'framer-motion';

interface Props {
  total: number; // 总秒数
  left: number; // 剩余秒数
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}

// 环形倒计时：青 → 金 → 红渐变；≤10s 数字脉冲
export default function CountdownRing({ total, left, size = 120, stroke = 6, children }: Props) {
  const pct = Math.max(0, Math.min(1, left / total));
  const color = pct > 0.5 ? '#22D3EE' : pct > 0.2 ? '#FBBF24' : '#FB7185';
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const urgent = left <= 10 && left > 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - pct), stroke: color }}
          transition={{ duration: 0.5, ease: 'linear' }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ?? (
          <motion.span
            className="font-display font-bold"
            style={{ color, fontSize: size * 0.28 }}
            animate={urgent ? { scale: [1, 1.18, 1] } : { scale: 1 }}
            transition={urgent ? { duration: 0.9, repeat: Infinity } : {}}
          >
            {Math.ceil(left)}
          </motion.span>
        )}
      </div>
    </div>
  );
}
