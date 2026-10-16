// 未来办公场景背景：天花板灯带 → 侧舱壁（带全息屏）→ 后墙拱形舷窗（窗外星域）
// → 地面倒影 → 三组工位 → 前景椅背剪影
// 纯静态 SVG（仅 3 处低频 CSS 呼吸动画），铺满视口做 slice 裁切
import HoloPlanet from './HoloPlanet';
import useIsMobile from '../hooks/useIsMobile';

export default function OfficeScene() {
  const isMobile = useIsMobile();
  // 三组工位横向布局
  const DESKS = [
    { x: 90, w: 400 },
    { x: 520, w: 400 },
    { x: 950, w: 400 },
  ];

  // 拱形舷窗轮廓（供 clipPath 复用）
  const WIN_PATH = 'M380,560 V300 C380,198 470,176 720,176 C970,176 1060,198 1060,300 V560 Z';

  return (
    <svg
      className="pointer-events-none fixed inset-0 -z-[3] h-screen w-screen"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        {/* 天花板 */}
        <linearGradient id="ceiling" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#02070C" />
          <stop offset="100%" stopColor="#071B2B" />
        </linearGradient>
        {/* 后舱壁 */}
        <linearGradient id="wallBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#04101D" />
          <stop offset="55%" stopColor="#071B2C" />
          <stop offset="100%" stopColor="#030A13" />
        </linearGradient>
        {/* 左右舱壁（靠内侧更亮：受舷窗光照射） */}
        <linearGradient id="wallL" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#041019" />
          <stop offset="100%" stopColor="#0A2136" />
        </linearGradient>
        <linearGradient id="wallR" x1="1" y1="0" x2="0" y2="0.3">
          <stop offset="0%" stopColor="#041019" />
          <stop offset="100%" stopColor="#0A2136" />
        </linearGradient>
        {/* 深空 */}
        <linearGradient id="space" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#01060E" />
          <stop offset="52%" stopColor="#04121F" />
          <stop offset="100%" stopColor="#02090F" />
        </linearGradient>
        <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2E7FB8" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#1B4F86" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#0A1F3A" stopOpacity="0" />
        </radialGradient>
        {/* 舷窗玻璃（半透明，压暗窗内星域） */}
        <linearGradient id="winGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#04101F" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#061A2C" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#04101F" stopOpacity="0.45" />
        </linearGradient>
        {/* 桌面 / 地面 */}
        <linearGradient id="deskTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14415E" />
          <stop offset="100%" stopColor="#0A2136" />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#081E31" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#02070D" />
        </linearGradient>
        {/* 舷窗在地面的倒影 */}
        <linearGradient id="floorReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4FE3FF" stopOpacity="0.17" />
          <stop offset="100%" stopColor="#4FE3FF" stopOpacity="0" />
        </linearGradient>
        {/* 屏幕光 / 灯带 */}
        <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4FE3FF" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#22D3EE" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0B2E45" stopOpacity="0.34" />
        </linearGradient>
        <linearGradient id="strip" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4FE3FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#CFF6FF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#4FE3FF" stopOpacity="0" />
        </linearGradient>
        {/* 整体雾化 / 暗角（中段压暗，保证前景文字可读） */}
        <radialGradient id="haze" cx="50%" cy="54%" r="74%">
          <stop offset="0%" stopColor="#0A1F33" stopOpacity="0" />
          <stop offset="62%" stopColor="#040A14" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#02060C" stopOpacity="0.86" />
        </radialGradient>
        <radialGradient id="voidGlow" cx="50%" cy="56%" r="58%">
          <stop offset="0%" stopColor="#0E4A6E" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#04101C" stopOpacity="0" />
        </radialGradient>
        {/* 拱形舷窗裁剪 */}
        <clipPath id="winClip">
          <path d={WIN_PATH} />
        </clipPath>
        <filter id="softGlow" x="-40%" y="-60%" width="180%" height="260%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* ===== 1. 天花板 ===== */}
      <rect x="0" y="0" width="1440" height="152" fill="url(#ceiling)" />
      <g className="scene-pulse">
        <rect x="230" y="36" width="420" height="7" rx="3.5" fill="url(#strip)" filter="url(#softGlow)" />
        <rect x="790" y="36" width="420" height="7" rx="3.5" fill="url(#strip)" filter="url(#softGlow)" />
      </g>
      <rect x="330" y="57" width="240" height="3" rx="1.5" fill="url(#strip)" opacity="0.5" />
      <rect x="870" y="57" width="240" height="3" rx="1.5" fill="url(#strip)" opacity="0.5" />
      {/* 筒灯 */}
      <g fill="#4FE3FF" opacity="0.15">
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={150 + i * 190} y="94" width="34" height="5" rx="2.5" />
        ))}
      </g>
      {/* 顶部结构梁 */}
      <rect x="0" y="120" width="1440" height="12" fill="#04121E" />
      <rect x="0" y="120" width="1440" height="1.6" fill="#4FE3FF" opacity="0.22" />

      {/* ===== 2. 后舱壁 ===== */}
      <rect x="240" y="150" width="960" height="490" fill="url(#wallBack)" />
      {/* 墙板分缝（只画在舷窗两侧，避免整屏网格感） */}
      {[210, 285, 355, 425, 495, 565, 620].map((y) => (
        <g key={y} fill="#4FE3FF" opacity="0.07">
          <rect x="240" y={y} width="132" height="1.6" />
          <rect x="1068" y={y} width="132" height="1.6" />
        </g>
      ))}
      <g fill="#4FE3FF" opacity="0.08">
        <rect x="300" y="150" width="1.6" height="490" />
        <rect x="1138" y="150" width="1.6" height="490" />
      </g>
      {/* 墙侧竖向灯板 */}
      <g className="scene-pulse">
        <rect x="256" y="246" width="13" height="96" rx="6.5" fill="url(#strip)" />
        <rect x="1171" y="246" width="13" height="96" rx="6.5" fill="url(#strip)" />
      </g>

      {/* ===== 3. 拱形舷窗（窗外星域） ===== */}
      <g clipPath="url(#winClip)">
        <rect x="370" y="170" width="700" height="400" fill="url(#space)" />
        <ellipse cx="470" cy="252" rx="240" ry="158" fill="url(#nebula)" />
        {/* 极光带 */}
        <ellipse cx="840" cy="446" rx="300" ry="66" fill="url(#nebula)" opacity="0.75" />
        {/* 主星球：珍珠玻璃球体 + 多层环绕光带 + 顶部耀斑 */}
        <HoloPlanet x={695} y={140} size={390} hue="#9FE8FF" rings={4} live={!isMobile} flare={!isMobile} />
        {/* 星尘（极慢漂移） */}
        <g className="scene-drift" fill="#CFEFFF">
          {Array.from({ length: 46 }).map((_, i) => {
            const x = 384 + ((i * 137) % 688);
            const y = 184 + ((i * 83) % 362);
            const r = i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.7 : 1.15;
            return <circle key={i} cx={x} cy={y} r={r} opacity={0.3 + (i % 4) * 0.16} />;
          })}
        </g>
        {/* 远处轨道环站 */}
        <ellipse cx="520" cy="474" rx="164" ry="15" fill="none" stroke="#4FE3FF" strokeOpacity="0.3" strokeWidth="1.8" />
        {/* 扫描光束 */}
        <rect x="370" y="252" width="700" height="1.6" fill="#CFF6FF" opacity="0.16" className="scene-pulse" />
        {/* 玻璃压暗层 */}
        <path d={WIN_PATH} fill="url(#winGlass)" />
      </g>
      {/* 舷窗框：外框 + 横梃 + 三根竖梃 + 窗台 */}
      <g>
        <path d={WIN_PATH} fill="none" stroke="#0B2C44" strokeWidth="17" />
        <path d={WIN_PATH} fill="none" stroke="#4FE3FF" strokeOpacity="0.42" strokeWidth="2" />
        <rect x="380" y="242" width="680" height="13" fill="#0A2438" />
        <rect x="380" y="242" width="680" height="2.6" fill="#4FE3FF" opacity="0.5" />
        {[550, 720].map((x) => (
          <g key={x}>
            <rect x={x - 8} y="250" width="16" height="312" fill="#0A2438" />
            <rect x={x - 8} y="250" width="2.4" height="312" fill="#4FE3FF" opacity="0.36" />
          </g>
        ))}
        <rect x="366" y="556" width="708" height="18" rx="5" fill="#0A2438" />
        <rect x="366" y="556" width="708" height="2.6" fill="#4FE3FF" opacity="0.55" />
      </g>

      {/* ===== 4. 左右舱壁（透视收进） ===== */}
      <polygon points="0,0 240,150 240,640 0,700" fill="url(#wallL)" />
      <polygon points="1440,0 1200,150 1200,640 1440,700" fill="url(#wallR)" />
      {/* 舱壁板缝（沿透视方向） */}
      <g stroke="#4FE3FF" strokeOpacity="0.09" strokeWidth="1.6" fill="none">
        <line x1="79" y1="50" x2="79" y2="680" />
        <line x1="158" y1="99" x2="158" y2="660" />
        <line x1="1361" y1="50" x2="1361" y2="680" />
        <line x1="1282" y1="99" x2="1282" y2="660" />
      </g>
      {/* 灯槽（顶/地两侧） */}
      <g fill="none" strokeWidth="2.4">
        <polyline points="0,8 240,158" stroke="#4FE3FF" strokeOpacity="0.3" />
        <polyline points="1440,8 1200,158" stroke="#4FE3FF" strokeOpacity="0.3" />
        <polyline points="0,690 240,634" stroke="#4FE3FF" strokeOpacity="0.2" />
        <polyline points="1440,690 1200,634" stroke="#4FE3FF" strokeOpacity="0.2" />
      </g>
      {/* 舱壁悬浮全息屏（透视微旋） */}
      {[
        { x: 152, y: 296, r: 11 },
        { x: 1200, y: 296, r: -11 },
      ].map((s) => (
        <g key={s.x} transform={`rotate(${s.r} ${s.x + 44} ${s.y + 84})`}>
          <rect
            x={s.x}
            y={s.y}
            width="88"
            height="168"
            rx="4"
            fill="#062033"
            fillOpacity="0.78"
            stroke="#4FE3FF"
            strokeOpacity="0.4"
          />
          <rect x={s.x} y={s.y} width="88" height="3" fill="#4FE3FF" opacity="0.55" />
          <g fill="#BFF4FF" opacity="0.4">
            {Array.from({ length: 6 }).map((_, j) => (
              <rect
                key={j}
                x={s.x + 10}
                y={s.y + 22 + j * 21}
                width={68 * (0.34 + ((j * 41) % 58) / 100)}
                height="3.4"
              />
            ))}
          </g>
        </g>
      ))}
      {/* 呼吸指示灯 */}
      <g fill="#4FE3FF">
        <circle cx="112" cy="196" r="3.2" className="scene-pulse" />
        <circle cx="1328" cy="196" r="3.2" className="scene-pulse-slow" />
      </g>

      {/* ===== 5. 地面 ===== */}
      <rect x="0" y="640" width="1440" height="260" fill="url(#floor)" />
      {/* 舷窗在地面的倒影 */}
      <polygon points="380,640 1060,640 1200,862 240,862" fill="url(#floorReflect)" />
      {/* 放射状地板拼缝（非网格，读作甲板反光） */}
      <g stroke="#4FE3FF" opacity="0.07">
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={i} x1="720" y1="640" x2={-560 + i * 200} y2="900" />
        ))}
      </g>
      <g stroke="#4FE3FF" opacity="0.05">
        <line x1="0" y1="712" x2="1440" y2="712" />
        <line x1="0" y1="800" x2="1440" y2="800" />
      </g>
      <rect x="0" y="628" width="1440" height="120" fill="url(#voidGlow)" />

      {/* ===== 6. 舱内绿植（办公室属性） ===== */}
      {[152, 1288].map((x, i) => (
        <g key={x} fill="#2A6B5E" opacity={i ? 0.3 : 0.34}>
          <polygon points={`${x - 21},660 ${x + 21},660 ${x + 15},694 ${x - 15},694`} fill="#0B2334" />
          {[-26, -12, 0, 12, 26].map((a, j) => (
            <ellipse
              key={j}
              cx={x + a}
              cy={628 - Math.abs(a) * 0.5}
              rx="9"
              ry="26"
              transform={`rotate(${a * 1.5} ${x + a} ${640 - Math.abs(a) * 0.5})`}
            />
          ))}
        </g>
      ))}

      {/* ===== 7. 三组工位 ===== */}
      {DESKS.map((d, i) => {
        const cx = d.x + d.w / 2;
        return (
          <g key={i}>
            {/* 显示器 */}
            <rect x={cx - 110} y="558" width="220" height="110" rx="6" fill="#06141F" stroke="#4FE3FF" strokeOpacity="0.42" />
            <rect x={cx - 102} y="566" width="204" height="94" rx="3" fill="url(#screen)" className="scene-pulse" />
            {/* 屏内代码行 */}
            <g fill="#DDF7FF" opacity="0.45">
              {Array.from({ length: 5 }).map((_, j) => (
                <rect key={j} x={cx - 92} y={578 + j * 17} width={52 + ((j * 53) % 104)} height="3" />
              ))}
            </g>
            {/* 支架 / 底座 */}
            <rect x={cx - 5} y="666" width="10" height="26" fill="#0A2136" />
            <rect x={cx - 44} y="690" width="88" height="7" rx="3.5" fill="#0A2136" />
            {/* 键盘 */}
            <rect x={cx - 78} y="700" width="156" height="16" rx="4" fill="#0B1E30" stroke="#4FE3FF" strokeOpacity="0.28" />
            {/* 桌面 */}
            <rect x={d.x} y="716" width={d.w} height="18" rx="7" fill="url(#deskTop)" />
            <rect x={d.x} y="734" width={d.w} height="11" rx="3" fill="#05141F" />
            <rect x={d.x} y="730" width={d.w} height="2.4" fill="#4FE3FF" opacity="0.5" />
            {/* 桌腿 */}
            <rect x={d.x + 16} y="745" width="18" height="62" fill="#04121C" />
            <rect x={d.x + d.w - 34} y="745" width="18" height="62" fill="#04121C" />
            {/* 桌面反光 */}
            <rect x={d.x + 24} y="748" width={d.w - 48} height="14" fill="#4FE3FF" opacity="0.06" />
          </g>
        );
      })}

      {/* ===== 8. 前景椅背剪影 + 近景桌沿（纵深遮挡） ===== */}
      {[290, 720, 1150].map((cx) => (
        <g key={cx}>
          <rect
            x={cx - 76}
            y="772"
            width="152"
            height="92"
            rx="20"
            fill="#04101A"
            stroke="#4FE3FF"
            strokeOpacity="0.15"
          />
          <rect
            x={cx - 46}
            y="744"
            width="92"
            height="34"
            rx="14"
            fill="#04101A"
            stroke="#4FE3FF"
            strokeOpacity="0.11"
          />
        </g>
      ))}
      <rect x="0" y="858" width="1440" height="42" fill="#020A12" />
      <rect x="0" y="858" width="1440" height="1.8" fill="#4FE3FF" opacity="0.22" />

      {/* ===== 9. 整体雾化 / 暗角 ===== */}
      <rect x="0" y="0" width="1440" height="900" fill="url(#haze)" />
      <rect
        x="0"
        y="0"
        width="1440"
        height="900"
        fill="none"
        stroke="#4FE3FF"
        strokeOpacity="0.05"
        strokeWidth="2"
      />
    </svg>
  );
}
