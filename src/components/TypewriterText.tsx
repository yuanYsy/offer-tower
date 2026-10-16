import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  speed?: number; // ms/字
  onComplete?: () => void;
  className?: string;
  start?: boolean; // 外部控制是否开始
}

// 打字机：逐字显示 / 可打断（skip）/ 闪烁光标 / 完成回调
export default function TypewriterText({
  text,
  speed = 35,
  onComplete,
  className = '',
  start = true,
}: Props) {
  const [len, setLen] = useState(0);
  const doneRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (timerRef.current) window.clearInterval(timerRef.current);
    setLen(text.length);
    onComplete?.();
  }, [text, onComplete]);

  useEffect(() => {
    doneRef.current = false;
    setLen(0);
    if (!start) return;
    timerRef.current = window.setInterval(() => {
      setLen((n) => Math.min(n + 1, text.length));
    }, speed);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [text, speed, start]);

  // 打字完成 → 清定时器并触发回调（在 effect 中做副作用，避免在 setState 更新器里触发）
  useEffect(() => {
    if (len < text.length || doneRef.current) return;
    doneRef.current = true;
    if (timerRef.current) window.clearInterval(timerRef.current);
    onComplete?.();
  }, [len, text, onComplete]);

  const done = len >= text.length;

  return (
    <span
      className={className}
      onClick={finish} // 点击可跳过打字过程
      role="text"
      aria-label={text}
    >
      {text.slice(0, len)}
      <span
        className={`ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-neon-cyan align-baseline ${
          done ? 'animate-pulse opacity-40' : 'animate-ping'
        }`}
        style={{ animationDuration: done ? '1.2s' : '0.7s' }}
      />
    </span>
  );
}
