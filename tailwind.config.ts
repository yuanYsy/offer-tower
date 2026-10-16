import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          void: '#050A14',
          deep: '#050A14',
          base: '#0A1120',
          elevated: '#111A2E',
          glass: 'rgba(12,22,40,0.55)',
        },
        neon: {
          cyan: '#22D3EE',
          violet: '#8B5CF6',
          gold: '#FBBF24',
          rose: '#FB7185',
          emerald: '#34D399',
          magenta: '#FF2D6F',
        },
        txt: {
          primary: '#E8EDF7',
          secondary: '#94A3B8',
          muted: '#475569',
        },
      },
      borderColor: {
        glass: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        /* 标题：厚重方正 CJK（对齐参考图的全息标题字），拉丁回退到 Noto */
        display: [
          '"ZCOOL QingKe HuangYou"',
          '"Noto Sans SC"',
          '"HarmonyOS Sans SC"',
          'sans-serif',
        ],
        body: [
          'Inter',
          '"Noto Sans SC"',
          '"HarmonyOS Sans SC"',
          '-apple-system',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'monospace'],
        /* 科幻拉丁：EPISODE.01 式的宽字距标题行 */
        tech: ['Orbitron', '"Space Grotesk"', 'sans-serif'],
        /* HUD 读数 / 标签 */
        hud: ['Rajdhani', '"Space Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        btn: '12px',
      },
      boxShadow: {
        'neon-cyan': '0 0 24px rgba(34,211,238,0.4)',
        'neon-cyan-sm': '0 0 12px rgba(34,211,238,0.35)',
        'neon-violet': '0 0 24px rgba(139,92,246,0.4)',
        'neon-gold': '0 0 24px rgba(251,191,36,0.45)',
        'neon-rose': '0 0 24px rgba(251,113,133,0.4)',
        'neon-emerald': '0 0 24px rgba(52,211,153,0.4)',
      },
      maxWidth: {
        content: '960px',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(.16,1,.3,1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
