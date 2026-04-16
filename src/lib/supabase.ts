import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    console.warn('Supabase URL or Anon Key is missing. Real-time 또는 DB 기능이 동작하지 않습니다.');
  }
}

// URL이 유효하지 않으면 대략적인 가짜 주소라도 넣어 크래시를 방지하거나,
// 실제 사용 시에만 에러를 던지도록 안전하게 초기화
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
