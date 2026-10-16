import { motion } from 'framer-motion';

interface Props {
  value: number; // 0-1
  color?: string; // 渐变起始色
  colorTo?: string;
  height?: number;
  showGlow?: boolean;
}

// 通用渐变进度条（宽度用 framer 动画）
export default function ProgressBar({
  value,
  color = '#22D3EE',
  colorTo = '#8B5CF6',
  height = 8,
  showGlow = true,
}: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className="w-full overflow-hidden rounded-full bg-white/5"
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}, ${colorTo})`,
          boxShadow: showGlow ? `0 0 12px ${color}66` : undefined,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
