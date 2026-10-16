import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, PartyPopper, X } from 'lucide-react';

interface Props {
  nickname: string;
  onClose: () => void;
}

// 彩带粒子（确定性伪随机，避免每次渲染抖动）
function useConfetti() {
  return useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        x: (i * 137.5) % 100,
        delay: (i % 12) * 0.18,
        dur: 3.2 + (i % 5) * 0.5,
        size: 4 + (i % 3) * 2,
        color: ['#22D3EE', '#8B5CF6', '#FBBF24', '#F472B6', '#34D399'][i % 5],
        drift: ((i % 7) - 3) * 14,
      })),
    [],
  );
}

// Offer 录用通知书：8 层全通关后的全息证书
export default function OfferLetter({ nickname, onClose }: Props) {
  const confetti = useConfetti();
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-bg-void/90 p-3 backdrop-blur-md"
    >
      {/* 彩带 */}
      {confetti.map((c, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute top-0 rounded-[2px]"
          style={{ left: `${c.x}%`, width: c.size, height: c.size * 0.6, background: c.color }}
          initial={{ y: '-5vh', opacity: 0, rotate: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0.6], rotate: 360 + c.drift * 10, x: c.drift }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="glass relative w-full max-w-lg overflow-hidden rounded-card border p-6 md:p-8"
        style={{
          borderColor: '#FBBF2466',
          boxShadow: '0 0 80px #FBBF2426, inset 0 1px 0 rgba(255,235,180,0.15)',
          background: 'linear-gradient(160deg, rgba(20,26,44,0.92), rgba(8,12,22,0.95))',
        }}
      >
        {/* 四角括号 */}
        {[
          'left-2 top-2 border-l-2 border-t-2',
          'right-2 top-2 border-r-2 border-t-2',
          'bottom-2 left-2 border-b-2 border-l-2',
          'bottom-2 right-2 border-b-2 border-r-2',
        ].map((cls) => (
          <span key={cls} className={`pointer-events-none absolute h-5 w-5 border-neon-gold/70 ${cls}`} />
        ))}

        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-4 top-4 z-10 rounded-btn border border-glass p-1.5 text-txt-secondary transition-all hover:text-txt-primary active:scale-90"
        >
          <X size={16} />
        </button>

        {/* 抬头 */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.25 }}
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-neon-gold/60"
            style={{ background: 'radial-gradient(circle, #FBBF2426, transparent 70%)', boxShadow: '0 0 26px #FBBF2444' }}
          >
            <PartyPopper size={24} className="text-neon-gold" />
          </motion.div>
          <div className="font-mono text-[10px] tracking-[0.5em] text-neon-gold/80">
            OFFER LETTER · 录用通知书
          </div>
          <div className="font-display mt-1.5 bg-gradient-to-b from-[#FFF3D6] via-[#FBD98A] to-[#C98F2E] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            OFFER 到手
          </div>
          <div className="mt-1 text-xs text-txt-secondary">星塔科技 · StarTower Labs 人力资源部</div>
        </div>

        {/* 正文 */}
        <div className="mt-5 space-y-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-relaxed">
          <p className="text-txt-primary">
            尊敬的 <span className="font-bold text-neon-gold">{nickname}</span>：
          </p>
          <p className="text-txt-secondary">
            恭喜你成功登顶星塔八层，以结构化思维与扎实功底通过全部面试考核。经评审委员会一致决议，正式录用你为：
          </p>
          <div className="grid grid-cols-[84px_1fr] gap-y-2 border-t border-white/8 pt-3 font-mono text-[13px]">
            <span className="text-txt-muted">职 位</span>
            <span className="text-neon-cyan">Java 后端开发工程师</span>
            <span className="text-txt-muted">薪 资</span>
            <span className="text-neon-gold">极具竞争力 · 面谈即惊喜</span>
            <span className="text-txt-muted">入职日期</span>
            <span className="text-txt-primary">即刻上岗 · 星塔第 9 层见</span>
            <span className="text-txt-muted">签发日期</span>
            <span className="text-txt-primary">{dateStr}</span>
          </div>
        </div>

        {/* 印章 + 签名 */}
        <div className="mt-4 flex items-end justify-between">
          <div className="text-xs text-txt-muted">
            <div>签发人：八位面试官 联合签发</div>
            <div className="mt-1 font-mono text-[10px] tracking-widest text-txt-muted/70">
              NO.ST-{(dateStr.replace(/\./g, ''))}-08F
            </div>
          </div>
          {/* 全息印章 */}
          <motion.div
            initial={{ scale: 2.2, opacity: 0, rotate: -24 }}
            animate={{ scale: 1, opacity: 1, rotate: -12 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.55 }}
            className="relative flex h-20 w-20 items-center justify-center rounded-full border-2"
            style={{
              borderColor: '#FB7185CC',
              color: '#FB7185',
              background: 'radial-gradient(circle, #FB718514, transparent 70%)',
              boxShadow: '0 0 24px #FB718544, inset 0 0 18px #FB718533',
            }}
          >
            <motion.div
              className="absolute inset-1 rounded-full border border-dashed"
              style={{ borderColor: '#FB718588' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            />
            <div className="flex flex-col items-center">
              <BadgeCheck size={20} />
              <span className="mt-0.5 font-mono text-[8px] font-bold tracking-[0.2em]">已录用</span>
            </div>
          </motion.div>
        </div>

        <button
          onClick={onClose}
          className="btn-neon mt-6 w-full rounded-btn py-3 font-medium"
          style={{
            background: 'linear-gradient(135deg, #FBBF24, #F472B6)',
            boxShadow: '0 0 28px #FBBF2455',
          }}
        >
          收下 Offer · 开启新征程
        </button>
      </motion.div>
    </motion.div>
  );
}
