import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { Clock, Mic, Zap, Eye, AlertTriangle, ArrowLeft } from 'lucide-react';
import { questions } from '../data/questions';
import { getFloor } from '../data/floors';
import {
  isPassed,
  predictGrade,
  useGameStore,
  MAX_HP,
} from '../store/useGameStore';
import type { BattleResult, Grade } from '../types';
import InterviewerAvatar from '../components/InterviewerAvatar';
import HoloPlanet, { PLANET_HUES } from '../components/HoloPlanet';
import useIsMobile from '../hooks/useIsMobile';
import TypewriterText from '../components/TypewriterText';
import CountdownRing from '../components/CountdownRing';
import KeyPointChecklist from '../components/KeyPointChecklist';
import GradeReveal from '../components/GradeReveal';
import WarmupMindMap from '../components/WarmupMindMap';
import { useSound } from '../hooks/useSound';

type Phase = 'warmup' | 'ask' | 'prepare' | 'oral' | 'choices' | 'selfcheck' | 'reveal';

const ORAL_SECONDS = 60;
const PREPARE_SECONDS = 30;

const GRADE_BADGE: Record<Grade, string> = {
  S: 'text-neon-gold',
  A: 'text-neon-cyan',
  B: 'text-txt-secondary',
  C: 'text-neon-rose',
};

// 命中率数字滚动
function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);
  return <>{display}</>;
}

// 答案文本关键词高亮（按 tags 匹配）
function HighlightedAnswer({ text, keywords }: { text: string; keywords: string[] }) {
  const parts = useMemo(() => {
    const kws = [...new Set(keywords)].filter(Boolean).sort((a, b) => b.length - a.length);
    if (!kws.length) return [text];
    const escaped = kws.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const re = new RegExp(`(${escaped.join('|')})`, 'gi');
    return text.split(re);
  }, [text, keywords]);
  const kwSet = useMemo(() => new Set(keywords.map((k) => k.toLowerCase())), [keywords]);
  return (
    <>
      {parts.map((p, i) =>
        kwSet.has(p.toLowerCase()) ? (
          <span key={i} className="kw">{p}</span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export default function Battle() {
  const { qid } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const player = useGameStore((s) => s.player)!;
  const submitSelfCheck = useGameStore((s) => s.submitSelfCheck);
  const submitChoice = useGameStore((s) => s.submitChoice);
  const nextQuestion = useGameStore((s) => s.nextQuestion);
  const sound = useSound();

  const question = questions.find((q) => q.id === qid);
  const floor = question ? getFloor(question.floorId) : undefined;

  const [phase, setPhase] = useState<Phase>('warmup');
  const [left, setLeft] = useState(ORAL_SECONDS);
  const [extended, setExtended] = useState(false);
  const [selectedKps, setSelectedKps] = useState<string[]>([]);
  const [result, setResult] = useState<BattleResult | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [typed, setTyped] = useState(false);
  const [warmupDone, setWarmupDone] = useState(false);
  const [prepareLeft, setPrepareLeft] = useState(PREPARE_SECONDS);
  const choiceStartRef = useRef<number>(0);

  const totalSeconds = extended ? ORAL_SECONDS + 30 : ORAL_SECONDS;

  // 楼层内进度
  const floorQuestions = useMemo(
    () =>
      floor
        ? floor.questionIds
            .map((id) => questions.find((q) => q.id === id))
            .filter((q): q is NonNullable<typeof q> => !!q)
        : [],
    [floor],
  );
  const indexInFloor = question ? floorQuestions.findIndex((q) => q.id === question.id) + 1 : 0;

  // 切题时重置全部状态
  useEffect(() => {
    setPhase('warmup');
    setLeft(ORAL_SECONDS);
    setExtended(false);
    setSelectedKps([]);
    setResult(null);
    setConfirmExit(false);
    setTyped(false);
    setWarmupDone(false);
    setPrepareLeft(PREPARE_SECONDS);
  }, [qid]);

  // 思绪整理倒计时（实战模式热身后）
  useEffect(() => {
    if (phase !== 'prepare') return;
    const timer = window.setInterval(() => {
      setPrepareLeft((s) => {
        if (s <= 0.2) {
          window.clearInterval(timer);
          setPhase('oral');
          return 0;
        }
        return s - 0.2;
      });
    }, 200);
    return () => window.clearInterval(timer);
  }, [phase]);

  // 口述倒计时
  useEffect(() => {
    if (phase !== 'oral') return;
    const timer = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 0.2) {
          window.clearInterval(timer);
          setPhase('selfcheck');
          return 0;
        }
        return s - 0.2;
      });
    }, 200);
    return () => window.clearInterval(timer);
  }, [phase]);

  const finishOral = useCallback(() => setPhase('selfcheck'), []);

  // 键盘快捷键
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (phase !== 'reveal') setConfirmExit((v) => !v);
        return;
      }
      if (confirmExit) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (phase === 'warmup') setWarmupDone(true);
        else if (phase === 'ask') setPhase('prepare');
        else if (phase === 'prepare') setPhase('oral');
        else if (phase === 'oral') finishOral();
        return;
      }
      if (phase === 'choices' && question && /^[1-4]$/.test(e.key)) {
        const idx = Number(e.key) - 1;
        const choice = question.choices[idx];
        if (choice) pickChoice(choice.id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, confirmExit, question, finishOral]);

  if (!question || !floor) return <Navigate to="/tower" replace />;

  const interviewer = floor.interviewer;

  const startChoices = () => {
    choiceStartRef.current = Date.now();
    setPhase('choices');
  };

  const pickChoice = (choiceId: string) => {
    if (phase !== 'choices') return;
    const elapsed = Date.now() - choiceStartRef.current;
    const r = submitChoice(question.id, choiceId, elapsed);
    setResult(r);
    setPhase('reveal');
    if (r.grade === 'C') sound.wrong();
    else sound.correct();
    if (r.droppedCardId) sound.chest();
  };

  const toggleKp = (id: string) =>
    setSelectedKps((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const submitCheck = () => {
    const r = submitSelfCheck(question.id, selectedKps);
    setResult(r);
    setPhase('reveal');
    if (r.grade === 'C') sound.wrong();
    else sound.correct();
    if (r.droppedCardId) sound.chest();
  };

  // 实时预估
  const totalWeight = question.keyPoints.reduce((s, k) => s + k.weight, 0);
  const hitWeight = question.keyPoints
    .filter((k) => selectedKps.includes(k.id))
    .reduce((s, k) => s + k.weight, 0);
  const hitRate = totalWeight ? hitWeight / totalWeight : 0;
  const estimated = predictGrade(hitRate);

  const nextId = result ? nextQuestion(question.id) : null;

  const exitToFloor = () => navigate(`/floor/${floor.id}`);

  return (
    <div className="relative">
      {/* 本层专属星球背景（与地图节点同色相，右上角悬停，压暗不抢焦点） */}
      <div
        className="pointer-events-none absolute -top-24 right-[-80px] z-0 opacity-60 md:-top-28 md:right-[-40px]"
        aria-hidden
      >
        <div className="origin-top-right scale-[0.6] md:scale-100">
          <HoloPlanet
            size={430}
            hue={PLANET_HUES[floor.index - 1] ?? '#4FD6FF'}
            rings={3}
            dim={0.35}
            live={!isMobile}
            flare={!isMobile}
          />
        </div>
      </div>

      {/* 顶部：进度 + HP */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 退出对战（可见按钮，触发与 Esc 相同的二次确认） */}
          <button
            onClick={() => setConfirmExit(true)}
            title="退出对战"
            aria-label="退出对战"
            className="flex items-center gap-1 rounded-btn border border-glass p-2 text-txt-secondary transition-all hover:border-neon-rose/40 hover:text-neon-rose active:scale-95"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="font-mono text-xs text-txt-secondary">
            {floor.index}F · 第 {indexInFloor} / {floorQuestions.length} 题
          </span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/5 md:w-40">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet"
              initial={{ width: 0 }}
              animate={{ width: `${(indexInFloor / floorQuestions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1 text-base">
          {Array.from({ length: MAX_HP }).map((_, i) => (
            <motion.span
              key={`${i}-${player.hp}`}
              initial={i === player.hp && result?.hpLost ? { scale: 1.6, rotate: 20 } : false}
              animate={{ scale: 1, rotate: 0 }}
              className={i < player.hp ? 'text-neon-rose' : 'text-txt-muted'}
            >
              {i < player.hp ? '❤' : '♡'}
            </motion.span>
          ))}
          {result?.hpLost && (
            <motion.span
              className="absolute text-lg"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -28, opacity: 0 }}
              transition={{ duration: 1 }}
            >
              💔
            </motion.span>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ============ 战前热身：思维导图关键词演示 ============ */}
        {phase === 'warmup' && (
          <motion.div
            key="warmup"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex flex-col items-center py-4"
          >
            {/* 步骤条 */}
            <div className="mb-5 flex items-center gap-2 font-mono text-[10px] tracking-widest">
              <span className="flex items-center gap-1.5 text-neon-cyan">
                <i className="h-1.5 w-1.5 rounded-full bg-neon-cyan" /> 热身预习
              </span>
              <span className="h-px w-8 bg-white/15" />
              <span className="text-txt-muted">提问</span>
              <span className="h-px w-8 bg-white/15" />
              <span className="text-txt-muted">对战</span>
            </div>

            <WarmupMindMap question={question} onDone={() => setWarmupDone(true)} />

            <p className="mt-4 max-w-md text-center text-sm text-txt-secondary">
              这是本题的采分关键词，先在心里过一遍它们的关联。
            </p>

            <button
              onClick={() => setPhase('ask')}
              disabled={!warmupDone}
              className={`mt-6 px-8 py-3.5 text-base transition-all ${
                warmupDone ? 'btn-neon' : 'btn-ghost cursor-not-allowed opacity-40'
              }`}
            >
              {warmupDone ? '我准备好了' : '观看中…'}
            </button>
            <button
              onClick={() => setPhase('ask')}
              className="mt-2.5 text-xs text-txt-muted transition-colors hover:text-txt-secondary"
            >
              跳过热身
            </button>
            <p className="mt-2 text-center text-[10px] text-txt-muted">空格 = 完成观看</p>
          </motion.div>
        )}

        {/* ============ 思绪整理（实战模式，30s） ============ */}
        {phase === 'prepare' && (
          <motion.div
            key="prepare"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex flex-col items-center py-8"
          >
            <CountdownRing total={PREPARE_SECONDS} left={prepareLeft} size={180} stroke={6}>
              <div className="flex flex-col items-center justify-center">
                <div className="font-display text-4xl font-bold text-neon-cyan">
                  {Math.ceil(prepareLeft)}
                </div>
                <div className="mt-1 text-[10px] tracking-widest text-txt-muted">思绪整理</div>
              </div>
            </CountdownRing>

            <div className="mt-6 max-w-md text-center">
              <div className="font-display text-lg font-semibold">{question.title}</div>
              <p className="mt-2 text-sm text-txt-secondary">
                把刚才的关键词在脑子里串成一段话。计时结束自动进入 60 秒口述。
              </p>
            </div>

            <button onClick={() => setPhase('oral')} className="btn-neon mt-7 px-8 py-3.5 text-base">
              直接开始口述
            </button>
            <p className="mt-2 text-center text-[10px] text-txt-muted">空格 = 直接开始</p>
          </motion.div>
        )}

        {/* ============ 状态 A：提问中 ============ */}
        {phase === 'ask' && (
          <motion.div
            key="ask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid gap-6 md:grid-cols-[220px_1fr]"
          >
            <div className="flex flex-col items-center">
              <InterviewerAvatar seed={interviewer.avatarSeed} size={150} enter variant={interviewer.id} />
              <div className="mt-3 text-center">
                <div className="font-display font-bold">{interviewer.name}</div>
                <div className="text-xs text-txt-muted">{interviewer.title}</div>
              </div>
            </div>

            <div className="flex flex-col">
              {/* 打字机台词 */}
              <div className="glass relative p-4 text-sm leading-relaxed text-txt-secondary">
                <div className="absolute -left-1.5 top-6 h-3 w-3 rotate-45 border-b border-l border-glass bg-bg-elevated md:block hidden" />
                <TypewriterText
                  text={question.interviewerLine}
                  speed={35}
                  onComplete={() => setTyped(true)}
                />
              </div>

              {/* 题目卡片 */}
              <motion.div
                className="glass mt-4 border-neon-cyan/25 p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-2 flex items-center justify-center gap-2 text-[11px] text-txt-muted">
                  <span className="text-neon-gold">{'★'.repeat(question.difficulty)}</span>
                  {question.isBoss && <span className="text-neon-gold">BOSS 题</span>}
                  {question.tags.map((t) => (
                    <span key={t} className="tag-pill">{t}</span>
                  ))}
                </div>
                <h2 className="font-display text-xl font-semibold leading-relaxed md:text-2xl">
                  {question.title}
                </h2>
              </motion.div>

              {/* 模式选择 */}
              <motion.div
                className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <button
                  onClick={() => setPhase('prepare')}
                  className="btn-neon flex items-center justify-center gap-2 px-5 py-4"
                >
                  <Mic size={18} /> 实战模式 · 我口述
                  <span className="rounded-full bg-neon-gold/20 px-2 py-0.5 text-[10px] text-neon-gold">
                    经验 ×1.5
                  </span>
                </button>
                <button
                  onClick={startChoices}
                  className="btn-ghost flex items-center justify-center gap-2 px-5 py-4 hover:border-neon-violet/50 hover:shadow-neon-violet"
                >
                  <Zap size={18} className="text-neon-violet" /> 速通模式 · 选择题
                </button>
              </motion.div>
              <button
                onClick={() => setPhase('selfcheck')}
                className="mt-3 flex items-center justify-center gap-1.5 text-xs text-txt-muted transition-colors hover:text-txt-secondary"
              >
                <Eye size={12} /> 跳过，直接看答案
              </button>
              <p className="mt-2 text-center text-[10px] text-txt-muted">
                空格 = 开始口述 · Esc = 退出对战
              </p>
            </div>
          </motion.div>
        )}

        {/* ============ 状态 B：口述倒计时 ============ */}
        {phase === 'oral' && (
          <motion.div
            key="oral"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex flex-col items-center py-6"
          >
            <CountdownRing total={totalSeconds} left={left} size={200} stroke={7}>
              <InterviewerAvatar seed={interviewer.avatarSeed} size={168} showRing={false} variant={interviewer.id} />
            </CountdownRing>

            <div className="mt-6 max-w-md text-center">
              <div className="font-display text-lg font-semibold">{question.title}</div>
              <p className="mt-2 text-sm text-txt-secondary">
                在心里或出声把答案讲完整，覆盖越多的采分点，评级越高。
              </p>
            </div>

            <div className="mt-7 flex flex-col items-center gap-3">
              <button onClick={finishOral} className="btn-neon px-8 py-3.5 text-base">
                我口述完了，亮出答案
              </button>
              <button
                onClick={() => {
                  setExtended(true);
                  setLeft((s) => s + 30);
                }}
                disabled={extended}
                className="btn-ghost flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-30"
              >
                <Clock size={14} /> 延长 30 秒（{extended ? '已用' : '限一次'}）
              </button>
              <p className="text-[10px] text-txt-muted">空格 = 直接亮答案</p>
            </div>
          </motion.div>
        )}

        {/* ============ 速通模式：选择题 ============ */}
        {phase === 'choices' && (
          <motion.div
            key="choices"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="mx-auto max-w-2xl"
          >
            <div className="glass border-neon-violet/25 p-6">
              <div className="mb-1 text-center text-xs text-neon-violet">速通模式 · 选对即过，10 秒内答对直升 S</div>
              <h2 className="text-center font-display text-xl font-semibold leading-relaxed">
                {question.title}
              </h2>
            </div>
            <div className="mt-4 grid gap-2.5">
              {question.choices.map((c, i) => (
                <motion.button
                  key={c.id}
                  onClick={() => pickChoice(c.id)}
                  className="glass group flex items-start gap-3 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-neon-violet/50 hover:shadow-neon-violet"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-neon-violet/40 bg-neon-violet/10 font-mono text-sm text-neon-violet">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-txt-primary group-hover:text-white">
                    {c.text}
                  </span>
                </motion.button>
              ))}
            </div>
            <p className="mt-3 text-center text-[10px] text-txt-muted">按数字键 1-4 快速作答</p>
          </motion.div>
        )}

        {/* ============ 状态 C：关键词自检 ============ */}
        {phase === 'selfcheck' && (
          <motion.div
            key="selfcheck"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="mx-auto max-w-2xl"
          >
            {/* 实时预估 */}
            <div className="glass mb-4 flex items-center justify-between px-4 py-3 font-mono text-sm">
              <span className="text-txt-secondary">
                命中 <span className="text-neon-cyan">{selectedKps.length}/{question.keyPoints.length}</span>
              </span>
              <span className="text-txt-secondary">
                命中率 <span className="text-neon-cyan"><CountUp value={hitRate * 100} />%</span>
              </span>
              <span className="text-txt-secondary">
                预计 <span className={`font-bold ${GRADE_BADGE[estimated]}`}>{estimated} 级</span>
              </span>
            </div>

            {/* 标准答案 */}
            <div className="glass p-5">
              <div className="mb-2 text-xs tracking-widest text-txt-muted">标准答案 · 对照你的口述</div>
              <div className="max-h-[40vh] overflow-y-auto pr-2 text-sm leading-7 text-txt-secondary">
                <HighlightedAnswer
                  text={question.standardAnswer}
                  keywords={[...question.tags, ...question.keyPoints.map((k) => k.label)]}
                />
              </div>
            </div>

            {/* 关键点勾选 */}
            <div className="mt-4">
              <div className="mb-2 text-xs tracking-widest text-txt-muted">
                诚实勾选：这些采分点，你刚才说到了几个？
              </div>
              <KeyPointChecklist
                keyPoints={question.keyPoints}
                selected={selectedKps}
                onToggle={toggleKp}
              />
            </div>

            <button onClick={submitCheck} className="btn-neon mt-5 w-full px-6 py-4 text-base">
              提交评分
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ 状态 D：评级揭晓 ============ */}
      <AnimatePresence>
        {phase === 'reveal' && result && (
          <GradeReveal
            result={result}
            interviewer={interviewer}
            hasNext={!!nextId}
            onNext={() => nextId && navigate(`/battle/${nextId}`)}
            onExit={exitToFloor}
            onProfile={() => navigate('/profile')}
          />
        )}
      </AnimatePresence>

      {/* Esc 退出二次确认 */}
      <AnimatePresence>
        {confirmExit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmExit(false)}
          >
            <motion.div
              className="glass w-full max-w-xs p-6 text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <AlertTriangle className="mx-auto text-neon-gold" size={28} />
              <div className="mt-3 font-display font-bold">退出本场对战？</div>
              <p className="mt-1.5 text-xs text-txt-secondary">本题不会计入成绩</p>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={exitToFloor}
                  className="flex-1 rounded-btn border border-neon-rose/50 bg-neon-rose/10 px-4 py-2.5 text-sm text-neon-rose transition-all hover:shadow-neon-rose"
                >
                  退出
                </button>
                <button onClick={() => setConfirmExit(false)} className="btn-ghost flex-1 px-4 py-2.5 text-sm">
                  继续战斗
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
