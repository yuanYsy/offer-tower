import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Supabase 云同步客户端：通过 .env 配置，未配置时云同步静默禁用（不影响游戏本体）
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const cloudEnabled = !!(url && anonKey);

export const supabase: SupabaseClient | null = cloudEnabled
  ? createClient(url!, anonKey!)
  : null;
