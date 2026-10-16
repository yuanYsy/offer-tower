import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { STATIC_MODE } from '../lib/staticMode';

interface Props {
  children: ReactNode;
  className?: string;
  /** 四角括号 / 辉光主色 */
  accent?: string;
  /** 面板标题 */
  title?: ReactNode;
  /** 标题右侧的等宽小字（例如 03 / 08） */
  meta?: ReactNode;
  onClose?: () => void;
  /** 是否使用默认内边距 */
  padded?: boolean;
}

// 全息 HUD 面板：玻璃拟态 + 四角括号 + 扫描线 + 呼吸状态灯
export default function HudPanel({
  children,
  className = '',
  accent = '#22D3EE',
  title,
  meta,
  onClose,
  padded = true,
}: Props) {
  const style = {
    '--hud-accent': accent,
    boxShadow: `inset 0 1px 0 rgba(184,226,255,0.14), inset 0 0 44px ${accent}12,
      0 20px 60px -26px rgba(0,0,0,0.95), 0 0 32px -8px ${accent}66`,
  } as CSSProperties;

  return (
    <div className={`hud ${padded ? 'p-5' : ''} ${className}`} style={style}>
      {(title || onClose) && (
        <div className="relative mb-4 flex items-center gap-3">
          <motion.span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
            animate={{ opacity: STATIC_MODE ? 1 : [1, 0.3, 1] }}
            transition={STATIC_MODE ? undefined : { duration: 1.8, repeat: Infinity }}
          />
          {title && (
            <span
              className="font-display text-sm font-bold tracking-[0.28em]"
              style={{ color: '#E8EDF7', textShadow: `0 0 16px ${accent}66` }}
            >
              {title}
            </span>
          )}
          {meta && (
            <span className="font-mono text-[10px] tracking-[0.25em] text-txt-muted">{meta}</span>
          )}
          <span
            aria-hidden
            className="h-px flex-1"
            style={{ background: `linear-gradient(90deg, ${accent}66, transparent)` }}
          />
          {onClose && (
            <button
              onClick={onClose}
              aria-label="关闭"
              className="rounded-btn border border-white/10 p-1.5 text-txt-secondary transition-all hover:border-neon-cyan/50 hover:text-neon-cyan active:scale-90"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
