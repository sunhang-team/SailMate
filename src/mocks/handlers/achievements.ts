import { http, HttpResponse, delay } from 'msw';

import { createApiResponse } from '../utils';

import type { GatheringAchievements, AchievementRanking } from '@/api/achievements/types';

const BASE = '/api/v1/gatherings/:gatheringId/achievements';

const mockAchievements: GatheringAchievements = {
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

export const achievementsHandlers = [
  /** GET /api/v1/gatherings/:gatheringId/achievements — 모임 전체 달성률 현황 */
  http.get(BASE, async () => {
const MOCK_DELAY = 300;

export const achievementsHandlers = [
  /** GET /api/v1/gatherings/:gatheringId/achievements — 모임 전체 달성률 현황 */
  http.get(BASE, async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(createApiResponse<GatheringAchievements>(mockAchievements));
  }),

  /** GET /api/v1/gatherings/:gatheringId/achievements/ranking — 달성률 순위 */
  http.get(`${BASE}/ranking`, async () => {
    await delay(300);
    return HttpResponse.json(createApiResponse<AchievementRanking>(mockRanking));
  }),
];
