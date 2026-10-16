import { motion } from 'framer-motion';
import TowerMap from '../components/TowerMap';
import HoloTitle, { HoloSubtitle } from '../components/HoloTitle';

// 主大厅：星塔地图
export default function Tower() {
  return (
    // 单屏布局：标题区（紧凑）+ 地图区（填满剩余高度）处于同一视觉平面
    <div className="flex min-h-0 flex-1 flex-col">
      <motion.div
        className="mb-1 shrink-0 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <HoloTitle
          text="星 塔"
          latin="OFFER TOWER · FLOOR 01—08"
          className="text-3xl md:text-4xl"
        />
        <div className="mt-2 flex justify-center">
          <HoloSubtitle text="直面恐惧，登顶拿 Offer" className="text-xs md:text-sm" />
        </div>
        <p className="mt-1.5 font-hud text-[10px] font-semibold tracking-[0.4em] text-white/40">
          越往上，问题越狠
        </p>
      </motion.div>
      <TowerMap />
    </div>
  );
}
