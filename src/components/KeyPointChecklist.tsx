import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { KeyPoint } from '../types';

interface Props {
  keyPoints: KeyPoint[];
  selected: string[];
  onToggle: (id: string) => void;
}

// 关键点勾选列表：选中 → 青色边框/背景 + 对勾 + 缩放弹跳
export default function KeyPointChecklist({ keyPoints, selected, onToggle }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {keyPoints.map((kp) => {
        const active = selected.includes(kp.id);
        return (
          <motion.button
            key={kp.id}
            onClick={() => onToggle(kp.id)}
            className={`flex w-full items-center gap-3 rounded-card border p-3 text-left transition-colors ${
              active
                ? 'border-neon-cyan/60 bg-neon-cyan/10 shadow-neon-cyan-sm'
                : 'border-glass bg-white/[0.02] hover:border-white/20'
            }`}
            animate={active ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.97 }}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                active ? 'border-neon-cyan bg-neon-cyan text-bg-deep' : 'border-white/25'
              }`}
            >
              {active && <Check size={13} strokeWidth={3.5} />}
            </span>
            <span
              className={`flex-1 text-sm leading-snug ${
                active ? 'text-txt-primary' : 'text-txt-secondary'
              }`}
            >
              {kp.label}
            </span>
            <span className="shrink-0 font-mono text-xs text-txt-muted">+{kp.weight}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
