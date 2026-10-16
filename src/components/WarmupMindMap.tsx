import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Zap } from 'lucide-react';
import type { Question } from '../types';

// ============ 布局 ============
const W = 640;
const H = 380;
const CX = W / 2;
const CY = H / 2;

interface MapNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

// 精简关键词：取关键短词（去标点、截断）
function shortLabel(s: string, max = 9) {
  const clean = s.replace(/[，。、；：？！「」『』（）()]/g, ' ').trim();
  const first = clean.split(/\s+/)[0] || clean;
  return first.length > max ? first.slice(0, max) : first;
}

// 由题目生成思维导图节点：中心词 + 环绕关键词
function buildNodes(question: Question): { center: MapNode; leaves: MapNode[] } {
  const center: MapNode = {
    id: 'center',
    label: shortLabel(question.tags[0] ?? question.title, 10),
    x: CX,
    y: CY,
  };

  // 关键词来源：tags(除第一个) + 前几个关键点的短标签，去重取 5 个
  const kws: string[] = [];
  question.tags.slice(1).forEach((t) => kws.push(shortLabel(t, 8)));
  question.keyPoints.slice(0, 4).forEach((kp) => kws.push(shortLabel(kp.label, 8)));
  const uniq = [...new Set(kws)].filter((k) => k && k !== center.label).slice(0, 5);

  // 环绕分布：椭圆轨迹，从上方开始顺时针
  const rx = 200;
  const ry = 118;
  const leaves: MapNode[] = uniq.map((label, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / uniq.length;
    return {
      id: `leaf-${i}`,
      label,
      x: CX + rx * Math.cos(angle),
      y: CY + ry * Math.sin(angle),
    };
  });

  return { center, leaves };
}

function edgePath(a: MapNode, b: MapNode) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} Q ${mx} ${my - 18}, ${b.x} ${b.y}`;
}

interface Props {
  question: Question;
  /** 动画播放完成回调（全部节点弹出后） */
  onDone?: () => void;
}

// 战前热身：思维导图关键词依次弹出 + 连线生长 + 进度回看 + 重新演示
export default function WarmupMindMap({ question, onDone }: Props) {
  const { center, leaves } = useMemo(() => buildNodes(question), [question]);
  const [shown, setShown] = useState(0); // 已弹出的叶子数
  const [playing, setPlaying] = useState(true); // 自动播放中
  const [runId, setRunId] = useState(0); // 重新演示计数
  const STEP = 620;
  const complete = shown >= leaves.length;

  // 自动播放调度（question 变化 / 重新演示 时重跑）
  useEffect(() => {
    setShown(0);
    if (!playing) return;
    const timers: number[] = [];
    for (let i = 1; i <= leaves.length; i++) {
      timers.push(window.setTimeout(() => setShown(i), i * STEP));
    }
    timers.push(
      window.setTimeout(() => {
        setPlaying(false);
        onDone?.();
      }, leaves.length * STEP + 500),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, runId]);

  const replay = useCallback(() => {
    setRunId((r) => r + 1);
    setPlaying(true);
  }, []);

  // 拖动进度条：暂停自动播放，手动回看
  const scrub = useCallback((v: number) => {
    setPlaying(false);
    setShown(v);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      {/* 演示完成：屏幕震动 + 准备就绪 */}
      <motion.div
        className="glass relative overflow-hidden rounded-card border border-glass"
        animate={
          complete && runId >= 0
            ? { x: [0, -7, 7, -4, 4, -2, 2, 0] }
            : { x: 0 }
        }
        transition={{ duration: 0.5 }}
        key={`shake-${runId}`}
      >
        <div className="pointer-events-none absolute left-3 top-2.5 z-10 font-mono text-[10px] tracking-widest text-neon-cyan/70">
          战前热身 · 关键词速览
        </div>
        {/* 完成徽章 */}
        <AnimatePresence>
          {complete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.4, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="absolute right-3 top-2.5 z-10 flex items-center gap-1.5 rounded-full border border-neon-gold/60 bg-neon-gold/15 px-3 py-1 text-xs font-bold text-neon-gold shadow-[0_0_16px_rgba(251,191,36,0.4)]"
            >
              <Zap size={12} /> 准备就绪
            </motion.div>
          )}
        </AnimatePresence>

        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
          <defs>
            <filter id="wm-glow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="wm-center" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#22D3EE33" />
              <stop offset="100%" stopColor="#0C1120" />
            </radialGradient>
          </defs>

          {/* 连线（随节点弹出而生长） */}
          {leaves.slice(0, shown).map((leaf, i) => (
            <motion.path
              key={leaf.id}
              d={edgePath(center, leaf)}
              fill="none"
              stroke="#8B5CF6"
              strokeOpacity="0.55"
              strokeWidth="1.5"
              filter="url(#wm-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
            />
          ))}

          {/* 中心节点 */}
          <g transform={`translate(${center.x}, ${center.y})`}>
            <motion.circle
              r="46"
              fill="url(#wm-center)"
              stroke="#22D3EE"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              style={{ filter: 'drop-shadow(0 0 14px rgba(34,211,238,0.5))' }}
            />
            <motion.text
              textAnchor="middle"
              dy="5"
              fontSize="15"
              fontWeight="700"
              fill="#22D3EE"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {center.label}
            </motion.text>
          </g>

          {/* 叶子节点：弹簧依次弹出 */}
          {leaves.map((leaf, i) => {
            const visible = i < shown;
            return (
              <g key={leaf.id} transform={`translate(${leaf.x}, ${leaf.y})`}>
                <motion.circle
                  r="30"
                  fill="#141B2E"
                  stroke="#8B5CF6"
                  strokeWidth="1.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={visible ? { scale: 1, opacity: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.45))' }}
                />
                <motion.text
                  textAnchor="middle"
                  dy="4"
                  fontSize="11.5"
                  fontWeight="600"
                  fill="#C4B5FD"
                  initial={{ opacity: 0 }}
                  animate={visible ? { opacity: 1 } : {}}
                  transition={{ delay: 0.15 }}
                >
                  {leaf.label}
                </motion.text>
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* 控制条：进度回看 + 重新演示 */}
      <div className="mx-auto mt-3 flex w-full max-w-[640px] items-center gap-3 px-1">
        <input
          type="range"
          min={0}
          max={leaves.length}
          value={shown}
          onChange={(e) => scrub(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-neon-cyan"
          aria-label="回看进度"
        />
        <span className="font-mono text-[10px] text-txt-muted">
          {shown}/{leaves.length}
        </span>
        <button
          onClick={replay}
          className="flex shrink-0 items-center gap-1 rounded-btn border border-glass px-2.5 py-1.5 text-xs text-txt-secondary transition-all hover:border-neon-cyan/40 hover:text-neon-cyan active:scale-95"
        >
          <RotateCcw size={12} /> 重新演示
        </button>
      </div>
    </div>
  );
}
