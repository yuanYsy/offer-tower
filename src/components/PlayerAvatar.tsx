import { Backpack, Coffee, Keyboard } from 'lucide-react';
import AstronautFigure from './AstronautFigure';

export const AVATARS = [
  { id: 'keyboard', name: '键盘侠', desc: '手速即是正义', accent: '#22D3EE' },
  { id: 'coffee', name: '咖啡续命', desc: '血液里 80% 是美式', accent: '#FBBF24' },
  { id: 'backpack', name: '双肩包战神', desc: '背着整个图书馆', accent: '#8B5CF6' },
] as const;

export type AvatarId = (typeof AVATARS)[number]['id'];

const ICONS = { keyboard: Keyboard, coffee: Coffee, backpack: Backpack };

// 宇航员半身像头像：写实头盔 + 肩甲 + 背包，右下角挂职业道具徽标
export default function PlayerAvatar({
  avatarId,
  size = 44,
}: {
  avatarId: string;
  size?: number;
}) {
  const meta = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];
  const Icon = ICONS[meta.id as AvatarId] ?? Keyboard;

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-xl border border-glass"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(160deg, ${meta.accent}2E, #0C1120 74%)`,
        boxShadow: `0 0 ${size / 3}px ${meta.accent}44`,
      }}
      title={meta.name}
    >
      {/* 舱内背光 */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 116%, ${meta.accent}55, transparent 62%)`,
        }}
      />
      {/* 宇航员半身像（玩家专属形象） */}
      <AstronautFigure pose="bust" accent={meta.accent} fit="slice" />
      {/* 职业道具徽标 */}
      <div
        className="absolute bottom-0 right-0 rounded-md p-0.5"
        style={{ background: '#0C1120CC', color: meta.accent }}
      >
        <Icon size={Math.max(12, size * 0.36)} strokeWidth={2.2} />
      </div>
    </div>
  );
}
