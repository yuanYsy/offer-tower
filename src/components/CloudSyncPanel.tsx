import { useEffect, useState } from 'react';
import { CloudUpload, LogIn, LogOut } from 'lucide-react';
import { cloudEnabled, supabase } from '../lib/supabase';

// 云同步面板：Supabase 登录 / 登出 + 云端存档说明（挂载于个人档案页）
export default function CloudSyncPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
    });
  }, []);

  if (!cloudEnabled || !supabase) {
    return (
      <div className="glass rounded-2xl border border-glass p-5 text-xs text-txt-secondary">
        <div className="flex items-center gap-2 text-sm font-bold text-txt-primary">
          <CloudUpload size={15} className="text-neon-cyan" /> 云同步 · 未启用
        </div>
        <p className="mt-2 leading-relaxed">
          在项目根目录 .env 中配置 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY
          （参考 .env.example），即可开启云端存档同步。
        </p>
      </div>
    );
  }

  const run = async (fn: () => Promise<string>) => {
    setBusy(true);
    setMsg(null);
    try {
      setMsg(await fn());
    } catch (e) {
      setMsg(e instanceof Error ? e.message : '操作失败');
    } finally {
      setBusy(false);
    }
  };

  const signIn = () =>
    run(async () => {
      const { error } = await supabase!.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw new Error(error.message);
      const { data } = await supabase!.auth.getSession();
      setUserEmail(data.session?.user?.email ?? null);
      return '登录成功，云端存档已同步到本地';
    });

  const signUp = () =>
    run(async () => {
      const { error } = await supabase!.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) throw new Error(error.message);
      const { data } = await supabase!.auth.getSession();
      setUserEmail(data.session?.user?.email ?? null);
      return '注册成功，本地进度已推送云端';
    });

  const signOut = () =>
    run(async () => {
      await supabase!.auth.signOut();
      setUserEmail(null);
      return '已退出登录（本地存档保留）';
    });

  const inputCls =
    'w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs text-txt-primary outline-none transition-colors placeholder:text-txt-muted focus:border-neon-cyan/50';

  return (
    <div className="glass rounded-2xl border border-glass p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-txt-primary">
        <CloudUpload size={15} className="text-neon-cyan" /> 云同步
        <span className="ml-auto truncate font-mono text-[10px] text-txt-muted">
          {userEmail ?? '未登录'}
        </span>
      </div>

      {userEmail ? (
        <button
          onClick={signOut}
          disabled={busy}
          className="mt-3 flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs text-txt-secondary transition-all hover:border-neon-rose/50 hover:text-neon-rose active:scale-95 disabled:opacity-50"
        >
          <LogOut size={13} /> 退出登录
        </button>
      ) : (
        <div className="mt-3 space-y-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            type="email"
            autoComplete="email"
            className={inputCls}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码（至少 6 位）"
            type="password"
            autoComplete="current-password"
            className={inputCls}
          />
          <div className="flex gap-2">
            <button
              onClick={signIn}
              disabled={busy || !email || password.length < 6}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-neon-cyan/50 bg-neon-cyan/10 px-4 py-2.5 text-xs font-semibold text-neon-cyan transition-all active:scale-95 disabled:opacity-40"
            >
              <LogIn size={13} /> 登录并拉取存档
            </button>
            <button
              onClick={signUp}
              disabled={busy || !email || password.length < 6}
              className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-xs text-txt-secondary transition-all active:scale-95 disabled:opacity-40"
            >
              注册新账号
            </button>
          </div>
        </div>
      )}

      {msg && <p className="mt-2 text-[11px] text-neon-cyan">{msg}</p>}
      <p className="mt-2.5 text-[11px] leading-relaxed text-txt-muted">
        登录后每次闯关进度自动同步到云端；换设备登录同一账号即可继续登塔。
      </p>
    </div>
  );
}
