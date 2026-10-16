import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Card, Rarity } from '../types';

// 稀有度样式表
export const RARITY_STYLE: Record<
  Rarity,
  { label: string; border: string; glow: string; text: string; bg: string }
> = {
  N: {
    label: 'N · 普通',
    border: 'border-amber-900/60',
    glow: 'shadow-[0_0_12px_rgba(120,72,20,0.25)]',
    text: 'text-amber-200/80',
    bg: 'from-amber-950/40 to-bg-elevated',
  },
  R: {
    label: 'R · 稀有',
    border: 'border-slate-300/50',
    glow: 'shadow-[0_0_18px_rgba(203,213,225,0.3)]',
    text: 'text-slate-200',
    bg: 'from-slate-500/20 to-bg-elevated',
  },
  SR: {
    label: 'SR · 史诗',
    border: 'border-neon-gold/60',
    glow: 'shadow-[0_0_26px_rgba(251,191,36,0.4)]',
    text: 'text-neon-gold',
    bg: 'from-neon-gold/15 to-bg-elevated',
  },
  SSR: {
    label: 'SSR · 传说',
    border: 'border-transparent',
    glow: 'shadow-[0_0_36px_rgba(139,92,246,0.55)]',
    text: 'gradient-text',
    bg: 'from-neon-violet/20 to-bg-elevated',
  },
};

export const TYPE_LABEL: Record<Card['type'], string> = {
  basic: '基础考点',
  advanced: '高级考点',
  script: '话术卡',
  story: '剧情卡',
  project: '项目实战',
};

interface Props {
  card: Card;
  large?: boolean;
  locked?: boolean;
}

// 卡牌组件：正面标题+稀有度，点击翻转显示内容
export default function CardItem({ card, large, locked }: Props) {
  const [flipped, setFlipped] = useState(false);
  const style = RARITY_STYLE[card.rarity];

  if (locked) {
    return (
      <div
        className={`glass relative flex items-center justify-center border-white/5 ${
          large ? 'h-72' : 'h-44'
        }`}
      >
        <div className="text-center text-text-muted">
          <div className="text-3xl">🔒</div>
          <div className="mt-2 text-xs">尚未获得</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`cursor-pointer select-none ${large ? 'h-72' : 'h-44'}`}
      style={{ perspective: 1200 }}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 正面 */}
        <div
          className={`absolute inset-0 flex flex-col justify-between rounded-[20px] border bg-gradient-to-br p-4 backdrop-blur-xl ${style.border} ${style.glow} ${style.bg}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {card.rarity === 'SSR' && (
            <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-[linear-gradient(120deg,rgba(34,211,238,.12),rgba(139,92,246,.12),rgba(251,191,36,.12))]" />
          )}
          <div className="flex items-center justify-between">
            <span className={`tag-pill border border-white/10 text-[10px] ${style.text}`}>
              {style.label}
            </span>
            <span className="text-[10px] text-text-muted">{TYPE_LABEL[card.type]}</span>
          </div>
          <div className={`font-display font-bold ${large ? 'text-xl' : 'text-sm'} ${style.text}`}>
            {card.title}
          </div>
          {/* project 卡正面：八股考点提炼 */}
          {card.type === 'project' && card.frontPoint && (
            <div className="mt-2 line-clamp-3 text-[11px] leading-snug text-txt-secondary">
              {card.frontPoint}
            </div>
          )}
          <div className="text-[10px] text-text-muted">
            {card.type === 'project' ? `${card.projectContext} · 点击翻转看话术` : `${card.module} · 点击翻转`}
          </div>
        </div>
        {/* 背面 */}
        <div
          className={`absolute inset-0 overflow-y-auto rounded-[20px] border bg-bg-elevated/95 p-4 backdrop-blur-xl ${style.border} ${style.glow}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className={`mb-2 text-xs font-bold ${style.text}`}>
            {card.type === 'project' ? `${card.projectContext} · 项目实战话术` : card.title}
          </div>
          <p className={`leading-relaxed text-txt-secondary ${large ? 'text-sm' : 'text-xs'}`}>
            {card.content}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
