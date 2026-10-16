import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

// WebAudio 合成音效（默认关闭，TopBar 可开启）
export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const enabled = useGameStore((s) => s.player?.soundOn ?? false);

  const ctx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const beep = useCallback(
    (freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.08, when = 0) => {
      if (!enabled) return;
      try {
        const ac = ctx();
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(gain, ac.currentTime + when);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + when + duration);
        osc.connect(g).connect(ac.destination);
        osc.start(ac.currentTime + when);
        osc.stop(ac.currentTime + when + duration);
      } catch {
        // 忽略音频上下文错误（如用户未交互前）
      }
    },
    [enabled, ctx],
  );

  const correct = useCallback(() => {
    beep(880, 0.12, 'sine', 0.09);
    beep(1320, 0.18, 'sine', 0.07, 0.09);
  }, [beep]);

  const wrong = useCallback(() => {
    beep(160, 0.35, 'sawtooth', 0.06);
    beep(110, 0.4, 'sine', 0.06, 0.05);
  }, [beep]);

  const chest = useCallback(() => {
    beep(520, 0.08, 'square', 0.05);
    beep(780, 0.08, 'square', 0.05, 0.07);
    beep(1560, 0.25, 'sine', 0.08, 0.15);
  }, [beep]);

  const click = useCallback(() => beep(660, 0.05, 'sine', 0.04), [beep]);

  // 皮鞋脚步声：低频短促敲击 + 轻噪声质感
  const step = useCallback(() => {
    beep(115, 0.07, 'triangle', 0.12);
    beep(75, 0.09, 'sine', 0.1, 0.015);
  }, [beep]);

  // 解锁/点亮新路径：上行琶音
  const unlock = useCallback(() => {
    beep(523, 0.15, 'sine', 0.07);
    beep(659, 0.15, 'sine', 0.07, 0.1);
    beep(784, 0.2, 'sine', 0.08, 0.2);
    beep(1047, 0.35, 'sine', 0.06, 0.3);
  }, [beep]);

  // 组件卸载时关闭上下文
  useEffect(
    () => () => {
      ctxRef.current?.close().catch(() => undefined);
    },
    [],
  );

  return { correct, wrong, chest, click, step, unlock, enabled };
}
