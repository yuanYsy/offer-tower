import { useMemo } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Crown, Heart, Swords } from 'lucide-react';
import { getFloor } from '../data/floors';
import { questions } from '../data/questions';
import { isPassed, useGameStore } from '../store/useGameStore';
import type { Grade } from '../types';
import InterviewerAvatar from '../components/InterviewerAvatar';
import HoloPlanet, { PLANET_HUES } from '../components/HoloPlanet';
import useIsMobile from '../hooks/useIsMobile';
import TypewriterText from '../components/TypewriterText';
import ProgressBar from '../components/ProgressBar';

const GRADE_STYLE: Record<Grade, string> = {
  S: 'border-neon-gold/60 bg-neon-gold/10 text-neon-gold',
  A: 'border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan',
  B: 'border-white/25 bg-white/5 text-txt-secondary',
  C: 'border-neon-rose/60 bg-neon-rose/10 text-neon-rose',
};

// 楼层详情：面试官立绘 + 好感度 + 题目列表
export default function Floor() {
  const { floorId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const player = useGameStore((s) => s.player)!;
  const floor = getFloor(floorId ?? '');

  const floorQuestions = useMemo(
    () =>
      floor
        ? floor.questionIds
            .map((id) => questions.find((q) => q.id === id))
            .filter((q): q is NonNullable<typeof q> => !!q)
            .sort((a, b) => a.order - b.order)
        : [],
    [floor],
  );

  if (!floor) return <Navigate to="/tower" replace />;

  const favor = player.favor[floor.interviewer.id] ?? 50;
  const clearedCount = floorQuestions.filter((q) => {
    const r = player.questionRecords[q.id];
    return r && isPassed(r.bestGrade);
  }).length;
  const allCleared = clearedCount === floorQuestions.length;
  const firstUnpassed = floorQuestions.find((q) => {
    const r = player.questionRecords[q.id];
    return !r || !isPassed(r.bestGrade);
  });

  return (
    <div className="relative">
      {/* 本层专属星球背景（与地图节点同色相，右上角悬停） */}
      <div
        className="pointer-events-none absolute -top-24 right-[-70px] z-0 opacity-75 md:-top-28 md:right-[-30px]"
        aria-hidden
      >
        <div className="origin-top-right scale-[0.62] md:scale-100">
          <HoloPlanet
            size={430}
            hue={PLANET_HUES[floor.index - 1] ?? '#4FD6FF'}
            rings={3}
            dim={0.42}
            live={!isMobile}
            flare={!isMobile}
          />
        </div>
      </div>

      <button
        onClick={() => navigate('/tower')}
        className="mb-4 flex items-center gap-1.5 text-sm text-txt-secondary transition-colors hover:text-neon-cyan"
      >
        <ArrowLeft size={15} /> 返回星塔
      </button>

      <div className="grid gap-5 md:grid-cols-[300px_1fr]">
        {/* 左：面试官 */}
        <motion.div
          className="glass flex flex-col items-center p-6"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <InterviewerAvatar seed={floor.interviewer.avatarSeed} size={170} enter variant={floor.interviewer.id} />
          <div className="mt-4 text-center">
            <div className="font-display text-xl font-bold">{floor.interviewer.name}</div>
            <div className="mt-0.5 text-xs tracking-widest" style={{ color: floor.theme.primary }}>
              {floor.interviewer.title}
            </div>
          </div>

          {/* 台词气泡 */}
          <div className="relative mt-5 w-full rounded-card border border-glass bg-white/[0.03] p-3.5 text-sm leading-relaxed text-txt-secondary">
            <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-glass bg-bg-elevated" />
            <TypewriterText
              text={`你来了。这一层有 ${floorQuestions.length} 道题，我一道都不会放水。`}
              speed={35}
            />
          </div>

          {/* 好感度 */}
          <div className="mt-5 w-full">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-neon-rose">
                <Heart size={13} fill="currentColor" /> 好感度
              </span>
              <span className="font-mono text-txt-secondary">{favor}/100</span>
            </div>
            <ProgressBar value={favor / 100} color="#FB7185" colorTo="#F472B6" height={6} />
          </div>

          <div className="mt-4 w-full text-center text-xs text-txt-muted">
            进度 {clearedCount}/{floorQuestions.length}
          </div>
        </motion.div>

        {/* 右：题目列表 */}
        <div className="flex flex-col gap-2.5">
          {floorQuestions.map((q, i) => {
            const rec = player.questionRecords[q.id];
            const passed = rec && isPassed(rec.bestGrade);
            const isRevenge = player.revengeQueue.includes(q.id) && !passed;
            return (
              <motion.button
                key={q.id}
                onClick={() => navigate(`/battle/${q.id}`)}
                className={`glass group relative w-full p-4 text-left transition-all hover:-translate-y-0.5 hover:border-neon-cyan/40 hover:shadow-neon-cyan-sm ${
                  q.isBoss ? 'border-neon-gold/40 md:p-5' : ''
                } ${isRevenge ? 'animate-pulse border-neon-rose/60' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileTap={{ scale: 0.985 }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold ${
                      q.isBoss
                        ? 'border-neon-gold/50 bg-neon-gold/10 text-neon-gold'
                        : 'border-glass bg-white/[0.03] text-txt-secondary'
                    }`}
                  >
                    {q.isBoss ? <Crown size={15} /> : String(q.order).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-txt-primary group-hover:text-neon-cyan">
                      {q.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-txt-muted">
                      <span className="text-neon-gold">{'★'.repeat(q.difficulty)}</span>
                      {isRevenge && (
                        <span className="flex items-center gap-1 text-neon-rose">
                          <Swords size={11} /> 复仇题
                        </span>
                      )}
                      {q.isBoss && <span className="text-neon-gold">BOSS</span>}
                    </div>
                  </div>
                  {passed ? (
                    <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-bold ${GRADE_STYLE[rec!.bestGrade]}`}>
                      <CheckCircle2 size={13} className="text-neon-emerald" />
                      {rec!.bestGrade}
                    </span>
                  ) : rec ? (
                    <span className={`rounded-full border px-2.5 py-1 font-mono text-xs font-bold ${GRADE_STYLE[rec.bestGrade]}`}>
                      {rec.bestGrade}
                    </span>
                  ) : (
                    <span className="rounded-full border border-glass px-2.5 py-1 text-xs text-txt-muted">
                      未挑战
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}

          {/* 底部行动区 */}
          <motion.div
            className="mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {allCleared ? (
              <div className="glass flex flex-col items-center gap-3 border-neon-gold/40 p-5 text-center">
                <div className="font-display text-lg font-bold text-neon-gold">
                  本层已征服
                </div>
                <p className="text-xs text-txt-secondary">
                  {floor.interviewer.name} 对你刮目相看
                  {floor.index < 8 ? `，${floor.index + 1}F 已解锁` : '，塔顶就在眼前'}
                </p>
                <div className="text-xs text-neon-gold/80">已获该层项目实战映射卡，可去图鉴查看</div>
              </div>
            ) : (
              <button
                onClick={() => firstUnpassed && navigate(`/battle/${firstUnpassed.id}`)}
                className="btn-neon flex w-full items-center justify-center gap-2 px-6 py-4 text-lg"
              >
                <Swords size={20} /> 开始挑战
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
