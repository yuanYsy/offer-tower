import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, ClipboardList } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CountdownRing from '../components/CountdownRing';
import RadarChart from '../components/RadarChart';
import { floors } from '../data/floors';
import { questions } from '../data/questions';
import { getFloorMastery, useGameStore } from '../store/useGameStore';
import type { Grade, Question } from '../types';

const EXAM_SECONDS = 60;
const GRADE_SCORE: Record<Grade, number> = { S: 100, A: 80, B: 55, C: 25 };

// 从 8 层随机抽 10 题：每层至少 1 题，剩余随机补齐
function pickExamQuestions(): Question[] {
  const picked: Question[] = [];
  floors.forEach((f) => {
    const pool = questions.filter((q) => q.floorId === f.id);
    if (pool.length) picked.push(pool[Math.floor(Math.random() * pool.length)]);
  });
  const rest = questions.filter((q) => !picked.includes(q));
  while (picked.length < 10 && rest.length) {
    const i = Math.floor(Math.random() * rest.length);
    picked.push(rest.splice(i, 1)[0]);
  }
  return picked.sort(() => Math.random() - 0.5);
}

interface AnswerRecord {
  question: Question;
  grade: Grade;
  correct: boolean;
}

type Phase = 'intro' | 'running' | 'report';

// 模拟面试：连续 10 题速通，中途不看答案，结束生成面试报告
export default function Exam() {
  const navigate = useNavigate();
  const player = useGameStore((s) => s.player);
  const submitChoice = useGameStore((s) => s.submitChoice);
  const recordExam = useGameStore((s) => s.recordExam);

  const [phase, setPhase] = useState<Phase>('intro');
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(EXAM_SECONDS);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const questionStartRef = useRef(0);

  const current = examQuestions[index];

  const start = () => {
    setExamQuestions(pickExamQuestions());
    setAnswers([]);
    setIndex(0);
    setLeft(EXAM_SECONDS);
    questionStartRef.current = Date.now();
    setPhase('running');
  };

  // 提交当前题（choiceId 为 null 表示超时未答）
  const answerCurrent = (choiceId: string | null) => {
    if (!current) return;
    const timeMs = Date.now() - questionStartRef.current;
    const correctChoice = current.choices.find((c) => c.correct);
    let grade: Grade;
    if (choiceId === null) {
      // 超时按答错处理：不写入战斗记录，只记入考试
      grade = 'C';
    } else {
      const result = submitChoice(current.id, choiceId, timeMs);
      grade = result.grade;
    }
    const record: AnswerRecord = {
      question: current,
      grade,
      correct: choiceId !== null && choiceId === correctChoice?.id,
    };
    const next = [...answers, record];
    setAnswers(next);
    if (index + 1 >= examQuestions.length) {
      setPhase('report');
    } else {
      setIndex(index + 1);
      setLeft(EXAM_SECONDS);
      questionStartRef.current = Date.now();
    }
  };

  // 倒计时
  useEffect(() => {
    if (phase !== 'running') return;
    const timer = window.setInterval(() => {
      if (document.hidden) return; // 后台标签页降载：暂停倒计时（切回前台继续）
      setLeft((l) => {
        if (l <= 1) {
          window.clearInterval(timer);
          answerCurrent(null);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);

  // 报告数据
  const report = useMemo(() => {
    if (phase !== 'report' || answers.length === 0) return null;
    const total = Math.round(
      answers.reduce((s, a) => s + GRADE_SCORE[a.grade], 0) / answers.length,
    );
    const overall: Grade = total >= 90 ? 'S' : total >= 75 ? 'A' : total >= 55 ? 'B' : 'C';
    return { total, overall };
  }, [phase, answers]);

  // 记录考试
  const recordedRef = useRef(false);
  useEffect(() => {
    if (report && !recordedRef.current) {
      recordedRef.current = true;
      recordExam(report.total);
    }
  }, [report, recordExam]);

  const masteryAxes = floors.map((f) => ({
    label: f.name,
    value: getFloorMastery(player, f.id),
  }));
  const weakFloors = masteryAxes.filter((a) => a.value < 50);
  const wrongAnswers = answers.filter((a) => !a.correct);

  // ===== 开场 =====
  if (phase === 'intro') {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-[640px] flex-col items-center justify-center px-6 text-center">
        <ClipboardList size={44} className="text-neon-violet" />
        <h1 className="mt-4 font-display text-3xl font-bold gradient-text">模拟面试</h1>
        <p className="mt-3 leading-relaxed text-text-secondary">
          从 8 层随机抽取 10 道题，每题 60 秒速答。
          <br />
          中途无法查看答案，超时按答错处理。准备好了吗？
        </p>
        {player && player.examCount > 0 && (
          <p className="mt-2 text-xs text-txt-muted">
            历史最好成绩：{player.bestExamScore} 分 · 已考 {player.examCount} 次
          </p>
        )}
        <button className="btn-neon mt-8" onClick={start}>
          开始面试
        </button>
      </div>
    );
  }

  // ===== 报告中 =====
  if (phase === 'report' && report) {
    const comment =
      report.overall === 'S'
        ? '全场面试官一致通过。你的知识体系已经成型，去收割 Offer 吧。'
        : report.overall === 'A'
          ? '整体扎实，个别模块还有毛边。针对性补强后即可上岸。'
          : report.overall === 'B'
            ? '框架有了，但深度不够。建议把薄弱楼层的 BOSS 题逐个击破。'
            : '基础尚不牢固，建议回到星塔从低层重新打地基，别急着海投。';
    return (
      <motion.div
        className="mx-auto max-w-[960px] px-6 py-10 max-md:px-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="glass p-8 text-center">
          <div className="text-sm text-text-secondary">面试报告 · 综合得分</div>
          <div className="mt-2 font-display text-6xl font-bold gradient-text">{report.total}</div>
          <div
            className={`mt-1 font-display text-2xl font-bold ${
              report.overall === 'S'
                ? 'text-neon-gold'
                : report.overall === 'A'
                  ? 'text-neon-cyan'
                  : report.overall === 'B'
                      ? 'text-txt-primary'
                      : 'text-neon-rose'
            }`}
          >
            综合评级 {report.overall}
          </div>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
            {comment}
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* 雷达图 */}
          <div className="glass p-6">
            <h3 className="mb-2 font-display font-bold text-txt-primary">模块掌握度</h3>
            <RadarChart axes={masteryAxes} size={300} />
          </div>
          {/* 薄弱环节 */}
          <div className="glass p-6">
            <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-txt-primary">
              <AlertTriangle size={16} className="text-neon-rose" />
              薄弱环节
            </h3>
            {weakFloors.length === 0 ? (
              <p className="text-sm text-neon-emerald">没有明显短板，保持手感。</p>
            ) : (
              <ul className="space-y-3">
                {weakFloors.map((a) => {
                  const floor = floors.find((f) => f.name === a.label)!;
                  return (
                    <li key={a.label}>
                      <Link
                        to={`/floor/${floor.id}`}
                        className="flex items-center justify-between rounded-xl border border-white/8 px-4 py-3 transition-colors hover:border-neon-rose/40"
                      >
                        <span className="text-sm text-txt-primary">
                          {floor.index}F {a.label}
                        </span>
                        <span className="text-xs text-neon-rose">掌握度 {a.value}%</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* 建议复习 */}
        {wrongAnswers.length > 0 && (
          <div className="glass mt-6 p-6">
            <h3 className="mb-4 font-display font-bold text-txt-primary">
              建议复习（{wrongAnswers.length} 题）
            </h3>
            <ul className="space-y-2">
              {wrongAnswers.map((a) => (
                <li key={a.question.id}>
                  <button
                    onClick={() => navigate(`/battle/${a.question.id}`)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/8 px-4 py-3 text-left transition-colors hover:border-neon-cyan/40"
                  >
                    <span className="text-sm text-text-secondary">{a.question.title}</span>
                    <ArrowRight size={14} className="shrink-0 text-neon-cyan" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <button className="btn-neon" onClick={start}>
            再考一次
          </button>
          <Link to="/tower" className="btn-ghost">
            回星塔
          </Link>
        </div>
      </motion.div>
    );
  }

  // ===== 答题中 =====
  return (
    <div className="mx-auto max-w-[760px] px-6 py-10 max-md:px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={current?.id ?? 'done'}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              第 <span className="font-display font-bold text-neon-cyan">{index + 1}</span> /{' '}
              {examQuestions.length} 题
            </span>
            <CountdownRing total={EXAM_SECONDS} left={left} size={72} />
          </div>
          <div className="glass p-8">
            <h2 className="font-display text-lg font-bold leading-relaxed text-txt-primary md:text-xl">
              {current?.title}
            </h2>
            <div className="mt-6 space-y-3">
              {current?.choices.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => answerCurrent(c.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/8 px-4 py-3.5 text-left text-sm text-text-secondary transition-all hover:border-neon-cyan/50 hover:bg-neon-cyan/5 hover:text-txt-primary active:scale-[0.98]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 font-mono text-xs">
                    {i + 1}
                  </span>
                  {c.text}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-txt-muted">
            模拟面试中无法查看答案 · 超时自动判错
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
