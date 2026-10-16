import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useGameStore } from './store/useGameStore';
import ParticleField from './components/ParticleField';
import OfficeScene from './components/OfficeScene';
import TopBar from './components/TopBar';
import ErrorBoundary from './components/ErrorBoundary';
import useCloudSync from './hooks/useCloudSync';
import { STATIC_MODE } from './lib/staticMode';
import Start from './pages/Start';
import Tower from './pages/Tower';
import Floor from './pages/Floor';
import Battle from './pages/Battle';
import Codex from './pages/Codex';
import Exam from './pages/Exam';
import Profile from './pages/Profile';

// 页面过渡：opacity + y 位移
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

// 无存档时守卫：强制回启动页
function RequirePlayer({ children }: { children: React.ReactNode }) {
  const player = useGameStore((s) => s.player);
  if (!player) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const player = useGameStore((s) => s.player);
  const addStudyTime = useGameStore((s) => s.addStudyTime);
  const isStart = location.pathname === '/';
  // 星塔页：锁定单屏高度，标题 / 星球地图 / 底部操作台同屏紧凑排布（无垂直滚动）
  const isTower = location.pathname === '/tower';
  useCloudSync();

  // 学习时长心跳：每 30 秒累计一次；后台标签页不计时（切走即暂停，回前台自动恢复）
  useEffect(() => {
    if (!player) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      addStudyTime(30_000);
    }, 30_000);
    return () => clearInterval(timer);
  }, [player, addStudyTime]);

  return (
    // 纯静态模式：reducedMotion=always 全站冻结 framer-motion 的 transform 类循环动画
    <MotionConfig reducedMotion={STATIC_MODE ? 'always' : 'user'}>
      <div className="min-h-full font-body text-txt-primary">
        <div className="app-bg" />
        <OfficeScene />
        {/* 动态粒子 canvas 全站卸载（零 rAF、零后台占用） */}
        {!STATIC_MODE && <ParticleField />}
        <div className="app-vignette" />
        <div className="app-noise" />
        <div className="scan-over" />
        {!isStart && player && <TopBar />}

        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={
                isStart
                  ? ''
                  : isTower
                    ? // 星塔页：整页宽铺满（不受 max-w 约束），标题 / 星球地图 / 底部操作台同屏
                      'flex h-[100dvh] w-full flex-col px-3 pb-2 pt-20 md:px-5'
                    : 'mx-auto w-full max-w-content px-4 pb-16 pt-24 md:px-6'
              }
            >
              <Routes location={location}>
                <Route path="/" element={<Start />} />
                <Route path="/tower" element={<RequirePlayer><Tower /></RequirePlayer>} />
                <Route path="/floor/:floorId" element={<RequirePlayer><Floor /></RequirePlayer>} />
                <Route path="/battle/:qid" element={<RequirePlayer><Battle /></RequirePlayer>} />
                <Route path="/codex" element={<RequirePlayer><Codex /></RequirePlayer>} />
                <Route path="/exam" element={<RequirePlayer><Exam /></RequirePlayer>} />
                <Route path="/profile" element={<RequirePlayer><Profile /></RequirePlayer>} />
                <Route path="*" element={<Navigate to={player ? '/tower' : '/'} replace />} />
              </Routes>
            </motion.main>
          </AnimatePresence>
        </ErrorBoundary>
      </div>
    </MotionConfig>
  );
}
