import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { DoorOpen } from 'lucide-react';
import { PLANET_HUES } from './HoloPlanet';

interface Props {
  /** 已通关层数（1-7），即新解锁的进度 */
  step: number;
  floorName: string; // 刚通关的楼层名
  nextName?: string; // 新解锁的楼层名
  onClose: () => void;
}

// 通关过场：视角沿星塔攀升，「距离 Offer 大门更近一步 · x/8」
export default function UnlockCinematic({ step, floorName, nextName, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-bg-void/85 backdrop-blur-md"
    >
      {/* 中央上升光柱 */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/2 w-40 -translate-x-1/2"
        style={{
          height: '120%',
          background: `linear-gradient(0deg, ${PLANET_HUES[step - 1] ?? '#22D3EE'}26, transparent 75%)`,
          filter: 'blur(18px)',
        }}
        initial={{ y: '60%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative flex flex-col items-center px-6">
        {/* 迷你星塔进度列（8 层 + 顶端大门） */}
        <div className="relative flex flex-col-reverse items-center gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => {
            const lv = i + 1;
            const lit = lv <= step;
            const isNew = lv === step;
            const hue = PLANET_HUES[i];
            return (
              <motion.div
                key={lv}
                initial={isNew ? { scale: 0, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: isNew ? 0.7 : 0 }}
                className="relative flex items-center justify-center rounded-full border"
                style={{
                  width: isNew ? 30 : 20,
                  height: isNew ? 30 : 20,
                  borderColor: lit ? `${hue}AA` : '#33415566',
                  background: lit
                    ? `radial-gradient(circle at 35% 30%, ${hue}CC, ${hue}33 65%, transparent)`
                    : '#0C1120',
                  boxShadow: lit ? `0 0 ${isNew ? 22 : 10}px ${hue}${isNew ? 'AA' : '55'}` : undefined,
                }}
              >
                {isNew && (
                  <motion.span
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: hue }}
                    animate={{ scale: [1, 1.8], opacity: [0.9, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
          {/* 顶端 Offer 之门 */}
          <motion.div
            className="mb-1 flex h-9 w-9 items-center justify-center rounded-t-full border"
            style={{
              borderColor: '#FBBF2488',
              color: '#FBBF24',
              background: 'radial-gradient(circle at 50% 100%, #FBBF2433, transparent 70%)',
              boxShadow: '0 0 18px #FBBF2455',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <DoorOpen size={16} />
          </motion.div>
        </div>

        {/* 文案 */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-center"
        >
          <div className="font-mono text-[11px] tracking-[0.35em] text-neon-cyan/80">
            FLOOR CLEARED · {step} / 8
          </div>
          <div className="font-display mt-2 text-2xl font-bold text-txt-primary md:text-3xl">
            距离 <span className="text-neon-gold">Offer 大门</span> 更近一步
          </div>
          <div className="mt-2 text-sm text-txt-secondary">
            已征服「{floorName}」{nextName ? (
              <>，新星球 <span style={{ color: PLANET_HUES[step] ?? '#22D3EE' }}>「{nextName}」</span> 已点亮</>
            ) : '，星塔已至顶层'}
          </div>
          {/* 进度刻度 */}
          <div className="mt-4 flex justify-center gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.span
                key={i}
                className="h-1 w-7 rounded-full"
                style={{
                  background: i < step ? PLANET_HUES[i] : '#1E293B',
                  boxShadow: i < step ? `0 0 8px ${PLANET_HUES[i]}88` : undefined,
                }}
                initial={{ scaleX: 0.4, opacity: 0.4 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.1 + i * 0.07 }}
              />
            ))}
          </div>
        </motion.div>

        <div className="mt-6 font-mono text-[10px] tracking-[0.3em] text-txt-muted">
          点击任意处继续登塔
        </div>
      </div>
    </motion.div>
  );
}
