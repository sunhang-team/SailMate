import type { GatheringDetail } from '@/api/gatherings/types';

export const SITE_NAME = '완성도';
export const SITE_NAME_EN = 'Completion Island';
export const SITE_TITLE_DEFAULT = '완성도 — 함께 완주하는 스터디·프로젝트 모임';
export const SITE_DESCRIPTION =
  '스터디·사이드프로젝트 모임 플랫폼 완성도. 관심사 맞는 팀원을 만나 주차별 목표를 세우고 달성률을 추적하며 끝까지 함께 완주하세요.';
export const SITE_KEYWORDS = [
  '완성도',
  '스터디 모집',
  '사이드프로젝트',
  '프로젝트 팀원',
  '온라인 스터디',
  '모임 플랫폼',
  '주차별 목표',
  '달성률',
  '스터디 만들기',
  '팀원 찾기',
];
export const SITE_LOCALE = 'ko_KR';
export const SITE_LOGO_PATH = '/images/logo.svg';

/**
 * OG 이미지 다중 선언.
 * - 1200×630: Facebook/Slack/Discord/Twitter 표준
 * - 800×400: KakaoTalk 권장 2:1 비율
 * 크롤러는 dimension 메타를 보고 자신에게 적합한 것을 선택한다.
 */
export const OG_IMAGES = [
  { url: '/og/og-default.png', width: 1200, height: 630, alt: SITE_NAME },
  { url: '/og/og-kakao.png', width: 800, height: 400, alt: SITE_NAME },
] as const;

/** Twitter Card는 단일 이미지만 지원 → 1200×630 기본을 사용. */
export const TWITTER_IMAGE_PATH = '/og/og-default.png';

/**
 * 기본 openGraph 객체. Next.js Metadata API는 openGraph를 객체 단위로 통째
 * 교체하므로(shallow merge가 아님), 페이지별로 openGraph를 override할 때
 * 반드시 이 헬퍼를 spread해서 누락된 필드를 채워야 한다.
 * 함수로 둔 이유: 호출마다 새 객체를 반환해 mutable share를 피하기 위함.
 */
export const getDefaultOpenGraph = () => ({
  type: 'website' as const,
  locale: SITE_LOCALE,
  siteName: SITE_NAME,
  title: SITE_TITLE_DEFAULT,
  description: SITE_DESCRIPTION,
  images: OG_IMAGES.map((img) => ({ ...img })),
});

export const getSiteUrl = (): string => {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;
  return 'http://localhost:3000';
};

export const buildOrganizationJsonLd = (): Record<string, unknown> => {
  const baseUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: baseUrl,
    logo: `${baseUrl}${SITE_LOGO_PATH}`,
  };
};

export const buildWebSiteJsonLd = (): Record<string, unknown> => {
  const baseUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: baseUrl,
    inLanguage: 'ko-KR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/gatherings?query={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

const truncate = (input: string, max: number): string => {
  if (input.length <= max) return input;
  return `${input.slice(0, max - 1)}…`;
};

const resolveImageUrl = (raw: string | undefined): string | undefined => {
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${getSiteUrl()}${raw.startsWith('/') ? '' : '/'}${raw}`;
};

export const buildGatheringEventJsonLd = (gathering: GatheringDetail): Record<string, unknown> => {
  const baseUrl = getSiteUrl();
  const description = truncate(gathering.shortDescription || gathering.description || SITE_DESCRIPTION, 300);
  const heroImage = resolveImageUrl(gathering.images?.[0]?.url);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: gathering.title,
    description,
    startDate: gathering.startDate,
    endDate: gathering.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    url: `${baseUrl}/gatherings/${gathering.id}`,
    organizer: {
      '@type': 'Person',
      name: gathering.leader.nickname,
    },
    location: {
      '@type': 'VirtualLocation',
      url: `${baseUrl}/gatherings/${gathering.id}`,
    },
  };

  if (heroImage) data.image = [heroImage];
  return data;
};
