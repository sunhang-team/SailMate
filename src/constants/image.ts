/**
 * 카카오 기본 프로필 이미지
 * - 프로필 이미지가 없거나 로드 실패 시 사용
 */
export const DEFAULT_PROFILE_IMAGE =
  'https://img1.kakaocdn.net/thumb/R640x640.q70/?fname=https://t1.kakaocdn.net/account_images/default_profile.jpeg';

/**
 * 백엔드 이미지 베이스 URL
 */
const BACKEND_IMG_BASE = 'https://chukjibeob.store';

/**
 * 이미지 URL 정규화
 * - 상대 경로(/images/...)로 오는 경우 백엔드 도메인을 붙여줌
 * - 이미 절대 경로인 경우 그대로 반환
 */
export const normalizeImageUrl = (url: string | null | undefined): string => {
  if (!url) return DEFAULT_PROFILE_IMAGE;
  if (url.startsWith('/')) return `${BACKEND_IMG_BASE}${url}`;
  return url;
};
