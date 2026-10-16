import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Castle, ClipboardList, Swords, User, Volume2, VolumeX } from 'lucide-react';
import { useGameStore, getLevelProgress, MAX_HP } from '../store/useGameStore';
import { questions } from '../data/questions';
import { isPassed } from '../store/useGameStore';
import PlayerAvatar from './PlayerAvatar';
import ProgressBar from './ProgressBar';

// 顶部固定状态栏
export default function TopBar() {
  const player = useGameStore((s) => s.player)!;
  const toggleSound = useGameStore((s) => s.toggleSound);
  const navigate = useNavigate();
  const location = useLocation();

  const cleared = questions.filter((q) => {
    const r = player.questionRecords[q.id];
    return r && isPassed(r.bestGrade);
  }).length;
  const totalPct = cleared / questions.length;
  const expPct = getLevelProgress(player.exp);

  const navs = [
    { to: '/tower', label: '星塔', icon: Castle },
    { to: '/exam', label: '模拟面试', icon: Swords },
    { to: '/codex', label: '图鉴', icon: BookOpen },
    { to: '/profile', label: '档案', icon: User },
  ];

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b border-neon-cyan/15 bg-bg-void/72 backdrop-blur-2xl"
      style={{
        boxShadow:
          '0 10px 40px -22px rgba(0,0,0,0.95), 0 1px 0 rgba(34,211,238,0.22), 0 12px 34px -24px rgba(34,211,238,0.45)',
      }}
    >
      {/* 顶部全息扫描条 */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #22D3EE, #8B5CF6, transparent)', opacity: 0.5 }}
      />
      <div className="mx-auto flex h-16 w-full max-w-content items-center gap-3 px-4 md:gap-5 md:px-6">
        {/* 返回上一步（浏览器历史可后退时显示） */}
        {location.key !== 'default' && (
          <button
            onClick={() => navigate(-1)}
            title="返回上一步"
            aria-label="返回上一步"
            className="shrink-0 rounded-btn border border-glass p-2 text-txt-secondary transition-all hover:border-neon-cyan/40 hover:text-neon-cyan active:scale-95"
          >
            <ArrowLeft size={17} />
          </button>
        )}

        {/* 玩家信息 */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 rounded-btn px-1 py-1 transition-colors hover:bg-white/5"
        >
          <PlayerAvatar avatarId={player.avatarId} size={38} />
          <div className="hidden text-left sm:block">
            <div className="flex items-center gap-1.5 text-sm font-semibold leading-tight">
              <span className="max-w-[80px] truncate">{player.nickname}</span>
              <span className="rounded-full bg-neon-violet/20 px-1.5 py-px font-mono text-[10px] text-neon-violet">
                Lv.{player.level}
              </span>
            </div>
            <div className="mt-1 w-24">
              <ProgressBar value={expPct} height={4} showGlow={false} />
            </div>
          </div>
        </button>

        {/* HP + 总进度（桌面端） */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex gap-0.5 text-sm" title={`HP ${player.hp}/${MAX_HP}`}>
            {Array.from({ length: MAX_HP }).map((_, i) => (
              <span key={i} className={i < player.hp ? 'text-neon-rose' : 'text-txt-muted'}>
                ♥
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-28">
              <ProgressBar value={totalPct} color="#FBBF24" colorTo="#22D3EE" height={6} />
            </div>
            <span className="font-mono text-xs text-txt-secondary">
              {cleared}/{questions.length}
            </span>
          </div>
        </div>

        <div className="flex-1" />

        {/* 导航 */}
        <nav className="flex items-center gap-1">
          {navs.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 rounded-btn px-2.5 py-2 text-xs transition-all md:text-sm ${
                  active
                    ? 'bg-neon-cyan/15 text-neon-cyan shadow-neon-cyan-sm'
                    : 'text-txt-secondary hover:bg-white/5 hover:text-txt-primary'
                }`}
              >
                <Icon size={16} />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            );
          })}
          <button
            onClick={toggleSound}
            className="rounded-btn p-2 text-txt-secondary transition-colors hover:bg-white/5 hover:text-txt-primary"
            title={player.soundOn ? '关闭音效' : '开启音效'}
          >
            {player.soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </nav>

        {/* 移动端总进度 */}
        <span className="font-mono text-xs text-txt-secondary md:hidden">
          <ClipboardList size={12} className="mr-1 inline" />
          {Math.round(totalPct * 100)}%
        </span>
      </div>
    </header>
  );
}
