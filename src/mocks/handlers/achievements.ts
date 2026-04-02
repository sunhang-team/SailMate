import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';

import type { GatheringAchievements, AchievementRanking } from '@/api/achievements/types';

const BASE = '/api/v1/gatherings/:gatheringId/achievements';

/** gatheringId=1: sunny (HP 73, 팀달성률 73.3%) */
const mockSunny: GatheringAchievements = {
  members: [
    {
      userId: 1,
      nickname: '김코딩',
      weeklyRates: [
        { week: 1, rate: 100.0 },
        { week: 2, rate: 80.0 },
        { week: 3, rate: 60.0 },
      ],
      overallRate: 80.0,
    },
    {
      userId: 2,
      nickname: '이개발',
      weeklyRates: [
        { week: 1, rate: 80.0 },
        { week: 2, rate: 60.0 },
        { week: 3, rate: 40.0 },
      ],
      overallRate: 60.0,
    },
    {
      userId: 3,
      nickname: '박디자인',
      weeklyRates: [
        { week: 1, rate: 60.0 },
        { week: 2, rate: 100.0 },
        { week: 3, rate: 80.0 },
      ],
      overallRate: 80.0,
    },
  ],
  teamWeeklyRates: [
    { week: 1, rate: 80.0 },
    { week: 2, rate: 80.0 },
    { week: 3, rate: 60.0 },
  ],
  teamOverallRate: 73.3,
};

/** gatheringId=2: cloudy (HP 50, 팀달성률 40%) */
const mockCloudy: GatheringAchievements = {
  members: [
    {
      userId: 1,
      nickname: '김코딩',
      weeklyRates: [
        { week: 1, rate: 80.0 },
        { week: 2, rate: 40.0 },
        { week: 3, rate: 30.0 },
      ],
      overallRate: 50.0,
    },
    {
      userId: 2,
      nickname: '이개발',
      weeklyRates: [
        { week: 1, rate: 60.0 },
        { week: 2, rate: 40.0 },
        { week: 3, rate: 30.0 },
      ],
      overallRate: 43.3,
    },
    {
      userId: 3,
      nickname: '박디자인',
      weeklyRates: [
        { week: 1, rate: 70.0 },
        { week: 2, rate: 50.0 },
        { week: 3, rate: 50.0 },
      ],
      overallRate: 56.7,
    },
  ],
  teamWeeklyRates: [
    { week: 1, rate: 70.0 },
    { week: 2, rate: 43.3 },
    { week: 3, rate: 36.7 },
  ],
  teamOverallRate: 40.0,
};

/** gatheringId=3: stormy (HP 25, 팀달성률 15%) */
const mockStormy: GatheringAchievements = {
  members: [
    {
      userId: 1,
      nickname: '김코딩',
      weeklyRates: [
        { week: 1, rate: 40.0 },
        { week: 2, rate: 20.0 },
        { week: 3, rate: 10.0 },
      ],
      overallRate: 23.3,
    },
    {
      userId: 2,
      nickname: '이개발',
      weeklyRates: [
        { week: 1, rate: 30.0 },
        { week: 2, rate: 20.0 },
        { week: 3, rate: 10.0 },
      ],
      overallRate: 20.0,
    },
    {
      userId: 3,
      nickname: '박디자인',
      weeklyRates: [
        { week: 1, rate: 40.0 },
        { week: 2, rate: 30.0 },
        { week: 3, rate: 20.0 },
      ],
      overallRate: 30.0,
    },
  ],
  teamWeeklyRates: [
    { week: 1, rate: 36.7 },
    { week: 2, rate: 23.3 },
    { week: 3, rate: 13.3 },
  ],
  teamOverallRate: 15.0,
};

const achievementsByGathering: Record<string, GatheringAchievements> = {
  '1': mockSunny,
  '2': mockCloudy,
  '3': mockStormy,
};

const mockRanking: AchievementRanking = {
  ranking: [
    {
      rank: 1,
      userId: 1,
      nickname: '김코딩',
      profileImage: 'https://picsum.photos/seed/user1/200',
      overallRate: 80.0,
    },
    {
      rank: 2,
      userId: 3,
      nickname: '박디자인',
      profileImage: 'https://picsum.photos/seed/user3/200',
      overallRate: 80.0,
    },
    {
      rank: 3,
      userId: 2,
      nickname: '이개발',
      profileImage: 'https://picsum.photos/seed/user2/200',
      overallRate: 60.0,
    },
  ],
};

const MOCK_DELAY = 300;

export const achievementsHandlers = [
  /** GET /api/v1/gatherings/:gatheringId/achievements — 모임 전체 달성률 현황 */
  http.get(BASE, async ({ params }) => {
    await delay(MOCK_DELAY);
    const id = params.gatheringId as string;
    const data = achievementsByGathering[id] ?? mockSunny;
    return HttpResponse.json(createApiResponse<GatheringAchievements>(data));
  }),

  /** GET /api/v1/gatherings/:gatheringId/achievements/ranking — 달성률 순위 */
  http.get(`${BASE}/ranking`, async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(createApiResponse<AchievementRanking>(mockRanking));
  }),
];
