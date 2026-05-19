// AnalyticsEventMap이 GA4 커스텀 이벤트의 단일 진실 원천이다.

export type AuthMethod = 'kakao' | 'google' | 'email';

/**
 * 모임 상세 페이지로 진입한 경로.
 * - search: 검색 결과에서 클릭
 * - recommendation: 메인 페이지 추천 섹션에서 클릭
 * - direct: URL 직접 입력 (외부 referrer / no referrer)
 * - profile: 마이페이지·다른 유저 프로필에서 진입
 * - shared_link: UTM 또는 source 쿼리가 붙은 공유 링크에서 진입
 *
 * 판정 규칙 (src/lib/analytics/gathering.ts `resolveGatheringEntrySource`):
 * 1. URL 쿼리 `?source=`가 'search' | 'recommendation' | 'profile' 중 하나면 그대로 사용
 * 2. 그 외 + `utm_*` 파라미터 존재 → 'shared_link'
 * 3. 둘 다 아님 → 'direct'
 *
 * 박는 지점 (?source=...):
 * - 검색 결과(Search/GatheringList) → ?source=search
 * - 메인 추천 섹션(Popular/Deadline/Latest) → ?source=recommendation
 * - 마이페이지 카드(LikedGathering, MyCreatedGathering) → ?source=profile
 */
export type GatheringEntrySource = 'search' | 'recommendation' | 'direct' | 'profile' | 'shared_link';

export interface AnalyticsEventMap {
  sign_up: { method: AuthMethod };
  login: { method: AuthMethod };
  search: { query: string; category?: string; result_count: number };
  view_gathering: { gathering_id: string; category: string; source: GatheringEntrySource };
  create_gathering_start: Record<string, never>;
  create_gathering_submit: { category: string; member_count: number };
  join_gathering: { gathering_id: string; category: string };
}

export interface UserProperties {
  signup_date?: string;
  auth_method?: AuthMethod;
}
