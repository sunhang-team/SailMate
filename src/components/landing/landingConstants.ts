/** 랜딩 CTA·미리보기 이미지 경로 (한곳에서 관리) */
export const LANDING_LINKS = {
  start: '/main',
  browse: '/gatherings',
} as const;

const encodePublicImage = (dir: string, filename: string) => {
  return `/images/landing/${dir}/${encodeURIComponent(filename)}`;
};

export const LANDING_IMAGES = {
  heroImagePC: encodePublicImage('hero', 'hero-PC.png'),
  route1: encodePublicImage('Route', 'Route 1-PC.png'),
  route2: encodePublicImage('Route', 'Route 2-PC.png'),
  route3: encodePublicImage('Route', 'Route 3-PC.png'),
  route4: encodePublicImage('Route', 'Route 4-PC.png'),
  bottomImage: encodePublicImage('bottom', 'bottom-CTA-mobile.png'),
  featureTeam: '/icons/landing/team-building.svg',
  featureGoal: '/icons/landing/goal-management.svg',
  featureAchievement: '/icons/landing/achievement-tracking.svg',
  featureManners: '/icons/landing/collaboration-manners.svg',
} as const;

export interface LandingFeatureItem {
  featureLabel: string;
  title: string;
  description: string[];
  iconSrc: string;
}

export const LANDING_FEATURES: LandingFeatureItem[] = [
  {
    featureLabel: '팀 빌딩',
    title: '딱 맞는 멤버 찾기',
    description: ['딱 맞는 팀원을 찾아 시작하세요.'],
    iconSrc: LANDING_IMAGES.featureTeam,
  },
  {
    featureLabel: '목표 관리',
    title: '주차별 목표 설정',
    description: ['팀 목표와 할 일을 관리하세요.'],
    iconSrc: LANDING_IMAGES.featureGoal,
  },
  {
    featureLabel: '달성률 추적',
    title: '실시간 진행률 확인',
    description: ['달성률을 한눈에 파악하세요.'],
    iconSrc: LANDING_IMAGES.featureAchievement,
  },
  {
    featureLabel: '협업매너',
    title: '팀원 리뷰와 피드백',
    description: ['서로 리뷰를 남기며 성장하세요.'],
    iconSrc: LANDING_IMAGES.featureManners,
  },
];

export type RouteLabel = 'Route 1' | 'Route 2' | 'Route 3' | 'Route 4';

export interface LandingRouteStep {
  routeLabel: RouteLabel;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageSide: 'left' | 'right';
}

export const LANDING_ROUTE_STEPS: LandingRouteStep[] = [
  {
    routeLabel: 'Route 1',
    title: '나만의 모임을 시작하거나 참여해요',
    description: '내 관심사에 딱 맞는 주제의 스터디나 프로젝트를 만들거나 찾아 함께할 팀원들을 만날 수 있어요.',
    imageSrc: LANDING_IMAGES.route1,
    imageAlt: '모임 탐색 및 참여 화면 미리보기',
    imageSide: 'right',
  },
  {
    routeLabel: 'Route 2',
    title: '주차별 목표와 할 일을 세워요',
    description: '팀 공동의 목표를 세우고 매주 실천할 개인 할 일을 작성하며 우리만의 항로를 만들어요.',
    imageSrc: LANDING_IMAGES.route2,
    imageAlt: '주차별 목표 및 할 일 관리 화면 미리보기',
    imageSide: 'left',
  },
  {
    routeLabel: 'Route 3',
    title: '목표를 달성하면 완성도에 가까워져요',
    description: '목표 달성시 팀 달성률이 실시간으로 반영되며 완성도라는 섬에 점점 더 가까워져요.',
    imageSrc: LANDING_IMAGES.route3,
    imageAlt: '완성도 진행 화면 미리보기',
    imageSide: 'right',
  },
  {
    routeLabel: 'Route 4',
    title: '함께 목표를 완성하고 리뷰를 남겨요',
    description: '완성도에 도착한 후 팀원들과 상호 리뷰를 나누며 프로젝트를 완벽하게 마무리할 수 있어요.',
    imageSrc: LANDING_IMAGES.route4,
    imageAlt: '리뷰 작성 화면 미리보기',
    imageSide: 'left',
  },
];
