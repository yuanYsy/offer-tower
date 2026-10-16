import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  Crown,
  Database,
  DoorOpen,
  FolderKanban,
  Lock,
  Network,
  Siren,
  Sparkles,
  Swords,
  Wrench,
  X,
} from 'lucide-react';
import { floors } from '../data/floors';
import {
  getFloorProgress,
  isPassed,
  useGameStore,
} from '../store/useGameStore';
import type { Floor, Grade, PlayerState } from '../types';
import InterviewerAvatar from './InterviewerAvatar';
import PlayerAvatar from './PlayerAvatar';
import MapCharacter from './MapCharacter';
import HoloPlanet, { PLANET_HUES } from './HoloPlanet';
import ProgressBar from './ProgressBar';
import UnlockCinematic from './UnlockCinematic';
import OfferLetter from './OfferLetter';
import { DeckSwitcher, HoloConsole } from './HoloConsole';
import { useSound } from '../hooks/useSound';
import useIsMobile from '../hooks/useIsMobile';
import { STATIC_MODE } from '../lib/staticMode';

// 楼层特色图标
const FLOOR_ICON: Record<string, typeof Code2> = {
  Code2,
  Network,
  Database,
  Sparkles,
  FolderKanban,
  Wrench,
  Siren,
  Crown,
};

// ============ Step 1: 地图节点数据结构 ============

export interface MapNode {
  floor: Floor;
  /** 节点中心在画布中的坐标 */
  x: number;
  y: number;
  state: 'cleared' | 'current' | 'locked';
  bestGrade: Grade | null;
  clearedCount: number;
  totalCount: number;
}

// 画布尺寸（横向星域航线：1F 在左，8F 在右）
// MAP_H 收紧到刚好包住蜿蜒航线的上下极值，避免画布上下出现大片空白
export const MAP_W = 1920;
export const MAP_H = 570;
// 缩放下限：窄屏（手机）按宽度铺满会让星球小到不可读，此时保留可滚动的最小可读尺寸
const MIN_MAP_SCALE = 0.34;
const NODE_LEFT = 170; // 1F 距左侧距离
const NODE_GAP = 208;
const PATH_Y = 290; // 主路径中线（= MAP_H / 2，航线垂直居中）
const AMP = 140; // 蜿蜒振幅
// Offer 大门（航线尽头）
const GATE_X = MAP_W - 88;
const GATE_Y = PATH_Y;

/** 生成 8 个节点的蜿蜒坐标（自左向右，正弦折线） */
export function buildMapNodes(player: PlayerState | null): MapNode[] {
  return floors.map((floor, i) => {
    // 自左向右：1F x 最小（最左），8F x 最大（最右）
    const x = NODE_LEFT + i * NODE_GAP;
    const y = PATH_Y + Math.sin(i * 0.95) * AMP;
    const prog = getFloorProgress(player, floor.id);
    const unlocked = player ? floor.index <= player.unlockedFloor : floor.index === 1;
    const cleared = prog.total > 0 && prog.cleared === prog.total;
    const state: MapNode['state'] = cleared ? 'cleared' : unlocked ? 'current' : 'locked';

    // 最佳评级
    let bestGrade: Grade | null = null;
    if (player) {
      const order: Grade[] = ['S', 'A', 'B', 'C'];
      for (const g of order) {
        if (floor.questionIds.some((qid) => player.questionRecords[qid]?.bestGrade === g)) {
          bestGrade = g;
          break;
        }
      }
    }
    return { floor, x, y, state, bestGrade, clearedCount: prog.cleared, totalCount: prog.total };
  });
}

/** 生成连接所有节点的平滑路径（SVG path d，水平 S 弯） */
export function buildPathD(nodes: MapNode[]): string {
  if (nodes.length < 2) return '';
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const p = nodes[i - 1];
    const c = nodes[i];
    const mx = (p.x + c.x) / 2;
    // 三次贝塞尔，控制点水平拉出，形成平滑 S 弯
    d += ` C ${mx} ${p.y}, ${mx} ${c.y}, ${c.x} ${c.y}`;
  }
  return d;
}

/** 顶层节点 → Offer 大门 的最后一段路径 */
export function buildGateD(nodes: MapNode[]): string {
  const last = nodes[nodes.length - 1];
  if (!last) return '';
  const mx = (last.x + GATE_X) / 2;
  return `M ${last.x} ${last.y} C ${mx} ${last.y}, ${mx} ${GATE_Y}, ${GATE_X} ${GATE_Y}`;
}

// 节点配色
const STATE_COLOR: Record<MapNode['state'], string> = {
  cleared: '#22D3EE',
  current: '#FBBF24',
  locked: '#5B6E86',
};

const GRADE_COLOR: Record<Grade, string> = {
  S: '#FBBF24',
  A: '#22D3EE',
  B: '#E8EDF7',
  C: '#FB7185',
};

// 玩家形态光环层数 = 已通关层数（0-8）；静态模式/移动端直接关闭（无限旋转动画）
function HaloRings({ count, accent }: { count: number; accent: string }) {
  if (count <= 0 || STATIC_MODE) return null;
  return (
    <>
      {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            inset: -(6 + i * 5),
            borderColor: `${accent}${['55', '44', '33', '22'][i]}`,
          }}
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{
            rotate: { duration: 10 + i * 4, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
          }}
        />
      ))}
    </>
  );
}

// 静态模式下角色移动逐节点停顿缩短（无走动动画，仅保留轻微节奏）
const STEP_MS = STATIC_MODE ? 160 : 700;

// ============ 主组件 ============

export default function TowerMap() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const player = useGameStore((s) => s.player);
  const sound = useSound();

  const nodes = useMemo(() => buildMapNodes(player), [player]);
  const pathD = useMemo(() => buildPathD(nodes), [nodes]);
  const gateD = useMemo(() => buildGateD(nodes), [nodes]);

  // 玩家当前所在节点 index（初始 = 最高已解锁层）
  const currentIdx = useMemo(() => {
    if (!player) return 0;
    // 优先站在第一个「可挑战但未通关」的层，否则最高解锁层
    const firstCurrent = nodes.findIndex((n) => n.state === 'current');
    if (firstCurrent >= 0) return firstCurrent;
    return Math.min(player.unlockedFloor - 1, nodes.length - 1);
  }, [player, nodes]);

  const [playerNodeIdx, setPlayerNodeIdx] = useState(currentIdx);
  const [pathTicks, setPathTicks] = useState<number[]>([currentIdx]); // 已走到的路径刻度（用于点亮）
  const [walking, setWalking] = useState(false);
  const [arrivalFlash, setArrivalFlash] = useState<number | null>(null); // 到达闪光节点
  const [selected, setSelected] = useState<MapNode | null>(null);
  const [cineStep, setCineStep] = useState<number | null>(null); // 通关「更近一步」过场
  const [offerOpen, setOfferOpen] = useState(false); // Offer 录用通知书
  const [panelOpen, setPanelOpen] = useState(false); // 形态展示面板
  const [deck, setDeck] = useState<'cards' | 'graph' | null>(null); // 全息操作台：卡片 / 图谱

  const scrollRef = useRef<HTMLDivElement>(null);
  const flashTimer = useRef(0);
  // 到达闪光定时器：卸载时清理，避免悬挂回调与内存泄漏
  useEffect(() => () => window.clearTimeout(flashTimer.current), []);
  // 单屏自适应：按地图区「宽度 + 高度」双约束等比缩放整条航线画布
  // 桌面 / 横屏：宽度约束生效 → 8 层星球平铺整页宽、一屏内全部可见（无横向滚动、无暗色边框）
  // 窄屏：缩放到 MIN_MAP_SCALE 保底，低于保底才出现横向滚动（保证星球与文字可读）
  const areaRef = useRef<HTMLDivElement>(null);
  const [mapScale, setMapScale] = useState(1);
  const [needScroll, setNeedScroll] = useState(false);
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    let raf = 0;
    // rAF 合帧 + 同值守卫：避免 ResizeObserver 连续触发导致 setState 风暴与整树重渲染
    const fit = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w <= 0 || h <= 0) return;
        const fitScale = Math.min(w / MAP_W, h / MAP_H);
        const next = Math.max(fitScale, MIN_MAP_SCALE);
        setMapScale((prev) => (Math.abs(prev - next) > 0.002 ? next : prev));
        setNeedScroll(next > fitScale + 0.002);
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  const clearedCount = useMemo(() => nodes.filter((n) => n.state === 'cleared').length, [nodes]);

  // 已解锁路径长度（像素）：用于路径点亮动画
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(0);
  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, [pathD]);

  // 同步玩家位置（行走过程中不打扰）
  const walkingRef = useRef(false);
  useEffect(() => {
    if (walkingRef.current) return;
    setPlayerNodeIdx(currentIdx);
    setPathTicks((t) => (t.includes(currentIdx) ? t : [...t, currentIdx]));
  }, [currentIdx]);

  // 挂载后定位到航线起点（保证 1F 首屏可见；高层节点通过右侧导航舱/左右滚动到达）
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 通关庆祝（挂载时检测未庆祝过的通关数）：
  // 1-7 层 → 「距离 Offer 大门更近一步」过场；8 层全通 → Offer 录用通知书
  const markCelebrated = useGameStore((s) => s.markCelebrated);
  const markOfferSeen = useGameStore((s) => s.markOfferSeen);
  useEffect(() => {
    if (!player) return;
    const celebrated = player.celebratedClears ?? 0;
    if (clearedCount > celebrated) {
      markCelebrated(clearedCount);
      sound.unlock();
      if (clearedCount >= 8) setOfferOpen(true);
      else if (clearedCount >= 1) setCineStep(clearedCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 一步一走：沿路径逐节点移动
  const walkTo = useCallback(
    async (targetIdx: number) => {
      if (walking || targetIdx === playerNodeIdx) return;
      const from = playerNodeIdx;
      const dir = targetIdx > from ? 1 : -1;
      const steps = Math.abs(targetIdx - from);
      setWalking(true);
      walkingRef.current = true;

      // 自动滚动跟随（水平）
      const targetNode = nodes[targetIdx];
      scrollRef.current?.scrollTo({
        left: targetNode.x * mapScale - scrollRef.current.clientWidth / 2,
        behavior: 'smooth',
      });

      for (let s = 1; s <= steps; s++) {
        const next = from + dir * s;
        // 脚步声
        sound.step();
        setPlayerNodeIdx(next);
        setPathTicks((t) => (t.includes(next) ? t : [...t, next]));
        // 冲刺 420ms + 停顿 280ms，一步一顿的压迫节奏（静态模式缩短为 160ms）
        await new Promise((r) => setTimeout(r, STEP_MS));
      }
      // 到达闪光
      setArrivalFlash(targetIdx);
      sound.click();
      window.clearTimeout(flashTimer.current);
      flashTimer.current = window.setTimeout(() => setArrivalFlash(null), 900);
      setWalking(false);
      walkingRef.current = false;
    },
    [walking, playerNodeIdx, nodes, sound, mapScale],
  );

  const handleNodeClick = useCallback(
    (node: MapNode, idx: number) => {
      if (node.state === 'locked') return;
      sound.click();
      void walkTo(idx);
      // 所有已解锁楼层（含已通关/当前）都可打开详情学习，无访问限制；等角色走完再弹窗
      const steps = Math.abs(idx - playerNodeIdx);
      setTimeout(() => setSelected(node), steps * STEP_MS + 120);
    },
    [walkTo, playerNodeIdx, sound],
  );

  const centerOn = useCallback((idx: number) => {
    const node = nodes[idx];
    if (!node) return;
    scrollRef.current?.scrollTo({
      left: node.x * mapScale - (scrollRef.current?.clientWidth ?? 0) / 2,
      behavior: 'smooth',
    });
  }, [nodes, mapScale]);

  const playerNode = nodes[playerNodeIdx];
  const avatarMeta = player?.avatarId ?? 'keyboard';
  const accent =
    avatarMeta === 'coffee' ? '#FBBF24' : avatarMeta === 'backpack' ? '#8B5CF6' : '#22D3EE';

  if (!player) return null;

  return (
    // 单屏布局：与标题、底部操作台同处一个平面，flex 列填满剩余高度，无垂直滚动
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* ===== 小地图导航（右侧全息导航舱，与滚动控制统一风格） ===== */}
      <div
        className="pointer-events-auto absolute right-1.5 top-1.5 z-30 rounded-2xl border backdrop-blur-md"
        style={{
          borderColor: 'rgba(34, 211, 238, 0.22)',
          background: 'rgba(7, 12, 24, 0.72)',
          boxShadow: '0 0 18px rgba(34, 211, 238, 0.10)',
        }}
      >
        <div className="flex flex-col gap-0.5 p-1">
          {nodes.map((n, i) => (
            <button
              key={n.floor.id}
              onClick={() => {
                centerOn(i);
                if (n.state !== 'locked') void walkTo(i);
              }}
              title={`${n.floor.index}F ${n.floor.name}`}
              aria-label={`定位到 ${n.floor.index}F`}
              className="relative flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[10px] transition-all hover:scale-105 active:scale-90"
              style={{
                borderColor:
                  i === playerNodeIdx ? accent : `${STATE_COLOR[n.state]}66`,
                background:
                  n.state === 'locked'
                    ? '#0C1120'
                    : `${STATE_COLOR[n.state]}1A`,
                color:
                  n.state === 'locked' ? '#7C8DA1' : STATE_COLOR[n.state],
                boxShadow:
                  i === playerNodeIdx ? `0 0 10px ${accent}88` : undefined,
              }}
            >
              {n.state === 'locked' ? <Lock size={11} /> : `${n.floor.index}`}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 地图区（自适应填满标题与操作台之间的全部高度） ===== */}
      <div ref={areaRef} className="relative min-h-0 flex-1">
      {/* ===== 航线滚动控制（仅在窄屏保底缩放、需要横向滚动时出现） ===== */}
      {needScroll && (
        <>
          <div className="pointer-events-none absolute bottom-4 left-2 z-20">
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })
              }
              aria-label="向左滚动"
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md text-[#8FD8EF] transition-all hover:scale-105 hover:text-neon-cyan active:scale-90 md:h-10 md:w-10"
              style={{
                borderColor: 'rgba(34, 211, 238, 0.35)',
                background: 'rgba(12, 17, 32, 0.85)',
                boxShadow: '0 0 14px rgba(34, 211, 238, 0.16)',
              }}
            >
              <ChevronLeft size={18} />
            </button>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-2 z-20">
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })
              }
              aria-label="向右滚动"
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md text-[#8FD8EF] transition-all hover:scale-105 hover:text-neon-cyan active:scale-90 md:h-10 md:w-10"
              style={{
                borderColor: 'rgba(34, 211, 238, 0.35)',
                background: 'rgba(12, 17, 32, 0.85)',
                boxShadow: '0 0 14px rgba(34, 211, 238, 0.16)',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}

      {/* ===== 横向星域航线地图（1F 左侧 → 8F 右侧；等比缩放铺满整页宽，1F~8F 一屏全部可见） ===== */}
      <div
        ref={scrollRef}
        className={`flex h-full w-full items-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          needScroll ? 'justify-start overflow-x-auto' : 'justify-center overflow-x-hidden'
        }`}
        style={{ overflowY: 'hidden', touchAction: 'pan-x' }}
      >
        <div className="relative shrink-0" style={{ width: MAP_W * mapScale, height: MAP_H * mapScale }}>
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: MAP_W, height: MAP_H, transform: `scale(${mapScale})` }}
          >
          {/* 连线层 */}
          <svg
            className="absolute inset-0"
            width={MAP_W}
            height={MAP_H}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          >
            <defs>
              <filter id="beamBlur8" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
              <filter id="beamBlur3" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>

            {/* 星际航行轨道：深色轨槽 + 能量枕木 + 暗虚线中线 */}
            <path
              d={pathD}
              fill="none"
              stroke="#0B1526"
              strokeOpacity="0.9"
              strokeWidth="26"
              strokeLinecap="round"
            />
            <path
              d={pathD}
              fill="none"
              stroke="#22D3EE"
              strokeOpacity="0.09"
              strokeWidth="16"
              strokeDasharray="3 20"
              strokeLinecap="butt"
            />
            <path
              ref={pathRef}
              d={pathD}
              fill="none"
              stroke="#334155"
              strokeOpacity="0.28"
              strokeWidth="2"
              strokeDasharray="1 8"
              strokeLinecap="round"
            />
            {/* 轨道刻度（每 40px 一个刻度点，强化线路板感） */}
            <path
              d={pathD}
              fill="none"
              stroke="#8B5CF6"
              strokeOpacity="0.22"
              strokeWidth="1"
              strokeDasharray="1 40"
              strokeLinecap="round"
            />
            {/* 顶层 → Offer 大门 的最后一段轨道 */}
            <path
              d={gateD}
              fill="none"
              stroke="#0B1526"
              strokeOpacity="0.9"
              strokeWidth="26"
              strokeLinecap="round"
            />
            <path
              d={gateD}
              fill="none"
              stroke="#FBBF24"
              strokeOpacity={clearedCount >= 8 ? 0.75 : 0.14}
              strokeWidth="2"
              strokeDasharray="1 8"
              strokeLinecap="round"
            />
            {/* 已点亮霓虹光束带：外辉光 + 青色光体 + 白色高光芯（按解锁进度裁剪） */}
            {pathLen > 0 && (
              <>
                {[
                  { w: 13, c: '#22D3EE', o: 0.14, blur: 8 },
                  { w: 6.5, c: '#22D3EE', o: 0.5, blur: 3 },
                  { w: 2, c: '#F4F7FF', o: 0.95, blur: 0 },
                ].map((seg, i) => (
                  <motion.path
                    key={i}
                    d={pathD}
                    fill="none"
                    stroke={seg.c}
                    strokeOpacity={seg.o}
                    strokeWidth={seg.w}
                    strokeLinecap="round"
                    filter={seg.blur ? `url(#beamBlur${seg.blur})` : undefined}
                    initial={{ strokeDasharray: pathLen, strokeDashoffset: pathLen }}
                    animate={{
                      strokeDashoffset:
                        pathLen * (1 - (Math.max(playerNodeIdx, ...pathTicks) + 0.15) / (nodes.length - 1)),
                    }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </>
            )}
            {/* 能量波：白色/金色光脉冲沿光束流动（静态模式/移动端关闭） */}
            {!STATIC_MODE && !isMobile && (
              <>
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity="0.9"
                  strokeWidth="2.4"
                  strokeDasharray="12 260"
                  strokeLinecap="round"
                  filter="url(#beamBlur3)"
                  animate={{ strokeDashoffset: [0, -272] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: 'linear' }}
                />
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="#FBBF24"
                  strokeOpacity="0.65"
                  strokeWidth="2"
                  strokeDasharray="8 300"
                  strokeLinecap="round"
                  animate={{ strokeDashoffset: [0, -308] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: 'linear', delay: 1.4 }}
                />
              </>
            )}
          </svg>

          {/* 节点层 */}
          {nodes.map((node, i) => {
            const color = STATE_COLOR[node.state];
            const isBoss = node.floor.questionIds.length > 0;
            const bossQid = node.floor.questionIds[node.floor.questionIds.length - 1];
            const bossCleared = !!player.questionRecords[bossQid]?.bestGrade && isPassed(player.questionRecords[bossQid].bestGrade);
            const isCurrentNode = i === playerNodeIdx;
            // 每层专属星球：尺寸 / 光带层数 / 亮度随状态递进（放大铺满纵向视口）
            const planetSize =
              node.state === 'current' ? 212 : node.state === 'cleared' ? 184 : 148;

            return (
              <div
                key={node.floor.id}
                className="absolute"
                style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
              >
                {/* 每层专属星球（1F→8F 不同色相，形成向上绚染） */}
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ width: planetSize, height: planetSize }}
                >
                  <HoloPlanet
                    size={planetSize}
                    hue={PLANET_HUES[i] ?? '#8FD4F0'}
                    rings={node.state === 'current' ? 4 : node.state === 'cleared' ? 3 : 2}
                    dim={
                      node.state === 'current'
                        ? 1
                        : node.state === 'cleared'
                          ? 0.85
                          : node.state === 'locked'
                            ? 0.52
                            : 0.85
                    }
                    live={!isMobile && node.state !== 'locked'}
                    flare={!isMobile && node.state !== 'locked'}
                  />
                </div>

                {/* 到达闪光（角色走完后触发） */}
                {arrivalFlash === i && (
                  <motion.div
                    className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                    initial={{ scale: 0.4, opacity: 0.9, borderColor: `${accent}` }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                )}

                {/* 节点光晕底座 */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: 92,
                    height: 92,
                    background: `radial-gradient(circle, ${color}${node.state === 'locked' ? '20' : '26'}, transparent 70%)`,
                  }}
                  animate={
                    node.state === 'current' && !STATIC_MODE && !isMobile
                      ? { scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }
                      : { scale: 1, opacity: 0.8 }
                  }
                  transition={
                    node.state === 'current' && !STATIC_MODE && !isMobile
                      ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                      : {}
                  }
                />

                {/* 节点主体 */}
                <motion.button
                  onClick={() => handleNodeClick(node, i)}
                  disabled={node.state === 'locked'}
                  whileHover={node.state !== 'locked' ? { scale: 1.08 } : {}}
                  whileTap={node.state !== 'locked' ? { scale: 0.95 } : {}}
                  className="relative flex flex-col items-center"
                  aria-label={`${node.floor.index}F ${node.floor.name}`}
                >
                  {/* 楼层特色徽章：专属图标 + 层号 */}
                  <div className="mb-1 flex items-center gap-1.5">
                    {(() => {
                      const FloorIcon = FLOOR_ICON[node.floor.icon] ?? Code2;
                      return (
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-lg border"
                          style={{
                            borderColor: `${color}88`,
                            color: node.state === 'locked' ? '#7C8DA1' : color,
                            background: '#0C1120CC',
                            boxShadow: node.state !== 'locked' ? `0 0 10px ${color}55` : undefined,
                          }}
                        >
                          <FloorIcon size={13} />
                        </span>
                      );
                    })()}
                    <div
                      className="font-display rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold tracking-wider"
                      style={{
                        borderColor: `${color}88`,
                        color: node.state === 'locked' ? '#7C8DA1' : color,
                        background: '#0C1120CC',
                        boxShadow: node.state !== 'locked' ? `0 0 12px ${color}55` : undefined,
                      }}
                    >
                      {node.floor.index}F
                    </div>
                  </div>

                  {/* 面试官头像节点 */}
                  <div
                    className="relative rounded-full"
                    style={{
                      boxShadow:
                        node.state === 'current'
                          ? `0 0 24px ${color}88`
                          : node.state === 'cleared'
                            ? `0 0 16px ${color}55`
                            : undefined,
                    }}
                  >
                    {/* 当前可挑战：巨大能量环（双环反向旋转，静态模式/移动端关闭） */}
                    {node.state === 'current' && !STATIC_MODE && !isMobile && (
                      <>
                        <motion.div
                          className="pointer-events-none absolute -inset-5 rounded-full"
                          style={{
                            background: `conic-gradient(from 0deg, transparent 0%, ${color}CC 10%, transparent 24%, transparent 50%, ${color}99 62%, transparent 78%)`,
                            filter: 'blur(4px)',
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                          className="pointer-events-none absolute -inset-8 rounded-full"
                          style={{
                            background: `conic-gradient(from 180deg, transparent 0%, ${color}66 18%, transparent 34%)`,
                            filter: 'blur(7px)',
                          }}
                          animate={{ rotate: -360 }}
                          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                          className="pointer-events-none absolute -inset-5 rounded-full border-2"
                          style={{ borderColor: `${color}55` }}
                          animate={{ scale: [1, 1.14, 1], opacity: [0.8, 0.2, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </>
                    )}
                    {/* 轨道环（已解锁节点：旋转的虚线刻度环） */}
                    {node.state !== 'locked' && (
                      <motion.div
                        className="pointer-events-none absolute -inset-2.5 rounded-full border border-dashed"
                        style={{ borderColor: `${color}55` }}
                        animate={{ rotate: node.state === 'current' ? 360 : -360 }}
                        transition={{
                          duration: node.state === 'current' ? 16 : 40,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}
                    <div
                      style={{
                        opacity: node.state === 'locked' ? 0.4 : 1,
                        filter: node.state === 'locked' ? 'grayscale(0.8)' : undefined,
                      }}
                    >
                      <InterviewerAvatar
                        seed={node.floor.interviewer.avatarSeed}
                        size={64}
                        showRing={node.state !== 'locked'}
                        variant={node.floor.interviewer.id}
                      />
                    </div>
                    {/* 锁定遮罩 */}
                    {node.state === 'locked' && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-bg-deep/60">
                        <Lock size={18} className="text-txt-muted" />
                      </div>
                    )}
                    {/* 最佳评级徽章 */}
                    {node.bestGrade && node.state === 'cleared' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="font-display absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold"
                        style={{
                          borderColor: `${GRADE_COLOR[node.bestGrade]}AA`,
                          color: GRADE_COLOR[node.bestGrade],
                          background: '#0C1120EE',
                          boxShadow: `0 0 10px ${GRADE_COLOR[node.bestGrade]}66`,
                        }}
                      >
                        {node.bestGrade}
                      </motion.div>
                    )}
                  </div>

                  {/* 楼层名 */}
                  <div
                    className="mt-1.5 whitespace-nowrap text-center text-xs font-medium"
                    style={{ color: node.state === 'locked' ? '#7C8DA1' : '#E8EDF7' }}
                  >
                    {node.floor.name}
                  </div>
                  {/* 进度 */}
                  <div
                    className="font-mono text-[10px]"
                    style={{ color: node.state === 'locked' ? '#334155' : '#94A3B8' }}
                  >
                    {node.clearedCount}/{node.totalCount}
                  </div>

                  {/* BOSS 标识（未通关 BOSS 的可挑战层） */}
                  {node.state === 'current' && isBoss && !bossCleared && node.clearedCount >= node.totalCount - 1 && (
                    <motion.div
                      className="absolute -top-7 font-mono text-[10px] font-bold tracking-widest text-neon-rose"
                      animate={STATIC_MODE || isMobile ? { opacity: 1 } : { opacity: [0.5, 1, 0.5], y: [0, -2, 0] }}
                      transition={{ duration: 1.4, repeat: STATIC_MODE || isMobile ? 0 : Infinity }}
                    >
                      BOSS
                    </motion.div>
                  )}
                </motion.button>

                {/* 迷雾覆盖（未解锁：漂移雾团 + 暗角） */}
                {node.state === 'locked' && (
                  <motion.div
                    className="pointer-events-none absolute -inset-16"
                    animate={STATIC_MODE || isMobile ? { opacity: 0.9 } : { x: [-5, 5, -5], opacity: [0.8, 0.95, 0.8] }}
                    transition={{ duration: 7, repeat: STATIC_MODE || isMobile ? 0 : Infinity, ease: 'easeInOut' }}
                  >
                    <div
                      className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ background: 'radial-gradient(circle, rgba(12,17,32,0.92), rgba(12,17,32,0.55) 55%, transparent 75%)', filter: 'blur(6px)' }}
                    />
                    <div
                      className="absolute left-1/4 top-1/3 h-16 w-24 rounded-full"
                      style={{ background: 'rgba(20,27,46,0.75)', filter: 'blur(10px)' }}
                    />
                    <div
                      className="absolute bottom-1/4 right-1/5 h-14 w-20 rounded-full"
                      style={{ background: 'rgba(20,27,46,0.7)', filter: 'blur(12px)' }}
                    />
                  </motion.div>
                )}
              </div>
            );
          })}

          {/* ===== 航线尽头 Offer 大门 ===== */}
          <div
            className="absolute"
            style={{ left: GATE_X, top: GATE_Y, transform: 'translate(-50%, -50%)' }}
          >
            <motion.button
              onClick={() => clearedCount >= 8 && setOfferOpen(true)}
              whileHover={clearedCount >= 8 ? { scale: 1.06 } : {}}
              whileTap={clearedCount >= 8 ? { scale: 0.95 } : {}}
              className="relative flex flex-col items-center"
              aria-label="Offer 之门"
            >
              <motion.div
                className="flex h-16 w-14 items-center justify-center overflow-hidden rounded-t-full border-2"
                style={{
                  borderColor: clearedCount >= 8 ? '#FBBF24' : '#FBBF2444',
                  background:
                    clearedCount >= 8
                      ? 'linear-gradient(0deg, #FBBF2455, #FBBF2411 60%, transparent)'
                      : 'linear-gradient(0deg, #FBBF2414, transparent 70%)',
                }}
                animate={
                  clearedCount >= 8 && !STATIC_MODE && !isMobile
                    ? { boxShadow: ['0 0 24px #FBBF2455', '0 0 46px #FBBF2499', '0 0 24px #FBBF2455'] }
                    : { boxShadow: clearedCount >= 8 ? '0 0 30px #FBBF2477' : '0 0 16px #FBBF2422' }
                }
                transition={{ duration: 2.2, repeat: STATIC_MODE || isMobile ? 0 : Infinity }}
              >
                {clearedCount >= 8 ? (
                  <DoorOpen size={22} className="text-neon-gold" />
                ) : (
                  <Lock size={15} className="text-neon-gold/50" />
                )}
              </motion.div>
              <div className="mt-1 whitespace-nowrap rounded-full border border-neon-gold/40 bg-[#0C1120CC] px-2 py-0.5 font-mono text-[9px] tracking-[0.25em] text-neon-gold backdrop-blur-md">
                OFFER 之门
              </div>
            </motion.button>
          </div>

          {/* ===== 玩家角色（一步一走） ===== */}
          {playerNode && (
            <motion.div
              className="absolute z-10"
              initial={false}
              animate={{
                x: playerNode.x,
                y: playerNode.y - 74, // 站在节点上方
              }}
              transition={
                walking
                  ? { type: 'spring', stiffness: 260, damping: 24 }
                  : { type: 'spring', stiffness: 180, damping: 20 }
              }
              style={{ translateX: '-50%', translateY: '-50%' }}
            >
              {/* 呼吸浮动（行走时由角色自带颠簸，外层不做浮动） */}
              <motion.div
                animate={walking || STATIC_MODE || isMobile ? { y: 0 } : { y: [0, -5, 0] }}
                transition={{ duration: 2.2, repeat: STATIC_MODE || isMobile ? 0 : Infinity, ease: 'easeInOut' }}
                className="relative flex flex-col items-center"
              >
                {/* 成长光环 */}
                <div className="relative">
                  <HaloRings count={clearedCount} accent={accent} />
                  {/* 发光底座 */}
                  <div
                    className="absolute -inset-3 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${accent}33, transparent 70%)`,
                    }}
                  />
                  <MapCharacter avatarId={avatarMeta} size={46} walking={walking} accent={accent} />
                </div>
                {/* 影子 */}
                <motion.div
                  className="mt-1 h-1.5 w-8 rounded-full"
                  style={{ background: `${accent}44`, filter: 'blur(3px)' }}
                  animate={STATIC_MODE || isMobile ? { scaleX: 1 } : { scaleX: walking ? [1, 0.8, 1] : [1, 0.9, 1] }}
                  transition={{ duration: walking ? 0.45 : 2.2, repeat: STATIC_MODE || isMobile ? 0 : Infinity }}
                />
                {/* 昵称牌 */}
                <div
                  className="mt-1 whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[10px]"
                  style={{
                    borderColor: `${accent}55`,
                    color: accent,
                    background: '#0C1120CC',
                  }}
                >
                  {player.nickname}
                </div>
              </motion.div>
            </motion.div>
          )}
          </div>
        </div>
      </div>
      </div>

      {/* ===== 楼层详情弹窗 ===== */}
      <AnimatePresence>
        {selected && (
          <FloorDetailModal
            node={selected}
            onClose={() => setSelected(null)}
            onStart={() => {
              setSelected(null);
              navigate(`/floor/${selected.floor.id}`);
            }}
          />
        )}
      </AnimatePresence>

      {/* ===== 形态展示面板 ===== */}
      <AnimatePresence>
        {panelOpen && (
          <FormPanel
            clearedCount={clearedCount}
            accent={accent}
            avatarId={avatarMeta}
            onClose={() => setPanelOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ===== 固定悬浮全息操作台（记忆卡片 / 知识图谱 / 形态展示） ===== */}
      <HoloConsole
        accent={accent}
        clearedCount={clearedCount}
        onOpenCards={() => {
          sound.click();
          setDeck('cards');
        }}
        onOpenGraph={() => {
          sound.click();
          setDeck('graph');
        }}
        onOpenForm={() => {
          sound.click();
          setPanelOpen(true);
        }}
      />

      {/* ===== 全屏全息面板 ===== */}
      <DeckSwitcher deck={deck} onClose={() => setDeck(null)} />

      {/* ===== 通关「更近一步」过场 ===== */}
      <AnimatePresence>
        {cineStep !== null && (
          <UnlockCinematic
            step={cineStep}
            floorName={floors[cineStep - 1]?.name ?? ''}
            nextName={floors[cineStep]?.name}
            onClose={() => setCineStep(null)}
          />
        )}
      </AnimatePresence>

      {/* ===== Offer 录用通知书（8 层全通） ===== */}
      <AnimatePresence>
        {offerOpen && (
          <OfferLetter
            nickname={player.nickname}
            onClose={() => {
              setOfferOpen(false);
              markOfferSeen();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ 楼层详情弹窗 ============

function FloorDetailModal({
  node,
  onClose,
  onStart,
}: {
  node: MapNode;
  onClose: () => void;
  onStart: () => void;
}) {
  const player = useGameStore((s) => s.player);
  const favor = player?.favor[node.floor.interviewer.id] ?? 50;
  const line =
    node.floor.interviewer.lines.greet[
      Math.floor(Math.random() * node.floor.interviewer.lines.greet.length)
    ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg-deep/70 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="glass relative m-3 w-full max-w-md rounded-card border border-glass p-6"
        style={{ boxShadow: `0 0 60px ${node.floor.theme.primary}22` }}
      >
        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-4 top-4 rounded-btn border border-glass p-1.5 text-txt-secondary transition-all hover:text-txt-primary active:scale-90"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          <InterviewerAvatar
            seed={node.floor.interviewer.avatarSeed}
            size={72}
            variant={node.floor.interviewer.id}
          />
          <div className="min-w-0 flex-1">
            <div className="font-display text-lg text-txt-primary">
              {node.floor.index}F {node.floor.name}
            </div>
            <div className="text-xs text-txt-secondary">{node.floor.subtitle}</div>
            <div className="mt-1 text-sm text-txt-primary">
              {node.floor.interviewer.name} · {node.floor.interviewer.title}
            </div>
          </div>
        </div>

        {/* 台词气泡 */}
        <div className="relative mt-4 rounded-2xl border border-glass bg-bg-elevated/60 p-4 text-sm leading-relaxed text-txt-primary">
          <span className="absolute -top-2 left-6 h-3 w-3 rotate-45 border-l border-t border-glass bg-bg-elevated" />
          「{line}」
        </div>

        {/* 好感度 + 进度 */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs text-txt-secondary">
              <span>❤ 好感度</span>
              <span className="font-mono">{favor}/100</span>
            </div>
            <ProgressBar value={favor / 100} color="#FB7185" colorTo="#F472B6" height={6} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-txt-secondary">
              <span>通关进度</span>
              <span className="font-mono">
                {node.clearedCount}/{node.totalCount}
              </span>
            </div>
            <ProgressBar
              value={node.totalCount ? node.clearedCount / node.totalCount : 0}
              color={node.floor.theme.primary}
              colorTo={node.floor.theme.secondary}
              height={6}
            />
          </div>
        </div>

        <button
          onClick={onStart}
          className="btn-neon mt-6 flex w-full items-center justify-center gap-2 rounded-btn py-3 font-medium"
          style={{
            background: `linear-gradient(135deg, ${node.floor.theme.primary}, ${node.floor.theme.secondary})`,
            boxShadow: `0 0 24px ${node.floor.theme.primary}55`,
          }}
        >
          <Swords size={17} />
          开始挑战
        </button>
      </motion.div>
    </motion.div>
  );
}

// ============ 形态展示面板 ============

function FormPanel({
  clearedCount,
  accent,
  avatarId,
  onClose,
}: {
  clearedCount: number;
  accent: string;
  avatarId: string;
  onClose: () => void;
}) {
  const player = useGameStore((s) => s.player);
  const stages = [
    { need: 0, name: '初来乍到', desc: '推开星塔大门的新人' },
    { need: 1, name: '语法学徒', desc: '征服 1F，基础初成' },
    { need: 2, name: '链路行者', desc: '征服 2F，分布式入门' },
    { need: 3, name: '数据猎手', desc: '征服 3F，索引随心' },
    { need: 4, name: '炼金术士', desc: '征服 4F，驯服幻觉' },
    { need: 5, name: '项目主理', desc: '征服 5F，经历可溯' },
    { need: 6, name: '线上老兵', desc: '征服 6F，临危不乱' },
    { need: 7, name: '危机指挥官', desc: '征服 7F，掌控全局' },
    { need: 8, name: 'Offer 持有者', desc: '登顶星塔，手握 Offer' },
  ];
  const currentStage = stages[Math.min(clearedCount, 8)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="glass m-3 w-full max-w-sm rounded-card border border-glass p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="font-display text-lg text-txt-primary">形态展示</div>
          <button
            onClick={onClose}
            aria-label="关闭"
            className="rounded-btn border border-glass p-1.5 text-txt-secondary transition-all hover:text-txt-primary active:scale-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* 当前形态 */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <HaloRings count={clearedCount} accent={accent} />
            <div
              className="absolute -inset-6 rounded-full"
              style={{ background: `radial-gradient(circle, ${accent}2E, transparent 70%)` }}
            />
            <PlayerAvatar avatarId={avatarId} size={84} />
          </div>
          <div className="font-display mt-5 text-xl" style={{ color: accent }}>
            {currentStage.name}
          </div>
          <div className="mt-1 text-sm text-txt-secondary">{currentStage.desc}</div>
          <div className="mt-2 font-mono text-xs text-txt-muted">
            光环层数：{clearedCount} / 8 · Lv.{player?.level ?? 1}
          </div>
        </div>

        {/* 形态阶段列表 */}
        <div className="mt-2 max-h-56 space-y-1.5 overflow-y-auto pr-1">
          {stages.map((s) => {
            const reached = clearedCount >= s.need;
            const isCurrent = s.need === currentStage.need;
            return (
              <div
                key={s.need}
                className="flex items-center gap-3 rounded-xl border px-3 py-2"
                style={{
                  borderColor: isCurrent ? `${accent}66` : reached ? '#22D3EE22' : '#FFFFFF0D',
                  background: isCurrent ? `${accent}14` : reached ? '#22D3EE0A' : 'transparent',
                  opacity: reached ? 1 : 0.45,
                }}
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]"
                  style={{
                    borderColor: reached ? `${accent}88` : '#334155',
                    color: reached ? accent : '#7C8DA1',
                  }}
                >
                  {s.need === 0 ? '起' : `${s.need}F`}
                </div>
                <div className="min-w-0">
                  <div className="text-sm" style={{ color: reached ? '#E8EDF7' : '#64748B' }}>
                    {s.name}
                  </div>
                  <div className="truncate text-xs text-txt-muted">{s.desc}</div>
                </div>
                {isCurrent && (
                  <span className="ml-auto shrink-0 font-mono text-[10px]" style={{ color: accent }}>
                    当前
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
