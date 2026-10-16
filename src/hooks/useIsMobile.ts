import { useEffect, useState } from 'react';

const QUERY = '(max-width: 767px)';

// 移动端判定钩子：驱动全站的性能降级开关（粒子减量/静态星球/竖排图谱）
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const fn = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  return isMobile;
}
