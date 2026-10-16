import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Code2,
  Crown,
  Database,
  FolderKanban,
  Network,
  Siren,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';
import { graphEdges, graphNodes } from '../data/knowledgeGraph';
import { getFloor } from '../data/floors';
import { STATIC_MODE } from '../lib/staticMode';
import { getProjectCard } from '../data/projectCards';
import { useGameStore } from '../store/useGameStore';
import useIsMobile from '../hooks/useIsMobile';
import type { GraphLayer, GraphNode } from '../types';

// ============ 布局常量 ============
// 列式分簇布局：4 个模块各占一列，知识点在列内纵排，项目在顶层
const W = 960;
const H = 590;
const CLUSTER_X = (i: number) => 120 + i * 240; // 4 列中心
const MODULE_Y = 516;
const POINT_ROW_Y = (k: number) => 424 - k * 92; // 列内知识点行（自下而上）
const PROJECT_Y = 88;
const PROJECT_X = [280, 680];

const LAYER_COLOR: Record<GraphLayer, string> = {
  module: '#22D3EE',
  point: '#8B5CF6',
  project: '#FBBF24',
};

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

// 模块主色 = 该层面试官主题色（1F 青 / 2F 紫 / 3F 绿 / 4F 粉）
function moduleColor(n: GraphNode) {
  const floor = n.floorId ? getFloor(n.floorId) : null;
  return floor?.interviewer.avatarSeed ?? LAYER_COLOR.module;
}

interface ClusterInfo {
  module: GraphNode;
  points: GraphNode[];
  color: string;
  x: number;
  floorIndex: number;
  icon: string;
}

// 计算节点坐标：按模块分列，列内知识点纵排，顶层为项目
function layout(nodes: GraphNode[]) {
  const modules = nodes
    .filter((n) => n.layer === 'module')
    .sort((a, b) => (getFloor(a.floorId!)?.index ?? 0) - (getFloor(b.floorId!)?.index ?? 0));
  const projects = nodes.filter((n) => n.layer === 'project');

  const pos = new Map<string, { x: number; y: number }>();
  const clusters: ClusterInfo[] = [];

  modules.forEach((m, i) => {
    const x = CLUSTER_X(i);
    const floor = m.floorId ? getFloor(m.floorId) : null;
    const points = graphEdges
      .filter((e) => e.from === m.id)
      .map((e) => nodes.find((n) => n.id === e.to)!)
      .filter(Boolean);
    pos.set(m.id, { x, y: MODULE_Y });
    points.forEach((p, k) => pos.set(p.id, { x, y: POINT_ROW_Y(k) }));
    clusters.push({
      module: m,
      points,
      color: moduleColor(m),
      x,
      floorIndex: floor?.index ?? i + 1,
      icon: floor?.icon ?? 'Code2',
    });
  });

  projects.forEach((p, i) => pos.set(p.id, { x: PROJECT_X[i] ?? W / 2, y: PROJECT_Y }));
  return { pos, clusters };
}

// 贝塞尔连线路径
function edgePath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const my = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
}

interface Props {
  onOpenCard?: (cardId: string) => void;
}

// 知识图谱：分簇列式（模块列 → 列内知识点 → 顶层项目），点击知识点高亮并连线到项目
export default function KnowledgeGraph({ onOpenCard }: Props) {
  const player = useGameStore((s) => s.player);
  const owned = useMemo(() => new Set(player?.cards ?? []), [player?.cards]);
  const { pos, clusters } = useMemo(() => layout(graphNodes), []);
  const [active, setActive] = useState<string | null>(null); // 选中的知识点 id
  const isMobile = useIsMobile();
  const [cardDetail, setCardDetail] = useState<string | null>(null);

  // 当前高亮的节点与边集合
  const { hotNodes, hotEdges } = useMemo(() => {
    if (!active) return { hotNodes: new Set<string>(), hotEdges: new Set<string>() };
    const hn = new Set<string>([active]);
    const he = new Set<string>();
    graphEdges.forEach((e, i) => {
      if (e.from === active || e.to === active) {
        he.add(String(i));
        hn.add(e.from);
        hn.add(e.to);
        // 级联：知识点 → 同时高亮其模块与项目
        graphEdges.forEach((e2, j) => {
          if (e2.from === e.to || e2.to === e.from || e2.from === e.from || e2.to === e.to) {
            if (e2.from === active || e2.to === active || hn.has(e2.from) || hn.has(e2.to)) {
              he.add(String(j));
              hn.add(e2.from);
              hn.add(e2.to);
            }
          }
        });
      }
    });
    return { hotNodes: hn, hotEdges: he };
  }, [active]);

  const nodeById = (id: string) => graphNodes.find((n) => n.id === id)!;
  const activeProjectCard = cardDetail ? getProjectCard(cardDetail) : null;

  const handleNodeClick = (n: GraphNode) => {
    if (n.layer === 'project') {
      // 点击项目：弹出对应项目卡（需已解锁）
      if (n.cardId && owned.has(n.cardId)) setCardDetail(n.cardId);
      else if (n.cardId) onOpenCard?.(n.cardId);
      return;
    }
    if (n.layer === 'point') {
      setActive((a) => (a === n.id ? null : n.id));
      return;
    }
    // module：选中该模块下第一个知识点
    const first = graphEdges.find((e) => e.from === n.id);
    if (first) setActive(first.to);
  };

  return (
    <div className="relative">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-[11px] text-txt-secondary">
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full" style={{ background: LAYER_COLOR.module }} /> 模块
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full" style={{ background: LAYER_COLOR.point }} /> 知识点
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full" style={{ background: LAYER_COLOR.project }} /> 项目实战
        </span>
        <span className="ml-auto hidden text-txt-muted sm:inline">点击知识点，看它在项目里怎么落地</span>
      </div>

      {!isMobile ? (
      <div className="glass overflow-x-auto rounded-2xl border border-glass p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[680px]" width="100%">
          <defs>
            <filter id="kg-glow">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 模块分簇背板 */}
          {clusters.map((c) => (
            <g key={`cluster-${c.module.id}`} opacity={active ? 0.5 : 1} style={{ transition: 'opacity 0.3s' }}>
              <rect
                x={c.x - 106}
                y={192}
                width={212}
                height={386}
                rx={20}
                fill={c.color}
                fillOpacity={0.05}
                stroke={c.color}
                strokeOpacity={0.16}
                strokeDasharray="5 6"
              />
              <text
                x={c.x - 90}
                y={216}
                fontSize="10"
                fontWeight={700}
                fill={c.color}
                fillOpacity={0.55}
                style={{ fontFamily: 'monospace', letterSpacing: '0.15em' }}
              >
                {c.floorIndex}F
              </text>
            </g>
          ))}

          {/* 连线 */}
          {graphEdges.map((e, i) => {
            const a = pos.get(e.from)!;
            const b = pos.get(e.to)!;
            const hot = hotEdges.has(String(i));
            const dim = active && !hot;
            const fromNode = nodeById(e.from);
            const baseColor =
              fromNode.layer === 'module' ? moduleColor(fromNode) : '#334155';
            return (
              <motion.path
                key={i}
                d={edgePath(a, b)}
                fill="none"
                stroke={hot ? LAYER_COLOR.project : baseColor}
                strokeWidth={hot ? 2 : 1}
                strokeOpacity={dim ? 0.1 : hot ? 0.9 : 0.32}
                filter={hot ? 'url(#kg-glow)' : undefined}
                initial={false}
                animate={{ strokeOpacity: dim ? 0.1 : hot ? 0.9 : 0.32 }}
                transition={{ duration: 0.3 }}
              />
            );
          })}

          {/* 节点 */}
          {graphNodes.map((n) => {
            const p = pos.get(n.id)!;
            const color = n.layer === 'module' ? moduleColor(n) : LAYER_COLOR[n.layer];
            const hot = !active || hotNodes.has(n.id);
            const isActive = active === n.id;
            const r = n.layer === 'module' ? 26 : n.layer === 'project' ? 22 : 13;
            const lockedProject = n.layer === 'project' && n.cardId && !owned.has(n.cardId);
            const ModIcon =
              n.layer === 'module'
                ? FLOOR_ICON[clusters.find((c) => c.module.id === n.id)?.icon ?? 'Code2']
                : null;

            return (
              <g
                key={n.id}
                transform={`translate(${p.x}, ${p.y})`}
                onClick={() => handleNodeClick(n)}
                className="cursor-pointer"
                style={{ opacity: hot ? 1 : 0.25, transition: 'opacity 0.3s' }}
              >
                {/* 光晕 */}
                {isActive && (
                  <motion.circle
                    r={r + 10}
                    fill="none"
                    stroke={color}
                    strokeOpacity="0.5"
                    animate={STATIC_MODE ? { strokeOpacity: 0.5 } : { r: [r + 6, r + 12, r + 6], strokeOpacity: [0.6, 0.15, 0.6] }}
                    transition={STATIC_MODE ? undefined : { duration: 1.6, repeat: Infinity }}
                  />
                )}
                <motion.circle
                  r={r}
                  fill="#0C1120"
                  stroke={color}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeOpacity={hot ? 0.9 : 0.4}
                  whileHover={{ scale: 1.12 }}
                  style={{ filter: isActive ? `drop-shadow(0 0 8px ${color})` : undefined }}
                />
                {/* 模块：楼层特色图标 */}
                {ModIcon && (
                  <ModIcon
                    x={-9}
                    y={-9}
                    width={18}
                    height={18}
                    color={color}
                    strokeWidth={1.8}
                  />
                )}
                {/* 项目锁 */}
                {lockedProject && (
                  <text y="4" textAnchor="middle" fontSize="11" fill="#475569">
                    🔒
                  </text>
                )}
                {/* 标签 */}
                <text
                  y={r + 16}
                  textAnchor="middle"
                  fontSize={n.layer === 'point' ? 10 : 12}
                  fontWeight={n.layer === 'point' ? 400 : 700}
                  fill={hot ? '#E8EDF7' : '#64748B'}
                >
                  {n.label}
                </text>
                {n.layer !== 'point' && n.desc && (
                  <text y={r + 30} textAnchor="middle" fontSize="9" fill="#475569">
                    {n.desc}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      ) : (
        /* ===== 移动端：竖排树状卡片流（上下滑动，无横向溢出） ===== */
        <div className="space-y-3">
          {/* 顶层：项目实战 */}
          {graphNodes
            .filter((n) => n.layer === 'project')
            .map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-2xl border border-neon-gold/35 bg-neon-gold/5 p-3"
              >
                <Crown size={16} className="shrink-0 text-neon-gold" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-neon-gold">{p.label}</div>
                  {p.desc && <div className="truncate text-[11px] text-txt-secondary">{p.desc}</div>}
                </div>
                {p.cardId && (
                  <button
                    onClick={() =>
                      owned.has(p.cardId!) ? setCardDetail(p.cardId!) : onOpenCard?.(p.cardId!)
                    }
                    className="shrink-0 rounded-full border border-neon-gold/40 px-2.5 py-1.5 text-[11px] text-neon-gold transition-all active:scale-95"
                  >
                    {owned.has(p.cardId!) ? '查看话术' : '通关解锁'}
                  </button>
                )}
              </div>
            ))}

          {/* 模块 → 知识点：竖排树 */}
          {clusters.map((c) => {
            const Icon = FLOOR_ICON[c.icon];
            return (
              <div
                key={c.module.id}
                className="rounded-2xl border p-3"
                style={{ borderColor: `${c.color}3D`, background: `${c.color}0C` }}
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon size={15} style={{ color: c.color }} />}
                  <span className="text-sm font-bold" style={{ color: c.color }}>
                    {c.module.label}
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-txt-muted">
                    {c.floorIndex}F
                  </span>
                </div>
                <div className="mt-2 space-y-1.5 border-l-2 pl-3" style={{ borderColor: `${c.color}4D` }}>
                  {c.points.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => setActive(active === pt.id ? null : pt.id)}
                      className={`block w-full rounded-lg border px-3 py-2.5 text-left text-xs transition-all active:scale-[0.98] ${
                        active === pt.id
                          ? 'border-neon-violet/50 bg-neon-violet/10 text-neon-violet'
                          : 'border-white/10 bg-white/[0.03] text-txt-secondary'
                      }`}
                    >
                      {pt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 选中知识点的说明条 */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="glass mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-neon-violet/40 p-3 text-xs"
          >
            <span className="font-bold text-neon-violet">{nodeById(active).label}</span>
            <span className="text-txt-secondary">在项目中的落地：</span>
            {graphEdges
              .filter((e) => e.from === active)
              .map((e) => nodeById(e.to))
              .filter((n) => n.layer === 'project')
              .map((n) => {
                const unlocked = n.cardId && owned.has(n.cardId);
                return (
                  <button
                    key={n.id}
                    onClick={() => n.cardId && (unlocked ? setCardDetail(n.cardId) : onOpenCard?.(n.cardId))}
                    className={`rounded-full border px-2.5 py-1 transition-all active:scale-95 ${
                      unlocked
                        ? 'border-neon-gold/50 bg-neon-gold/10 text-neon-gold hover:shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                        : 'border-white/10 text-txt-muted'
                    }`}
                  >
                    {n.label} {unlocked ? '· 查看话术' : '🔒 通关解锁'}
                  </button>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 项目卡详情弹窗 */}
      <AnimatePresence>
        {activeProjectCard && (
          <ProjectCardModal card={activeProjectCard} onClose={() => setCardDetail(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// 项目卡详情弹窗（正反面）
function ProjectCardModal({
  card,
  onClose,
}: {
  card: NonNullable<ReturnType<typeof getProjectCard>>;
  onClose: () => void;
}) {
  const [showBack, setShowBack] = useState(false);
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.85, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full border border-neon-gold/50 bg-neon-gold/10 px-3 py-1 text-xs text-neon-gold">
            {card.projectContext} · 项目实战映射卡
          </span>
          <button
            className="rounded-full p-1.5 text-txt-secondary hover:bg-white/10 hover:text-txt-primary"
            onClick={onClose}
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>

        <div className="glass rounded-card border border-neon-gold/40 p-5 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
          <div className="font-display text-lg font-bold text-neon-gold">{card.title}</div>

          {/* 正反面切换 */}
          <div className="mt-3 flex gap-2">
            {(['front', 'back'] as const).map((side) => (
              <button
                key={side}
                onClick={() => setShowBack(side === 'back')}
                className={`rounded-full border px-3 py-1 text-xs transition-all ${
                  (side === 'back') === showBack
                    ? 'border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan'
                    : 'border-white/10 text-txt-secondary hover:text-txt-primary'
                }`}
              >
                {side === 'front' ? '八股考点' : '项目话术'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={showBack ? 'back' : 'front'}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="mt-4 max-h-64 overflow-y-auto"
            >
              {!showBack ? (
                <p className="text-sm leading-relaxed text-txt-primary">{card.frontPoint}</p>
              ) : (
                <p className="text-sm leading-relaxed text-txt-secondary">{card.content}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
