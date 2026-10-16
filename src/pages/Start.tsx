import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig, useAnimation } from 'framer-motion';
import { Rocket, RotateCcw, Play, ArrowRight } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import PlayerAvatar, { AVATARS } from '../components/PlayerAvatar';
import HoloTitle, { HoloSubtitle } from '../components/HoloTitle';
import HoloPlanet from '../components/HoloPlanet';
import HudPanel from '../components/HudPanel';
import useIsMobile from '../hooks/useIsMobile';

// ===== 星门光环配置：多层深青 / 紫色环 + 能量弧 =====
interface Ring {
  r: number;
  color: string;
  w: number;
  dash: string;
  dur: number;
  dir: 1 | -1;
  o: number;
  blur?: 3 | 7;
}

const RINGS: Ring[] = [
  { r: 196, color: '#8B5CF6', w: 1, dash: '2 30', dur: 46, dir: 1, o: 0.28 },
  { r: 178, color: '#22D3EE', w: 1.4, dash: '10 18', dur: 34, dir: -1, o: 0.42, blur: 3 },
  { r: 158, color: '#0E7490', w: 2.4, dash: '28 20', dur: 26, dir: 1, o: 0.8 },
  { r: 138, color: '#8B5CF6', w: 1.6, dash: '6 14', dur: 30, dir: -1, o: 0.6 },
  { r: 120, color: '#22D3EE', w: 8, dash: '68 200', dur: 12, dir: 1, o: 0.45, blur: 7 },
  { r: 106, color: '#0EA5E9', w: 1.2, dash: '4 10', dur: 20, dir: -1, o: 0.5, blur: 3 },
  { r: 186, color: '#8B5CF6', w: 6, dash: '44 260', dur: 16, dir: -1, o: 0.34, blur: 7 },
  { r: 74, color: '#FBBF24', w: 1, dash: '3 22', dur: 18, dir: 1, o: 0.35 },
];

// ===== 向核心汇聚的能量火花 =====
const SPARKS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2 + (i % 3) * 0.24;
  const r0 = 176 + (i % 5) * 9;
  return {
    x0: 200 + Math.cos(a) * r0,
    y0: 200 + Math.sin(a) * r0,
    delay: (i % 7) * 0.36,
    color: i % 4 === 0 ? '#FBBF24' : i % 3 === 0 ? '#8B5CF6' : '#22D3EE',
  };
});

// 启动页：全息数据星门 + 挑战者档案 + 跃迁入场
export default function Start() {
  const navigate = useNavigate();
  const player = useGameStore((s) => s.player);
  const setNickname = useGameStore((s) => s.setNickname);
  const setAvatar = useGameStore((s) => s.setAvatar);
  const resetAll = useGameStore((s) => s.resetAll);
  const isMobile = useIsMobile();

  const [nickname, setNicknameLocal] = useState(player?.nickname ?? '');
  const [avatarId, setAvatarId] = useState(player?.avatarId ?? 'keyboard');
  const [opening, setOpening] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [freshMode, setFreshMode] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const formControls = useAnimation();

  const hasSave = !!player && !freshMode;
  const canEnter = nickname.trim().length > 0;

  const warp = (delay = 900) => {
    setOpening(true);
    window.setTimeout(() => navigate('/tower'), delay);
  };

  const enter = () => {
    if (opening) return;
    if (!canEnter) {
      // 未填昵称：星门拒斥（面板抖动 + 聚焦输入框）
      formControls.start({ x: [0, -10, 10, -7, 7, 0], transition: { duration: 0.45 } });
      inputRef.current?.focus();
      return;
    }
    setNickname(nickname.trim());
    setAvatar(avatarId);
    warp(1150);
  };

  const continueJourney = () => warp(1000);

  const restart = () => {
    resetAll();
    setConfirmReset(false);
    setFreshMode(true);
    setNicknameLocal('');
    setAvatarId('keyboard');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden px-4 py-10">
      {/* 局部星云加深（星门背后） */}
      <div
        className="pointer-events-none absolute inset-0 -z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 50% 40%, rgba(34,211,238,0.13), transparent 68%), radial-gradient(ellipse 45% 35% at 50% 74%, rgba(139,92,246,0.14), transparent 72%)',
        }}
      />

      {/* ===== 故障风标题 ===== */}
      <motion.div
        className="relative z-10 w-full max-w-full text-center"
        initial={{ opacity: 0, y: -26 }}
        animate={{ opacity: opening ? 0 : 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <HoloTitle
          text="OFFER 星塔"
          latin="OFFER TOWER · EPISODE 01"
          className="text-4xl sm:text-5xl md:text-6xl"
        />
        <div className="mt-5 flex justify-center">
          <HoloSubtitle text="直面恐惧，登顶拿 Offer" className="text-sm sm:text-lg md:text-2xl" />
        </div>
        <p className="mt-4 max-w-full px-2 text-center font-hud text-[10px] font-semibold tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.42em]">
          08 FLOORS · 77 QUESTIONS · 01 OFFER
        </p>
      </motion.div>

      {/* ===== 全息数据星门 ===== */}
      <div className="relative z-10 flex items-center justify-center" style={{ perspective: 1000 }}>
        {/* 移动端：星门全部无限动画降级为静态（reducedMotion 砍掉 repeat:Infinity 的旋转/脉冲） */}
        <MotionConfig reducedMotion={isMobile ? 'always' : 'user'}>
          {/* 跃迁光柱 */}
          <motion.div
            className="pointer-events-none absolute bottom-0 h-[70%] w-40"
            style={{
              background:
                'linear-gradient(0deg, rgba(34,211,238,0.34), rgba(139,92,246,0.16) 55%, transparent)',
              filter: 'blur(18px)',
            }}
            animate={{ opacity: opening ? 1 : [0.35, 0.6, 0.35], scaleY: opening ? 1.6 : 1 }}
            transition={
              opening
                ? { duration: 0.7 }
                : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
            }
          />

          <motion.button
            type="button"
            onClick={enter}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            aria-label="点击星门进入星塔"
            className="relative mt-8 h-[290px] w-[290px] cursor-pointer sm:h-[360px] sm:w-[360px] lg:h-[420px] lg:w-[420px]"
            animate={{
              scale: opening ? 2.4 : hovered ? 1.05 : 1,
              opacity: opening ? 0 : 1,
              filter: opening ? 'brightness(1.8)' : 'brightness(1)',
            }}
            transition={{ duration: opening ? 1.05 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 轴测平面：水平光环系统 */}
            <motion.div
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateX: opening ? 30 : 62, rotateZ: hovered ? 8 : 0 }}
              transition={{ duration: opening ? 0.8 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <svg
                viewBox="0 0 400 400"
                className="absolute inset-0 h-full w-full"
                style={{ overflow: 'visible' }}
                aria-hidden
              >
                <defs>
                  <filter id="gateBlur3" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" />
                  </filter>
                  <filter id="gateBlur7" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="7" />
                  </filter>
                  <radialGradient id="gateCore" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#22D3EE" stopOpacity="0.7" />
                    <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* 核心能量盘 */}
                <motion.circle
                  cx="200"
                  cy="200"
                  r={92}
                  fill="url(#gateCore)"
                  animate={{ opacity: hovered ? [0.55, 0.95, 0.55] : [0.4, 0.68, 0.4] }}
                  transition={{ duration: hovered ? 1.6 : 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* 多层旋转光环 */}
                {RINGS.map((ring, i) => (
                  <motion.g
                    key={i}
                    style={{ transformOrigin: '200px 200px' }}
                    animate={{ rotate: ring.dir * 360 }}
                    transition={{
                      duration: hovered ? ring.dur * 0.42 : ring.dur,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <circle
                      cx="200"
                      cy="200"
                      r={ring.r}
                      fill="none"
                      stroke={ring.color}
                      strokeWidth={ring.w}
                      strokeDasharray={ring.dash}
                      strokeOpacity={ring.o}
                      strokeLinecap="round"
                      filter={ring.blur ? `url(#gateBlur${ring.blur})` : undefined}
                    />
                  </motion.g>
                ))}

                {/* 向核心汇聚的能量火花 */}
                {SPARKS.map((s, i) => (
                  <motion.circle
                    key={`sp-${i}`}
                    r={1.8}
                    fill={s.color}
                    initial={false}
                    animate={{
                      cx: [s.x0, 200],
                      cy: [s.y0, 200],
                      opacity: [0, 0.95, 0],
                    }}
                    transition={{
                      duration: hovered ? 1.1 : 2.4,
                      repeat: Infinity,
                      delay: s.delay,
                      ease: 'easeIn',
                      times: [0, 0.75, 1],
                    }}
                    filter="url(#gateBlur3)"
                  />
                ))}
              </svg>
            </motion.div>

            {/* 垂直轨道（形成全息球体感） */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {[
                { size: '20%', dur: 26, color: '#22D3EE', o: 0.45 },
                { size: '52%', dur: 34, color: '#8B5CF6', o: 0.35 },
              ].map((v, i) => (
                <motion.div
                  key={`v-${i}`}
                  className="absolute rounded-full border"
                  style={{
                    inset: v.size,
                    borderColor: v.color,
                    opacity: v.o,
                    boxShadow: `0 0 18px ${v.color}55`,
                  }}
                  animate={{ rotateY: opening ? 900 : 360 }}
                  transition={{
                    duration: opening ? 1 : hovered ? v.dur * 0.4 : v.dur,
                    repeat: opening ? 0 : Infinity,
                    ease: 'linear',
                  }}
                />
              ))}
            </div>

            {/* 核心：珍珠能量球（跃迁入口） */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                className="relative flex h-[150px] w-[150px] items-center justify-center"
                animate={{ scale: hovered ? [1, 1.08, 1] : [1, 1.035, 1] }}
                transition={{ duration: hovered ? 1.2 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  filter: hovered
                    ? 'drop-shadow(0 0 44px rgba(34,211,238,0.6)) brightness(1.1)'
                    : 'drop-shadow(0 0 26px rgba(34,211,238,0.35))',
                }}
              >
                <HoloPlanet size={205} rings={0} hue="#9FE8FF" live={!isMobile} flare={!isMobile} />
                <span
                  className="absolute bottom-1 font-mono text-[9px] font-bold tracking-[0.28em] text-white/90"
                  style={{ textShadow: '0 0 10px rgba(34,211,238,1)' }}
                >
                  GATE
                </span>
              </motion.div>
            </div>
          </motion.button>
        </MotionConfig>
      </div>

      {/* 星门提示 */}
      <motion.p
        className="relative z-10 mt-5 font-mono text-[11px] tracking-[0.3em]"
        style={{ color: canEnter ? '#22D3EE' : '#475569' }}
        animate={{
          opacity: opening ? 0 : canEnter ? [0.55, 1, 0.55] : 1,
        }}
        transition={{ duration: 2.4, repeat: isMobile ? 0 : Infinity }}
      >
        {canEnter ? '点击星门 · 启动跃迁' : '先留下代号，星门才会开启'}
      </motion.p>

      {/* ===== 挑战者档案 HUD 面板 ===== */}
      <motion.div
        className="relative z-10 mt-6 w-full max-w-md"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: opening ? 0 : 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div animate={formControls}>
          <HudPanel title="挑战者档案" meta="IDENTITY-LOG">
            <AnimatePresence mode="wait">
              {hasSave ? (
                <motion.div
                  key="save"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <PlayerAvatar avatarId={player!.avatarId} size={44} />
                    <div>
                      <div className="font-display font-semibold tracking-wide">{player!.nickname}</div>
                      <div className="font-mono text-[11px] text-txt-secondary">
                        Lv.{player!.level} · 已推进至 {player!.unlockedFloor}F
                      </div>
                    </div>
                    <span className="ml-auto font-mono text-[10px] text-neon-cyan">
                      SAVE OK
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={continueJourney}
                      className="btn-neon flex items-center justify-center gap-2 px-6 py-3 text-base"
                    >
                      <Play size={18} /> 继续上次的征程
                    </button>
                    {confirmReset ? (
                      <div className="flex gap-2">
                        <button
                          onClick={restart}
                          className="flex-1 rounded-btn border border-neon-rose/50 bg-neon-rose/10 px-4 py-2.5 text-sm text-neon-rose transition-all hover:shadow-neon-rose"
                        >
                          确认清空存档
                        </button>
                        <button
                          onClick={() => setConfirmReset(false)}
                          className="btn-ghost flex-1 px-4 py-2.5 text-sm"
                        >
                          再想想
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmReset(true)}
                        className="btn-ghost flex items-center justify-center gap-2 px-6 py-2.5 text-sm"
                      >
                        <RotateCcw size={15} /> 重新开始
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.3em] text-txt-secondary">
                    你的代号 / NICKNAME
                  </label>
                  <input
                    ref={inputRef}
                    value={nickname}
                    onChange={(e) => setNicknameLocal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && enter()}
                    maxLength={12}
                    placeholder="输入昵称，挑战者"
                    className="w-full rounded-btn border border-glass bg-white/5 px-4 py-3 text-sm outline-none transition-all placeholder:text-txt-muted focus:border-neon-cyan/60 focus:bg-neon-cyan/5 focus:shadow-neon-cyan-sm"
                  />

                  <label className="mb-2 mt-5 block font-mono text-[10px] tracking-[0.3em] text-txt-secondary">
                    选择你的化身 / AVATAR
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {AVATARS.map((a) => {
                      const on = avatarId === a.id;
                      return (
                        <button
                          key={a.id}
                          onClick={() => setAvatarId(a.id)}
                          className="flex flex-col items-center gap-1.5 rounded-card border p-3 transition-all"
                          style={{
                            borderColor: on ? `${a.accent}AA` : 'rgba(255,255,255,0.08)',
                            background: on
                              ? `linear-gradient(160deg, ${a.accent}22, rgba(8,14,26,0.5))`
                              : 'rgba(255,255,255,0.02)',
                            boxShadow: on ? `0 0 18px -4px ${a.accent}AA` : 'none',
                          }}
                        >
                          <PlayerAvatar avatarId={a.id} size={40} />
                          <span className="text-xs font-semibold">{a.name}</span>
                          <span className="text-[10px] text-txt-muted">{a.desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={enter}
                    disabled={!canEnter}
                    className="btn-neon mt-6 flex w-full items-center justify-center gap-2 px-6 py-3.5 text-base"
                  >
                    <Rocket size={18} /> 启动跃迁 · 进入星塔
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </HudPanel>
        </motion.div>
      </motion.div>

      {/* ===== 跃迁闪光 & 冲击波 ===== */}
      <AnimatePresence>
        {opening && (
          <>
            <motion.div
              className="pointer-events-none fixed inset-0 z-[95]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.95, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.15, times: [0, 0.35, 1] }}
              style={{
                background:
                  'radial-gradient(circle at 50% 45%, #ffffff, #22D3EE 42%, rgba(139,92,246,0.35) 68%, transparent 78%)',
              }}
            />
            {[0, 0.16].map((d, i) => (
              <motion.div
                key={`warp-${i}`}
                className="pointer-events-none fixed left-1/2 top-1/2 z-[94] -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                style={{ borderColor: i ? '#8B5CF6' : '#22D3EE', boxShadow: `0 0 40px ${i ? '#8B5CF6' : '#22D3EE'}` }}
                initial={{ width: 80, height: 80, opacity: 0.9 }}
                animate={{ width: 1400, height: 1400, opacity: 0 }}
                transition={{ duration: 1.05, delay: d, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
