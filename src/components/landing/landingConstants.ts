/** 랜딩 CTA·미리보기 이미지 경로 (한곳에서 관리) */
export const LANDING_LINKS = {
  start: '/register',
  browse: '/gatherings',
} as const;

const encodePublicImage = (dir: string, filename: string) => {
  return `/images/landing/${dir}/${encodeURIComponent(filename)}`;
};

export const LANDING_IMAGES = {
  heroImageTablet: encodePublicImage('hero', 'hero-Tablet.png'),
  heroImageMobile: encodePublicImage('hero', 'hero-Mobile.png'),
  heroImagePC: encodePublicImage('hero', 'hero-PC.png'),
  route1: encodePublicImage('Route', 'Route 1-PC.png'),
  route2: encodePublicImage('Route', 'Route 2-PC.png'),
  route3: encodePublicImage('Route', 'Route 3-PC.png'),
  route4: encodePublicImage('Route', 'Route 4-PC.png'),
  route1Tablet: encodePublicImage('Route', 'Route 1-Tablet.png'),
  route2Tablet: encodePublicImage('Route', 'Route 2-Tablet.png'),
  route3Tablet: encodePublicImage('Route', 'Route 3-Tablet.png'),
  route4Tablet: encodePublicImage('Route', 'Route 4-Tablet.png'),
  route1Mobile: encodePublicImage('Route', 'Route 1-Mobile.png'),
  route2Mobile: encodePublicImage('Route', 'Route 2-Mobile.png'),
  route3Mobile: encodePublicImage('Route', 'Route 3-Mobile.png'),
  route4Mobile: encodePublicImage('Route', 'Route 4-Mobile.png'),
  bottomImagePC: encodePublicImage('bottom', 'bottom CTA-PC.png'),
  bottomImageTablet: encodePublicImage('bottom', 'bottom CTA.png'),
  bottomImageMobile: encodePublicImage('bottom', 'bottom CTA-Mobile.png'),
  featureTeam: encodePublicImage('featrue', 'feature-team.png'),
  featureGoal: encodePublicImage('featrue', 'feature-goal.png'),
  featureAchievement: encodePublicImage('featrue', 'feature-achievement.png'),
  featureManners: encodePublicImage('featrue', 'feature-manners.png'),
} as const;

export interface LandingFeatureItem {
  featureLabel: string;
  title: string;
  description: string[];
}

export const LANDING_FEATURES: LandingFeatureItem[] = [
  {
    featureLabel: '팀 빌딩',
    title: '딱 맞는 멤버 찾기',
    description: ['나에게 맞는 멤버와 함께 시작하세요.'],
  },
  {
    featureLabel: '목표 관리',
    title: '딱 맞는 멤버 찾기',
    description: ['나에게 맞는 멤버와 함께 시작하세요.'],
  },
  {
    featureLabel: '달성률 추적',
    title: '딱 맞는 멤버 찾기',
    description: ['나에게 맞는 멤버와 함께 시작하세요.'],
  },
  {
    featureLabel: '협업매너',
    title: '딱 맞는 멤버 찾기',
    description: ['나에게 맞는 멤버와 함께 시작하세요.'],
  },
];

export interface LandingRouteStep {
  routeLabel: string;
  title: string;
  description: string;
  imageSrcPC: string;
  imageSrcTablet: string;
  imageSrcMobile: string;
  imageAlt: string;
  imageSide: 'left' | 'right';
}

export const LANDING_ROUTE_STEPS: LandingRouteStep[] = [
  {
    routeLabel: 'Route 1',
    title: '나만의 모임을 시작하거나 참여해요',
    description: '내 관심사에 딱 맞는 주제의 스터디나 프로젝트를 만들거나 찾아 함께할 팀원들을 만날 수 있어요.',
    imageSrcPC: LANDING_IMAGES.route1,
    imageSrcTablet: LANDING_IMAGES.route1Tablet,
    imageSrcMobile: LANDING_IMAGES.route1Mobile,
    imageAlt: '모임 탐색 및 참여 화면 미리보기',
    imageSide: 'right',
  },
  {
    routeLabel: 'Route 2',
    title: '주차별 목표와 할 일을 세워요',
    description: '팀 공동의 목표를 세우고 매주 실천할 개인 할 일을 작성하며 우리만의 항로를 만들어요.',
    imageSrcPC: LANDING_IMAGES.route2,
    imageSrcTablet: LANDING_IMAGES.route2Tablet,
    imageSrcMobile: LANDING_IMAGES.route2Mobile,
    imageAlt: '주차별 목표 및 할 일 관리 화면 미리보기',
    imageSide: 'left',
  },
  {
    routeLabel: 'Route 3',
    title: '목표를 달성하면 완성도에 가까워져요',
    description: '목표 달성시 팀 달성률이 실시간으로 반영되며 완성도라는 섬에 점점 더 가까워져요.',
    imageSrcPC: LANDING_IMAGES.route3,
    imageSrcTablet: LANDING_IMAGES.route3Tablet,
    imageSrcMobile: LANDING_IMAGES.route3Mobile,
    imageAlt: '완성도 진행 화면 미리보기',
    imageSide: 'right',
  },
  {
    routeLabel: 'Route 4',
    title: '함께 목표를 완성하고 리뷰를 남겨요',
    description: '완성도에 도착한 후 팀원들과 상호 리뷰를 나누며 프로젝트를 완벽하게 마무리할 수 있어요.',
    imageSrcPC: LANDING_IMAGES.route4,
    imageSrcTablet: LANDING_IMAGES.route4Tablet,
    imageSrcMobile: LANDING_IMAGES.route4Mobile,
    imageAlt: '리뷰 작성 화면 미리보기',
    imageSide: 'left',
  },
];
