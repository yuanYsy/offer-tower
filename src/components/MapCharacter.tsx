import { motion } from 'framer-motion';
import AstronautFigure from './AstronautFigure';

interface Props {
  avatarId: string; // keyboard / coffee / backpack
  size?: number;
  /** 走路时身体颠簸 */
  walking?: boolean;
  accent?: string;
}

const ACCENTS: Record<string, string> = {
  keyboard: '#22D3EE',
  coffee: '#FBBF24',
  backpack: '#8B5CF6',
};

// 登塔地图上的玩家角色：背面宇航员，迈步姿态 + 行走颠簸
export default function MapCharacter({ avatarId, size = 52, walking = false, accent }: Props) {
  const ac = accent ?? ACCENTS[avatarId] ?? ACCENTS.keyboard;

  return (
    <div className="relative" style={{ width: size, height: size * 1.25 }}>
      {/* 底部光圈 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: -4,
          width: size * 0.85,
          height: size * 0.18,
          background: `radial-gradient(ellipse, ${ac}55, transparent 70%)`,
        }}
      />

      <motion.div
        className="relative h-full w-full"
        animate={walking ? { y: [0, -3, 0] } : { y: [0, -2.5, 0] }}
        transition={{
          duration: walking ? 0.36 : 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <AstronautFigure pose="walk" accent={ac} />
      </motion.div>
    </div>
  );
}
