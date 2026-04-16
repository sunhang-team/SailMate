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
const supabaseInstance: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// 기존 코드와의 호환성을 위해 supabase 변수 유지
export const supabase = supabaseInstance;

/**
 * Supabase 클라이언트가 올바르게 초기화되었는지 확인하고 인스턴스를 반환합니다.
 * 초기화되지 않은 경우 명시적인 에러를 발생시켜 런타임 에러를 방지합니다.
 */
export const ensureSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    throw new Error(
      'Supabase client is not initialized. Check your environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).',
    );
  }
  return supabaseInstance;
};
