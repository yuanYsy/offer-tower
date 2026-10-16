import { motion } from 'framer-motion';

interface TitleProps {
  text: string;
  /** 拉丁副行（宽字距，EPISODE.01 式） */
  latin?: string;
  className?: string;
}

// 全息标题：厚重方正 CJK + 冷银蓝辉光 + 宽字距拉丁副行（对齐参考图）
export default function HoloTitle({ text, latin, className = '' }: TitleProps) {
  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* 背后的能量光晕板 */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-x-12 -inset-y-8 rounded-[48px]"
        style={{
          background:
            'radial-gradient(ellipse 62% 68% at 50% 50%, rgba(79,227,255,0.2), rgba(34,211,238,0.08) 55%, transparent 72%)',
        }}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 主标题（呼吸辉光） */}
      <h1
        className="holo-title font-display relative font-normal"
        style={{ letterSpacing: '0.08em', animation: 'neon-breathe 5.2s ease-in-out infinite' }}
      >
        {text}
      </h1>

      {/* 拉丁副行 */}
      {latin && (
        <div className="relative mt-3 flex items-center gap-2.5 md:gap-4">
          <span
            aria-hidden
            className="h-px w-8 md:w-16"
            style={{ background: 'linear-gradient(90deg, transparent, #4FE3FF)' }}
          />
          <span
            className="latin-track font-tech text-[9px] leading-none md:text-xs"
            style={{ color: '#4FE3FF', textShadow: '0 0 16px rgba(79,227,255,0.85)' }}
          >
            {latin}
          </span>
          <span
            aria-hidden
            className="h-px w-8 md:w-16"
            style={{ background: 'linear-gradient(90deg, #4FE3FF, transparent)' }}
          />
        </div>
      )}
    </div>
  );
}

// 全息副标题：冷银蓝金属底纹 + 底部能量条呼吸
export function HoloSubtitle({ text, className = '' }: { text: string; className?: string }) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      animate={{ opacity: [0.88, 1, 0.88] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span className="metal-text font-display font-normal" style={{ letterSpacing: '0.14em' }}>
        {text}
      </span>
      <motion.span
        aria-hidden
        className="absolute -bottom-1 left-1/2 h-[2px] w-4/5 -translate-x-1/2 rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, #4FE3FF, #22D3EE, transparent)' }}
        animate={{ opacity: [0.3, 0.95, 0.3], scaleX: [0.85, 1, 0.85] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
