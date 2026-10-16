import { useEffect, useRef } from 'react';
import { cloudEnabled, supabase } from '../lib/supabase';
import { useGameStore } from '../store/useGameStore';

let pushTimer = 0;

// 云同步钩子（挂载于 App）：
// - 登录后每次游戏状态变更自动上云（1.2s 防抖合并连续变更）
// - 仅在用户「主动登录」事件时拉取云端存档覆盖本地（会话自动恢复不拉取，避免覆盖新进度）
export default function useCloudSync() {
  const uidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!cloudEnabled || !supabase) return;
    const store = useGameStore;

    const push = () => {
      const uid = uidRef.current;
      if (!uid) return;
      window.clearTimeout(pushTimer);
      pushTimer = window.setTimeout(async () => {
        const sb = supabase;
        const player = store.getState().player;
        if (!sb || !player) return;
        try {
          const { error } = await sb
            .from('saves')
            .upsert({ user_id: uid, state: { player }, updated_at: new Date().toISOString() });
          if (error) console.warn('[cloud] 同步失败:', error.message);
        } catch {
          /* 离线等异常静默忽略 */
        }
      }, 1200);
    };

    let prevJson = JSON.stringify(store.getState().player ?? null);
    const unsubStore = store.subscribe((s) => {
      const json = JSON.stringify(s.player ?? null);
      if (json !== prevJson) {
        prevJson = json;
        push();
      }
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      uidRef.current = session?.user?.id ?? null;
      if (event === 'SIGNED_IN' && session?.user) {
        void (async () => {
          try {
            const { data: row } = await supabase!
              .from('saves')
              .select('state')
              .eq('user_id', session.user.id)
              .maybeSingle();
            if (row?.state?.player) {
              store.getState().importCloudState(row.state.player);
            } else {
              push(); // 云端无存档：把本地进度推上去
            }
          } catch {
            console.warn('[cloud] 拉取存档失败');
          }
        })();
      }
    });

    return () => {
      unsubStore();
      data.subscription.unsubscribe();
      window.clearTimeout(pushTimer);
    };
  }, []);
}
