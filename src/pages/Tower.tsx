import { motion } from 'framer-motion';
import TowerMap from '../components/TowerMap';
import HoloTitle, { HoloSubtitle } from '../components/HoloTitle';

// 主大厅：星塔地图
export default function Tower() {
  return (
    <div>
      <motion.div
        className="mb-6 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <HoloTitle
          text="星 塔"
          latin="OFFER TOWER · FLOOR 01—08"
          className="text-4xl md:text-6xl"
        />
        <div className="mt-4 flex justify-center">
          <HoloSubtitle text="直面恐惧，登顶拿 Offer" className="text-sm md:text-xl" />
        </div>
        <p className="mt-3 font-hud text-[11px] font-semibold tracking-[0.4em] text-white/40">
          越往上，问题越狠
        </p>
      </motion.div>
      <TowerMap />
    </div>
  );
}
