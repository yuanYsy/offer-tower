import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Network, Sparkles } from 'lucide-react';
import { allCards } from '../data/cards';
import { graphNodes } from '../data/knowledgeGraph';
import { useGameStore } from '../store/useGameStore';
import useIsMobile from '../hooks/useIsMobile';
import { STATIC_MODE } from '../lib/staticMode';
import CardGallery from './CardGallery';
import KnowledgeGraph from './KnowledgeGraph';
import HudPanel from './HudPanel';

interface ConsoleProps {
  accent: string;
  clearedCount: number;
  onOpenCards: () => void;
  onOpenGraph: () => void;
  onOpenForm: () => void;
}

// ===== 全息操作台：固定悬浮在地图底部，显眼展示【记忆卡片】【知识图谱】 =====
export function HoloConsole({ accent, clearedCount, onOpenCards, onOpenGraph, onOpenForm }: ConsoleProps) {
  const player = useGameStore((s) => s.player);
  const isMobile = useIsMobile();
  const owned = useMemo(() => new Set(player?.cards ?? []), [player?.cards]);
  const cardOwned = allCards.filter((c) => owned.has(c.id)).length;
  const pointCount = graphNodes.filter((n) => n.layer === 'point').length;
  const projectOwned = allCards.filter((c) => c.type === 'project' && owned.has(c.id)).length;
  const projectTotal = allCards.filter((c) => c.type === 'project').length;

  const items = [
    {
      key: 'cards',
      label: '记忆卡片',
      sub: `${cardOwned}/${allCards.length}`,
      icon: BookOpen,
      color: '#22D3EE',
      onClick: onOpenCards,
    },
    {
      key: 'graph',
      label: '知识图谱',
      sub: `${pointCount} 知识点`,
      icon: Network,
      color: '#8B5CF6',
      onClick: onOpenGraph,
    },
    {
      key: 'form',
      label: '形态展示',
      sub: `光环 ${clearedCount}/8`,
      icon: Sparkles,
      color: accent,
      onClick: onOpenForm,
    },
  ];

  // 内嵌在星塔页底部：与标题 / 星球地图同处一个视觉平面，不再 fixed 悬浮覆盖地图
  return (
    <div className="flex shrink-0 justify-center pt-1">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.2 }}
        className="hud pointer-events-auto flex items-stretch gap-1.5 p-1.5 md:gap-2 md:p-2"
      >
        {/* 左端状态灯 */}
        <div className="hidden flex-col justify-center gap-1 px-2 md:flex">
          <span className="font-mono text-[9px] tracking-[0.2em] text-txt-muted">CODEX</span>
          <motion.span
            className="h-1 w-10 rounded-full"
            style={{ background: `linear-gradient(90deg, #22D3EE, #8B5CF6)` }}
            animate={{ opacity: STATIC_MODE || isMobile ? 0.7 : [0.35, 1, 0.35] }}
            transition={{ duration: 2.2, repeat: STATIC_MODE || isMobile ? 0 : Infinity }}
          />
        </div>

        {items.map((it) => {
          const Icon = it.icon;
          return (
            <button
              key={it.key}
              onClick={it.onClick}
              className="group relative flex min-w-[92px] items-center gap-2.5 overflow-hidden rounded-xl border px-3 py-1.5 text-left transition-all active:scale-95 md:min-w-[132px] md:px-3.5 md:py-2"
              style={{
                borderColor: `${it.color}55`,
                background: `linear-gradient(150deg, ${it.color}1F, rgba(8,14,26,0.55))`,
                boxShadow: `0 0 18px -4px ${it.color}88, inset 0 1px 0 rgba(190,232,255,0.12)`,
              }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border md:h-9 md:w-9"
                style={{
                  borderColor: `${it.color}77`,
                  background: `${it.color}1A`,
                  boxShadow: `0 0 12px -2px ${it.color}AA`,
                  color: it.color,
                }}
              >
                <Icon size={17} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5">
                  <span
                    className="whitespace-nowrap font-display text-[13px] font-bold tracking-wide md:text-sm"
                    style={{ color: '#E8EDF7' }}
                  >
                    {it.label}
                  </span>
                  <span className="hidden font-mono text-[9px] md:inline" style={{ color: it.color }}>
                    ›
                  </span>
                </span>
                <span className="block whitespace-nowrap font-mono text-[10px]" style={{ color: it.color }}>
                  {it.sub}
                </span>
              </span>
              {/* 悬停扫光 */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-full w-1/2 opacity-0 transition-all duration-500 group-hover:left-full group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, transparent, ${it.color}33, transparent)` }}
              />
            </button>
          );
        })}

        {/* 右端项目卡进度（装饰 + 信息） */}
        <div className="hidden flex-col justify-center gap-1 px-2 lg:flex">
          <span className="font-mono text-[9px] tracking-[0.2em] text-txt-muted">PROJECT</span>
          <span className="font-mono text-[11px]" style={{ color: '#FBBF24' }}>
            {projectOwned}/{projectTotal}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ===== 全屏全息面板：外框 =====
function DeckShell({
  accent,
  title,
  meta,
  onClose,
  children,
}: {
  accent: string;
  title: string;
  meta: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  // Portal 到 body：全屏面板同样脱离变换祖先，fixed inset-0 真正覆盖视口
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-bg-void/85 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-md md:p-6 md:pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-6xl"
      >
        <HudPanel
          accent={accent}
          title={title}
          meta={meta}
          onClose={onClose}
          className="flex h-full flex-col p-4 md:p-6"
        >
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </HudPanel>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

// =====【记忆卡片】全屏面板 =====
export function CardDeck({ onClose }: { onClose: () => void }) {
  const player = useGameStore((s) => s.player);
  const owned = useMemo(() => new Set(player?.cards ?? []), [player?.cards]);
  const ownedCount = allCards.filter((c) => owned.has(c.id)).length;

  return (
    <DeckShell accent="#22D3EE" title="记忆卡片" meta="CARD ARCHIVE" onClose={onClose}>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#22D3EE,#8B5CF6)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(ownedCount / allCards.length) * 100}%` }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <span className="font-mono text-[11px] text-txt-secondary">
          {ownedCount} / {allCards.length}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1 pb-6">
        <CardGallery />
      </div>
    </DeckShell>
  );
}

// =====【知识图谱】全屏面板 =====
export function GraphDeck({ onClose }: { onClose: () => void }) {
  return (
    <DeckShell accent="#8B5CF6" title="知识图谱" meta="KNOWLEDGE GRAPH" onClose={onClose}>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1 pb-6">
        <KnowledgeGraph />
      </div>
    </DeckShell>
  );
}

export function DeckSwitcher({ deck, onClose }: { deck: 'cards' | 'graph' | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {deck === 'cards' && <CardDeck key="cards" onClose={onClose} />}
      {deck === 'graph' && <GraphDeck key="graph" onClose={onClose} />}
    </AnimatePresence>
  );
}
