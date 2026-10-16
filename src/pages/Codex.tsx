import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import CardGallery from '../components/CardGallery';
import KnowledgeGraph from '../components/KnowledgeGraph';
import { allCards } from '../data/cards';
import { useGameStore } from '../store/useGameStore';

type View = 'cards' | 'graph';

// 图鉴页：卡片 / 知识图谱 双视图
export default function Codex() {
  const player = useGameStore((s) => s.player);
  const [view, setView] = useState<View>('cards');

  const owned = useMemo(() => new Set(player?.cards ?? []), [player?.cards]);
  const ownedCount = allCards.filter((c) => owned.has(c.id)).length;

  return (
    <div className="mx-auto max-w-[960px] px-6 py-8 max-md:px-4">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold gradient-text">记忆图鉴</h1>
          <p className="mt-1 text-sm text-text-secondary">
            已收集 {ownedCount} / {allCards.length}
          </p>
        </div>
        {/* 收集进度条 */}
        <div className="h-2 w-40 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet"
            animate={{ width: `${(ownedCount / allCards.length) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* 视图切换 */}
      <div className="mb-5 flex gap-2">
        {(
          [
            { key: 'cards', label: '卡片图鉴' },
            { key: 'graph', label: '知识图谱' },
          ] as { key: View; label: string }[]
        ).map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={`rounded-btn border px-4 py-2 text-sm transition-all active:scale-95 ${
              view === v.key
                ? 'border-neon-violet/60 bg-neon-violet/15 text-neon-violet shadow-[0_0_14px_rgba(139,92,246,0.3)]'
                : 'border-white/10 text-text-secondary hover:text-txt-primary'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'graph' ? (
        <KnowledgeGraph onOpenCard={() => undefined} />
      ) : (
        <CardGallery />
      )}
    </div>
  );
}
