import { motion } from 'framer-motion';
import { Flame, RefreshCcw, Swords, Target, Timer } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerAvatar from '../components/PlayerAvatar';
import CloudSyncPanel from '../components/CloudSyncPanel';
import { floors } from '../data/floors';
import {
  getFloorMastery,
  getLevel,
  getLevelProgress,
  selectQuestion,
  useGameStore,
} from '../store/useGameStore';

// 个人档案：数据卡片 + 模块掌握度 + 错题本 + 重置
export default function Profile() {
  const navigate = useNavigate();
  const player = useGameStore((s) => s.player);
  const resetAll = useGameStore((s) => s.resetAll);
  const [confirming, setConfirming] = useState(false);

  if (!player) return null;

  const level = getLevel(player.exp);
  const progress = getLevelProgress(player.exp);
  const hours = Math.floor(player.totalStudyMs / 3_600_000);
  const minutes = Math.floor((player.totalStudyMs % 3_600_000) / 60_000);

  const stats = [
    { icon: Target, label: '累计答题', value: player.totalAnswered, color: 'text-neon-cyan' },
    { icon: Flame, label: 'S 级次数', value: player.sCount, color: 'text-neon-gold' },
    { icon: Swords, label: '最高连击', value: player.maxCombo, color: 'text-neon-violet' },
    {
      icon: Timer,
      label: '总学习时长',
      value: hours > 0 ? `${hours}h ${minutes}m` : `${minutes} 分钟`,
      color: 'text-neon-emerald',
    },
  ];

  const revengeQuestions = player.revengeQueue
    .map((qid) => selectQuestion(qid))
    .filter((q): q is NonNullable<typeof q> => !!q);

  return (
    <div className="mx-auto max-w-[960px] px-6 py-8 max-md:px-4">
      {/* 头部 */}
      <motion.div
        className="glass flex items-center gap-5 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <PlayerAvatar avatarId={player.avatarId} size={72} />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-txt-primary">
              {player.nickname}
            </h1>
            <span className="tag-pill border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan">
              Lv.{level}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-2 max-w-[240px] flex-1 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet"
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <span className="text-xs text-text-muted">
              {player.exp % 250} / 250 EXP
            </span>
          </div>
        </div>
      </motion.div>

      {/* 云同步（Supabase） */}
      <div className="mt-6">
        <CloudSyncPanel />
      </div>

      {/* 数据卡片 */}
      <div className="mt-6 grid grid-cols-4 gap-4 max-md:grid-cols-2">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="glass p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
          >
            <s.icon size={20} className={`mx-auto ${s.color}`} />
            <div className="mt-2 font-display text-xl font-bold text-txt-primary">{s.value}</div>
            <div className="mt-1 text-xs text-text-muted">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* 模块掌握度 */}
      <motion.div
        className="glass mt-6 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="mb-4 font-display font-bold text-txt-primary">模块掌握度</h2>
        <div className="space-y-3">
          {floors.map((f) => {
            const mastery = getFloorMastery(player, f.id);
            return (
              <div key={f.id} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-xs text-text-secondary max-sm:w-24">
                  {f.index}F {f.name}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: f.theme.primary }}
                    initial={{ width: 0 }}
                    animate={{ width: `${mastery}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-xs text-text-muted">
                  {mastery}%
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 错题本 / 复仇队列 */}
      <motion.div
        className="glass mt-6 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="mb-4 font-display font-bold text-txt-primary">
          错题本 · 复仇队列（{revengeQuestions.length}）
        </h2>
        {revengeQuestions.length === 0 ? (
          <p className="text-sm text-text-muted">队列空空如也。保持下去。</p>
        ) : (
          <ul className="space-y-2">
            {revengeQuestions.map((q) => (
              <li key={q.id}>
                <button
                  onClick={() => navigate(`/battle/${q.id}`)}
                  className="flex w-full items-center justify-between rounded-xl border border-neon-rose/20 bg-neon-rose/5 px-4 py-3 text-left transition-colors hover:border-neon-rose/50"
                >
                  <span className="text-sm text-text-secondary">{q.title}</span>
                  <span className="shrink-0 text-xs text-neon-rose">⚔ 复仇</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* 重置进度 */}
      <div className="mt-8 flex justify-center">
        {confirming ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-neon-rose">确定要清空所有存档？此操作不可撤销。</span>
            <button
              className="rounded-xl border border-neon-rose/50 bg-neon-rose/10 px-4 py-2 text-sm text-neon-rose transition-colors hover:bg-neon-rose/20"
              onClick={() => {
                resetAll();
                navigate('/');
              }}
            >
              确定重置
            </button>
            <button className="btn-ghost" onClick={() => setConfirming(false)}>
              取消
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-text-muted transition-colors hover:border-neon-rose/40 hover:text-neon-rose"
            onClick={() => setConfirming(true)}
          >
            <RefreshCcw size={14} />
            重置进度
          </button>
        )}
      </div>
    </div>
  );
}
