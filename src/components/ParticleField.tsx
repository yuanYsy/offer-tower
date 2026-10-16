import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  tw: number; // 闪烁相位
  drift: number; // 视差下沉速度
  hue: number;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  hue: number;
  alpha: number;
  tw: number; // 闪烁相位
}

interface RainCol {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  hue: number;
}

interface Stream {
  x: number;
  y: number;
  len: number;
  speed: number;
  hue: number;
  alpha: number;
}

const GLYPHS = '01アイウエオカキクケコサシスセソ<>{}[]();=+*/#';

// 全局动态背景：深空星场（底层）+ 代码雨 + 数据流 + 上浮霓虹粒子；移动端自动减量
export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let stars: Star[] = [];
    let particles: Particle[] = [];
    let rain: RainCol[] = [];
    let streams: Stream[] = [];

    const isMobile = () => window.innerWidth < 768;
    // 移动端：DPR 上限降到 1.5，画布填充像素减少 40%+
    const dpr = isMobile()
      ? Math.min(window.devicePixelRatio || 1, 1.5)
      : Math.min(window.devicePixelRatio || 1, 2);
    const FONT = 12 * dpr;
    // 移动端帧率上限 30fps：视觉几乎无差，渲染负载减半
    const FRAME_MS = isMobile() ? 33 : 0;
    let lastFrame = 0;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const mob = isMobile();

      // 星场：三层景深，越远越小越暗（移动端减量至约 1/4）
      const starCount = mob ? 60 : 220;
      stars = Array.from({ length: starCount }, () => {
        const depth = Math.random(); // 0 远 → 1 近
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: (0.25 + depth * 1.1) * dpr,
          alpha: 0.16 + depth * 0.6,
          tw: Math.random() * Math.PI * 2,
          drift: (0.02 + depth * 0.09) * dpr,
          hue: Math.random() < 0.72 ? 195 : Math.random() < 0.6 ? 262 : 45,
        };
      });

      // 上浮粒子（移动端减量至约 1/5）
      particles = Array.from({ length: mob ? 10 : 46 }, () => spawn(true));

      // 代码雨：移动端加大列距（列数约减 1/4）
      const colGap = (mob ? 34 : 26) * dpr;
      const cols = Math.floor(canvas.width / colGap);
      rain = Array.from({ length: cols }, (_, i) => ({
        x: i * colGap + colGap / 2,
        y: Math.random() * canvas.height,
        speed: (0.6 + Math.random() * 1.4) * dpr,
        chars: Array.from({ length: 14 }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]),
        hue: Math.random() < 0.75 ? 187 : 262,
      }));

      // 数据流
      streams = Array.from({ length: mob ? 1 : 5 }, () => spawnStream());
    };

    const spawn = (anywhere = false): Particle => ({
      x: Math.random() * canvas.width,
      y: anywhere ? Math.random() * canvas.height : canvas.height + 10 * dpr,
      r: (Math.random() * 1.5 + 0.4) * dpr,
      vy: -(Math.random() * 0.24 + 0.08) * dpr,
      vx: (Math.random() - 0.5) * 0.1 * dpr,
      hue: Math.random() < 0.7 ? 187 : 262,
      alpha: Math.random() * 0.45 + 0.14,
      tw: Math.random() * Math.PI * 2,
    });

    const spawnStream = (): Stream => ({
      x: -200 * dpr,
      y: Math.random() * canvas.height,
      len: 120 * dpr + Math.random() * 180 * dpr,
      speed: (2.5 + Math.random() * 3.5) * dpr,
      hue: Math.random() < 0.6 ? 187 : 262,
      alpha: 0.05 + Math.random() * 0.07,
    });

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      if (FRAME_MS && now - lastFrame < FRAME_MS) return;
      lastFrame = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = now / 1000;

      // ---- 深空星场（最底层） ----
      for (const s of stars) {
        s.y += s.drift;
        if (s.y > canvas.height + 4) {
          s.y = -4;
          s.x = Math.random() * canvas.width;
        }
        const flicker = 0.55 + 0.45 * Math.sin(t * 1.1 + s.tw);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 85%, ${s.hue === 45 ? 84 : 76}%, ${s.alpha * flicker})`;
        ctx.fill();
      }

      // ---- 代码雨（前景层，透明度压低） ----
      ctx.font = `${FONT}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      for (const col of rain) {
        col.y += col.speed;
        if (col.y - 14 * FONT > canvas.height) {
          col.y = -Math.random() * 10 * FONT;
          col.speed = (0.6 + Math.random() * 1.4) * dpr;
        }
        // 随机翻转字符
        if (Math.random() < 0.04)
          col.chars[Math.floor(Math.random() * col.chars.length)] =
            GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        for (let i = 0; i < col.chars.length; i++) {
          const cy = col.y - i * FONT * 1.15;
          if (cy < -FONT || cy > canvas.height + FONT) continue;
          const fade = 1 - i / col.chars.length;
          // 头部字符亮，尾部淡出
          const a = i === 0 ? 0.24 : 0.1 * fade;
          ctx.fillStyle = `hsla(${col.hue}, 90%, ${i === 0 ? 76 : 60}%, ${a})`;
          ctx.fillText(col.chars[i], col.x, cy);
        }
      }

      // ---- 横向数据流 ----
      for (let i = 0; i < streams.length; i++) {
        const s = streams[i];
        s.x += s.speed;
        if (s.x - s.len > canvas.width) streams[i] = spawnStream();
        const grad = ctx.createLinearGradient(s.x - s.len, s.y, s.x, s.y);
        grad.addColorStop(0, `hsla(${s.hue}, 90%, 65%, 0)`);
        grad.addColorStop(1, `hsla(${s.hue}, 90%, 70%, ${s.alpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2 * dpr;
        ctx.beginPath();
        ctx.moveTo(s.x - s.len, s.y);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }

      // ---- 上浮霓虹粒子 ----
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10 * dpr || p.x < -10 || p.x > canvas.width + 10) particles[i] = spawn();
        const flicker = 0.55 + 0.45 * Math.sin(t * 1.5 + p.tw);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha * flicker})`;
        // 移动端跳过逐粒子 shadowBlur 发光（最大帧耗来源）
        if (!FRAME_MS) {
          ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, 0.8)`;
          ctx.shadowBlur = 6 * dpr;
        }
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    resize();
    tick();
    window.addEventListener('resize', resize);
    // 页面隐藏时暂停整个渲染循环（省电 + 避免后台卡顿堆积）
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        lastFrame = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-[2]"
      aria-hidden
    />
  );
}
