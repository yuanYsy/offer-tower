import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Castle, Gift, User } from 'lucide-react';
import type { BattleResult, Grade, Interviewer } from '../types';
import { getProjectCard } from '../data/projectCards';

const GRADE_CONFIG: Record<Grade, { color: string; glow: string; label: string }> = {
  S: { color: '#FBBF24', glow: 'rgba(251,191,36,0.6)', label: '传说' },
  A: { color: '#22D3EE', glow: 'rgba(34,211,238,0.5)', label: '优秀' },
  B: { color: '#E8EDF7', glow: 'rgba(232,237,247,0.3)', label: '合格' },
  C: { color: '#FB7185', glow: 'rgba(251,113,133,0.5)', label: '重来' },
};

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

interface Props {
  result: BattleResult;
  interviewer: Interviewer;
  hasNext: boolean;
  onNext: () => void;
  onExit: () => void;
  onProfile: () => void;
}

// 评级揭晓：全屏遮罩 + 巨型字母 + 粒子/震动 + 台词 + 掉落提示
export default function GradeReveal({ result, interviewer, hasNext, onNext, onExit, onProfile }: Props) {
  const cfg = GRADE_CONFIG[result.grade];
  const line = useMemo(() => {
    const pool =
      result.grade === 'S'
        ? interviewer.lines.perfect
        : result.grade === 'C'
          ? interviewer.lines.bad
          : interviewer.lines.good;
    return pick(pool);
  }, [result.grade, interviewer]);

  // S 级粒子
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 320,
        delay: Math.random() * 0.4,
        size: Math.random() * 5 + 3,
        drift: Math.random() * 60 - 30,
      })),
    [],
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/85 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* S 级粒子向上飞散 */}
      {result.grade === 'S' && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: '#FBBF24',
                boxShadow: '0 0 8px rgba(251,191,36,0.9)',
              }}
              initial={{ x: p.x * 0.3, y: 0, opacity: 1 }}
              animate={{ x: p.x + p.drift, y: -window.innerHeight * 0.45, opacity: 0 }}
              transition={{ duration: 1.6, delay: p.delay, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}

      {/* C 级屏幕震动 */}
      <motion.div
        className="relative flex w-full max-w-sm flex-col items-center px-6 text-center"
        animate={result.grade === 'C' ? { x: [0, -10, 10, -6, 6, -2, 0] } : {}}
        transition={{ duration: 0.55 }}
      >
        {/* 光晕扩散 */}
        <motion.div
          className="absolute left-1/2 top-[88px] -z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: `radial-gradient(circle, ${cfg.glow}, transparent 70%)` }}
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />

        {/* 评级字母：600ms 缩放 + 光晕 */}
        <motion.div
          className="font-display font-bold leading-none"
          style={{
            fontSize: 120,
            color: cfg.color,
            textShadow: `0 0 40px ${cfg.glow}, 0 0 80px ${cfg.glow}`,
          }}
          initial={{ scale: 0.2, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 15 }}
        >
          {result.grade}
        </motion.div>
        <motion.div
          className="mt-1 text-sm tracking-[0.4em]"
          style={{ color: cfg.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {cfg.label}
        </motion.div>

        {/* 数据行 */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-5 font-mono text-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div>
            <div className="text-[10px] tracking-widest text-txt-muted">命中率</div>
            <div className="text-neon-cyan">{Math.round(result.hitRate * 100)}%</div>
          </div>
          <div>
            <div className="text-[10px] tracking-widest text-txt-muted">COMBO</div>
            <div className="text-neon-violet">×{result.combo}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-widest text-txt-muted">经验</div>
            <div className="text-neon-emerald">+{result.expGained}</div>
          </div>
        </motion.div>

        {/* 面试官台词 */}
        <motion.div
          className="glass mt-6 w-full p-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <div className="mb-1 text-xs" style={{ color: interviewer.avatarSeed }}>
            {interviewer.name} · {interviewer.title}
          </div>
          <div className="text-sm leading-relaxed text-txt-secondary">「{line}」</div>
        </motion.div>

        {/* 通关掉落项目卡 */}
        {result.droppedCardId &&
          (() => {
            const card = getProjectCard(result.droppedCardId);
            if (!card) return null;
            return (
              <motion.div
                className="mt-4 w-full rounded-2xl border border-neon-gold/50 bg-neon-gold/10 p-4 text-left"
                initial={{ opacity: 0, scale: 0.6, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.85, type: 'spring', stiffness: 200, damping: 16 }}
              >
                <div className="flex items-center gap-2 text-sm font-bold text-neon-gold">
                  <Gift size={16} /> 通关奖励 · 项目实战映射卡
                </div>
                <div className="mt-2 font-display text-sm text-txt-primary">{card.title}</div>
                <div className="mt-1 text-xs text-txt-secondary">
                  {card.projectContext} · 已收入图鉴，点卡片翻转查看项目话术
                </div>
              </motion.div>
            );
          })()}
        {result.hpLost && (
          <motion.div
            className="mt-3 text-sm text-neon-rose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
          >
            HP -1，本题已加入复仇队列
          </motion.div>
        )}

        {/* 操作按钮 */}
        <motion.div
          className="mt-7 flex w-full flex-col gap-2.5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
        >
          {hasNext && (
            <button onClick={onNext} className="btn-neon flex items-center justify-center gap-2 px-6 py-3">
              下一题 <ArrowRight size={17} />
            </button>
          )}
          <div className="flex gap-2.5">
            <button onClick={onExit} className="btn-ghost flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 text-sm">
              <Castle size={15} /> 回星塔
            </button>
            <button onClick={onProfile} className="btn-ghost flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 text-sm">
              <User size={15} /> 看档案
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
