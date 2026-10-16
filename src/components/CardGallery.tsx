import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import CardItem, { TYPE_LABEL } from './CardItem';
import { allCards } from '../data/cards';
import { useGameStore } from '../store/useGameStore';
import type { Card, CardType } from '../types';

// 图鉴标签：全部 + 各类卡池（含话术卡 / 项目实战）
export const CODEX_TABS: { key: CardType | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'basic', label: '基础考点' },
  { key: 'advanced', label: '高级考点' },
  { key: 'script', label: '话术卡' },
  { key: 'story', label: '剧情卡' },
  { key: 'project', label: '项目实战' },
];

// 卡片网格 + 翻转详情弹窗（图鉴页与全息操作台共用）
export default function CardGallery({ initialTab = 'all' }: { initialTab?: CardType | 'all' }) {
  const player = useGameStore((s) => s.player);
  const [tab, setTab] = useState<CardType | 'all'>(initialTab);
  const [detail, setDetail] = useState<Card | null>(null);

  const owned = useMemo(() => new Set(player?.cards ?? []), [player?.cards]);
  const filtered = tab === 'all' ? allCards : allCards.filter((c) => c.type === tab);

  return (
    <>
      {/* 标签栏 */}
      <div className="mb-5 flex flex-wrap gap-2">
        {CODEX_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`tag-pill border transition-all ${
              tab === t.key
                ? 'border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-txt-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 卡片网格 */}
      <motion.div layout className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <AnimatePresence mode="popLayout">
          {filtered.map((card, i) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.4), ease: [0.16, 1, 0.3, 1] }}
              onClick={() => owned.has(card.id) && setDetail(card)}
            >
              <CardItem card={card} locked={!owned.has(card.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {detail && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetail(null)}
          >
            <motion.div
              className="w-full max-w-sm"
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-text-secondary">{TYPE_LABEL[detail.type]}</span>
                <button
                  className="rounded-full p-1.5 text-text-secondary hover:bg-white/10 hover:text-txt-primary"
                  onClick={() => setDetail(null)}
                  aria-label="关闭"
                >
                  <X size={18} />
                </button>
              </div>
              <CardItem card={detail} large />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
